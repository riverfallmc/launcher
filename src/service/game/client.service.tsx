import { HttpService } from "../http.service";
import { getWebsite } from "@/utils/url.util";
import { caughtError } from "@/utils/error.util";
import { Server as IServer } from "./server.service";
import { appDataDir, join } from "@tauri-apps/api/path";
import { exists } from "@/api/tauri.api";

export type Client = {
  id: number,
  name: string,
  description: string,
  modloader: "Forge" | "Fabric",
  version: string,
  mods: string[];
}

export enum ClientState {
  Null,
  Install,
  Installation,
  IntegrityCheck,
  Disabled,
  Play
}

export class ClientService {
  static async getClients(
    setError: (_: string) => void
  ): Promise<Client[] | undefined> {
    try {
      return HttpService.get<Client[]>(getWebsite("api/server/clients"));
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  static async getClient(
    setError: (_: string) => void,
    id: string
  ): Promise<Client | undefined> {
    try {
      return HttpService.get<Client>(getWebsite(`api/server/client?name=${id}`));
    } catch (err) {
      setError(caughtError(err).message);
    }
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

  static async getLauncherPath(): Promise<string> {
    return appDataDir();
  }

  // /home/smokkkin/.riverfall/clients/${name}
  static async getClientPath(name: string): Promise<string> {
    const basePath = await this.getLauncherPath();

    return join(basePath, "clients", name);
  }

  static async isInstalled(name: string): Promise<boolean> {
    const basePath = await this.getClientPath(name);

    for (const item of ["assets", "libraries", "versions", "data.json"])
      if (!await exists(await join(basePath, item)))
        return false;

    return true;
  };
}