import axios from "axios";
import { getWebsiteUrl } from "./website.util";
import { z } from "zod";
import { invoke } from "@tauri-apps/api/core";

export const authSchema = z.object({
  username: z.string().min(5).max(16, "Длина никнейма должна быть от 5 до 16 символов"),
  password: z.string().min(6).max(32, "Длина пароля должна быть от 6 до 32 символов")
});

export type AuthData = z.infer<typeof authSchema>;

interface Credentials extends AuthData { }

interface SuccessfullResponse {
  accessToken: string;
}

/**
 * Менеджер авторизации
 */
export class AuthorizationManager {
  /** Ссылка на апи эндпоинт, с которым будет работать метод withArguments для авторизации (получения JWT) */
  protected static readonly authUrl = getWebsiteUrl("api/auth/login");
  /** Айди данных в localStorage */
  protected static readonly storageKey = "credentials";
  /** Пустые значения */
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
      const response = await axios.post(AuthorizationManager.authUrl, {
        ...data,
        device: "desktop"
      }, { withCredentials: true });

      let jwt = (response.data as SuccessfullResponse)?.accessToken;

      await invoke("updateUser", { data: { username: data.username, jwt } });

      AuthorizationManager.setCredentials(data);
    } catch (error) {
      // @ts-ignore
      throw error.response ? error.response.data.message : error.message;
    }
  }

  /**
   * Возвращает данные пользователя из localStorage
   * @returns Данные пользователя
   */
  public static getCredentials(): Credentials {
    let credentialsJson = localStorage.getItem(AuthorizationManager.storageKey);

    if (!credentialsJson)
      return AuthorizationManager.emptyCredentials;

    return JSON.parse(credentialsJson);
  }

  /**
   * Устанавливает/обновляет данные пользователя в localStorage
   * @param credentials Данные пользователя
   */
  protected static setCredentials(
    credentials: Credentials
  ) {
    let json = JSON.stringify(credentials);

    localStorage.setItem(AuthorizationManager.storageKey, json);
  }
}