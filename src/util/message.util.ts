import { listen } from "@tauri-apps/api/event";
import { BaseManager } from "./manager.util";

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

export class MessageManager extends BaseManager {
  private static listeners: Map<string, ListenCallback<any>> = new Map();

  constructor(name: string) {
    super(name);

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