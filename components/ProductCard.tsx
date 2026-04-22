import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative h-56 w-full bg-slate-100">
        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-sm text-slate-500">{product.brand}</p>
        <p className="mt-2 text-lg font-bold">${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
