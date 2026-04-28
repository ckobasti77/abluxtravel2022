import { useSyncExternalStore } from "react";
import { SESSION_CHANGED_EVENT, getSession } from "./local-auth";

const subscribeToSession = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_CHANGED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_CHANGED_EVENT, callback);
  };
};

const getServerSessionSnapshot = () => null;

export const useSession = () =>
  useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSessionSnapshot
  );
