import { Download } from "lucide-react";
import React from "react";
import { Window, WindowContent, WindowTrigger } from "./window";

export class Downloads extends React.Component {
  render(): React.ReactNode {
    return (
      <Window title="Загрузки">
        <WindowTrigger>
          <button className="p-3 rounded-[50%] bg-neutral-100 transition hover:bg-neutral-200 shadow-black-extended"><Download/></button>
        </WindowTrigger>
        <WindowContent>
          Здарова
        </WindowContent>
      </Window>
    )
  }
}