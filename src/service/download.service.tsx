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

// TODO
const url = "https://downloader.disk.yandex.ru/disk/e97879c2b2a50145cb3812cccc5c2dea81d95fa5bd3b09bc83ab5167d69cb224/67ae2670/Tdh9a4KXp2hZWyppIkXfIp7wdZc0eoqn5EiXKSWi43EfmAptX_ZF2rSZzaJQWQ0haoJZiZgZK6LGo1uUX2zf-g%3D%3D?uid=0&filename=siberia.zip&disposition=attachment&hash=jEUxhx9zgBGOkh0XC1dCf/qca5AcMN37fSluQYKtFN1g6ptOasH10eC7u1W49R7Iq/J6bpmRyOJonT3VoXnDag%3D%3D%3A&limit=0&content_type=application%2Fzip&owner_uid=1759160497&fsize=675283414&hid=0e24c5ebf1acb854ef50724fb05923fd&media_type=compressed&tknv=v2"

export class ClientDownloadService {
  protected static currentDownloadable: Downloadable;

  protected static async getDownloadUrl(name: string): Promise<string> {
    return url;
    // return `${await ClientService.getClientPath(name)}/${name}.zip`
  }

  protected static async getSavePath(name: string): Promise<string> {
    return `${await ClientService.getClientPath(name)}/${name}.zip`;
  }

  public static isDownloading(): boolean {
    return this.currentDownloadable != null
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
    }
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
