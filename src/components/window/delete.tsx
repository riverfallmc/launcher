import React, { useState } from "react";
import { createPortal } from "react-dom";
import { LuLoader } from "react-icons/lu";
import { Window } from "../window";
import { useError } from "../error";
import { ClientService, ClientState } from "@/service/game/client.service";
import { caughtError } from "@/utils/error.util";

export function DeleteWindow(
  { onClose, setClientState, client }: { onClose: () => void, setClientState: React.Dispatch<React.SetStateAction<ClientState>>, client: string }
) {
  const setError = useError();
  const [deleting, setDeleting] = useState(false);
  const close = () => {
    if (deleting)
      return;

    onClose()
  }

  const deleteClient = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    setDeleting(true);

    target.disabled = true
    target.innerText = "Удаление";

    try {
      await ClientService.remove(client);
      setClientState(ClientState.Install);
    } catch(err) {
      setError(caughtError(err).message);
    }

    onClose();
  }

  // todo переделать в DialogWindow
  return createPortal(
    <Window onClose={close}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col">
          <span className="text-sm text-neutral-400">Внимание!</span>
          <span>{deleting ? "Удаление клиента..." : "Вы точно хотите удалить клиент?"}</span>
        </div>

        <div className="flex justify-between">
          {/* небольшой хак */}
          <div/>
          <div className="flex gap-x-3">
            <button onClick={deleteClient} className="bg-red-500 hover:bg-red-700 flex items-center gap-x-1.5  disabled:bg-red-900 disabled:text-red-200 transition cursor-pointer p-1.5 px-3 rounded-md">{deleting ? (<><LuLoader className="spinner"/> <span> Удаление</span></>) : ("Удалить")}</button>
            <button onClick={deleting ? () => {} : onClose} className="bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer p-1.5 px-3 rounded-md">Отмена</button>
          </div>
        </div>
      </div>
    </Window>,
    document.body
  )
}