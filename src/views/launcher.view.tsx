import Content from "@/components/launcher/content";
import { ServerList } from "@/components/launcher/server/list";
// import { ServerList } from "@/components/launcher/list";
import { LauncherTopBar } from "@/components/launcher/topbar";
import { PageView } from "@/components/pageview";
import { SessionService } from "@/service/session.service";
import { View, ViewService } from "@/service/view.service";
import { minutes } from "@/utils/data.util";

export function LauncherView() {
  // проверяем раз в 5 минут статус нашего jwt
  setTimeout(async () => {
    let result = await SessionService.validateSession();

    if (!result) {
      SessionService.clear();
      ViewService.setView(View.Authorization);
    }
  }, minutes(5))

  return (
    <PageView>
      <div data-tauri-drag-region className="flex flex-col flex-shrink h-screen max-h-screen">
        <LauncherTopBar/>

        <Content>
          <ServerList/>
        </Content>
    </div>
    </PageView>
  )
}
