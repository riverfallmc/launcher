#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use discord::RpcActivity;
use tauri::Manager;

mod util;
mod discord;

fn main() -> anyhow::Result<()> {
  if cfg!(debug_assertions) {
    dotenv::dotenv().ok();
  }

  // Инициализируем систему логирования
  env_logger::init();

  // Запускаем Discord Rich Presence
  discord::run_rpc();

  discord::setDrpcActivity(RpcActivity {
    image: String::from("logo_main"),
    title: String::from("title"),
    subtitle: String::from("subtitle"),
    buttons: vec![],
  })?;

  log::info!("Running tauri");

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      // Utils
      util::tauri::openUrlInBrowser,
      util::tauri::isDebug,
      util::tauri::updateClipboard,
      // Discord Rich Presence
      discord::setDrpcEnabled,
      discord::isDrpcEnabled,
      discord::setDrpcActivity
    ])
    .setup(|app| {
      let main_window = app.get_window("main")
        .ok_or_else(|| anyhow::anyhow!("Failed to get the tauri's main window"))?;

      util::tauri::set_main_window(main_window);

      Ok(())
    })
    .run(tauri::generate_context!())?;

	Ok(())
}