import { listen } from '@tauri-apps/api/event';
import { start, destroy } from "tauri-plugin-downloader";
import { AppManager } from './tauri.util';

export async function configureDownloader() {
  try {
    await destroy();
  } catch (_) { }

  await start();
}

// Слушаем событие
listen('dwnerror', event => {
  const err = (event.payload as { message: string; }).message;
  AppManager.showError(`Не получилось скачать: ${err}`);
});