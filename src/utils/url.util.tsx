export function getWebsite(uri: string = "") {
  return process.env.NODE_ENV === "production" ? `https://riverfall.ru/${uri}` : `https://localhost/${uri}`;
}