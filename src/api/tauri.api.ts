import { invoke } from "@tauri-apps/api/core";

export async function exists(path: string): Promise<boolean> {
  return invoke("fs_exists", { path });
};

export async function removeDir(path: string) {
  return invoke("fs_rm_dir", { path });
};