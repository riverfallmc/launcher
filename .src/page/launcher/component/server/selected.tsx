import { useEffect, useState } from "react";
import { Client, ClientManager, ClientState, ClientStorage } from "@/util/client.util";
import { Server as IServer } from "@/util/server.util";
import { ModList } from "./mods";
import Table from "@/component/table";

import { IoPlay } from "react-icons/io5";
import { IoIosOptions } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { IoReload } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { FaWrench } from "react-icons/fa6";

import { listen } from "@tauri-apps/api/event";
import { GameManager } from "@/util/game.util";
import { AppManager } from "@/util/tauri.util";
import { cn } from "@/util/unsorted.util";

interface UseButton {
  text: string,
  icon: IconType,
  className?: string,
  disabled?: true;
}

function getUseButton(state: ClientState): UseButton {
  switch (state) {
    case ClientState.Null:
      return {
        text: "Идёт проверка",
        icon: IoReload,
        className: "bg-neutral-500/20 text-neutral-400",
        disabled: true
      };
    case ClientState.Install:
      return {
        text: "Установить",
        icon: FaDownload,
        className: "bg-orange-700 hover:bg-orange-800"
      };
    case ClientState.Installation:
      return {
        text: "Установка",
        icon: FiLoader,
        className: "bg-neutral-900 hover:bg-red-700"
      }
    case ClientState.IntegrityCheck:
      return {
        text: "Проверка целостности",
        icon: FaWrench,
        className: "bg-green-600 hover:bg-red-700"
      }
    case ClientState.Disabled:
      return {
        text: "Играть (одиночная)",
        icon: IoPlay, // TbPlugConnectedX
        className: "bg-blue-500 hover:bg-blue-600" // text-neutral-600 cursor-default
      }
    case ClientState.Play:
      return {
        text: "Играть",
        icon: IoPlay,
        className: "bg-blue-500 hover:bg-blue-600"
      }
  }
}

async function useButtonAction(
  state: ClientState,
  server: IServer,
  setIsDownload: React.Dispatch<React.SetStateAction<boolean>>
) {
  switch (state) {
    case ClientState.Null: return;
    case ClientState.Install:
      console.debug("Install");
      try {
        console.debug("await");
        ClientStorage.install(server.client) // await
        console.debug("ted");
      } catch(e) {
        AppManager.showError(e);
      }
      console.debug("trueee");
      setIsDownload(true);
      return;
    case ClientState.Installation:
      return; // Вы точно хотите отменить загрузку?
    case ClientState.IntegrityCheck:
      return; // Вы точно хотите отменить проверку?
    case ClientState.Disabled:
    case ClientState.Play:
      try {
        await GameManager.play(server);
      } catch (e) { AppManager.showError(e) };
      return;
  }
}

export function buttonHandler(
  state: ClientState,
  server: IServer,
  setIsDownload: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    useButtonAction(state, server, setIsDownload);
  } catch (e) {
    AppManager.showError(e);
  }
}

export function ServerSelected({server}: {server?: IServer}) {
  if (!server)
    return <></>

  const [client, setClient] = useState<Client>();
  const [state, setState] = useState<ClientState>(ClientState.Null);
  const [isDownload, setIsDownload] = useState(false);
  const [useButton, setUseButton] = useState<UseButton>();

  useEffect(() => {(async () => setClient(await ClientManager.getClient(server.client)))()}, []);
  useEffect(() => {(async () => setState(await ClientManager.getState(server)))()}, []);
  useEffect(() => setUseButton(getUseButton(state)), [state]);

  useEffect(() => {
    console.warn("effect", isDownload)
    if (!isDownload) return;

    let isMounted = true;

    const fetch = async () => {
      console.log("#1", "fetch");
      while (isMounted) {
        console.log("#1", "while");
      try {
          console.log(await ClientStorage.installProgress());
        } catch (error) {
          console.error("Ошибка загрузки:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); // Подождём 500 мс
      }
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, [isDownload]);

  listen("dwninstalled", event => {
    console.log("dwninstalled", event);
    if ((event.payload as { name: string; }).name === server.name)
      setState(ClientState.Play);
  });

  if (!server || !client || !useButton)
    return <></>;

  const Icon = useButton?.icon;
  const serverTable = [
    { label: "Версия игры", value: `${ClientManager.formatModloaderName(client?.modloader) + " " + client?.version}` },
    { label: "Количество модификаций", value: client.mods.length },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 max-h-full">
      <Table data={serverTable} />

      <div className="w-full flex-1 overflow-y-auto flex flex-col px-4 space-y-3">
        <span className="text-lg">О сервере</span>
        <span className="text-neutral-400 font-normal">
          {client.description || "Нет информации"}
        </span>

        <span className="text-lg">Модификации</span>
        <ModList list={client.mods} />
        <div className="flex gap-x-2">
          <button
            disabled={useButton.disabled}
            onClick={() => buttonHandler(state, server, setIsDownload)}
            className={cn("transition px-5 py-3 rounded-lg flex gap-x-3 items-center", useButton.className)}
          >
            <Icon className="h-4"/> {useButton.text}
          </button>
          {(state !== ClientState.Null && state !== ClientState.Install && state !== ClientState.Installation) &&
            <button className="hover:text-neutral-500 transition aspect-square h-full rounded-lg flex items-center justify-center">
              <IoIosOptions className="w-5 h-5"/>
            </button>
          }
        </div>
      </div>
    </div>
  );
}