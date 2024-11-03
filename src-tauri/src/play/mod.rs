use crate::util::tauri::AnyhowResult;

#[tauri::command]
pub(crate) fn play(
  id: String,
  ip: String
) -> AnyhowResult<()> {
  Ok(())
}