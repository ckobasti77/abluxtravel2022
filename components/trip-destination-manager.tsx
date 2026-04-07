"use client";

import { useMemo, useState } from "react";
import { useSitePreferences } from "./site-preferences-provider";
import DestinationEditor from "./destination-editor";
import { useTrips } from "../lib/use-trips";

export default function TripDestinationManager() {
  const { language } = useSitePreferences();
  const trips = useTrips();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const effectiveTripId = useMemo(() => {
    if (selectedTripId && trips.some((trip) => trip._id === selectedTripId)) {
      return selectedTripId;
    }
    return trips[0]?._id ?? "";
  }, [selectedTripId, trips]);

  const selectedTrip = useMemo(
    () => trips.find((trip) => trip._id === effectiveTripId) ?? null,
    [trips, effectiveTripId],
  );

  return (
    <section className="grid gap-4">
      <article className="section-holo p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {language === "sr" ? "Trip destination editor" : "Trip destination editor"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          {language === "sr"
            ? "Destinacije po postojecem putovanju"
            : "Destinations per existing trip"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          {language === "sr"
            ? "Izaberite putovanje i zatim dodajte, izmenite ili obrisite destinacije sa slikom, opisom i cenom."
            : "Select a trip and then add, edit, or remove destinations with image, description, and pricing."}
        </p>
      </article>

      {trips.length > 0 ? (
        <>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold">
              {language === "sr" ? "Izaberi putovanje" : "Select trip"}
            </span>
            <select
              className="control"
              value={effectiveTripId}
              onChange={(event) => setSelectedTripId(event.target.value)}
            >
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </label>

          {selectedTrip ? (
            <DestinationEditor
              tripId={selectedTrip._id}
              title={
                language === "sr"
                  ? `Destinacije: ${selectedTrip.title}`
                  : `Destinations: ${selectedTrip.title}`
              }
            />
          ) : null}
        </>
      ) : (
        <article className="surface rounded-2xl p-4 text-sm text-muted">
          {language === "sr"
            ? "Nema putovanja za uredjivanje. Prvo kreirajte putovanje u admin sekciji Aranzmani."
            : "No trips available to edit. First create a trip in the Packages admin section."}
        </article>
      )}
    </section>
  );
}
