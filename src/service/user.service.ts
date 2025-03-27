import { User, UserProfile } from "@/storage/user.storage";
import { HttpService } from "./http.service";
import { getWebsite } from "@/utils/url.util";

export class UserService {
  static async getUser(id: number, jwt: string): Promise<User> {
    return HttpService.get(getWebsite(`api/user/user/${id}`), jwt);
  }

  static async getUserProfile(id: number, jwt: string): Promise<UserProfile> {
    return await HttpService.get(getWebsite(`api/user/profile/${id}`), jwt);
  }
}