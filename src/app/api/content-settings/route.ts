import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch all content settings
export async function GET() {
  const { data, error } = await supabase.from("content_settings").select("*");
  if (error) {
    // If table doesn't exist yet, return null so client can fallback
    return NextResponse.json({ settings: null });
  }
  return NextResponse.json({ settings: data });
}

// POST: save all content settings (from admin)
export async function POST(request: NextRequest) {
  const { settings } = await request.json();

  for (const s of settings) {
    await supabase.from("content_settings").upsert(
      {
        content_id: s.id,
        name: s.name,
        price: s.price,
        is_public: s.isPublic,
        is_preparing: s.isPreparing,
      },
      { onConflict: "content_id" }
    );
  }

  return NextResponse.json({ success: true });
}

// PATCH: save single content setting
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  const mapped: Record<string, unknown> = { content_id: id };
  if ("price" in updates) mapped.price = updates.price;
  if ("isPublic" in updates) mapped.is_public = updates.isPublic;
  if ("isPreparing" in updates) mapped.is_preparing = updates.isPreparing;
  if ("name" in updates) mapped.name = updates.name;
  if ("badgeType" in updates) mapped.badge_type = updates.badgeType;
  if ("originalPrice" in updates) mapped.original_price = updates.originalPrice;

  const { error } = await supabase
    .from("content_settings")
    .upsert(mapped, { onConflict: "content_id" });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
