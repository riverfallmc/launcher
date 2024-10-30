import React from "react";
import { className } from "../util/classname.util";

interface ButtonProps {
  children?: React.ReactNode,
  onClick?: React.MouseEventHandler,
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"],
  className?: string;
}

export class Button extends React.Component<ButtonProps> {
  render(): React.ReactNode {
    return <button type={this.props.type} className={className("rounded-xl border border-solid border-neutral-200 transition hover:bg-neutral-100", this.props.className)} onClick={this.props.onClick}>{this.props.children}</button>
  }
}