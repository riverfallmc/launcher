import React from "react";

interface PlayerFaceProps {
  url: string;
}

export class PlayerFace extends React.Component<PlayerFaceProps> {
  render(): React.ReactNode {
    return <img src={this.props.url} className="w-12 aspect-square rounded-lg shadow-black-extended" />
  }
}