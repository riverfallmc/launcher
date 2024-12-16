import { FriendOnServer, Modification, Server, ServerDetails, ServerHistory } from "util/util";

export const Background = {
  fp: "https://preview.redd.it/beautiful-farm-and-shader-v0-4gfqslsxfs8b1.png?auto=webp&s=e032d8e191208b51dd6949606f28156e1d7011b8",
  mrpg1: "https://i.ytimg.com/vi/f9BzPSqHbl4/maxresdefault.jpg",
  tm1: "https://cdn.minecraftrating.ru/storage/projects/374/e6194f96cab73db_big.jpg",
  dc: "https://assetsio.gnwcdn.com/minecraft-house-ideas-ultimate-survival-house.jpg?width=1200&height=630&fit=crop&enable=upscale&auto=webp",
  minigames: "https://i.ytimg.com/vi/ML5t7qOwd_g/maxresdefault.jpg"
};

const baseMod = {
  name: "FarmCraft 3",
  icon: "https://media.forgecdn.net/avatars/thumbnails/14/212/64/64/635589178760357568.png"
};

let mods: Modification[] = [];

for (let i = 0; i < 20; i++)
  mods.push(baseMod);

const baseDetails: ServerDetails = {
  client: "",
  description: "Самый базированный сервер эвер. Првлыф вдыфов ыфлов фывоф ылдов фышщв ышфов шщфыов",
  mods
};

const details: { [id: string]: ServerDetails; } = {};

["fp1", "mrpg1", "tm1", "dc", "minigames"].forEach(id => details[id] = baseDetails);

// todo @ http request
export async function getServerList(): Promise<Server[]> {
  return [
    {
      id: "fp1",
      name: "Farmer Paradise",
      image: Background.fp,
      enabled: true,
      online: [132, 200]
    },
    {
      id: "mrpg1",
      name: "Magic-RPG #1",
      image: Background.mrpg1,
      enabled: true,
      online: [82, 200]
    },
    {
      id: "tm1",
      name: "Techno-Magic",
      image: Background.tm1,
      enabled: false,
      online: [32, 200]
    },
    {
      id: "dc",
      name: "Builders Place",
      image: Background.dc,
      enabled: true,
      online: [92, 200]
    },
    {
      id: "minigames",
      name: "Mini-Games",
      image: Background.minigames,
      enabled: true,
      online: [78, 200]
    },
  ];
};

type ArraySortCallback<T = Server> = (a: T, b: T) => number;

export async function getServerListSorted(
  callback: ArraySortCallback
): Promise<Server[]> {
  let servers = await getServerList();

  servers.sort((a, b) => {
    if (a.enabled === b.enabled)
      return callback(a, b);

    return a.enabled ? -1 : 1;
  });

  return servers;
}

export async function getServerHistory(
  _token: string
): Promise<ServerHistory[]> {
  // todo @ http request
  let server = (await getServerList())[2];

  if (!server) return [];

  return [
    {
      server,
      time: 72600
    }
  ];
}

// todo @ http request
export async function getServer(
  id: string
): Promise<Server | null> {
  return (await getServerList()).filter(server => server.id === id)[0];
}

export async function getServerDetails(
  id: string
): Promise<ServerDetails | null> {
  return details[id];
}

export async function getFriendsOnServer(
  id: string
): Promise<FriendOnServer[]> {
  return [
    {
      username: "gorila666",
      status: "online",
      playTime: 3.2
    }, {
      username: "shovel",
      status: "online",
      playTime: 6.7
    }
  ];
}