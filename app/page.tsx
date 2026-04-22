import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const json = await res.json();
  return json.products;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Browse garments</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
