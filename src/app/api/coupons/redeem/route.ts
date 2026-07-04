import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: 쿠폰 코드 등록 (사용자가 코드 입력해서 본인 쿠폰함에 추가)
// body: { user_id, code }
// → coupon_codes 테이블에 정의된 코드를 사용자에게 발급
export async function POST(request: NextRequest) {
  try {
    const { user_id, code } = await request.json();
    if (!user_id || !code) {
      return Response.json({ error: "user_id, code 필수" }, { status: 400 });
    }
    const codeUpper = String(code).trim().toUpperCase();

    // coupon_codes 마스터 테이블 조회
    const { data: master, error: e1 } = await supabase
      .from("coupon_codes")
      .select("*")
      .eq("code", codeUpper)
      .single();
    if (e1 || !master) {
      return Response.json({ error: "유효하지 않은 코드예요" }, { status: 404 });
    }

    // 만료 체크
    if (master.expires_at && new Date(master.expires_at) < new Date()) {
      return Response.json({ error: "만료된 코드예요" }, { status: 400 });
    }

    // 사용 횟수 제한 체크
    if (master.max_uses) {
      const { count } = await supabase
        .from("user_coupons")
        .select("*", { count: "exact", head: true })
        .eq("code", codeUpper);
      if ((count || 0) >= master.max_uses) {
        return Response.json({ error: "코드 사용 한도가 다 찼어요" }, { status: 400 });
      }
    }

    // 1인 1회 제한 체크
    if (master.once_per_user) {
      const { data: existing } = await supabase
        .from("user_coupons")
        .select("id")
        .eq("user_id", user_id)
        .eq("code", codeUpper)
        .limit(1)
        .maybeSingle();
      if (existing) {
        return Response.json({ error: "이미 사용한 코드예요" }, { status: 400 });
      }
    }

    // 사용자 쿠폰함에 발급
    const { data: c, error: e2 } = await supabase
      .from("user_coupons")
      .insert({
        user_id,
        code: codeUpper,
        name: master.name,
        discount_amount: master.discount_amount,
        min_price: master.min_price ?? 0,
        target_service: master.target_service ?? "all",
        is_used: false,
        expires_at: master.user_expires_days
          ? new Date(Date.now() + master.user_expires_days * 86400000).toISOString()
          : master.expires_at,
      })
      .select()
      .single();
    if (e2) return Response.json({ error: e2.message }, { status: 500 });

    return Response.json({ success: true, coupon: c });
  } catch (err: any) {
    return Response.json({ error: err.message || "코드 등록 실패" }, { status: 500 });
  }
}
