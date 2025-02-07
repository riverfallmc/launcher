import { cn } from "@/utils/class.util";

interface BackgroundProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  blur?: boolean;
  desaturate?: boolean;
}

export function Background({ blur = true, desaturate = true, ...props }: BackgroundProps) {
  return (
    <div>
      <div data-tauri-drag-region className="absolute size-full bg-neutral-900/80 z-10"></div>
      <img
        {...props}
        src={props.src || "/assets/background/default.jpg"}
        className={cn(
          "size-full object-cover",
          blur && "blur-[2px]",
          desaturate && "saturate-0",
          props.className
        )}
      />
    </div>
  );
}
