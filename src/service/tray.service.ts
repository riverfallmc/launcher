import { getWebsite } from "@/utils/url.util";
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { openUrl } from '@tauri-apps/plugin-opener';
import { GameService } from "./game/game.service";
import { exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from "@tauri-apps/api/window";

const window = getCurrentWindow();

let trayIcon: TrayIcon | null = null;

export async function configure() {
  const menu = await Menu.new({
    items: [
      {
        id: "website",
        text: "Открыть сайт",
        action: async () => await openUrl(getWebsite()),
      },
      {
        id: "open",
        text: "Показать",
        action: async () => {
          await window.show();
          await window.setFocus();
        },
      },
      {
        id: "quit",
        text: "Закрыть лаунчер",
        action: async () => {
          GameService.close().finally(exit);
        },
      }
    ]
  });

  try {
    const options: TrayIconOptions = {
      menu,
      title: "Riverfall",
      tooltip: "Лаунчер Riverfall",
      icon: "icons/icon.png"
    };

    if (trayIcon) {
      await trayIcon.close();
    }

    trayIcon = await TrayIcon.new(options);
  } catch (err) {
    console.error(err);
  }
}