import "@/index.css";
import React from "react";
import NotFound from "@/page/notfound/page";
import Authentication from "@/page/authentication/page";
import Recovery from "@/page/recovery/page";
import Launcher from "@/page/launcher/page";
import Registration from "@/page/registration/page";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
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
  public static noVersion: string = "version not set"
  public static version: string = this.noVersion;

  constructor(props: ApplicationProps) {
    super(props);

    if (!Application.instance) {
      Application.instance = this;
    }

    this.state = {
      page: Pages.Default
    };

    Application.requestVersion();

    return Application.instance;
  }

  private static async requestVersion() {
    const isDebug = await Application.isDebug();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    Application.version = `${isDebug ? "debug" : "rc"}-${version}, tauri v${tauriVersion}`;
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

  static async isDebug(): Promise<boolean> {
    return await invoke("isDebug");
  }

  static openUrlInBrowser(url: string) {
    invoke("openUrlInBrowser", {url: url});
  }

  static updateClipboard(text: string) {
    invoke("updateClipboard", {text});
  }

  static exit() {
    appWindow.close();
  }

  render(): React.ReactNode {
    const { page } = this.state;

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