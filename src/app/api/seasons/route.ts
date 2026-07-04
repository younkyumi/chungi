import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch all seasons
export async function GET() {
  const { data, error } = await supabase.from("seasons").select("*").order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ seasons: data });
}

// POST: create new season
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase.from("seasons").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ season: data });
}

// PATCH: update season (toggle active, update product_ids)
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data, error } = await supabase.from("seasons").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If toggling is_active, also update goods is_season based on product_ids
  if ('is_active' in updates) {
    const season = data;
    if (season.product_ids && season.product_ids.length > 0) {
      if (updates.is_active) {
        // Set is_season=true for products in this season
        await supabase.from("goods").update({ is_season: true }).in("id", season.product_ids);
      } else {
        // Set is_season=false for products in this season
        await supabase.from("goods").update({ is_season: false }).in("id", season.product_ids);
      }
    }
  }

  return NextResponse.json({ season: data });
}

// DELETE: delete season
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // First unmark products
  const { data: season } = await supabase.from("seasons").select("product_ids").eq("id", id).single();
  if (season?.product_ids?.length > 0) {
    await supabase.from("goods").update({ is_season: false }).in("id", season.product_ids);
  }

  const { error } = await supabase.from("seasons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
