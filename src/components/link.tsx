import Application, { Pages } from "@/app";
import { className } from "../util/classname.util";
import React from "react";

interface LinkProps {
  className?: string,
  /** Ссылка на страницу */
  href?: string,
  // Устанавливает page
  page?: Pages,
  children: React.ReactNode;
}

export class Link extends React.Component<LinkProps> {
  private handleClick() {
    if (this.props.href)
      Application.openUrlInBrowser(this.props.href);
    else if (this.props.page !== undefined)
      Application.changePage(this.props.page);
  }

  render(): React.ReactNode {
    return <a className={className("cursor-pointer font-bold transition text-violet-600 hover:text-violet-800", this.props.className)} onClick={() => this.handleClick()} children={this.props.children}/>
  }
}

export class OpenInBrowser extends React.Component<{children: React.ReactNode, url: string}> {
  render(): React.ReactNode {
    return (
      <a className="cursor-pointer" onClick={() => Application.openUrlInBrowser(this.props.url)} children={this.props.children}>
      </a>
    )
  }
}