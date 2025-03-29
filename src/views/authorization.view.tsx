import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import Link from "@/components/link";
import { PageView } from "@/components/pageview";
import { authSchema, authSchemaData } from "@/schema/auth.schema";
import { AuthorizationState, AuthService } from "@/service/auth.service";
import { View, ViewService } from "@/service/view.service";
import { getCredentials } from "@/storage/credentials.storage";
import { getWebsite } from "@/utils/url.util";
import { useEffect, useState } from "react";
import { useError } from "@/components/error";
import { caughtError } from "@/utils/error.util";
import { TwoFactorWindow } from "@/components/window/twofactor";
import { DiscordService } from "@/service/discord/discord.service";

export function AuthorizationView() {
  useEffect(() => {
    (async () => {
      await DiscordService.updateActivity("Authorization");
    })();
  }, [])

  return (
    <PageView>
      <div data-tauri-drag-region className="overflow-hidden flex flex-shrink h-screen">
        <Hints />
        <AuthorizationBlock />
      </div>
    </PageView>
  );
}

function Hints() {
  return (
    <div data-tauri-drag-region className="w-full">
      <div className="absolute overflow-hidden w-[85%] h-screen -z-10">
        <img
          className="relative -left-[205px] -bottom-[40px] rotate-[3deg]"
          src="/assets/scene/flyisland.png"
          alt="Background"
        />
      </div>
    </div>
  );
}

function AuthorizationBlock() {
  return (
    <div data-tauri-drag-region className="w-auto px-12 space-y-8 bg-neutral-900/70 flex flex-col justify-center items-center">
      <AuthorizationTitle />
      <AuthorizationForm />
      <AuthorizationLinks />
    </div>
  );
}

function AuthorizationTitle() {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <span className="text-2xl font-bold">Приветствуем тебя!</span>
      <span className="text-sm font-normal text-center text-neutral-400">
        Чтобы войти в игру, используйте ваш логин и пароль.
      </span>
    </div>
  );
}

function AuthorizationForm() {
  const setError = useError();
  const savedCredentials = getCredentials();
  const [waitForTwoFactor, setWaitForTwoFactor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted }
  } = useForm<authSchemaData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: savedCredentials?.username,
      password: savedCredentials?.password,
      autoLogin: true
    }
  });

  const submitHandler: SubmitHandler<authSchemaData> = async (data) => {
    try {
      let response = await AuthService.authorize(data);

      switch (response) {
        case AuthorizationState.Authorized:
          return ViewService.setView(View.Launcher);
        case AuthorizationState.Need2FA:
          return setWaitForTwoFactor(true);
      }
    } catch (err) {
      setError(caughtError(err).message);
    }
  };

  useEffect(() => {
    AuthService.authorizeWithRefresh()
      .then(resp => {
        if (resp === AuthorizationState.Authorized)
          ViewService.setView(View.Launcher);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)} action="" className="space-y-3 w-[22.5rem]">
        <Input {...register("username")} type="text" placeholder="Никнейм" autoFocus />
        <Input {...register("password")} type="password" placeholder="Пароль" />
        {isSubmitted && errors && (
          <p className="text-red-500 text-sm">{Object.values(errors)[0]?.message}</p>
        )}
        <div className="flex space-x-2 items-center">
          <Input {...register("autoLogin")} id="autoLogin" type="checkbox" />
          <label htmlFor="autoLogin" className="text-sm text-neutral-500 cursor-pointer">
            Заходить автоматически
          </label>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition py-3 w-full rounded-lg">
          Войти
        </button>
      </form>

      {
        waitForTwoFactor && <TwoFactorWindow onClick={() => setWaitForTwoFactor(false)}/>
      }
    </>
  );
}


function OtherLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <Link {...props} className="text-neutral-500"></Link>;
}

function AuthorizationLinks() {
  return (
    <div className="flex justify-between w-full px-8">
      <OtherLink href={getWebsite("register")}>Регистрация</OtherLink>
      <OtherLink href={getWebsite("recovery")}>Забыли пароль?</OtherLink>
    </div>
  );
}