import React from "react";
import { Page, TitleBar, TitleBarButton } from "@/components/page";
import { PlayerProfile } from "./components/profile/playerprofile";
import { Settings2 } from "lucide-react";
import { News, NewsPlaceholder } from "./components/news/news";

class Launcher extends React.Component {
  render(): React.ReactNode {
    return (
      <Page>
        <TitleBar>
          <TitleBarButton children={Settings2}/>
        </TitleBar>

        <PlayerProfile/>

        <NewsPlaceholder>
          <News
            title="15% скидка"
            shortDescription="В честь открытия нашего проекта мы делимся с вами купоном на скидку 15% при покупке доната!"
            url="https://vk.com/"
            imageUrl=""
            clipboardText="ебать пенис молочный"/>
            <News
            title="Заголовок"
            shortDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis scelerisque eros. Curabitur condimentum quis"
            url="https://vk.com/"
            imageUrl=""/>
        </NewsPlaceholder>
      </Page>
    )
  }
}

export default Launcher;