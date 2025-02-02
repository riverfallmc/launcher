import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { AppManager } from "./tauri.util";
import { WebUtil } from "./web.util";
import { openUrl } from '@tauri-apps/plugin-opener';

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

const options: TrayIconOptions = {
  menu,
  title: "Riverfall",
  tooltip: "Лаунчер Riverfall",
  // icon: "" // todo
};

await TrayIcon.new(options);