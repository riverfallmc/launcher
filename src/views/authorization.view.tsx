import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input";
import Link from "@/components/link";
import { PageView } from "@/components/pageview";
import { authSchema, authSchemaData } from "@/schema/auth.schema";
import { AuthorizationState, AuthService } from "@/service/auth.service";
import { View, ViewService } from "@/service/view.service";
import { getCredentials } from "@/storage/credentials.storage";
import { getWebsite } from "@/utils/url.util";
import { useEffect } from "react";
import { Window } from "@/components/window";

export function AuthorizationView() {
  return (
    <PageView>
      <div data-tauri-drag-region className="overflow-hidden flex flex-shrink h-screen">
        <Hints />
        <AuthorizationBlock />
        <Window backgroundImage={"/assets/background/default.jpg"}>
          sad
        </Window>
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
  const savedCredentials = getCredentials();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<authSchemaData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: savedCredentials?.password || "",
      password: savedCredentials?.password || "",
      autoLogin: true
    }
  });

  console.log(errors);

  const submitHandler: SubmitHandler<authSchemaData> = async (data) => {
    try {
      switch (await AuthService.authorize(data)) {
        case AuthorizationState.Authorized:
          return ViewService.setView(View.Launcher);
        case AuthorizationState.Need2FA:
          // todo
      }
    } catch (err) {
      console.log(err);
      // todo
    }
  }

  useEffect(() => {
    AuthService.authorizeWithRefresh()
      .then(resp => {
        if (resp === AuthorizationState.Authorized)
          ViewService.setView(View.Launcher);
      })
  })

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3 w-[22.5rem]">
      <input {...register("username")} type="text" placeholder="Никнейм" autoFocus />
      <input {...register("password")} type="password" placeholder="Пароль" />
      <div className="flex space-x-2 items-center">
        <input {...register("autoLogin")} type="checkbox" />
        <label htmlFor="autoLogin" className="text-sm text-neutral-500">
          Заходить автоматически
        </label>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition py-3 w-full rounded-lg">
        Войти
      </button>
    </form>
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