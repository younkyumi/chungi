// v(2026-07-09): 결제/캐시 차감 시점 안전망.
// 문제: 기존엔 "결제하기" 버튼 클릭 즉시 티켓/쿠폰/캐시를 차감했는데, 그 직후 AI 분석이 실패해도
// 환불 로직이 전혀 없어 사용자의 실질 가치(캐시/쿠폰/이용권)가 그냥 소실됐음.
// 원칙: 우리가 직접 통제하는 화폐(캐시/쿠폰/이용권)는 "AI 분석 성공이 확인된 시점"에만 차감을 확정한다.
// (PortOne 실제 결제는 이 파일과 무관 — pre-auth/capture/void는 결제사 pre-auth API 연동 시 별도 처리)
export type PaymentDeductionIntent = {
  useTicket: boolean;
  svcId?: string;
  selectedCoupon?: { code: string; id?: string } | null;
  couponDiscount?: number;
  cashDiscount?: number;
};

// 분석 성공이 확인된 시점에 호출 — 실패 시에는 절대 호출하지 말 것 (호출 안 하면 아무것도 차감 안 됨 = 자동 환불 효과)
export async function commitPaymentDeduction(intent: PaymentDeductionIntent | null | undefined): Promise<void> {
  if (!intent) return;
  const { useTicket, svcId, selectedCoupon, couponDiscount = 0, cashDiscount = 0 } = intent;

  // 이용권 사용 시 쿠폰/캐시는 함께 안 씀 (기존 PayStepComp 즉시차감 로직과 동일한 우선순위)
  if (useTicket && svcId) {
    try {
      const tk = JSON.parse(localStorage.getItem("chungi_my_tickets") || "[]");
      const idx = tk.findIndex((t: { svcId?: string; used?: boolean }) => t.svcId === svcId && !t.used);
      if (idx >= 0) tk[idx].used = true;
      localStorage.setItem("chungi_my_tickets", JSON.stringify(tk));
    } catch {}
    return;
  }

  if (selectedCoupon) {
    try {
      const cps = JSON.parse(localStorage.getItem("chungi_coupons") || "[]");
      const idx = cps.findIndex((c: { code?: string; used?: boolean }) => c.code === selectedCoupon.code && !c.used);
      if (idx >= 0) { cps[idx].used = true; cps[idx].used_at = new Date().toISOString(); localStorage.setItem("chungi_coupons", JSON.stringify(cps)); }
    } catch {}
    try {
      const userId = (typeof window !== "undefined" && localStorage.getItem("chungi_user_id")) || null;
      if (userId && selectedCoupon.id) {
        await fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: userId, coupon_id: selectedCoupon.id, order_id: `order_${Date.now()}`, used_amount: couponDiscount }) });
      }
    } catch {}
  }

  if (cashDiscount > 0) {
    try {
      // 차감을 나중에 확정하므로 컴포넌트 mount 시점 스냅샷이 아닌, 커밋 시점의 최신 잔액을 다시 읽어야 함
      const curBalance = parseInt(localStorage.getItem("chungi_cash_balance") || "0") || 0;
      const newBal = Math.max(0, curBalance - cashDiscount);
      localStorage.setItem("chungi_cash_balance", String(newBal));
    } catch {}
  }
}
