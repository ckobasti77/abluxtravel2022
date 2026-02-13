import { mutation } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_USERNAME = "abluxtravel";
const ADMIN_PASSWORD = "turistickaagencija";
const AUTH_SALT = "abluxtravel2022_auth_v1";

type AuthResult =
  | {
      ok: true;
      user: {
        username: string;
        role: "admin" | "user";
      };
    }
  | { ok: false; error: "invalid_credentials" | "user_exists" };

const normalizeUsername = (value: string) => value.trim().toLowerCase();

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
    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        passwordHash,
        role: "admin",
        updatedAt: now,
      });
      return { username, role: "admin" as const };
    }

    await ctx.db.insert("users", {
      username,
      passwordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    return { username, role: "admin" as const };
  },
});

export const register = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthResult> => {
    const username = normalizeUsername(args.username);
    const password = args.password.trim();

    if (username.length < 3 || password.length < 6) {
      return invalidCredentials();
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      return {
        ok: false,
        error: "user_exists",
      };
    }

    const now = Date.now();
    await ctx.db.insert("users", {
      username,
      passwordHash: await hashPassword(password),
      role: "user",
      createdAt: now,
      updatedAt: now,
    });

    return {
      ok: true,
      user: {
        username,
        role: "user",
      },
    };
  },
});

export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthResult> => {
    const username = normalizeUsername(args.username);
    const password = args.password.trim();

    if (!username || !password) {
      return invalidCredentials();
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) {
      return invalidCredentials();
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return invalidCredentials();
    }

    return {
      ok: true,
      user: {
        username: user.username,
        role: user.role,
      },
    };
  },
});
