import { GameService } from "./game/game.service";
import { ServerService } from "./game/server.service";

export class DeepLinkService {
  public static async handle(url: string) {
    const uri = url.split("://")[1].replace("/", "");
    const query = new URLSearchParams(uri.split("?")[1]);

    switch (uri.split("?")[0]) {
      case "connect":
        if (window.location.pathname !== "/launcher")
          return;

        const serverId = parseInt(query.get("id") || "0");

        if (serverId && serverId !== 0) {
          const server = await ServerService.getServer(() => { }, serverId);

          if (server)
            await GameService.play(server);
        }

        return;
      default:
        return;
    }
  }
}