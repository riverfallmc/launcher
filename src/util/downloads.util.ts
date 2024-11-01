import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

export interface DownloadEntity {
  id: string,
  name: string,
  speed: number,
  progress: number,
  state: number,
  paused: boolean;
};

type ListenCallback = (event: DownloadEntity) => void;

// бэкенд должен возвращать payload-объект с следующими полями:
// id: string
// name: string
// speed: number (float)
// progress: number (float)
// status: string // например: распаковка архива
//
// или
//
// id: string
// isPaused: true/false (поставлен на паузу/убран с паузы)

enum DIType {
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete"
}

interface DataParams<T extends Data> {
  type: DIType,
  body: T;
}

interface Data {
  id: String;
}

interface CreateData extends Data {
  name: string;
}

interface ReadData extends Data {
  name: string,
  speed: number,
  progress: number,
  status: string;
}

interface UpdateData extends Data {
  isPaused: boolean;
}

interface DeleteData extends Data { }

export class DownloadInterface {
  private static tauriCommand: Readonly<string> = "downloadInterfaceCommand";

  private static async command<T extends Data>(data: DataParams<T>) {
    return await invoke(this.tauriCommand, {
      request: data
    });
  };

  public static async create<T extends CreateData>(data: T) {
    return await this.command<T>({
      type: DIType.Create,
      body: data
    });
  }

  public static async read<T extends ReadData>(data: T) {
    return await this.command<T>({
      type: DIType.Read,
      body: data
    });
  }

  public static async update<T extends UpdateData>(data: T) {
    return await this.command<T>({
      type: DIType.Update,
      body: data
    });
  }

  public static async delete<T extends DeleteData>(data: T) {
    return await this.command<T>({
      type: DIType.Delete,
      body: data
    });
  }
}

export class DownloadsManager {
  private static managerInstance: DownloadsManager;
  private static listeners: Map<string, ListenCallback> = new Map();

  constructor() {
    if (DownloadsManager.managerInstance !== undefined)
      throw new Error("An application can have only one DownloadManager instance");

    listen<DownloadEntity>("downloadThread", event => DownloadsManager.onEvent(event.payload));
  }

  public static listen(
    callback: ListenCallback,
    id: string
  ) {
    this.listeners.set(id, callback);
  };

  private static onEvent(payload: DownloadEntity) {
    console.log(payload);
    this.listeners.forEach(listener => {
      listener(payload);
    });
  }

  // todo
  public static async download(id: string, serverName: string) {
    return await invoke("downloadClient", { id, serverName });
  }

  // todo
  public static async downloadPause(id: string) {
    return await invoke("downloadPause", { id });
  }

  public static getAll(): DownloadEntity[] {
    return [];
  }
}

(() => {
  setTimeout(async () => {
    await DownloadInterface.create({
      id: "client",
      name: "Magic RPG №1"
    });
  }, 1500);
})();