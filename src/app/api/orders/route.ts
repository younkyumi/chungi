import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      items,
      total_price,
      payment_method,
      user_id,
      discount,
      coupon_id,
    } = await request.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: "주문 상품 목록이 필요합니다." },
        { status: 400 }
      );
    }

    if (!total_price || total_price <= 0) {
      return Response.json(
        { error: "유효한 결제 금액이 필요합니다." },
        { status: 400 }
      );
    }

    if (!user_id) {
      return Response.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // Validate each item structure
    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.qty) {
        return Response.json(
          {
            error:
              "각 상품에는 id, name, price, qty가 포함되어야 합니다.",
          },
          { status: 400 }
        );
      }
    }

    // Calculate expected total for verification
    const calculatedTotal = items.reduce(
      (sum: number, item: { price: number; qty: number }) =>
        sum + item.price * item.qty,
      0
    );
    const discountAmount = discount || 0;
    const expectedTotal = calculatedTotal - discountAmount;

    if (Math.abs(expectedTotal - total_price) > 1) {
      return Response.json(
        {
          error: "결제 금액이 상품 합계와 일치하지 않습니다.",
          details: { calculatedTotal, discountAmount, expectedTotal, total_price },
        },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Save order to Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_id,
        items,
        total_price,
        discount: discountAmount,
        coupon_id: coupon_id || null,
        payment_method,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("주문 생성 오류:", orderError);
      return Response.json(
        { error: "주문 생성 중 오류가 발생했습니다.", details: orderError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      order,
      orderId,
    });
  } catch (error: any) {
    console.error("주문 처리 오류:", error);
    return Response.json(
      { error: error.message || "주문 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Query orders from Supabase
    const { data: orders, error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("주문 조회 오류:", error);
      return Response.json(
        { error: "주문 내역 조회 중 오류가 발생했습니다.", details: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error: any) {
    console.error("주문 조회 오류:", error);
    return Response.json(
      { error: error.message || "주문 내역 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
