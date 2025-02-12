import { forwardRef } from "react";
import { cn } from "@/utils/class.util";
import { FaCheck } from "react-icons/fa6";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(props, ref) {
  switch (props.type) {
    case "text":
    case "number":
    case "password":
      return <Text ref={ref} {...props} />;
    case "checkbox":
      return <CheckBox ref={ref} {...props} />;
    case "otp":
      return <OTP ref={ref} {...props} />;
    default:
      return <input ref={ref} {...props} />;
  }
});

const Text = forwardRef<HTMLInputElement, Props>(function Text({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn("w-full py-4 px-5 bg-neutral-700/10 rounded-lg outline-1 outline-none placeholder:text-neutral-500", className)}
    />
  );
});

const OTP = forwardRef<HTMLInputElement, Props>(function OTP(props, ref) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
  }

  return <Text ref={ref} maxLength={6} minLength={6} {...props} onInput={handleInputChange} />;
});

const CheckBox = forwardRef<HTMLInputElement, Props>(function CheckBox({ className, ...props }, ref) {
  return (
    <div className="w-auto flex gap-2 items-center">
      <div className="relative w-5 h-5">
        <input
          ref={ref}
          {...props}
          className={cn(
            "peer absolute inset-0 w-full h-full cursor-pointer appearance-none bg-neutral-500/10 rounded-md focus:ring-0 checked:bg-blue-500/30 checked:border-0 disabled:border-steel-400 disabled:bg-steel-400",
            className
          )}
          type="checkbox"
        />
        <FaCheck className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
      </div>
    </div>
  );
});
