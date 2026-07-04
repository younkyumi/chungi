import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 단순 해시 — 생년월일 + 대상연도 → 0..N 인덱스
function hashBirthYear(birth: string, year: number): number {
  const parts = birth.replace(/[^0-9]/g, "-").split("-").filter(Boolean);
  const y = +(parts[0] || 1990);
  const m = +(parts[1] || 1);
  const d = +(parts[2] || 1);
  // 작괘법 단순화: (생년 % 8 + 1) * 100 + (생월 % 6 + 1) * 10 + (생일 % 3 + 1) 형태와 비슷한 분포
  const seed = (y * 31 + m * 17 + d * 7 + year * 13) >>> 0;
  return seed;
}

let _cachedNumbers: number[] | null = null;
let _cachedAt = 0;
async function getDistinctGweNumbers(): Promise<number[]> {
  const now = Date.now();
  if (_cachedNumbers && now - _cachedAt < 60_000 * 60) return _cachedNumbers; // 1h cache
  const { data, error } = await supabase
    .from("tojeong_gwe")
    .select("gwe_number")
    .order("gwe_number");
  if (error || !data) return [];
  const uniq = Array.from(new Set(data.map((r: any) => r.gwe_number))).sort((a, b) => a - b);
  _cachedNumbers = uniq;
  _cachedAt = now;
  return uniq;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const birth = searchParams.get("birth") || "1990-01-01";
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const numbers = await getDistinctGweNumbers();
  if (numbers.length === 0) {
    return NextResponse.json({ error: "no tojeong data in DB" }, { status: 404 });
  }

  const seed = hashBirthYear(birth, year);
  const gweNumber = numbers[seed % numbers.length];

  const { data, error } = await supabase
    .from("tojeong_gwe")
    .select("month, content")
    .eq("gwe_number", gweNumber)
    .order("month");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    gwe_number: gweNumber,
    year,
    months: data || [],
    total_distinct: numbers.length,
  });
}
