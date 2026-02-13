"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import AlienShell from "../../components/alien-shell";
import { useSitePreferences } from "../../components/site-preferences-provider";
import { api } from "../../convex/_generated/api";
import { type AuthErrorCode, setSessionFromAuth } from "../../lib/local-auth";

export default function SignInPage() {
  const router = useRouter();
  const { dictionary } = useSitePreferences();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const login = useMutation(api.auth.login);

  const errorText = useMemo(() => {
    if (!error) return null;
    if (error === "invalid_credentials") {
      return dictionary.auth.invalidCredentials;
    }
    return dictionary.auth.invalidCredentials;
  }, [dictionary.auth.invalidCredentials, error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const result = await login({
        username: username.trim(),
        password,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSessionFromAuth(result.user);
      setError(null);
      router.push("/");
    } catch {
      setError("invalid_credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlienShell className="site-fade">
      <section className="mx-auto w-full max-w-xl">
        <article className="surface rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl font-semibold">{dictionary.auth.signInTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{dictionary.auth.signInDescription}</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <input
              className="control"
              placeholder={dictionary.auth.username}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={submitting}
              required
            />
            <input
              className="control"
              placeholder={dictionary.auth.password}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              required
            />

            {errorText ? (
              <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm">
                {errorText}
              </p>
            ) : null}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {dictionary.auth.signInButton}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            {dictionary.auth.noAccount}{" "}
            <Link href="/signup" className="font-semibold text-[var(--primary)]">
              {dictionary.auth.signUpTitle}
            </Link>
          </p>
        </article>
      </section>
    </AlienShell>
  );
}

