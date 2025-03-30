import "@/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthorizationView } from "./views/authorization.view";
import { UpdaterView } from "./views/updater.view";
import { LauncherView } from "./views/launcher.view";
import Titlebar from "./components/titlebar";
import { ErrorProvider } from "./components/error";
import { setup } from "./utils/setup.util";

import { configure as notifications } from "@/service/notify.service";
import { DiscordService } from "@/service/discord/discord.service";

import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { DeepLinkService } from "./service/deeplink.service";

setup(
  // notifications
  notifications,
  // discord
  async () => {
    await DiscordService.spawn();
  },
  // deep linking
  async () => {
    await onOpenUrl(urls => {
      console.log(urls);
      for (let url of urls)
        DeepLinkService.handle(url);
    })
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorProvider>
      <Titlebar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UpdaterView />} />
          <Route path="/authorization" element={<AuthorizationView />} />
          <Route path="/launcher" element={<LauncherView />} />
        </Routes>
      </BrowserRouter>
    </ErrorProvider>
  </React.StrictMode>,
);
