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

const url = "https://downloader.disk.yandex.ru/disk/36ed58b6a0852f861992ef2ddddc0edb40675d829d1899b87166c71a97c4db16/67ad29c6/Tdh9a4KXp2hZWyppIkXfIhcwTeXK1xfITKxBWNx4Si90UgR6FdjCsPtcVpnDpzQnWyMJUe62eQFYXuzAe3YFUA%3D%3D?uid=0&filename=mods.zip&disposition=attachment&hash=V6uqKFQx3jRxuYTo4jREx0D1B8q830T2y93M6s9edtFUVqWBMrg5PggtJ4UIaQsGq/J6bpmRyOJonT3VoXnDag%3D%3D%3A&limit=0&content_type=application%2Fzip&owner_uid=1759160497&fsize=97992449&hid=291c678fc3a25d216305aa42f16f22c3&media_type=compressed&tknv=v2"

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
