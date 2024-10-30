import React from "react";
import { Settings2 } from "lucide-react";
import { TitleBarButton } from "@/components/page";
import { Window, WindowContent, WindowTrigger } from "./window";
import { Settings, SettingsManager } from "@/util/settings.util";
import { TextEntry } from "@/components/textentry";
import { CheckBox } from "@/components/controllers/base";

SettingsManager.register({
  name: "TextEntry",
  description: "Пример ввода",
  default: "Jopa",
  id: "settings.TextEntryExample"
})

export class SettingsWindow extends React.Component<{}, {isOpened: boolean}> {
  render(): React.ReactNode {
    return (
      <Window title="Настройки">
        <WindowTrigger>
          <TitleBarButton children={Settings2}/>
        </WindowTrigger>
        <WindowContent>
          {Array.from(SettingsManager.getAll().entries()).map((pair) => (
            <Setting setting={pair} />
          ))}
        </WindowContent>
      </Window>
    )
  }
}

interface SettingProps {
  setting: [id: string, Omit<Settings, "id">];
}

class Setting extends React.Component<SettingProps> {
  render(): React.ReactNode {
    let id = this.props.setting[0];
    let settings = this.props.setting[1];

    return (
      <div className="flex justify-between items-center">
        <div className="flex flex-col leading-3">
          <span className="font-medium text-lg text-black dark:text-white/90">{settings.name}</span>
          <span className="font-medium text-xs text-black/80 dark:text-white/70">{settings.description}</span>
        </div>

        <div className="h-auto">
          <SettingControl id={id}/>
        </div>
      </div>
    )
  }
}

class SettingControl extends React.Component<{id: string}> {
  render(): React.ReactNode {
    const {id} = this.props;

    switch (typeof SettingsManager.getDefault(id)) {
      case "boolean":
        return <CheckBox value={SettingsManager.get<boolean>(id)} onChange={(value) => {
          SettingsManager.set(id, value);
        }}/>
      case "string":
        return <TextEntry className="h-2"/>
    }
  }
}

// class Switch extends React.Component {
//   render(): React.ReactNode {
//     return <input type="checkbox"/>
//   }
// }