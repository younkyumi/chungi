import { useState, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";
const ACCENT = "#ef4444";

const SAVED_PERSONS = [
  { id: 1, name: "○ (본인)", tag: "본인", birth: "2026-04-30 · 양력 · 여 · 시간미입력", avatar: "🔴" },
  { id: 2, name: "김진순", tag: "관상짤", birth: "undefined · 양력 · undefined · 시간미입력", avatar: "⚪" },
  { id: 3, name: "ㄷㄷ", tag: "관상짤", birth: "undefined · 양력 · undefined · 시간미입력", avatar: "⚪" },
  { id: 4, name: "윤규미", tag: "본인", birth: " · 양력 · 여 · 시간미입력", avatar: "🔴" },
];

// ─────────────────────────────────────────
// Step 1. 설명 팝업
// ─────────────────────────────────────────
function IntroStep({ onNext, onClose }) {
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 16px 0" }}>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ textAlign: "center", padding: "0 20px 16px" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>💑</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: ACCENT, margin: "0 0 6px" }}>커플 관상 궁합</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>우리는 천생연분일까? 애정 궁합 · 1,980원</p>
      </div>
      <div style={{ margin: "0 16px 16px", borderRadius: 14, overflow: "hidden", background: "#000", border: `1px solid rgba(239,68,68,0.3)` }}>
        <div style={{ background: `linear-gradient(90deg,${DG},#0a1a10)`, padding: "6px 12px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
          <span style={{ fontSize: 9, color: G, letterSpacing: 2 }}>CHUNGI_AI v2.0</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>AI_SCANNING... [OK]</span>
        </div>
        <div style={{ height: 160, background: "linear-gradient(135deg,#1a0a0a,#0a0a1a)", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.2)", border: "2px solid rgba(239,68,68,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
          <div style={{ fontSize: 22, color: ACCENT }}>❤️</div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.2)", border: "2px solid rgba(239,68,68,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
        </div>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        {[
          { icon: "❤️", label: "천생연분 지수", desc: "두 관상의 에너지 싱크로율" },
          { icon: "✨", label: "전생 인연 분석", desc: "전생에서 어떤 관계였는지" },
          { icon: "💥", label: "갈등 패턴", desc: "왜 자꾸 부딪히는지 이유" },
          { icon: "🔮", label: "미래 흐름", desc: "함께할 때 더 빛나는 운세" },
          { icon: "🌿", label: "개운 아이템", desc: "두 분의 기운을 높이는 방법" },
          { icon: "🌈", label: "RAINBOW 인증서", desc: "빨강 인증서 발급" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#F0EAD6", margin: "0 0 1px" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>{item.desc}</p>
            </div>
            <span style={{ fontSize: 9, color: ACCENT, padding: "2px 8px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)" }}>분석</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>두 분의 사진을 올리면 AI가 관상 에너지를 분석해드려요.<br /><span style={{ color: G }}>업로드된 사진은 분석 즉시 삭제됩니다.</span></p>
        </div>
        <button onClick={onNext} style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${ACCENT},#dc2626)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>시작하기 →</button>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>닫기</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 2 & 3. 인물 선택
// ─────────────────────────────────────────
function PersonSelectStep({ personIndex, selectedFirst, onSelect, onClose }) {
  const isFirst = personIndex === 1;
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 16px 16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>💑</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>
              {isFirst ? "누구와 누구의 커플 궁합을 볼까요?" : "두 번째 인물을 선택하세요"}
            </h3>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            {isFirst ? "두 명을 순서대로 선택합니다" : `✓ ${selectedFirst?.name} 선택됨 → 상대방을 선택하세요`}
          </p>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", flexShrink: 0 }}>✕</button>
      </div>
      <div style={{ padding: "0 16px" }}>
        {SAVED_PERSONS.map(person => {
          const isDisabled = !isFirst && selectedFirst?.id === person.id;
          return (
            <button key={person.id} onClick={() => !isDisabled && onSelect(person)} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, background: isDisabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: `1px solid ${isDisabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)"}`, borderRadius: 14, cursor: isDisabled ? "not-allowed" : "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12, opacity: isDisabled ? 0.4 : 1, transition: "0.15s" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: person.avatar === "🔴" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)", border: `2px solid ${person.avatar === "🔴" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0EAD6" }}>{person.name}</span>
                  <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 10, background: person.tag === "본인" ? "rgba(239,68,68,0.2)" : "rgba(232,200,122,0.15)", color: person.tag === "본인" ? "#fca5a5" : G, border: `1px solid ${person.tag === "본인" ? "rgba(239,68,68,0.3)" : "rgba(232,200,122,0.3)"}` }}>{person.tag}</span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.birth}</p>
              </div>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>›</span>
            </button>
          );
        })}
        <button style={{ width: "100%", padding: "14px 16px", marginBottom: 16, background: "transparent", border: `1px dashed rgba(232,200,122,0.3)`, borderRadius: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: G, fontSize: 13, fontWeight: 600 }}>
          <span style={{ fontSize: 18 }}>＋</span> 새 인물 추가하고 시작
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>취소</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 4. 사진 업로드
// ─────────────────────────────────────────
function PhotoUploadStep({ person1, person2, onNext, onClose }) {
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const ref1 = useRef();
  const ref2 = useRef();
  const canProceed = photo1 && photo2 && agreed;

  function handleFile(file, setter) {
    if (!file) return;
    setter(URL.createObjectURL(file));
  }

  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 18 }}>💑</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>커플 관상 궁합</h3>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>우리는 천생연분일까? · 1,980원</p>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ padding: "0 16px" }}>
        {/* 선택된 인물 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[person1, person2].map((p, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 3px" }}>{i === 0 ? "첫 번째" : "두 번째"}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5", margin: 0 }}>· {p?.name}</p>
            </div>
          ))}
        </div>

        {/* 동의 체크 */}
        <button onClick={() => setAgreed(v => !v)} style={{ width: "100%", padding: "12px 14px", marginBottom: 14, background: agreed ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${agreed ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, background: agreed ? ACCENT : "transparent", border: `2px solid ${agreed ? ACCENT : "rgba(255,255,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {agreed && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            사진 속 인물의 <span style={{ color: ACCENT }}>동의를 받았으며</span>, 본 분석은 <span style={{ color: ACCENT }}>재미용</span>임을 이해합니다. 결과를 실제 인간관계 판단에 사용하지 않겠습니다.
          </p>
        </button>

        {/* 사진 가이드 */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: G, fontWeight: 600, margin: "0 0 8px" }}>📸 정확한 분석을 위한 사진 가이드</p>
          {["1명만 나온 정면 사진", "밝은 조명, 선명한 화질"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{t}</span>
            </div>
          ))}
          {["선글라스·마스크·과도한 필터 금지", "단체사진·아기·그림/캐릭터 불가"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#f87171", fontSize: 11 }}>✗</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{t}</span>
            </div>
          ))}
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "8px 0 0", lineHeight: 1.6 }}>
            🔒 업로드된 사진은 분석 즉시 삭제되며, 서버에 저장되지 않습니다.
          </p>
        </div>

        {/* 사진 업로드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: person1?.name || "첫 번째", photo: photo1, setter: setPhoto1, ref: ref1 },
            { label: person2?.name || "두 번째", photo: photo2, setter: setPhoto2, ref: ref2 },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontSize: 11, color: G, fontWeight: 600, margin: "0 0 6px" }}>📸 {item.label}</p>
              <input type="file" accept="image/*" ref={item.ref} onChange={e => handleFile(e.target.files[0], item.setter)} style={{ display: "none" }} />
              <button onClick={() => item.ref.current?.click()} style={{ width: "100%", aspectRatio: "1", padding: 0, background: item.photo ? "transparent" : "rgba(255,255,255,0.04)", border: `2px dashed ${item.photo ? "transparent" : "rgba(255,255,255,0.15)"}`, borderRadius: 12, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                {item.photo ? <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <><span style={{ fontSize: 28, opacity: 0.4 }}>📷</span><span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>사진 올리기</span></>}
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => canProceed && onNext()} style={{ width: "100%", padding: "16px", marginBottom: 8, background: canProceed ? `linear-gradient(135deg,${ACCENT},#dc2626)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: canProceed ? "#fff" : "rgba(255,255,255,0.3)", cursor: canProceed ? "pointer" : "default", fontFamily: "inherit", transition: "0.2s" }}>
          커플 궁합 분석하기 (1,980원) →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>취소</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 5. 사전질문
// ─────────────────────────────────────────
function QuestionStep({ onNext, onClose }) {
  const [qStep, setQStep] = useState(1);
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState([]);
  const q1Opts = [
    { emoji: "🌱", label: "썸타는 중" }, { emoji: "💕", label: "연애 중 (1년 미만)" },
    { emoji: "💑", label: "연애 중 (1년 이상)" }, { emoji: "💍", label: "결혼 고려 중" },
    { emoji: "💒", label: "부부" }, { emoji: "👀", label: "짝사랑 (아직 모름)" }, { emoji: "💭", label: "기타" },
  ];
  const q2Opts = [
    { emoji: "❤️", label: "우리 잘 될까" }, { emoji: "💥", label: "왜 자꾸 싸울까" },
    { emoji: "💰", label: "경제관념·씀씀이 맞을까" }, { emoji: "🏠", label: "같이 살면 어떨까" },
    { emoji: "👶", label: "아이를 낳으면 어떨까" }, { emoji: "🔮", label: "전생에 어떤 인연이었을까" },
    { emoji: "🌟", label: "전체 다 궁금해요!" }, { emoji: "💭", label: "기타" },
  ];
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} /></div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>💑 커플 관상 궁합</h3>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>✕</button>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>{qStep}/2</p>
        <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 20 }}>
          <div style={{ height: "100%", width: `${qStep * 50}%`, background: ACCENT, borderRadius: 2, transition: "0.3s" }} />
        </div>
        {qStep === 1 && (<>
          <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT, margin: "0 0 12px" }}>두 사람의 관계는?</p>
          {q1Opts.map(opt => (
            <button key={opt.label} onClick={() => setQ1(opt.label)} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, background: q1 === opt.label ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${q1 === opt.label ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: q1 === opt.label ? "#fca5a5" : "rgba(255,255,255,0.7)", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "0.15s" }}>
              <span>{opt.emoji}</span> {opt.label} {q1 === opt.label && <span style={{ marginLeft: "auto", color: ACCENT }}>✓</span>}
            </button>
          ))}
          <button onClick={() => q1 && setQStep(2)} style={{ width: "100%", padding: "15px", marginTop: 8, background: q1 ? `linear-gradient(135deg,${G},#C4922A)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, color: q1 ? "#0D0D14" : "rgba(255,255,255,0.3)", cursor: q1 ? "pointer" : "default", fontFamily: "inherit" }}>다음 →</button>
        </>)}
        {qStep === 2 && (<>
          <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT, margin: "0 0 4px" }}>가장 궁금한 건?</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요</p>
          {q2Opts.map(opt => (
            <button key={opt.label} onClick={() => setQ2(prev => prev.includes(opt.label) ? prev.filter(v => v !== opt.label) : [...prev, opt.label])} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, background: q2.includes(opt.label) ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${q2.includes(opt.label) ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: q2.includes(opt.label) ? "#fca5a5" : "rgba(255,255,255,0.7)", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "0.15s" }}>
              <span>{opt.emoji}</span><span style={{ flex: 1 }}>{opt.label}</span>
              <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: q2.includes(opt.label) ? ACCENT : "transparent", border: `2px solid ${q2.includes(opt.label) ? ACCENT : "rgba(255,255,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {q2.includes(opt.label) && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
              </div>
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setQStep(1)} style={{ flex: 1, padding: "15px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>← 이전</button>
            <button onClick={() => q2.length > 0 && onNext({ q1, q2 })} style={{ flex: 2, padding: "15px", background: q2.length > 0 ? `linear-gradient(135deg,${G},#C4922A)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, color: q2.length > 0 ? "#0D0D14" : "rgba(255,255,255,0.3)", cursor: q2.length > 0 ? "pointer" : "default", fontFamily: "inherit" }}>분석 시작 →</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 6. 결제
// ─────────────────────────────────────────
function PaymentStep({ onNext, onClose }) {
  const [method, setMethod] = useState("kakao");
  const methods = [{ key: "kakao", label: "카카오페이", sub: "원터치 간편결제" }, { key: "toss", label: "토스페이", sub: "간편결제" }, { key: "naver", label: "네이버페이", sub: "포인트 적립" }, { key: "card", label: "카드결제", sub: "신용/체크카드" }, { key: "phone", label: "핸드폰 결제", sub: "통신사 결제" }];
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>결제하기</h3>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>💰 보유 캐시</p><p style={{ fontSize: 18, fontWeight: 700, color: G, margin: 0 }}>2,000원</p></div>
          <button style={{ padding: "8px 14px", background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#0D0D14", cursor: "pointer" }}>캐시 사용</button>
        </div>
        {[{ icon: "🎫", label: "쿠폰 (0장)" }, { icon: "🎟️", label: "이용권 (0장)" }].map(item => (
          <div key={item.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>{item.icon} {item.label}</p><p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>눌러서 목록 보기</p></div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>›</span>
          </div>
        ))}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>상품 가격</span><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>1,980원</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#F0EAD6" }}>결제 금액</span><span style={{ fontSize: 14, fontWeight: 700, color: G }}>1,980원</span></div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 10px", fontWeight: 600 }}>🔐 결제 수단</p>
        {methods.map(m => (
          <button key={m.key} onClick={() => setMethod(m.key)} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, background: method === m.key ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${method === m.key ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "0.15s" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: method === m.key ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {method === m.key && <div style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT }} />}
            </div>
            <div><p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 1px" }}>{m.label}</p><p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{m.sub}</p></div>
          </button>
        ))}
        <button onClick={onNext} style={{ width: "100%", padding: "16px", marginTop: 8, background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#0D0D14", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>1,980원 결제하기 →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 7. 결과 (다크그린 배경 full scroll)
// ─────────────────────────────────────────
const TABS = [
  { key: "total", label: "총운" }, { key: "person1", label: "규미님" },
  { key: "person2", label: "진순님" }, { key: "harmony", label: "합" },
  { key: "fight", label: "갈등" }, { key: "future", label: "미래" }, { key: "talisman", label: "개운" },
];
const CONTENT = {
  total: { score: 82, grade: "A", rank: "상위 18%", title: "운명이 엮어준 두 사람", subtitle: "전생부터 이어진 인연, 이번 생에서 꽃피우다", good: "넓은 이마 × 올라간 눈꼬리\n직관 + 추진력의 황금 조합", bad: "두 사람 모두 자기 주장 강함\n의견 충돌 주의", body: `규미님과 진순님, 두 분의 관상을 처음 마주하는 순간 — 마치 봄볕이 내리쬐는 창가에 놓인 두 개의 화분처럼, 서로 다른 방향으로 자라면서도 같은 빛을 향해 기울어져 있는 기운이 느껴졌습니다.\n\n두 분의 눈매에서 읽히는 에너지는 전통 관상학에서 '화기상통(和氣相通)'이라 부르는 형상입니다. 서로의 기운이 만났을 때 어느 한쪽이 눌리거나 사라지는 것이 아니라, 오히려 더 선명하게 살아나는 — 그런 드문 궁합이에요.\n\n진순님의 눈꼬리가 살짝 올라가는 형은 추진력과 열정의 상징이고, 규미님의 이마가 넓고 맑은 형은 직관과 포용의 기운을 담고 있어요. 이 두 기운이 만나면 서로의 빈틈을 자연스럽게 채우는 '상보지상(相補之相)'이 완성됩니다.\n\n연애 1년 미만이라는 지금, 처음 만났을 때부터 오래된 사람처럼 편안했다면 그건 우연이 아니에요. 전생에서 이미 깊이 연결되어 있던 인연이 이번 생에서 다시 이어진 것입니다.` },
  person1: { score: null, grade: null, rank: null, title: "규미님 관상 분석", subtitle: "넓은 이마에 담긴 직관과 포용의 기운", good: "맑은 눈빛 · 직관력 탁월\n처음 만난 사람도 금방 편안하게", bad: "너무 많이 배려하다 지칠 수 있음\n감정 표현 타이밍 주의", body: `규미님의 관상에서 가장 먼저 눈에 들어오는 것은 이마의 형태입니다. 넓고 둥글게 펼쳐진 이마는 관상학에서 '천정(天庭)'이라 부르는 영역으로, 직관력과 선견지명이 뛰어난 형상이에요.\n\n눈은 전체적으로 맑고 광채가 있는 형으로, 감수성이 풍부하고 상대방의 감정을 빠르게 읽어내는 능력이 있습니다. 연애에서도 먼저 상대의 기분을 챙기는 편이에요. 그 따뜻함이 진순님이 곁을 떠나지 못하는 이유이기도 합니다.\n\n코의 형태는 재물궁이 안정적인 형상으로, 감정에 흔들리면서도 현실 감각을 잃지 않는 균형감이 있습니다. 연애와 현실 사이에서 균형을 잡을 줄 아는 매우 드문 기질이에요.` },
  person2: { score: null, grade: null, rank: null, title: "진순님 관상 분석", subtitle: "올라간 눈꼬리에 담긴 추진력과 열정의 기운", good: "강한 추진력 · 목표를 향한 끈기\n한 번 선택한 관계는 끝까지", bad: "결론을 빨리 내려는 성향\n감정 처리 속도 차이 주의", body: `진순님의 관상에서 가장 강하게 읽히는 기운은 눈꼬리의 각도에서 시작됩니다. 살짝 올라가는 눈꼬리는 관상학에서 '위엄목(威嚴目)'의 특징으로, 한 번 목표를 정하면 끝까지 밀어붙이는 강한 추진력을 상징합니다.\n\n광대뼈가 적당히 발달한 형은 사회성과 인복(人福)의 상징입니다. 어디서든 중심이 되는 기운이 있고, 만난 지 얼마 안 됐는데도 오래된 친구처럼 편안하게 느껴지게 만드는 따뜻함이 있어요.\n\n턱의 형태는 끈기와 책임감의 자리입니다. 한 번 선택한 관계는 쉽게 포기하지 않는 성향이 강하게 보여요. 진순님과 함께한다면 '이 사람은 내 곁에 있겠구나' 하는 안정감을 느낄 수 있을 거예요.` },
  harmony: { score: 88, grade: "A+", rank: "상위 8%", title: "두 관상의 합", subtitle: "퍼즐 조각처럼 맞춰지는 에너지 구조", good: "서로의 빈틈을 완벽하게 채우는\n상보지상(相補之相) 구조", bad: "속도 차이로 오해 생기기 쉬움\n감정 처리 방식이 다름", body: `두 분의 관상을 나란히 놓고 보면, 마치 퍼즐 조각이 맞춰지듯 서로의 부족한 부분을 정확하게 채우는 구조가 보입니다.\n\n규미님의 넓은 이마(직관·포용)와 진순님의 올라간 눈꼬리(추진력·결단력) — 이 조합은 전통 관상학에서 '지정쌍합(智情雙合)'이라 부릅니다. 한 사람은 깊이 느끼고, 한 사람은 빠르게 행동하는 두 에너지가 균형을 이루면 어떤 상황에서도 함께 헤쳐나갈 수 있어요.\n\n'이 사람은 나와 달라서 답답해'라고 느낀 적 있으신가요? 관상학적으로 보면 그 다름이 오히려 두 분이 서로에게 꼭 필요한 이유예요.` },
  fight: { score: 65, grade: "B", rank: "평균", title: "갈등 패턴 & 해결법", subtitle: "왜 자꾸 싸울까 — 관상으로 읽은 이유", good: "갈등 후 더 깊어지는 관계\n빠른 화해가 가능한 에너지", bad: "'내가 맞아' 동시 폭발\n자존심 싸움 주의", body: `'왜 자꾸 싸울까'를 궁금해하셨죠? 관상을 보면 그 이유가 선명하게 읽힙니다.\n\n두 분의 눈썹 형태를 보면, 각자 자신만의 원칙과 기준이 강한 형상입니다. 의견이 충돌할 때 "내가 맞아"라는 확신이 동시에 폭발하는 순간이 찾아와요.\n\n진순님은 빠르게 결론을 내려고 하는 편이고, 규미님은 충분히 감정을 이야기한 후 정리되기를 원하는 편입니다. 이 속도 차이가 오해를 만들어요.\n\n✨ 해결 처방전 — "나는 지금 해결하고 싶은 거야, 상처 주려는 게 아니야"라고 먼저 말해주세요. '이기려는 싸움'을 '이해하려는 대화'로 전환하는 연습이 필요해요.` },
  future: { score: 79, grade: "A-", rank: "상위 22%", title: "앞으로의 흐름", subtitle: "시간이 지날수록 더 빛나는 관계", good: "2026년 하반기 두 분 모두 성장 기운\n함께라면 변화가 기회가 됨", bad: "처음 1~2년이 가장 중요한 시기\n서로의 어두운 면을 마주하는 시간", body: `연애 1년 미만이라는 지금, 두 분은 서로를 알아가는 가장 설레는 시간을 보내고 있습니다.\n\n2026년 하반기부터 두 분 모두에게 변화의 기운이 강하게 들어옵니다. 이 시기에 함께라면 변화를 두려워하지 않고 오히려 성장의 발판으로 삼을 수 있어요.\n\n관상에서 가장 중요한 것은 '변하지 않는 운명'이 아니라 '두 사람이 함께 만들어가는 운'이에요. 지금 이 궁합이 82점이라면, 두 분이 서로를 더 이해하고 배려할수록 90점, 100점으로 올라갈 수 있습니다.` },
  talisman: { score: null, grade: null, rank: null, title: "개운법 & 찰떡 아이템", subtitle: "두 분의 오행 기운을 높이는 방법", good: "木生火 — 나무가 불을 키우는\n이상적인 상생 구조", bad: "火 기운 과다 시 충동적 결정\n파란색 아이템으로 균형 맞추기", body: `두 분의 관상 오행 분석 결과, 규미님은 木(목) 기운이 강하고 진순님은 火(화) 기운이 강한 형상입니다.\n\n✨ 두 분에게 추천하는 개운 아이템\n🔵 파란색 또는 흰색 커플 아이템 — 충동적인 갈등을 가라앉히는 기운\n🌿 실내 식물 (초록 잎이 풍성한 것) — 木 기운을 보완해 안정감 UP\n💎 투명하거나 맑은 원석 (수정, 문스톤) — 관계를 맑고 투명하게 유지\n🕯️ 은은한 향초나 아로마 디퓨저 — 함께하는 공간의 기운을 정화\n📅 두 분이 처음 만난 날 기념하는 루틴 — 인연의 에너지를 지속적으로 강화` },
};

function ResultStep({ person1, person2, answers }) {
  const [tab, setTab] = useState("total");
  const [showFull, setShowFull] = useState(false);
  const c = CONTENT[tab];
  const paras = c.body.split("\n\n");
  const isLong = paras.length > 3;
  const visible = showFull || !isLong ? paras : paras.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: DG, padding: "20px 12px 40px", fontFamily: "'Noto Serif KR',serif" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>

        {/* ── 화이트 결과 카드 ── */}
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 12 }}>
          {/* 브랜딩 */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "#9ca3af", letterSpacing: 1, margin: 0 }}>🔮 천기(天機) 오리지널 | 커플 관상 궁합 리포트</p>
          </div>
          {/* 인물 + 점수 */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>💑</span>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{person1?.name || "규미"}님 &amp; {person2?.name || "진순"}님</h2>
              </div>
              <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>커플 관상 궁합</p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{answers?.q1 || "💕 연애 중 (1년 미만)"}</p>
            </div>
            <div style={{ background: "#fff1f2", border: "2px solid #fecaca", borderRadius: 14, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>82</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>점</span>
              </div>
              <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>A등급 · 상위 18%</div>
            </div>
          </div>
          {/* 탭 */}
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", overflowX: "auto", background: "#fafafa" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setShowFull(false); }} style={{ flexShrink: 0, padding: "12px 13px", border: "none", borderBottom: tab === t.key ? `2px solid ${DG}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? DG : "#9ca3af", fontFamily: "inherit", transition: "0.15s" }}>{t.label}</button>
            ))}
          </div>
          {/* 탭 내용 */}
          <div style={{ padding: "18px 16px" }}>
            {c.score && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fafafa", borderRadius: 12, padding: "12px 14px", marginBottom: 16, border: "1px solid #f3f4f6" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff1f2", border: "2px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>{c.grade}</span>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: ACCENT }}>{c.score}</span>
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>점</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{c.rank}</span>
                </div>
              </div>
            )}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{c.title}</h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>{c.subtitle}</p>
            {visible.map((p, i) => <p key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.95, margin: i < visible.length - 1 ? "0 0 14px" : 0 }}>{p}</p>)}
            {isLong && (
              <button onClick={() => setShowFull(v => !v)} style={{ display: "block", width: "100%", padding: "12px 0", marginTop: 12, background: "none", border: "none", borderTop: "1px solid #f3f4f6", fontSize: 12, color: ACCENT, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                {showFull ? "▲ 접기" : "▼ 전체 보기"}
              </button>
            )}
            {/* 찰떡/주의 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
              <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px", border: "1px solid #bbf7d0" }}>
                <p style={{ fontSize: 9, color: "#16a34a", fontWeight: 700, letterSpacing: 1, margin: "0 0 5px" }}>✓ 찰떡 관상</p>
                <p style={{ fontSize: 11, color: "#166534", lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{c.good}</p>
              </div>
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px", border: "1px solid #fecaca" }}>
                <p style={{ fontSize: 9, color: "#dc2626", fontWeight: 700, letterSpacing: 1, margin: "0 0 5px" }}>△ 주의 관상</p>
                <p style={{ fontSize: 11, color: "#991b1b", lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{c.bad}</p>
              </div>
            </div>
          </div>
          {/* 하단 해시태그 */}
          <div style={{ padding: "12px 16px 14px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: "0 0 3px", lineHeight: 1.8 }}>#천기관상 #커플관상궁합 #운명연인 #상위18%</p>
            <p style={{ fontSize: 10, color: "#374151", margin: 0, fontWeight: 600 }}>🌐 천기.kr</p>
          </div>
        </div>

        {/* ── 인증서 카드 (별도) ── */}
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)", padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: 8, letterSpacing: 3, color: "#9f1239", margin: "0 0 2px" }}>CHUNGI ORIGINALS · RAINBOW 🌈</p>
            <p style={{ fontSize: 8, letterSpacing: 2, color: "#be123c", margin: "0 0 14px" }}>— 빨강 인증서 —</p>
            <div style={{ fontSize: 44, marginBottom: 10 }}>💑</div>
            <p style={{ fontSize: 10, color: "#9f1239", margin: "0 0 4px" }}>— THIS COUPLE IS —</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#7f1d1d", margin: "0 0 6px" }}>"💑 운명 연인"</p>
            <p style={{ fontSize: 11, color: "#be123c", margin: "0 0 14px", lineHeight: 1.7 }}>"전생의 약속을 지키러 이번 생에서 다시 만났어요"</p>
            <p style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.8, margin: "0 0 14px" }}>
              규미님과 진순님의 관상에서 읽힌 기운은<br />
              이번 생에서 처음 만난 인연이 아니에요.<br />
              전생에서 이미 깊이 연결되어 있던 두 사람이<br />
              다시 서로를 알아본 것입니다.
            </p>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
              {["#운명연인", "#상위18%", "#상보지상", "#전생인연"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(159,18,57,0.08)", color: "#9f1239", border: "1px solid rgba(159,18,57,0.18)" }}>{t}</span>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #fecdd3", paddingTop: 10 }}>
              <p style={{ fontSize: 8, color: "#be123c", margin: "0 0 2px", letterSpacing: 2 }}>✦ 天機 ORIGINAL · No. 2026-C0042</p>
              <p style={{ fontSize: 8, color: "#9f1239", margin: 0 }}>— 천기(天機) · 관기 —</p>
            </div>
          </div>
        </div>

        {/* ── 다크그린 영역: 공유 + 이것도 해볼래요 + 확인완료 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <button style={{ padding: "13px", background: "#FEE500", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#3c1e1e", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>💬</span> 카카오 공유
          </button>
          <button style={{ padding: "13px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>🔗</span> 링크 복사
          </button>
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "0 0 20px" }}>
          *공유하면 50% 확률로 오늘 하루 더 좋은 기운이 터짐 🌿
        </p>

        {/* 이것도 해볼래요 */}
        <p style={{ fontSize: 11, color: G, fontWeight: 600, margin: "0 0 10px" }}>✦ 이것도 해볼래요?</p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
          {[
            { emoji: "🪞", label: "내 관상보기", price: "980원" },
            { emoji: "👯", label: "베프 궁합", price: "1,980원" },
            { emoji: "💼", label: "비즈니스 궁합", price: "1,980원" },
            { emoji: "🔮", label: "오늘의 타로", price: "무료" },
          ].map(item => (
            <div key={item.label} style={{ minWidth: 80, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 8px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#F0EAD6", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: item.price === "무료" ? "#4ade80" : G }}>{item.price}</div>
            </div>
          ))}
        </div>

        {/* 확인 완료 */}
        <button style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#0D0D14", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
          확인 완료
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 메인 — 7단계 플로우
// ─────────────────────────────────────────
export default function CoupleGwansangFull() {
  const [step, setStep] = useState("intro");
  const [person1, setPerson1] = useState(null);
  const [person2, setPerson2] = useState(null);
  const [answers, setAnswers] = useState(null);

  const Overlay = ({ children }) => (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'Noto Serif KR',serif" }}>
      <div style={{ width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto" }}>{children}</div>
    </div>
  );

  if (step === "intro") return <Overlay><IntroStep onNext={() => setStep("person1")} onClose={() => {}} /></Overlay>;
  if (step === "person1") return <Overlay><PersonSelectStep personIndex={1} selectedFirst={null} onSelect={p => { setPerson1(p); setStep("person2"); }} onClose={() => setStep("intro")} /></Overlay>;
  if (step === "person2") return <Overlay><PersonSelectStep personIndex={2} selectedFirst={person1} onSelect={p => { setPerson2(p); setStep("photo"); }} onClose={() => setStep("intro")} /></Overlay>;
  if (step === "photo") return <Overlay><PhotoUploadStep person1={person1} person2={person2} onNext={() => setStep("question")} onClose={() => setStep("intro")} /></Overlay>;
  if (step === "question") return <Overlay><QuestionStep onNext={ans => { setAnswers(ans); setStep("payment"); }} onClose={() => setStep("intro")} /></Overlay>;
  if (step === "payment") return <Overlay><PaymentStep onNext={() => setStep("result")} onClose={() => setStep("intro")} /></Overlay>;
  if (step === "result") return <ResultStep person1={person1} person2={person2} answers={answers} />;
}
