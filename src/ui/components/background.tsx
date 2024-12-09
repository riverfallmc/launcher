import { cn } from "@/util/util";

interface LayerBlurProps {
  isBlurred?: boolean,
  blurLevel?: string,
  isBlacked?: boolean;
}

interface Props
  extends React.ImgHTMLAttributes<HTMLImageElement>, LayerBlurProps {};

const className = "size-full object-cover";

function Background(
  props: Props
) {
  return (
    <div className="overflow-hidden size-full fixed -z-10">
      <LayerBlur data-tauri-drag-region blurLevel={props.blurLevel} isBlacked={props.isBlacked} isBlurred={props.isBlurred}/>
      <img {...props} className={cn(className, props.className)}/>
    </div>
  )
}

function LayerBlur(
  props: LayerBlurProps
) {
  return (
    <div className={cn("fixed size-full", `${props.isBlurred && `backdrop-blur-${props.blurLevel || "sm"}`} ${props.isBlacked && "bg-black/50"}`)}/>
  )
}

export default Background;