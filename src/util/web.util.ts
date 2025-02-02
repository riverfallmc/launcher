interface Session {
  id: number,
  is_active: boolean,
  jwt: string,
  last_activity: string,
  refresh_token: string,
  user_id: number,
  useragent: string;
};

interface User {
  id: number,
  username: string,
  email: string,
  rank: string,
  registered_at: string;
};

export class WebUtil {
  static getWebsiteUrl(uri: string = "") {
    return process.env.NODE_ENV === "production" ? `https://riverfall.ru/${uri}` : `https://localhost/${uri}`;
  }

  static async setSession(session: Session) {
    sessionStorage.setItem("currentSession", JSON.stringify(session));
    sessionStorage.setItem("currentUser", JSON.stringify(await this.requestUser(session)));
  }

  static getSession(): Session | null {
    const session = sessionStorage.getItem("currentSession");

    if (!session)
      return null;

    return JSON.parse(session);
  }

  static async requestUser(session: Session): Promise<User> {
    const res = await fetch(this.getWebsiteUrl(`api/user/user/${session.user_id}`));
    const json = await res.json();

    if (res.status != 200)
      throw new Error(json.message);

    return json as User;
  }

  static getUser(): User | null {
    const session = sessionStorage.getItem("currentUser");

    if (!session)
      return null;

    return JSON.parse(session);
  }

  static getAvatar(username: string): string {
    if (process.env.NODE_ENV === "development")
      return "src/asset/karakal.png";

    return this.getWebsiteUrl(`api/content/avatar/${username}`);
  }
}