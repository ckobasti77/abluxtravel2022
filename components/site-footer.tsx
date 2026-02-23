"use client";

import type { IconType } from "react-icons";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  FaArrowRightLong,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaLocationDot,
  FaPhoneVolume,
  FaRegClock,
} from "react-icons/fa6";
import { SITE_NAV_ITEMS } from "../lib/site-nav";
import { useSitePreferences } from "./site-preferences-provider";

type FooterContactItem = {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

type FooterNavItem = {
  key: (typeof SITE_NAV_ITEMS)[number]["key"] | "signIn";
  href: string;
};

export default function SiteFooter() {
  const { dictionary, language, theme } = useSitePreferences();
  const currentYear = new Date().getFullYear();
  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";
  const logoSize = theme === "dark" ? { width: 500, height: 500 } : { width: 301, height: 318 };

  const copy =
    language === "sr"
      ? {
          navigation: "Navigacija",
          services: "Servisi",
          quickActions: "Brze akcije",
          contactCenter: "Kontakt centar",
          response: "Odgovaramo na upite u roku od 24h.",
          footerTag: "Digitalna platforma za modernu turisticku agenciju.",
        }
      : {
          navigation: "Navigation",
          services: "Services",
          quickActions: "Quick Actions",
          contactCenter: "Contact Center",
          response: "We respond to inquiries within 24h.",
          footerTag: "Digital platform for modern travel operations.",
        };

  const primaryNavItems = useMemo(
    () => SITE_NAV_ITEMS.slice(0, 4) as FooterNavItem[],
    []
  );

  const secondaryNavItems = useMemo<FooterNavItem[]>(
    () => [...SITE_NAV_ITEMS.slice(4), { key: "signIn", href: "/signin" }],
    []
  );

  const mapHref = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        dictionary.contact.officeValue
      )}`,
    [dictionary.contact.officeValue]
  );

  const phoneHref = useMemo(
    () => `tel:${dictionary.contact.phoneValue.replace(/[^+\d]/g, "")}`,
    [dictionary.contact.phoneValue]
  );

  const emailHref = useMemo(
    () => `mailto:${dictionary.contact.emailValue}`,
    [dictionary.contact.emailValue]
  );

  const contactItems = useMemo<FooterContactItem[]>(
    () => [
      {
        icon: FaLocationDot,
        label: dictionary.contact.officeLabel,
        value: dictionary.contact.officeValue,
        href: mapHref,
        external: true,
      },
      {
        icon: FaEnvelope,
        label: dictionary.contact.emailLabel,
        value: dictionary.contact.emailValue,
        href: emailHref,
      },
      {
        icon: FaPhoneVolume,
        label: dictionary.contact.phoneLabel,
        value: dictionary.contact.phoneValue,
        href: phoneHref,
      },
      {
        icon: FaRegClock,
        label: dictionary.contact.hoursLabel,
        value: dictionary.contact.hoursValue,
      },
    ],
    [
      dictionary.contact.emailLabel,
      dictionary.contact.emailValue,
      dictionary.contact.hoursLabel,
      dictionary.contact.hoursValue,
      dictionary.contact.officeLabel,
      dictionary.contact.officeValue,
      dictionary.contact.phoneLabel,
      dictionary.contact.phoneValue,
      emailHref,
      mapHref,
      phoneHref,
    ]
  );

  return (
    <footer className="site-footer pb-8 pt-12 sm:pt-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="site-footer-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <Link href="/" className="inline-flex items-center" aria-label={dictionary.nav.brand}>
                <Image
                  src={logoSrc}
                  alt={dictionary.nav.brand}
                  width={logoSize.width}
                  height={logoSize.height}
                  className="h-16 w-auto sm:h-20"
                />
              </Link>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[0.95rem]">
                {dictionary.footer.note}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="site-footer-chip">{dictionary.home.metricFounded}</span>
                <span className="site-footer-chip">{dictionary.home.metricFocus}</span>
              </div>
            </div>

            <section aria-labelledby="footer-actions-title">
              <h2 id="footer-actions-title" className="site-footer-heading">
                {copy.quickActions}
              </h2>
              <p className="mt-2 text-xs text-muted">{copy.response}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link href="/ponuda" className="site-footer-action">
                  <span className="site-footer-action__title">{dictionary.home.ctaOffers}</span>
                  <span className="site-footer-action__meta">{dictionary.offers.badge}</span>
                  <FaArrowRightLong aria-hidden className="site-footer-action__icon" />
                </Link>
                <Link href="/kontakt" className="site-footer-action">
                  <span className="site-footer-action__title">{dictionary.home.ctaContact}</span>
                  <span className="site-footer-action__meta">{dictionary.contact.badge}</span>
                  <FaArrowRightLong aria-hidden className="site-footer-action__icon" />
                </Link>
              </div>
            </section>
          </div>

          <div className="site-footer-divider" />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]">
            <nav aria-label={copy.navigation}>
              <h2 className="site-footer-heading">{copy.navigation}</h2>
              <ul className="site-footer-link-list">
                {primaryNavItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer-link">
                      {dictionary.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={copy.services}>
              <h2 className="site-footer-heading">{copy.services}</h2>
              <ul className="site-footer-link-list">
                {secondaryNavItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer-link">
                      {dictionary.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section aria-labelledby="footer-contact-title" className="site-footer-contact-card">
              <h2 id="footer-contact-title" className="site-footer-heading">
                {copy.contactCenter}
              </h2>
              <div className="mt-4 grid gap-3">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="site-footer-contact-row">
                      <span className="site-footer-contact-icon">
                        <Icon aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="site-footer-contact-label">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="site-footer-contact-value site-footer-contact-value--link"
                          >
                            <span>{item.value}</span>
                            {item.external ? (
                              <FaArrowUpRightFromSquare aria-hidden className="text-[0.68rem]" />
                            ) : null}
                          </a>
                        ) : (
                          <p className="site-footer-contact-value">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="site-footer-bottom">
            <p className="text-xs text-muted sm:text-sm">
              {currentYear} ABLux Travel. {dictionary.footer.rights}
            </p>
            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted sm:text-xs">
              {copy.footerTag}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
