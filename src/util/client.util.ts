import { WebUtil } from "./web.util";
import { appDataDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { download } from "guest-js/downloader";
import { AppManager, InvokeManager } from "./tauri.util";
import { formatError } from "./unsorted.util";
import { listen } from "@tauri-apps/api/event";

const url = "";

export interface Client {
  id: number,
  name: string,
  description: string,
  modloader: "Forge" | "Fabric",
  version: string,
  mods: string[];
};

export enum ClientState {
  Null,
  Install,
  Play
}

listen("dwnok", async event => {
  const name = (event.payload as { name: string; }).name;
  try {
    await InvokeManager.unrar(await ClientStorage.getClientPath(name), name);
  } catch (err) {
    AppManager.showError(formatError(err));
  }
});

export class ClientStorage {
  protected static checkTo = ["assets", "libraries", "versions", "data.json"];

  // /home/smokkkin/.riverfall/
  static async getLauncherPath(): Promise<string> {
    return appDataDir();
  }

  // /home/smokkkin/.riverfall/clients/${name}
  static async getClientPath(name: string): Promise<string> {
    const basePath = await this.getLauncherPath();

    return join(basePath, "clients", name);
  }

  static async getClientArchive(name: string): Promise<string> {
    return join(await this.getClientPath(name), `${name}.zip`);
  }

  static async isInstalled(name: string): Promise<boolean> {
    const basePath = await this.getClientPath(name);

    for (const item of this.checkTo)
      if (!await exists(await join(basePath, item)))
        return false;

    return true;
  };

  static async install(
    name: string
  ) {
    try {
      await download({
        name,
        save: await this.getClientArchive(name),
        url //WebUtil.getWebsiteUrl("/client/${name}.rar")
      });
    } catch (err) {
      AppManager.showError(formatError(err));
    }
  }
}

// ClientStorage.install("magicrpg");
try {
  await InvokeManager.unrar("/home/smokkkin/projects/test.zip", "anal");
} catch (err) {
  console.log(err);
}

export class ClientManager {
  static apiEntrypointBase = "api/server/client";

  static async getClientList(): Promise<Client[]> {
    const res = await fetch(WebUtil.getWebsiteUrl(`${this.apiEntrypointBase}s`));
    return await res.json();
  };

  /**
   * Запрашивает у веб-сервера информацию о игровом сервере
   * @param id Айди сервера
   * @returns Информация о сервере
   */
  static async getClient(
    name: string
  ): Promise<Client> {
    const res = await fetch(WebUtil.getWebsiteUrl(`${this.apiEntrypointBase}?name=${name}`));
    return await res.json();
  };

  static formatModloaderName(name: string): string {
    let text = name.trim().toLowerCase();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text;
  }

  static async getState(name: string): Promise<ClientState> {
    let installed = false;
    try {
      installed = await ClientStorage.isInstalled(name);
    } catch (_) { }
    return installed ? ClientState.Play : ClientState.Install;
  }
}