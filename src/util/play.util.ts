import Application from "@/app";
import { invoke } from "@tauri-apps/api/core";

/**
 * Менедежер запуска клиентов.
 */
export class PlayManager {
  /** Запущен ли уже какой-нибудь клиент? */
  private static haveGameInstance: boolean;

  /**
   * Запускает игровой клиент
   * @param id Айди клиента который будет запущен.
   * @param ip Айпи сервера, к которому будет подключен игрок по завершению инициализации игры.
   */
  public static async play(
    id: string,
    ip: string
  ) {
    if (this.haveGameInstance)
      return Application.showErrorInUI({ message: "У вас уже запущен клиент игры!" });

    // Запускаем игру
    this.haveGameInstance = true;

    // Вызов "play" не закончится до тех пор, пока игра не будет закрыта.
    await invoke("play", { id, ip });

    // Игра закрылась, следовательно мы меняем нашу переменную
    this.haveGameInstance = false;
  }
}