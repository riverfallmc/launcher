import Page, { ApplicationPage } from "@/ui/components/page";
import { Activity, Buttons, Images } from "@/util/discord";
import { ReactNode } from "react";

class Servers<P = {}> extends Page<P> {
  static title: string = "Список серверов";
  static rpc: Activity = new Activity({
    title: Servers.title,
    subtitle: "Смотрит список серверов",
    image: Images.Logo,
    buttons: Buttons.default
  });

  constructor(props: P) {
    super(
      props,
      Servers.title,
      Servers.rpc
    );
  }

  render(): ReactNode {
    return (
      <ApplicationPage title={Servers.title}>
        Hello
      </ApplicationPage>
    )
  }
}

export default Servers;