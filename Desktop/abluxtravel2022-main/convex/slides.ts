import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("slides")
      .withIndex("by_order", (q) => q)
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return Promise.all(
      slides.map(async (slide) => ({
        ...slide,
        videoUrl:
          slide.storageId ? await ctx.storage.getUrl(slide.storageId) : null,
      }))
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("slides")),
    title: v.string(),
    subtitle: v.string(),
    badge: v.optional(v.string()),
    copy: v.optional(v.string()),
    videoUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        subtitle: args.subtitle,
        badge: args.badge,
        copy: args.copy,
        videoUrl: args.videoUrl,
        storageId: args.storageId,
        order: args.order,
        isActive: args.isActive,
      });
      return args.id;
    }
    return ctx.db.insert("slides", {
      title: args.title,
      subtitle: args.subtitle,
      badge: args.badge,
      copy: args.copy,
      videoUrl: args.videoUrl,
      storageId: args.storageId,
      order: args.order,
      isActive: args.isActive,
    });
  },
});
