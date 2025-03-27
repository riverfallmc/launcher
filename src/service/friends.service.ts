import { getWebsite } from "@/utils/url.util";
import { HttpService } from "./http.service";
import { getSession } from "@/storage/session.storage";
import { UserFriendRequest, UserProfile, UserProfileStatus } from "@/storage/user.storage";
import { formatLastSeen } from "@/utils/data.util";
import { ServerService } from "./game/server.service";

export enum FriendCategory {
  Request, // запрос в друзья
  Online, // онлайн
  Offline // оффлайн
}

export class FriendsService {
  private static storage: UserProfile[] = [];

  public static async fetch() {
    const friends = await HttpService.get<UserProfile[]>(getWebsite(`api/user/friends/${getSession()?.global_id}`));

    this.storage = friends;
  };

  public static getFriends(): UserProfile[] {
    return this.storage;
  }

  protected static getFriendIndex(id: number): number {
    return this.storage.findIndex(record => record.id == id);
  }

  public static getFriend(id: number): UserProfile | undefined {
    return this.storage.find(record => record.id == id);
  }

  public static add(user: UserProfile, request?: UserFriendRequest) {
    const index = this.getFriendIndex(user.id);

    if (request)
      user.request = request;

    if (index >= 0) {
      return this.storage[index] = user;
    }

    this.storage.push(user);
  }

  public static delete(id: number) {
    const index = this.getFriendIndex(id);

    if (index < 0) return;

    this.storage.splice(index);
  }

  public static updateStatus(id: number, status: UserProfileStatus, server?: number) {
    const index = this.getFriendIndex(id);

    if (index < 0) return;

    const user = this.storage[index];

    user.status.status = status;
    user.status.server = server;

    if (status === "Offline")
      // смещение времени, все дела
      user.status.last_seen_at = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString();

    this.add(user);
  };

  public static getCategory(user: UserProfile): FriendCategory {
    if (user.request)
      return FriendCategory.Request;

    return user.status.status == "Offline" ? FriendCategory.Offline : FriendCategory.Online;
  }

  public static getCategoryTitle(category: FriendCategory): string {
    switch (category) {
      case FriendCategory.Request: return "Запросы в друзья";
      case FriendCategory.Online: return "В сети";
      case FriendCategory.Offline: return "Не в сети";
    }
  }

  public static async getStatusLabel(user: UserProfile): Promise<string> {
    // if (user.request)
    //   return "26.03 в 16:05";

    switch (user.status.status) {
      case "Online":
        return "В сети";
      case "Offline":
        return formatLastSeen(user.status.last_seen_at as string);
      case "Playing":
        return `Играет на ${(await ServerService.getServer(() => { }, user.status.server as number))?.name}`;
    }
  }
}

export async function configure() {
  await FriendsService.fetch();
}