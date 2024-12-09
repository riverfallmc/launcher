import { cn } from "@/util/util";

interface Props
  extends React.LabelHTMLAttributes<HTMLLabelElement> {};

function Label(
  props: Props
) {
  return <span {...props} className={cn("", props.className)}/>
}

export default Label;