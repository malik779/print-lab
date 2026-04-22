import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductDetail } from "@/lib/types";

async function getProduct(id: string): Promise<ProductDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products?id=${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load product");
  const json = await res.json();
  return json.product;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return <ProductDetailClient product={product} />;
}
