interface User {
  id: number,
  username: string,
  jwt: string,
  refresh: string,
};

export class WebUtil {
  static user: User;

  static getWebsiteUrl(uri: string = "") {
    return process.env.NODE_ENV === "production" ? `https://riverfall.ru/${uri}` : `http://localhost/${uri}`;
  }

  static setUser(user: User) {
    this.user = user;
  }

  static getUser(): User | null {
    // return this.user;
    return {
      id: 0,
      username: "smxkkkin",
      jwt: "",
      refresh: ""
    };
  }

  static getAvatar(username: string): string {
    if (process.env.NODE_ENV === "development")
      return "src/assets/karakal.png";

    return this.getWebsiteUrl(`api/content/avatar/${username}`);
  }
}