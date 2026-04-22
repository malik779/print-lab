"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { clearCart, getCart, CartItem } from "@/lib/cart";

export function CheckoutClient() {
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("Creating order...");

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_email: email, items, total_price: total })
    });

    if (!res.ok) {
      setStatus("Order failed");
      return;
    }

    clearCart();
    setItems([]);
    setStatus("Order complete (mock payment accepted).");
  }

  return (
    <section className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-sm text-slate-600">Mock Stripe flow for MVP.</p>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border bg-white p-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border p-2"
        />
        <p className="text-sm">Order total: ${total.toFixed(2)}</p>
        <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-white" disabled={!items.length}>
          Place order
        </button>
      </form>
      {status && <p className="text-sm">{status}</p>}
    </section>
  );
}
