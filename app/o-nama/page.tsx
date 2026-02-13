"use client";

import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";

export default function ONamaPage() {
  const { dictionary } = useSitePreferences();

  return (
    <AlienShell className="site-fade">
      <section className="space-y-6">
        <span className="pill">{dictionary.about.badge}</span>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
          {dictionary.about.title}
        </h1>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="surface rounded-2xl p-5">
          <p className="text-sm leading-7 text-muted">{dictionary.about.intro}</p>
        </article>
        <article className="surface rounded-2xl p-5">
          <p className="text-sm leading-7 text-muted">{dictionary.about.mission}</p>
        </article>
        <article className="surface rounded-2xl p-5">
          <p className="text-sm leading-7 text-muted">{dictionary.about.vision}</p>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--primary-soft)] p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">{dictionary.about.valuesTitle}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <article className="surface-strong rounded-2xl p-4 text-sm leading-6 text-muted">
            {dictionary.about.valueA}
          </article>
          <article className="surface-strong rounded-2xl p-4 text-sm leading-6 text-muted">
            {dictionary.about.valueB}
          </article>
          <article className="surface-strong rounded-2xl p-4 text-sm leading-6 text-muted">
            {dictionary.about.valueC}
          </article>
        </div>
      </section>
    </AlienShell>
  );
}

