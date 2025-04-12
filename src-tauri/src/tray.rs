use crate::utils::AppUrls;
use tauri_plugin_opener::OpenerExt;
use std::process::exit;
use tauri::{
    menu::{Menu, MenuBuilder, MenuItemBuilder},
    tray::{TrayIcon, TrayIconBuilder},
    App, Manager, Result, Wry,
};

fn build_menu(app: &App) -> Result<Menu<Wry>> {
    MenuBuilder::new(app)
        .item(&MenuItemBuilder::new("Показать лаунчер").id("show").build(app)?)
        .separator()
        .item(&MenuItemBuilder::new("Открыть сайт").id("website").build(app)?)
        .item(&MenuItemBuilder::new("Открыть свой профиль").id("profile").build(app)?)
        .separator()
        .item(&MenuItemBuilder::new("Выйти из лаунчера").id("exit").build(app)?)
        .build()
}

pub(crate) fn setup_tray_icon(app: &App) -> Result<TrayIcon> {
    let menu = build_menu(app)?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "website" => {
                #[allow(unused)]
                app.opener().open_url(AppUrls::base(), None::<&str>);
            }

            "show" => {
                #[allow(unused)]
                app.get_webview_window("main")
                    .expect("no main window")
                    .show();
            }

            "profile" => {
                #[allow(unused)]
                app.opener().open_url(AppUrls::join("profile"), None::<&str>);
            }

            "exit" => {
                exit(0);
            }

            _ => {
                log::error!("Item {:?} not found", event.id);
            }
        })
        .build(app)
}
