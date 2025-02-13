import { Server as IServer } from "@/service/game/server.service";
import { ServerStatus } from "./status";
import { SaveImage } from "@/components/safeimage";

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
        className={`group h-32 cursor-pointer relative overflow-hidden rounded-md`}
      >
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-125"
          style={{
            backgroundImage: `url(${props.background})`
          }}/>
        <div className="absolute inset-0 bg-black/75 group-hover:bg-black/0"></div>
        <div className="absolute inset-0 object-gradient opacity-40 transition-opacity group-hover:opacity-0"></div>

        {/* Контент */}
        <div className="absolute inset-0 flex justify-center items-center gap-x-2.5">
          <SaveImage src={props.icon} fallback="/assets/block/barrier.png" className="w-6"/>

          <span className="uppercase text-sm">{props.name}</span>
        </div>

        <div className="absolute inset-0">
          <div className="absolute flex space-x-2 w-full pb-3.5 justify-center bottom-0">
            <div className="flex items-center gap-x-1.5 scale-75">
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
