/**
 * Convex HTTP actions — Stripe webhook endpoint.
 *
 * When Stripe is live (Phase 2), this receives checkout.session.completed
 * events, verifies the signature, and marks the order as "paid".
 *
 * Required environment variables:
 *   STRIPE_WEBHOOK_SECRET — Webhook signing secret from Stripe dashboard
 */

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    // ------------------------------------------------------------------
    // TODO (Phase 2): Uncomment when Stripe is live.
    //
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    //   apiVersion: "2024-04-10",
    // });
    //
    // const signature = request.headers.get("stripe-signature");
    // if (!signature) {
    //   return new Response("Missing stripe-signature header", { status: 400 });
    // }
    //
    // const body = await request.text();
    //
    // let event: Stripe.Event;
    // try {
    //   event = stripe.webhooks.constructEvent(
    //     body,
    //     signature,
    //     process.env.STRIPE_WEBHOOK_SECRET!
    //   );
    // } catch (err) {
    //   console.error("Webhook signature verification failed:", err);
    //   return new Response("Webhook signature verification failed", {
    //     status: 400,
    //   });
    // }
    //
    // if (event.type === "checkout.session.completed") {
    //   const session = event.data.object as Stripe.Checkout.Session;
    //   const orderId = session.metadata?.orderId;
    //
    //   if (orderId) {
    //     await ctx.runMutation(internal.orders.updateStatus, {
    //       id: orderId as Id<"orders">,
    //       status: "paid",
    //       stripeSessionId: session.id,
    //     });
    //   }
    // }
    //
    // return new Response("OK", { status: 200 });
    // ------------------------------------------------------------------

    // Standby: acknowledge webhook but do nothing
    void request;
    return new Response("Webhook received (standby mode)", { status: 200 });
  }),
});

export default http;
