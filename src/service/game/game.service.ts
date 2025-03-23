import { isProcessExist, play, close, ProcessInfo } from "@/api/process.api";
import { Server } from "./server.service";

export class GameService {
  static game?: ProcessInfo;

  static async isGameRunning(): Promise<boolean> {
    if (!this.game)
      return false;

    return isProcessExist(this.game);
  }

  static async play(server: Server) {
    if (await this.isGameRunning())
      throw new Error("Вы уже играете на нашем сервере!");

    this.game = await play(server);
  }

  static async close() {
    if (!await this.isGameRunning())
      return;

    await close(this.game!.pid);
  }
}