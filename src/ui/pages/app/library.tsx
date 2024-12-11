import React, { useEffect, useState } from "react";
import Page, { ApplicationPage } from "component/page";
import UserProfile from "component/userprofile";
import Server from "component/server";
import { ServerHistory as IServerHistory, Server as IServer } from "util/util";
import { Activity, Images } from "util/discord";
import { getUser, User } from "util/user";
import { getServerList, getServerListSorted } from "util/server";

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
    <div className="flex flex-col">
      <span className="text-white font-medium text-lg">Продолжить игру</span>

      <ServerHistory/>
    </div>
  )
}

async function getServerHistory(
  _token: string
): Promise<IServerHistory[]> {
  // todo @ http request
  return [
    {
      server: (await getServerList())[0],
      time: 72600
    }
  ]
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
      {servers.map(server => {
        return <Server {...server.server} time={server.time}/>
      })}
    </div>
  )
}

function NoHistory() {
  return <span className="text-neutral-500 leading-5">Вы еще не играли ни на одном сервере.</span>
}

function Recommendations() {
  const [servers, setServers] = useState<IServer[]>([]);

  useEffect(() => {
    (async () => {
      setServers(await generateRecommendations());
    })();
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col space-y-1">
        <span className="text-white text-lg font-medium leading-5">Рекомендации</span>
        <span className="text-neutral-500 leading-5">Возможно вам понравятся эти сервера</span>
      </div>

      <div className="flex overflow-x-auto whitespace-nowrap space-x-3">
        {servers.map(server => {
          return <Server className="flex-shrink-0" {...server}/>
        })}
      </div>
    </div>
  )
}