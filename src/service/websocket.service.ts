import WebSocket from '@tauri-apps/plugin-websocket';
import { getSession } from '@/storage/session.storage';
import { FriendsService } from './friends.service';
import { UserProfile } from '@/storage/user.storage';
import { useEffect } from 'react';

enum WebSocketEventType {
  // Дефолтные ивенты WebSocket

  Close = "Close",

  // Ивенты, связанные с друзьями

  // Пришла заявка в друзья
  FRIEND_REQUEST = "FRIEND_REQUEST",
  // Игрок принят в друзья
  FRIEND_ADD = "FRIEND_ADD",
  // Игрок отменил заявку в друзья,
  FRIEND_CANCEL = "FRIEND_CANCEL",
  // Игрок удален из друзей
  FRIEND_REMOVE = "FRIEND_REMOVE",
  // Друг зашел в сеть
  FRIEND_ONLINE = "FRIEND_ONLINE",
  // Друг вышел из сети
  FRIEND_OFFLINE = "FRIEND_OFFLINE",
  // Друг зашел на сервер
  FRIEND_JOIN_SERVER = "FRIEND_JOIN_SERVER",
  // Друг вышел с игры
  FRIEND_DISCONNECT = "FRIEND_DISCONNECT",

  // Не сгруппированное

  // Приглашение играть на сервер
  INVITE = "INVITE"
}

type EventBody = {
  [WebSocketEventType.FRIEND_REQUEST]: UserProfile,
  [WebSocketEventType.FRIEND_ADD]: UserProfile,

  [WebSocketEventType.FRIEND_CANCEL]: { id: number; };
  [WebSocketEventType.FRIEND_REMOVE]: { id: number; };

  [WebSocketEventType.FRIEND_ONLINE]: { id: number; },
  [WebSocketEventType.FRIEND_OFFLINE]: { id: number; },

  [WebSocketEventType.FRIEND_DISCONNECT]: { id: number; },
  [WebSocketEventType.FRIEND_JOIN_SERVER]: { id: number, server: number; },

  [WebSocketEventType.INVITE]: { id: number, server: number; };
};

type WebSocketEvent = {
  [K in keyof EventBody]: {
    type: K;
    data: EventBody[K];
  };
}[keyof EventBody];

function handleWebsocketMessage(message: WebSocketEvent) {
  const { data, type } = message;

  window.dispatchEvent(new CustomEvent("wssMessage", { detail: message }));

  switch (type) {
    case WebSocketEventType.FRIEND_REMOVE:
      return FriendsService.delete(data.id);

    case WebSocketEventType.FRIEND_CANCEL:
      return FriendsService.delete(data.id);

    case WebSocketEventType.FRIEND_ONLINE:
      return FriendsService.updateStatus(data.id, "Online");

    case WebSocketEventType.FRIEND_OFFLINE:
      return FriendsService.updateStatus(data.id, "Offline");

    case WebSocketEventType.FRIEND_DISCONNECT:
      return FriendsService.updateStatus(data.id, "Online");

    case WebSocketEventType.FRIEND_JOIN_SERVER:
      return FriendsService.updateStatus(data.id, "Playing", data.server);

    case WebSocketEventType.INVITE:
      return;

    case WebSocketEventType.FRIEND_REQUEST:
      return FriendsService.add(data, "Incoming");

    default:
      return FriendsService.add(data);
  }
}

// этот дженерик это пиздец
// сама эта функция это пиздец
// просто пиздец...
export function useWssListener<K extends `${WebSocketEventType}`>(
  eventName: K,
  // @ts-ignore пошел нахуй
  callback: (data: EventBody[K]) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const { data, type } = (event as CustomEvent).detail as WebSocketEvent;

      if (type === eventName) {
        // @ts-ignore пошел нахуй
        callback(data);
      }
    };

    window.addEventListener("wssMessage", listener);

    return () => window.removeEventListener("wssMessage", listener);
  }, []);
}

let ws: WebSocket;

export async function configure() {
  // todo production
  ws = await WebSocket.connect(`ws://riverfall.ru:1487/${getSession()?.global_id}`, {
    headers: {
      "Authorization": getSession()!.jwt
    },
  });

  ws.addListener((msg) => {
    const { data, type }: { data: string, type: "Binary" | "Ping" | "Pong" | "Text" | "Close"; } = typeof msg === "string" ? JSON.parse(msg as string) : msg;

    console.log(msg);

    switch (type) {
      case "Close":
        return console.log(`Соединение было закрыто: ${JSON.parse(data).reason}`);

      case "Text":
        return handleWebsocketMessage(JSON.parse(data));

      default:
        console.log("Skipping WebSocket message");
    }
  });
  // ws.disconnect();
}

export async function sendWssEvent(event: Object) {
  if (!ws)
    return;

  return await ws.send({
    type: "Text",
    data: JSON.stringify(event)
  });
}