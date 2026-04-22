import { CustomizeClient } from "@/components/CustomizeClient";
import { ProductDetail } from "@/lib/types";

async function getProduct(id: string): Promise<ProductDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products?id=${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load product");
  const json = await res.json();
  return json.product;
}

export default async function CustomizePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variantId?: string }>;
}) {
  const { id } = await params;
  const { variantId } = await searchParams;
  const product = await getProduct(id);
  const activeVariantId = variantId ?? product.product_variants[0]?.id;

  if (!activeVariantId) {
    return <p>No variants available.</p>;
  }

  return <CustomizeClient product={product} variantId={activeVariantId} />;
}
