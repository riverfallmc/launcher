import React from "react";
import { Activity, updateActivity } from "@/util/discord";
import { updateTitle } from "@/util/util";
import { Sidebar } from "./sidebar";

export default abstract class Page<P = {}, S = {}> extends React.Component<P, S> {
  public title: string;
  public rpc: Activity;

  constructor(
    props: P,
    title: string,
    rpc: Activity
  ) {
    super(props);

    this.title = title;
    this.rpc = rpc;
  }

  async componentDidMount() {
    await updateTitle(this.title);
    await updateActivity(this.rpc);
  }
}

export function BasePage({children}: {children: React.ReactNode}) {
  return <main data-tauri-drag-region children={children} className="w-screen h-screen flex fixed bg-primary"/>
}

export function BasePageContent({children}: {children: React.ReactNode}) {
  return <div data-tauri-drag-region className="flex-grow max-w-full overflow-x-auto p-4" children={children}/>
}

export function ApplicationPage({children, title}: {children?: React.ReactNode, title: string}) {
  return (
    <BasePage>
      <Sidebar/>
      <BasePageContent>
        <div data-tauri-drag-region className="size-full flex flex-col space-y-2">
          <span className="text-white font-medium text-xl">{title}</span>

          {children}
        </div>
      </BasePageContent>
    </BasePage>
  )
}