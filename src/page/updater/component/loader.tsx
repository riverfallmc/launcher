function Loader() {
  return (
    <div className="flex flex-col justify-center items-center space-y-3">
      <LoadingSpinner logoSrc="src/asset/test.png"/>
      <div className="flex flex-col justify-center items-center">
        <span className="font-bold text-xl">Riverfall</span>
        <span className="text-sm text-neutral-400">Загружаем лаунчер...</span>
      </div>
    </div>
  )
}

const LoadingSpinner = ({ logoSrc }: {logoSrc: string}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Riverfall"
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;