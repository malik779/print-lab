import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = await request.json();
  const { customer_email, total_price, items } = body as {
    customer_email: string;
    total_price: number;
    items: Array<{
      product_id: string;
      variant_id: string;
      design_json: Record<string, unknown>;
      artwork_url: string;
    }>;
  };

  if (!customer_email || !Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({ customer_email, total_price })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    design_json: item.design_json,
    artwork_url: item.artwork_url || null
  }));

  const { error: itemError } = await supabaseAdmin.from("order_items").insert(orderItems);

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  return NextResponse.json({ order_id: order.id });
}
