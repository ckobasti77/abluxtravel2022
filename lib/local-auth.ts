export type SessionUser = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: "admin" | "user";
};

type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
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

const formatDisplayName = (firstName: string, lastName: string, email: string) => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName.length > 0) {
    return fullName;
  }
  const localPart = email.split("@")[0]?.trim();
  if (localPart) {
    return localPart;
  }
  return email;
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

export const setSessionFromAuth = (user: AuthUser) => {
  const firstName = user.firstName.trim();
  const lastName = user.lastName.trim();
  const email = user.email.trim().toLowerCase();
  setSession({
    firstName,
    lastName,
    displayName: formatDisplayName(firstName, lastName, email),
    email,
    role: user.role,
  });
};

export const getSession = (): SessionUser | null => {
  if (typeof window === "undefined") return null;
  const parsed = safeParse<Partial<SessionUser> & { username?: string } | null>(
    window.localStorage.getItem(SESSION_KEY),
    null
  );

  if (!parsed || (parsed.role !== "admin" && parsed.role !== "user")) {
    return null;
  }

  const email =
    typeof parsed.email === "string" && parsed.email.trim().length > 0
      ? parsed.email.trim().toLowerCase()
      : typeof parsed.username === "string" && parsed.username.trim().length > 0
        ? parsed.username.trim().toLowerCase()
        : "";

  if (!email) {
    return null;
  }

  const firstName = typeof parsed.firstName === "string" ? parsed.firstName.trim() : "";
  const lastName = typeof parsed.lastName === "string" ? parsed.lastName.trim() : "";
  const displayName =
    typeof parsed.displayName === "string" && parsed.displayName.trim().length > 0
      ? parsed.displayName.trim()
      : formatDisplayName(firstName, lastName, email);

  return {
    firstName,
    lastName,
    displayName,
    email,
    role: parsed.role,
  };
};

export const signOut = () => {
  setSession(null);
};

export const SESSION_CHANGED_EVENT = SESSION_EVENT;
