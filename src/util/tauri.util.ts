import { invoke } from "@tauri-apps/api/core";
import { relaunch, exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { GameManager } from "./game.util";
import ErrorView from "@/page/error/error";

export interface GameProcess {
  /** PID */
  id: number,
  /** Название процесса (например javaw.exe) */
  name: string;
}

export class InvokeManager {
  // TODO @ Добавить эту команду в Tauri
  static async play(
    client: string,
    ip: string
  ): Promise<GameProcess> {
    return await invoke<GameProcess>("connect", { client, ip });
  }

  // TODO @ Добавить эту команду в Tauri
  static async isGameRunning(
    { id, name }: GameProcess
  ): Promise<boolean> {
    return await invoke<boolean>("is_process_run", { id, name });
  }

  // TODO @ Добавить эту команду в Tauri
  // Закрытие процесса по pid
  static async close(id: number) {
    return await invoke("close", { id });
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

  static showError(message: string) {
    console.error(message);

    ErrorView.setError(message);
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