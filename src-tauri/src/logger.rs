use chrono::Local;
use std::fs;
use std::path::Path;
use tokio::fs as tokio_fs;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::Child;

pub(crate) fn spawn_logger(mut child: Child, path: String) -> anyhow::Result<()> {
  if !Path::new(&path).is_dir() {
    fs::create_dir(&path)?;
  }

  let pid = child.id().unwrap_or_default();
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
    .stdout
    .take()
    .ok_or_else(|| anyhow::anyhow!("failed to take stdout"))?;

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

    while let Ok(Some(line)) = reader.next_line().await {
      let _ = file.write_all(format!("{}\n", line).as_bytes()).await;
    }

    let status = match child.wait().await {
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
