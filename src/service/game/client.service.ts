import { HttpService } from "../http.service";
import { getWebsite } from "@/utils/url.util";
import { caughtError } from "@/utils/error.util";
import { Server as IServer } from "./server.service";
import { appDataDir, join } from "@tauri-apps/api/path";
import { mkdir } from "@tauri-apps/plugin-fs";
import { exists } from "@/api/tauri.api";
import { openPath } from "@tauri-apps/plugin-opener";
import { Cache } from "@/utils/cache.util";
import { removeDir } from "@/api/tauri.api";

export type Client = {
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

export class ClientService {
  static cache: Cache<Client> = new Cache();

  static async getClients(
    setError: (_: string) => void
  ): Promise<Awaited<Client[] | undefined>> {
    if (!this.cache.isEmpty())
      return this.cache.getStorage();

    try {
      let clients = await HttpService.get<Client[]>(getWebsite("api/server/clients"));

      this.cache.set(clients);

      return clients;
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  static async getClient(
    setError: (_: string) => void,
    name: string
  ): Promise<Awaited<Client> | undefined> {
    if (this.cache) {
      let finded = this.cache.find("name", name);

      if (finded)
        return finded;
    }

    try {
      let server = await HttpService.get<Client>(getWebsite(`api/server/client?name=${name}`));

      this.cache.push(server);

      return server;
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  static async openFolder(name: string) {
    let path = await this.getClientPath(name);

    await openPath(path);
  }

  static formatModloaderName(name: string): string {
    let text = name.trim().toLowerCase();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text;
  }

  static async getState(server: IServer): Promise<ClientState> {
    let installed = false;
    try {
      installed = await this.isInstalled(server.client);
    } catch (_) { }
    return installed ? (server.enabled ? ClientState.Play : ClientState.Disabled) : ClientState.Install;
  }

  static async getLauncherPath(): Promise<Awaited<string>> {
    const dir = await appDataDir();

    try {
      await mkdir(dir);
    } catch (_) { };

    return dir;
  }

  // /home/smokkkin/.riverfall/clients/${name}
  static async getClientPath(name: string): Promise<string> {
    const basePath = await this.getLauncherPath();

    return join(basePath, "clients", name);
  }

  static async isInstalled(name: string): Promise<boolean> {
    const basePath = await this.getClientPath(name);

    for (const item of ["assets", "libraries", "versions", "client.json"])
      if (!await exists(await join(basePath, item)))
        return false;

    return true;
  };

  static async remove(name: string) {
    return removeDir(await this.getClientPath(name));
  }
}
