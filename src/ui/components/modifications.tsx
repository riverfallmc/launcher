import type { Modification as IModification } from "util/util";
import Avatar from "component/avatar";

function Modifications({ mods }: { mods?: IModification[] }) {
  return (
    <div className="flex flex-col space-y-1 h-full">
      <span className="text-white text-xl">Модификации</span>

      {/* Контейнер с прокруткой, если содержимое переполняет */}
      <div className="overflow-auto scroll pr-1 max-h-full grid grid-cols-2 gap-1">
        {mods?.map(mod => <Modification  mod={mod} />)}
      </div>
    </div>
  );
}

function Modification({mod}: {mod: IModification}) {
  return (
    <div className="p-1.5 bg-secondary rounded-md leading-5 flex items-center gap-x-2">
      <Avatar className="w-6 rounded-md" src={mod.icon}/>
      <span className="text-white/75">{mod.name}</span>
    </div>
  )
}

export default Modifications;