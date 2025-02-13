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

const url = "https://downloader.disk.yandex.ru/disk/a1879e0127c2f0c874a7fcba816437264ee9b4f65fa1f5532d8f85cfdc3bc933/67ad7523/Tdh9a4KXp2hZWyppIkXfImFqHz6mFc67-ZNZj8GcxU69uwhlfmSg6NXYh8bAbIPwO1xWdA8tiIKDsoCjNm8XIQ%3D%3D?uid=0&filename=classic_fabric_1201.zip&disposition=attachment&hash=uu0ZmbkRbvcwRSb8YatWFxcCIPkXGRX/QWEbdDifXSKQ9XBw8jfs3wT91YdmBfloq/J6bpmRyOJonT3VoXnDag%3D%3D%3A&limit=0&content_type=application%2Fzip&owner_uid=1759160497&fsize=666717334&hid=1b9c3fb4e769d2ac22b6beba5f538861&media_type=compressed&tknv=v2";

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
