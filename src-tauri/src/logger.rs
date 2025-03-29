use anyhow::{anyhow, Result};
use chrono::Local;
use tokio::sync::Mutex;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::fs as tokio_fs;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::Child;
use crate::util::pathbuf::PathBufToString;

pub struct ProcessLogger {
  process: Arc<Mutex<Child>>,
  path: PathBuf
}

impl ProcessLogger {
  pub fn new(child: Arc<Mutex<Child>>, path: PathBuf) -> Self {
    Self {
      process: child,
      path
    }
  }

  pub async fn spawn(&self) -> Result<()> {
    let path = self.path.to_string()?;
    let child = self.process.clone();

    if !Path::new(&path).is_dir() {
      fs::create_dir(&path)?;
    }

    let pid = child.lock()
      .await.id().unwrap_or_default();
    let log_path = format!("{}/latest.log", path);

    if let Ok(metadata) = fs::metadata(&log_path) {
      if let Ok(created) = metadata.created() {
        let timestamp = chrono::DateTime::<Local>::from(created)
          .format("%Y-%m-%d_%H-%M-%S")
          .to_string();

        let _ = fs::rename(&log_path, format!("{}/{}.log", path, timestamp));
      }
    }

    let stdout = child
      .lock()
      .await
      .stdout
      .take()
      .ok_or_else(|| anyhow!("failed to take stdout"))?;

    let mut reader = BufReader::new(tokio::io::BufReader::new(stdout)).lines();

    tokio::spawn(async move {
      let mut file = match tokio_fs::File::create(&log_path).await {
        Ok(f) => f,
        Err(e) => {
          log::error!("unable to initialize logger: {}", e);
          return;
        }
      };

      log::info!("logger initialized for process {} (log: {})", pid, log_path);

      let _ = file.write_all(b"riverfall.ru client logger\n")
        .await;

      while let Ok(Some(line)) = reader.next_line().await {
        let _ = file.write_all(format!("{}\n", line).as_bytes()).await;
      }

      let status = match child.lock().await.wait().await {
        Ok(s) => s,
        Err(e) => {
          log::error!("failed to wait process {}: {}", pid, e);
          return;
        }
      };

      let _ = file
        .write_all(
          format!("process {} exited with code: {:?}\n", pid, status.code()).as_bytes(),
        )
        .await;
    });

    Ok(())
  }
}