import { invoke } from "@tauri-apps/api/core";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";

export class VerisonManager {
  private static async isDebug(): Promise<boolean> {
    return await invoke("isDebug");
  }

  private static async getPackageVersion(): Promise<string> {
    return await getVersion();
  }

  private static async getTauriVersion(): Promise<string> {
    return await getTauriVersion();
  }

  public static async get(): Promise<string> {
    return `${await VerisonManager.isDebug() ? "debug" : "rc"}-${await VerisonManager.getPackageVersion()}, tauri v${await VerisonManager.getTauriVersion()}`;
  }
}