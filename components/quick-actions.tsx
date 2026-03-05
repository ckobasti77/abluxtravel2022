"use client";

import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa6";
import { useSettings } from "../lib/use-settings";

export default function QuickActions() {
  const settings = useSettings();

  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

  return (
    <div className="quick-action-bar">
      <a
        href={settings.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-action-btn"
        aria-label="Instagram"
      >
        <FaInstagram />
      </a>
      <a href={phoneHref} className="quick-action-btn" aria-label="Phone">
        <FaPhone />
      </a>
      <a href={emailHref} className="quick-action-btn" aria-label="Email">
        <FaEnvelope />
      </a>
    </div>
  );
}
