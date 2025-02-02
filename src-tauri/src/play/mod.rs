use std::process::{Command, Stdio};
use anyhow::anyhow;
use arguments::Arguments;
use clientinfo::get_client_info;
use java::Java;
use serde::{Deserialize, Serialize};
use crate::util::{self, pathbuf::PathBufToString, process::ProcessTrait, tauri::AnyhowResult};

pub(crate) mod java;
pub(crate) mod arguments;
pub(crate) mod session_manager;
pub(crate) mod variables;
pub(crate) mod clientinfo;

#[derive(Deserialize, Serialize)]
pub struct ProcessInfo {
  pid: u32,
  path: String
}

#[tauri::command]
pub(crate) async fn play(
  username: String,
  jwt: String,
  path: String,
  ip: Option<String>
) -> AnyhowResult<ProcessInfo> {
  // Клиент
  let client = get_client_info(&path)?;
  // VersionData
  let data = client.open_data(&path)?;

  let java = Java::new()?;
  // Проверяем что на компе установлена нужная джава
  // Ибо мы ленивые бояре, которые не хотят ставить джаву вместе с клиентом
  java.min_version(client.min_java_version)?;

  // Готовый вариант аргументов для запуска процесса
  let arguments = arguments::generate(
    username,
    jwt,
    Arguments {ip},
    &path,
    data,
    client
  ).await?;

  log::info!("{:?}", arguments);

  // Запускаем процесс
  let mut child = java.start()
    .args(arguments)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .unwrap();

  if let Err(err) = child.read_stderr() {
    log::error!("Java exception error: {err:?}");

    child.read_stdout()?;

    return Err(util::tauri::TauriCommandError::Anyhow(err));
  }

  Ok(ProcessInfo {
    pid: child.id(),
    path: java.get_path().to_string()?
  })
}

#[tauri::command]
pub(crate) async fn is_process_exist(pid: u32) -> AnyhowResult<bool> {
  let output = if cfg!(target_os = "windows") {
    Command::new("tasklist").arg("/FI").arg(format!("PID eq {}", pid)).output()
  } else {
    Command::new("ps").arg("-p").arg(pid.to_string()).output()
  }.map_err(|e| anyhow!("{e}"))?;

  Ok(String::from_utf8_lossy(&output.stdout).contains(&pid.to_string()))
}

#[tauri::command]
pub(crate) async fn close(pid: u32) -> AnyhowResult<()> {
  let status = if cfg!(target_os = "windows") {
    Command::new("taskkill").args(["/PID", &pid.to_string(), "/F"]).status()
  } else {
    Command::new("kill").arg("-9").arg(pid.to_string()).status()
  }.map_err(|e| anyhow!("{e}"))?;

  if status.success() {
    Ok(())
  } else {
    Err(anyhow!("Failed to terminate process").into())
  }
}