"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import {
  FaArrowRightLong,
  FaCircleCheck,
  FaEye,
  FaEyeSlash,
  FaShieldHalved,
  FaUserAstronaut,
} from "react-icons/fa6";
import AlienShell from "./alien-shell";
import { useSitePreferences } from "./site-preferences-provider";
import { api } from "../convex/_generated/api";
import { type AuthMode } from "../lib/auth-routing";
import { type AuthErrorCode, setSessionFromAuth, signOut } from "../lib/local-auth";
import { useSession } from "../lib/use-session";

type AuthPortalProps = {
  defaultMode?: AuthMode;
  requestedMode?: AuthMode;
  nextPath?: string | null;
};

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

const toSafePath = (value: string | null | undefined) => {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

export default function AuthPortal({
  defaultMode = "signin",
  requestedMode,
  nextPath,
}: AuthPortalProps) {
  const router = useRouter();
  const session = useSession();
  const { dictionary } = useSitePreferences();
  const login = useMutation(api.auth.login);
  const register = useMutation(api.auth.register);

  const resolvedMode = requestedMode ?? defaultMode;
  const resolvedNextPath = useMemo(() => toSafePath(nextPath), [nextPath]);

  const [mode, setMode] = useState<AuthMode>(resolvedMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState<AuthErrorCode | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMode(resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    setAuthError(null);
    setValidationError(null);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }, [mode]);

  const serverErrorText = useMemo(() => {
    if (!authError) return null;
    if (authError === "user_exists") {
      return dictionary.auth.userExists;
    }
    return dictionary.auth.invalidCredentials;
  }, [authError, dictionary.auth.invalidCredentials, dictionary.auth.userExists]);

  const roleLabel = session?.role === "admin" ? dictionary.auth.roleAdmin : dictionary.auth.roleUser;
  const destinationAfterAuth = resolvedNextPath ?? "/";

  const validateInput = (): string | null => {
    if (mode === "signup") {
      if (firstName.trim().length < MIN_NAME_LENGTH) {
        return dictionary.auth.firstNameTooShort;
      }
      if (lastName.trim().length < MIN_NAME_LENGTH) {
        return dictionary.auth.lastNameTooShort;
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return dictionary.auth.invalidEmail;
    }

    if (!password.trim()) {
      return dictionary.auth.requiredFields;
    }

    if (mode === "signup" && password.length < MIN_PASSWORD_LENGTH) {
      return dictionary.auth.passwordTooShort;
    }

    if (mode === "signup" && password !== confirmPassword) {
      return dictionary.auth.passwordMismatch;
    }

    return null;
  };

  const handleModeChange = (nextMode: AuthMode) => {
    if (mode === nextMode) return;
    setMode(nextMode);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || session) {
      return;
    }

    const validationMessage = validateInput();
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setSubmitting(true);
    setValidationError(null);
    setAuthError(null);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const result =
        mode === "signin"
          ? await login({
              email: cleanEmail,
              password,
            })
          : await register({
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: cleanEmail,
              password,
            });

      if (!result.ok) {
        setAuthError(result.error);
        return;
      }

      setSessionFromAuth(result.user);
      const destination = resolvedNextPath ?? (result.user.role === "admin" ? "/admin" : "/");
      router.push(destination);
    } catch {
      setAuthError("invalid_credentials");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/auth?mode=signin");
  };

  const submitLabel = submitting
    ? dictionary.auth.processing
    : mode === "signin"
      ? dictionary.auth.signInButton
      : dictionary.auth.signUpButton;

  const switchPrompt = mode === "signin" ? dictionary.auth.noAccount : dictionary.auth.hasAccount;
  const switchLabel = mode === "signin" ? dictionary.auth.signUpTitle : dictionary.auth.signInTitle;

  const features = [
    dictionary.auth.featureSecurity,
    dictionary.auth.featureExperience,
    dictionary.auth.featureControl,
  ];

  return (
    <AlienShell className="site-fade">
      <section className="auth-orbit mx-auto w-full max-w-6xl">
        <div className="auth-orbit__grid">
          <article className="auth-orbit__story">
            <span className="pill auth-orbit__pill">{dictionary.auth.portalBadge}</span>
            <h1 className="auth-orbit__title">{dictionary.auth.portalTitle}</h1>
            <p className="auth-orbit__description">{dictionary.auth.portalDescription}</p>

            <ul className="auth-orbit__feature-list">
              {features.map((feature) => (
                <li key={feature} className="auth-orbit__feature-item">
                  <span className="auth-orbit__feature-icon">
                    <FaCircleCheck aria-hidden />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="auth-orbit__quick-links">
              <Link href="/" className="auth-orbit__quick-link">
                <span>{dictionary.nav.home}</span>
                <FaArrowRightLong aria-hidden />
              </Link>
              <Link href="/kontakt" className="auth-orbit__quick-link">
                <span>{dictionary.nav.contact}</span>
                <FaArrowRightLong aria-hidden />
              </Link>
            </div>
          </article>

          <article className="auth-orbit__panel surface">
            <div className="auth-orbit__signal">
              <div className="auth-orbit__radar">
                <span className="auth-orbit__ring auth-orbit__ring--a" />
                <span className="auth-orbit__ring auth-orbit__ring--b" />
                <span className="auth-orbit__ring auth-orbit__ring--c" />
                <span className="auth-orbit__core">
                  <FaUserAstronaut aria-hidden />
                </span>
              </div>
              <div>
                <p className="auth-orbit__signal-label">{dictionary.auth.matrixLabel}</p>
                <p className="auth-orbit__signal-value">
                  {session ? dictionary.auth.activeSession : dictionary.auth.awaitingAccess}
                </p>
              </div>
            </div>

            {session ? (
              <div className="auth-orbit__session-card">
                <p className="auth-orbit__session-title">{dictionary.auth.signedInAs}</p>
                <p className="auth-orbit__session-user">{session.displayName}</p>
                <p className="text-sm text-muted">{session.email}</p>
                <div className="auth-orbit__session-meta">
                  <span className="auth-orbit__role-pill">
                    <FaShieldHalved aria-hidden />
                    {roleLabel}
                  </span>
                  <span className="text-muted">{dictionary.auth.sessionReady}</span>
                </div>

                <div className="auth-orbit__session-actions">
                  <Link href={destinationAfterAuth} className="btn-primary w-full !justify-center">
                    {dictionary.auth.continueButton}
                  </Link>
                  {session.role === "admin" ? (
                    <Link href="/admin" className="btn-secondary w-full !justify-center">
                      {dictionary.nav.admin}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn-secondary w-full !justify-center"
                  >
                    {dictionary.nav.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="auth-orbit__tabs">
                  <button
                    type="button"
                    className={cx("auth-orbit__tab", mode === "signin" && "is-active")}
                    onClick={() => handleModeChange("signin")}
                  >
                    {dictionary.auth.signInTitle}
                  </button>
                  <button
                    type="button"
                    className={cx("auth-orbit__tab", mode === "signup" && "is-active")}
                    onClick={() => handleModeChange("signup")}
                  >
                    {dictionary.auth.signUpTitle}
                  </button>
                </div>

                {resolvedNextPath ? (
                  <p className="auth-orbit__next-hint">{dictionary.auth.nextHint}</p>
                ) : null}

                <form onSubmit={handleSubmit} className="auth-orbit__form">
                  {mode === "signup" ? (
                    <div className="auth-orbit__split">
                      <label className="auth-orbit__field">
                        <span>{dictionary.auth.firstName}</span>
                        <input
                          className="control auth-orbit__control"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder={dictionary.auth.firstName}
                          autoComplete="given-name"
                          disabled={submitting}
                          required
                        />
                      </label>

                      <label className="auth-orbit__field">
                        <span>{dictionary.auth.lastName}</span>
                        <input
                          className="control auth-orbit__control"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          placeholder={dictionary.auth.lastName}
                          autoComplete="family-name"
                          disabled={submitting}
                          required
                        />
                      </label>
                    </div>
                  ) : null}

                  <label className="auth-orbit__field">
                    <span>{dictionary.auth.email}</span>
                    <input
                      className="control auth-orbit__control"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={dictionary.auth.email}
                      autoComplete="email"
                      disabled={submitting}
                      required
                    />
                    <small className="text-muted">{dictionary.auth.emailHint}</small>
                  </label>

                  <label className="auth-orbit__field">
                    <span>{dictionary.auth.password}</span>
                    <div className="auth-orbit__password-wrap">
                      <input
                        className="control auth-orbit__control auth-orbit__control--password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={dictionary.auth.password}
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        disabled={submitting}
                        required
                      />
                      <button
                        type="button"
                        className="auth-orbit__visibility-btn"
                        aria-label={
                          showPassword
                            ? dictionary.auth.hidePassword
                            : dictionary.auth.showPassword
                        }
                        onClick={() => setShowPassword((previous) => !previous)}
                        disabled={submitting}
                      >
                        {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
                      </button>
                    </div>
                    <small className="text-muted">{dictionary.auth.passwordHint}</small>
                  </label>

                  {mode === "signup" ? (
                    <label className="auth-orbit__field">
                      <span>{dictionary.auth.confirmPassword}</span>
                      <div className="auth-orbit__password-wrap">
                        <input
                          className="control auth-orbit__control auth-orbit__control--password"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder={dictionary.auth.confirmPassword}
                          autoComplete="new-password"
                          disabled={submitting}
                          required
                        />
                        <button
                          type="button"
                          className="auth-orbit__visibility-btn"
                          aria-label={
                            showPassword
                              ? dictionary.auth.hidePassword
                              : dictionary.auth.showPassword
                          }
                          onClick={() => setShowPassword((previous) => !previous)}
                          disabled={submitting}
                        >
                          {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
                        </button>
                      </div>
                    </label>
                  ) : null}

                  {validationError ? (
                    <p className="auth-orbit__notice auth-orbit__notice--error">{validationError}</p>
                  ) : null}
                  {serverErrorText ? (
                    <p className="auth-orbit__notice auth-orbit__notice--error">{serverErrorText}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full !justify-center"
                  >
                    {submitLabel}
                  </button>
                </form>

                <p className="auth-orbit__switch-row">
                  {switchPrompt}{" "}
                  <button
                    type="button"
                    className="auth-orbit__switch-action"
                    onClick={() => handleModeChange(mode === "signin" ? "signup" : "signin")}
                    disabled={submitting}
                  >
                    {switchLabel}
                  </button>
                </p>
              </>
            )}
          </article>
        </div>
      </section>
    </AlienShell>
  );
}
