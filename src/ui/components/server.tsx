import { cn, formatPlayers, formatTime, Server as IServer } from "@/util/util";

interface Props
  extends IServer {
    className?: string,
    time?: number
  };

type State = "enabled" | "disabled" | "time";

function Server(props: Props) {
  let state: State = props.time ? "time" : (props.enabled ? "enabled" : "disabled");
  let subtitle: string;

  switch (state) {
    case "time":
      subtitle = `${formatTime(props.time || 0)} наиграно`;
      break;
    case "enabled":
      subtitle = `${props.online[0]}/${props.online[1]} ${formatPlayers(props.online[0])}`;
      break;
    case "disabled":
      subtitle = "выключен";
  };

  return (
    <div
      onClick={() => {
        document.location = `/server?serverId=${props.id}`;
      }}
      className={cn("relative flex flex-shrink-0 p-3 leading-5 w-56 h-32 cursor-pointer", props.className)}>
      <div className="absolute inset-0 overflow-hidden z-0">
        <img src={props.image} className={`rounded-md filter brightness-50 size-full object-cover`}/>
        <div className={`rounded-lg absolute inset-0 server-${state}`}></div>
      </div>

      <div className="flex flex-col mt-auto z-10">
        <span className="uppercase leading-5 text-lg font-bold text-white">{props.name}</span>
        <span className="font-medium text-neutral-300">{subtitle}</span>
      </div>
    </div>
  )
}

export default Server;