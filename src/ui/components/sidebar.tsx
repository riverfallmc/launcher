import React, { Attributes, useState } from "react";
import Avatar from "component/avatar";
import { getAvatarUrl, getUser, User } from "util/user";
import { Library, Play, Download, Settings, LucideUser, LogOutIcon } from "lucide-react";
import { getWebserverUrl } from "@/util/util";

interface Props
  extends React.BaseHTMLAttributes<Attributes> {}

// todo @ open/close managment
function openUserMenu() {}

function UserMenuButton({children, href, blank}: {children: React.ReactNode, href: string, blank?: boolean}) {
  return (
    <a href={href} target={blank ? "_blank": "_self"}>
      <button className="text-white/70 hover:text-white transition bg-secondary/30 hover:bg-secondary w-full py-0.5 rounded-md flex justify-center items-center gap-x-1.5">{children}</button>
    </a>
  )
}

function UserMenu({username}: {username: string}) {
  return (
    <div className="ml-4 mt-4 absolute bg-primary min-w-40 p-2 outline flex flex-col justify-center items-center outline-secondary rounded-md">
      <span className="text-white text-sm flex justify-center items-center gap-x-1"><LucideUser className="w-4"/> {username}</span>
      <div className="h-[2px] w-full my-1 rounded-full bg-secondary/50"/>
      <div className="flex flex-col w-full space-y-1">
        <UserMenuButton blank href={getWebserverUrl("account")}><LucideUser className="w-4"/>Профиль</UserMenuButton>
        <UserMenuButton href={getWebserverUrl("logout")}><LogOutIcon className="w-4"/>Выйти</UserMenuButton>
      </div>
    </div>
  )
}

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
          src={getAvatarUrl(user.username)}
          onClick={() => openUserMenu()}/>
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