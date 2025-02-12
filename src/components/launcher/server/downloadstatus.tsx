import { Progress } from "@/components/progress";

export function DownloadStatus(
  { status, progress }: { status: string, progress: number }
) {
  return (
    <div className="w-full flex flex-col justify-center space-y-1">
      <span className="text-sm text-neutral-300">{ status }</span>
      <Progress className="h-5" value={progress}/>
    </div>
  )
}
