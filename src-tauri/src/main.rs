#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod discord;
mod util;

fn main() -> anyhow::Result<()> {
  if cfg!(debug_assertions) {
    dotenv::dotenv().ok();
  }

  // Инициализируем систему логирования
  env_logger::init();

  // Запускаем Discord Rich Presence
  discord::run_rpc();

  log::info!("Starting Tauri {}", tauri::VERSION);

  tauri::Builder::default()
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![
      // Utils
      util::tauri::isDebug,
      // Discord Rich Presence
      discord::setDrpcEnabled,
      discord::isDrpcEnabled,
      discord::setDrpcActivity
    ])
    .setup(|app| {
      let main_window = app
        .get_webview_window("main")
        .ok_or_else(|| anyhow::anyhow!("Failed to get the tauri's main window"))?;

      match main_window.set_shadow(true) {
        Ok(_) => log::info!("Enabled shadow"),
        Err(_) => log::warn!("Unable to enable shadow on main window")
      };

      util::tauri::set_main_window(main_window);

      Ok(())
    })
    .run(tauri::generate_context!())?;

  Ok(())
}
