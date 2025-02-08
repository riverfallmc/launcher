import Link from "@/components/link";
import Avatar from "@/components/avatar";
import { forwardRef, ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { RiTelegram2Fill } from "react-icons/ri";
import { FaDiscord } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/shadcn/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { AuthService } from "@/service/auth.service";
import { getWebsite, openUrl } from "@/utils/url.util";
import { cn } from "@/utils/class.util";
import { getUser } from "@/storage/user.storage";
import { getSession } from "@/storage/session.storage";
import { formatBalance } from "@/utils/format.util";
import { HttpService } from "@/service/http.service";

export function LauncherTopBar() {
  return (
    <div data-tauri-drag-region className="w-full px-24 flex justify-between min-h-20 h-20 bg-neutral-900">
      <LogoLinks/>
      <SocialMedia/>
      <UserMenu/>
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
      <WebLink disableblank="true" href="/launcher">Главная</WebLink>
      <WebLink href={getWebsite()}>Сайт</WebLink>
      <WebLink href={getWebsite("donate")}>Донат</WebLink>
    </Layout>
  )
}

function Riverfall() {
  return <img className="w-auto h-12" src="/assets/riverfall.png"/>
}

function WebLink(
  props: {children: ReactNode, href: string, disableblank?: string}
) {
  return (
    <Link {...props} className="text-neutral-500 font-medium hover:text-neutral-100 text-sm"/>
  )
}

function SocialMedia() {
  return (
    <Layout className="space-x-3">
      <WebButton href={getWebsite("telegram")} Icon={RiTelegram2Fill}/>
      <WebButton href={getWebsite("discord")} Icon={FaDiscord}/>
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

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: (func: () => () => Promise<void>) => void;
}

// Компонент User
const User = forwardRef<HTMLDivElement, UserProps>((props, ref) => {
  const user = getUser();
  const session = getSession();
  const [balance, setBalance] = useState(0);

  if (!user || !session)
    return <div></div>;

  const requestBalance = async () => {
    try {
      let body = await HttpService.get<{ balance: number }>(`api/donate/balance?id=${user.id}`, session.jwt);
      setBalance(body.balance);
    } catch (_) {}

    // } catch (err) {
    // setError(caughtError(err).message);
    // }
  };

  useEffect(() => props.trigger(() => requestBalance), [props.trigger]);

  useEffect(() => {
    (async () => {
      try {
        await requestBalance();
      } catch (_) {}
    })();
  }, []);

  return (
    <div
      ref={ref}
      {...props}
      className={`flex items-center`}
    >
      <button className="flex justify-center items-center space-x-3 px-3 hover:bg-neutral-800 transition rounded-lg py-2">
        <Avatar className="h-11" username={user.username} />
        <div className="flex flex-col space-y-1 leading-3">
          <span>{user.username}</span>
          <span className="flex text-xs font-normal text-neutral-400">
            Баланс: {formatBalance(balance)}
          </span>
        </div>
      </button>
    </div>
  );
});
User.displayName = "User";

function UserMenu() {
  const [updateBalanceState, setUpdateBalanceState] = useState<() => {}>();

  const updateBalance = () => {
    if (updateBalanceState)
      updateBalanceState();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User trigger={setUpdateBalanceState} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-800 text-white">
        <DropdownMenuLabel>Пользователь</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem className="font-normal" onClick={async () => await openUrl("profile")}>Профиль</DropdownMenuItem>
          <DropdownMenuItem className="font-normal" onClick={() => updateBalance()}>Обновить баланс</DropdownMenuItem>
          <DropdownMenuItem className="font-normal" onClick={() => AuthService.logout()}>Выйти</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}