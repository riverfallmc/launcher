import { useEffect, useState } from "react";
import { FriendOnServer } from "util/util";
import { getFriendsOnServer } from "util/server";
import { getAvatarUrl } from "util/user";
import Avatar from "component/avatar";

function FriendsOnServer({id}: {id: string}) {
  const [friendList, setFriendList] = useState<FriendOnServer[]>();
  const [friendCounter, setFriendCounter] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const friends = await getFriendsOnServer(id);

      setFriendCounter(friends.length);
      setFriendList((friends).slice(0, 3));
    })();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col space-y-1">
      <span className="text-white text-xl">Друзья на сервере</span>
      {friendList && (friendList?.length === 0 ?
        <NoFriendsOnServer/> : <FriendList count={friendCounter} list={friendList}/>)}
    </div>
  )
}

function NoFriendsOnServer() {
  return <span className="text-neutral-300">На сервере не играет ни один ваш друг.</span>
}

function FriendList({list, count}: {list: FriendOnServer[], count: number}) {
  return (
    <>
      {list.map(friend => <Friend friend={friend}/>)}
      {list.length < count && <span className="text-white/75 text-right">и ещё {count-list.length}...</span>}
    </>
  )
}

function Friend({friend}: {friend: FriendOnServer}) {
  return (
    <>
      <div className="p-1.5 bg-secondary rounded-md text-white flex justify-between items-center">
        <div className="flex items-center gap-x-2.5">
          <Avatar src={getAvatarUrl(friend.username)} className="w-8 rounded-md"/>
          <span className="font-medium">{friend.username}</span>
        </div>

        {friend.playTime &&
          <span className="text-white/75 mr-1.5 text-sm">Играет уже {friend.playTime}ч</span>}
      </div>
    </>
  )
}

export default FriendsOnServer;