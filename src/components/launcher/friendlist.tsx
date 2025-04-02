import { FriendCategory, FriendsService } from "@/service/friends.service";
import { FiExternalLink, FiSearch } from "react-icons/fi";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/storage/user.storage";
import { GameService } from "@/service/game/game.service";
import Avatar from "../avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../shadcn/dropdown-menu";
import { getWebsite, openUrl } from "@/utils/url.util";
import { caughtError } from "@/utils/error.util";
import { useError } from "../error";
import { ServerService } from "@/service/game/server.service";
import { HttpService } from "@/service/http.service";
import { getSession } from "@/storage/session.storage";

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

export function FriendList() {
  const { isOpen, hideFriendList } = useFriend();
  const [friends, setFriends] = useState<Map<FriendCategory, UserProfile[]>>(new Map());

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        hideFriendList();
    }

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  // todo
  useEffect(() => {
    const interval = setInterval(() => {
      const friends = FriendsService.getFriends();

      let result = new Map();

      for (let user of friends.values()) {
        const category = FriendsService.getCategory(user);
        const list = result.get(category) || [];

        list.push(user);

        result.set(category, list);
      }

      setFriends(result);
    }, 500);

    return () => clearInterval(interval);
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex justify-end z-20 bg-black/40 back-blur"
          onClick={hideFriendList}
        >
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="bg-neutral-900 flex flex-col w-80 h-full py-6 px-7 gap-y-4"
            onClick={(e) => e.stopPropagation()} // предотвращает закрытие при клике на меню
          >
            <span className="text-2xl">Друзья</span>
            <Search />
            {/* todo поиск */}
            {
              friendBlocksSort.map(category => {
                const list = friends.get(category);

                if (!list || list.length == 0)
                  return <></>

                return <Block key={category} list={list} title={FriendsService.getCategoryTitle(category)} />
              })
              // Array.from(friends).map(([category, list]) => {
                // return <Block key={category} list={list} title={FriendsService.getCategoryTitle(category)} />;
              // })
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ title, list }: { title: string, list: UserProfile[] }) {
  return (
    <div className="w-full flex flex-col space-y-1">
      <span className="text-lg text-neutral-400">{title}</span>

      <div className="flex flex-col space-y-1">
        {
          list.map(user => <User key={user.id} user={user}/>)
        }
      </div>
    </div>
  )
}

function User({ user }: { user: UserProfile }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => setStatus(await FriendsService.getStatusLabel(user)))();
  }, [])

  // todo функционал списка

  return (
    <UserActionMenu user={user}>
      <div className="p-2.5 cursor-pointer bg-neutral-800 hover:bg-neutral-800/60 transition flex space-x-3 items-center">
        <Avatar className="w-11 rounded-xl" username={user.username}></Avatar>

        <div className="flex flex-col space-y-2">
          <span className="text-lg leading-3">{user.username}</span>
          <span className="text-sm leading-3 text-neutral-400">{status}</span>
        </div>
      </div>
    </UserActionMenu>
  )
}

function UserActionMenu({ user, children }: { user: UserProfile, children: ReactNode }) {
  const setError = useError();
  const [isUserPlaying, setUserPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => setUserPlaying(await GameService.isGameRunning()), 250);

    return () => clearInterval(interval);
  }, [])

  const invite = async () => {
    try {
      await HttpService.post(getWebsite(`api/session/invite/${user.id}?sender=${getSession()!.global_id}&server=${GameService.getCurrentServer()!.id}`));
    } catch (err) {
      setError(caughtError(err).message);
    }
  }

  const join_game = async () => {
    try {
      const server = user.status.server;

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
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="font-normal gap-x-1.5"
              onClick={async () => await openUrl(`profile/${user.username}`)}
            >
              Открыть профиль <FiExternalLink />
            </DropdownMenuItem>
            {
              (isUserPlaying && user.status.status !== "Offline") &&
              <DropdownMenuItem
                className="font-normal"
                onClick={invite}
              >
                Пригласить в игру
              </DropdownMenuItem>
            }

            {
              user.status.status == "Playing" &&
              <DropdownMenuItem
                className="font-normal"
                onClick={join_game}
              >
                Присоединиться
              </DropdownMenuItem>
            }
            <DropdownMenuItem
              className="font-normal"
            >
              Удалить из друзей
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}