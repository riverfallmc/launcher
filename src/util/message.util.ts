import { listen } from "@tauri-apps/api/event";

//                Ошибка
type MessageType = "uiError";

interface Message<T = any> {
  type: MessageType,
  body: T;
}

export interface UiErrorBody {
  // Сообщение ошибки
  message: string,
  // Маленький текст для уведомления в ОС
  small?: string;
}

type ListenCallback<T> = (event: Message<T>) => void;

export class MessageManager {
  private static managerInstance: MessageManager;
  private static listeners: Map<string, ListenCallback<any>> = new Map();

  constructor() {
    if (MessageManager.managerInstance !== undefined)
      throw new Error("An application can have only one DownloadManager instance");

    listen<Message<any>>("message", event => MessageManager.onEvent(event.payload));
  }

  public static listen<T = any>(
    callback: ListenCallback<T>,
    id: string
  ) {
    this.listeners.set(id, callback);
  };

  private static onEvent(payload: Message<any>) {
    this.listeners.forEach(listener => {
      listener(payload);
    });
  }
}