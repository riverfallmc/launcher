import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

let permissionGranted = await isPermissionGranted();

if (!permissionGranted) {
  const permission = await requestPermission();
  permissionGranted = permission === 'granted';
}

export function notify(
  body: string
) {
  if (!permissionGranted)
    return console.log("Недостаточно разрешений для отправки уведомления");

  sendNotification({ title: 'Лаунчер Riverfall', body });
}