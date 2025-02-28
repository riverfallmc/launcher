import { invoke } from "@tauri-apps/api/core";

export async function exists(path: string): Promise<boolean> {
  return invoke("exists", { path });
};

export async function removeDir(path: string) {
  return invoke("remove_dir", { path });
};