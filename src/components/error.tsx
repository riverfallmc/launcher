import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="fixed inset-0 flex items-center justify-center back-blur z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex items-center px-12 py-8 gap-x-8 bg-white rounded-2xl max-w-[50vw]"
      >
        <div
          className="absolute inset-0 rounded-lg bg-cover bg-center filter saturate-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(/assets/background/error.jpg)",
          }}
        />

        <div className="flex flex-col z-10 leading-5 space-y-1">
          <span className="text-sm text-neutral-500 uppercase">Ошибка</span>
          <span className="first-letter:uppercase">{message}</span>
        </div>

        <img className="relative z-10 h-16" src="/assets/scene/cat.png" />
      </motion.div>
    </div>
  );
}