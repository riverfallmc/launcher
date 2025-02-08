import { removeSession, Session, setSession } from "@/storage/session.storage";
import { removeUser, setUser } from "@/storage/user.storage";
import { UserService } from "./user.service";
import { removeRefresh, setRefresh } from "@/storage/refresh.storage";
import { removeCredentials } from "@/storage/credentials.storage";

export class SessionService {
  static async save(
    session: Session
  ) {
    setUser(await UserService.getUser(session.user_id, session.jwt));
    setRefresh(session.refresh_token);
    setSession(session);
  }

  static clear() {
    removeCredentials();
    removeRefresh();
    removeSession();
    removeUser();
  }
}