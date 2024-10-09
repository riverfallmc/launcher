import React from "react";
import { PlayerFace } from "./playerface";

export interface PlayerDetails {
  /** Игровое имя пользователя */
  username: string,
    /** URL на лицо скина игрока (используется как аватарка) */
  avatar: string,
  balance: number;
}

export class PlayerProfile extends React.Component<{}, PlayerDetails> {
  constructor(props: {}) {
    super(props);
    this.state = {
      username: "",
      avatar: "",
      balance: 0
    };
  }

  private static async requestProfile(): Promise<PlayerDetails> {
    return new Promise(res => {
      res({
        username: "smokingplaya",
        avatar:
          "https://ely.by/services/skins-renderer?url=https%3A%2F%2Fely.by%2Fstorage%2Fskins%2Fcf24ddc4a884a95a232ba5200bf19ac5.png&scale=18.9&renderFace=1&v=2",
        balance: 1500
      });
    });
  }

  componentDidMount() {
    PlayerProfile.requestProfile()
      .then(profile => {
        this.setState(profile);
      })
      .catch(console.error);
  }

  render() {
    return (
      <div className="flex gap-x-4">
        <PlayerFace url={this.state.avatar} />
        <div className="flex flex-col justify-center -space-y-1">
          <span className="font-medium">С возвращением,</span>
          <span className="font-bold bg-text-gradient bg-clip-text text-transparent">{this.state.username}</span>
        </div>
      </div>
    );
  }
}
