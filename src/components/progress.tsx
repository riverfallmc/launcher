import { cn } from "@/utils/class.util";
import { motion } from "framer-motion";

interface Props
  extends React.ProgressHTMLAttributes<HTMLDivElement>
{
  value: number;
  max?: number;
}

export function Progress({ value, max = 100, ...rest }: Props) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div
      {...rest}
      className={cn("w-full bg-orange-50 rounded-md overflow-hidden", rest.className)}
    >
      <motion.div
        className="h-full bg-orange-600 rounded-md"
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
