"use client";

import { useEffect, useRef, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import gsap from "gsap";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useSitePreferences } from "./site-preferences-provider";
import CartDrawer from "./cart-drawer";

export default function CartButton() {
  const { dictionary } = useSitePreferences();
  const itemCount = useCartStore((s) => s.itemCount());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const prevCountRef = useRef(itemCount);

  // GSAP bounce animation when item count changes
  useEffect(() => {
    if (itemCount !== prevCountRef.current && itemCount > 0 && iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <>
      <button
        ref={iconRef}
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={`${dictionary.cart.title} (${itemCount})`}
        title={dictionary.cart.title}
        className="site-nav-icon-btn relative"
      >
        <FaCartShopping aria-hidden size={15} />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[0.6rem] font-bold leading-none text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
