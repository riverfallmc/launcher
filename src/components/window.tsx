import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/class.util";

export function Window(
  { backgroundImage, children, onClose, className }: { backgroundImage: string, children?: ReactNode, onClose: () => void, className?: string }
) {
  return (
    <div autoFocus className="fixed inset-0 flex items-center justify-center back-blur z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn("relative flex items-center px-12 py-8 gap-x-8 bg-white rounded-2xl", className)}
      >
        <div
          className="absolute inset-0 rounded-lg bg-cover bg-center filter saturate-0"
          style={{
            backgroundImage:
              `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${backgroundImage})`,
          }}
        />

        {children}
      </motion.div>
    </div>
  );
}
