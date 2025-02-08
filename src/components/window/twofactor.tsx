import { createPortal } from "react-dom";
import { Window } from "../window";
import { Input } from "../input";
import { useForm } from "react-hook-form";
import { OTPSchema, OTPSchemaData } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/service/auth.service";
import { caughtError } from "@/utils/error.util";
import { View, ViewService } from "@/service/view.service";

interface Props
  extends React.BaseHTMLAttributes<HTMLDivElement>
{
  onClick: () => void;
}

export function TwoFactorWindow(props: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError
  } = useForm<OTPSchemaData>({
    resolver: zodResolver(OTPSchema)
  });

  const login = async (code: string) => {
    try {
      await AuthService.authorizeTwoFactor(code);
      await ViewService.setView(View.Launcher);
    } catch (err) {
      setError("code", {
        type: "validate",
        message: caughtError(err).message
      });
    }
  }

  return createPortal(
    <Window className="max-w-[70%] z-10" backgroundImage="/assets/background/2fa.jpg" onClose={props.onClick}>
      <img className="relative z-10 h-24" src="/assets/scene/fox.png" />
      <div className="relative z-10 flex flex-col leading-4 space-y-2">
        <span className="text-2xl font-semibold">Двуфакторная аутентификация</span>
        <span className="font-semibold text-neutral-300 text-sm leading-4 max-w-72">Для дальнейшего входа в аккаунт, введите ниже код из вашего приложения для двуфакторной аутентификации (Google Authenticator, Яндекс Ключ, и т.п)</span>

        <form onSubmit={handleSubmit(data => login(data.code))} className="flex space-x-3">
          <Input {...register("code")} type="otp" autoFocus placeholder="Код из приложения"/>
          <button type="submit" className="px-8 bg-blue-500 hover:bg-blue-600 transition rounded-lg">Войти</button>
        </form>
        {isSubmitted && errors && (
          <p className="text-red-500 text-sm">{Object.values(errors)[0]?.message}</p>
        )}
      </div>
    </Window>,
    document.body
  )
}