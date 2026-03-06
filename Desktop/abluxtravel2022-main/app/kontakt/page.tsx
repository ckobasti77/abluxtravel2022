"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiOutlinePhone,
  HiOutlineSparkles,
} from "react-icons/hi2";
import AlienShell from "../../components/alien-shell";
import PageAdminEditorDock from "../../components/page-admin-editor-dock";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { useSettings } from "../../lib/use-settings";
import styles from "./page.module.css";

type ContactFormValues = {
  fullName: string;
  email: string;
  phone: string;
  travelType: string;
  travelers: string;
  month: string;
  message: string;
  consent: boolean;
};

const initialValues: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  travelType: "",
  travelers: "",
  month: "",
  message: "",
  consent: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StatusState = { type: "success" | "error"; text: string } | null;

type ContactSignalCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
  tone: "cyan" | "violet" | "blue" | "amber";
};

const cx = (...values: Array<string | undefined | false>) =>
  values.filter(Boolean).join(" ");

function ContactSignalCard({
  icon,
  label,
  value,
  href,
  isExternal = false,
  tone,
}: ContactSignalCardProps) {
  const cardClassName = cx(styles.signalCard, styles[`tone${tone}`], "fx-lift");
  const content = (
    <>
      <span className={styles.signalIcon}>{icon}</span>
      <span className={styles.signalMeta}>
        <span className={styles.signalLabel}>{label}</span>
        <span className={styles.signalValue}>{value}</span>
      </span>
    </>
  );

  if (!href) {
    return <article className={cardClassName}>{content}</article>;
  }

  return (
    <a
      className={cardClassName}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

export default function KontaktPage() {
  const { dictionary } = useSitePreferences();
  const settings = useSettings();
  const [form, setForm] = useState<ContactFormValues>(initialValues);
  const [status, setStatus] = useState<StatusState>(null);

  const travelOptions = useMemo(
    () => [
      { value: "religious", label: dictionary.contact.travelTypeReligious },
      { value: "summer", label: dictionary.contact.travelTypeSummer },
      { value: "europe", label: dictionary.contact.travelTypeEurope },
      { value: "excursions", label: dictionary.contact.travelTypeExcursions },
      { value: "custom", label: dictionary.contact.travelTypeCustom },
    ],
    [dictionary.contact]
  );

  const selectedTravelLabel = useMemo(() => {
    const selected = travelOptions.find((option) => option.value === form.travelType);
    return selected?.label ?? dictionary.contact.travelTypePlaceholder;
  }, [dictionary.contact.travelTypePlaceholder, form.travelType, travelOptions]);

  const contactSignals = useMemo(() => {
    const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
    const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      settings.address
    )}`;

    return [
      {
        key: "office",
        icon: <HiOutlineMapPin aria-hidden />,
        label: dictionary.contact.officeLabel,
        value: settings.address,
        href: mapHref,
        isExternal: true,
        tone: "cyan" as const,
      },
      {
        key: "email",
        icon: <HiOutlineEnvelope aria-hidden />,
        label: dictionary.contact.emailLabel,
        value: settings.email,
        href: `mailto:${settings.email}`,
        tone: "violet" as const,
      },
      {
        key: "phone",
        icon: <HiOutlinePhone aria-hidden />,
        label: dictionary.contact.phoneLabel,
        value: settings.phone,
        href: phoneHref,
        tone: "blue" as const,
      },
      {
        key: "hours",
        icon: <HiOutlineClock aria-hidden />,
        label: dictionary.contact.hoursLabel,
        value: settings.workingHours,
        tone: "amber" as const,
      },
    ];
  }, [
    dictionary.contact.emailLabel,
    dictionary.contact.hoursLabel,
    dictionary.contact.officeLabel,
    dictionary.contact.phoneLabel,
    settings.address,
    settings.email,
    settings.phone,
    settings.workingHours,
  ]);

  const updateField = <Key extends keyof ContactFormValues>(
    key: Key,
    value: ContactFormValues[Key]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setStatus(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!fullName || !email || !message || !form.consent) {
      setStatus({ type: "error", text: dictionary.contact.requiredError });
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus({ type: "error", text: dictionary.contact.emailError });
      return;
    }

    setStatus({ type: "success", text: dictionary.contact.success });
    setForm(initialValues);
  };

  return (
    <AlienShell className={cx("site-fade", styles.page)}>
      <section className={styles.hero}>
        <div className={styles.heroAtmosphere} aria-hidden />
        <span className={cx("pill", styles.heroBadge)}>{dictionary.contact.badge}</span>
        <h1 className={styles.heroTitle}>{dictionary.contact.title}</h1>
        <p className={styles.heroDescription}>{dictionary.contact.description}</p>
        <ul className={styles.heroSignals}>
          {travelOptions.map((option) => (
            <li key={option.value} className={styles.heroSignal}>
              {option.label}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.grid}>
        <article className={cx(styles.formCard, "section-holo")}>
          <header className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden>
              <HiOutlinePaperAirplane />
            </span>
            <div>
              <h2 className={styles.cardTitle}>{dictionary.contact.formTitle}</h2>
              <p className={styles.cardDescription}>{selectedTravelLabel}</p>
            </div>
          </header>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.fieldRowSingle}>
              <label className={styles.field} htmlFor="kontakt-full-name">
                <span className={styles.fieldLabel}>{dictionary.contact.fullName}</span>
                <input
                  id="kontakt-full-name"
                  type="text"
                  className={styles.input}
                  placeholder={dictionary.contact.fullName}
                  value={form.fullName}
                  required
                  autoComplete="name"
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldRowDouble}>
              <label className={styles.field} htmlFor="kontakt-email">
                <span className={styles.fieldLabel}>{dictionary.contact.email}</span>
                <input
                  id="kontakt-email"
                  type="email"
                  className={styles.input}
                  placeholder={dictionary.contact.email}
                  value={form.email}
                  required
                  autoComplete="email"
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
              <label className={styles.field} htmlFor="kontakt-phone">
                <span className={styles.fieldLabel}>{dictionary.contact.phone}</span>
                <input
                  id="kontakt-phone"
                  type="tel"
                  className={styles.input}
                  placeholder={dictionary.contact.phone}
                  value={form.phone}
                  autoComplete="tel"
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldRowDouble}>
              <label className={styles.field} htmlFor="kontakt-travel-type">
                <span className={styles.fieldLabel}>{dictionary.contact.travelType}</span>
                <select
                  id="kontakt-travel-type"
                  className={styles.select}
                  value={form.travelType}
                  onChange={(event) => updateField("travelType", event.target.value)}
                >
                  <option value="">{dictionary.contact.travelTypePlaceholder}</option>
                  {travelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field} htmlFor="kontakt-travelers">
                <span className={styles.fieldLabel}>{dictionary.contact.travelers}</span>
                <input
                  id="kontakt-travelers"
                  type="number"
                  min={1}
                  className={styles.input}
                  placeholder={dictionary.contact.travelers}
                  value={form.travelers}
                  onChange={(event) => updateField("travelers", event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldRowSingle}>
              <label className={styles.field} htmlFor="kontakt-month">
                <span className={styles.fieldLabel}>{dictionary.contact.month}</span>
                <input
                  id="kontakt-month"
                  type="month"
                  className={styles.input}
                  value={form.month}
                  onChange={(event) => updateField("month", event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldRowSingle}>
              <label className={styles.field} htmlFor="kontakt-message">
                <span className={styles.fieldLabel}>{dictionary.contact.message}</span>
                <textarea
                  id="kontakt-message"
                  className={styles.textarea}
                  placeholder={dictionary.contact.message}
                  value={form.message}
                  required
                  onChange={(event) => updateField("message", event.target.value)}
                />
              </label>
            </div>

            <label className={styles.checkboxRow} htmlFor="kontakt-consent">
              <input
                id="kontakt-consent"
                type="checkbox"
                checked={form.consent}
                onChange={(event) => updateField("consent", event.target.checked)}
              />
              <span>{dictionary.contact.consent}</span>
            </label>

            {status ? (
              <p
                role="status"
                className={cx(
                  styles.status,
                  status.type === "success" ? styles.statusSuccess : styles.statusError
                )}
              >
                {status.text}
              </p>
            ) : null}

            <button type="submit" className={cx("btn-primary", styles.submitButton)}>
              <HiOutlineSparkles aria-hidden />
              <span>{dictionary.contact.submit}</span>
            </button>
          </form>
        </article>

        <aside className={cx(styles.signalPanel, "section-holo")}>
          <header className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden>
              <HiOutlineSparkles />
            </span>
            <div>
              <h2 className={styles.cardTitle}>{dictionary.contact.infoTitle}</h2>
              <p className={styles.cardDescription}>{dictionary.contact.travelTypePlaceholder}</p>
            </div>
          </header>

          <div className={styles.signalGrid}>
            {contactSignals.map((signal) => (
              <ContactSignalCard
                key={signal.key}
                icon={signal.icon}
                label={signal.label}
                value={signal.value}
                href={signal.href}
                isExternal={signal.isExternal}
                tone={signal.tone}
              />
            ))}
          </div>

          <article className={styles.holoCard}>
            <h3 className={styles.holoTitle}>{dictionary.contact.travelType}</h3>
            <ul className={styles.holoList}>
              {travelOptions.map((option) => (
                <li key={`holo-${option.value}`}>{option.label}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <PageAdminEditorDock slot="about" className="mt-10" />
    </AlienShell>
  );
}
