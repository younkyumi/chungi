import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return Response.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ coupons: data });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "쿠폰 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, code, name, discount_amount, min_price, target_service, expires_at } =
      await request.json();

    if (!user_id || !code || !name || discount_amount === undefined || !expires_at) {
      return Response.json(
        { error: "필수 항목이 누락되었습니다. (user_id, code, name, discount_amount, expires_at)" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("user_coupons")
      .insert({
        user_id,
        code,
        name,
        discount_amount,
        min_price: min_price ?? 0,
        target_service: target_service ?? "all",
        is_used: false,
        expires_at,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ coupon: data }, { status: 201 });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "쿠폰 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
