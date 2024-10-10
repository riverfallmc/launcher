import React from "react";
import { Settings2 } from "lucide-react";
import { ApplicationPage } from "@/page/applicationpage";
import { Page, TitleBar, TitleBarButton } from "@/components/page";
import { PlayerProfile } from "./components/playerprofile";
import { NewsList } from "./components/news";
import { ServerList } from "./components/serverlist";
import { Links } from "./components/links";
import { DrpcActivity, DrpcManager } from "@/discord";
import Application from "@/app";

class Launcher extends ApplicationPage {
  render(): React.ReactNode {
    return (
      <Page>
        <TitleBar>
          <TitleBarButton children={Settings2}/>
        </TitleBar>

        <PlayerProfile/>
        <NewsList/>
        <ServerList/>
        <Links/>
      </Page>
    )
  }

  onPageSelected(): void {
    DrpcManager.updateActivity(new DrpcActivity("Главное меню", Application.version));
  }
}

export default Launcher;