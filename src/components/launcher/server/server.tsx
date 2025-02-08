import { Server as IServer } from "@/service/game/server.service";
import { ServerStatus } from "./status";

interface ServerProps extends IServer {
  onClick: (server: IServer) => any;
  background: string
}

export function Server(props: ServerProps) {
  return (
    <div className="relative">
      {/* Основной компонент */}
      <div
        onClick={() => props.onClick(props)}
        className={`group w-48 h-32 cursor-pointer relative overflow-hidden rounded-lg`}
      >
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-125"
          style={{
            backgroundImage: `url(${props.background})`
          }}/>
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-600 via-transparent to-white opacity-30"></div>

        {/* Контент */}
        <div className="absolute inset-0 flex justify-center items-center gap-x-1.5">
          <img src="/assets/block/workbench.png" className="w-6" />
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
    </div>
  );
}