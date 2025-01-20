import { cn } from "@/util/unsorted.util";

interface Props
  extends React.ImgHTMLAttributes<HTMLImageElement> {};

function Background(
  props: Props
) {
  return (
    <div className="overflow-hidden size-full fixed -z-10">
      <div data-tauri-drag-region className="absolute size-full bg-neutral-900/80 z-10"></div>
      <img {...props} src="src/assets/testbg.jpg" className={cn("size-full object-cover saturate-0 blur-[2px]", props.className)}/>
    </div>
  )
}

export default Background;
