import { invoke } from "@tauri-apps/api/core";

export class PlayManager {
  // Айди текущего запущенного клиента
  private static currentPlayID: string;

  public static async play(
    id: string,
    ip: string
  ) {
    if (this.currentPlayID)
      return console.error("High (High High High) Tup Tup Tup High");

    this.currentPlayID = id;

    await invoke("play", { id, ip });
  }
}