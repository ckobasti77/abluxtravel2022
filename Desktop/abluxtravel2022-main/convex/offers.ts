import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const sourceStatus = v.union(
  v.literal("planned"),
  v.literal("connected"),
  v.literal("syncing"),
  v.literal("paused")
);

const sanitizeTags = (tags: string[]) =>
  Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    )
  );

export const listSources = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("sources")
      .withIndex("by_enabled", (q) => q.eq("isEnabled", true))
      .collect();
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const listLiveBoard = query({
  args: {
    limit: v.optional(v.number()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 30, 1), 100);
    const destination = args.destination?.trim().toLowerCase();
    const offers = await ctx.db
      .query("offers")
      .withIndex("by_active_updated", (q) => q.eq("isActive", true))
      .order("desc")
      .take(250);

    if (!destination) {
      return offers.slice(0, limit);
    }

    return offers
      .filter((offer) => offer.destination.toLowerCase().includes(destination))
      .slice(0, limit);
  },
});

export const upsertSource = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    status: sourceStatus,
    syncEverySeconds: v.number(),
    apiBaseUrl: v.optional(v.string()),
    webhookSecretLabel: v.optional(v.string()),
    isEnabled: v.boolean(),
    lastSyncAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("sources")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }

    return ctx.db.insert("sources", { ...args, updatedAt: now });
  },
});

export const upsertOffer = mutation({
  args: {
    sourceSlug: v.string(),
    externalId: v.string(),
    title: v.string(),
    destination: v.string(),
    departureCity: v.optional(v.string()),
    departureDate: v.optional(v.string()),
    returnDate: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    seatsLeft: v.optional(v.number()),
    tags: v.array(v.string()),
    normalizedHash: v.string(),
    score: v.optional(v.number()),
    rawSnapshot: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("offers")
      .withIndex("by_source_external", (q) =>
        q.eq("sourceSlug", args.sourceSlug).eq("externalId", args.externalId)
      )
      .unique();

    const payload = {
      ...args,
      tags: sanitizeTags(args.tags),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("offers", payload);
  },
});

export const deactivateOffer = mutation({
  args: {
    sourceSlug: v.string(),
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("offers")
      .withIndex("by_source_external", (q) =>
        q.eq("sourceSlug", args.sourceSlug).eq("externalId", args.externalId)
      )
      .unique();

    if (!existing) {
      return null;
    }

    await ctx.db.patch(existing._id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return existing._id;
  },
});
