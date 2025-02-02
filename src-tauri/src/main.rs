#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager as _;

mod env;
mod unrar;
mod play;
mod util;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  if cfg!(debug_assertions) {
    dotenv::dotenv().ok();
    env_logger::init();
  }

  log::info!("riverfall.ru launcher {}, Tauri {}", env!("CARGO_PKG_VERSION"), tauri::VERSION);

  tauri::Builder::default()
    .plugin(tauri_plugin_drpc::init())
    .plugin(tauri_plugin_downloader::init())
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
      env::env,
      unrar::unrar,
      play::play,
      play::is_process_exist,
      play::close,
    ])
    .setup(|app|{
      let main_window = app
        .get_webview_window("main")
        .expect("no main window");

      let _ = main_window.set_shadow(true);

      Ok(())
    })
    .run(tauri::generate_context!())?;

  Ok(())
}
