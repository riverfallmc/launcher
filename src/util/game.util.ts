import { GameProcess, InvokeManager } from "./tauri.util";

export class GameManager {
  static game: GameProcess | null;

  static async isGameRunning(): Promise<boolean> {
    if (!this.game)
      return false;

    return await InvokeManager.isGameRunning(this.game);
  };

  static async play(
    client: string,
    ip: string
  ) {
    if (await this.isGameRunning())
      throw new Error("У вас уже запущена игра");

    this.game = await InvokeManager.play(client, ip);
  };

  static async close() {
    if (!await this.isGameRunning())
      throw new Error("Невозможно закрыть игру: Игра не запущена");

    ///@ts-ignore игнорим this.game can be 'null' потому-что this.isGameRunning уже проверяет это
    await InvokeManager.close(this.game.id);

    this.game = null;
  }
}