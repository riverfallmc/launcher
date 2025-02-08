import { getWebsite } from "@/utils/url.util";
import { HttpService } from "../http.service";
import { caughtError } from "@/utils/error.util";

export type Server = {
  id: number,
  name: string,
  enabled: boolean,
  client: string,
  online: {
    current: number,
    max: number;
  },
  ip: string;
}

export class ServerService {
  static async getServers(
    setError: (_: string) => void
  ): Promise<Server[] | undefined> {
    try {
      return HttpService.get<Server[]>(getWebsite("api/server/servers"));
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  static async getServer(
    setError: (_: string) => void,
    id: string
  ): Promise<Server | undefined> {
    try {
      return HttpService.get<Server>(getWebsite(`api/server/server?name=${id}`));
    } catch (err) {
      setError(caughtError(err).message);
    }
  }
}