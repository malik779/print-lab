"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CanvasEditor } from "@/components/CanvasEditor";
import { addToCart } from "@/lib/cart";
import { ProductDetail, SavedDesign } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export function CustomizeClient({ product, variantId }: { product: ProductDetail; variantId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const variant = product.product_variants.find((item) => item.id === variantId) ?? product.product_variants[0];

  async function handleSave(design: SavedDesign, artworkFile: File | null) {
    try {
      setStatus("Saving design...");
      let artworkUrl = "";

      if (artworkFile) {
        const formData = new FormData();
        formData.append("file", artworkFile);
        const uploadRes = await fetch("/api/upload-artwork", {
          method: "POST",
          body: formData
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadJson = await uploadRes.json();
        artworkUrl = uploadJson.url;
      }

      addToCart({
        cart_id: uuidv4(),
        product_id: product.id,
        product_name: product.name,
        image_url: product.image_url,
        variant_id: variant.id,
        variant_label: `${variant.color} / ${variant.size}`,
        price: product.base_price,
        design_json: {
          ...design,
          image_url: artworkUrl || design.image_url
        },
        artwork_url: artworkUrl
      });

      setStatus("Design added to cart.");
      router.push("/cart");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Customize {product.name}</h1>
      <p className="text-sm text-slate-600">Variant: {variant.color} / {variant.size}</p>
      <CanvasEditor productImage={product.image_url} templates={product.design_templates} onSave={handleSave} />
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </section>
  );
}
