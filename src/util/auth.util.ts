import axios from "axios";
import { getWebsiteUrl } from "./website.util";
import { z } from "zod";
import { invoke } from "@tauri-apps/api/core";

const credentials = {
  withCredentials: true
};

export const authSchema = z.object({
  username: z.string().min(5).max(16, "Длина никнейма должна быть от 5 до 16 символов"),
  password: z.string().min(6).max(32, "Длина пароля должна быть от 6 до 32 символов")
});

export type AuthData = z.infer<typeof authSchema>;

interface Credentials extends AuthData { }

interface SuccessfullResponse {
  accessToken: string;
}

export class Authorization {
  protected static readonly authUrl = getWebsiteUrl("api/auth/login");
  protected static readonly storageKey = "credentials";
  static readonly emptyCredentials: Credentials = {
    username: "",
    password: ""
  };
  /**
   * withArguments
   * * Авторизируется на сервере, получая JWT пользователя
   * @param data Данные пользователя
   * @returns accessToken
   */
  public static async withArguments(
    data: Credentials
  ) {
    try {
      const response = await axios.post(Authorization.authUrl, {
        ...data,
        device: "desktop"
      }, credentials);

      let jwt = (response.data as SuccessfullResponse)?.accessToken;

      await invoke("updateUser", { data: { username: data.username, jwt } });

      Authorization.setCredentials(data);
    } catch (error) {
      // @ts-ignore
      throw error.response ? error.response.data.message : error.message;
    }
  }

  public static getCredentials(): Credentials {
    let credentialsJson = localStorage.getItem(Authorization.storageKey);

    if (!credentialsJson)
      return Authorization.emptyCredentials;

    return JSON.parse(credentialsJson);
  }

  protected static setCredentials(
    credentials: Credentials
  ) {
    let json = JSON.stringify(credentials);

    localStorage.setItem(Authorization.storageKey, json);
  }
}