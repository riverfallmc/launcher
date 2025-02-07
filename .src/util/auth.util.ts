import { AppManager } from "./tauri.util";

interface AuthSaved {
  username: string,
  password: string,
  refresh: string;
};

export class AuthUtil {
  static logout() {
    this.removeSavedData();
    AppManager.authorization();
  }

  static setSavedData(data: AuthSaved) {
    localStorage.setItem("savedUser", JSON.stringify(data));
  }

  static getSavedData(): AuthSaved | null {
    const data = localStorage.getItem("savedUser");

    if (!data)
      return null;

    return JSON.parse(data);
  }

  static removeSavedData() {
    localStorage.removeItem("savedUser");
  }
}