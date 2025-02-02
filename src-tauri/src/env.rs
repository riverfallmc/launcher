#[tauri::command]
pub fn env(var: String) -> Result<String, String> {
  std::env::var(var)
    .map_err(|e| e.to_string())
}
