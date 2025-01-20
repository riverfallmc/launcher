import Input from "@/component/input";
import Link from "@/component/link";
import Background from "@/component/window/background";
import { AuthUtil } from "@/util/auth.util";
import { AppManager } from "@/util/tauri.util";
import { formatError } from "@/util/unsorted.util";
import { WebUtil } from "@/util/web.util";
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
        }} src="src/asset/scene/flyisland.png"></img>
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

// TODO @ Сделать окошко для двуфактороной аутентификации
function AuthorizationForm() {
  const authSavedData = AuthUtil.getSavedData();

  const onSubmit = async () => {
    const shouldSave = (document.getElementById("remember_me") as HTMLInputElement)?.checked;
    const user = {
      username: (document.getElementById("username") as HTMLInputElement)?.value,
      password: (document.getElementById("password") as HTMLInputElement)?.value
    };

    try {
      const res = await fetch(WebUtil.getWebsiteUrl("api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const body: {is_error?: boolean, message: string} = await res.json();

      if (res.status != 200)
        throw new Error(body.message);

      if (shouldSave)
        AuthUtil.setSavedData(user);
      else
        AuthUtil.removeSavedData();

      if (body.message && body.message.toLowerCase().includes("2fa"))
        return ConfirmTwoFactorAuth.setUsername(user.username);

      ///@ts-ignore саси хуй0))))0)0
      await WebUtil.setSession(body);

      AppManager.launcher();
    } catch (err: unknown) {
      AppManager.showError(formatError(err));
    }
  }

  useEffect(() => {
    if (authSavedData)
      // на найсычах
      setTimeout(() => {
        onSubmit();
      }, 500);
  })

  return (
    <>
      <div className="space-y-3 w-[22.5rem]">
        <Input type="text" placeholder="Никнейм" id="username" value={authSavedData?.username}/>
        <Input type="password" placeholder="Пароль" id="password" value={authSavedData?.password}/>
        <div className="flex space-x-2 items-center">
          <Input defaultChecked={true} type="checkbox" id="remember_me"/>
          <label htmlFor="remember_me" className="text-sm text-neutral-500">Заходить автоматически</label>
        </div>
        <button onClick={onSubmit} className="bg-blue-500 hover:bg-blue-600 transition py-3 w-full rounded-lg">Войти</button>
      </div>

      {/* <ConfirmTwoFactorAuth/> */}
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