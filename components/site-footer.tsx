"use client";

import { useSitePreferences } from "./site-preferences-provider";

export default function SiteFooter() {
  const { dictionary } = useSitePreferences();

  return (
    <footer className="pb-8 pt-3">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="surface rounded-2xl px-5 py-4 text-sm sm:flex sm:items-center sm:justify-between">
          <p className="text-muted">{dictionary.footer.note}</p>
          <p className="mt-2 text-xs text-muted sm:mt-0">
            {new Date().getFullYear()} ABLux Travel. {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

