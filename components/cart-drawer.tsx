"use client";

import CmsImage from "@/components/cms-image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaMinus, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useSitePreferences } from "./site-preferences-provider";

const STRIPE_LIVE = process.env.NEXT_PUBLIC_STRIPE_LIVE === "true";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { dictionary } = useSitePreferences();
  const { items, removeItem, updateQuantity, clearCart, total } =
    useCartStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const createOrder = useMutation(api.orders.create);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!STRIPE_LIVE) {
      // Standby mode: record order in Convex and show message
      try {
        await createOrder({
          items: items.map((i) => ({
            id: i.id,
            type: i.type,
            title: i.title,
            price: i.price,
            currency: i.currency,
            quantity: i.quantity,
            meta: i.meta,
          })),
          totalAmount: total(),
          currency: items[0]?.currency ?? "EUR",
        });
        clearCart();
        alert(dictionary.cart.standbyMessage);
        onClose();
      } catch (err) {
        console.error("Order creation failed:", err);
      }
      return;
    }

    // Phase 2: Stripe live - would redirect to Stripe Checkout
    // This code path activates when NEXT_PUBLIC_STRIPE_LIVE=true
  };

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  };

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        className="surface relative z-10 flex h-full w-full max-w-md flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={dictionary.cart.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-heading text-lg font-bold">
            {dictionary.cart.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={dictionary.cart.close}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[var(--primary-soft)]"
          >
            <FaXmark size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-muted text-center text-sm py-12">
              {dictionary.cart.empty}
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="surface-strong flex items-start gap-3 rounded-xl p-3"
                >
                  {item.imageUrl ? (
                    <CmsImage
                      src={item.imageUrl}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-[var(--primary-soft)]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-muted mt-0.5 text-xs">
                      {formatPrice(item.price, item.currency)}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-xs transition hover:bg-[var(--primary-soft)]"
                        aria-label="-1"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-xs transition hover:bg-[var(--primary-soft)]"
                        aria-label="+1"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted mt-1 shrink-0 transition hover:text-red-500"
                    aria-label={dictionary.cart.removeItem}
                    title={dictionary.cart.removeItem}
                  >
                    <FaTrash size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{dictionary.cart.total}</span>
              <span>
                {formatPrice(total(), items[0]?.currency ?? "EUR")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="btn-primary w-full !justify-center !py-3 !text-sm"
            >
              {dictionary.cart.checkout}
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="btn-secondary w-full !justify-center !py-2 !text-xs"
            >
              {dictionary.cart.clearCart}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

