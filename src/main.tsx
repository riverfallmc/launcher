import "@/main.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router";
import ReactDOM from "react-dom/client";
import Updater from "./page/updater/updater";
import Authorization from "./page/authorization/authorization";
import Launcher from "./page/launcher/launcher";
import Titlebar from "./component/window/titlebar";
import ErrorView from "./page/error/error";
import ConfirmTwoFactorAuth from "./page/authorization/2faconfirm";
import { ThemeProvider } from "./component/themeprovider";
import { configureTray } from "util/tray.util";
import { configureDiscord } from "util/discord.util";
import { configureDownloader } from "util/downloader.util";
import { configureNotifications } from "./util/notify.util";

(async () => {
  await configureTray();
  await configureNotifications();
  await configureDownloader();
  await configureDiscord();
})()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <Titlebar/>

      {/* ну, то что оно находится здесь не очень клёво */}
      <ConfirmTwoFactorAuth/>
      <ErrorView/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Updater/>}/>
          <Route path="/authorization" element={<Authorization/>}/>
          <Route path="/launcher" element={<Launcher/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
