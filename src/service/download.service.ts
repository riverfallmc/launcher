import { download } from "@tauri-apps/plugin-upload";
import { ClientService } from "./game/client.service";
import { caughtError } from "@/utils/error.util";

type Progress = {
  progress: number;
  progressTotal: number;
  total: number;
  transferSpeed: number;
};

type ProgressCallback = (name: string, _: Progress) => void;
type ErrorHandler = (_: string) => void;

export type Downloadable = {
  name: string,
  progress?: Progress;
};

export class ClientDownloadService {
  protected static currentDownloadable: Downloadable;

  protected static async getDownloadUrl(name: string): Promise<string> {
    return `${await ClientService.getClientPath(name)}/${name}.zip`;
  }

  protected static async getSavePath(name: string): Promise<string> {
    return `${await ClientService.getClientPath(name)}/${name}.zip`;
  }

  public static isDownloading(): boolean {
    return this.currentDownloadable != null;
  }

  public static getDownloading(): Downloadable | null {
    return this.currentDownloadable;
  }

  protected static generateHandler(
    name: string,
    downloadHandler: ProgressCallback
  ): (_: Progress) => void {
    return (progress) => {
      downloadHandler(name, progress);
    };
  }

  public static async download(
    name: string,
    downloadHandler: ProgressCallback,
    errorHandler: ErrorHandler
  ): Promise<string> {
    let url = await this.getDownloadUrl(name);
    let saveTo = await this.getSavePath(name);

    try {
      await download(url, saveTo, this.generateHandler(name, downloadHandler));
    } catch (err) {
      errorHandler(caughtError(err).message);
    }

    return saveTo;
  }
}
