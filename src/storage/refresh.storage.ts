const key = "refresh";

export function setRefresh(
  refresh: string
) {
  return localStorage.setItem(key, refresh);
}

export function getRefresh(): string | null {
  return localStorage.getItem(key);
}