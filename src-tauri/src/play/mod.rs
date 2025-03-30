use crate::{util::{pathbuf::PathBufToString, tauri::AnyhowResult}, watcher::ProcessWatcher};
use std::{path::Path, process::{Command, Stdio}};
use anyhow::anyhow;
use arguments::Arguments;
use clientinfo::get_client_info;
use java::Java;
use serde::{Deserialize, Serialize};
use tauri::{Emitter, WebviewWindow};

pub(crate) mod arguments;
pub(crate) mod clientinfo;
pub(crate) mod java;
pub(crate) mod session_manager;
pub(crate) mod variables;

#[derive(Deserialize, Serialize)]
pub struct ProcessInfo {
  pid: u32,
  path: String,
}

#[tauri::command]
pub(crate) async fn play(
  window: WebviewWindow,
  username: String,
  jwt: String,
  path: String,
  ip: Option<String>,
) -> AnyhowResult<ProcessInfo> {
  // Клиент
  let client = get_client_info(&path)?;
  // VersionData
  let data = client.open_data(&path)?;

  let java = Java::new().await?;
  // Проверяем что на компе установлена нужная джава
  // Ибо мы ленивые бояре, которые не хотят ставить джаву вместе с клиентом
  java.min_version(client.min_java_version).await?;

  // Готовый вариант аргументов для запуска процесса
  let arguments = arguments::generate(username, jwt, Arguments { ip }, &path, data, client).await?;

  println!("{arguments:?}");

  // Запускаем процесс
  let child = java
    .start()
    .args(arguments)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| anyhow!(e))?;

  let pid = child.id()
    .unwrap_or_default();

  // ебать я довольный
  // 1. оно работает
  // 2. оно красивое
  let mut wathcer = ProcessWatcher::new(child);

  wathcer.on_exit(move || {
    #[allow(unused)]
    window.emit("game_close", ()); // можно отправлять pid и прочую инфу, но зачем
  });

  let logs = Path::new(&path)
    .join("logs");

  if let Err(err) = wathcer.enable_logger(logs) {
    log::error!("Unable to setup logger: {err}");
  };

  wathcer.spawn_thread()
    .await;

  Ok(ProcessInfo {
    pid,
    path: java.get_path().to_string()?,
  })
}

#[tauri::command]
pub(crate) async fn is_process_exist(pid: u32) -> AnyhowResult<bool> {
  let output = if cfg!(target_os = "windows") {
    Command::new("tasklist")
      .arg("/FI")
      .arg(format!("PID eq {}", pid))
      .output()
  } else {
    Command::new("ps").arg("-p").arg(pid.to_string()).output()
  }.map_err(|e| anyhow!("{e}"))?;

  let out = String::from_utf8_lossy(&output.stdout);

  Ok(out.contains(&pid.to_string()) && !out.contains("defunct"))
}

#[tauri::command]
pub(crate) async fn close(pid: u32) -> AnyhowResult<()> {
  let status = if cfg!(target_os = "windows") {
    Command::new("taskkill")
      .args(["/PID", &pid.to_string(), "/F"])
      .status()
  } else {
    Command::new("kill").arg("-9").arg(pid.to_string()).status()
  }.map_err(|e| anyhow!("{e}"))?;

  if status.success() {
    Ok(())
  } else {
    Err(anyhow!("Failed to terminate process").into())
  }
}