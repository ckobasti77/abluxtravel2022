"use client";

import { type CSSProperties } from "react";
import CmsImage from "./cms-image";
import type { Destination } from "../lib/use-destinations";

type DestinationLoopCarouselProps = {
  destinations: Destination[];
  locale: string;
  selectedDestinationId?: string | null;
  onSelectDestination?: (id: string) => void;
  actionLabel?: string;
  noImageLabel: string;
  ariaLabel: string;
};

export default function DestinationLoopCarousel({
  destinations,
  locale,
  selectedDestinationId,
  onSelectDestination,
  actionLabel,
  noImageLabel,
  ariaLabel,
}: DestinationLoopCarouselProps) {
  const shouldAnimate = destinations.length > 1;
  const duration = Math.min(72, Math.max(30, destinations.length * 7));
  const trackStyle = {
    "--destination-loop-duration": `${duration}s`,
  } as CSSProperties;

  const formatDestinationPrice = (price: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  const renderCard = (item: Destination, index: number, clone = false) => {
    const heroImage = item.imageUrls?.find(Boolean);
    const active = item._id === selectedDestinationId;
    const cardClassName = [
      "destination-loop__card",
      active ? "is-active" : "",
      clone ? "is-clone" : "",
      onSelectDestination ? "is-clickable" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const cardStyle = { "--destination-loop-index": index } as CSSProperties;
    const content = (
      <>
        <div className="destination-loop__media">
          {heroImage ? (
            <CmsImage
              src={heroImage}
              alt={clone ? "" : item.title}
              className="destination-loop__image"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 44vw, 360px"
            />
          ) : (
            <div className="destination-loop__fallback">{noImageLabel}</div>
          )}
          <div className="destination-loop__shade" />
          <div className="destination-loop__media-copy">
            <h3>{item.title}</h3>
            <span>{formatDestinationPrice(item.price, item.currency)}</span>
          </div>
        </div>

        {item.description || actionLabel ? (
          <div className="destination-loop__body">
            {item.description ? <p>{item.description}</p> : null}
            {actionLabel ? <span>{actionLabel}</span> : null}
          </div>
        ) : null}
      </>
    );

    if (onSelectDestination) {
      return (
        <button
          key={`${item._id}${clone ? "-clone" : ""}`}
          type="button"
          className={cardClassName}
          style={cardStyle}
          onClick={() => onSelectDestination(item._id)}
          aria-pressed={clone ? undefined : active}
          aria-hidden={clone}
          tabIndex={clone ? -1 : 0}
        >
          {content}
        </button>
      );
    }

    return (
      <article
        key={`${item._id}${clone ? "-clone" : ""}`}
        className={cardClassName}
        style={cardStyle}
        aria-hidden={clone}
      >
        {content}
      </article>
    );
  };

  return (
    <div className="destination-loop" role="region" aria-label={ariaLabel}>
      <div className="destination-loop__viewport">
        <div
          className={`destination-loop__track ${shouldAnimate ? "" : "is-static"}`}
          style={trackStyle}
        >
          {destinations.map((item, index) => renderCard(item, index))}
          {shouldAnimate
            ? destinations.map((item, index) =>
                renderCard(item, index + destinations.length, true),
              )
            : null}
        </div>
      </div>
    </div>
  );
}
