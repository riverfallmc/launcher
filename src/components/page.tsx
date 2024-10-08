import React from "react";
import Application from "@/app";
import Logo from "@/assets/logo/logo.svg";
import { LucideIcon, X } from "lucide-react";
import { className } from "@/util";

interface PageProps {
  children?: React.ReactNode
}

export class Page extends React.Component<PageProps> {
  render(): React.ReactNode {
    return <div className="w-screen h-screen p-10" data-tauri-drag-region children={this.props.children}/>;
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
      <div className="flex justify-between w-full h-auto">
        <img hidden={this.props.showLogo === false} src={Logo} className="w-32"/>
        <div className="space-x-2">
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
      className={className("w-8 h-8 transition text-black hover:text-neutral-500", this.props.className)}
      onClick={this.props.onClick}
      children={<this.props.children className="w-full h-full" />}/>;
  }
}