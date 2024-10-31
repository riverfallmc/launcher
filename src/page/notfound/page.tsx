import React from "react";
import Application, { Pages } from "@/app";
import { ApplicationPage } from "../applicationpage";
import { DrpcManager, DrpcActivity } from "@/util/discord.util";
import { Page } from "@/components/page";
import { Link } from "@/components/link";

class NotFound extends ApplicationPage {
  render(): React.ReactNode {
    return (
      <Page>
        <div className="flex flex-col space-y-3 leading-3 size-full justify-center items-center">
          <span className="text-3xl font-bold text-black dark:text-white">404</span>
          <span className="text-black/50 dark:text-white/55">Тебя здесь не должно быть...</span>

          <Link page={Pages.Authentication}>Вернуться на главную</Link>
        </div>
      </Page>
    )
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Словил 404 ошибку", Application.version));
  }
}

export default NotFound;