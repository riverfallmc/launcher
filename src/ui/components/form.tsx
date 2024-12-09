import { cn } from "@/util/util";
import Label from "./label";

interface Props
  extends React.FormHTMLAttributes<HTMLFormElement> {
  title: string,
  subtitle?: string;
}

const className = "p-5 bg-neutral-950 rounded-lg space-y-2.5";

function Form(
  props: Props
) {
  return (
    <form
      {...props}
      className={cn(className, props.className)}>
      <div className="flex flex-col">
        <Label className="text-white font-semibold text-xl">{props.title}</Label>
        <Label className="text-white/70 text-sm">{props.subtitle}</Label>
      </div>

      <div className="flex flex-col">
        {props.children}
      </div>
    </form>
  )
}

export default Form;