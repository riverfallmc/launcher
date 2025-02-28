import { useEffect } from "react";
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { PageView } from "@/components/pageview";
import { Loader } from "@/components/updater/loader";
import { Copyright } from "@/components/copyright";
import { View, ViewService } from "@/service/view.service";

function openAuthorization() {
  ViewService.setView(View.Authorization)
}

export function UpdaterView() {
  useEffect(() => {
    check()
      .then(async update => {
        if (update?.available) {
          await update.downloadAndInstall();
          await relaunch();
        } else {
          console.log("Обновления не найдены");
        }

        openAuthorization();
      })
      .catch(() => openAuthorization())
  }, [])

  return (
    <PageView backgroundImage="/assets/background/updater.png">
      <div className="p-6 flex flex-col h-screen">
        <div data-tauri-drag-region className="h-full flex justify-center items-center">
          <Loader/>
        </div>

        <div className="w-full flex justify-center items-center">
          <Copyright/>
        </div>
      </div>
    </PageView>
  )
}