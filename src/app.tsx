import "@/index.css";
import React from "react";
import NotFound from "@/page/notfound/page";
import Authentication from "@/page/authentication/page";
import Recovery from "@/page/recovery/page";
import Launcher from "@/page/launcher/page";
import Registration from "@/page/registration/page";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { DrpcActivity, DrpcManager } from "./discord";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";

export enum Pages {
  // Default = Authentication = 0
  Default = 3,
  Authentication = 0,
  Registration,
  PasswordRecovery,
  Launcher
}

interface ApplicationProps {}
interface ApplicationState {
  page?: Pages;
}

class Application extends React.Component<ApplicationProps, ApplicationState> {
  private static instance: Application | null = null;

  constructor(props: ApplicationProps) {
    super(props);

    if (!Application.instance) {
      Application.instance = this;
    }

    this.state = {
      page: Pages.Default
    };

    return Application.instance;
  }

  static getInstance(): Application {
    if (!Application.instance) {
      throw new Error("Application is not initialized yet.");
    }

    return Application.instance;
  }

  static changePage(page: Pages) {
    const instance = Application.getInstance();
    if (instance.state.page !== page)
      instance.setState({ page });
  }

  static getPage(): Pages | undefined {
    return Application.getInstance().state.page;
  }

  static openUrlInBrowser(url: string) {
    invoke("openUrlInBrowser", {url: url})
      .catch(e => {
        console.log("Unable to open url in browser:", e);
      });
  }

  static exit() {
    appWindow.close();
  }

  static async isDebug(): Promise<boolean> {
    return await invoke("isDebug");
  }

  static updateClipboard(text: string) {
    console.log(text);
    invoke("updateClipboard", {text}).catch(console.log);
  }

  render(): React.ReactNode {
    const { page } = this.state;

    setTimeout(async () => {
      const activity = new DrpcActivity("Страница авторизации", `${await Application.isDebug() ? "debug" : "rc"}-${await getVersion()}, tauri v${await getTauriVersion()}`, "logo_subtitled", []);
      await DrpcManager.updateActivity(activity);
    }, 1500);

    switch (page) {
      case Pages.Authentication:
        return <Authentication/>;
      case Pages.PasswordRecovery:
        return <Recovery/>;
      case Pages.Registration:
        return <Registration/>;
      case Pages.Launcher:
        return <Launcher/>
      default:
        return <NotFound/>;
    }
  }
}

export default Application;