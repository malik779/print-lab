import Link from "next/link";

type OrderItem = {
  id: string;
  artwork_url: string | null;
  design_json: Record<string, unknown>;
  products: { name: string } | null;
};

type Order = {
  id: string;
  customer_email: string;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
};

async function getOrders(): Promise<Order[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/orders`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load orders");
  const json = await res.json();
  return json.orders;
}

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Orders</h1>
      {!orders.length && <p className="text-sm">No orders yet.</p>}
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border bg-white p-4">
          <p className="font-semibold">{order.customer_email}</p>
          <p className="text-sm text-slate-500">
            {new Date(order.created_at).toLocaleString()} · ${order.total_price.toFixed(2)}
          </p>
          <div className="mt-3 space-y-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{item.products?.name ?? "Product"}</p>
                <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-2 text-xs">
                  {JSON.stringify(item.design_json, null, 2)}
                </pre>
                {item.artwork_url && (
                  <Link href={item.artwork_url} target="_blank" className="mt-2 inline-flex text-sm text-blue-600">
                    Download artwork
                  </Link>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
