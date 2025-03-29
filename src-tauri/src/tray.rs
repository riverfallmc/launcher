use std::process::exit;
use tauri::{menu::{Menu, MenuItem}, tray::{TrayIcon, TrayIconBuilder}, App, Manager, Result, Wry};
use tauri_plugin_opener::OpenerExt;
use crate::util::url::get_url;

fn build_menu(app: &App) -> Result<Menu<Wry>> {
  let website = MenuItem::with_id(app, "website", "Открыть сайт", true, None::<&str>)?;
  let show = MenuItem::with_id(app, "show", "Показать лаунчер", true, None::<&str>)?;
  let exit = MenuItem::with_id(app, "exit", "Закрыть лаунчер", true, None::<&str>)?;

  Menu::with_items(app, &[&website, &show, &exit])
}

pub(crate) fn setup_tray_icon(app: &App) -> Result<TrayIcon> {
  let menu = build_menu(app)?;

  TrayIconBuilder::new()
    .icon(app.default_window_icon().unwrap().clone())
    .menu(&menu)
    .on_menu_event(|app, event| match event.id.as_ref() {
      "website" => {
        #[allow(unused)]
        app.opener()
          .open_url(get_url(), None::<&str>);
      },

      "show" => {
        #[allow(unused)]
        app.get_webview_window("main")
          .expect("no main window")
          .show();
      },

      "exit" => {
        exit(0);
      }

      _ => {
        log::error!("Item {:?} not found", event.id);
      }
    })
    .build(app)
}