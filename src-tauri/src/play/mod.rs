use clientinfo::get_client_info;
use java::Java;
use crate::util::{paths::LauncherPaths, tauri::AnyhowResult};

pub(crate) mod java;
pub(crate) mod clientinfo;

#[tauri::command]
pub(crate) fn play(
  id: String,
  _ip: String
) -> AnyhowResult<()> {
  let dir = LauncherPaths::get_client_path(id.clone())?;

  let client_info = get_client_info(id)?;
  let jar = client_info.get_jar(&dir)?;
  let _data = client_info.open_data(&dir)?;

  dbg!(&client_info);
  dbg!(&jar);

  let java = Java::new()?;
  java.min_version(client_info.min_java_version)?;

  dbg!(java.get_path());

  Ok(())
}