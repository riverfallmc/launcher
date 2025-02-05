export interface Session {
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
    //if (process.env.NODE_ENV === "development")
    //  return "/assets/karakal.png";

    return this.getWebsiteUrl(`api/session/skin/${username}.png`);
  }
}

export class WebSender {
  public static async sendPost<T extends Object>(url: string, body: Object): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.status !== 200)
      throw await this.errorHandler(response);

    return response.json();
  }

  protected static async errorHandler(response: Response): Promise<Error> {
    const type = response.headers.get("Content-Type") || "";

    if (type.includes("application/json")) {
      try {
        const body = await response.json() as { is_error?: boolean; message?: string; };
        return new Error(body.is_error ? body.message || "Неизвестная ошибка" : "Ошибка без флага is_error");
      } catch {
        return new Error("Ошибка парсинга JSON");
      }
    }

    const text = await response.text();
    return new Error(`Ошибка: ${text || "Пустой ответ от сервера"}`);
  }
}