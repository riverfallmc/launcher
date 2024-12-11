import { cn } from "@/util/util";

interface Props
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

function Avatar(props: Props) {
  return <img {...props} className={cn(`aspect-square`, props.className)}/>
}

export default Avatar;