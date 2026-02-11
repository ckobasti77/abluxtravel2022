import { useEffect, useState } from "react";
import { getSession } from "./local-auth";

export const useSession = () => {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const onStorage = () => {
      setSession(getSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return session;
};
