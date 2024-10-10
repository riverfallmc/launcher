import React from "react";
import { className } from "@/util";
import { Button } from "./button";
import { IconType } from "react-icons";

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
  icon: IconType,
  className?: string,
  onClick?: React.MouseEventHandler;
}

export class OAuthService extends React.Component<OAuthServiceProps> {
  render(): React.ReactNode {
    return <Button className={className("w-11 h-11 rounded-xl p-2 flex justify-center items-center", this.props.className)} children={<this.props.icon className="w-5 h-5"/>}/>
  }
}