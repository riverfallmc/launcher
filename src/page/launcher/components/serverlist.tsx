import React from "react";

interface ServerDetails {
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
  gradient: string;
}

export class ServerList extends React.Component<{}, {servers: ServerDetails[]}> {
  componentDidMount() {
    ServerList.requestServers()
      .then(servers => this.setState({servers}))
      .catch(console.error);
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
        },
        {
          name: "TECHNO MAGIC",
          clientId: "farmer",
          version: "1.18.2",
          players: 0,
          maxPlayers: 128,
          isEnabled: true,
          gradient: "linear-gradient(147.15deg, #4568DC 0%, #B06AB3 80.38%)",
        },
        {
          name: "SURVIVAL",
          clientId: "farmer",
          version: "1.18.2",
          players: 0,
          maxPlayers: 64,
          isEnabled: false,
          gradient: "linear-gradient(147.15deg, #FFAFBD 0%, #C9009D 80.38%)",
        }
      ]);
    });
  }

  /** Конвертирует список новостей из стейта компонента в ReactNode */
  private renderServers(): React.ReactNode {
    return (
      <>
        {this.state && this.state.servers && this.state.servers.map(server => <Server server={server}/>)}
      </>
    );
  }

  render(): React.ReactNode {
    return <div className="w-full flex flex-col space-y-1">
      <span className="uppercase text-xl font-bold">Наши сервера</span>

      <div className="flex space-x-3" children={this.renderServers()}/>
    </div>
  }
}

// Server component

class Server extends React.Component<{server: ServerDetails}> {
  // todo сделать сортировку по isEnabled
  render(): React.ReactNode {
    return (
      <div
        className={"w-28 h-24 p-2 rounded-lg shadow-black-extended cursor-pointer transition-all duration-300 ease-in-out " + (this.props.server.isEnabled ? "": "saturate-0")}
        style={{
          background: this.props.server.gradient,
          backgroundSize: "100%",
          transition: "background-size 0.3s ease-in-out"
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundSize = "200%";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundSize = "100%";
        }}>
          <div className="h-full flex flex-col justify-between">
            <p className="text-white font-bold text-base leading-4 text-shadow-lg">{this.props.server.name}</p>
            <div className="flex flex-col text-right ">
              <p className="text-xs text-white/70 font-semibold leading-none text-shadow-md">{this.props.server.version}</p>
              <p className="text-sm text-white font-semibold leading-none text-shadow-lg">{this.props.server.isEnabled ? `${this.props.server.players}/${this.props.server.maxPlayers}` : "выключен"}</p>
            </div>
          </div>
      </div>
    )
  }
}