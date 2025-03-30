import { Activity, Assets, Button, Party, Timestamps } from "tauri-plugin-drpc/activity";
import { Server } from "../game/server.service";

function getTimestamp(): Timestamps {
  return new Timestamps(Date.now());
}

export function authorization(): Activity {
  return new Activity()
    .setDetails("В лаунчере")
    .setState("Авторизируется")
    .setTimestamps(getTimestamp())
    .setAssets(
      new Assets()
        .setLargeImage("logo")
        .setLargeText("riverfall.ru")
    );
}

export function inLauncher(): Activity {
  return new Activity()
    .setDetails("В лаунчере")
    .setState("Выбирает сервер")
    .setTimestamps(getTimestamp())
    .setAssets(
      new Assets()
        .setLargeImage("logo")
        .setLargeText("riverfall.ru")
    );
}

export function playing(server: Server): Activity {
  return new Activity()
    .setDetails("Играет на сервере")
    .setState(server.name)
    .setTimestamps(getTimestamp())
    .setButton([
      new Button("Присоединиться", `riverfall://connect?id=${server.id}`)
    ])
    .setAssets(
      new Assets()
        .setLargeImage("server_" + server.id)
        .setLargeText("Играет на сервере " + server.name)
        .setSmallImage("logo")
        .setSmallText("riverfall.ru")
    );
}