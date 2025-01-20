import { invoke } from "@tauri-apps/api/core";
import { exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from '@tauri-apps/api/window';

export class Invoker {
  static async checkUpdates() {
    return await invoke("check_updates");
  }
}

export class AppManager {
  static window = getCurrentWindow();

  static async closeApp(code?: number) {
    return await exit(code);
  }

  static async minimize() {
    return await this.window.minimize();
  }

  static async minimizeToTray() {
    if (process.env.NODE_ENV)
      setTimeout(this.window.show, 1000);

    return await this.window.hide();
  }

  static authorization() {
    document.location = "/authorization";
  }

  static launcher() {
    document.location = "/launcher";
  }
}