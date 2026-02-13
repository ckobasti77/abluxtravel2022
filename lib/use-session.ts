import { useEffect, useState } from "react";
import { SESSION_CHANGED_EVENT, getSession } from "./local-auth";

export const useSession = () => {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const onSessionChanged = () => {
      setSession(getSession());
    };

    window.addEventListener("storage", onSessionChanged);
    window.addEventListener(SESSION_CHANGED_EVENT, onSessionChanged);
    return () => {
      window.removeEventListener("storage", onSessionChanged);
      window.removeEventListener(SESSION_CHANGED_EVENT, onSessionChanged);
    };
  }, []);

  return session;
};
