import React from "react";
import Input from "@/component/input";
import { AppManager } from "@/util/tauri.util";
import { formatError } from "@/util/unsorted.util";
import { WebUtil } from "@/util/web.util";

interface State {
  username?: string;
}

export default class ConfirmTwoFactorAuth extends React.Component<{}, State> {
  static instance: ConfirmTwoFactorAuth;

  state: State = {};

  static setUsername(username?: string) {
    this.instance?.setState({ username });
  }

  static getUsername(): string | undefined {
    return ConfirmTwoFactorAuth.instance.state.username;
  }

  componentDidMount() {
    ConfirmTwoFactorAuth.instance = this;
  }

  static async auth() {
    const username = ConfirmTwoFactorAuth.getUsername();
    const code = (document.getElementById("otp") as HTMLInputElement).value;

    if (code.length != 6)
      return;

    try {
      const res = await fetch(WebUtil.getWebsiteUrl(`api/auth/2fa/login?username=${username}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const body: { is_error?: boolean, message: string } = await res.json();

      if (res.status != 200)
        throw new Error(body.message);

      ConfirmTwoFactorAuth.setUsername();
      //@ts-ignore
      await WebUtil.setSession(body);

      AppManager.launcher();
    } catch (err) {
      AppManager.showError(formatError(err))
    }
  }

  render(): React.ReactNode {
    //@ts-ignore лень фиксить
    if (!this.state.username)
      return <></>;

    return (
      <div
        onClick={() => ConfirmTwoFactorAuth.setUsername()}
        className="overflow-hidden inset-0 size-full fixed flex justify-center items-center z-40 bg-neutral-950/70 back-blur"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          data-tauri-drag-region
          className="relative rounded-lg px-10 py-12 flex justify-center items-center space-x-6 object-cover"
        >
          <div
            className="absolute inset-0 rounded-lg bg-cover bg-center filter saturate-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(src/asset/background/2fa.jpg)",
            }}
          />

          <img className="relative z-10 h-24" src="src/asset/scene/fox.png" />

          <div className="relative z-10 flex flex-col leading-4 space-y-2">
            <span className="text-2xl font-semibold">Двуфакторная аутентификация</span>
            <span className="font-semibold text-neutral-300 text-sm leading-4 max-w-72">Для дальнейшего входа в аккаунт, введите ниже код из вашего приложения для двуфакторной аутентификации (Google Authenticator, Яндекс Ключ, и т.п)</span>
            {/* @ts-ignore */}
            <form action="" onSubmit={e => {e.preventDefault(); ConfirmTwoFactorAuth.auth()}} className="flex space-x-3">
              <Input id="otp" type="otp" autoFocus placeholder="Код из приложения"/>
              <button type="submit" className="px-8 bg-blue-500 hover:bg-blue-600 transition rounded-lg">Войти</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}