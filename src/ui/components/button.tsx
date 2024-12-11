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