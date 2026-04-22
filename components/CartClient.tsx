"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartItem, getCart } from "@/lib/cart";

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  if (!items.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.cart_id} className="rounded-lg border bg-white p-4">
            <p className="font-semibold">{item.product_name}</p>
            <p className="text-sm text-slate-600">{item.variant_label}</p>
            {item.artwork_url ? (
              <a href={item.artwork_url} target="_blank" className="text-sm text-blue-600" rel="noreferrer">
                View artwork
              </a>
            ) : (
              <p className="text-sm text-slate-500">Text-only design</p>
            )}
            <p className="mt-1 text-sm font-medium">${item.price.toFixed(2)}</p>
          </article>
        ))}
      </div>
      <div className="rounded-lg border bg-white p-4">
        <p className="mb-2 text-lg font-bold">Total: ${total.toFixed(2)}</p>
        <Link href="/checkout" className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-white">
          Checkout
        </Link>
      </div>
    </section>
  );
}
