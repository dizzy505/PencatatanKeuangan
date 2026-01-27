export interface User {
  username: string;
}

const USERS: Record<string, string> = {
  icad: "icadkeren314",
  aya: "ayakebu352",
};

const STORAGE_KEY = "app_current_user";

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const login = async (
  username: string,
  password: string,
): Promise<User> => {
  const expected = USERS[username];
  if (!expected || expected !== password) {
    throw new Error("Username atau password salah");
  }
  const user: User = { username };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
