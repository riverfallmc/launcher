use std::path::Path;

#[tauri::command]
pub fn exists(path: String) -> bool {
  Path::new(&path).exists()
}
