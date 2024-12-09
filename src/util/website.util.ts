const websiteUrl = process.env.NODE_ENV == "production" ? "https://serenitymc.ru" : "https://localhost";

/**
 * Формирует ссылку, в зависимости от того, в debug моде приложение или нет.
 * @param url URI
 * @returns Готовая ссылка
 */
export function getWebsiteUrl(
  url: string = ""
): string {
  return `${websiteUrl}/${url}`;
}