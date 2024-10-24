import React from "react";
import Application from "@/app";
import { ApplicationPage } from "../applicationpage";
import { DrpcManager, DrpcActivity } from "@/util/discord.util";

class Recovery extends ApplicationPage {
  render(): React.ReactNode {
    return <div>Recovery</div>
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Восстанавливает пароль", Application.version));
  }
}

export default Recovery;