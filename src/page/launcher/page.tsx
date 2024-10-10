import React from "react";
import { Settings2 } from "lucide-react";
import { Page, TitleBar, TitleBarButton } from "@/components/page";
import { PlayerProfile } from "./components/playerprofile";
import { NewsList } from "./components/news";
import { ServerList } from "./components/serverlist";
import { Links } from "./components/links";

class Launcher extends React.Component {
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
}

export default Launcher;