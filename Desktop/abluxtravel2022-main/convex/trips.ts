import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("upcoming"), v.literal("completed"))
    ),
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let trips;

    if (args.status) {
      trips = await ctx.db
        .query("trips")
        .withIndex("by_status_order", (q) => q.eq("status", args.status!))
        .collect();
    } else if (args.featuredOnly) {
      trips = await ctx.db
        .query("trips")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .collect();
    } else {
      trips = await ctx.db.query("trips").collect();
    }

    trips.sort((a, b) => a.order - b.order);

    return Promise.all(
      trips.map(async (trip) => ({
        ...trip,
        imageUrls: await Promise.all(
          trip.imageStorageIds.map(async (id) => {
            const url = await ctx.storage.getUrl(id);
            return url ?? "";
          })
        ),
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const trip = await ctx.db
      .query("trips")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!trip) return null;

    const imageUrls = await Promise.all(
      trip.imageStorageIds.map(async (id) => {
        const url = await ctx.storage.getUrl(id);
        return url ?? "";
      })
    );

    return { ...trip, imageUrls };
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("trips")),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    nights: v.number(),
    days: v.number(),
    transport: v.union(
      v.literal("bus"),
      v.literal("plane"),
      v.literal("car"),
      v.literal("train"),
      v.literal("self")
    ),
    departureDate: v.string(),
    returnDate: v.string(),
    departureCity: v.string(),
    hotelInfo: v.optional(v.string()),
    depositPercentage: v.optional(v.number()),
    depositDeadline: v.optional(v.string()),
    itinerary: v.array(
      v.object({
        day: v.number(),
        date: v.string(),
        description: v.string(),
      })
    ),
    included: v.array(v.string()),
    notIncluded: v.array(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    status: v.union(
      v.literal("active"),
      v.literal("upcoming"),
      v.literal("completed")
    ),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const payload = { ...data, updatedAt: Date.now() };

    if (id) {
      await ctx.db.patch(id, payload);
      return id;
    }
    return ctx.db.insert("trips", payload);
  },
});

export const remove = mutation({
  args: { id: v.id("trips") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
