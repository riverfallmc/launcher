
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

let permissionGranted = false;

export async function configure() {
  permissionGranted = await isPermissionGranted();

  if (!permissionGranted)
    permissionGranted = await requestPermission() === 'granted';
}

export function notify(
  body: string
) {
  if (!permissionGranted)
    return console.log("Недостаточно разрешений для отправки уведомления");

  sendNotification({ title: 'Лаунчер Riverfall', body, icon: "icons/icon.ico" });
}