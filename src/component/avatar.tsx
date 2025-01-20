import { cn } from "@/util/unsorted.util";
import { WebUtil } from "@/util/web.util";

function Avatar(
  {username, className}: {username: string, className?: string}
) {
  return (
    <img className={cn("rounded-full aspect-square", className)} src={WebUtil.getAvatar(username)}/>
  )
}

export default Avatar;