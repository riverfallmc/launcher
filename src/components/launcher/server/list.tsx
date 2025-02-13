import { useError } from "@/components/error";
import { Server as IServer, ServerService } from "@/service/game/server.service";
import { useEffect, useState } from "react";
import { Server } from "./server";
import { ServerSelected } from "./selected";

export function ServerList() {
  const setError = useError();
  const [list, setList] = useState<IServer[]>([]);
  const [selected, setSelected] = useState<IServer | undefined>();
  const [online, setOnline] = useState(0);
  const loadServerList = async () => {
    const servers = await ServerService.getServers(setError) || [];
    setList(servers);
    const totalOnline = servers.reduce((sum, server) => sum + (server.enabled ? server.online.current : 0), 0);
    setOnline(totalOnline);
  };

  useEffect(() => {
    loadServerList();
  }, []);

  if (list.length === 0)
    return <EmptyServerList/>

  return (
    <div className="size-full flex gap-x-4">
      <div className="w-[25rem] gap-y-6 flex-shrink-0 flex flex-col">
        <SummaryOnline online={online} />

        <span className="text-2xl font-bold">Выберите игровой сервер,<br/>чтобы начать игру!</span>
        <div className="grid grid-cols-2 gap-3 overflow-auto">
          {list.map(server => (
            <Server
              key={server.id}
              onClick={() => {
                setSelected(prev => (prev?.id === server.id ? undefined : server));
              }}
              {...server}
            />
          ))}
        </div>
      </div>

      {selected &&
        <ServerSelected server={selected}/>}
    </div>
  )
}

function EmptyServerList() {
  return (
    <div className="h-full flex justify-center items-center space-x-6">
      <img className="w-[25%]" src="/assets/scene/piggy.png"/>
      <div className="flex flex-col space-y-2">
        <span className="text-neutral-400 text-xm">Нет доступных серверов</span>
        <span className="text-neutral-100 leading-5 text-lg">Попробуйте перезагрузить лаунчер<br/>через несколько минут</span>
      </div>
    </div>
  )
}

function SummaryOnline({ online = 0 }: { online: number }) {
  return (
    <div className="flex flex-col space-y-3">
      <span className="flex gap-x-2">
        <img src="/assets/steve.png" className="aspect-square h-6 rounded-sm"/>

        <span className="uppercase text-blue-400 font-bold">{online} общий онлайн</span>
      </span>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-50" />
    </div>
  )
}
