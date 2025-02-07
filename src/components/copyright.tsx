import Link from "@/components/link";

export function Copyright() {
  return (
    <div className="text-neutral-400 text-xs rounded-md px-6 py-2.5 bg-neutral-900 w-auto">
      {/* href={WebUtil.getWebsiteUrl()} */}
      <span className="font-medium">2025 © <Link href="">Riverfall</Link>. All right reserved</span>
    </div>
  )
}