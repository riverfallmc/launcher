export type Credentials = {
  username: string,
  password: string,
  autoLogin: boolean;
};

const key = "credentials";

export function setCredentials(
  credentials: Credentials
) {
  return localStorage.setItem(key, JSON.stringify(credentials));
}

export function getCredentials(): Credentials | null {
  let data = localStorage.getItem(key);

  if (!data)
    return null;

  return JSON.parse(data);
}

export function removeCredentials() {
  localStorage.removeItem(key);
}