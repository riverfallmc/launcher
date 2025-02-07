import { Credentials, getCredentials, setCredentials } from "@/storage/credentials.storage";
import { HttpService } from "./http.service";
import { getWebsite } from "@/utils/url.util";
import { Session } from "@/storage/session.storage";
import { SessionService } from "./session.service";
import { getRefresh } from "@/storage/refresh.storage";

export enum AuthorizationState {
  None,
  Need2FA,
  Authorized
}

export class AuthService {
  public static async authorize(
    credentials: Credentials,
  ): Promise<AuthorizationState> {
    let session = await HttpService.post<Session>(getWebsite("api/auth/login"), credentials);

    setCredentials(credentials);

    if ("message" in session)
      return AuthorizationState.Need2FA;

    await SessionService.save(session);

    return AuthorizationState.Authorized;
  }

  public static async authorizeTwoFactor(
    code: number
  ) {
    let credentials = getCredentials();

    if (!credentials)
      throw new Error("Данные пользователя не были найдены");

    let session = await HttpService.post<Session>(getWebsite(`api/auth/2fa/login?username${credentials.username}`), { code });

    await SessionService.save(session);
  }

  public static async authorizeWithRefresh(): Promise<AuthorizationState> {
    let refresh_jwt = getRefresh();

    if (!refresh_jwt)
      return AuthorizationState.None;

    let session = await HttpService.post<Session>(getWebsite("api/auth/refresh"), { refresh_jwt });

    await SessionService.save(session);

    return AuthorizationState.Authorized;
  }
}