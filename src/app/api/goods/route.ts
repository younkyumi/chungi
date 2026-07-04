import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// NOTE: Using anon key. RLS must allow UPDATE/INSERT/DELETE for admin operations.
// Run supabase/fix-rls.sql to add required policies, or switch to SUPABASE_SERVICE_ROLE_KEY for admin routes.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch goods (public site = is_public only, admin = all)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const category = searchParams.get("category");

  let query = supabase.from("goods").select("*");

  if (!admin) {
    query = query.eq("is_public", true);
  }

  if (category && category !== "전체보기" && category !== "추천") {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ goods: data });
}

// PATCH: update a good (admin only)
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("goods")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ good: data });
}
