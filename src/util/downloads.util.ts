export interface DownloadEntity {
  id: string,
  name: string,
  process: number,
  speed: number,
  isPaused: boolean,
  status: string;
};

export class DownloadsManager {
  public static getAll(): DownloadEntity[] {
    return [
      {
        id: "magic-rpg",
        name: "Говно с горы",
        process: 10,
        speed: 10.5,
        isPaused: true,
        status: "Скачивание говна"
      },
      {
        id: "magic-sus-rpg",
        name: "sus",
        process: 25,
        speed: 10.5,
        isPaused: false,
        status: "Соси хуй"
      }
    ];;
  }
}