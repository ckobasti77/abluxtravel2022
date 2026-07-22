"use client";

import Link from "next/link";
import { FaPlus, FaChevronRight } from "react-icons/fa6";

type Breadcrumb = {
  label: string;
  href?: string;
};

type ActionButton = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type AdminPageHeaderProps = {
  breadcrumbs: Breadcrumb[];
  title: string;
  subtitle?: string;
  actions?: ActionButton[];
};

export default function AdminPageHeader({
  breadcrumbs,
  title,
  subtitle,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 ? (
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 ? (
                <FaChevronRight className="text-[8px] opacity-50" />
              ) : null}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition hover:text-[var(--text)]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[var(--text)]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      {/* Title row + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={action.onClick}
                className={
                  action.variant === "secondary"
                    ? "btn-secondary text-sm"
                    : "btn-primary text-sm"
                }
              >
                <FaPlus className="text-[10px]" />
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
