import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const localizedText = v.object({
  sr: v.string(),
  en: v.string(),
});

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

const normalizeAccent = (value?: string) => {
  const accent = value?.trim();
  return accent && /^#[0-9a-f]{6}$/i.test(accent) ? accent : "#67e8f9";
};

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("homeRouteSlides")
      .withIndex("by_order", (q) => q)
      .collect();

    return Promise.all(
      slides.map(async (slide) => ({
        ...slide,
        imageUrl: await ctx.storage.getUrl(slide.storageId),
      }))
    );
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db
      .query("homeRouteSlides")
      .withIndex("by_order", (q) => q)
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return Promise.all(
      slides.map(async (slide) => ({
        ...slide,
        imageUrl: await ctx.storage.getUrl(slide.storageId),
      }))
    );
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("homeRouteSlides")),
    title: localizedText,
    caption: localizedText,
    accent: v.optional(v.string()),
    storageId: v.id("_storage"),
    order: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const values = {
      title: {
        sr: normalizeText(args.title.sr),
        en: normalizeText(args.title.en),
      },
      caption: {
        sr: normalizeText(args.caption.sr),
        en: normalizeText(args.caption.en),
      },
      accent: normalizeAccent(args.accent),
      storageId: args.storageId,
      order: Number(args.order),
      isActive: args.isActive,
      updatedAt: now,
    };

    if (args.id) {
      const existing = await ctx.db.get(args.id);
      await ctx.db.patch(args.id, values);

      if (existing && existing.storageId !== args.storageId) {
        await ctx.storage.delete(existing.storageId);
      }

      return args.id;
    }

    return await ctx.db.insert("homeRouteSlides", values);
  },
});

export const remove = mutation({
  args: { id: v.id("homeRouteSlides") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      return;
    }

    await ctx.db.delete(args.id);
    await ctx.storage.delete(existing.storageId);
  },
});
