import { createPortal } from "react-dom";
import { Window } from "../window";
import { openUrl } from "@/utils/url.util";
import { FiExternalLink } from "react-icons/fi";
import { playSound } from "@/api/sound.api";
import { getVersion } from "@tauri-apps/api/app";
import RiverfallLogo from "@/assets/pixelfall.svg";
import { useEffect, useState } from "react";

export function AboutWindow(
  { onClose }: { onClose: () => void }
) {
  const [version, setVersion] = useState("0.0.0");

  useEffect(() => {
    (async () => {
      setVersion(await getVersion());
    })()
  }, [])

  return createPortal(
    <Window onClose={onClose}>
      <div className="flex flex-col gap-y-8">
        <div className="flex gap-x-3">
          <RiverfallLogo onClick={() => playSound("/sounds/fart.mp3")} className="aspect-square cursor-pointer fill-pink-300 w-16"/>
          <div className="flex flex-col justify-center gap-y-1">
            <span className="text-xl font-semibold whitespace-nowrap">Лаунчер Riverfall</span>
            <span className="flex gap-x-1 text-neutral-500">2025 © smokingplaya, <Link/></span>
          </div>
        </div>

        <span className="text-neutral-400">Лаунчер Riverfall - это программа,<br/>позволяющая легко заходить на<br/>наши игровые сервера.</span>
        <span className="text-neutral-400">Версия {version}</span>
        <button onClick={() => openUrl("https://github.com/riverfallmc/launcher-builds/issues/new", false)} className="bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer rounded-lg py-3">Сообщить о проблеме</button>
      </div>
    </Window>,
    document.body
  )
}

function Link() {
  return <a className="cursor-pointer text-blue-400 hover:text-blue-300 flex items-center gap-x-1.5 transition" onClick={() => openUrl()}>riverfall.ru <FiExternalLink/> </a>
}
