import { useEffect, useState } from "react";
import { IoPlay } from "react-icons/io5";
import { IoIosOptions } from "react-icons/io";
import { IconType } from "react-icons/lib";
import { IoReload } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { FaWrench } from "react-icons/fa6";
import {
  Client,
  ClientService,
  ClientState,
} from "@/service/game/client.service";
import { Server as IServer } from "@/service/game/server.service";
import { useError } from "@/components/error";
import { caughtError } from "@/utils/error.util";
import { cn } from "@/utils/class.util";
import Table from "@/components/table";
import { ModList } from "./mods";
import { GameService } from "@/service/game/game.service";
import { ClientDownloadService, Downloadable } from "@/service/download.service";
import { unzip } from "@/api/process.api";
import { notify } from "@/service/notify.service";
import { formatBytes } from "@/utils/format.util";
import { DownloadStatus } from "./downloadstatus";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { DeleteWindow } from "@/components/window/delete";

interface UseButton {
  text: string;
  icon: IconType;
  className?: string;
  disabled?: true;
}

function getUseButton(state: ClientState): UseButton {
  switch (state) {
    case ClientState.Null:
      return {
        text: "Идёт проверка",
        icon: IoReload,
        className: "bg-neutral-500/20 text-neutral-400",
        disabled: true,
      };
    case ClientState.Install:
      return {
        text: "Установить",
        icon: FaDownload,
        className: "bg-pink-700 hover:bg-pink-800",
      };
    case ClientState.Installation:
      return {
        text: "Установка",
        icon: FiLoader,
        className: "bg-pink-700 hover:bg-pink-900",
      };
    case ClientState.IntegrityCheck:
      return {
        text: "Проверка целостности",
        icon: FaWrench,
        className: "bg-green-600 hover:bg-red-700",
      };
    case ClientState.Disabled:
      return {
        text: "Играть (одиночная)",
        icon: IoPlay, // TbPlugConnectedX
        className: "bg-blue-500 hover:bg-blue-600", // text-neutral-600 cursor-default
      };
    case ClientState.Play:
      return {
        text: "Играть",
        icon: IoPlay,
        className: "bg-blue-500 hover:bg-blue-600",
      };
  }
}

async function useButtonAction(
  setError: (_: string) => void,
  state: ClientState,
  server: IServer,
  setDownloadable: React.Dispatch<React.SetStateAction<Downloadable | null>>,
  setStatus: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  switch (state) {
    case ClientState.Null:
      return;
    case ClientState.Install:
      try {
        let savedIn = await ClientDownloadService.download(server.client, (name, progress) => {
          setDownloadable({ name, progress });

          let current = progress.progressTotal;
          let total = progress.total;
          setStatus(`Скачано ${Math.round((current/total * 100))}% (${formatBytes(current)}/${formatBytes(total)})`)
        }, setError);

        setStatus("Разархивируем клиент...");

        await unzip(savedIn);

        setStatus(undefined);
        setDownloadable(null);
        notify(`Клиент для сервера ${server.name} установлен!`);
      } catch (err) {
        setError(caughtError(err).message);
      }
      return;
    case ClientState.Installation:
      // todo
      return; // Вы точно хотите отменить загрузку?
    case ClientState.IntegrityCheck:
      // будет в следующих обновлениях, мб
      return; // Вы точно хотите отменить проверку?
    case ClientState.Disabled:
    case ClientState.Play:
      try {
        await GameService.play(server);
      } catch (err) {
        setError(caughtError(err).message);
      }
      return;
  }
}

export function ServerSelected({ server }: { server?: IServer }) {
  if (!server)
    return <></>;

  const setError = useError();
  const [showDeleteWindow, setShowDeleteWindow] = useState(false);
  const [client, setClient] = useState<Client>();
  const [useButton, setUseButton] = useState<UseButton>();
  const [state, setState] = useState<ClientState>(ClientState.Installation);
  const [downloadable, _setDownloadable] = useState<Downloadable | null>();
  const [downloadStatus, setDownloadStatus] = useState<string>();

  const setDownloadable = (downloadable: Downloadable | null) => {
    setState(downloadable ? ClientState.Installation : ClientState.Play);
    _setDownloadable(downloadable);
  }

  // меняем кнопки в зависимости от ClientState
  useEffect(() => setUseButton(getUseButton(state)), [state]);

  // запрашиваем у server сервиса игровой клиент
  useEffect(() => {
    (async () => setClient(await ClientService.getClient(setError, server.client)))();
  }, [server]);

  // инициализируем ClientState
  useEffect(() => {
    (async () => setState(await ClientService.getState(server)))();
  }, [server]);

  // проверяем на то что уже что-то в очереди есть
  useEffect(() => {
    let download = ClientDownloadService.getDownloading();

    if (download && download.name === server.client)
      setDownloadable(download);
  }, [server])

  if (!client || !useButton) return <></>;

  const Icon = useButton?.icon;
  const serverTable = [
    {
      label: "Версия игры",
      value: `${ClientService.formatModloaderName(client?.modloader) + " " + client?.version}`,
    },
    { label: "Количество модификаций", value: client.mods.length },
  ];

  return (
    <>
      <div className="w-full flex-1 flex flex-col space-y-4 max-h-full">
        <Table data={serverTable} />

        <div className="w-full flex-1 overflow-y-auto flex flex-col px-4 space-y-3 justify-between">
          <div className="overflow-y-auto flex flex-col space-y-3">
            <span className="text-lg">О сервере</span>
            <span className="text-neutral-400 font-normal">
              {client.description || "Нет информации"}
            </span>

            <span className="text-lg">Модификации</span>
            <ModList list={client.mods} />
          </div>
          <div className="flex gap-x-4 bottom-0">
            <button
              disabled={useButton.disabled}
              onClick={() =>
                useButtonAction(setError, state, server, setDownloadable, setDownloadStatus)
              }
              className={cn(
                "transition enabled:cursor-pointer px-5 py-3 rounded-lg flex gap-x-3 items-center",
                useButton.className,
              )}
            >
              <Icon className="h-4" /> {useButton.text}
            </button>
            {downloadable && downloadable.progress &&
              <DownloadStatus status={downloadStatus || "Скачиваем..."} progress={(downloadable.progress.progressTotal / downloadable.progress.total) * 100} />}
            {state !== ClientState.Null &&
              state !== ClientState.Install &&
              state !== ClientState.Installation && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:text-neutral-500 cursor-pointer transition aspect-square h-full rounded-lg flex items-center justify-center">
                      <IoIosOptions className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-neutral-800 text-white">
                    <DropdownMenuGroup>
                      {/* <DropdownMenuItem
                        className="font-normal gap-x-1.5"
                      >
                        Проверить целостность файлов
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-normal"
                      >
                        Настройки клиента
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className="font-normal"
                        onClick={() => ClientService.openFolder(client.name)}
                      >
                        Открыть папку клиента
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteWindow(true)}
                        className="font-normal"
                      >
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
      </div>

      {
        showDeleteWindow && <DeleteWindow setClientState={setState} client={client.name} onClose={() => setShowDeleteWindow(false)}/>
      }
    </>
  );
}
