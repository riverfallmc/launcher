import { close, minimize } from "@/service/application.service";
import { MdClose, MdMinimize } from "react-icons/md";

function Titlebar() {
  return (
    <div data-tauri-drag-region className="absolute z-50 w-full flex justify-end pointer-events-none">
      <div className="flex pointer-events-auto">
        <TitlebarButton onClick={minimize}><MdMinimize className="w-4 h-4" /></TitlebarButton>
        <TitlebarButton onClick={close}><MdClose className="w-4 h-4" /></TitlebarButton>
      </div>
    </div>
  )
}

function TitlebarButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return <button {...props} className="bg-none cursor-pointer hover:bg-neutral-600/20 transparent w-8 h-6 flex justify-center items-center"></button>
}

export default Titlebar;
