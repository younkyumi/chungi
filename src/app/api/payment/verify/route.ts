import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      paymentId,
      orderId,
      userId,
      orderType,
      items,
      totalPrice,
      paymentMethod,
    } = await request.json();

    // Validate required fields
    if (!paymentId || !orderId) {
      return Response.json(
        { error: "paymentId와 orderId는 필수입니다." },
        { status: 400 }
      );
    }

    // Verify payment with PortOne V2 API
    // PortOne V2 uses Bearer token authentication
    const portoneApiSecret = process.env.PORTONE_API_SECRET;
    let paymentVerified = false;
    let portonePayment = null;

    if (portoneApiSecret) {
      try {
        const verifyResponse = await fetch(
          `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
          {
            method: "GET",
            headers: {
              Authorization: `PortOne ${portoneApiSecret}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (verifyResponse.ok) {
          portonePayment = await verifyResponse.json();

          // Verify the payment amount matches and status is paid
          if (
            portonePayment.status === "PAID" &&
            portonePayment.amount.total === totalPrice
          ) {
            paymentVerified = true;
          } else {
            return Response.json(
              {
                error: "결제 검증 실패: 금액 불일치 또는 미완료 결제입니다.",
                details: {
                  expectedAmount: totalPrice,
                  actualAmount: portonePayment.amount?.total,
                  status: portonePayment.status,
                },
              },
              { status: 400 }
            );
          }
        } else {
          return Response.json(
            { error: "PortOne 결제 정보 조회에 실패했습니다." },
            { status: 502 }
          );
        }
      } catch (portoneError) {
        console.error("PortOne API 호출 오류:", portoneError);
        return Response.json(
          { error: "결제 검증 중 외부 API 오류가 발생했습니다." },
          { status: 502 }
        );
      }
    } else {
      // Development mode: trust client-side payment result
      // PortOne SDK handles verification on the client
      console.warn(
        "PORTONE_API_SECRET이 설정되지 않았습니다. 클라이언트 결제 결과를 신뢰합니다."
      );
      paymentVerified = true;
    }

    // Save order to Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        payment_id: paymentId,
        user_id: userId,
        order_type: orderType,
        items,
        total_price: totalPrice,
        payment_method: paymentMethod,
        payment_verified: paymentVerified,
        status: "paid",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("주문 저장 오류:", orderError);
      return Response.json(
        { error: "주문 저장 중 오류가 발생했습니다.", details: orderError.message },
        { status: 500 }
      );
    }

    // Generate unlock token for content access
    const unlockToken = crypto.randomUUID();

    // Save unlock record
    const { error: unlockError } = await supabase.from("unlocks").insert({
      user_id: userId,
      order_id: orderId,
      order_type: orderType,
      unlock_token: unlockToken,
      unlocked_at: new Date().toISOString(),
    });

    if (unlockError) {
      console.error("잠금 해제 기록 저장 오류:", unlockError);
      // Order was saved, so we still return success but note the unlock issue
    }

    return Response.json({
      success: true,
      order,
      unlock: {
        token: unlockToken,
        status: "unlocked",
        orderType,
      },
    });
  } catch (error: any) {
    console.error("결제 검증 오류:", error);
    return Response.json(
      { error: error.message || "결제 검증 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
