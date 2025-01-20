import Background from "@/component/window/background";
import Titlebar from "./component/titlebar";
import Content from "./component/content";

function Launcher() {
  return (
    <div data-tauri-drag-region className="flex flex-col flex-shrink h-screen">
      <Background/>

      <Titlebar/>

      <Content>
      </Content>
    </div>
  )
}

export default Launcher;