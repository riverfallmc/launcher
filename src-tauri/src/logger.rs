use crate::util::pathbuf::PathBufToString;
use anyhow::{anyhow, Result};
use chrono::Local;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::fs as tokio_fs;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::Child;
use tokio::sync::Mutex;

pub struct ProcessLogger {
    process: Arc<Mutex<Child>>,
    path: PathBuf,
    info_line: Option<String>
}

impl ProcessLogger {
    pub fn new(child: Arc<Mutex<Child>>, path: PathBuf) -> Self {
        Self {
            process: child,
            path,
            info_line: None
        }
    }

    pub fn info_line(&mut self, line: String) -> &mut Self {
        self.info_line = Some(line);
        self
    }

    pub async fn spawn(&self) -> Result<()> {
        let path = self.path.to_string()?;
        let child = self.process.clone();

        if !Path::new(&path).is_dir() {
            fs::create_dir(&path)?;
        }

        let pid = child.lock().await.id().unwrap_or_default();
        let log_path = format!("{}/latest.rflog", path);

        if let Ok(metadata) = fs::metadata(&log_path) {
            if let Ok(created) = metadata.created() {
                let timestamp = chrono::DateTime::<Local>::from(created)
                    .format("%Y-%m-%d_%H-%M-%S")
                    .to_string();

                let _ = fs::rename(&log_path, format!("{}/{}.rflog", path, timestamp));
            }
        }

        let stdout = child
            .lock()
            .await
            .stdout
            .take()
            .ok_or_else(|| anyhow!("failed to take stdout"))?;

        let stderr = child
            .lock()
            .await
            .stderr
            .take()
            .ok_or_else(|| anyhow!("failed to take stdout"))?;

        let mut reader = BufReader::new(tokio::io::BufReader::new(stdout)).lines();
        let mut reader_stderr = BufReader::new(tokio::io::BufReader::new(stderr)).lines();

        let info_line = self.info_line.clone();

        tokio::spawn(async move {
            let mut file = match tokio_fs::File::create(&log_path).await {
                Ok(f) => f,
                Err(e) => {
                    log::error!("unable to initialize logger: {}", e);
                    return;
                }
            };

            log::info!("logger initialized for process {} (log: {})", pid, log_path);

            if let Some(info) = info_line {
                let _ = file.write_all(info.as_bytes()).await;
            }

            loop {
                tokio::select! {
                  line = reader.next_line() => {
                    if let Ok(Some(line)) = line {
                      let _ = file.write_all(format!("[OUT] {}\n", line).as_bytes()).await;
                    }
                  }
                  line = reader_stderr.next_line() => {
                    if let Ok(Some(line)) = line {
                      let _ = file.write_all(format!("[ERR] {}\n", line).as_bytes()).await;
                    }
                  }
                }

                if reader.next_line().await.is_err() && reader_stderr.next_line().await.is_err() {
                    break;
                }
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
