import "@/index.css";
import React from "react";
import NotFound from "@/page/notfound/page";
import Authentication from "@/page/authentication/page";
import Recovery from "@/page/recovery/page";
import Launcher from "@/page/launcher/page";
import Registration from "@/page/registration/page";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { SettingsManager } from "./util/settings.util";
import { DownloadsManager } from "./util/downloads.util";
import { MessageManager, UiErrorBody } from "./util/message.util";
import { sendNotify } from "./util/notification.util";

const appWindow = getCurrentWebviewWindow();

SettingsManager.register({
  name: "Тёмная тема",
  description: "Включает тёмную тему",
  id: "settings.DarkTheme",
  default: true,
  onChange: value => {
    if (value)
      document.documentElement.classList.add('dark');
    else
      document.documentElement.classList.remove('dark');
  }
})

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

    Application.requestVersion();

    if (!Application.instance)
      Application.instance = this;

    // создаем прослушивателя событий скачивания
    new DownloadsManager;
    // создаем прослушивателя остальных сообщений
    new MessageManager;

    Application.listenMessage();

    this.state = {
      page: Pages.Default
    };
  }

  private static listenMessage() {
    MessageManager.listen(async event => {
      switch (event.type) {
        case "uiError":
          return await this.pushUiError(event.body);
      }
    }, "application");
  }

  private static async pushUiError(body: UiErrorBody) {
    await sendNotify(body.small);
    // Todo добавить уведомление на весь экран
  }

  private static async requestVersion() {
    const isDebug = await Application.isDebug();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    Application.version = `${isDebug ? "debug" : "rc"}-${version}, tauri v${tauriVersion}`;
  }

  public static getInstance(): Application {
    if (!Application.instance) {
      throw new Error("Application is not initialized yet.");
    }

    return Application.instance;
  }

  public static changePage(page: Pages) {
    const instance = Application.getInstance();

    if (instance.state.page !== page)
      instance.setState({ page });
  }

  public static getPage(): Pages | undefined {
    return Application.getInstance().state.page;
  }

  public static async isDebug(): Promise<boolean> {
    return await invoke("isDebug");
  }

  public static async openUrlInBrowser(url: string) {
    await open(url);
  }

  public static async updateClipboard(text: string) {
    await writeText(text);
  }

  public static exit() {
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