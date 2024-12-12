import React, { useEffect, useRef, useState } from "react";
import Page, { ApplicationPage } from "component/page";
import UserProfile from "component/userprofile";
import Server from "component/server";
import { ServerHistory as IServerHistory, Server as IServer } from "util/util";
import { Activity, Images } from "util/discord";
import { getUser, User } from "util/user";
import { getServerHistory, getServerListSorted } from "util/server";
import { RoundedButton } from "@/ui/components/button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

class Library<P = {}> extends Page<P> {
  static title: string = "Библиотека";
  static rpc: Activity = new Activity({
    title: Library.title,
    subtitle: "Смотрит свою библиотеку",
    image: Images.Logo,
    buttons: []
  });

  private static user: User = getUser();

  constructor(props: P) {
    super(
      props,
      Library.title,
      Library.rpc
    );
  };


  render(): React.ReactNode {
    return (
      <ApplicationPage
        title={Library.title}>

        <UserProfile user={Library.user}/>
        <History/>
        <Recommendations/>
      </ApplicationPage>
    )
  }
}

export default Library;

function History() {
  return (
    <div className="flex flex-col leading-5">
      <span className="text-white font-medium text-lg">Продолжить игру</span>

      <ServerHistory/>
    </div>
  )
}

/**
 * Эта функция генерирует рекомендации по серверам.
 * Она рекомендует сервера с самым высоким онлайном.
*/
async function generateRecommendations(): Promise<IServer[]> {
  return (await getServerListSorted((a, b) =>
    b.online[0] - a.online[0]
  )).slice(0, 4);
}

function ServerHistory() {
  const [user] = useState<User>(getUser());
  const [servers, setServers] = useState<IServerHistory[]>([]);

  useEffect(() => {
    (async () => setServers(await getServerHistory(user.token)))();
  }, []);

  return (
    <div className="flex space-x-2">
      {servers.length === 0 &&
        <NoHistory/>}
      {/* todo @ сделать скролл */}
      {servers.map(server => {
        return <Server {...server.server} time={server.time}/>
      })}
    </div>
  )
}

function NoHistory() {
  return <span className="text-neutral-500">Вы еще не играли ни на одном сервере.</span>
}

function Recommendations() {
  const [servers, setServers] = useState<IServer[]>([]);
  const scroll = useRef<HTMLDivElement>(null);
  const scrollPower = 50;
  let scrollInterval: NodeJS.Timeout | null;

  const startScroll = (direction: "left" | "right") => {
    if (scrollInterval) return;
    scrollInterval = setInterval(() => {
      if (scroll.current) {
        scroll.current.scrollBy({
          left: direction === "left" ? -scrollPower : scrollPower,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const stopScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  };

  useEffect(() => {
    (async () => {
      setServers(await generateRecommendations());
    })();
  }, []);

  return (
    <div className="flex flex-col space-y-2 overflow-x-auto">
      <div className="flex justify-between">
        <div className="flex flex-col leading-5">
          <span className="text-white text-lg font-medium">Рекомендации</span>
          <span className="text-neutral-500">Возможно вам понравятся эти сервера</span>
        </div>

        <div className="flex space-x-2 pr-1 items-center">
          {/* todo @ убрать кнопки если нет оверфлоуааа */}
          <RoundedButton
            onMouseDown={() => startScroll("left")}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            ><FaAngleLeft/></RoundedButton>
          <RoundedButton
            onMouseDown={() => startScroll("right")}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            ><FaAngleRight/></RoundedButton>
        </div>
      </div>

      {/* Todo: w-full */}
      <div
        ref={scroll}
        className="max-w-full flex scrollbar overflow-x-auto scroll-hidden whitespace-nowrap space-x-3">
        {servers.map(server => {
          return <Server {...server}/>
        })}
      </div>
    </div>
  )
}