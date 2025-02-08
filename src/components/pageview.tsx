import type { ReactNode } from "react";
import { Background } from "./background";

export function PageView(
  { children, backgroundImage }: { children?: ReactNode; backgroundImage?: string }
) {
  return (
    <main data-tauri-drag-region className="relative w-screen h-screen">
      <Background className="absolute inset-0" src={backgroundImage || undefined} />

      <div className="relative z-10" children={children} />
    </main>
  );
}
