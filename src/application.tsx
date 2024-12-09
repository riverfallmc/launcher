import { BrowserRouter, Route, Routes } from "react-router";

// Authorization page
import Authorization from "page/authorization";
// Launcher pages
import Library from "page/app/library";
import Servers from "page/app/servers";
import Downloads from "page/app/downloads";
import Settings from "page/app/settings";

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authorization/>}/>
        <Route path="app">
          <Route index element={<Library/>}/>
          <Route path="servers" element={<Servers/>}/>
          <Route path="downloads" element={<Downloads/>}/>
          <Route path="settings" element={<Settings/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Application;