import { cn, formatPlayers, formatTime, Server as IServer } from "@/util/util";

interface Props
  extends IServer {
    className?: string,
    time?: number
  };

function Server(props: Props) {
  let subtitle = props.time ? `${formatTime(props.time)} наиграно` : (props.enabled ? `${props.online[0]}/${props.online[1]} ${formatPlayers(props.online[0])}` : "выключен");

  return (
    <div className={cn("relative flex p-3 leading-5 w-56 h-32", props.className)}>
      <div className="absolute inset-0 overflow-hidden z-0">
        <img src={props.image} className="rounded-md filter brightness-50 size-full object-cover"/>
      </div>

      <div className="flex flex-col mt-auto z-10">
        <span className="uppercase leading-5 text-lg font-bold text-white">{props.name}</span>
        <span className="font-medium text-neutral-300">{subtitle}</span>
      </div>
    </div>
  )
}

export default Server;