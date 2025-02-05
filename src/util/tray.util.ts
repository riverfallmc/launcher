import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { AppManager } from "./tauri.util";
import { WebUtil } from "./web.util";
import { openUrl } from '@tauri-apps/plugin-opener';

export async function configureTray() {
  const menu = await Menu.new({
    items: [
      {
        id: "website",
        text: "Открыть сайт",
        action: async () => await openUrl(WebUtil.getWebsiteUrl()),
      },
      {
        id: "open",
        text: "Показать",
        action: async () => await AppManager.show(),
      },
      {
        id: "quit",
        text: "Выйти",
        action: async () => await AppManager.close(),
      }
    ]
  });

  try {
    const options: TrayIconOptions = {
      menu,
      title: "Riverfall",
      tooltip: "Лаунчер Riverfall",
      icon: "icons/icon.ico"
    };

    await TrayIcon.new(options);
  } catch (err) {
    AppManager.showError(err);
  }
}