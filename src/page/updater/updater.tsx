import { AppManager, Invoker } from "@/util/tauri.util";
import { useEffect } from "react";
import Copyright from "./component/copyright";
import Loader from "./component/loader";

function Updater() {
  useEffect(() => {
    (async () => {
      const shouldClose = await Invoker.checkUpdates();
      if (shouldClose)
        AppManager.closeApp();
      else
        // TODO#production @ AppManager.authorization();
        AppManager.launcher();
    })()
  }, [])

  // TODO @ Добавить пиксельный шум на фон
  return (
    <div className="p-6 flex flex-col h-screen">
      <div data-tauri-drag-region className="h-full flex justify-center items-center">
        <Loader/>
      </div>

      {/* Низ (копирайт) */}
      <div className="w-full flex justify-center items-center">
        <Copyright/>
      </div>
    </div>
  )
}

export default Updater;