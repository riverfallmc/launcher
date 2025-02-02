import "./anim.css";

function Loader() {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <LoadingSpinner logoSrc="src/asset/riverfall-logo.png"/>
      <div className="flex flex-col justify-center items-center space-y-2">
        <span className="font-bold text-3xl">Riverfall</span>
        <span className="text-xs font-semibold  text-neutral-500">Проверяем обновления</span>
      </div>
    </div>
  )
}

const LoadingSpinner = ({ logoSrc }: { logoSrc: string }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-28 h-28">
        {/* Заменяем анимированную полоску на изображение */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="src/asset/spinner.png"
            alt="Loading Spinner"
            className="w-full h-full object-contain animate-spin-slow"
          />
        </div>
        {/* Логотип остается без изменений */}
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