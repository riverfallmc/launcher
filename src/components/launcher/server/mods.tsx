export function ModList({ list }: { list: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 items-start overflow-y-auto content-start size-full">
      <div className="flex flex-wrap gap-2 items-start overflow-y-auto h-full w-full">
        {list.map((mod, index) => (
          <div key={index} className="py-2 px-3 bg-white/10 rounded-md">
            {mod}
          </div>
        ))}
      </div>
    </div>
  );
}