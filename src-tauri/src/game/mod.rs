mod details;
mod session;

use std::path::Path;

use anyhow::anyhow;
use details::ClientDetails;
use mc_launcher::{java::Java, minecraft::{configuration::{MinecraftClient, MinecraftConfiguration as Configuration, WindowConfiguration}, launcher::MinecraftLauncher as Launcher}};
use session::SessionService;
use tauri::{Emitter as _, WebviewWindow};
use tokio::process::Command;
use crate::{utils::TauriResult, utils::get_info, watcher::ProcessWatcher};

#[tauri::command]
pub async fn game_play(
  window: WebviewWindow,
  id: i32,
  username: String,
  jwt: String,
  client: String,
  client_path: String,
  java_path: String,
  ip: Option<String>
) -> TauriResult<()> {
  let details = ClientDetails::from(&client_path)
    .map_err(|e| anyhow!("Не получилось обнаружить данные о игровом клиенте: {e}"))?;

  let session = SessionService::authorizate(jwt, id, &username)
    .await
    .map_err(|e| anyhow!("Не получилось авторизоваться: {e}"))?;

  let java =Java::new(java_path.into())
    .map_err(|_| anyhow!("Java не была найдена"))?;

  let config = Configuration {
    java: Some(java),
    session,
    client: MinecraftClient {
      path: client_path.clone().into(),
      version: details.versions.game,
      server: None
    },

    window: WindowConfiguration { ..Default::default() },
  };

  let game = Launcher::new(config)
    .start()
    .map_err(|e| anyhow!("Не получилось запустить игру: {e}"))?;

  let mut watcher = ProcessWatcher::new(game);
  watcher.on_exit(move || {
    let _ = window.emit("game_close", ());
  });

  let logs = Path::new(&client_path).join("logs");
  let os = get_info();
  let line = format!("Riverfall Launcher Log Format:[{};{};{};{};{}]\n\n", env!("CARGO_PKG_VERSION"), username, os.os, os.version, client);

  watcher.enable_logger(logs, line);
  watcher.spawn_thread()
    .await;

  Ok(())
}

#[tauri::command]
pub async fn process_exists(pid: i32) -> TauriResult<bool> {
  let output = if cfg!(target_os = "windows") {
    Command::new("tasklist")
      .arg("/FI")
      .arg(format!("PID eq {}", pid))
      .output()
  } else {
    Command::new("ps").arg("-p").arg(pid.to_string()).output()
  }.await.map_err(|e| anyhow!("{e}"))?;

  let out = String::from_utf8_lossy(&output.stdout);

  Ok(out.contains(&pid.to_string()) && !out.contains("defunct"))
}

#[tauri::command]
pub async fn close(pid: i32) -> TauriResult<()> {
  let status = if cfg!(target_os = "windows") {
    Command::new("taskkill")
        .args(["/PID", &pid.to_string(), "/F"])
        .status()
    } else {
        Command::new("kill").arg("-9").arg(pid.to_string()).status()
    }.await.map_err(|e| anyhow!("{e}"))?;

  if status.success() {
    Ok(())
  } else {
    Err(anyhow!("Failed to terminate process").into())
  }
}