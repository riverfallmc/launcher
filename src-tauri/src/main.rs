#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod game;
mod logger;
mod tray;
mod utils;
mod watcher;

use tauri::Manager as _;
use tauri_plugin_deep_link::DeepLinkExt;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  if cfg!(debug_assertions) {
    env_logger::init();
  }

  log::info!(
    "riverfall.ru launcher {}, Tauri {}",
    env!("CARGO_PKG_VERSION"),
    tauri::VERSION
  );

  tauri::Builder::default()
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_websocket::init())
    .plugin(tauri_plugin_upload::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_drpc::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_single_instance::init(|app, _, _| {
      app.get_webview_window("main")
        .expect("no main window")
        .set_focus()
        .expect("unable focus window");
    }))
    .invoke_handler(tauri::generate_handler![
        utils::fs_exists,
        utils::fs_rm_dir,
        utils::fs_unzip,
        utils::env,
        game::game_play,
        game::process_exists,
        game::close
    ])
    .setup(|app| {
      app.deep_link()
        .register("riverfall")?;
      tray::setup_tray_icon(app)?;
      Ok(())
    })
    .run(tauri::generate_context!())?;

  Ok(())
}
