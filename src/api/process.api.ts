import { ClientService } from "@/service/game/client.service";
import { Server } from "@/service/game/server.service";
import { getSession } from "@/storage/session.storage";
import { getUser } from "@/storage/user.storage";
import { invoke } from "@tauri-apps/api/core";

export type ProcessInfo = {
  pid: number,
  name: string;
};

export async function env(variable: string): Promise<string> {
  return invoke("env", { var: variable });
}

export async function unzip(path: string): Promise<void> {
  return await invoke("fs_unzip", { path });
}

export async function exists(path: string): Promise<boolean> {
  return invoke("fs_exists", { path });
};

// process

export async function play(
  server: Server
): Promise<ProcessInfo> {
  const session = getSession();
  const user = getUser();

  return invoke("game_play", {
    id: user?.id,
    username: user?.username,
    client: server.client,
    clientPath: await ClientService.getClientPath(server.client),
    jwt: session?.jwt,
    ip: server.enabled ? server.ip : null
  });
}

export async function isProcessExist({ pid }: { pid: number; }): Promise<boolean> {
  return invoke("process_exist", { pid });
}

export async function close(
  pid: number
) {
  return await invoke("close", { pid });
}