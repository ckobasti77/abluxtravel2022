export type SessionUser = {
  username: string;
  role: "admin" | "user";
};

export type AuthErrorCode = "invalid_credentials" | "user_exists";

const SESSION_KEY = "abluxtravel2022_session";
const SESSION_EVENT = "ablux:session-changed";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const setSession = (user: SessionUser | null) => {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(SESSION_EVENT));
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const setSessionFromAuth = (user: SessionUser) => {
  setSession({
    username: user.username,
    role: user.role,
  });
};

export const getSession = (): SessionUser | null => {
  if (typeof window === "undefined") return null;
  return safeParse<SessionUser | null>(
    window.localStorage.getItem(SESSION_KEY),
    null
  );
};

export const signOut = () => {
  setSession(null);
};

export const SESSION_CHANGED_EVENT = SESSION_EVENT;
