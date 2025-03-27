import { Progress } from "@/components/progress";

export function DownloadStatus(
  { status, progress }: { status: string, progress: number }
) {
  return (
    <div className="w-full flex flex-col justify-center space-y-2">
      <span className="text-sm leading-3 text-neutral-300">{ status }</span>
      <Progress className="h-3" value={progress}/>
    </div>
  )
}
