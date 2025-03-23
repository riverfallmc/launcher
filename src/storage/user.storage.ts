export type User = {
  id: number,
  user_id: number,
  username: string,
  email: string,
  rank: string,
  registered_at: string;
};

const key = "user";

export function setUser(
  user: User
) {
  return localStorage.setItem(key, JSON.stringify(user));
}

export function getUser(): User | null {
  let data = localStorage.getItem(key);

  if (!data)
    return null;

  return JSON.parse(data);
}

export function removeUser() {
  localStorage.removeItem(key);
}