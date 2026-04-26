import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const vehicleRentalKey = v.union(v.literal("bus"), v.literal("luxuryVan"));
const VEHICLE_RENTAL_KEYS = ["bus", "luxuryVan"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await Promise.all(
      VEHICLE_RENTAL_KEYS.map(async (key) => {
        const record = await ctx.db
          .query("vehicleRentalImages")
          .withIndex("by_key", (q) => q.eq("key", key))
          .first();

        return {
          key,
          storageId: record?.storageId ?? null,
          imageUrl: record ? await ctx.storage.getUrl(record.storageId) : null,
          updatedAt: record?.updatedAt ?? null,
        };
      })
    );
  },
});

export const upsert = mutation({
  args: {
    key: vehicleRentalKey,
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("vehicleRentalImages")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    const updatedAt = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        updatedAt,
      });

      if (existing.storageId !== args.storageId) {
        await ctx.storage.delete(existing.storageId);
      }

      return existing._id;
    }

    return await ctx.db.insert("vehicleRentalImages", {
      key: args.key,
      storageId: args.storageId,
      updatedAt,
    });
  },
});

export const remove = mutation({
  args: { key: vehicleRentalKey },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("vehicleRentalImages")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!existing) {
      return null;
    }

    await ctx.db.delete(existing._id);
    await ctx.storage.delete(existing.storageId);

    return existing._id;
  },
});
