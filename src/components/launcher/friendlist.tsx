import { FriendCategory, FriendsService } from "@/service/friends.service";
import { FiExternalLink, FiSearch } from "react-icons/fi";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserFriendRequest, UserProfile } from "@/storage/user.storage";
import { GameService } from "@/service/game/game.service";
import Avatar from "../avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../shadcn/dropdown-menu";
import { getWebsite, openUrl } from "@/utils/url.util";
import { caughtError } from "@/utils/error.util";
import { useError } from "../error";
import { ServerService } from "@/service/game/server.service";
import { HttpService } from "@/service/http.service";
import { getSession } from "@/storage/session.storage";
import { FaRegFaceSadCry } from "react-icons/fa6";
import { UserService } from "@/service/user.service";
import { formatDate } from "@/utils/data.util";
import { IconType } from "react-icons/lib";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

const friendBlocksSort = [
  FriendCategory.Request,
  FriendCategory.Online,
  FriendCategory.Offline
]

interface SearchProps {
  onAction?: (value: string) => void;
}

export function Search({ onAction }: SearchProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onAction) {
      onAction(inputValue);
    }
  };

  const handleSearchClick = () => {
    if (onAction) {
      onAction(inputValue);
    }
  };

  return (
    <div className="bg-neutral-800 p-1 px-1.5">
      <div className="relative">
        <input
          type="text"
          placeholder="Введите никнейм"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent p-2 pr-10 text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
        />
        <FiSearch
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${inputValue ? "text-white" : "text-neutral-600"}`}
          onClick={handleSearchClick}
        />
      </div>
    </div>
  );
}

interface FriendContextType {
  isOpen: boolean;
  openFriendList: () => void;
  hideFriendList: () => void;
}

const FriendContext = createContext(null as unknown as FriendContextType);

export function FriendProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openFriendList = () => setIsOpen(true);
  const hideFriendList = () => setIsOpen(false);

  return (
    <FriendContext.Provider value={{ isOpen, openFriendList, hideFriendList }}>
      {children}
    </FriendContext.Provider>
  );
}

export function useFriend() {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error("useFriend must be used within a FriendProvider");
  }
  return context;
}

interface FriendLists {
  [FriendCategory.Request]: UserFriendRequest[],
  [FriendCategory.Online]: UserProfile[],
  [FriendCategory.Offline]: UserProfile[]
}

export function FriendList() {
  const {isOpen, hideFriendList } = useFriend();
  const [friendCount, setFriendCount] = useState(0);
  const [friends, setFriends] = useState<FriendLists>({
    [FriendCategory.Request]: [],
    [FriendCategory.Online]: [],
    [FriendCategory.Offline]: []
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        hideFriendList();
    }

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const friends = FriendsService.getFriends();

      let result: FriendLists = {
        [FriendCategory.Request]: FriendsService.getRequests(),
        [FriendCategory.Online]: [],
        [FriendCategory.Offline]: []
      };

      for (let friend of friends) {
        const category = FriendsService.getCategory(friend);
        switch (category) {
          case FriendCategory.Online:
          case FriendCategory.Offline:
            const list = result[category];
            list.push(friend);
            result[category] = list;
            continue
            // return result[category].push(friend);
          default: continue
        }
      }

      setFriends(result);
    }, 400);

    return () => clearInterval(interval);
  }, [])

  // обновляем количество друзей
  useEffect(() => {
    setFriendCount(Object.values(friends).reduce((acc, list) => acc + list.length, 0));
  }, [friends])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          tauri-drag-region
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex justify-end z-20 bg-black/40 back-blur"
          onClick={hideFriendList}
        >
          <motion.div
            tauri-drag-region
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="bg-neutral-900 flex flex-col w-80 h-full py-6 px-7 gap-y-4"
            onClick={(e) => e.stopPropagation()} // предотвращает закрытие при клике на меню
          >
            <span tauri-drag-region className="text-2xl">Друзья</span>
            <Search />
            {/* todo поиск */}

            {
              friendCount == 0 ? <NoFriends/>
              : friendBlocksSort.map((category) => {
                const list = friends[category];

                if (!list || list.length === 0) return null;

                return <Block key={category} category={category} map={list} title={FriendsService.getCategoryTitle(category)}/>;
              })
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ title, category, map }: { title: string, category: FriendCategory, map: (UserFriendRequest | UserProfile)[] }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="w-full flex flex-col space-y-1">
      <span
        className="text-lg text-neutral-400 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        {title}
      </span>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col space-y-1"
          >
            {map.map((v, i) =>
              category == FriendCategory.Request
                ? <Request key={i} request={v as UserFriendRequest} />
                : <Friend key={i} friend={v as UserProfile} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
function NoFriends() {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-y-4">
      <FaRegFaceSadCry className="w-13 h-13 text-neutral-500"/>
      <div className="flex flex-col justify-center items-center text-sm text-neutral-500">
        <span>У вас ещё нет друзей :(</span>
        <span>Самое время это исправить!</span>
      </div>
    </div>
  )
}

// BaseComponent
import { forwardRef } from 'react'

const User = forwardRef<HTMLDivElement, { username: string, status: string } & React.HTMLAttributes<HTMLDivElement>>(
  ({ username, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="p-2.5 cursor-pointer bg-neutral-800 hover:bg-neutral-800/60 transition flex space-x-3 items-center"
      >
        <Avatar className="w-11 rounded-xl" username={username} />
        <div className="flex flex-col space-y-2">
          <span className="text-lg leading-3">{username}</span>
          <span className="text-sm leading-3 text-neutral-400">{status}</span>
        </div>
      </div>
    )
  }
)


function Friend({ friend }: { friend: UserProfile }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setStatus(await FriendsService.getStatusLabel(friend))
      } catch (_) {
        console.error(_)
      }
    })();
  }, [JSON.stringify(friend)]);

  return (
    <UserActionMenu friend={friend}>
      <User username={friend.username} status={status}/>
    </UserActionMenu>
  )
}

function Request({ request }: { request: UserFriendRequest }) {
  const appUserId = getSession()?.global_id;
  const senderId = appUserId == request.user_id ? request.friend_id : request.user_id
  const isOutcoming = appUserId == request.user_id;

  const [username, setUsername] = useState("n/a");

  useEffect(() => {
    (async () => {
      const profile = await UserService.getUserProfile(senderId);
      setUsername(profile.username);
    })()
  }, [])

  return (
    <div className="relative">
      <User username={username} status={formatDate(request.created_at)} />

      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
        {
          !isOutcoming && <RequestActionButton onClick={async () => await FriendsService.accept(senderId)} Icon={IoMdCheckmark} />
        }
        <RequestActionButton onClick={async () => await FriendsService.cancel(senderId)} Icon={IoMdClose} />
      </div>
    </div>
  )
}

function RequestActionButton({ Icon, onClick }: { Icon: IconType, onClick?: () => {} }) {
  return (
    <button onClick={onClick} className="h-8 flex justify-center items-center aspect-square hover:bg-neutral-900/40 cursor-pointer transition text-neutral-400"><Icon className="w-5 h-5"/></button>
  )
}

function UserActionMenu({ friend, children }: { friend: UserProfile, children: ReactNode }) {
  const setError = useError();
  const [isUserPlaying, setUserPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => setUserPlaying(await GameService.isGameRunning()), 250);

    return () => clearInterval(interval);
  }, [])

  const removeFriend = async () => {
    await FriendsService.removeFriend(friend.id);
  }

  const invite = async () => {
    try {
      await HttpService.post(getWebsite(`api/session/invite/${friend.id}?sender=${getSession()!.global_id}&server=${GameService.getCurrentServer()!.id}`));
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  const join_game = async () => {
    try {
      const server = friend.status.server;

      if (!server)
        throw new Error("Сейчас этот игрок не играет на каком-либо сервере");

      const serverInstance = await ServerService.getServer(setError, server);

      await GameService.play(serverInstance!);
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-white">
          <DropdownMenuLabel>{friend.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="font-normal gap-x-1.5"
              onClick={async () => await openUrl(`profile/${friend.username}`)}
            >
              Открыть профиль <FiExternalLink />
            </DropdownMenuItem>
            {
              (isUserPlaying && friend.status.status !== "Offline") &&
              <DropdownMenuItem
                className="font-normal"
                onClick={invite}
              >
                Пригласить в игру
              </DropdownMenuItem>
            }

            {
              friend.status.status == "Playing" &&
              <DropdownMenuItem
                className="font-normal"
                onClick={join_game}
              >
                Присоединиться
              </DropdownMenuItem>
            }
            <DropdownMenuItem
              className="font-normal"
              onClick={removeFriend}
            >
              Удалить из друзей
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}