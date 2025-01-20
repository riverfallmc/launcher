import Link from "@/component/link";
import { WebUtil } from "@/util/web.util";

function Copyright() {
  return (
    <div className="text-neutral-400 text-xs rounded-xl px-6 py-2 bg-neutral-900 w-auto">
      <span className="font-medium">2025 © <Link href={WebUtil.getWebsiteUrl()}>Riverfall</Link>. All right reserved</span>
    </div>
  )
}

export default Copyright;