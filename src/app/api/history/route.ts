import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: 사용자 기록 조회 (?user_id=xxx&limit=50)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    if (!user_id) return Response.json({ error: "user_id 필수" }, { status: 400 });

    const { data, error } = await supabase
      .from("user_history")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 200));
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ history: data || [] });
  } catch (err: any) {
    return Response.json({ error: err.message || "조회 실패" }, { status: 500 });
  }
}

// POST: 새 기록 추가
// body: { user_id, icon, name, svc_id, person, person2, person3, date, result, result_type, ctx }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, icon, name, svc_id, person, person2, person3, date, result, result_type, ctx } = body;
    if (!user_id || !name) return Response.json({ error: "user_id, name 필수" }, { status: 400 });

    // result_type에서 큰 base64 이미지 제거 (용량 절감)
    let rt = result_type;
    if (rt && typeof rt === "object") {
      const stripped: any = { ...rt };
      ["_imgSrc", "_imgSrc1", "_imgSrc2"].forEach(k => {
        if (stripped[k] && typeof stripped[k] === "string" && stripped[k].length > 30000) {
          stripped[k] = null;
          stripped._imgWasLarge = true;
        }
      });
      rt = stripped;
    }

    const { data, error } = await supabase
      .from("user_history")
      .insert({
        user_id,
        icon: icon || null,
        name,
        svc_id: svc_id || null,
        person: person || null,
        person2: person2 || null,
        person3: person3 || null,
        date: date || new Date().toLocaleDateString("ko-KR"),
        result: result || null,
        result_type: rt || null,
        ctx: ctx || null,
      })
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ entry: data }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message || "저장 실패" }, { status: 500 });
  }
}

// DELETE: 기록 삭제 (?id=xxx&user_id=xxx)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user_id = searchParams.get("user_id");
    if (!id || !user_id) return Response.json({ error: "id, user_id 필수" }, { status: 400 });

    const { error } = await supabase
      .from("user_history")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message || "삭제 실패" }, { status: 500 });
  }
}
