import { invoke } from "@tauri-apps/api/core";

export async function exists(path: string): Promise<boolean> {
  return invoke("exists", { path });
};