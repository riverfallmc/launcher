import { Server as IServer, ServerManager } from "@/util/server.util";
import { AppManager } from "@/util/tauri.util";
import { useEffect, useState } from "react";
import { Server } from "./server";
import { ServerSelected } from "./selected";

export function ServerList() {
  const [selected, setSelected] = useState<IServer | undefined>();
  const [list, setList] = useState<IServer[]>([]);
  const [online, setOnline] = useState(0);

  const updateServerList = (list: IServer[]) => {
    list.sort((a, b) => {
      if (a.enabled !== b.enabled)
        return b.enabled ? 1 : -1;

      return b.online.current - a.online.current;
    });

    setList(list);
    setOnline(list.reduce((sum, server) => sum + server.online.current, 0))
  };

  useEffect(() => {
    (async () => {
      try {
        updateServerList(await ServerManager.getServerList())
      } catch (err) {
        AppManager.showError(err);
      }
    })()
  }, [])

  if (list.length == 0)
    return <NoServers/>;

  return (
    <div className="max-h-full flex space-x-4">
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="flex space-x-3 items-center">
          <img src="/assets/steve.png" className="w-6" />
          <span className="text-blue-500 uppercase">{online} текущий онлайн</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {list.map(server => (
            <Server
              key={server.id}
              background="/assets/background/default.jpg"
              onClick={() =>
                selected == server ? setSelected(undefined) : setSelected(server)
              }
              {...server}
            />
          ))}
        </div>
      </div>

      {
        selected &&
          <ServerSelected server={selected} />
      }
    </div>
  );
}

function NoServers() {
  return (
    <div className="h-full flex justify-center items-center space-x-6">
      <img className="w-[25%]" src="/assets/scene/piggy.png"/>
      <div className="flex flex-col">
        <span className="text-neutral-100">Нет доступных серверов</span>
        <span className="text-neutral-400">Скорее всего, один из наших серверов упал :(</span>
      </div>
    </div>
  )
}