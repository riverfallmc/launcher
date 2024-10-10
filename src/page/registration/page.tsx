import React from "react";
import { ApplicationPage } from "../applicationpage";
import Application from "@/app";
import { DrpcManager, DrpcActivity } from "@/discord";

class Registration extends ApplicationPage {
  render(): React.ReactNode {
    return <div>Registration</div>
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Регистрируется", Application.version));
  }
}

export default Registration;