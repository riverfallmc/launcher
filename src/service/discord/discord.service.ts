import { setActivity, start } from "tauri-plugin-drpc";
import type { Activity } from "tauri-plugin-drpc/activity";
import { authorization, inLauncher, playing } from "./activities";
import { Server } from "../game/server.service";

type Activities = "Authorization" | "Launcher" | "Playing";

export class DiscordService {
  private static readonly clientId = "1292519587945906249";

  public static async spawn() {
    try {
      await start(this.clientId);
    } catch (_) { }
  }

  // well, yes
  protected static async setActivity(activity: Activity) {
    setActivity(activity);
  };

  public static async updateActivity(activity: Activities, server?: Server) {
    switch (activity) {
      case "Authorization":
        return this.setActivity(authorization());
      case "Launcher":
        return this.setActivity(inLauncher());
      case "Playing":
        return this.setActivity(playing(server!));
    }
  }
}