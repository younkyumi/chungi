import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/dream?keyword=용
// keyword 매칭: keyword 정확매칭 우선 → 부분매칭 fallback
// keyword 없으면 길몽 random 1건
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kw = (searchParams.get("keyword") || "").trim();

  if (!kw) {
    const { data, error } = await supabase
      .from("dream_interpretations")
      .select("keyword, category, traditional_meaning, modern_meaning, is_lucky")
      .eq("is_lucky", true)
      .limit(5);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const pick = (data || [])[Math.floor(Math.random() * (data?.length || 1))];
    return NextResponse.json({ matched: !!pick, dream: pick || null, lucky_random: true });
  }

  // 정확매칭
  const exact = await supabase
    .from("dream_interpretations")
    .select("keyword, category, traditional_meaning, modern_meaning, is_lucky")
    .eq("keyword", kw)
    .limit(1);
  if (exact.data && exact.data.length > 0) {
    return NextResponse.json({ matched: true, dream: exact.data[0] });
  }

  // 부분매칭 (LIKE %kw%)
  const part = await supabase
    .from("dream_interpretations")
    .select("keyword, category, traditional_meaning, modern_meaning, is_lucky")
    .ilike("keyword", `%${kw}%`)
    .limit(3);
  if (part.error) return NextResponse.json({ error: part.error.message }, { status: 500 });
  return NextResponse.json({
    matched: (part.data || []).length > 0,
    candidates: part.data || [],
    dream: (part.data || [])[0] || null,
  });
}
