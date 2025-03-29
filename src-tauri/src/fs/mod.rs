use std::path::Path;

use anyhow::anyhow;
use tokio::fs;

use crate::util::tauri::AnyhowResult;

#[tauri::command]
pub fn exists(path: String) -> bool {
  Path::new(&path).exists()
}

#[tauri::command]
pub async fn remove_dir(path: String) -> AnyhowResult<()> {
  fs::remove_dir_all(path)
    .await
    .map_err(|e| anyhow!(e))?;

  Ok(())
}
