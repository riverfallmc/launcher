import { openUrl } from "@/utils/url.util";

export function ModList({ list }: { list: string[] }) {
  return (
    <div className="h-auto flex flex-wrap gap-2 items-start overflow-y-auto content-start size-full">
      <div className="flex flex-wrap gap-2 items-start overflow-y-auto h-full w-full">
        {list.map((mod, index) => (
          <button
            onClick={() => openUrl("https://modrinth.com/mods?q=" + encodeURIComponent(mod), false)}
            key={index}
            className="py-2 cursor-pointer px-3 bg-white/10 hover:bg-white/20 transition rounded-md">
            {mod}
          </button>
        ))}
      </div>
    </div>
  );
}
