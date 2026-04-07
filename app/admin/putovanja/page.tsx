"use client";

import CmsImage from "@/components/cms-image";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import AdminPageHeader from "../../../components/admin/admin-page-header";
import DestinationsDataTable from "../../../components/admin/destinations-data-table";
import DestinationSlideOver from "../../../components/admin/destination-slide-over";
import SlideSlideOver from "../../../components/admin/slide-slide-over";
import { useSitePreferences } from "../../../components/site-preferences-provider";
import { toCountrySlug } from "../../../lib/country-route";
import { Destination } from "../../../lib/use-destinations";
import {
  FaPen,
  FaTrash,
  FaPlus,
  FaChevronDown,
} from "react-icons/fa6";

type SlideRecord = Doc<"slides"> & {
  mediaType?: "video" | "image";
  mediaName?: string | null;
  mediaUrl: string | null;
};

export default function AdminPutovanjaPage() {
  const { language } = useSitePreferences();
  const allSlides = useQuery(api.slides.listAll) as
    | SlideRecord[]
    | undefined;
  const removeSlide = useMutation(api.slides.remove);

  const sortedSlides = useMemo(() => {
    if (!allSlides) return [];
    return [...allSlides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [allSlides]);

  /* â”€â”€ Slide slide-over state â”€â”€ */
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideRecord | null>(
    null
  );

  const openNewSlide = () => {
    setEditingSlide(null);
    setSlideOverOpen(true);
  };

  const openEditSlide = (slide: SlideRecord) => {
    setEditingSlide(slide);
    setSlideOverOpen(true);
  };

  const handleDeleteSlide = async (id: string) => {
    const msg =
      language === "sr"
        ? "Obrisati ovaj slajd?"
        : "Delete this slide?";
    if (!window.confirm(msg)) return;
    await removeSlide({ id: id as Id<"slides"> });
  };

  /* â”€â”€ Destination slide-over state â”€â”€ */
  const [destSlideOverOpen, setDestSlideOverOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(
    null
  );
  const [destPageSlug, setDestPageSlug] = useState<string>("");

  const openNewDest = (pageSlug: string) => {
    setEditingDest(null);
    setDestPageSlug(pageSlug);
    setDestSlideOverOpen(true);
  };

  const openEditDest = (dest: Destination, pageSlug: string) => {
    setEditingDest(dest);
    setDestPageSlug(pageSlug);
    setDestSlideOverOpen(true);
  };

  /* â”€â”€ Expanded/collapsed slide sections â”€â”€ */
  const [expandedSlides, setExpandedSlides] = useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (slideId: string) => {
    setExpandedSlides((prev) => {
      const next = new Set(prev);
      if (next.has(slideId)) {
        next.delete(slideId);
      } else {
        next.add(slideId);
      }
      return next;
    });
  };

  /* â”€â”€ Breadcrumbs â”€â”€ */
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    {
      label: language === "sr" ? "Putovanja" : "Trips",
      href: "/admin/putovanja",
    },
  ];

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        breadcrumbs={breadcrumbs}
        title={
          language === "sr"
            ? "Pregled Putovanja"
            : "Trip Overview"
        }
        subtitle={
          language === "sr"
            ? "Upravljajte slajdovima i njihovim destinacijama."
            : "Manage slides and their destinations."
        }
        actions={[
          {
            label:
              language === "sr" ? "Novi Slajd" : "New Slide",
            onClick: openNewSlide,
          },
        ]}
      />

      {/* Slides list â€” each with destinations underneath */}
      {sortedSlides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg-soft)] py-12 text-center">
          <p className="text-sm font-semibold">
            {language === "sr"
              ? "Nema slajdova"
              : "No slides yet"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {language === "sr"
              ? "Dodajte prvi slajd klikom na dugme iznad."
              : "Add your first slide using the button above."}
          </p>
        </div>
      ) : null}

      {sortedSlides.map((slide) => {
        const pageSlug =
          toCountrySlug(slide.title) || toCountrySlug(slide._id);
        const isExpanded = expandedSlides.has(slide._id);

        return (
          <article
            key={slide._id}
            className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]"
          >
            {/* Slide header row */}
            <div className="flex flex-col gap-3 border-b border-[var(--line)] p-3 sm:flex-row sm:items-center sm:p-4">
              {/* Thumbnail */}
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--bg-soft)] sm:h-16 sm:w-28">
                {slide.mediaUrl ? (
                  slide.mediaType === "video" ? (
                    <video
                      src={slide.mediaUrl}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <CmsImage
                      src={slide.mediaUrl}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                    {language === "sr" ? "Nema medije" : "No media"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {slide.title}
                    </p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {slide.subtitle}
                    </p>
                  </div>
                  {/* Status badge */}
                  {slide.isActive ? (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {language === "sr" ? "Aktiven" : "Active"}
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-400/15 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      {language === "sr" ? "Neaktivno" : "Inactive"}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditSlide(slide)}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <FaPen className="text-[10px]" />
                  <span className="hidden sm:inline">
                    {language === "sr" ? "Uredi" : "Edit"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteSlide(slide._id)}
                  className="flex items-center justify-center rounded-lg border border-[var(--line)] p-1.5 text-xs text-[var(--muted)] transition hover:border-red-400 hover:text-red-400"
                >
                  <FaTrash className="text-[10px]" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpanded(slide._id)}
                  className={`flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1.5 text-xs transition ${
                    isExpanded
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  <FaChevronDown
                    className={`text-[10px] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {language === "sr" ? "Destinacije" : "Destinations"}
                  </span>
                </button>
              </div>
            </div>

            {/* Expanded: destinations for this slide */}
            {isExpanded ? (
              <div className="bg-[var(--bg-soft)] p-3 sm:p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {language === "sr"
                      ? `Destinacije za: ${slide.title}`
                      : `Destinations for: ${slide.title}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => openNewDest(pageSlug)}
                    className="flex items-center gap-1.5 self-start rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] transition hover:opacity-90 sm:self-auto"
                  >
                    <FaPlus className="text-[10px]" />
                    {language === "sr"
                      ? "Nova Destinacija"
                      : "New Destination"}
                  </button>
                </div>
                <DestinationsDataTable
                  pageSlug={pageSlug}
                  onEdit={(dest) => openEditDest(dest, pageSlug)}
                />
              </div>
            ) : null}
          </article>
        );
      })}

      {/* Slide slide-over */}
      <SlideSlideOver
        open={slideOverOpen}
        slide={editingSlide}
        totalSlides={sortedSlides.length}
        onClose={() => {
          setSlideOverOpen(false);
          setEditingSlide(null);
        }}
      />

      {/* Destination slide-over */}
      {destSlideOverOpen ? (
        <DestinationSlideOver
          key={
            editingDest
              ? `edit-${editingDest._id}`
              : `new-${destPageSlug}`
          }
          open={destSlideOverOpen}
          destination={editingDest}
          pageSlug={destPageSlug}
          onClose={() => {
            setDestSlideOverOpen(false);
            setEditingDest(null);
          }}
        />
      ) : null}
    </section>
  );
}

