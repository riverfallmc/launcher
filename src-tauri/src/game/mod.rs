mod session;
mod details;

use std::path::Path;

use anyhow::anyhow;
use details::ClientDetails;
use mc_launcher::minecraft::{configuration::{MinecraftClient, MinecraftConfiguration as Configuration, WindowConfiguration}, launcher::MinecraftLauncher as Launcher};
use session::SessionService;
use tauri::{Emitter as _, WebviewWindow};
use crate::{util::tauri::TauriResult, utils::get_info, watcher::ProcessWatcher};

#[tauri::command]
pub async fn game_play(
  window: WebviewWindow,
  id: i32,
  username: String,
  jwt: String,
  client: String,
  client_path: String,
  ip: Option<String>
) -> TauriResult<()> {
  let details = ClientDetails::from(&client)
    .map_err(|e| anyhow!("Не получилось обнаружить данные о игровом клиенте: {e}"))?;

  let session = SessionService::authorizate(jwt, id, &username)
    .await
    .map_err(|e| anyhow!("Не получилось авторизоваться: {e}"))?;

  let config = Configuration {
    session,
    client: MinecraftClient {
      path: client_path.clone().into(),
      version: &details.versions.game,
      server: None
    },

    window: WindowConfiguration { ..Default::default() },
    java: None
  };

  let game = Launcher::new(config)
    .start()
    .map_err(|e| anyhow!("Не получилось запустить игру: {e}"))?;

  let mut watcher = ProcessWatcher::new(game);
  watcher.on_exit(move || {
    let _ = window.emit("close", ());
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
pub async fn process_exists(pid: i32, name: String) -> bool {
  todo!()
}

#[tauri::command]
pub async fn close(pid: i32) -> TauriResult<()> {
  todo!()
}