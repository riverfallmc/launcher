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
import { configure as discord } from "@/service/discord.service";
import { configure as tray } from "@/service/tray.service";

setup(
  notifications,
  discord,
  tray
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
