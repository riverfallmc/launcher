use crate::util::tauri::AnyhowResult;
use std::env::var;
use anyhow::anyhow;

#[tauri::command]
pub fn env(variable: String) -> AnyhowResult<String> {
  Ok(var(variable)
    .map_err(|e| anyhow!(e))?)
}
