import "@/index.css";
import React from "react";
import NotFound from "@/page/notfound/page";
import Authentication from "@/page/authentication/page";
import Launcher from "@/page/launcher/page";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { SettingsManager } from "./util/settings.util";
import { DownloadsManager } from "./util/downloads.util";
import { MessageManager, UiErrorBody } from "./util/message.util";
import { sendNotify } from "./util/notification.util";
import { ServerDetails } from "./page/launcher/components/serverlist";
import { ServerPage } from "./page/server/page";
import { BaseManager } from "./util/manager.util";
import { VerisonManager } from "./util/version.util";

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
  Default = Pages.Authentication
}

interface State {
  page?: Pages,
}

/**
 * Класс приложения
 */
class Application<T = {}> extends React.Component<T, State> {
  /** Инстанс (синглтон) приложения */
  private static instance?: Application;
  /** Менеджеры приложения */
  private static readonly managers: typeof BaseManager[] = [
    DownloadsManager,
    MessageManager,
  ];
  /** Параметры выбранного сервера */
  public static currentServer?: ServerDetails;
  /** Если invoke с требованием версии не произошел */
  public static readonly noVersion: string = "N/A";
  /** Версия по умолчанию */
  public static version: string = this.noVersion;

  state: State = {
    page: Pages.Default
  };

  constructor(props: T) {
    super(props);

    Application.waitForVersion();
    Application.listenMessage();
  }

  componentDidMount() {
    // Чтобы менеджеры инициализировались в момент когда инстанса приложения нет
    // Следовательно они не будут инициализироваться несколько раз
    if (!Application.instance)
      BaseManager.register(Application.managers);

    Application.instance = this;
  }

  /**
   * Инициализирует слушатель сообщений MessageManager
   */
  private static listenMessage() {
    MessageManager.listen(async event => {
      switch (event.type) {
        case "uiError":
          return await this.showErrorInUI(event.body);
      }
    }, "application");
  }

  /**
   * Показывает ошибку-уведомление на экран
   * @param body
   */
  public static async showErrorInUI(body: UiErrorBody) {
    if (body.small)
      await sendNotify(body.small);

    console.log("Error message:", body.message);
    // Todo добавить уведомление на весь экран
  }

  /**
   * Устанавливает текущий сервер
   * @param data Объект сервера
  */
  public static setCurrentServer(data: ServerDetails) {
    this.currentServer = data;
  }

  /**
   * @returns Объект сервера
   */
  private static getCurrentServer(): ServerDetails | undefined {
    return this.currentServer;
  }

  /**
   * Асинхронная функция, ждущая и устанавливающая версию приложения как переменную
   */
  private static async waitForVersion() {
    Application.version = await VerisonManager.get();
  }

  /**
   * @returns Инстанс (singleton) приложения
   */
  public static getInstance(): Application {
    if (!Application.instance) {
      throw new Error("Application is not initialized yet.");
    }

    return Application.instance;
  }

  /**
   * Меняет показываемую страницу в приложениия
   * @param page Новая страница
   */
  public static changePage(page: Pages) {
    const instance = Application.getInstance();

    if (instance.state.page !== page)
      instance.setState({ page });
  }

  /**
   * @returns Показываемая на данный момент страница
   */
  public static getPage(): Pages | undefined {
    return Application.getInstance().state.page;
  }

  /**
   * Открывает ссылку в браузере
   * @param url Ссылка
   */
  public static async openUrlInBrowser(url: string) {
    await open(url);
  }

  /**
   * Устанавливает текст буфера обмена
   * @param text Текст
   */
  public static async updateClipboard(text: string) {
    await writeText(text);
  }

  /**
   * Закрывает приложение
   */
  public static exit() {
    appWindow.close();
  }

  /**
   * Определяет, какая страница должна быть отрисована
   * * ReactJS method.
   */
  render(): React.ReactNode {
    const { page } = this.state;

    switch (page) {
      case Pages.Authentication:
        return <Authentication/>;
      case Pages.Launcher:
        return <Launcher/>
      // @ts-ignore
      case Pages.Server:
        let server = Application.getCurrentServer();
        if (server)
          return <ServerPage {...server}/>
      default:
        return <NotFound/>;
    }
  }
}

export default Application;
