import { getWebserverUrl } from "./util";

export interface User {
  username: Readonly<string>,
  token: Readonly<string>;
}

const emptyUser: User = {
  username: "smokingplaya",
  token: "",
};

let userState: User;

export function setUser(user: User) {
  userState = user;
}

export function getUser(): User {
  return userState || emptyUser;
}

export function getAvatarUrl(username?: string): string {
  return "src/assets/karakal.png"; // todo
  // return (username && username.length !== 0) ? getWebserverUrl(`api/cdn/avatar/${username}`) : "src/assets/empty.png";
}