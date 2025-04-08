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

interface FriendsStorage {
  requests: UserFriendRequest[],
  friends: UserProfile[];
}

export class FriendsService {
  private static storage: FriendsStorage = {
    requests: [],
    friends: []
  };

  public static async fetch() {
    // cleaning already existed storage
    const id = getSession()?.global_id;

    this.storage = {
      requests: await HttpService.get<UserFriendRequest[]>(getWebsite(`api/user/friends/requests/${id}`)),
      friends: await HttpService.get<UserProfile[]>(getWebsite(`api/user/friends/${id}`))
    };
  };

  public static async accept(user_id: number) {
    const session = getSession();

    await HttpService.post(getWebsite(`api/user/friends/confirm/${user_id}`), { user_id: session?.global_id });
  }

  public static async cancel(user_id: number) {
    const session = getSession();

    await HttpService.post(getWebsite(`api/user/friends/cancel/${user_id}`), { user_id: session?.global_id });
  }

  public static async removeFriend(user_id: number) {
    const session = getSession();

    await HttpService.delete(getWebsite(`api/user/friends/${user_id}`), { user_id: session?.global_id });
  }

  public static addRequest(request: UserFriendRequest) {
    this.storage.requests.push(request);
  }

  public static deleteRequest(id: number) {
    const index = this.getRequestIndex(id);

    if (index < 0) return;

    this.storage.requests.splice(index);
  }


  protected static getRequestIndex(id: number): number {
    const appUserId = getSession()?.global_id;

    return this.storage.requests.findIndex(record => (record.user_id == appUserId ? record.friend_id : record.user_id) == id);
  }

  public static getRequests(): UserFriendRequest[] {
    return this.storage.requests;
  }

  public static getFriends(): UserProfile[] {
    return this.storage.friends;
  }

  protected static getFriendIndex(id: number): number {
    return this.storage.friends.findIndex(record => record.id == id);
  }

  public static getFriend(id: number): UserProfile | undefined {
    return this.storage.friends.find(record => record.id == id);
  }

  public static add(user: UserProfile) {
    const index = this.getFriendIndex(user.id);

    if (index >= 0)
      return this.storage.friends[index] = user;

    this.storage.friends.push(user);
  }

  public static delete(id: number) {
    const index = this.getFriendIndex(id);

    if (index < 0) return;

    this.storage.friends.splice(index);
  }

  public static updateStatus(id: number, status: UserProfileStatus, server?: number) {
    const index = this.getFriendIndex(id);

    console.log(`Updating status of ${index} `);

    if (index < 0) return;

    const user = this.storage.friends[index];

    user.status.status = status;
    user.status.server = server;

    if (status === "Offline")
      // смещение времени, все дела
      user.status.last_seen_at = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString();

    this.add(user);
  };

  public static getCategory(user: UserProfile): FriendCategory {
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