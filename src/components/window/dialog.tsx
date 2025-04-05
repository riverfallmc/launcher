import { createPortal } from "react-dom";
import { Window } from "../window";

export function DialogWindow(
  { onClose, onClick, title, message }: { onClose?: () => void, onClick?: () => void, title: string, message: string }
) {
  return createPortal(
    <Window onClose={close}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col">
          <span className="text-sm text-neutral-500">{title}!</span>
          <span>{message}</span>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-x-2">
            <button onClick={onClick} className="bg-blue-500 hover:bg-blue-600 flex items-center gap-x-1.5  disabled:bg-blue-950 disabled:text-blue-200/50 transition cursor-pointer py-1 px-2.5 rounded-md">ОК</button>
            <button onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer py-1 px-2.5 rounded-md">Отмена</button>
          </div>
        </div>
      </div>
    </Window>,
    document.body
  )
}