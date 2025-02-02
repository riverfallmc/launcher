import { listen } from '@tauri-apps/api/event';
import { start, destroy } from "guest-js";
import { AppManager } from './tauri.util';

(async () => {
  try {
    await destroy();
  } catch (_) { }
  await start();
})();

// Слушаем событие
listen('dwnerror', event => {
  const err = (event.payload as { message: string; }).message;
  AppManager.showError(`Не получилось скачать: ${err}`);
});