import { cn } from "@/util/util";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const className = "text-white py-2 px-3 rounded-md transition";

function Button(
  props: Props
) {
  return <button {...props} className={cn(className, props.className)}/>
}

export default Button;

export function RoundedButton(
  props: Props
) {
  return <button {...props} className={cn("text-white aspect-square hover:text-white/70 transition rounded-full", props.className)}>{props.children}</button>
}