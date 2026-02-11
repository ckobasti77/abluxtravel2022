type StoredUser = {
  username: string;
  password: string;
  role: "admin" | "user";
};

type AuthResult =
  | { ok: true; user: StoredUser }
  | { ok: false; error: string };

const STORAGE_KEY = "abluxtravel2022_users";
const SESSION_KEY = "abluxtravel2022_session";
const ADMIN_USER = "abluxtravel2022";
const ADMIN_PASS = "turizamagencizam";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return [];
  const users = safeParse<StoredUser[]>(
    window.localStorage.getItem(STORAGE_KEY),
    []
  );
  const hasAdmin = users.some((user) => user.username === ADMIN_USER);
  if (!hasAdmin) {
    users.push({ username: ADMIN_USER, password: ADMIN_PASS, role: "admin" });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
  return users;
};

export const setSession = (user: StoredUser | null) => {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  return safeParse<StoredUser | null>(
    window.localStorage.getItem(SESSION_KEY),
    null
  );
};

export const signIn = (username: string, password: string): AuthResult => {
  const users = getUsers();
  const match = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!match) {
    return { ok: false, error: "Pogresan username ili password." };
  }
  setSession(match);
  return { ok: true, user: match };
};

export const signUp = (username: string, password: string): AuthResult => {
  const users = getUsers();
  if (users.some((user) => user.username === username)) {
    return { ok: false, error: "Korisnik vec postoji." };
  }
  const newUser: StoredUser = { username, password, role: "user" };
  users.push(newUser);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  setSession(newUser);
  return { ok: true, user: newUser };
};

export const signOut = () => {
  setSession(null);
};
