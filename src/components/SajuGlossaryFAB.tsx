"use client";
// v686: 용어 풀이 FAB — 페이지 하단 동동 떠 있는 박스 (천기봇 자리)
// v692: "사주 용어 풀이" → "용어 풀이" 로 범용화. 사주·타로·관상·손금·꿈해몽 통합.
// v693: "🎯 천기용어풀이" 브랜딩 — 사용자 "그냥 용어말구 천기용어풀이 어때? 전체 아우르는거"

import { useState, useEffect } from "react";
import { SAJU_GLOSS, SAJU_GLOSS_CATEGORIES } from "@/lib/saju-gloss";

export default function SajuGlossaryFAB() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const h = localStorage.getItem("chungi_gloss_hidden");
      if (h === "1") setHidden(true);
    } catch {}
  }, []);

  if (!mounted) return null;
  if (hidden) {
    // 숨김 상태: 우측 하단에 작은 ❔ 다시 보기 아이콘
    return (
      <button
        onClick={() => { setHidden(false); try { localStorage.removeItem("chungi_gloss_hidden"); } catch {} }}
        style={{
          position: "fixed", bottom: 78, right: 14, zIndex: 10001,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(212,175,55,0.6)", color: "#1A2620",
          border: "none", fontSize: 16, fontWeight: 900,
          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          fontFamily: "inherit",
        }}
        title="천기용어풀이 다시 보기"
      >🎯</button>
    );
  }

  const onHide = () => {
    setHidden(true);
    setOpen(false);
    try { localStorage.setItem("chungi_gloss_hidden", "1"); } catch {}
  };

  return (
    <>
      {/* 닫힌 상태: 우측 하단 2단 알약 버튼. v701-r 사용자 \"오른쪽 하단에 모든 페이지 위에 존재하기\"
          대나무숲 ✏️ FAB(bottom:92,right:20)와 세로 위치 차이로 충돌 X. z-index 10001 (모달 9999 위) */}
      {/* v693: 가독성 ↑ — 메인 라벨 큼지막 + 보조 라벨(사주·타로·관상…) 작게 + 양옆 이모지 강조 */}
      {!open && (
        <div style={{ position: "fixed", bottom: 78, right: 14, zIndex: 10001, display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              background: "linear-gradient(135deg,#E8C87A 0%,#D4AF37 50%,#B8942E 100%)",
              color: "#fff",
              padding: "8px 14px 9px", borderRadius: 22,
              border: "1.5px solid rgba(255,255,255,0.35)", cursor: "pointer",
              boxShadow: "0 6px 18px rgba(212,175,55,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
              fontFamily: "inherit", letterSpacing: 0.2,
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1,
              minWidth: 138,
            }}
            title="천기용어풀이 — 사주·타로·관상·손금·꿈해몽 용어 한 곳에 모음"
          >
            <span style={{
              fontSize: 13, fontWeight: 900,
              display: "flex", alignItems: "center", gap: 5,
              textShadow: "0 1px 2px rgba(0,0,0,0.25)",
              lineHeight: 1.1,
            }}>
              <span style={{ fontSize: 14 }}>🎯</span>
              <span>천기용어풀이</span>
              <span style={{ fontSize: 11, opacity: 0.85 }}>📖</span>
            </span>
            <span style={{
              fontSize: 8.5, fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: 0.3,
              lineHeight: 1, paddingLeft: 19,
            }}>사주·타로·관상·손금·꿈해몽</span>
          </button>
          <button
            onClick={onHide}
            style={{
              background: "rgba(0,0,0,0.55)", color: "#fff",
              border: "none", borderRadius: "50%",
              width: 22, height: 22,
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              fontFamily: "inherit", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            title="숨기기"
          >✕</button>
        </div>
      )}

      {/* 펼친 상태: 화면 하단 박스 (위로 슬라이드) */}
      {open && (
        <>
          {/* 백드롭 — 터치 시 닫힘 */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 9998 }}
          />
          <div
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              zIndex: 9999,
              maxHeight: "75vh", overflow: "auto",
              background: "linear-gradient(180deg,#1A2620,#0d1614)",
              borderTop: "2px solid #D4AF37",
              borderRadius: "16px 16px 0 0",
              padding: "16px 18px 24px",
              boxShadow: "0 -8px 30px rgba(0,0,0,0.5)",
              color: "#fff",
            }}
          >
            {/* 헤더 — v708-r: sticky 상단 고정 (사용자 \"스크롤 내려도 X 버튼 계속 보이게\") */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(212,175,55,0.2)", position: "sticky", top: -16, marginTop: -16, marginLeft: -18, marginRight: -18, paddingTop: 16, paddingLeft: 18, paddingRight: 18, background: "linear-gradient(180deg,#1A2620 0%,#1A2620 88%,rgba(26,38,32,0.95) 100%)", zIndex: 2 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#D4AF37", fontFamily: "'Noto Serif KR','Batang',serif" }}>🎯 천기용어풀이</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={onHide}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}
                  title="앞으로 숨기기"
                >숨기기 →</button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}
                >✕</button>
              </div>
            </div>

            {/* 안내 */}
            <div style={{ fontSize: 11, color: "rgba(168,196,184,0.7)", lineHeight: 1.6, marginBottom: 14, padding: "8px 11px", background: "rgba(212,175,55,0.06)", borderRadius: 8, border: "1px solid rgba(212,175,55,0.15)" }}>
              💡 결과를 읽다가 어려운 단어가 나오면 여기서 찾아보세요. <strong style={{color:"#D4AF37"}}>사주·타로·관상·손금·꿈해몽</strong> 용어를 한 곳에서 정리. 화면 어디서든 좌측 하단 🎯 버튼으로 다시 열 수 있어요.
            </div>

            {/* 카테고리별 용어 */}
            {SAJU_GLOSS_CATEGORIES.map(cat => (
              <div key={cat.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#E8C87A", marginBottom: 8, letterSpacing: 0.3 }}>{cat.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                  {cat.items.map((term: string) => {
                    const desc = SAJU_GLOSS[term] || term;
                    // v701-r: 중첩 괄호 지원 — 외곽 첫 \"(\" 부터 가장 바깥 \")\" 까지 모두 본문으로 (\"불꿈(火 ... 길몽(번창), 꺼지면 흉)\" 같은 케이스)
                    const oi = desc.indexOf("(");
                    const ci = desc.lastIndexOf(")");
                    const head = oi > 0 ? desc.slice(0, oi).trim() : term;
                    const body = (oi > 0 && ci > oi) ? desc.slice(oi + 1, ci).trim() : desc;
                    return (
                      <div key={term} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{head}</div>
                        <div style={{ fontSize: 10.5, color: "rgba(220,232,226,0.75)", lineHeight: 1.55 }}>{body}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ fontSize: 9, color: "rgba(168,196,184,0.4)", textAlign: "center", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              ✨ 더 자세한 풀이는 각 콘텐츠(사주풀이·타로·관상·손금)의 결과 페이지에서 확인할 수 있어요.
            </div>
          </div>
        </>
      )}
    </>
  );
}
