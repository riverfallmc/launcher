import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getServer, getServerDetails } from "util/server";
import { Server as IServer, ServerDetails as IServerDetails, updateTitle } from "util/util";
import { Activity, Buttons, updateActivity } from "util/discord";
import Background from "component/background";
import FriendsOnServer from "component/friends";
import Modifications from "component/modifications";
import { BasePage, BasePageContent } from "component/page";
import Badge from "component/badge";
import Button from "component/button";
import { invoke } from "@tauri-apps/api/core";
import { getUser } from "@/util/user";

type Control = "disabled" | "install" | "play";

function Server() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [server, setServer] = useState<IServer>();
  const [control, setControl] = useState<Control>("disabled");
  const [serverDetails, setServerDetails] = useState<IServerDetails>();

  const update = async (server: IServer) => {
    await updateTitle(server.name);
    await updateActivity(new Activity({
      title: "Выбирает сервер",
      subtitle: server.name || "n/a",
      image: server.id || "n/a",
      buttons: Buttons.default,
    }));
  };

  const getServerData = async () => {
    const id = params.get("serverId");

    if (!id) throw new Error("No serverId query param provided.");

    let server = await getServer(id);
    let details = await getServerDetails(id);

    if (!server || !details) throw new Error(`Unable to get server with ID ${id}.`);

    setServer(server);
    setServerDetails(details);
    await update(server);
  };

  const getControlLocalized = () => {
    switch (control) {
      case "disabled":
        return "Выключен";
      case "install":
        return "Установить клиент";
      case "play":
        return "Играть";
    }
  };

  const controlClick = () => {
    switch (control) {
      case "disabled": return;
      case "install":
        invoke("install", {id: server?.client});
        break;
      case "play":
        invoke("play", {id: server?.client, ip: server?.id, token: getUser().token});
        break;
    }
  };

  useEffect(() => {
    setControl("play");
  }, []);


  useEffect(() => {
    getServerData();
  }, []);

  // редирект на главную страницу если нажать на esc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        navigate("/app");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (!server) return <BasePage/>

  return (
    <BasePage>
      <Background isBlacked src={server.image}/>

      <BasePageContent className="p-8 flex">
        {/* Левая панель */}
        <div className="w-[50%] pr-2 h-full flex flex-col space-y-1 leading-5 box-content">
          <span className="uppercase font-medium text-2xl text-white">{server.name}</span>
          <div className="flex space-x-1">
            {/* Todo: await for this information */}
            <Badge color="#3b3b3b" textColor="white">Forge</Badge>
            <Badge color="#3b3b3b" textColor="white">1.18.2</Badge>
            {/* <Badge color="#3b3b3b" textColor="white">Relax</Badge> */}
          </div>

          <span className="text-white/75">{serverDetails?.description}</span>

          <Button
            disabled={control === "disabled"}
            className="bg-secondary hover:bg-primary transition disabled:bg-tertiary disabled:text-white/50"
            onClick={controlClick}>{getControlLocalized()}</Button>
        </div>

        {/* Правая панель */}
        <div className="w-[50%] h-full flex flex-col space-y-2">
          <Online online={server.online} />
          <FriendsOnServer id={server.id} />
          <div className="h-[calc(100%-auto)] overflow-auto flex-grow">
            <Modifications mods={serverDetails?.mods} />
          </div>
        </div>
      </BasePageContent>
    </BasePage>
  )
}

function Online({online}: {online: number[]}) {
  return (
    <div className="w-full h-auto text-white flex flex-col space-y-1 leading-5">
      <span className="text-xl">Онлайн</span>
      <span className="text-neutral-300">Сейчас на сервере играет {online[0]} игроков из {online[1]} возможных.</span>
    </div>
  )
}

export default Server;