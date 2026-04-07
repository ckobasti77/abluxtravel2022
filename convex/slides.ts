import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const detectMediaTypeFromName = (
  fileName?: string
): "video" | "image" | undefined => {
  if (!fileName) {
    return undefined;
  }

  const normalized = fileName.toLowerCase().split("?")[0].split("#")[0];
  if (normalized.endsWith(".mp4")) {
    return "video";
  }

  if (
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg") ||
    normalized.endsWith(".png") ||
    normalized.endsWith(".webp")
  ) {
    return "image";
  }

  return undefined;
};

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("slides")
      .withIndex("by_order", (q) => q)
      .collect();

    return Promise.all(
      slides.map(async (slide) => {
        const mediaUrl = slide.storageId
          ? await ctx.storage.getUrl(slide.storageId)
          : null;

        return {
          ...slide,
          mediaType:
            slide.mediaType ??
            detectMediaTypeFromName(slide.videoUrl) ??
            (slide.storageId ? "video" : undefined),
          mediaName: slide.videoUrl ?? null,
          mediaUrl,
        };
      })
    );
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("slides")
      .withIndex("by_order", (q) => q)
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return Promise.all(
      slides.map(async (slide) => {
        const mediaUrl = slide.storageId
          ? await ctx.storage.getUrl(slide.storageId)
          : null;

        return {
          ...slide,
          mediaType:
            slide.mediaType ??
            detectMediaTypeFromName(slide.videoUrl) ??
            (slide.storageId ? "video" : undefined),
          mediaName: slide.videoUrl ?? null,
          mediaUrl,
        };
      })
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
    mediaType: v.optional(v.union(v.literal("video"), v.literal("image"))),
    videoUrl: v.optional(v.string()),
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
        mediaType: args.mediaType,
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
      mediaType: args.mediaType,
      videoUrl: args.videoUrl,
      storageId: args.storageId,
      order: args.order,
      isActive: args.isActive,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("slides") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
