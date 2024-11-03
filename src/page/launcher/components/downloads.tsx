import React from "react";
import { Download } from "lucide-react";
import { Window, WindowContent, WindowTrigger } from "./window";
import { BackendMessage, CreateBody, DeleteBody, DownloadBody, DownloadEntity, DownloadsManager, InstalledBody } from "@/util/downloads.util";
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
        <WindowContent>
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
  render(): React.ReactNode {
    return (
      <div className="flex flex-col text-white">
        <span>{"Клиент: " + this.props.name}</span>
        <span>{"Скорость: " + formatSpeed(this.props.speed)}</span>
      </div>
    )
  }
}