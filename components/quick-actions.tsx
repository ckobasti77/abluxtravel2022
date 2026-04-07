"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaInstagram,
  FaPhone,
  FaXmark,
} from "react-icons/fa6";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { useSettings } from "../lib/use-settings";
import { useSitePreferences } from "./site-preferences-provider";

export default function QuickActions() {
  const pathname = usePathname();
  const settings = useSettings();
  const { language } = useSitePreferences();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

  const labels =
    language === "sr"
      ? {
          group: "Brze kontakt akcije",
          toggle: "Kontakt",
          instagram: "Instagram",
          phone: "Poziv",
          email: "Email",
        }
      : {
          group: "Quick contact actions",
          toggle: "Contact",
          instagram: "Instagram",
          phone: "Call",
          email: "Email",
        };

  const actions = [
    {
      href: settings.instagramUrl,
      label: labels.instagram,
      icon: <FaInstagram aria-hidden />,
      external: true,
    },
    {
      href: phoneHref,
      label: labels.phone,
      icon: <FaPhone aria-hidden />,
      external: false,
    },
    {
      href: emailHref,
      label: labels.email,
      icon: <FaEnvelope aria-hidden />,
      external: false,
    },
  ].filter((item) => Boolean(item.href));

  /* close on click outside */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (pathname.startsWith("/admin")) return null;
  if (actions.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`qa-fab ${open ? "qa-fab--open" : ""}`}
      role="navigation"
      aria-label={labels.group}
    >
      {/* ── Expanded action buttons ── */}
      <div className="qa-fab__tray">
        {actions.map((action, i) => (
          <a
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            className="qa-fab__action"
            style={{ "--qa-i": i } as React.CSSProperties}
            aria-label={action.label}
            title={action.label}
          >
            <span className="qa-fab__action-icon">{action.icon}</span>
            <span className="qa-fab__action-label">{action.label}</span>
          </a>
        ))}
      </div>

      {/* ── Main toggle button ── */}
      <button
        type="button"
        className="qa-fab__trigger"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={labels.toggle}
      >
        <span className="qa-fab__trigger-icon qa-fab__trigger-icon--chat">
          <HiChatBubbleOvalLeft aria-hidden />
        </span>
        <span className="qa-fab__trigger-icon qa-fab__trigger-icon--close">
          <FaXmark aria-hidden />
        </span>
      </button>
    </div>
  );
}
