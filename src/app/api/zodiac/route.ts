import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/zodiac?birth_year=1990 또는 ?zodiac=토끼띠
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const yr = parseInt(searchParams.get("birth_year") || "0");
  const ddiName = (searchParams.get("zodiac") || "").trim();

  if (ddiName) {
    const { data, error } = await supabase
      .from("zodiac_fortune")
      .select("*")
      .eq("zodiac", ddiName)
      .limit(1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ matched: (data || []).length > 0, zodiac: data?.[0] || null });
  }

  if (!yr) return NextResponse.json({ error: "birth_year or zodiac required" }, { status: 400 });

  // birth_years 컬럼 (TEXT, 콤마 구분) 안에 yr 포함된 행 찾기
  const { data, error } = await supabase
    .from("zodiac_fortune")
    .select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const match = (data || []).find((r: any) => {
    const years = String(r.birth_years || "").split(",").map((s: string) => s.trim());
    return years.includes(String(yr));
  });
  return NextResponse.json({ matched: !!match, zodiac: match || null });
}
