import { LauncherTopBar } from "@/components/launcher/topbar";
import { PageView } from "@/components/pageview";

export function LauncherView() {
  return (
    <PageView>
      <div data-tauri-drag-region className="flex flex-col flex-shrink h-screen max-h-screen">
        <LauncherTopBar/>

        {/* <Content>
          <ServerList/>
        </Content> */}
    </div>
    </PageView>
  )
}