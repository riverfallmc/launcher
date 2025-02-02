import Table from "@/component/table";
import { Client, ClientManager, ClientState } from "@/util/client.util";
import { GameManager } from "@/util/game.util";
import { Server as IServer, ServerManager } from "@/util/server.util";
import { AppManager } from "@/util/tauri.util";
import { formatError } from "@/util/unsorted.util";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

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
        AppManager.showError(formatError(err));
      }
    })()
  }, [])

  if (list.length == 0)
    return <NoServers/>;

  return (
    <div className="max-h-full flex space-x-4">
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="flex space-x-3 items-center">
          <img src="src/asset/steve.png" className="w-6" />
          <span className="text-blue-500 uppercase">{online} текущий онлайн</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {list.map(server => (
            <Server
              key={server.id}
              background="src/asset/background/default.jpg"
              onClick={() =>
                selected == server ? setSelected(undefined) : setSelected(server)
              }
              {...server}
            />
          ))}
        </div>
      </div>

      <ServerSelected server={selected} />
    </div>
  );
}

const NoServers = () => {
  return (
    <div className="h-full flex justify-center items-center space-x-6">
      <img className="w-[25%]" src="src/asset/scene/piggy.png"/>
      <div className="flex flex-col">
        <span className="text-neutral-100">Нет доступных серверов</span>
        <span className="text-neutral-400">Скорее всего, один из наших серверов упал :(</span>
      </div>
    </div>
  )
}

interface ServerProps extends IServer {
  onClick: (server: IServer) => any;
  background: string
}

export function Server(props: ServerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [action, setAction] = useState<ClientState>(ClientState.Null);
  const [actionText, setActionText] = useState<string>();

  const play = async () => {
    try {
      await GameManager.play(props);
    } catch (err) {
      console.error(err)
    }
  }

  listen("dwninstalled", event => {
    const name = (event.payload as { name: string; }).name;
    if (name === props.name)
      setAction(ClientState.Play);
  });

  useEffect(() => {
    (async () => {
      setAction(await ClientManager.getState(props.client))
    })()
  }, [])

  useEffect(() => {
    switch (action) {
      case ClientState.Null:
        return setActionText("подождите...");
      case ClientState.Install:
        return setActionText("Установить")
      case ClientState.Play:
        return setActionText("Играть")
    }
  }, [action]);

  return (
    <div className="relative">
      {/* Основной компонент */}
      <div
        onClick={() => props.onClick(props)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-48 h-32 cursor-pointer relative overflow-hidden rounded-t-lg ${
          isHovered ? 'rounded-b-none' : 'rounded-b-lg'
        }`}
        style={{
          backgroundImage: `url(${props.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 via-transparent to-white opacity-25"></div>

        {/* Контент */}
        <div className="absolute inset-0 flex justify-center items-center gap-x-1.5">
          <img src="src/asset/block/workbench.png" className="w-6" />
          <span className="uppercase font-normal">{props.name}</span>
        </div>

        <div className="absolute inset-0">
          <div className="absolute flex space-x-2 w-full pb-3.5 justify-center bottom-0">
            <div className="flex items-center gap-x-3">
              <ServerStatus online={props.enabled} />
              <span className={`text-sm ${props.enabled ? "font-bold" : "font-light"}`}>
                {props.enabled ? `${props.online.current}/${props.online.max}` : "выключен"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка "Играть" прямо под родительским элементом */}
      <button
        onClick={() => play()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`absolute top-full left-0 w-48 bg-blue-500 text-white text-center py-2 transition-all duration-300 transform ${
          isHovered ? 'translate-y-0 opacity-100 rounded-b-lg' : '-translate-y-full opacity-0'
        }`}
      >
        {actionText}
      </button>
    </div>
  );
}

const ServerStatus = ({ online }: { online: boolean }) => {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <div
        className={`absolute w-2 h-2 rounded-full ${
          online ? "bg-lime-400" : "bg-red-600"
        }`}
      ></div>
      <div
        className={`absolute w-4 h-4 rounded-full ${
          online ? "bg-lime-400/25" : "bg-red-600/25"
        }`}
      ></div>
      <div
        className={`absolute w-6 h-6 rounded-full ${
          online ? "bg-lime-400/10" : "bg-red-600/10"
        }`}
      ></div>
    </div>
  );
};

function ServerSelected({server}: {server?: IServer}) {
  if (!server)
    return <></>

  const [client, setClient] = useState<Client>();

  useEffect(() => {
    (async () => setClient(await ClientManager.getClient(server.client)))();
  }, [])

  if (!client)
    return <></>

  const sampleData = [
    { label: "Версия игры", value: `${ClientManager.formatModloaderName(client?.modloader) + " " + client?.version}` },
    { label: "Количество модификаций", value: client.mods.length },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 max-h-full">
      <Table data={sampleData} />

      <div className="w-full flex-1 overflow-y-auto flex flex-col px-4 space-y-3">
        <span className="text-lg">О сервере</span>
        <span className="text-neutral-400 font-normal">
          {client.description || "Нет информации"}
        </span>

        <span className="text-lg">Модификации</span>
        <ModList list={client.mods} />
      </div>
    </div>
  );
}

function ModList({ list }: { list: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 items-start overflow-y-auto content-start size-full">
      <div className="flex flex-wrap gap-2 items-start overflow-y-auto h-full w-full">
        {list.map((mod, index) => (
          <div key={index} className="py-2 px-3 bg-white/10 rounded-md">
            {mod}
          </div>
        ))}
      </div>
    </div>
  );
}