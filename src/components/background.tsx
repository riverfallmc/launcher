import React from "react";

interface BackgroundProps {
  /** Ссылка на фон */
  src: string;
}

export class Background extends React.Component<BackgroundProps> {
  render(): React.ReactNode {
    return (
      <div className="absolute size-full overflow-hidden">
        <div className="fixed w-screen h-screen backdrop-blur-xl bg-black/50"/>
        <img src={this.props.src} className="h-full w-full object-cover"/>
      </div>
    )
  }
}