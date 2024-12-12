// Components
import Form from "component/form";
import Input from "component/input";
import Button from "component/button";
import Page from "component/page";
import SerenityLogo from "@/assets/logo.svg";
// Utils
import { getWebserverUrl } from "util/util";
import { Activity, Images } from "util/discord";
import { ServiceAuth } from "../components/serviceauth";
import Background from "../components/background";

class Authorization<P = {}> extends Page<P> {
  private static title = "Авторизация";
  private static rpc = new Activity({
    title: "В лаунчере",
    subtitle: "Входит в аккаунт",
    image: Images.Logo,
    buttons: []
  });

  constructor(props: P) {
    super(
      props,
      Authorization.title,
      Authorization.rpc
    );
  }

  render() {
    return (
      <div className="w-screen h-screen flex fixed">
        <Background
          blurLevel="xs"
          isBlurred
          isBlacked
          src="src/assets/background.png"/>

        <div data-tauri-drag-region className="w-auto h-full flex flex-col p-7 space-y-3 justify-center items-center bg-violet-800">
          <div className="flex flex-col space-y-5">
            {/* @ts-ignore */}
            <SerenityLogo className="h-8 text-white"/>

            <Form
              method="post"
              action={getWebserverUrl("/api/auth/login")}
              className="bg-transparent p-0 max-w-52"
              title="Авторизация"
              subtitle="Войдите в систему под своим логином">
              <div className="flex flex-col space-y-1 text-sm">
                <Input className="bg-violet-900" id="username" name="username" type="text" placeholder="Введите никнейм"/>
                <Input className="bg-violet-900" id="password" name="password" type="password" placeholder="Введите пароль"/>
                <Button className="bg-violet-900 hover:bg-violet-950" type="submit">Войти</Button>
              </div>
            </Form>
          </div>

          <ServiceAuth/>
        </div>

        <div className="flex justify-center items-center size-full text-white text-2xl font-medium">
          <div className="flex flex-col justify-center items-center w-auto">
            Добро пожаловать на
            <span className="text-violet-500 text-3xl">серенити</span>
            {/* <span className="text-sm font-normal text-center"><span className="text-violet-500">серенити</span> - это проект игровых<br/>серверов в игре Minecraft. Нашим<br/>приоритетом является высокое<br/>качество предоставляемых<br/>серверов и режимов.<br/>Приятной игры!</span> */}
          </div>
        </div>
      </div>
    )
  }
}

export default Authorization;