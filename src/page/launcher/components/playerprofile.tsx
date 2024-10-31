import Application from "@/app";
import { getWebsiteUrl } from "@/util/website.util";
import React from "react";
import { FaRegGem } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export interface PlayerDetails {
  /** Игровое имя пользователя */
  username: string,
  /** URL на лицо скина игрока (используется как аватарка) */
  avatar: string,
  /** Ранг игрока */
  rank: string,
  /** CSS-стиль ника игрока */
  usernameColor: string,
  /** Донат баланс игрока */
  balance: number,
  /** Заблокирован ли игрок */
  isBanned: boolean;
}

export class PlayerProfile extends React.Component<{}, PlayerDetails> {
  constructor(props: {}) {
    super(props);
    this.state = {
      username: "user",
      avatar: "",
      rank: "user",
      usernameColor: "black",
      balance: 0,
      isBanned: true
    };
  }

  private static async requestProfile(): Promise<PlayerDetails> {
    // todo
    return new Promise(res => {
      res({
        username: "smokingplaya",
        avatar: "https://ely.by/services/skins-renderer?url=https%3A%2F%2Fely.by%2Fstorage%2Fskins%2Fcf24ddc4a884a95a232ba5200bf19ac5.png&scale=18.9&renderFace=1&v=2",
        rank: "superadmin",
        balance: 620,
        usernameColor: "linear-gradient(to bottom, #FF6A00, #FFAE00)",
        isBanned: false
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
        <PlayerFace url={this.state.avatar} isBanned={this.state.isBanned} />
        <div className="flex flex-col justify-center leading-5">
          <span className="font-medium text-black dark:text-white">С возвращением,</span>
          <div className="flex space-x-1">
            <span className={"font-bold bg-clip-text text-transparent flex justify-center items-center gap-x-2 " + (this.state.isBanned ? "saturate-0" : "")} style={{backgroundImage: this.state.usernameColor}} children={this.state.username}/>
            <PlayerBalance balance={this.state.balance}/>
          </div>
        </div>
      </div>
    );
  }
}

// PlayerFace

/** Информация о блокировке игрока */
//@ts-ignore
interface PlayerBan {
  /** Причина, по которой был заблокирован игрок */
  reason: string,
  /** Ник администратора, который заблокировал игрока */
  admin: string,
  /** Время, когда игрока заблокировали */
  time: Date,
  /** Время, когда игрока разблокируют */
  unbanTime: Date;
}

interface PlayerFaceProps {
  url: string,
  isBanned: boolean;
}

class PlayerFace extends React.Component<PlayerFaceProps> {
  /**
   * todo
   * сделать так, чтобы если пользователь isBanned, то фетчился апи эндпоинт с причиной блокировки и т.д информацией (PlayerBan)
  */
  private handleClick() {
    console.log("wth")
  }

  render(): React.ReactNode {
    return <img src={this.props.url} onClick={() => this.handleClick()} className={"w-12 aspect-square rounded-lg shadow-black-extended cursor-pointer " + (this.props.isBanned ? "saturate-0" : "")} />
  }
}

// PlayerBalance

class PlayerBalance extends React.Component<{balance: number}> {
  private formatGems(count: number): string {
    const formattedCount = count.toLocaleString('en-US');
    let suffix: string;

    if (count % 10 === 1 && count % 100 !== 11) {
      suffix = 'гем';
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      suffix = 'гема';
    } else {
      suffix = 'гемов';
    }

    return `${formattedCount} ${suffix}`;
  }

  render(): React.ReactNode {
    return <span className="text-black dark:text-white/90 text-sm font-semibold dark:font-medium font-montserrat-alternates gap-x-1 flex justify-center items-center"><FaRegGem/>{this.formatGems(this.props.balance)}<PlayerDonate/></span>
  }
}

// PlayerDonate

class PlayerDonate extends React.Component {
  render(): React.ReactNode {
    return <FaPlus title="Пополнить донат-счёт" onClick={() => Application.openUrlInBrowser(getWebsiteUrl("donate"))} className="cursor-pointer transition hover:text-neutral-500 dark:hover:text-neutral-400" />
  }
}