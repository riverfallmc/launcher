import { Session, setSession } from "@/storage/session.storage";
import { setUser } from "@/storage/user.storage";
import { UserService } from "./user.service";
import { setRefresh } from "@/storage/refresh.storage";

export class SessionService {
  static async save(
    session: Session
  ) {
    setUser(await UserService.getUser(session.user_id, session.jwt));
    setRefresh(session.refresh_token);
    setSession(session);
  }
}