export function ServerStatus({ online }: { online: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <div
        className={`absolute w-2 h-2 rounded-full ${
          online ? "bg-lime-400" : "bg-red-600"
        }`}
      ></div>
      <div
        className={`absolute w-4 h-4 rounded-full ${
          online ? "bg-lime-400/25" : "bg-red-600/25"
        }`}
      ></div>
      <div
        className={`absolute w-6 h-6 rounded-full ${
          online ? "bg-lime-400/10" : "bg-red-600/10"
        }`}
      ></div>
    </div>
  );
};