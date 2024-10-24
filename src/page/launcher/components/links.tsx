import Application from "@/app";
import { getWebsiteUrl } from "@/util/website.util";
import React from "react";
import { FaDiscord, FaGlobe, FaTelegramPlane } from "react-icons/fa";
import { FaVk } from "react-icons/fa6";

export class Links extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="w-full h-6 overflow-visible flex space-x-2">
        <LinkButton
          label="Telegram"
          link="https://t.me/serenitymcru"
          icon={<FaTelegramPlane className="text-white"/>}
          color="#27A7E7"/>

        <LinkButton
          label="Вконтакте"
          link="https://vk.com/serenitymcru"
          icon={<FaVk className="text-white"/>}
          color="#0077FF"/>

        <LinkButton
          label="Discord"
          link="https://discord.gg/serenitymcru"
          icon={<FaDiscord className="text-white"/>}
          color="#5865F2"/>

        <LinkButton
          label="Наш сайт"
          link={getWebsiteUrl()}
          icon={<FaGlobe className="text-white"/>}
          color="#871FE1"/>
      </div>
    );
  }
}

interface LinkDetails {
  label: string,
  color: string,
  link: string,
  icon: React.ReactNode;
}

export class LinkButton extends React.Component<LinkDetails> {
  render(): React.ReactNode {
    const { label, link, icon, color } = this.props;

    return (
      <button
      onClick={() => Application.openUrlInBrowser(link)}
      className="flex items-center rounded-xl space-x-2 w-auto h-full p-2 relative shadow-black-extended transition hover:saturate-50"
      style={{ backgroundColor: color }}>
        {icon}
        <span className="text-white text-sm uppercase font-semibold">{label}</span>
      </button>
    );
  }
}