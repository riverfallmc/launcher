import { Download } from "lucide-react";
import React from "react";

export class Downloads extends React.Component {
  render(): React.ReactNode {
    return (
        <button className="p-3 rounded-[50%] bg-neutral-100 transition hover:bg-neutral-200 shadow-black-extended"><Download/></button>
    )
  }
}