import { ReactNode } from "react";
import Page, { ApplicationPage } from "component/page";
import { Activity, Buttons, Images } from "util/discord";
import { Server as IServer } from "util/util";
import { getServerList } from "@/util/server";

interface State {
  serverList: IServer[];
}

class Servers<P = {}> extends Page<P, State> {
  static title: string = "Список серверов";
  static rpc: Activity = new Activity({
    title: Servers.title,
    subtitle: "Смотрит список серверов",
    image: Images.Logo,
    buttons: Buttons.default
  });

  state: State = {
    serverList: []
  };

  constructor(props: P) {
    super(
      props,
      Servers.title,
      Servers.rpc
    );

    (async () => {
      this.setState({
        serverList: await getServerList()
      });
    })();
  }

  render(): ReactNode {
    return (
      <ApplicationPage title={Servers.title}>
        <div className="flex flex-col size-full">
          {this.state.serverList && this.state.serverList.map(server => {
            return <span className="text-white">{server.name}</span>
          })}
        </div>
      </ApplicationPage>
    )
  }
}

export default Servers;