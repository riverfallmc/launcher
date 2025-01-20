#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused_must_use)]

use anyhow::Context;
use tauri::Manager as _;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  if cfg!(debug_assertions) {
    dotenv::dotenv().ok();
    env_logger::init();
  }

  // Запускаем Discord RPC
  // discord::run_rpc();

  log::info!("Initializing Riverfall Launcher {}, Tauri {}", env!("CARGO_PKG_VERSION"), tauri::VERSION);

  tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, _, _| {
      app.get_webview_window("main")
        .expect("no main window")
        .set_focus();
    }))
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![])
    .setup(|app|{
      let main_window = app
        .get_webview_window("main")
        .context(anyhow::anyhow!("Failed to get the tauri's main window"))?;

      main_window.set_shadow(true);

      Ok(())
    })
    .run(tauri::generate_context!())?;

  Ok(())
}
