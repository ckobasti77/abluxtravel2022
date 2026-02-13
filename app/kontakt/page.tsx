"use client";

import { FormEvent, useMemo, useState } from "react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";

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

export default function KontaktPage() {
  const { dictionary } = useSitePreferences();
  const [form, setForm] = useState<ContactFormValues>(initialValues);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.message || !form.consent) {
      setStatus({ type: "error", text: dictionary.contact.requiredError });
      return;
    }

    if (!emailRegex.test(form.email)) {
      setStatus({ type: "error", text: dictionary.contact.emailError });
      return;
    }

    setStatus({ type: "success", text: dictionary.contact.success });
    setForm(initialValues);
  };

  return (
    <AlienShell className="site-fade">
      <section className="space-y-5">
        <span className="pill">{dictionary.contact.badge}</span>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          {dictionary.contact.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          {dictionary.contact.description}
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-semibold">{dictionary.contact.formTitle}</h2>

          <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
            <input
              type="text"
              className="control"
              placeholder={dictionary.contact.fullName}
              value={form.fullName}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, fullName: event.target.value }))
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="email"
                className="control"
                placeholder={dictionary.contact.email}
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
              />
              <input
                type="text"
                className="control"
                placeholder={dictionary.contact.phone}
                value={form.phone}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, phone: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="control"
                value={form.travelType}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, travelType: event.target.value }))
                }
              >
                <option value="">{dictionary.contact.travelTypePlaceholder}</option>
                {travelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="control"
                placeholder={dictionary.contact.travelers}
                value={form.travelers}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, travelers: event.target.value }))
                }
              />
            </div>

            <input
              type="month"
              className="control"
              aria-label={dictionary.contact.month}
              value={form.month}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, month: event.target.value }))
              }
            />

            <textarea
              className="control"
              placeholder={dictionary.contact.message}
              value={form.message}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, message: event.target.value }))
              }
            />

            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, consent: event.target.checked }))
                }
                className="mt-1"
              />
              <span>{dictionary.contact.consent}</span>
            </label>

            {status ? (
              <p
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-400/40 bg-[var(--success-soft)]"
                    : "border-rose-400/40 bg-rose-500/10"
                }`}
              >
                {status.text}
              </p>
            ) : null}

            <button type="submit" className="btn-primary w-full sm:w-fit">
              {dictionary.contact.submit}
            </button>
          </form>
        </article>

        <article className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-semibold">{dictionary.contact.infoTitle}</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted">
            <p>
              <strong className="text-[var(--text)]">{dictionary.contact.officeLabel}:</strong>{" "}
              {dictionary.contact.officeValue}
            </p>
            <p>
              <strong className="text-[var(--text)]">{dictionary.contact.emailLabel}:</strong>{" "}
              {dictionary.contact.emailValue}
            </p>
            <p>
              <strong className="text-[var(--text)]">{dictionary.contact.phoneLabel}:</strong>{" "}
              {dictionary.contact.phoneValue}
            </p>
            <p>
              <strong className="text-[var(--text)]">{dictionary.contact.hoursLabel}:</strong>{" "}
              {dictionary.contact.hoursValue}
            </p>
          </div>
        </article>
      </section>
    </AlienShell>
  );
}

