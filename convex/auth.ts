import { mutation } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_EMAIL = "abluxtravel@gmail.com";
const LEGACY_ADMIN_USERNAME = "abluxtravel";
const LEGACY_ADMIN_EMAIL = "admin@abluxtravel2022.rs";
const ADMIN_FIRST_NAME = "ABLux";
const ADMIN_LAST_NAME = "Admin";
const ADMIN_PASSWORD = "turistickaagencija";
const AUTH_SALT = "abluxtravel2022_auth_v1";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthResult =
  | {
      ok: true;
      user: {
        firstName: string;
        lastName: string;
        email: string;
        role: "admin" | "user";
      };
    }
  | { ok: false; error: "invalid_credentials" | "user_exists" };

const normalizeUsername = (value: string) => value.trim().toLowerCase();
const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ");

const capitalize = (value: string) => {
  if (!value) return value;
  return value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
};

const deriveNameFromEmail = (email: string) => {
  const local = normalizeEmail(email).split("@")[0] ?? "";
  const tokens = local
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { firstName: "Korisnik", lastName: "" };
  }

  if (tokens.length === 1) {
    return { firstName: capitalize(tokens[0]), lastName: "" };
  }

  return {
    firstName: capitalize(tokens[0]),
    lastName: tokens.slice(1).map(capitalize).join(" "),
  };
};

const hashPassword = async (password: string) => {
  const payload = `${AUTH_SALT}:${password}`;
  const encoded = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const invalidCredentials = (): AuthResult => ({
  ok: false,
  error: "invalid_credentials",
});

export const ensureAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    const email = normalizeEmail(ADMIN_EMAIL);
    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    const now = Date.now();

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const existingByUsername = existingByEmail
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", email))
          .unique();

    const existingByLegacyUsername = existingByEmail || existingByUsername
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", normalizeUsername(LEGACY_ADMIN_USERNAME)))
          .unique();

    const existingByLegacyEmail = existingByEmail || existingByUsername || existingByLegacyUsername
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", normalizeEmail(LEGACY_ADMIN_EMAIL)))
          .unique();

    const existing =
      existingByEmail ?? existingByUsername ?? existingByLegacyUsername ?? existingByLegacyEmail;

    if (existing) {
      await ctx.db.patch(existing._id, {
        username: email,
        email,
        passwordHash,
        role: "admin",
        updatedAt: now,
      });
      return {
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email,
        role: "admin" as const,
      };
    }

    await ctx.db.insert("users", {
      username: email,
      email,
      passwordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    return {
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email,
      role: "admin" as const,
    };
  },
});


export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthResult> => {
    const email = normalizeEmail(args.email);
    const password = args.password.trim();

    if (!email || !password || !EMAIL_PATTERN.test(email)) {
      return invalidCredentials();
    }

    const adminEmail = normalizeEmail(ADMIN_EMAIL);
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", email))
        .unique();
    }

    if (!user && email === adminEmail) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", normalizeUsername(LEGACY_ADMIN_USERNAME)))
        .unique();
    }

    if (!user && email === adminEmail) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", normalizeEmail(LEGACY_ADMIN_EMAIL)))
        .unique();
    }

    if (!user) {
      return invalidCredentials();
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return invalidCredentials();
    }

    const storedEmail =
      typeof user.email === "string" && user.email.trim().length > 0
        ? normalizeEmail(user.email)
        : normalizeEmail(user.username);

    const shouldBeAdmin = email === adminEmail || storedEmail === adminEmail;
    const normalizedRole: "admin" | "user" = shouldBeAdmin ? "admin" : user.role;
    const canonicalEmail = shouldBeAdmin ? adminEmail : storedEmail;

    const needsPatch =
      user.email !== canonicalEmail || user.username !== canonicalEmail || user.role !== normalizedRole;

    if (needsPatch) {
      await ctx.db.patch(user._id, {
        username: canonicalEmail,
        email: canonicalEmail,
        role: normalizedRole,
        updatedAt: Date.now(),
      });
    }

    const nameFromEmail = deriveNameFromEmail(canonicalEmail);
    const firstName = normalizedRole === "admin" ? ADMIN_FIRST_NAME : nameFromEmail.firstName;
    const lastName = normalizedRole === "admin" ? ADMIN_LAST_NAME : nameFromEmail.lastName;

    return {
      ok: true,
      user: {
        firstName,
        lastName,
        email: canonicalEmail,
        role: normalizedRole,
      },
    };
  },
});

export const register = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthResult> => {
    const firstName = normalizeName(args.firstName);
    const lastName = normalizeName(args.lastName);
    const email = normalizeEmail(args.email);
    const password = args.password.trim();

    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !EMAIL_PATTERN.test(email) ||
      password.length < 6
    ) {
      return invalidCredentials();
    }

    if (email === normalizeEmail(ADMIN_EMAIL)) {
      return {
        ok: false,
        error: "user_exists",
      };
    }

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const existingByUsername = existingByEmail
      ? null
      : await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", email))
          .unique();

    const existing = existingByEmail ?? existingByUsername;

    if (existing) {
      return {
        ok: false,
        error: "user_exists",
      };
    }

    const now = Date.now();
    await ctx.db.insert("users", {
      username: email,
      email,
      passwordHash: await hashPassword(password),
      role: "user",
      createdAt: now,
      updatedAt: now,
    });

    return {
      ok: true,
      user: {
        firstName,
        lastName,
        email,
        role: "user",
      },
    };
  },
});
