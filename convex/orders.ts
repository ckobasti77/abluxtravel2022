import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Record a new order from the cart.
 *
 * In Standby Mode (NEXT_PUBLIC_STRIPE_LIVE=false), this is called instead of
 * creating a Stripe checkout session. The order is saved with status "pending"
 * and should be forwarded to the admin via email.
 *
 * TODO (Phase 2): After Stripe is live, this mutation will still be used to
 * record orders, but status will be set to "confirmed" only after Stripe
 * webhook confirms payment.
 */
export const create = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.string(),
        type: v.union(
          v.literal("trip"),
          v.literal("offer"),
          v.literal("accommodation")
        ),
        title: v.string(),
        price: v.number(),
        currency: v.string(),
        quantity: v.number(),
        meta: v.optional(v.any()),
      })
    ),
    totalAmount: v.number(),
    currency: v.string(),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });

    // ------------------------------------------------------------------
    // TODO (Phase 2 — Email notification):
    //
    // When an email provider (Resend, SendGrid, etc.) is configured, trigger
    // a Convex action here that sends an email to the admin with the order
    // summary. Example:
    //
    //   await ctx.scheduler.runAfter(0, internal.email.sendOrderNotification, {
    //     orderId,
    //     items: args.items,
    //     totalAmount: args.totalAmount,
    //     currency: args.currency,
    //     customerEmail: args.customerEmail,
    //     customerName: args.customerName,
    //   });
    //
    // Required env variables:
    //   RESEND_API_KEY — API key for Resend (or equivalent provider)
    //   ADMIN_EMAIL    — destination email for order notifications
    // ------------------------------------------------------------------

    return orderId;
  },
});

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("paid"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return ctx.db
      .query("orders")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("paid"),
      v.literal("cancelled")
    ),
    stripeSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
    return id;
  },
});
