export type User = {
  id: number,
  user_id: number,
  username: string,
  email: string,
  rank: string,
  registered_at: string;
};

export type UserProfileStatus = "Online" | "Playing" | "Offline";

export type UserFriendRequest = "Incoming" | "Outcoming";

export interface UserProfile {
  id: number,
  username: string,
  rank: string,
  status: {
    status: UserProfileStatus,
    server?: number,
    last_seen_at?: string;
  },
  registered_at: string;
  // custom
  request: UserFriendRequest;
}

const key = "user";

export function setUser(
  user: User
) {
  return localStorage.setItem(key, JSON.stringify(user));
}

export function getUser(): User | null {
  let data = localStorage.getItem(key);

  if (!data)
    return null;

  return JSON.parse(data);
}

export function removeUser() {
  localStorage.removeItem(key);
}