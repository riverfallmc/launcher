import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Window } from "./window";

interface ErrorProviderProps {
  children: ReactNode;
}

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorContext = createContext<((error: string | null) => void) | undefined>(undefined);

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider value={setError}>
      {children}
      <AnimatePresence>
        {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      </AnimatePresence>
    </ErrorContext.Provider>
  );
}

function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <Window onClose={onClose} className="max-w-[50vw]" backgroundImage="/assets/background/error.jpg">
      <div className="flex flex-col z-10 leading-5 space-y-1">
        <span className="text-sm text-neutral-500 uppercase">Ошибка</span>
        <span className="first-letter:uppercase">{message}</span>
      </div>

      <img className="relative z-10 h-16" src="/assets/scene/cat.png" />
    </Window>
  );
}