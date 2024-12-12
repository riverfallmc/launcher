import { getServer } from "@/util/server";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Server as IServer } from "util/util";

function Server() {
  const [params] = useSearchParams();
  const [server, setServer] = useState<IServer | null>();

  useEffect(() => {
    let id = params.get("serverId");

    (async () => {
      if (!id) return;

      setServer(await getServer(id));
    })()
  });

  return (
    <>{server?.name}</>
  )
}

export default Server;