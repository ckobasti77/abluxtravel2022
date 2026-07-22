import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();
  },
});

export const upsert = mutation({
  args: {
    workingHours: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    instagramUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .first();

    const data = {
      key: "global" as const,
      workingHours: args.workingHours,
      address: args.address,
      phone: args.phone,
      email: args.email,
      instagramUrl: args.instagramUrl,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return ctx.db.insert("settings", data);
  },
});
