import { User } from "@/storage/user.storage";
import { HttpService } from "./http.service";
import { getWebsite } from "@/utils/url.util";

export class UserService {
  static async getUser(id: number, jwt: string): Promise<User> {
    return HttpService.get(getWebsite(`api/user/user/${id}`), jwt);
  }
}