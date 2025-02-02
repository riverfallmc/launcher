export class UpdateManager {
  static async update(): Promise<boolean> {
    // TODO @ Дописать апдейтер
    // -> https://v2.tauri.app/plugin/updater/
    await new Promise(resolve => setTimeout(resolve, 1000));

    return false;
  }
}