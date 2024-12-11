import Page, { ApplicationPage } from "@/ui/components/page";
import { Activity, Buttons, Images } from "@/util/discord";
import { ReactNode } from "react";

class Downloads<P = {}> extends Page<P> {
  static title: string = "Загрузки";
  static rpc: Activity = new Activity({
    title: Downloads.title,
    subtitle: "Смотрит скачиваемые клиенты",
    image: Images.Logo,
    buttons: Buttons.default
  });

  constructor(props: P) {
    super(
      props,
      Downloads.title,
      Downloads.rpc
    );
  }

  render(): ReactNode {
    return (
      <ApplicationPage title={Downloads.title}>
        Hello
      </ApplicationPage>
    )
  }
}

export default Downloads;