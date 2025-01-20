import Link from "@/component/link";
import { cn, formatGemsBalance } from "@/util/unsorted.util";
import { WebUtil } from "@/util/web.util";
import { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { RiTelegram2Fill } from "react-icons/ri";
import { FaDiscord } from "react-icons/fa6";
import Avatar from "@/component/avatar";

function Titlebar() {
  return (
    <div data-tauri-drag-region className="w-full px-24 flex justify-between h-16 bg-neutral-900">
      <LogoLinks/>
      <SocialMedia/>
      <User/>
    </div>
  )
}

function Layout(
  props: {children: ReactNode, className?: string}
) {
  return <div {...props} className={cn("flex items-center", props.className)}/>
}

function LogoLinks() {
  return (
    <Layout className="space-x-6">
      <Riverfall/>
      <WebLink disableBlank href="/launcher">Главная</WebLink>
      <WebLink href={WebUtil.getWebsiteUrl()}>Сайт</WebLink>
      <WebLink href={WebUtil.getWebsiteUrl("donate")}>Донат</WebLink>
    </Layout>
  )
}

function Riverfall() {
  return <img className="w-auto h-12" src="src/asset/riverfall.png"/>
}

function WebLink(
  props: {children: ReactNode, href: string, disableBlank?: boolean}
) {
  return (
    <Link {...props} className="text-neutral-500 font-medium hover:text-neutral-100 text-sm"/>
  )
}

function SocialMedia() {
  return (
    <Layout className="space-x-3">
      <WebButton href={WebUtil.getWebsiteUrl("telegram")} Icon={RiTelegram2Fill}/>
      <WebButton href={WebUtil.getWebsiteUrl("discord")} Icon={FaDiscord}/>
    </Layout>
  )
}

function WebButton(
  {Icon, href}: {Icon: IconType, href: string}
) {
  return (
    <a href={href} target="_blank">
      <button className="aspect-square h-9 rounded-md bg-neutral-800 flex justify-center items-center text-neutral-400 hover:text-white transition" children={<Icon/>}/>
    </a>
  )
}

function User() {
  const user = WebUtil.getUser();
  const session = WebUtil.getSession();

  // возвращаем div а не пустые скобки, чтобы сохранять layout
  if (!user || !session)
    return <div></div>

  const [balance, setBalance] = useState(0);

  const requestBalance = async () => {
    const res = await fetch(WebUtil.getWebsiteUrl("api/donate/balance?id=" + user.id), {
      method: "GET",
      headers: {
        "Authorization": session.jwt
      }
    });

    const body: {balance: number} = await res.json();

    setBalance(body.balance);
  }

  useEffect(() => {
    (async () => {
      await requestBalance();
    })()
  });

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-10" username={user.username}/>
      <div className="flex flex-col justify-center leading-4">
        <span>{user.username}</span>
        <span className="text-xs font-normal text-neutral-400">Баланс: {formatGemsBalance(balance)}</span>
      </div>
    </div>
  )
}

export default Titlebar;