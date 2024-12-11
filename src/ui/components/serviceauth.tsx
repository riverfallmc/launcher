import React, { Attributes } from "react";
import Button from "./button";
import { FaGithub, FaVk } from "react-icons/fa";
import { cn } from "@/util/util";

interface Props
  extends React.BaseHTMLAttributes<Attributes> {}

export function ServiceAuth(_props: Props) {
  return (
    <div className="flex flex-col space-y-2 justify-center items-center w-full">
      <span className="text-xs text-white/50">Или войдите через</span>

      <div className="flex space-x-1.5 w-full">
        <Service className="flex-grow"><FaVk/>VK</Service>
        <Service className="flex-grow"><FaGithub/>GitHub</Service>
      </div>
    </div>
  )
}

function Service({children, className}: {children: React.ReactNode, className?: string}) {
  return <Button className={cn("flex-grow flex justify-center items-center gap-x-2 bg-violet-900 hover:bg-violet-950 py-1", className)}>{children}</Button>
}