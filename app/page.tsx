"use client";

import AlienShell from "../components/alien-shell";
import HomeAlienSignals from "../components/home-alien-signals";
import HomeHero from "../components/home-hero";
import HomeScrollGallery from "../components/home-scroll-gallery";
import PageAdminEditorDock from "../components/page-admin-editor-dock";
import { useSitePreferences } from "../components/site-preferences-provider";

export default function HomePage() {
  const { dictionary } = useSitePreferences();

  return (
    <AlienShell className="site-fade max-w-none! px-0! pt-0!">
      <HomeHero />

      <div className="mx-auto w-full max-w-7xl px-4 pt-9 sm:px-8 sm:pt-12 lg:px-12">
        <HomeAlienSignals />

        <section className="mt-8 surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">{dictionary.home.focusTitle}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="surface-strong rounded-2xl p-4">
              <p className="text-sm leading-6 text-muted">{dictionary.home.focusA}</p>
            </article>
            <article className="surface-strong rounded-2xl p-4">
              <p className="text-sm leading-6 text-muted">{dictionary.home.focusB}</p>
            </article>
            <article className="surface-strong rounded-2xl p-4">
              <p className="text-sm leading-6 text-muted">{dictionary.home.focusC}</p>
            </article>
          </div>
        </section>

        <HomeScrollGallery />

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--primary-soft)] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">{dictionary.home.modelTitle}</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-muted sm:text-base">
            {dictionary.home.modelDescription}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="surface-strong rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.modelA}
            </article>
            <article className="surface-strong rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.modelB}
            </article>
            <article className="surface-strong rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.modelC}
            </article>
          </div>
        </section>

        <PageAdminEditorDock slot="home" className="mt-10" />
      </div>
    </AlienShell>
  );
}
