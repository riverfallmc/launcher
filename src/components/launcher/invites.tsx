import { FriendsService } from "@/service/friends.service";
import { Server, ServerService } from "@/service/game/server.service";
import { useWssListener } from "@/service/websocket.service";
import { UserProfile } from "@/storage/user.storage";
import { useState } from "react";
import { useError } from "../error";
import Avatar from "../avatar";
import { IoMdCheckmark } from "react-icons/io";
import { GameService } from "@/service/game/game.service";
import { caughtError } from "@/utils/error.util";

export function Invite() {
  const setError = useError();
  const [user, setUser] = useState<UserProfile | null>();
  const [server, setServer] = useState<Server | null>();

  const accept = async () => {
    try {
      await GameService.play(server!);
    } catch (err) {
      setError(caughtError(err).message);
    }

    clear();
  };

  const clear = () => {
    setUser(null);
    setServer(null);
  }

  useWssListener("INVITE", async data => {
    const user = FriendsService.getFriend(data.id);
    const server = await ServerService.getServer(setError, data.server);

    if (user && server) {
      setUser(user)
      setServer(server)
    }
  })

  if (!user || !server) return;

  return (
    <div className="bg-neutral-900 p-4 pointer-events-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-3">
          <Avatar className="w-12 h-12" username={user.username}/>
          <div className="flex flex-col space-y-3 justify-center">
            <span className="text-xl font-bold leading-3">{user.username}</span>
            <span className="leading-3 text-white/75">приглашает вас на сервер {server.name}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={accept} className="rounded-md bg-pink-700 hover:bg-pink-700/50 transition cursor-pointer px-2 py-1 flex items-center gap-x-1"><IoMdCheckmark/> Принять</button>
          <button onClick={clear} className="rounded-md bg-neutral-800 hover:bg-neutral-800/50 transition cursor-pointer px-2 py-1"> Отклонить</button>
        </div>
      </div>
    </div>
  )
}