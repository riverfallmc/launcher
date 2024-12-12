import React, { Attributes, useState } from "react";
import Avatar from "component/avatar";
import { getAvatarUrl, getUser, User } from "util/user";
import { Library, Play, Download, Settings } from "lucide-react";

interface Props
  extends React.BaseHTMLAttributes<Attributes> {}

export function Sidebar(_props: Props) {
  const [user] = useState<User>(getUser());

  return (
    <SidebarPanel>
      <SidebarButton alt="Библиотека" href="/app"><Library/></SidebarButton>
      <SidebarButton alt="Сервера" href="/app/servers"><Play/></SidebarButton>
      <SidebarButton alt="Загрузки" href="/app/downloads"><Download/></SidebarButton>
      <SidebarButton alt="Настройки" href="/app/settings"><Settings/></SidebarButton>

      <SidebarBottom>
        <Avatar
          title={user.username}
          className="w-9 rounded-[25%]"
          src={getAvatarUrl(user.username)}/>
      </SidebarBottom>
    </SidebarPanel>
  )
}

function SidebarPanel({children}: {children: React.ReactNode}) {
  return <div
    data-tauri-drag-region
    className="w-auto h-full p-2 flex flex-col flex-shrink-0 outline outline-1 outline-secondary outline-offset-0 outline-r"
    >{children}</div>
}

function SidebarButton({children, href, alt}: {children: React.ReactNode, href: string, alt: string}) {
  return (
    <a title={alt} href={href}>
      <button className="bg-transparent hover:bg-secondary p-2 w-9 h-9 flex justify-center items-center rounded-md text-white hover:text-white/80 transition">{children}</button>
    </a>
  )
}

function SidebarBottom({children}: {children: React.ReactNode}) {
  return (
    // todo @ костыль
    <div className="bottom-0 fixed pb-2 space-y-1">
      {children}
    </div>
  )
}