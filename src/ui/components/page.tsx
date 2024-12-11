import React from "react";
import { Activity, updateActivity } from "@/util/discord";
import { updateTitle } from "@/util/util";
import { Sidebar } from "./sidebar";

export default abstract class Page<P = {}> extends React.Component<P> {
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
  return <main data-tauri-drag-region children={children} className="fixed w-screen h-screen bg-primary flex"/>
}

export function BasePageContent({children}: {children: React.ReactNode}) {
  return (
    <div data-tauri-drag-region className="flex flex-col space-y-3 size-full p-4">
        {children}
    </div>
  )
}

export function ApplicationPage({children, title}: {children?: React.ReactNode, title: string}) {
  return (
    <BasePage>
      <Sidebar/>
      <BasePageContent>
        <div data-tauri-drag-region>
          <span className="text-white font-medium text-xl">{title}</span>
        </div>

        {children}
      </BasePageContent>
    </BasePage>
  )
}