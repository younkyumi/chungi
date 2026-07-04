import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 별자리 매핑 (월/일 → 별자리명)
function monthDayToSign(month: number, day: number): string {
  const ranges: [string, [number, number], [number, number]][] = [
    ["양자리", [3, 21], [4, 19]],
    ["황소자리", [4, 20], [5, 20]],
    ["쌍둥이자리", [5, 21], [6, 21]],
    ["게자리", [6, 22], [7, 22]],
    ["사자자리", [7, 23], [8, 22]],
    ["처녀자리", [8, 23], [9, 22]],
    ["천칭자리", [9, 23], [10, 22]],
    ["전갈자리", [10, 23], [11, 21]],
    ["사수자리", [11, 22], [12, 21]],
    ["염소자리", [12, 22], [1, 19]],
    ["물병자리", [1, 20], [2, 18]],
    ["물고기자리", [2, 19], [3, 20]],
  ];
  for (const [name, start, end] of ranges) {
    const [sm, sd] = start, [em, ed] = end;
    if (sm === em) {
      if (month === sm && day >= sd && day <= ed) return name;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return name;
    }
  }
  return "양자리";
}

// GET /api/star?month=4&day=7 또는 ?sign=양자리
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || "0");
  const day = parseInt(searchParams.get("day") || "0");
  const signParam = (searchParams.get("sign") || "").trim();

  let signName = signParam;
  if (!signName && month && day) signName = monthDayToSign(month, day);

  if (!signName) return NextResponse.json({ error: "month+day or sign required" }, { status: 400 });

  const { data, error } = await supabase
    .from("star_fortune")
    .select("*")
    .eq("star_sign", signName)
    .limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    matched: (data || []).length > 0,
    sign_name: signName,
    star: data?.[0] || null,
  });
}
