import { cn } from "@/util/unsorted.util";
import { FaCheck } from "react-icons/fa6";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {};

export default function Input(props: Props) {
  switch (props.type) {
    case "text":
    case "password":
      return <Text {...props}/>
    case "checkbox":
      return <CheckBox {...props}/>
    default:
      return <input {...props} />
  }
}

function Text(props: Props) {
  return <input {...props} className={cn("w-full py-4 px-5 bg-neutral-700/10 rounded-lg outline outline-1 outline-none placeholder:text-neutral-500", props.className)} />
}


function CheckBox(props: Props) {
  return (
    <div className="w-auto flex gap-2 items-center">
      <div className="relative w-5 h-5">
        <input
          {...props}
          className={cn(
            "peer appearance-none w-full h-full bg-neutral-500/10 rounded-md focus:outline-none focus:ring-offset-0 focus:ring-1 focus: checked:bg-blue-500/30 checked:border-0 disabled:border-steel-400 disabled:bg-steel-400",
            props.className
          )}
          type="checkbox"
        />
        <FaCheck className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
      </div>
    </div>
  );
}