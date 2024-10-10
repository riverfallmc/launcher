import React from "react";
import Application, { Pages } from "@/app";
import { ApplicationPage } from "../applicationpage";
import { DrpcManager, DrpcActivity } from "@/discord";

class NotFound extends ApplicationPage {
  render(): React.ReactNode {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="font-extrabold text-4xl">404</p>
          <p className="">Вас не должно быть здесь.</p>
          <a
            onClick={() => Application.changePage(Pages.Default)}
            className="transition cursor-pointer font-bold hover:text-violet-700">Начальная страница</a>
        </div>
      </div>
    )
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Словил 404 ошибку", Application.version));
  }
}

export default NotFound;