"use client";

import { type CSSProperties, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSitePreferences } from "../../../components/site-preferences-provider";

type SettingsDraft = {
  workingHours: string;
  address: string;
  phone: string;
  email: string;
  instagramUrl: string;
};

export default function AdminPodesavanjaPage() {
  const { dictionary, language } = useSitePreferences();
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const settingsData = useQuery(api.settings.get, convexUrl ? {} : "skip");
  const upsertSettings = useMutation(api.settings.upsert);

  const [draft, setDraft] = useState<SettingsDraft | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const defaults = useMemo<SettingsDraft>(
    () => ({
      workingHours: settingsData?.workingHours || "",
      address: settingsData?.address || "",
      phone: settingsData?.phone || "",
      email: settingsData?.email || "",
      instagramUrl: settingsData?.instagramUrl || "",
    }),
    [settingsData]
  );

  const form = draft ?? defaults;

  const updateField = <K extends keyof SettingsDraft>(key: K, value: SettingsDraft[K]) => {
    setDraft((previous) => ({
      ...(previous ?? defaults),
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      await upsertSettings({
        workingHours: form.workingHours,
        address: form.address,
        phone: form.phone,
        email: form.email,
        instagramUrl: form.instagramUrl,
      });
      setStatus("saved");
      setDraft(null);
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  const seoTips = useMemo(
    () =>
      language === "sr"
        ? [
            "Kreirajte OG sliku 1200x630 za svaku kljucnu landing stranu.",
            "Postavite event tracking za klikove na CTA dugmad.",
            "Dodajte FAQ schema blok na Kontakt stranu za rich result prikaz.",
            "Uradite mesecni audit najsporijih slika/video fajlova.",
          ]
        : [
            "Create dedicated 1200x630 OG images for each key landing route.",
            "Enable event tracking for high-intent CTA clicks.",
            "Add FAQ schema blocks on Contact page to improve rich results.",
            "Run a monthly audit of heavy images/videos and reduce payload size.",
          ],
    [language]
  );

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Podešavanja" : "Settings"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {dictionary.settings.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {dictionary.settings.description}
        </p>
      </article>

      <article className="section-holo grid gap-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">{dictionary.settings.workingHours}</span>
            <input
              className="control"
              value={form.workingHours}
              onChange={(e) => updateField("workingHours", e.target.value)}
              placeholder="Pon-Pet: 09:00-17:00, Sub: 10:00-14:00"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">{dictionary.settings.address}</span>
            <input
              className="control"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Bulevar Putnika 22, Beograd"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">{dictionary.settings.phone}</span>
            <input
              className="control"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+381 11 123 45 67"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">{dictionary.settings.email}</span>
            <input
              className="control"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="info@abluxtravel2022.rs"
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold">{dictionary.settings.instagramUrl}</span>
          <input
            className="control"
            value={form.instagramUrl}
            onChange={(e) => updateField("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/abluxtravel"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => void handleSave()}
            disabled={status === "saving"}
          >
            {status === "saving"
              ? dictionary.settings.saving
              : dictionary.settings.save}
          </button>
          {status === "saved" ? (
            <span className="text-sm text-emerald-400">{dictionary.settings.saved}</span>
          ) : null}
        </div>
      </article>

      <article className="section-holo p-5 sm:p-6">
        <h3 className="text-xl font-semibold">
          {language === "sr" ? "SEO preporuke" : "SEO recommendations"}
        </h3>
        <ul className="stagger-grid mt-4 grid gap-2">
          {seoTips.map((item, index) => (
            <li
              key={item}
              className="fx-lift rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-muted"
              style={{ "--stagger-index": index } as CSSProperties}
            >
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
