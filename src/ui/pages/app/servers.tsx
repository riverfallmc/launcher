import { ReactNode } from "react";
import Page, { ApplicationPage } from "component/page";
import Server from "component/server";
import { Activity, Buttons, Images } from "util/discord";
import { Server as IServer } from "util/util";
import { getServerList, getServerListSorted } from "util/server";

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
      let serverList = await getServerListSorted((a, b) => b.online[0] - a.online[0]);

      this.setState({
        serverList
      });
    })();
  }

  protected getEnabledServerCount(): number {
    return this.state.serverList.filter(server => server.enabled).length;
  }

  render(): ReactNode {
    return (
      <ApplicationPage title={Servers.title} subtitle={`Сейчас доступно ${this.getEnabledServerCount()} сервера`}>
        <div className="flex-col size-full scroll grid grid-cols-3 content-start gap-3 overflow-y-auto">
          {this.state.serverList && this.state.serverList.map(server => {
            return <Server {...server}/>
          })}
        </div>
      </ApplicationPage>
    )
  }
}

export default Servers;