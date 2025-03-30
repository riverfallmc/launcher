use crate::util::tauri::AnyhowResult;
use anyhow::anyhow;
use std::env::var;

#[tauri::command]
pub fn env(variable: String) -> AnyhowResult<String> {
    Ok(var(variable).map_err(|e| anyhow!(e))?)
}
