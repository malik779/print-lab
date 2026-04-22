"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductDetail } from "@/lib/types";

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [variantId, setVariantId] = useState(product.product_variants[0]?.id ?? "");
  const selectedVariant = useMemo(
    () => product.product_variants.find((variant) => variant.id === variantId),
    [variantId, product.product_variants]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <img src={product.image_url} alt={product.name} className="w-full rounded-xl border object-cover" />
      <div className="space-y-4 rounded-xl border bg-white p-5">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-slate-500">
          {product.brand} · {product.category}
        </p>
        <p className="text-xl font-semibold">${product.base_price.toFixed(2)}</p>
        <div>
          <label className="mb-1 block text-sm font-medium">Variant</label>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full rounded-md border p-2"
          >
            {product.product_variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.color} / {variant.size} ({variant.sku})
              </option>
            ))}
          </select>
        </div>
        <Link
          href={`/customize/${product.id}?variantId=${variantId}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-white"
        >
          Customize Design
        </Link>
        {selectedVariant && (
          <p className="text-xs text-slate-500">In stock: {selectedVariant.stock} units</p>
        )}
      </div>
    </div>
  );
}
