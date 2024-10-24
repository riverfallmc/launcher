import { invoke } from "@tauri-apps/api/core";
import Application from "../app";
import { SettingsController } from "./settings.util";

export class DrpcButton {
  public label: string;
  public url: string;

  constructor(label: string, url: string) {
    this.label = label;
    this.url = url;
  }
}

interface DrpcActivityStruct {
  image: string,
  title: string,
  subtitle: string,
  buttons: DrpcButton[];
}

export class DrpcActivity implements DrpcActivityStruct {
  private static defaultImage: string = "logo_main";
  public image: string;
  public title: string;
  public subtitle: string;
  public buttons: DrpcButton[] = [
    new DrpcButton("Наш телеграм канал", "https://t.me/serenitymcru")
  ];

  constructor(
    title: string = "",
    subtitle: string = "",
    image: string = DrpcActivity.defaultImage,
    buttons?: DrpcButton[]
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.image = image;

    if (buttons)
      this.buttons = buttons;
  }

  public setImage(state: string): this {
    this.subtitle = state;
    return this;
  }

  public setDetails(details: string): this {
    this.title = details;
    return this;
  }

  public setState(state: string): this {
    this.subtitle = state;
    return this;
  }

  public setButtons(buttons: DrpcButton[]): this {
    this.buttons = buttons;
    return this;
  }
}

SettingsController.register("settings.discordRichPresence", true);

export class DrpcManager {
  private static intervalId?: NodeJS.Timeout;

  private static updActivity(activity: DrpcActivity) {
    return invoke("setDrpcActivity", { activity });
  }

  static initialize() {
    this.setEnabled(SettingsController.get("settings.discordRichPresence"));
  }

  // todo: rewrite
  static async updateActivity(activity: DrpcActivity) {
    if (activity.subtitle === Application.noVersion) {
      if (this.intervalId)
        clearInterval(this.intervalId);

      this.intervalId = setTimeout(() => {
        DrpcManager.updateActivity(new DrpcActivity(
          activity.title,
          Application.version,
          activity.image,
          activity.buttons
        ));

        delete this.intervalId;
      }, 500);

      return;
    }

    DrpcManager.updActivity(activity);
  }

  static async setEnabled(enabled: boolean) {
    SettingsController.set("settings.discordRichPresence", enabled);

    return invoke("setDrpcEnabled", { enabled });
  }

  static async toggle() {
    return this.setEnabled(!SettingsController.get("settings.discordRichPresence"));
  }
}

DrpcManager.initialize();