import { GameManager } from "./game.util";
import { AppManager } from "./tauri.util";
import { formatError } from "./unsorted.util";

export interface ServerData {
  id: number,
  name: string,
  is_enabled: boolean,
  players: number,
  ip: string,
  client: string,
  max_players: number;
};

export interface ServerExtendedData {
  id: number,
}

export class ServerManager {
  static apiEntrypointBase = "api/server";

  static async getServerList(): Promise<ServerData[]> {
    return [];
  };

  /**
   * Запрашивает у веб-сервера информацию о игровом сервере
   * @param id Айди сервера
   * @returns Информация о сервере
   */
  static async getServerData(
    id: number
  ): Promise<ServerData> {
    return;
  };

  /**
   * Запрашивает у веб-сервера расширенную информацию о игровом сервере
   * @param id Айди сервера
   * @returns Расширенная информация о сервере
   */
  static async getServerExtendedData(
    id: number
  ): Promise<ServerExtendedData> {
    return;
  };

  /**
   * Запускает клиент и подключается к серверу
   * @param server Сервер, к которому будет произведено подключение
  */
  static async play(
    server: ServerData
  ) {
    try {
      await GameManager.play(server.client, server.ip);
    } catch (err) {
      AppManager.showError(formatError(err));
    }
  };
}