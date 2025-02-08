import { getCurrentWindow } from '@tauri-apps/api/window';
import { notify } from './notify.service';
import { addTrayNotification, getTrayNotification } from '@/storage/notification.storage';

const window = getCurrentWindow();

export async function close() {
  if (getTrayNotification() <= 3) {
    addTrayNotification();
    notify("Лаунчер был свёрнут в трей");
  }

  return window.hide();
}

export async function minimize() {
  return window.minimize();
}