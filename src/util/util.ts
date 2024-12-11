import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export function cn(
  first: string,
  second?: string
): string {
  return `${first} ${second}`;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

const urlBase = isProduction() ? "https://serenitymc.ru" : "https://localhost";

export function getWebserverUrl(
  uri?: string
): string {
  return `${urlBase}/${uri}`;
}

export function formatTime(seconds: number): string {
  const minutes = seconds / 60;

  if (minutes >= 60)
    return `${(minutes / 60).toFixed(1)}ч.`;
  else
    return `${minutes.toFixed(0)}мин.`;
}

export function formatNumber(
  count: number,
  declensions: string[]): string {
  let suffix: string;
  if (count % 10 === 1 && count % 100 !== 11) {
    suffix = declensions[0];
  } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    suffix = declensions[1];
  } else {
    suffix = declensions[2];
  }
  return `${suffix}`;
}

// todo
export function formatPlayers(count: number): string {
  return formatNumber(count, [
    "игрок",
    "игрока",
    "игроков"
  ]);
}

const appWindow = getCurrentWebviewWindow();

export async function updateTitle(
  title: string
) {
  await appWindow.setTitle(`серенити - ${title}`);
}

// Дополнительные классы

export interface Server {
  id: string,
  client: string,
  name: string,
  image: string,
  enabled: boolean,
  // Если enabled = false, то online отсутствует
  online: [current: number, max: number],
}

export interface ServerHistory {
  server: Server,
  time: number;
}

interface Modification {
  name: string,
  icon?: string;
}

export interface ServerDetails {
  client: string,
  description: string,
  mods: Modification[];
}