import { AppManager, Invoker } from "@/util/tauri.util";
import { useEffect } from "react";
import Copyright from "./component/copyright";
import Loader from "./component/loader";
import Background from "@/component/window/background";

function Updater() {
  useEffect(() => {
    (async () => {
      const shouldClose = await Invoker.checkUpdates();
      if (shouldClose)
        AppManager.closeApp();
      else
        AppManager.authorization();
    })()
  }, [])

  // TODO @ Пересмотреть дизайн
  return (
    <>
      <Background src="src/asset/background/updater.png"/>
      <div className="p-6 flex flex-col h-screen">
        <div data-tauri-drag-region className="h-full flex justify-center items-center">
          <Loader/>
        </div>

        {/* Низ (копирайт) */}
        <div className="w-full flex justify-center items-center">
          <Copyright/>
        </div>
      </div>
    </>
  )
}

export default Updater;