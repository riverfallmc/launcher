import React from "react";
import { Pages } from "@/app";
import { ApplicationPage } from "@/page/applicationpage";
import { Page, TitleBar } from "component/page";
import { TextEntryLabeled } from "component/textentry";
import { OAuth, OAuthService } from "component/oauth";
import { Button } from "component/button";
import { Link } from "component/link";
// Icons
import { LogIn } from "lucide-react";
import VkLogo from "@/assets/logo/services/vk.svg";
import YandexLogo from "@/assets/logo/services/yandex.svg";
import DiscordLogo from "@/assets/logo/services/discord.svg";
import SteamLogo from "@/assets/logo/services/steam.svg";

class Authentication extends ApplicationPage {
  render(): React.ReactNode {
    return (
      <Page>
        <TitleBar/>
        <div className="h-full pb-10 flex justify-center items-center">
          <div className="w-auto h-auto min-w-80 flex flex-col space-y-2 rounded-xl border p-7 border-solid border-neutral-200">
            <div className="flex flex-col">
              <span className="font-bold text-xl uppercase">Авторизация</span>
              <span className="text-sm">Впервые у нас? <Link page={Pages.Registration} children="Создать аккаунт"/></span>
            </div>

            <form className="space-y-2">
              <TextEntryLabeled placeholder="Ваш ник или почта" text="Логин"/>
              <TextEntryLabeled placeholder="Ваш пароль" type="password" text="Пароль">
                <Link className="text-sm font-normal" page={Pages.PasswordRecovery} children="Забыли пароль?" />
              </TextEntryLabeled>

              {/* кнопка войти */}
              <Button className="w-full py-2 flex justify-center gap-x-2"><LogIn className="w-4"/>Войти</Button>
            </form>

            {/* oauth / авторизация через стороние сервисы */}
            <OAuth>
              <OAuthService svg={YandexLogo}/>
              <OAuthService svg={VkLogo}/>
              <OAuthService svg={DiscordLogo}/>
              <OAuthService svg={SteamLogo}/>
            </OAuth>
          </div>
        </div>
      </Page>
    )
  }

  onPageSelected() {}
}

export default Authentication;