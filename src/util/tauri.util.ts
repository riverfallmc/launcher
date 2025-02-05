import ErrorView from "@/page/error/error";
import { invoke } from "@tauri-apps/api/core";
import { relaunch, exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { notify } from "./notify.util";
import { openUrl } from "@tauri-apps/plugin-opener";
import { WebUtil } from "./web.util";
import { Server } from "./server.util";
import { ClientStorage } from "./client.util";
import { GameManager } from "./game.util";
import { formatError } from "./unsorted.util";

export interface ProcessInfo {
  pid: number,
  name: string;
}

export class InvokeManager {
  static async env(variable: string): Promise<string> {
    return invoke("env", { var: variable });
  }

  static async unrar(path: string, name: string): Promise<void> {
    return invoke("unrar", { path, name });
  }

  static async exists(path: string): Promise<boolean> {
    return invoke("exists", { path });
  }

  // process

  static async play(
    server: Server
  ): Promise<ProcessInfo> {
    const session = WebUtil.getSession();
    const user = WebUtil.getUser();

    return invoke("play", {
      username: user?.username,
      path: await ClientStorage.getClientPath(server.client),
      jwt: session?.jwt,
      ip: server.enabled ? server.ip : null
    });
  }

  static async isProcessExist({ pid, name }: { pid: number, name: string; }): Promise<boolean> {
    console.log(pid);
    return invoke("is_process_exist", { pid });
  }

  static async close(
    pid: number
  ) {
    return await invoke("close", { pid });
  }
}

export class AppManager {
  static window = getCurrentWindow();

  static async close(code?: number) {
    GameManager.close()
      .finally(async () => await exit(code));
  }

  static async restart() {
    await relaunch();
  }

  static async minimize() {
    return await this.window.minimize();
  }

  static async show() {
    await this.window.show();
    await this.window.setFocus();
  }

  static showError(message: any) {
    const formatted = formatError(message);

    console.error(formatted);
    ErrorView.setError(formatted);
  }

  static async openUrl(uri: string = "") {
    return await openUrl(WebUtil.getWebsiteUrl(uri));
  }

  static async minimizeToTray() {
    //if (process.env.NODE_ENV)
    //  setTimeout(this.window.show, 1000);
    notify("Лаунчер был свёрнут в трей");
    return await this.window.hide();
  }

  static authorization() {
    document.location = "/authorization";
  }

  static launcher() {
    document.location = "/launcher";
  }
}