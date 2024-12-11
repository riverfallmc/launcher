import "@/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
// Authorization page
import Authorization from "page/authorization";
// Launcher tabs (pages)
import Library from "page/app/library";
import Servers from "page/app/servers";
import Downloads from "page/app/downloads";
import Settings from "page/app/settings";

// Todo: Remove
import { invoke } from "@tauri-apps/api/core";

(async () => {
  await invoke("setDrpcEnabled", { enabled: true });
})();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library/>}/> {/** Authorization */}
        <Route path="app">
          <Route index element={<Library/>}/>
          <Route path="servers" element={<Servers/>}/>
          <Route path="downloads" element={<Downloads/>}/>
          <Route path="settings" element={<Settings/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
