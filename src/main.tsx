import "@/main.css";
import {BrowserRouter, Route, Routes} from "react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import Updater from "./page/updater/updater";
import Authorization from "./page/authorization/authorization";
import Launcher from "./page/launcher/launcher";
import Titlebar from "./component/window/titlebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Titlebar/>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Updater/>}/>
        <Route path="/authorization" element={<Authorization/>}/>
        <Route path="/launcher" element={<Launcher/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
