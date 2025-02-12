import { openUrl as urlOpen } from "@tauri-apps/plugin-opener";

export function getWebsite(uri: string = "") {
  return process.env.NODE_ENV === "production" ? `https://riverfall.ru/${uri}` : `https://localhost/${uri}`;
}

export function getAvatar(username: string): string {
  //if (process.env.NODE_ENV === "development")
  //  return "/assets/karakal.png";

  return getWebsite(`api/session/skin/${username}.png`);
}

export async function openUrl(url: string = "", withOutWebsite = true) {
  return await urlOpen(withOutWebsite ? getWebsite(url) : url);
}
