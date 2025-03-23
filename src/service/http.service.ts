import { caughtError } from "@/utils/error.util";

export class HttpService {
  static async post<T extends Object>(
    url: string,
    body?: Object,
    authorization?: string,
  ): Promise<Awaited<T>> {
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (authorization) {
        headers["Authorization"] = `Bearer ${authorization}`;
      }

      let response = await fetch(url, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage += ` - ${text}`;
          }
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      throw caughtError(err);
    }
  }

  static async get<T extends Object>(
    url: string,
    authorization?: string,
  ): Promise<Awaited<T>> {
    try {
      let headers: Record<string, string> = {};

      if (authorization) {
        headers["Authorization"] = `Bearer ${authorization}`;
      }

      let response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Ошибка ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage += ` - ${text}`;
          }
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      throw caughtError(err);
    }
  }
}
