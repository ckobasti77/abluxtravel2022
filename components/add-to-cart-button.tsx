"use client";

import { useEffect, useRef, useState } from "react";
import { FaCartPlus, FaCheck } from "react-icons/fa6";
import { useCartStore, CartItemType } from "@/lib/store/use-cart-store";
import { useSitePreferences } from "./site-preferences-provider";

type AddToCartButtonProps = {
  id: string;
  type: CartItemType;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
  meta?: Record<string, string>;
  className?: string;
  compact?: boolean;
};

export default function AddToCartButton({
  id,
  type,
  title,
  price,
  currency,
  imageUrl,
  meta,
  className = "",
  compact = false,
}: AddToCartButtonProps) {
  const { dictionary } = useSitePreferences();
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    addItem({ id, type, title, price, currency, imageUrl, meta });
    setJustAdded(true);
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setJustAdded(false), 1500);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={justAdded ? dictionary.cart.added : dictionary.cart.addToCart}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
          justAdded
            ? "bg-green-500/20 text-green-600"
            : "surface-strong hover:bg-[var(--primary-soft)]"
        } ${className}`}
      >
        {justAdded ? (
          <FaCheck aria-hidden size={13} />
        ) : (
          <FaCartPlus aria-hidden size={14} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-primary inline-flex items-center gap-2 !text-xs ${
        justAdded ? "!bg-green-600" : ""
      } ${className}`}
    >
      {justAdded ? (
        <>
          <FaCheck aria-hidden size={12} />
          {dictionary.cart.added}
        </>
      ) : (
        <>
          <FaCartPlus aria-hidden size={13} />
          {dictionary.cart.addToCart}
        </>
      )}
    </button>
  );
}
