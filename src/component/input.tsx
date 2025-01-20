import { cn } from "@/util/unsorted.util";

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

// TODO @ Стиль не применяется
function CheckBox(props: Props) {
  return <input {...props} className={cn("w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600", props.className)}/>
}