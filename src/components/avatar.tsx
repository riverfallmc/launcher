import { cn } from "@/utils/class.util";
import { getProfile } from "@/utils/url.util";
import { useEffect, useState } from "react";

interface AvatarProps {
  username: string;
  className?: string;
}

function Avatar({ username, className }: AvatarProps) {
  const [skin, setSkin] = useState("/assets/steve-default.png");

  useEffect(() => {
    (async () => {
      try {
        const newSkin = await getProfile(username);

        if (!newSkin.SKIN)
          return;

        setSkin(newSkin.SKIN.url);
      } catch (_) {};
    })();
  }, []);

  return (
    <div
      className={cn("rounded-full overflow-hidden aspect-square", className)}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${skin})`,
          backgroundSize: "800% 800%",
          backgroundPosition: "14.1% 14.3%", // почему 14% когда 100/8=12.5%? хуй знает типо
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

export default Avatar;