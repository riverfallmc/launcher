import { Server } from "./server.util";
import { InvokeManager, ProcessInfo } from "./tauri.util";

export class GameManager {
  static game?: ProcessInfo;

  static async isGameRunning(): Promise<boolean> {
    if (!this.game)
      return false;

    return InvokeManager.isProcessExist(this.game);
  }

  static async play(server: Server) {
    if (await this.isGameRunning())
      throw new Error("Вы уже играете на нашем сервере!");

    this.game = await InvokeManager.play(server);
  }

  static async close() {
    if (!await this.isGameRunning())
      return;

    await InvokeManager.close(this.game!.pid);
  }
}