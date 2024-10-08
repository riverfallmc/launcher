import { invoke } from "@tauri-apps/api/tauri";

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
  private static defaultImage = "logo_main";
  public image: string;
  public title: string;
  public subtitle: string;
  public buttons: DrpcButton[];

  constructor(
    title: string = "",
    subtitle: string = "",
    image: string = DrpcActivity.defaultImage,
    buttons: DrpcButton[] = []
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.image = image;
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

export class DrpcManager {
  static async updateActivity(activity: DrpcActivity) {
    return invoke("setDrpcActivity", {activity});
  }
}