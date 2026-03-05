"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useSitePreferences } from "./site-preferences-provider";
import { useOffersLiveBoard, type AggregatedOffer } from "../lib/use-offers";
import {
  MANUAL_RELIGIOUS_SOURCE_SLUG,
  isReligiousOffer,
  normalizeReligiousTags,
} from "../lib/religious";

type ReligiousOfferForm = {
  externalId: string;
  title: string;
  destination: string;
  departureCity: string;
  departureDate: string;
  returnDate: string;
  price: string;
  currency: string;
  seatsLeft: string;
  tags: string;
};

const emptyForm: ReligiousOfferForm = {
  externalId: "",
  title: "",
  destination: "",
  departureCity: "",
  departureDate: "",
  returnDate: "",
  price: "",
  currency: "EUR",
  seatsLeft: "",
  tags: "verski, hodocasce",
};

const formatPrice = (offer: AggregatedOffer, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.price);

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function ReligiousOffersEditor() {
  const { language } = useSitePreferences();
  const locale = language === "sr" ? "sr-RS" : "en-US";
  const upsertOffer = useMutation(api.offers.upsertOffer);
  const deactivateOffer = useMutation(api.offers.deactivateOffer);
  const offers = useOffersLiveBoard(undefined, []);

  const [form, setForm] = useState<ReligiousOfferForm>(emptyForm);
  const [editingExternalId, setEditingExternalId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const religiousOffers = useMemo(
    () =>
      offers
        .filter((offer) => isReligiousOffer(offer))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [offers]
  );

  const manualOffers = useMemo(
    () =>
      religiousOffers.filter(
        (offer) => offer.sourceSlug.toLowerCase() === MANUAL_RELIGIOUS_SOURCE_SLUG
      ),
    [religiousOffers]
  );

  const fillFromOffer = (offer: AggregatedOffer) => {
    setEditingExternalId(offer.externalId);
    setForm({
      externalId: offer.externalId,
      title: offer.title,
      destination: offer.destination,
      departureCity: offer.departureCity ?? "",
      departureDate: offer.departureDate ?? "",
      returnDate: offer.returnDate ?? "",
      price: String(offer.price),
      currency: offer.currency,
      seatsLeft: offer.seatsLeft ? String(offer.seatsLeft) : "",
      tags: offer.tags.join(", "),
    });
  };

  const resetForm = () => {
    setEditingExternalId(null);
    setForm(emptyForm);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const title = form.title.trim();
    const destination = form.destination.trim();
    const price = parseNumber(form.price);
    const seatsLeft = form.seatsLeft.trim() ? parseNumber(form.seatsLeft) : null;

    if (!title || !destination || !price || price <= 0) {
      setStatus(
        language === "sr"
          ? "Unesite naziv, destinaciju i validnu cenu."
          : "Please enter title, destination, and a valid price."
      );
      return;
    }

    if (seatsLeft !== null && seatsLeft < 0) {
      setStatus(language === "sr" ? "Broj mesta ne moze biti negativan." : "Seats cannot be negative.");
      return;
    }

    setBusy(true);
    setStatus(language === "sr" ? "Cuvanje ponude..." : "Saving offer...");
    try {
      const externalId = form.externalId.trim() || `REL-${Date.now()}`;
      const tags = normalizeReligiousTags(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      );

      await upsertOffer({
        sourceSlug: MANUAL_RELIGIOUS_SOURCE_SLUG,
        externalId,
        title,
        destination,
        departureCity: form.departureCity.trim() || undefined,
        departureDate: form.departureDate || undefined,
        returnDate: form.returnDate || undefined,
        price,
        currency: form.currency.trim().toUpperCase() || "EUR",
        seatsLeft: seatsLeft ?? undefined,
        tags,
        normalizedHash: `${MANUAL_RELIGIOUS_SOURCE_SLUG}:${externalId}:${title}:${destination}:${price}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        score: 100,
        rawSnapshot: JSON.stringify({
          source: "manual-admin",
          editedAt: new Date().toISOString(),
        }),
        isActive: true,
      });

      setStatus(
        language === "sr"
          ? editingExternalId
            ? "Ponuda je azurirana."
            : "Nova verska ponuda je sacuvana."
          : editingExternalId
            ? "Offer has been updated."
            : "Religious offer has been created."
      );
      resetForm();
    } catch {
      setStatus(
        language === "sr"
          ? "Doslo je do greske pri cuvanju."
          : "Failed to save the offer."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = async (offer: AggregatedOffer) => {
    if (busy) return;
    const confirmed = window.confirm(
      language === "sr"
        ? "Da li sigurno zelite da deaktivirate ovu ponudu?"
        : "Are you sure you want to deactivate this offer?"
    );
    if (!confirmed) return;

    setBusy(true);
    setStatus(language === "sr" ? "Deaktiviranje..." : "Deactivating...");
    try {
      await deactivateOffer({
        sourceSlug: offer.sourceSlug,
        externalId: offer.externalId,
      });
      setStatus(language === "sr" ? "Ponuda je deaktivirana." : "Offer has been deactivated.");
      if (editingExternalId === offer.externalId) {
        resetForm();
      }
    } catch {
      setStatus(
        language === "sr"
          ? "Deaktiviranje nije uspelo."
          : "Could not deactivate the offer."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="grid gap-6">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Verski market pulse" : "Religious market pulse"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {language === "sr" ? "Editor verskih ponuda" : "Religious offers editor"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Ovde upravljas ponudama za hodocasca i verske ture. Sve izmene se odmah reflektuju na stranici Verski turizam."
            : "Manage pilgrimage and faith-focused offers here. All changes are reflected immediately on the Religious Tourism page."}
        </p>
      </article>

      <div className="stagger-grid grid gap-3 sm:grid-cols-3">
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 0 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Ukupno verskih" : "Total religious"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{religiousOffers.length}</p>
        </article>
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 1 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Rucno uredjene" : "Manually managed"}
          </p>
          <p className="mt-2 text-2xl font-semibold">{manualOffers.length}</p>
        </article>
        <article
          className="surface fx-lift rounded-2xl p-4"
          style={{ "--stagger-index": 2 } as CSSProperties}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            {language === "sr" ? "Izvor" : "Source"}
          </p>
          <p className="mt-2 text-lg font-semibold">{MANUAL_RELIGIOUS_SOURCE_SLUG}</p>
        </article>
      </div>

      <form
        onSubmit={handleSave}
        className="section-holo grid gap-5 p-5 sm:p-6 xl:grid-cols-2"
      >
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">External ID</span>
            <input
              className="control"
              value={form.externalId}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, externalId: event.target.value }))
              }
              placeholder="REL-2026-001"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Naziv ponude" : "Offer title"}
            </span>
            <input
              className="control"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, title: event.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Destinacija" : "Destination"}
            </span>
            <input
              className="control"
              value={form.destination}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, destination: event.target.value }))
              }
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Cena" : "Price"}
              </span>
              <input
                type="number"
                min={1}
                className="control"
                value={form.price}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, price: event.target.value }))
                }
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Valuta" : "Currency"}
              </span>
              <input
                className="control"
                value={form.currency}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, currency: event.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Grad polaska" : "Departure city"}
            </span>
            <input
              className="control"
              value={form.departureCity}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, departureCity: event.target.value }))
              }
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Datum polaska" : "Departure date"}
              </span>
              <input
                type="date"
                className="control"
                value={form.departureDate}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, departureDate: event.target.value }))
                }
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">
                {language === "sr" ? "Datum povratka" : "Return date"}
              </span>
              <input
                type="date"
                className="control"
                value={form.returnDate}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, returnDate: event.target.value }))
                }
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Slobodna mesta" : "Seats left"}
            </span>
            <input
              type="number"
              min={0}
              className="control"
              value={form.seatsLeft}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, seatsLeft: event.target.value }))
              }
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">Tags</span>
            <input
              className="control"
              value={form.tags}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, tags: event.target.value }))
              }
              placeholder="verski, hodocasce, manastiri"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={busy}>
              {editingExternalId
                ? language === "sr"
                  ? "Sacuvaj izmene"
                  : "Save changes"
                : language === "sr"
                  ? "Dodaj ponudu"
                  : "Add offer"}
            </button>
            {editingExternalId ? (
              <button type="button" className="btn-secondary" onClick={resetForm} disabled={busy}>
                {language === "sr" ? "OtkaZi izmenu" : "Cancel edit"}
              </button>
            ) : null}
            {status ? <span className="text-sm text-muted">{status}</span> : null}
          </div>
        </div>
      </form>

      <section>
        <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
          {language === "sr" ? "Aktivne verske ponude" : "Active religious offers"}
        </h3>
        {religiousOffers.length > 0 ? (
          <div className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {religiousOffers.map((offer, index) => {
              const isManual = offer.sourceSlug.toLowerCase() === MANUAL_RELIGIOUS_SOURCE_SLUG;
              return (
                <article
                  key={offer.id}
                  className="surface fx-lift rounded-2xl p-4"
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  <p className="text-xs uppercase tracking-[0.12em] text-muted">
                    {offer.sourceSlug}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold">{offer.title}</h4>
                  <p className="mt-1 text-sm text-muted">{offer.destination}</p>
                  <p className="mt-2 text-xl font-semibold">{formatPrice(offer, locale)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {language === "sr" ? "ID" : "ID"}: {offer.externalId}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {language === "sr" ? "Mesta" : "Seats"}:{" "}
                    {typeof offer.seatsLeft === "number" ? offer.seatsLeft : "-"}
                  </p>
                  {offer.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {offer.tags.map((tag) => (
                        <span
                          key={`${offer.id}-${tag}`}
                          className="rounded-full border border-[var(--line)] bg-[var(--primary-soft)] px-2.5 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isManual ? (
                      <button
                        type="button"
                        className="btn-secondary !px-3 !py-2 !text-xs"
                        onClick={() => fillFromOffer(offer)}
                        disabled={busy}
                      >
                        {language === "sr" ? "Izmeni" : "Edit"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs text-muted transition hover:border-red-400 hover:text-red-300"
                      onClick={() => void handleDeactivate(offer)}
                      disabled={busy}
                    >
                      {language === "sr" ? "Deaktiviraj" : "Deactivate"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <article className="surface rounded-2xl p-4 text-sm text-muted">
            {language === "sr"
              ? "Trenutno nema verskih ponuda."
              : "There are currently no religious offers."}
          </article>
        )}
      </section>
    </section>
  );
}
