"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentResult() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const code = searchParams.get("code"); // PortOne returns code param on error
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");

  useEffect(() => {
    if (code) {
      // PortOne redirect with error code means payment failed
      setStatus("fail");
    } else if (paymentId) {
      // TODO: 실제 운영 시 /api/payment/verify 로 서버 검증 후 상태 결정 필요
      // 현재는 paymentId 존재 여부로 간이 판단
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [paymentId, code]);

  return (
    <>
      {status === "loading" && <p>결제 확인 중...</p>}
      {status === "success" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✨</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>결제 완료!</h1>
          <p style={{ fontSize: 13, color: "#A8C4B8", marginBottom: 24 }}>
            결제가 정상적으로 완료되었습니다.
          </p>
          <a href="/" style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "linear-gradient(135deg, #D4AF37, #B8942E)",
            color: "#1A3C32",
            borderRadius: 18,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}>
            홈으로 돌아가기
          </a>
        </div>
      )}
      {status === "fail" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>😔</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>결제 실패</h1>
          <p style={{ fontSize: 13, color: "#A8C4B8", marginBottom: 24 }}>
            결제 처리 중 문제가 발생했습니다.
          </p>
          <a href="/" style={{
            display: "inline-block",
            padding: "12px 24px",
            border: "1px solid rgba(212,175,55,0.25)",
            color: "#D4AF37",
            borderRadius: 18,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}>
            다시 시도하기
          </a>
        </div>
      )}
    </>
  );
}

export default function PaymentComplete() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1A3C32",
      color: "#F4F1E1",
      fontFamily: "'Pretendard', 'Noto Serif KR', sans-serif",
    }}>
      <Suspense fallback={<p>결제 확인 중...</p>}>
        <PaymentResult />
      </Suspense>
    </div>
  );
}
