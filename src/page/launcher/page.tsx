import React from "react";
import { ApplicationPage } from "@/page/applicationpage";
import { Page, TitleBar } from "@/components/page";
import { PlayerProfile } from "./components/playerprofile";
import { NewsList } from "./components/news";
import { ServerList } from "./components/serverlist";
import { Links } from "./components/links";
import { DrpcActivity, DrpcManager } from "@/util/discord.util";
import Application from "@/app";
import { Settings } from "./components/settings";
import { Downloads } from "./components/downloads";

class Launcher extends ApplicationPage {
  render(): React.ReactNode {
    return (
      <Page>
        <TitleBar>
          <Settings/>
        </TitleBar>

        {/* Container */}
        <div className="size-full flex justify-between">
          <div className="flex flex-col justify-between">
            <PlayerProfile/>
            <NewsList/>
            <ServerList/>
            <Links/>
          </div>

          <div className="mt-auto">
            <Downloads/>
          </div>
        </div>
      </Page>
    )
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Главное меню", Application.version));
  }
}

export default Launcher;