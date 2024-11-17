import "@/index.css";
import React from "react";
import NotFound from "@/page/notfound/page";
import Authentication from "@/page/authentication/page";
import Launcher from "@/page/launcher/page";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { SettingsManager } from "./util/settings.util";
import { DownloadsManager } from "./util/downloads.util";
import { MessageManager, UiErrorBody } from "./util/message.util";
import { sendNotify } from "./util/notification.util";
import { ServerDetails } from "./page/launcher/components/serverlist";
import { ServerPage } from "./page/server/page";

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
  Authentication = 0,
  Launcher,
  Server,
  Default = Pages.Authentication, // Pages.Launcher
}

class Application<T = {}> extends React.Component<T, {page?: Pages}> {
  private static instance: Application | null = null;
  private static currentServer: ServerDetails;
  public static noVersion: string = "version not set"
  public static version: string = this.noVersion;

  constructor(props: T) {
    super(props);

    Application.requestVersion();

    // создаем прослушивателя событий скачивания
    new DownloadsManager;
    // создаем прослушивателя остальных сообщений
    new MessageManager;

    Application.listenMessage();

    this.state = {
      page: Pages.Default
    };
  }

  componentDidMount() {
    Application.instance = this;
  }

  private static listenMessage() {
    MessageManager.listen(async event => {
      switch (event.type) {
        case "uiError":
          return await this.showErrorInUI(event.body);
      }
    }, "application");
  }

  /**
   * showErrorInUI
   * * Показывает ошибку-уведомление на экран
   * @param body 
   */
  public static async showErrorInUI(body: UiErrorBody) {
    if (body.small)
      await sendNotify(body.small);

    console.log("Error message:", body.message);
    // Todo добавить уведомление на весь экран
  }

  public static setCurrentServer(data: ServerDetails) {
    this.currentServer = data;
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
      case Pages.Launcher:
        return <Launcher/>
      case Pages.Server:
        return <ServerPage {...Application.currentServer}/>
      default:
        return <NotFound/>;
    }
  }
}

export default Application;
