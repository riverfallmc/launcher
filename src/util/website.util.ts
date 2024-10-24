const websiteUrl = process.env.NODE_ENV == "production" ? "https://serenitymc.ru" : "https://localhost";

export function getWebsiteUrl(
  url: string = ""
): string {
  return `${websiteUrl}/${url}`;
}