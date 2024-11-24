import React from "react";
import Application, { Pages } from "@/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApplicationPage } from "@/page/applicationpage";
import { DrpcActivity, DrpcManager } from "@/util/discord.util";
import { Background } from "../../components/background";
import { getWebsiteUrl } from "@/util/website.util";
import { className } from "@/util/classname.util";
import { FaGithub, FaVk } from "react-icons/fa6";
import { AuthData, AuthorizationManager, authSchema } from "@/util/auth.util";

const AuthenticationPage: React.FC<{onSubmit: (data: AuthData) => Promise<void>}> = ({onSubmit}) => {
  const {
    register,
    handleSubmit,
    // @ts-ignore
    formState: { errors },
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema)
  });

  // Получаем данные пользователя
  // В случае если он уже ранее авторизовывался
  const {
    username,
    password
  } = AuthorizationManager.getCredentials();

  return (
    <main className="flex h-screen justify-between">
      <Background src="/src/assets/image/background.gif"/>

      {/* Дополнительный контент */}
      <div className="z-10 size-full p-8">
        Дополнительный контент
      </div>
      {/* Форма авторизации */}
      <div className="flex z-10 justify-center items-center w-auto h-full bg-white dark:bg-neutral-900 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col leading-5">
            <Title>Авторизация</Title>
            <Subtitle>
              Впервые у нас? <Link href={getWebsiteUrl("register")}>Создай аккаунт!</Link>
            </Subtitle>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Textbox
              placeholder="Логин"
              {...register("username")} defaultValue={username}/>

            <Textbox
              placeholder="Пароль"
              type="password"
              {...register("password")} defaultValue={password}/>

            <div className="flex space-x-2 h-9">
              <Button
                className="flex-1"
                type="submit"
                children="Войти"
              />
              {/* Авторизация через VK */}
              <Link href={getWebsiteUrl("oauth/vk")}>
                <Button
                  className="w-10 flex items-center justify-center"
                  title="Войти через VK"
                  children={<FaVk/>}
                />
              </Link>
              {/* Авторизация через GitHub */}
              <Link href={getWebsiteUrl("oauth/github")}>
                <Button
                  className="w-10 flex items-center justify-center"
                  title="Войти через GitHub"
                  children={<FaGithub/>}
                />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

class Authentication extends ApplicationPage {
  private static async authorization(
    data: AuthData
  ) {
    try {
      await AuthorizationManager.withArguments(data);

      Application.changePage(Pages.Launcher);
    } catch (error) {
      Application.showErrorInUI({
        message: String(error),
      });
    }
  }

  render(): React.ReactNode {
    return <AuthenticationPage onSubmit={Authentication.authorization}/>
  }

  onPageSelected() {
    DrpcManager.updateActivity(new DrpcActivity("Авторизируется", Application.version));
  }
}

function Title({children}: {children?: React.ReactNode}) {
  return <span className="text-black dark:text-white text-2xl font-bold">{children}</span>
}

function Subtitle({children}: {children?: React.ReactNode}) {
  return <span className="text-sm text-black dark:text-white whitespace-nowrap">{children}</span>
}

function Link(props: {
  children?: React.ReactNode,
  target?: React.HTMLAttributeAnchorTarget,
  href: string
}) {
  return <a className="size-auto font-medium transition text-violet-400 hover:text-violet-300" {...props} target={props.target || "_blank"}/>
}

const textBoxClass = "w-full font-medium text-sm py-2 px-3 rounded-lg focus:outline-none bg-neutral-100 dark:bg-neutral-950/30 text-black dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700";

/** TextBox */
const Textbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    return <input {...props} ref={ref} className={className(textBoxClass, props.className)} />;
  }
);

const buttonClass = "h-full text-sm p-2 rounded-lg bg-neutral-100 dark:bg-neutral-950/30 text-black dark:text-white"

/** Button */
function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return <button {...props} className={className(buttonClass, props.className)}/>
}

export default Authentication;