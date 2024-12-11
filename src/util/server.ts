import { Server } from "util/util";

export const Background = {
  fp: "https://preview.redd.it/beautiful-farm-and-shader-v0-4gfqslsxfs8b1.png?auto=webp&s=e032d8e191208b51dd6949606f28156e1d7011b8",
  mrpg1: "https://i.ytimg.com/vi/f9BzPSqHbl4/maxresdefault.jpg",
  tm1: "https://cdn.minecraftrating.ru/storage/projects/374/e6194f96cab73db_big.jpg",
  dc: "https://assetsio.gnwcdn.com/minecraft-house-ideas-ultimate-survival-house.jpg?width=1200&height=630&fit=crop&enable=upscale&auto=webp",
  minigames: "https://i.ytimg.com/vi/ML5t7qOwd_g/maxresdefault.jpg"
};

// todo @ http request
export async function getServerList(): Promise<Server[]> {
  return [
    {
      id: "fp1",
      client: "fp",
      name: "Farmer Paradise",
      image: Background.fp,
      enabled: true,
      online: [132, 200]
    },
    {
      id: "mrpg1",
      client: "magicrpg",
      name: "Magic-RPG #1",
      image: Background.mrpg1,
      enabled: true,
      online: [82, 200]
    },
    {
      id: "tm1",
      client: "techmagic",
      name: "Techno-Magic",
      image: Background.tm1,
      enabled: false,
      online: [32, 200]
    },
    {
      id: "dc",
      client: "decocraft",
      name: "Builders Place",
      image: Background.dc,
      enabled: true,
      online: [92, 200]
    },
    {
      id: "minigames",
      client: "minigames",
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