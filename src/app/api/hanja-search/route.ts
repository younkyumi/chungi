import { NextRequest, NextResponse } from "next/server";
import { HANJA_EXT, searchHanjaExt } from "@/data/hanja-extended";

// GET /api/hanja-search?q={query}&s={stroke}
// q: 한자/음/뜻 중 하나로 검색
// s: 획수 필터 (선택)
//
// 응답: [{c, y, m, s, oh}, ...]
//
// 비용 0원 — 자체 서버에서 정적 데이터셋 검색
// 향후 인명용 한자 8,142자 일괄 추가 예정

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const s = searchParams.get("s");
  const strokeFilter = s ? parseInt(s, 10) : undefined;

  if (!q.trim()) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const results = searchHanjaExt(q, strokeFilter);
  return NextResponse.json({
    results: results.slice(0, 100), // 최대 100개
    total: results.length,
  });
}
