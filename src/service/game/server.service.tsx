import { getWebsite } from "@/utils/url.util";
import { HttpService } from "../http.service";
import { caughtError } from "@/utils/error.util";
import { Cache } from "@/utils/cache.util";

export type Server = {
  id: number,
  name: string,
  enabled: boolean,
  client: string,
  online: {
    current: number,
    max: number;
  },
  ip: string,
  icon: string,
  background: string;
}

export class ServerService {
  static cache: Cache<Server> = new Cache();

  static async getServers(
    setError: (_: string) => void
  ): Promise<Awaited<Server[] | undefined>> {
    if (!this.cache.isEmpty())
      return this.cache.getStorage();

    try {
      let servers = await HttpService.get<Server[]>(getWebsite("api/server/servers"));

      this.cache.set(servers);

      return servers;
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  static async getServer(
    setError: (_: string) => void,
    id: number
  ): Promise<Awaited<Server> | undefined> {
    if (this.cache) {
      let finded = this.cache.find("id", id);

      if (finded)
        return finded;
    }

    try {
      let server = await HttpService.get<Server>(getWebsite(`api/server/server?name=${id}`));

      this.cache.push(server);

      return server;
    } catch (err) {
      setError(caughtError(err).message);
    }
  }
}
