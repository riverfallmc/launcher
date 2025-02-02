import Background from "@/component/window/background";
import Titlebar from "./component/titlebar";
import Content from "./component/content";
import { ServerList } from "./component/server";

function Launcher() {
  return (
    <div data-tauri-drag-region className="flex flex-col flex-shrink h-screen max-h-screen">
      <Background/>

      <Titlebar/>

      <Content>
        <ServerList/>
      </Content>
    </div>
  )
}

export default Launcher;