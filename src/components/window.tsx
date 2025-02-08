import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface WindowProps {
  backgroundImage: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Window({ backgroundImage, children, isOpen, onClose }: WindowProps) {
  const [visible, setVisible] = useState(false);
  const container = document.createElement("div");

  useEffect(() => {
    if (isOpen) {
      document.body.appendChild(container);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);  
      // setTimeout(() => document.body.removeChild(container), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`relative rounded-lg p-10 overflow-hidden transform transition-transform duration-300 ${visible ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img tauri-drag-region src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div tauri-drag-region className="relative z-10">{children}</div>
      </div>
    </div>,
    container
  );
}
