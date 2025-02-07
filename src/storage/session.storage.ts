export type Session = {
  id: number,
  is_active: boolean,
  jwt: string,
  last_activity: string,
  refresh_token: string,
  user_id: number,
  useragent: string;
};

const key = "session";

export function setSession(
  session: Session
) {
  return localStorage.setItem(key, JSON.stringify(session));
}

export function getSession(): Session | null {
  let data = localStorage.getItem(key);

  if (!data)
    return null;

  return JSON.parse(data);
}