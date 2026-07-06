import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 태세수: 대상 연도의 天干 수 (甲=1 ~ 癸=10)
// 검증: 2024(甲辰)→1, 2025(乙巳)→2, 2026(丙午)→3
function getTaesesu(year: number): number {
  return ((year - 4) % 10 + 10) % 10 + 1;
}

// 오호둔 월건수: 대상 연도와 생월의 月建 天干 수 (1~10)
// 五虎年月遁: 甲己년 정월=戊(5), 乙庚년=庚(7), 丙辛년=壬(9), 丁壬년=甲(1), 戊癸년=丙(3)
// 매월 天干 +1씩 증가
function getWolgunsu(year: number, month: number): number {
  const yearGanIdx = ((year - 4) % 10 + 10) % 10;
  const JAN_GAN: Record<number, number> = { 0:5, 5:5, 1:7, 6:7, 2:9, 7:9, 3:1, 8:1, 4:3, 9:3 };
  const base = JAN_GAN[yearGanIdx];
  return ((base - 1 + (month - 1)) % 10) + 1;
}

// 일진수: 대상 연도 1월 1일의 天干 수 (甲=1 ~ 癸=10)
// 기준: 1900-01-01 = 甲日 (2024-01-01 = 甲日 검증 완료)
function getIljinsu(targetYear: number): number {
  const refMs = Date.UTC(1900, 0, 1);
  const jan1Ms = Date.UTC(targetYear, 0, 1);
  const diffDays = Math.round((jan1Ms - refMs) / 86400000);
  return ((diffDays % 10) + 10) % 10 + 1;
}

function computeGweNumber(birth: string, year: number): number {
  const parts = birth.replace(/[^0-9]/g, "-").split("-").filter(Boolean);
  const by = +(parts[0] || 1990);
  const bm = +(parts[1] || 1);
  const bd = +(parts[2] || 1);

  const age       = year - by + 1;             // 세는나이
  const taesesu   = getTaesesu(year);           // 1~10
  const wolgunsu  = getWolgunsu(year, bm);      // 1~10
  const iljinsu   = getIljinsu(year);           // 1~10 (연도별 변동)

  // 상괘 (1~8): (나이 + 태세수) % 8, 0이면 8
  const s    = (age + taesesu) % 8;
  const sang = s === 0 ? 8 : s;

  // 중괘 (1~6): (생월 + 월건수) % 6, 0이면 6
  const j    = (bm + wolgunsu) % 6;
  const jung = j === 0 ? 6 : j;

  // 하괘 (1~3): (생일 + 일진수) % 3, 0이면 3
  const h  = (bd + iljinsu) % 3;
  const ha = h === 0 ? 3 : h;

  return sang * 100 + jung * 10 + ha;
}

// DB에 없는 괘번호면 가장 가까운 번호로 폴백
function findClosestGwe(target: number, available: number[]): number {
  if (available.includes(target)) return target;
  let closest = available[0];
  let minDiff = Math.abs(target - available[0]);
  for (const n of available) {
    const diff = Math.abs(n - target);
    if (diff < minDiff) { minDiff = diff; closest = n; }
  }
  return closest;
}

let _cachedNumbers: number[] | null = null;
let _cachedAt = 0;
async function getDistinctGweNumbers(): Promise<number[]> {
  const now = Date.now();
  if (_cachedNumbers && now - _cachedAt < 3_600_000) return _cachedNumbers;
  const { data, error } = await supabase
    .from("tojeong_gwe")
    .select("gwe_number")
    .order("gwe_number");
  if (error || !data) return [];
  const uniq = Array.from(new Set(data.map((r: any) => r.gwe_number))).sort((a: number, b: number) => a - b);
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

  const computed  = computeGweNumber(birth, year);
  const gweNumber = findClosestGwe(computed, numbers);

  const { data, error } = await supabase
    .from("tojeong_gwe")
    .select("month, content")
    .eq("gwe_number", gweNumber)
    .order("month");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    gwe_number:      gweNumber,
    year,
    months:          data || [],
    total_distinct:  numbers.length,
    debug_computed:  computed,
  });
}
