import { mutation } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_USERNAME = "abluxtravel";
const ADMIN_EMAIL = "admin@abluxtravel2022.rs";
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
    const username = normalizeUsername(ADMIN_USERNAME);
    const email = normalizeEmail(ADMIN_EMAIL);
    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        username,
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
      username,
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

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", email))
      .unique();

    if (existing) {
      return {
        ok: false,
        error: "user_exists",
      };
    }

    const now = Date.now();
    await ctx.db.insert("users", {
      username: email,
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

    let user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", email))
      .unique();

    if (!user && email === normalizeEmail(ADMIN_EMAIL)) {
      user = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", normalizeUsername(ADMIN_USERNAME)))
        .unique();
    }

    if (!user) {
      return invalidCredentials();
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return invalidCredentials();
    }

    const nameFromEmail = deriveNameFromEmail(email);
    const firstName = user.role === "admin" ? ADMIN_FIRST_NAME : nameFromEmail.firstName;
    const lastName = user.role === "admin" ? ADMIN_LAST_NAME : nameFromEmail.lastName;

    return {
      ok: true,
      user: {
        firstName,
        lastName,
        email,
        role: user.role,
      },
    };
  },
});
