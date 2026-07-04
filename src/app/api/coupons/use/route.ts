import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: 쿠폰 사용 처리 (결제 완료 시 호출)
// body: { user_id, coupon_id, order_id, used_amount }
export async function POST(request: NextRequest) {
  try {
    const { user_id, coupon_id, order_id, used_amount } = await request.json();
    if (!user_id || !coupon_id) {
      return Response.json({ error: "user_id, coupon_id 필수" }, { status: 400 });
    }

    // 쿠폰 검증 (소유자 + 미사용 + 미만료)
    const { data: c, error: e1 } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("id", coupon_id)
      .eq("user_id", user_id)
      .single();
    if (e1 || !c) return Response.json({ error: "쿠폰을 찾을 수 없어요" }, { status: 404 });
    if (c.is_used) return Response.json({ error: "이미 사용된 쿠폰이에요" }, { status: 400 });
    if (c.expires_at && new Date(c.expires_at) < new Date()) {
      return Response.json({ error: "만료된 쿠폰이에요" }, { status: 400 });
    }

    // 사용 처리
    const { error: e2 } = await supabase
      .from("user_coupons")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_order_id: order_id || null,
        used_amount: used_amount || c.discount_amount,
      })
      .eq("id", coupon_id);
    if (e2) return Response.json({ error: e2.message }, { status: 500 });

    return Response.json({ success: true, discount_amount: c.discount_amount });
  } catch (err: any) {
    return Response.json({ error: err.message || "쿠폰 사용 실패" }, { status: 500 });
  }
}
