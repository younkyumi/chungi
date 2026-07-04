import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/blood?type=A
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const t = (searchParams.get("type") || "").trim().toUpperCase();
  if (!t) return NextResponse.json({ error: "type required (A/B/AB/O)" }, { status: 400 });

  const normalized = t.endsWith("형") ? t : `${t}형`;

  const { data, error } = await supabase
    .from("blood_fortune")
    .select("*")
    .eq("blood_type", normalized)
    .limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    matched: (data || []).length > 0,
    blood: data?.[0] || null,
  });
}
