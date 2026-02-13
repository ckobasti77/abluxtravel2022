"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { SitePreferencesProvider } from "../components/site-preferences-provider";
import { api } from "../convex/_generated/api";

type ProvidersProps = {
  children: ReactNode;
};

function AdminBootstrap() {
  const ensureAdminUser = useMutation(api.auth.ensureAdminUser);

  useEffect(() => {
    void ensureAdminUser({});
  }, [ensureAdminUser]);

  return null;
}

export default function Providers({ children }: ProvidersProps) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convex = useMemo(() => {
    if (!convexUrl) {
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!convex) {
    return <SitePreferencesProvider>{children}</SitePreferencesProvider>;
  }

  return (
    <SitePreferencesProvider>
      <ConvexProvider client={convex}>
        <AdminBootstrap />
        {children}
      </ConvexProvider>
    </SitePreferencesProvider>
  );
}
