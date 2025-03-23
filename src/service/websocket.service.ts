import WebSocket from '@tauri-apps/plugin-websocket';
import { getSession } from '@/storage/session.storage';

enum WebSocketEventType {
  // Дефолтные ивенты WebSocket

  Close = "Close",

  // Ивенты, связанные с друзьями

  // Пришла заявка в друзья
  FRIEND_REQUEST = "FRIEND_REQUEST",
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

type BodyWithId = {
  id: number;
};

interface BodyWithServer extends BodyWithId {
  server_id: number;
}

type EventBody = {
  [WebSocketEventType.Close]: { code: number, reason: string; },
  [WebSocketEventType.FRIEND_REQUEST]: BodyWithId,
  [WebSocketEventType.FRIEND_ONLINE]: BodyWithId,
  [WebSocketEventType.FRIEND_OFFLINE]: BodyWithId,
  [WebSocketEventType.FRIEND_DISCONNECT]: BodyWithId,
  [WebSocketEventType.FRIEND_JOIN_SERVER]: BodyWithServer,
  [WebSocketEventType.INVITE]: BodyWithServer;
};

type WebSocketEvent = {
  [K in keyof EventBody]: {
    type: K;
    data: EventBody[K];
  };
}[keyof EventBody];

export async function configure() {
  const ws = await WebSocket.connect('ws://localhost:1400/1', {
    headers: {
      "Authorization": getSession()!.jwt
    }
  });

  ws.addListener((msg) => {
    const { data, type }: WebSocketEvent = typeof msg === "string" ? JSON.parse(msg as string) : msg;

    switch (type) {
      case (WebSocketEventType.Close):
        console.log(`Соединение было закрыто: ${data.reason}`);
      // todo
    }

    console.log('Received Message:', msg.data);
  });

  ws.disconnect();
}