import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const accommodationType = v.union(
  v.literal("villa"),
  v.literal("apartment"),
  v.literal("hotel"),
  v.literal("room"),
  v.literal("hostel"),
  v.literal("other")
);

const boardType = v.union(
  v.literal("ro"),
  v.literal("bb"),
  v.literal("hb"),
  v.literal("fb"),
  v.literal("ai")
);

export const listByTrip = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("accommodations")
      .withIndex("by_trip_order", (q) => q.eq("tripId", args.tripId))
      .collect();

    items.sort((a, b) => a.order - b.order);

    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrls: await Promise.all(
          item.imageStorageIds.map(async (id) => {
            const url = await ctx.storage.getUrl(id);
            return url ?? "";
          })
        ),
      }))
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("accommodations")),
    tripId: v.id("trips"),
    name: v.string(),
    type: accommodationType,
    description: v.string(),
    pricePerPerson: v.number(),
    currency: v.string(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    boardType: v.optional(boardType),
    roomInfo: v.optional(v.string()),
    checkIn: v.optional(v.string()),
    checkOut: v.optional(v.string()),
    distanceToCenter: v.optional(v.string()),
    imageStorageIds: v.array(v.id("_storage")),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const payload = { ...data, updatedAt: Date.now() };

    if (id) {
      await ctx.db.patch(id, payload);
      return id;
    }
    return ctx.db.insert("accommodations", payload);
  },
});

export const remove = mutation({
  args: { id: v.id("accommodations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
