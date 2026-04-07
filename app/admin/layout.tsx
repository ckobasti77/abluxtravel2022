"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import AdminSidebar from "../../components/admin/admin-sidebar";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useSession } from "../../lib/use-session";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { dictionary } = useSitePreferences();
  const session = useSession();

  const isAdmin = session?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
        <article className="surface rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-semibold">{dictionary.admin.accessTitle}</h1>
          <p className="mt-3 text-sm text-muted">{dictionary.admin.accessDescription}</p>
          <Link href="/auth?mode=signin&next=%2Fadmin" className="btn-primary mt-6">
            {dictionary.admin.signIn}
          </Link>
        </article>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area — add left padding on mobile for hamburger */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-8 lg:px-12 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
