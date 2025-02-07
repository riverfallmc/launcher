import Input from "@/component/input";
import Link from "@/component/link";
import Background from "@/component/window/background";
import { AuthUtil } from "@/util/auth.util";
import { AppManager } from "@/util/tauri.util";
import { Session, WebSender, WebUtil } from "@/util/web.util";
import { useEffect } from "react";
import ConfirmTwoFactorAuth from "./2faconfirm";

function Authorization() {
  return (
    <div data-tauri-drag-region className="overflow-hidden flex flex-shrink h-screen">
      <Background/>
      <BlockHints/>
      <BlockAuthorization/>
    </div>
  )
}

function BlockHints() {
  return (
    <div data-tauri-drag-region className="w-full">
      <div className="absolute overflow-hidden w-[85%] h-screen -z-10">
        <img style={{
          position: "relative",
          left: "-205px",
          bottom: "-40px",
          rotate: "3deg"
        }} src="/assets/scene/flyisland.png"></img>
      </div>
    </div>
  )
}

function BlockAuthorization() {
  return (
    <div data-tauri-drag-region className="w-auto px-12 space-y-8 bg-neutral-900/70 flex flex-col justify-center items-center">
      <AuthorizationTitle/>
      <AuthorizationForm/>
      <AuthorizationLinks/>
    </div>
  )
}

function AuthorizationTitle() {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <span className="text-2xl font-bold text-nowrap">Приветствуем тебя!</span>
      <span className="text-sm font-normal text-nowrap text-center text-neutral-400">Чтобы войти в игру, используйте ваш логин и пароль.</span>
    </div>
  )
}

function AuthorizationForm() {
  const authSavedData = AuthUtil.getSavedData();

  // отправка (авторизация)
  const onSubmit = async () => {
    const shouldSave = (document.getElementById("remember_me") as HTMLInputElement)?.checked;
    const user = {
      username: (document.getElementById("username") as HTMLInputElement)?.value,
      password: (document.getElementById("password") as HTMLInputElement)?.value
    };

    try {
      const body = await WebSender.sendPost<Session>(WebUtil.getWebsiteUrl("api/auth/login"), user);

      if (shouldSave)
        AuthUtil.setSavedData({...user, refresh: body.refresh_token});
      else
        AuthUtil.removeSavedData();

      if ("message" in body && (body.message as string).toLowerCase().includes("2fa"))
        return ConfirmTwoFactorAuth.setUsername(user.username);

      await WebUtil.setSession(body);

      AppManager.launcher();
    } catch (err: unknown) {
      AppManager.showError(err);
    }
  }

  useEffect(() => {
    (async () => {
      if (!authSavedData || !authSavedData.refresh)
        return;

      try {
        const session = await WebSender.sendPost<Session>(WebUtil.getWebsiteUrl("api/auth/refresh"), { refresh_jwt: authSavedData.refresh });

        await WebUtil.setSession(session);

        AppManager.launcher();
      } catch (err) {
        AppManager.showError(err);
      }
    })();
  }, [])

  return (
    <>
      <form onSubmit={e => {e.preventDefault(); onSubmit()}} className="space-y-3 w-[22.5rem]">
        <Input type="text" placeholder="Никнейм" id="username" autoFocus defaultValue={authSavedData?.username}/>
        <Input type="password" placeholder="Пароль" id="password" defaultValue={authSavedData?.password}/>
        <div className="flex space-x-2 items-center">
          <Input defaultChecked={true} type="checkbox" id="remember_me"/>
          <label htmlFor="remember_me" className="text-sm text-neutral-500">Заходить автоматически</label>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition py-3 w-full rounded-lg">Войти</button>
      </form>
    </>
  )
}

function OtherLink(props: {children: string, href: string}) {
  return <Link {...props} className="text-neutral-500"/>
}

function AuthorizationLinks() {
  return (
    <div className="flex justify-between w-full px-8">
      <OtherLink href={WebUtil.getWebsiteUrl("register")}>Регистрация</OtherLink>
      <OtherLink href={WebUtil.getWebsiteUrl("recovery")}>Забыли пароль?</OtherLink>
    </div>
  )
}

export default Authorization;