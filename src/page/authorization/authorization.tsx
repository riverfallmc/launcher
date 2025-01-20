import Input from "@/component/input";
import Link from "@/component/link";
import Background from "@/component/window/background";
import { WebUtil } from "@/util/web.util";

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
        }} src="src/assets/scene.png"></img>
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
  const onSubmit = () => {
    // TODO
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 w-[22.5rem]">
      <Input type="text" placeholder="Логин" id="login"/>
      <Input type="password" placeholder="Пароль" id="login"/>
      <div className="flex space-x-2 items-center">
          <Input type="checkbox" id="remember_me"/>
          <label htmlFor="remember_me" className="text-sm text-neutral-500">Запомнить меня</label>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition py-3 w-full rounded-lg">Войти</button>
    </form>
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