import { destory, setActivity, start } from "tauri-plugin-drpc";
import { Activity, Assets, Timestamps } from "tauri-plugin-drpc/activity";

const timestamps = new Timestamps(Date.now());

const activity = new Activity()
  .setDetails("В лаунчере")
  .setState("Выбирает сервер")
  .setTimestamps(timestamps)
  .setAssets(
    new Assets()
      .setLargeImage("logo")
      .setLargeText("t.me/riverfallmc")
  );

export async function configure() {
  await start("1292519587945906249");
  await destory();
  await setActivity(activity);
}