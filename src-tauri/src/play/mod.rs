use std::process::Stdio;
use arguments::Arguments;
use clientinfo::get_client_info;
use java::Java;
use crate::util::{paths::LauncherPaths, tauri::AnyhowResult};

pub(crate) mod java;
pub(crate) mod arguments;
pub(crate) mod session_manager;
pub(crate) mod variables;
pub(crate) mod clientinfo;

#[tauri::command]
pub(crate) async fn play(
  id: String,
  ip: Option<String>
) -> AnyhowResult<()> {
  // Папка клиента
  let dir = LauncherPaths::get_client_path(id.clone())?;
  // Клиент
  let client = get_client_info(id)?;
  // VersionData
  let data = client.open_data(&dir)?;

  let java = Java::new()?;
  // Проверяем что на компе установлена нужная джава
  // Ибо мы ленивые бояре, которые не хотят ставить джаву вместе с клиентом
  java.min_version(client.min_java_version)?;

  // Готовый вариант аргументов для запуска процесса
  let arguments = arguments::generate(
    Arguments {ip},
    &dir,
    data,
    client
  ).await?;

  // Запускаем процесс
  let process = java.start()
    .args(arguments)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn();

  dbg!(process);

  Ok(())
}