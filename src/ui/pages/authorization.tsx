// Components
import Background from "component/background";
import Form from "component/form";
import Input from "component/input";
import Button from "component/button";
// Utils
import { getWebserverUrl } from "util/util";

function Authorization() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Background isBlurred isBlacked src="src/assets/background.png"/>
      <Form
        method="post"
        action={getWebserverUrl("/api/auth/login")}
        className="fixed"
        title="Авторизация"
        subtitle="Войди в систему сука">
        <div className="flex flex-col space-y-1 text-sm">
          <Input id="username" name="username" type="text" placeholder="Введите никнейм"/>
          <Input id="password" name="password" type="password" placeholder="Введите пароль"/>
          <Button type="submit">Войти</Button>
        </div>
      </Form>
    </div>
  )
}

export default Authorization;