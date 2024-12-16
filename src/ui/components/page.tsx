import React from "react";
import { Activity, updateActivity } from "@/util/discord";
import { cn, updateTitle } from "@/util/util";
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

interface DivProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function BasePage(props: DivProps) {
  return <main data-tauri-drag-region {...props} className={cn("w-screen h-screen flex fixed bg-primary", props.className)}/>
}

export function BasePageContent(props: DivProps) {
  return <div data-tauri-drag-region {...props} className={cn("max-w-full p-4", props.className)}/>
}

export function ApplicationPage({children, title, subtitle}: {children?: React.ReactNode, title: string, subtitle?: string}) {
  return (
    <BasePage>
      <Sidebar/>
      <BasePageContent>
        <div data-tauri-drag-region className="size-full flex flex-col space-y-2">
          <div className="flex flex-col leading-5">
            <span className="text-white font-medium text-xl">{title}</span>
            {subtitle &&
              <span className="text-neutral-500">{subtitle}</span>}
          </div>

          {children}
        </div>
      </BasePageContent>
    </BasePage>
  )
}