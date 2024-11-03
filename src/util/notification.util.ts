import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

async function checkPermission(): Promise<boolean> {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  return permissionGranted;
}

export async function sendNotify(body: string) {
  if (await checkPermission())
    // Todo добавить иконку
    sendNotification({ title: 'серенити', body });
}