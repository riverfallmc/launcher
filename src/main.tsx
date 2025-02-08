import "@/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthorizationView } from "./views/authorization.view";
import { UpdaterView } from "./views/updater.view";
import { LauncherView } from "./views/launcher.view";
import Titlebar from "./components/titlebar";
import { ErrorProvider } from "./components/error";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorProvider>
    {/* <ThemeProvider defaultTheme="dark"> */}
      <Titlebar/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UpdaterView/>}/>
          <Route path="/authorization" element={<AuthorizationView/>}/>
          <Route path="/launcher" element={<LauncherView/>}/>
        </Routes>
      </BrowserRouter>
    {/* </ThemeProvider> */}
    </ErrorProvider>
  </React.StrictMode>,
);