"use client";

import { useEffect, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { SitePreferencesProvider } from "../components/site-preferences-provider";
import { SettingsProvider } from "../lib/use-settings";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

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
  if (!convex) {
    return <SitePreferencesProvider>{children}</SitePreferencesProvider>;
  }

  return (
    <SitePreferencesProvider>
      <ConvexProvider client={convex}>
        <AdminBootstrap />
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ConvexProvider>
    </SitePreferencesProvider>
  );
}
