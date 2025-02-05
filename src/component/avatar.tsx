import { cn } from "@/util/unsorted.util";
import { WebUtil } from "@/util/web.util";

interface AvatarProps {
  username: string;
  className?: string;
}

function Avatar({ username, className }: AvatarProps) {
  const skinUrl = WebUtil.getAvatar(username);

  return (
    <div
      className={cn("rounded-full overflow-hidden aspect-square", className)}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${skinUrl})`,
          backgroundSize: "800% 800%",
          backgroundPosition: "14.1% 14.3%", // почему 14% когда 100/8=12.5%? хуй знает типо
          imageRendering: "crisp-edges",
        }}
      />
    </div>
  );
}

export default Avatar;