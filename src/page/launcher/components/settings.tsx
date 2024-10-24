import React from "react";
import { Settings2 } from "lucide-react";
import { TitleBarButton } from "@/components/page";
import { DrpcManager } from "@/util/discord.util";

export class Settings extends React.Component<{}, {isOpened: boolean}> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isOpened: false
    }
  }

  public toggle() {
    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  render(): React.ReactNode {
    return (
      <>
        <SettingsWindow
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;

            this.setState({
              isOpened: false
            });
          }}
          isVisible={this.state.isOpened}/>

        <TitleBarButton onClick={() => this.toggle()} children={Settings2}/>
      </>
    )
  }
}

class SettingsWindow extends React.Component<{isVisible: boolean, onClick: React.MouseEventHandler<HTMLDivElement>}> {
  render(): React.ReactNode {
    if (!this.props.isVisible) return <></>

    return (
      <div
        onClick={this.props.onClick}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div
          data-tauri-drag-region
          className="w-[52vw] h-[52vh] p-6 rounded-lg bg-white shadow-black-extended"
          onClick={(e) => e.stopPropagation()}>
          <div className="w-full h-full">
            <span className="uppercase font-bold text-xl">Настройки</span>
            <div className="flex flex-col">
              <Setting
                title="Discord RPC"
                onClick={(_) => {DrpcManager.toggle()}}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Setting extends React.Component<{title: string, onClick: React.MouseEventHandler<HTMLButtonElement>}> {
  render(): React.ReactNode {
    return (
      <div className="space-x-2">
        <span onClick={this.props.onClick}>{this.props.title}</span>
        <button className="p-2 bg-zinc-200 transition hover:bg-zinc-100 rounded-lg" onClick={this.props.onClick}>Включить/выключить</button>
      </div>
    )
  }
}