"use client";

import type { CSSProperties } from "react";
import AlienShell from "../components/alien-shell";
import HomeAlienSignals from "../components/home-alien-signals";
import HomeHero from "../components/home-hero";
import HomePartnersCarousel from "../components/home-partners-carousel";
import HomeScrollGallery from "../components/home-scroll-gallery";
import HomeVehicleRentalSection from "../components/home-vehicle-rental-section";
import PageAdminEditorDock from "../components/page-admin-editor-dock";
import { useSitePreferences } from "../components/site-preferences-provider";

export default function HomePage() {
  const { dictionary } = useSitePreferences();

  return (
    <>
      <HomeHero />

      <AlienShell className="site-fade max-w-none! px-0! pt-0!">
        <div className="mx-auto w-full max-w-7xl px-4 pt-9 sm:px-8 sm:pt-12 lg:px-12">
          <HomeAlienSignals />

          <section className="section-holo mt-8 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">
              {dictionary.home.focusTitle}
            </h2>
            <div className="stagger-grid mt-5 grid gap-3 md:grid-cols-3">
              <article
                className="surface-strong fx-lift rounded-2xl p-4"
                style={{ "--stagger-index": 0 } as CSSProperties}
              >
                <p className="text-sm leading-6 text-muted">
                  {dictionary.home.focusA}
                </p>
              </article>
              <article
                className="surface-strong fx-lift rounded-2xl p-4"
                style={{ "--stagger-index": 1 } as CSSProperties}
              >
                <p className="text-sm leading-6 text-muted">
                  {dictionary.home.focusB}
                </p>
              </article>
              <article
                className="surface-strong fx-lift rounded-2xl p-4"
                style={{ "--stagger-index": 2 } as CSSProperties}
              >
                <p className="text-sm leading-6 text-muted">
                  {dictionary.home.focusC}
                </p>
              </article>
            </div>
          </section>

          <HomeScrollGallery />

          <HomeVehicleRentalSection />

          <section className="section-holo mt-10 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">
              {dictionary.home.modelTitle}
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted sm:text-base">
              {dictionary.home.modelDescription}
            </p>
            <div className="stagger-grid mt-5 grid gap-3 md:grid-cols-3">
              <article
                className="surface-strong fx-lift rounded-2xl p-4 text-sm font-medium"
                style={{ "--stagger-index": 0 } as CSSProperties}
              >
                {dictionary.home.modelA}
              </article>
              <article
                className="surface-strong fx-lift rounded-2xl p-4 text-sm font-medium"
                style={{ "--stagger-index": 1 } as CSSProperties}
              >
                {dictionary.home.modelB}
              </article>
              <article
                className="surface-strong fx-lift rounded-2xl p-4 text-sm font-medium"
                style={{ "--stagger-index": 2 } as CSSProperties}
              >
                {dictionary.home.modelC}
              </article>
            </div>
          </section>

          <iframe
            src="https://putovanja.bigblue.rs/sr/location/alanja"
            width="40%"
            height="600"
            style={{ border: "none" }}
            loading="lazy"
          />

          <HomePartnersCarousel />

          <PageAdminEditorDock slot="home" className="mt-10" />
        </div>
      </AlienShell>
    </>
  );
}
