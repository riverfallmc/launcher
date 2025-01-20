import { AppManager } from "@/util/tauri.util";
import { cn } from "@/util/unsorted.util";
import { MdClose, MdMinimize } from "react-icons/md";

function Titlebar() {
  return (
    <div data-tauri-drag-region className="absolute z-50 w-full flex justify-end">
      <TitlebarButton onClick={() => AppManager.minimize()}><MdMinimize className="w-4 h-4" /></TitlebarButton>
      <TitlebarButton onClick={() => AppManager.minimizeToTray()}><MdClose className="w-4 h-4" /></TitlebarButton>
    </div>
  )
}

function TitlebarButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return <button {...props} className={cn("bg-none hover:bg-neutral-600/20 transparent w-8 h-6 flex justify-center items-center", props.className)}></button>
}

export default Titlebar;