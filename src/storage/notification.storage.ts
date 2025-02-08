const key = "refresh";

export function addTrayNotification() {
  return localStorage.setItem(key, (getTrayNotification() + 1).toString());
}

export function getTrayNotification(): number {
  return parseInt(localStorage.getItem(key) || "0");
}

export function removeTrayNotification() {
  localStorage.removeItem(key);
}