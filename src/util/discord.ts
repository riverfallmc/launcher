import { invoke } from "@tauri-apps/api/core";

export enum Images {
  Logo = "logo",
  LogoMain = "logo_main",
  LogoSubtitled = "logo_subtitled"
};

export class Button {
  protected label: string;
  protected url: string;

  constructor(
    label: string,
    url: string
  ) {
    this.label = label;
    this.url = url;
  }
}

export const Buttons = {
  default: [
    new Button("Телеграм", "https://t.me/serenitymcru")
  ]
};

/** ActivityProps */
interface ActivityProps {
  title: string,
  subtitle: string,
  image: string,
  buttons: Button[];
}

export class Activity {
  protected activity: ActivityProps;

  constructor(activity: ActivityProps) {
    this.activity = activity;
  }

  public getActivity(): ActivityProps {
    return this.activity;
  }

  public static async update(activity: Activity) {
    await invoke("setDrpcActivity", { activity: activity.getActivity() });
  }
}

export async function updateActivity(activity: Activity) {
  await Activity.update(activity);
}