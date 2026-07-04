import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 6자리 랜덤 short_id 생성
function genShortId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // 혼동 쉬운 글자 제외
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// POST: 공유 카드 생성 — 결과 데이터를 저장하고 공유 링크 반환
// body: { svc_id, svc_name, user_name, result_data, cover_image, title, description }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { svc_id, svc_name, user_name, result_data, cover_image, title, description } = body;
    if (!svc_id || !result_data) {
      return Response.json({ error: "svc_id, result_data 필수" }, { status: 400 });
    }

    // 짧은 id 중복 방지 — 10회까지 재시도
    let short_id = genShortId();
    for (let i = 0; i < 10; i++) {
      const { data: ex } = await supabase.from("shared_cards").select("short_id").eq("short_id", short_id).maybeSingle();
      if (!ex) break;
      short_id = genShortId();
    }

    // 큰 base64 이미지 제거 (용량 절감)
    let rd = result_data;
    if (rd && typeof rd === "object") {
      const safe: any = { ...rd };
      ["_imgSrc", "_imgSrc1", "_imgSrc2"].forEach(k => {
        if (safe[k] && typeof safe[k] === "string" && safe[k].length > 50000) {
          safe[k] = null;
        }
      });
      rd = safe;
    }

    const { data, error } = await supabase
      .from("shared_cards")
      .insert({
        short_id,
        svc_id,
        svc_name: svc_name || null,
        user_name: user_name || null,
        result_data: rd,
        cover_image: cover_image || null,
        title: title || null,
        description: description || null,
        view_count: 0,
        expires_at: new Date(Date.now() + 90 * 86400000).toISOString(), // 90일
      })
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    const url = `/share/${short_id}`;
    return Response.json({ success: true, short_id, url, card: data });
  } catch (err: any) {
    return Response.json({ error: err.message || "공유 카드 생성 실패" }, { status: 500 });
  }
}

// GET: 공유 카드 조회 (?short_id=xxx)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const short_id = searchParams.get("short_id");
    if (!short_id) return Response.json({ error: "short_id 필수" }, { status: 400 });

    const { data, error } = await supabase
      .from("shared_cards")
      .select("*")
      .eq("short_id", short_id)
      .maybeSingle();
    if (error || !data) return Response.json({ error: "카드를 찾을 수 없어요" }, { status: 404 });

    // 조회수 증가 (비동기, 실패 무시)
    supabase.from("shared_cards").update({ view_count: (data.view_count || 0) + 1 }).eq("short_id", short_id).then(() => {});

    return Response.json({ card: data });
  } catch (err: any) {
    return Response.json({ error: err.message || "조회 실패" }, { status: 500 });
  }
}
