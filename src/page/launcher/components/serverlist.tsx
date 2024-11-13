import React from "react";
import Application, { Pages } from "@/app";

export interface ServerDetails {
  /** Название сервера */
  name: string,
  /** ID Клиента */
  clientId: string,
  /** Версия клиента */
  version: string,
  /** Текущий онлайн на сервере */
  players: number,
  /** Максимально возможный онлайн на сервере */
  maxPlayers: number,
  /** Включен ли вообще сервер */
  isEnabled: boolean,
  /** Градиент стиль для фона */
  gradient: string,
  /** Айпи сервера */
  ip: string,
  /** Фон в ServerPage */
  bgUrl: string,
  /** Описание сервера */
  description: string;
}

const textDesc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam enim felis, efficitur et dui ut, mattis mattis felis. Nulla facilisi. Sed faucibus egestas ipsum a vulputate. Curabitur at odio quis est fermentum consequat."

export class ServerList extends React.Component<{}, {servers: ServerDetails[]}> {
  componentDidMount() {
    ServerList.requestServers()
      .then(servers => this.setState({servers}))
      // .catch(console.error);
  }

  // todo
  private static async requestServers(): Promise<ServerDetails[]> {
    return new Promise(res => {
      res([
        {
          name: "FARMER PARADISE",
          clientId: "farmer",
          version: "1.16.5",
          players: 0,
          maxPlayers: 10,
          isEnabled: true,
          gradient: "linear-gradient(147.15deg, #CDD353 0%, #77B800 80.38%)",
          ip: "0.0.0.0:25565",
          description: textDesc,
          bgUrl: "https://i.tlauncher.org/images/tmphmamuzd4.png?rand=1569096381"
        },
        {
          name: "TECHNO MAGIC",
          clientId: "farmer",
          version: "1.18.2",
          players: 0,
          maxPlayers: 128,
          isEnabled: true,
          gradient: "linear-gradient(147.15deg, #4568DC 0%, #B06AB3 80.38%)",
          ip: "localhost",
          description: textDesc,
          bgUrl: "https://www.meme-arsenal.com/memes/548967e1bf6a8c8384ae2344725828fc.jpg"
        },
        {
          name: "SURVIVAL",
          clientId: "farmer",
          version: "1.18.2",
          players: 0,
          maxPlayers: 64,
          isEnabled: false,
          gradient: "linear-gradient(147.15deg, #FFAFBD 0%, #C9009D 80.38%)",
          ip: "localhost",
          description: textDesc,
          bgUrl: "https://i.ytimg.com/vi/nJMTBCMWcE4/maxresdefault.jpg"
        }
      ]);
    });
  }

  /** Конвертирует список новостей из стейта компонента в ReactNode */
  private renderServers(): React.ReactNode {
    return (
      <>
        {this.state && this.state.servers && this.state.servers.map(server => <Server {...server}/>)}
      </>
    );
  }

  render(): React.ReactNode {
    return <div className="w-full flex flex-col space-y-1">
      <span className="uppercase text-xl font-bold text-black dark:text-white">Наши сервера</span>

      <div className="flex space-x-3" children={this.renderServers()}/>
    </div>
  }
}

// Server component
class Server<T extends ServerDetails> extends React.Component<T> {
  // Открывает страницу сервера
  private static open(data: ServerDetails) {
    Application.setCurrentServer(data);
    Application.changePage(Pages.Server);
  }

  // todo сделать сортировку по isEnabled
  render(): React.ReactNode {
    return (
      <>
        <div
          title={`Сервер ${this.props.name}`}
          className={"w-28 h-24 p-3 rounded-xl shadow-black-extended cursor-pointer transition-all duration-300 ease-in-out " + (this.props.isEnabled ? "": "saturate-0")}
          style={{
            background: this.props.gradient,
            backgroundSize: "100%",
            transition: "background-size 0.3s ease-in-out"
          }}
          onClick={() => Server.open(this.props)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundSize = "200%";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundSize = "100%";
          }}>
            <div className="h-full flex flex-col justify-between">
              <p className="text-white font-bold text-base leading-4 text-shadow-lg">{this.props.name}</p>
              <div className="flex flex-col text-right">
                <p className="text-xs text-white/70 font-semibold leading-none text-shadow-md">{this.props.version}</p>
                <p className="text-sm text-white font-semibold leading-none text-shadow-lg">{this.props.isEnabled ? `${this.props.players}/${this.props.maxPlayers}` : "выключен"}</p>
              </div>
            </div>
        </div>
      </>
    )
  }
}