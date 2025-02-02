import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatGemsBalance(balance: number): string {
  const cases = ["гем", "гема", "гемов"];
  const mod10 = balance % 10;
  const mod100 = balance % 100;

  const caseIndex =
    mod100 >= 11 && mod100 <= 14 ? 2 :
      mod10 === 1 ? 0 :
        mod10 >= 2 && mod10 <= 4 ? 1 :
          2;

  return `${balance} ${cases[caseIndex]}`;
}

export function formatError(
  error: unknown
): string {
  let message: string;

  if (error instanceof Error)
    message = error.message;
  else
    message = "Неизвестная ошибка: " + error;

  return message;
}