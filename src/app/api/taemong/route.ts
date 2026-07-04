import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/taemong?keyword=호랑이
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kw = (searchParams.get("keyword") || "").trim();

  if (!kw) {
    const { data, error } = await supabase
      .from("taemong")
      .select("symbol, category, child_trait, career_aptitude, gender_hint, is_lucky")
      .eq("is_lucky", true)
      .limit(5);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const pick = (data || [])[Math.floor(Math.random() * (data?.length || 1))];
    return NextResponse.json({ matched: !!pick, taemong: pick || null, lucky_random: true });
  }

  const exact = await supabase
    .from("taemong")
    .select("symbol, category, child_trait, career_aptitude, gender_hint, is_lucky")
    .eq("symbol", kw)
    .limit(1);
  if (exact.data && exact.data.length > 0) {
    return NextResponse.json({ matched: true, taemong: exact.data[0] });
  }

  const part = await supabase
    .from("taemong")
    .select("symbol, category, child_trait, career_aptitude, gender_hint, is_lucky")
    .ilike("symbol", `%${kw}%`)
    .limit(3);
  if (part.error) return NextResponse.json({ error: part.error.message }, { status: 500 });
  return NextResponse.json({
    matched: (part.data || []).length > 0,
    candidates: part.data || [],
    taemong: (part.data || [])[0] || null,
  });
}
