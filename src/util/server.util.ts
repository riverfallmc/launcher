import { WebUtil } from "./web.util";

interface Online {
  current: number,
  max: number;
};

export interface Server {
  id: number,
  name: string,
  enabled: boolean,
  client: string,
  online: Online,
  ip: string;
};

export class ServerManager {
  private static apiEntrypointBase = "api/server/server";

  static async getServerList(): Promise<Server[]> {
    const res = await fetch(WebUtil.getWebsiteUrl(`${this.apiEntrypointBase}s`));
    return await res.json();
  };

  /**
   * Запрашивает у веб-сервера информацию о игровом сервере
   * @param id Айди сервера
   * @returns Информация о сервере
   */
  static async getServer(
    id: number
  ): Promise<Server[]> {
    const res = await fetch(WebUtil.getWebsiteUrl(`${this.apiEntrypointBase}?id=${id}`));
    return await res.json();
  };
}