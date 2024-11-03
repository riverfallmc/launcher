import React from "react";
import { Download, Trash2 } from "lucide-react";
import { Window, WindowContent, WindowTrigger } from "./window";
import { BackendMessage, CreateBody, DeleteBody, DownloadBody, DownloadEntity, DownloadsManager, InstalledBody, ProcessState } from "@/util/downloads.util";
import { sendNotify } from "@/util/notification.util";

export class Downloads<T = {}> extends React.Component<T, {downloads: Map<string, DownloadEntity>}> {
  // private static downloads: Map<string, DownloadEntity> = new Map();
  //@ts-ignore

  constructor(props: T) {
    super(props);
    this.state = {
      downloads: new Map()
    };

    DownloadsManager.listen(event => this.handleDownloadEvent(event), "settingsWindow");
  }

  private addDownload(
    id: string,
    item: DownloadEntity
  ) {
    this.state.downloads.set(id, item);

    this.setState({
      downloads: this.state.downloads
    });
  }

  private deleteDownload(
    id: string
  ) {
    this.state.downloads.delete(id);

    this.setState({
      downloads: this.state.downloads
    })
  }

  private async handleDownloadEvent(event: BackendMessage<any>) {
    let body;
    switch (event.type) {
      // Новый клиент в очереди
      case "create": // CreateBody
        body = event.body as CreateBody;
        this.addDownload(body.id, {
          ...body,
          speed: 0,
          progress: 0,
          process: ProcessState.Downloading,
          state: 0,
          paused: false
        });
        break;

      // Процесс скачивания
      case "download": // DownloadBody
        body = event.body as DownloadBody;
        this.addDownload(body.id, body);
        break;

      // Удаление клиента из очереди
      case "delete": // DeleteBody
        body = event.body as DeleteBody;
        this.deleteDownload(body.id);
        break;
      // Клиент установлен
      case "installed": // InstalledBody
        body = event.body as InstalledBody;
        this.deleteDownload(body.id);
        await sendNotify(`Клиент "${body.name}" был установлен!`);
        break;
    }
  }

  render(): React.ReactNode {
    return (
      <Window title={<><Download/><span>Загрузки</span></>}>
        <WindowTrigger>
          <button title="Загрузки" className="p-3 rounded-[50%] bg-neutral-100/20 transition hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white/80 shadow-black-extended"><Download/></button>
        </WindowTrigger>
        <WindowContent className="flex flex-col space-y-2">
          {Array.from(this.state.downloads.entries()).length == 0
          ? <NoDownloads/> : Array.from(this.state.downloads.entries()).map(([_, entity]) => <DownloadEntityRenderer {...entity}/>)}
        </WindowContent>
      </Window>
    )
  }
}

class NoDownloads extends React.Component {
  render(): React.ReactNode {
    return <div className="size-full flex flex-col text-base text-black dark:text-white/80 gap-y-1" children="В очереди нет загрузок"/>
  }
}

function formatSpeed(speed: number): string {
  return `${speed.toFixed(1)}мбайт/с`;
}

class DownloadEntityRenderer extends React.Component<DownloadEntity> {
  private getProcessText(process: ProcessState): string {
    switch (process) {
      case ProcessState.Downloading:
        return "1/2 Скачивание архива"
      case ProcessState.Unarchiving:
        return "2/2 Разархивирование";
    }
  }

  render(): React.ReactNode {
    return (
      <div className="flex flex-col space-y-2 p-3 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800/40 shadow-black-extended">
        {/* контент */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col leading-5">
            <span className="font-medium text-black dark:text-white">{this.props.name}</span>
            <span className="text-sm text text-black dark:text-white/50">{"Скорость: " + formatSpeed(this.props.speed)}</span>
            </div>
          <button
            onClick={async () => await DownloadsManager.deleteDownload(this.props.id)}
            className="transition text-black hover:text-neutral-500  dark:text-white dark:hover:text-neutral-400"><Trash2/></button>
        </div>
        {/* прогресс */}
        <span className="text-white text-sm font-medium">{this.props.paused ? "На паузе" : this.getProcessText(this.props.process)}</span>
        {!this.props.paused &&
          <ProgressBar process={this.props.process} progress={this.props.progress}/>}
      </div>
    )
  }
}

class ProgressBar extends React.Component<{process: ProcessState, progress: number}> {
  render(): React.ReactNode {
    return (
      <div className="bg-black/10 dark:bg-white/50 rounded-sm w-full h-1">
        <div
          className={"h-full rounded-sm bg-purple-600"}
          style={{width: this.props.progress + "%"}}/>
      </div>
    )
  }
}