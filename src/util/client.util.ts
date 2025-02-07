import { WebUtil } from "./web.util";
import { appDataDir, join } from "@tauri-apps/api/path";
import { download, Downloadable, status } from "guest-js/downloader";
import { AppManager, InvokeManager } from "./tauri.util";
import { listen } from "@tauri-apps/api/event";
import { Server as IServer } from "./server.util";

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
  Installation,
  IntegrityCheck,
  Disabled,
  Play
}

const diskUrl = "https://downloader.disk.yandex.ru/disk/a2e65fdce2f516cf009db80beec3ed584ab2acb41ce52e4088b9935b4959d5f9/67a43142/Tdh9a4KXp2hZWyppIkXfImFqHz6mFc67-ZNZj8GcxU69uwhlfmSg6NXYh8bAbIPwO1xWdA8tiIKDsoCjNm8XIQ%3D%3D?uid=0&filename=classic_fabric_1201.zip&disposition=attachment&hash=uu0ZmbkRbvcwRSb8YatWFxcCIPkXGRX/QWEbdDifXSKQ9XBw8jfs3wT91YdmBfloq/J6bpmRyOJonT3VoXnDag%3D%3D%3A&limit=0&content_type=application%2Fzip&owner_uid=1759160497&fsize=666717334&hid=1b9c3fb4e769d2ac22b6beba5f538861&media_type=compressed&tknv=v2";

listen("dwnok", async event => {
  const name = (event.payload as { name: string; }).name;
  try {
    await InvokeManager.unzip(await ClientStorage.getClientPath(name), name);
  } catch (err) {
    AppManager.showError(err);
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

  static async getClientDir(name: string): Promise<string> {
    return join("clients", name);
  }

  static async getClientArchive(name: string): Promise<string> {
    return join(await this.getClientPath(name), `${name}.zip`);
  }

  static async isInstalled(name: string): Promise<boolean> {
    const basePath = await this.getClientPath(name);

    for (const item of this.checkTo)
      if (!await InvokeManager.exists(await join(basePath, item)))
        return false;

    return true;
  };

  static async install(
    name: string
  ) {
    console.log("wth");
    await download({
      name,
      save: await this.getClientArchive(name),
      url: diskUrl || WebUtil.getWebsiteUrl("client/${name}.rar")
    });
    console.log("sima");
  }

  static async installProgress(): Promise<Downloadable> {
    return status();
  }
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

  static async getState(server: IServer): Promise<ClientState> {
    let installed = false;
    try {
      installed = await ClientStorage.isInstalled(server.client);
    } catch (_) { }
    return installed ? (server.enabled ? ClientState.Play : ClientState.Disabled) : ClientState.Install;
  }
}