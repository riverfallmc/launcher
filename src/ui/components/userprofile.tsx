import { getAvatarUrl, User } from "@/util/user";
import Avatar from "./avatar";
import { useEffect, useState } from "react";

function UserProfile({user}: {user: User}) {
  const [isBanned, setIsBanned] = useState<boolean>();

  useEffect(() => {
    (async () => {
      setIsBanned(false); // todo @ http request
    })();
  })

  return (
    <div className="flex w-auto space-x-3">
      <Avatar
        src={getAvatarUrl(user.username)}
        className="w-14 rounded-[25%]"/>

      <div className="flex flex-col justify-center leading-5">
        <span className="text-white/80">С возвращением,</span>
        <span className="text-white font-medium flex gap-x-1.5">{user.username} <RankBadge username={user.username}/> {isBanned && <Badge color="#444444">BANNED</Badge>}</span>
      </div>
    </div>
  )
}

function Badge({color, children}: {color?: string, children: React.ReactNode}) {
  return <div
    className="py-0.5 px-1 text-xs font-medium rounded-md uppercase"
    style={{
      backgroundColor: color
    }}>{children}</div>
}

function RankBadge({username}: {username: string}) {
  const [rank, setRank] = useState<string>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    (async () => setRank("owner"))();
    setColor("#5B21B6");
  });

  return <Badge color={color}>{rank}</Badge>
}

export default UserProfile