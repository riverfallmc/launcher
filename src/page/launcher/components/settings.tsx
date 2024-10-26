import React from "react";
import { Settings2 } from "lucide-react";
import { TitleBarButton } from "@/components/page";
import { Window, WindowContent, WindowTrigger } from "./window";

export class Settings extends React.Component<{}, {isOpened: boolean}> {
  render(): React.ReactNode {
    return (
      <Window title="Настройки">
        <WindowTrigger>
          <TitleBarButton children={Settings2}/>
        </WindowTrigger>
        <WindowContent>
          test
        </WindowContent>
      </Window>
    )
  }
}

// SettingsController.makeOption({
//   name: "Discord RPC",
//   description: "Simple DRPC toggler",
//   id: "settings.DiscordRichPresence",
//   default: false,
// });