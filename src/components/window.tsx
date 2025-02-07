import { ReactNode, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export function useWindow() {
  const [isOpen, setIsOpen] = useState(false);

  const openWindow = useCallback(() => setIsOpen(true), []);
  const closeWindow = useCallback(() => setIsOpen(false), []);

  const WindowComponent = ({ backgroundImage, children }: { backgroundImage: string, children: ReactNode }) => 
    isOpen ? (
      <Window backgroundImage={backgroundImage} onClose={closeWindow}>
        {children}
      </Window>
    ) : null;

  return { openWindow, closeWindow, WindowComponent };
}

export function Window({ backgroundImage, children, onClose }: { backgroundImage: string, children: ReactNode, onClose: () => void }) {
  const [container] = useState(() => document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur z-50" 
      onClick={onClose}
    >
      <div
        className="relative rounded-lg p-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full saturate-0 h-full object-cover opacity-50"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>,
    container
  );
}