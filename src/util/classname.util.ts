/**
 * Функция, которая нужна на фронтэнд части (React), чтобы совмещать кастомый className и className из дополнительных аргументов (аттрибутов HTML)
 * @param original Свой, кастомный className
 * @param additional className из аттрибутов
 * @returns Готовый className
 */
export function className(
  original: string,
  additional: string = ""
): string {
  return `${original} ${additional}`;
}