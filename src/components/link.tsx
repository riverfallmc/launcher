import { cn } from "@/utils/class.util";

interface Props
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disableBlueColor?: boolean,
  disableblank?: string
}

export default function Link(props: Props) {
  return (
    <a
      target={props.disableblank == "true" ? "_self" : "_blank"}
      {...props}
      className={cn(`${props.disableBlueColor ? "" : "text-blue-500 hover:text-blue-400 transition"} cursor-pointer`, props.className)}
    />
  )
}