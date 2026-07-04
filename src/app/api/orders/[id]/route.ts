import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "주문 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // Query single order from Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", id)
      .single();

    if (error) {
      console.error("주문 상세 조회 오류:", error);

      if (error.code === "PGRST116") {
        return Response.json(
          { error: "해당 주문을 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      return Response.json(
        { error: "주문 조회 중 오류가 발생했습니다.", details: error.message },
        { status: 500 }
      );
    }

    // Optionally fetch unlock status for this order
    const { data: unlock } = await supabase
      .from("unlocks")
      .select("*")
      .eq("order_id", id)
      .maybeSingle();

    return Response.json({
      success: true,
      order,
      unlock: unlock || null,
    });
  } catch (error: any) {
    console.error("주문 상세 조회 오류:", error);
    return Response.json(
      { error: error.message || "주문 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
