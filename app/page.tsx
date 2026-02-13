"use client";

import Link from "next/link";
import AlienShell from "../components/alien-shell";
import { useSitePreferences } from "../components/site-preferences-provider";

export default function HomePage() {
  const { dictionary } = useSitePreferences();

  return (
    <AlienShell className="site-fade">
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-6">
          <span className="pill">{dictionary.home.badge}</span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            {dictionary.home.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {dictionary.home.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/ponuda" className="btn-primary">
              {dictionary.home.ctaOffers}
            </Link>
            <Link href="/kontakt" className="btn-secondary">
              {dictionary.home.ctaContact}
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.metricFounded}
            </article>
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.metricFocus}
            </article>
            <article className="surface rounded-2xl p-4 text-sm font-medium">
              {dictionary.home.metricPartners}
            </article>
          </div>
        </div>

        <div className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">{dictionary.home.focusTitle}</h2>
          <div className="mt-5 grid gap-3">
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
        </div>
      </section>

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
    </AlienShell>
  );
}

