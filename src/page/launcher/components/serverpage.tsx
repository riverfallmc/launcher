import React from "react";
import ReactDOM from "react-dom";
import { EllipsisVertical, Undo2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { PlayManager } from "@/util/play.util";
import { DownloadsManager } from "@/util/downloads.util";

interface ServerProps {
  // ClientID
  clientId: string,
  // Название сервера
  name: string,
  // Картинка для фона
  bgUrl: string,
  // Открыто ли окно
  isOpen: boolean,
  // Описание клиента
  description: string,
  // Айпи сервера
  ip: string,
  // Закрываем нахуй
  onClose: () => void;
}

export class ServerPage<T extends ServerProps> extends React.Component<T> {
  render(): React.ReactNode {
    if (!this.props.isOpen)
      return <></>;

    return ReactDOM.createPortal(<ServerPageElement {...this.props}/>, document.body);
  }
}

interface Mod {
  name: string,
  icon: string;
}

let mods: Mod[] = []

for (let i = 0; i < 10; i++)
  mods.push({
    name: "Twilight Forest",
    icon: "https://static-cdn.jtvnw.net/jtv_user_pictures/benimatic-profile_image-390c4d3e4aa14241-150x150.png"
  });

export class ServerPageElement<T extends ServerProps> extends React.Component<T, {installed: boolean, playButtonBlocken: boolean}> {
  constructor(props: T) {
    super(props);

    this.state = {
      installed: false,
      playButtonBlocken: false
    };

    this.initState();
  }

  public async initState() {
    let state: boolean = await invoke("isClientInstalled", {id: this.props.clientId});
    console.log(state);
    this.setState({
      installed: state
    })
  }

  public handleClick() {
    if (this.state.installed)
      PlayManager.play(this.props.clientId, this.props.ip);
    else
      DownloadsManager.download(this.props.clientId, this.props.name);

    this.setPlayButtonBlock(true);
  }

  public setPlayButtonBlock(state: boolean) {
    this.setState({
      playButtonBlocken: state
    });
  }

  render(): React.ReactNode {
    return (
      <div className="absolute w-screen h-screen overflow-hidden">
        {/* Backdrop Blur */}
        <div className="fixed w-screen h-screen backdrop-blur-sm" />

        {/* Content */}
        <div data-tauri-drag-region className="fixed flex w-screen h-screen p-8 z-10 space-y-6">
          {/* Content Layer */}
          <div className="flex flex-grow w-full overflow-hidden space-x-6">
            {/* Left Panel: Server controls */}
            <div className="flex flex-col justify-between w-1/2 space-y-4">
              <div className="flex flex-col space-y-4">
                {/* Return Button */}
                <button
                  title="Вернуться в главное меню"
                  onClick={this.props.onClose}
                  className="transition bg-neutral-900/30 hover:bg-neutral-900/30 text-white rounded-full p-2 aspect-square w-9 flex justify-center items-center shadow-black-extended">
                  <Undo2 className="w-5 h-5" />
                </button>
                <div className="flex flex-col space-y-2">
                  {/* Server Name */}
                  <span className="text-3xl font-bold uppercase text-white text-shadow-lg">{this.props.name}</span>
                  {/* Description */}
                  <span className="text-white/90 text-sm text-shadow-lg leading-4 font-medium">{this.props.description}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  title="Запустить клиент"
                  onClick={() => this.handleClick()}
                  className="bg-neutral-900/50 transition hover:bg-neutral-900/30 w-full rounded-lg py-2 text-white">{this.state.installed ? "Играть" : "Установить"}</button>
                <button
                  title="Настройки клиента"
                  className="bg-neutral-900/50 transition hover:bg-neutral-900/30 aspect-square h-full rounded-lg py-2 text-white flex justify-center items-center"><EllipsisVertical/></button>
              </div>
            </div>

            {/* Right Panel: List of server modifications */}
            <div className="flex flex-col w-1/2 max-h-full overflow-hidden">
              <div className="flex-grow overflow-y-auto space-y-1.5 p-2">
                {mods.map((mod, index) => (
                  <Modification key={index} {...mod} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background */}
        <img data-tauri-drag-region src={this.props.bgUrl} className="absolute inset-0 w-full h-full object-cover blur-md" />
      </div>
    );
  }
}

class Modification extends React.Component<Mod> {
  render(): React.ReactNode {
    return (
      <div className="flex items-center bg-neutral-900/50 rounded-lg py-2 px-3 space-x-3">
        <img src={this.props.icon} className="w-6 h-6" />
        <span className="text-gray-200">{this.props.name}</span>
      </div>
    );
  }
}