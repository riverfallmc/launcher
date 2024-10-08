import { Page, TitleBar, TitleBarButton } from "@/components/page";
import { Settings2 } from "lucide-react";
import React from "react";

class Launcher extends React.Component {
  render(): React.ReactNode {
    return (
      <Page>
        <TitleBar>
          <TitleBarButton children={Settings2}/>
        </TitleBar>
      </Page>
    )
  }
}

export default Launcher;