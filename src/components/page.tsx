import React from "react";
import Application from "@/app";
import Logo from "@/assets/logo/logo.svg";
import { LucideIcon, X } from "lucide-react";
import { className } from "../util/classname.util";

interface PageProps {
  children?: React.ReactNode,
  className?: string;
}

export class Page extends React.Component<PageProps> {
  render(): React.ReactNode {
    return <div className={className("absolute w-screen h-screen p-10", this.props.className)} data-tauri-drag-region children={<PageLayer children={this.props.children}/>}/>;
  }
}

/**
 * PageLayer
 * * Класс-прослойка, нужный классу Page для нормального отображения контента
 */
class PageLayer extends Page {
  render(): React.ReactNode {
    return <div data-tauri-drag-region className="size-full flex flex-col space-y-2" children={this.props.children}/>
  }
}

interface TitleBarProps {
  children?: React.ReactNode,
  /** Показывать ли логотип в TitleBar? default=true */
  showLogo?: boolean,
  /** Показывать ли кнопку закрытия в TitleBar? default=true */
  showClose?: boolean;
};

export class TitleBar extends React.Component<TitleBarProps> {
  render(): React.ReactNode {
    return (
      <div className="flex justify-between w-full h-7">
        <img hidden={this.props.showLogo === false} src={Logo} className="w-32 h-7"/>
        <div className="space-x-2 h-auto flex">
          {this.props.children}

          <TitleBarButton
            hidden={this.props.showClose === false}
            onClick={() => Application.exit()}
            children={X}/>
        </div>
      </div>
    )
  }
}

interface TitleBarButtonProps {
  children: LucideIcon;
  className?: string;
  onClick?: React.MouseEventHandler;
  hidden?: boolean,
}

export class TitleBarButton extends React.Component<TitleBarButtonProps> {
  render(): React.ReactNode {
    return <button
      hidden={this.props.hidden}
      className={className("w-7 h-7 transition text-black hover:text-neutral-500", this.props.className)}
      onClick={this.props.onClick}
      children={<this.props.children className="w-full h-full" />}/>;
  }
}