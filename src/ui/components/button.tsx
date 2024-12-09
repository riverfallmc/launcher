import { cn } from "@/util/util";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const className = "text-white p-2 rounded-lg transition";

function Button(
  props: Props
) {
  return <button {...props} className={cn(className, props.className)}/>
}

export default Button;