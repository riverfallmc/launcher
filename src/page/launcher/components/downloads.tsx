import React from "react";
import { Download } from "lucide-react";
import { Window, WindowContent, WindowTrigger } from "./window";
import { DownloadEntity } from "@/util/downloads.util";

export class Downloads extends React.Component {
  render(): React.ReactNode {
    return (
      <Window title={<><Download/><span>Загрузки</span></>}>
        <WindowTrigger>
          <button title="Загрузки" className="p-3 rounded-[50%] bg-neutral-100/20 transition hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white/80 shadow-black-extended"><Download/></button>
        </WindowTrigger>
        <WindowContent>
          <div className="size-full flex flex-col text-base text-black dark:text-white/80 gap-y-1">
            В очереди нет загрузок
          </div>
          {/* {DownloadsManager.getAll().map(entity => <DownloadEntityRenderer children={entity}/>)} */}
        </WindowContent>
      </Window>
    )
  }
}

class DownloadEntityRenderer extends React.Component<{children: DownloadEntity}> {
  render(): React.ReactNode {
    return (
      <div>
        {this.props.children.name}
      </div>
    )
  }
}