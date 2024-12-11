import { getAvatarUrl, User } from "@/util/user";
import Avatar from "./avatar";
import { useEffect, useState } from "react";

function UserProfile({user}: {user: User}) {
  return (
    <div className="flex w-auto space-x-3">
      <Avatar
        src={getAvatarUrl(user.username)}
        className="w-14 rounded-[25%]"/>

      <div className="flex flex-col justify-center leading-5">
        <span className="text-white/80">С возвращением,</span>
        <span className="text-white font-medium flex gap-x-1.5">{user.username} <RankBadge username={user.username}/></span>
      </div>
    </div>
  )
}

function RankBadge({username}: {username: string}) {
  const [rank, setRank] = useState<string>();

  useEffect(() => {
    (async () => setRank("owner"))();
  });

  return <div className="py-0.5 px-1 text-xs font-medium bg-violet-800 rounded-md uppercase">{rank}</div>
}

export default UserProfile