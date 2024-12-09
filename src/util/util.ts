export function cn(
  first: string,
  second?: string
): string {
  return `${first} ${second}`;
}

const urlBase = process.env.NODE_ENV == "production" ? "https://serenitymc.ru" : "https://localhost";

export function getWebserverUrl(
  uri?: string
): string {
  return `${urlBase}/${uri}`;
}