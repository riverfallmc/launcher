import { cn } from "@/util/unsorted.util";
import { ReactNode } from "react";

interface Props {
  children: ReactNode,
  className?: string,
  href: string,
  disableBlueColor?: boolean,
  disableblank?: string
}

export default function Link(props: Props) {
  return (
    <a target={props.disableblank == "true" ? "_self" : "_blank"} {...props} className={cn(`${props.disableBlueColor ? "" : "text-blue-500 hover:text-blue-400 transition"} cursor-pointer`, props.className)}/>
  )
}