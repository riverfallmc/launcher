import Content from "@/components/launcher/content";
import { FriendList, FriendProvider } from "@/components/launcher/friendlist";
import { Invite } from "@/components/launcher/invites";
import { ServerList } from "@/components/launcher/server/list";
import { LauncherTopBar } from "@/components/launcher/topbar";
import { PageView } from "@/components/pageview";
import { SessionService } from "@/service/session.service";
import { View, ViewService } from "@/service/view.service";
import { minutes } from "@/utils/data.util";

export function LauncherView() {
  // проверяем раз в 5 минут статус нашего jwt
  setInterval(async () => {
    let result = await SessionService.validateSession();

    if (!result) {
      SessionService.clear();
      ViewService.setView(View.Authorization);
    }
  }, minutes(5))

  return (
    <PageView>
      <div data-tauri-drag-region className="flex flex-col flex-shrink h-screen max-h-screen">
        <FriendProvider>
          <LauncherTopBar/>
          <FriendList/>
        </FriendProvider>

        <Content>
          <ServerList/>
        </Content>
      </div>

      <div className="absolute inset-0 flex justify-end p-4 pointer-events-none z-10">
        <div className="flex flex-col justify-end">
          <Invite/>
        </div>
      </div>
    </PageView>
  )
}
