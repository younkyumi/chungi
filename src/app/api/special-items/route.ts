import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch all special items (패키지·선물권 등)
export async function GET() {
  const { data, error } = await supabase
    .from("special_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json({ items: null });
  }
  return NextResponse.json({ items: data });
}

// POST: replace all (admin saveAll)
export async function POST(request: NextRequest) {
  const { items } = await request.json();
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be array" }, { status: 400 });
  }
  for (let i = 0; i < items.length; i++) {
    const s = items[i];
    await supabase.from("special_items").upsert(
      {
        id: s.id,
        icon: s.icon || null,
        title: s.title || null,
        sub: s.sub || null,
        price: s.price || null,
        original_price: s.originalPrice || null,
        discount: s.discount || null,
        badge: s.badge || null,
        image_url: s.imageUrl || null,
        contents: s.contents || [],
        sort_order: i,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  }
  return NextResponse.json({ success: true });
}

// PATCH: single item update
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  const mapped: Record<string, unknown> = { id };
  if ("icon" in updates) mapped.icon = updates.icon;
  if ("title" in updates) mapped.title = updates.title;
  if ("sub" in updates) mapped.sub = updates.sub;
  if ("price" in updates) mapped.price = updates.price;
  if ("originalPrice" in updates) mapped.original_price = updates.originalPrice;
  if ("discount" in updates) mapped.discount = updates.discount;
  if ("badge" in updates) mapped.badge = updates.badge;
  if ("imageUrl" in updates) mapped.image_url = updates.imageUrl;
  if ("contents" in updates) mapped.contents = updates.contents;
  if ("sort_order" in updates) mapped.sort_order = updates.sort_order;
  mapped.updated_at = new Date().toISOString();
  const { error } = await supabase
    .from("special_items")
    .upsert(mapped, { onConflict: "id" });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
