"use client";

import { FaEnvelope, FaInstagram, FaPhone } from "react-icons/fa6";
import { useSettings } from "../lib/use-settings";
import { useSitePreferences } from "./site-preferences-provider";

export default function QuickActions() {
  const settings = useSettings();
  const { language } = useSitePreferences();

  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

  const labels =
    language === "sr"
      ? {
          group: "Brze kontakt akcije",
          instagram: "Instagram",
          phone: "Poziv",
          email: "Email",
        }
      : {
          group: "Quick contact actions",
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

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="quick-action-bar" role="navigation" aria-label={labels.group}>
      {actions.map((action) => (
        <a
          key={`${action.label}-${action.href}`}
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          className="quick-action-btn"
          aria-label={action.label}
          title={action.label}
        >
          <span className="quick-action-btn__icon">{action.icon}</span>
          <span className="quick-action-btn__label">{action.label}</span>
        </a>
      ))}
    </div>
  );
}

