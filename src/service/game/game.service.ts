import { close as hide } from "@/service/application.service";
import { isProcessExist, play, close, ProcessInfo } from "@/api/process.api";
import { Server } from "./server.service";
import { ClientService } from "./client.service";

export class GameService {
  static game?: ProcessInfo;
  static server?: Server;

  static async isGameRunning(): Promise<boolean> {
    if (!this.game)
      return false;

    return isProcessExist(this.game);
  }

  static async play(server: Server) {
    if (await this.isGameRunning())
      throw new Error("Вы уже играете на сервере!");

    if (!await ClientService.isInstalled(server.client))
      throw new Error("Клиент этого сервера не установлен!");

    this.game = await play(server);

    this.server = server;

    await hide();
  }

  static getCurrentServer(): Server | undefined {
    return this.server;
  }

  static async close() {
    if (!await this.isGameRunning())
      return;

    await close(this.game!.pid);
  }
}