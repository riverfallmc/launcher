import { useError } from "@/components/error";
import { Server as IServer, ServerService } from "@/service/game/server.service";
import { useEffect, useState } from "react";
import { Server } from "./server";
import { ServerSelected } from "./selected";

export function ServerList() {
  const setError = useError();
  const [list, setList] = useState<IServer[]>([]);
  const [selected, setSelected] = useState<IServer | undefined>();
  const loadServerList = async () => setList(await ServerService.getServers(setError) || []);

  useEffect(() => {loadServerList()});

  if (list.length === 0)
    return <EmptyServerList/>

  return (
    <div className="size-full flex gap-x-4">
      <div className="w-md flex-shrink-0 grid grid-cols-2 gap-3 overflow-auto">
        {list.map(server => (
          <Server
            key={server.id}
            background="/assets/background/default.jpg"
            onClick={() => {
              setSelected(prev => (prev?.id === server.id ? undefined : server));
            }}
            {...server}
          />
        ))}
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
