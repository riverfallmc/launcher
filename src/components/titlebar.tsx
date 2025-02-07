import { MdClose, MdMinimize } from "react-icons/md";

function Titlebar() {
  return (
    <div data-tauri-drag-region className="absolute z-50 w-full flex justify-end">
      <TitlebarButton onClick={() => {}}><MdMinimize className="w-4 h-4" /></TitlebarButton>
      <TitlebarButton onClick={() => {}}><MdClose className="w-4 h-4" /></TitlebarButton>
    </div>
  )
}

function TitlebarButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return <button {...props} className="bg-none hover:bg-neutral-600/20 transparent w-8 h-6 flex justify-center items-center"></button>
}

export default Titlebar;