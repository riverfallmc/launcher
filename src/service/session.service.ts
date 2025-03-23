import { getSession, removeSession, Session, setSession } from "@/storage/session.storage";
import { removeUser, setUser } from "@/storage/user.storage";
import { UserService } from "./user.service";
import { removeRefresh, setRefresh } from "@/storage/refresh.storage";
import { removeCredentials } from "@/storage/credentials.storage";
import { getTimestamp, minutes } from "@/utils/data.util";
import { AuthorizationState, AuthService } from "./auth.service";

type JWTPayload = {
  sub: string,
  exp: number,
  refresh: false
}

export class SessionService {
  static async save(
    session: Session,
  ) {
    setUser(await UserService.getUser(session.global_id, session.jwt));
    setRefresh(session.refresh_token);
    setSession(session);
  }

  static clear() {
    removeCredentials();
    removeRefresh();
    removeSession();
    removeUser();
  }

  public static async validateSession(): Promise<boolean> {
    let session = getSession();

    if (!session)
      return false;

    let payload = session.jwt
      .split(".")[1];

    let encoded = atob(payload);

    let data: JWTPayload = JSON.parse(encoded)

    // если со временем всё в порядке, то возвращаем true, типо всё ок
    if (data.exp > (getTimestamp() + minutes(10)))
      return true;

    // если с временем не всё в порядке, то
    // обновляем сессию через refreshToken
    try {
      switch (await AuthService.authorizeWithRefresh()) {
        case AuthorizationState.Authorized:
          return true
        default:
          return false
      }
    } catch (err) {
      console.error(err);

      return false;
    }
  }
}