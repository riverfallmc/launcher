import Page, { ApplicationPage } from "@/ui/components/page";
import { Activity, Buttons, Images } from "@/util/discord";
import { ReactNode } from "react";

class Settings<P = {}> extends Page<P> {
  static title: string = "Настройки лаунчера";
  static rpc: Activity = new Activity({
    title: Settings.title,
    subtitle: "Меняет настройки",
    image: Images.Logo,
    buttons: Buttons.default
  });

  constructor(props: P) {
    super(
      props,
      Settings.title,
      Settings.rpc
    );
  }

  render(): ReactNode {
    return (
      <ApplicationPage title={Settings.title}>
        Hello
      </ApplicationPage>
    )
  }
}

export default Settings;