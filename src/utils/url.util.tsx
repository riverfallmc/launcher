import { HttpService } from "@/service/http.service";
import { openUrl as urlOpen } from "@tauri-apps/plugin-opener";

export function getWebsite(uri: string = "") {
  return `https://riverfall.ru/${uri}`;
}

interface Texture {
  url: string
}

interface SkinCape {
  SKIN?: Texture,
  CAPE?: string;
}

export async function getProfile(username: string): Promise<SkinCape> {
  return await HttpService.get<SkinCape>(getWebsite(`api/session/profile/${username}`));
}

export async function openUrl(url: string = "", withOutWebsite = true) {
  return await urlOpen(withOutWebsite ? getWebsite(url) : url);
}