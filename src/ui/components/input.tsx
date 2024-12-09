import { cn } from "@/util/util";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input(
  props: Props
) {
  switch (props.type) {
    case "password":
    case "text":
      return <TextInput {...props}/>
    default:
      return <input {...props}/>
  }

}

export default Input;

/** Input type="text" */
function TextInput(
  props: Props
) {
  return <input {...props} className={cn("bg-neutral-900 placeholder:text-white/30 text-white focus:outline-none py-2.5 px-3 rounded-lg", props.className)}/>
}