import React from "react";
import { className } from "../util";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface OAuthProps {
  children?: React.ReactNode,
  className?: string;
}

export class OAuth extends React.Component<OAuthProps> {
  render(): React.ReactNode {
    return <div className={className("flex justify-between rounded-xl border-solid border-neutral-200", this.props.className)} children={this.props.children}/>
  }
}

interface OAuthServiceProps {
  children?: LucideIcon,
  svg?: string,
  className?: string,
  onClick?: React.MouseEventHandler;
}

export class OAuthService extends React.Component<OAuthServiceProps> {
  render(): React.ReactNode {
    return <Button className={className("w-11 h-11 rounded-xl p-2", this.props.className)} children={this.props.svg ? <img src={this.props.svg}/> : (this.props.children ? <this.props.children className="w-full h-full"/> : <></>)}/>
  }
}