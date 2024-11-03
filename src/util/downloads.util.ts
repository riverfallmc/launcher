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

//                Процесс скачивания  Создание    Пауза      Удаления
type BackendMessageType = "download" | "create" | "update" | "remove";

interface BackendMessage<T> {
  type: BackendMessageType,
  body: T;
}

type ListenCallback<T> = (event: BackendMessage<T>) => void;

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

interface UpdateData extends Data {
  isPaused: boolean;
}

interface DeleteData extends Data { }

// Отправка сообщений Backend
export class DownloadInterface {
  private static tauriCommand: Readonly<string> = "di_cmd";

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

// Прием сообщений от Backend + Отправка через DownloadInterface
export class DownloadsManager {
  private static managerInstance: DownloadsManager;
  private static listeners: Map<string, ListenCallback<any>> = new Map();

  constructor() {
    if (DownloadsManager.managerInstance !== undefined)
      throw new Error("An application can have only one DownloadManager instance");

    listen<BackendMessage<any>>("downloadThread", event => DownloadsManager.onEvent(event.payload));
  }

  public static listen<T = any>(
    callback: ListenCallback<T>,
    id: string
  ) {
    this.listeners.set(id, callback);
  };

  private static onEvent(payload: BackendMessage<any>) {
    console.log(payload);
    this.listeners.forEach(listener => {
      listener(payload);
    });
  }

  public static async download(id: string, name: string) {
    return await DownloadInterface.create({
      id,
      name
    });
  }

  public static async setDownloadPaused(id: string, isPaused: boolean) {
    return await DownloadInterface.update({
      id,
      isPaused
    });
  }

  public static async removeDownload(id: string) {
    return await DownloadInterface.delete({
      id
    });
  }

  public static getAll(): DownloadEntity[] {
    return [];
  }
}

(() => {
  setTimeout(async () => {
    await DownloadInterface.create({
      id: "magicrpg",
      name: "Magic RPG №1"
    });
  }, 1500);
})();