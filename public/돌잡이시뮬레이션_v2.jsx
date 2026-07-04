import { useState, useEffect, useRef } from "react";

const G = "#E8C87A", DG = "#0D2318";

// ── 아이템 데이터 (20종 기본 + 5종 히든)
const ITEMS = {
  // 기본 16종
  building:  { emoji:"🏢", name:"건물",     headline:"[경제] 2050년 강남 최연소 랜드마크 건물주 등극! \"1살 때부터 떡잎이 달랐다\"",      job:"건물주·사업가·자산가",    saju:"재성(財星) + 土 기운 발달", ohaeng:"土",  color:"#f59e0b" },
  scope:     { emoji:"🔭", name:"측우기",    headline:"[속보] 한국인 최초 노벨 과학상 수상! 세상을 바꾼 천재 발명가의 탄생",            job:"과학자·수학자·발명가",  saju:"편인(偏印) + 천의성",      ohaeng:"水",  color:"#06b6d4" },
  medicine:  { emoji:"🍵", name:"약탕기",    headline:"[사회] 전 세계가 주목하는 명의(名醫), \"어릴 때 잡은 약탕기가 내 운명\"",         job:"의사·한의사·간호사",    saju:"편인(偏印) + 천의성",      ohaeng:"水",  color:"#10b981" },
  brush:     { emoji:"🖌️", name:"붓",       headline:"[문화] 세기의 베스트셀러 작가 등극, 붓끝으로 전 세계를 홀리다",                  job:"학자·작가·교수",        saju:"정인(正印) 발달",          ohaeng:"木",  color:"#8b5cf6" },
  gavel:     { emoji:"⚖️", name:"판사봉",   headline:"[사회] 2050년 가장 신뢰받는 대법관, \"흔들리지 않는 정의의 상징\"",              job:"판사·검사·변호사",      saju:"편관(偏官) + 金 기운",     ohaeng:"金",  color:"#6366f1" },
  coin:      { emoji:"💰", name:"엽전",      headline:"[금융] 월스트리트를 뒤흔든 전설의 투자자, 완벽한 경제적 자유를 이루다",           job:"부자·금융인",           saju:"정재(正財) 발달",          ohaeng:"土",  color:"#f59e0b" },
  itcube:    { emoji:"💻", name:"IT큐브",    headline:"[테크] 실리콘밸리가 주목하는 혁신적 CEO, \"미래를 코딩하는 천재\"",              job:"IT전문가·CEO",          saju:"재성 + 인성 결합",         ohaeng:"金",  color:"#3b82f6" },
  passport:  { emoji:"🛂", name:"여권",      headline:"[국제] 5개국어 능통한 글로벌 리더, 전 세계를 무대로 활약 중!",                  job:"외교관·통역사",         saju:"역마살·지살 강함",         ohaeng:"水",  color:"#0ea5e9" },
  book:      { emoji:"📖", name:"책",        headline:"[교육] 인류를 이롭게 한 시대의 석학, 지혜로 세상을 밝히다",                      job:"학자·작가·교수",        saju:"정인(正印) 발달",          ohaeng:"木",  color:"#84cc16" },
  bow:       { emoji:"🏹", name:"활&화살",   headline:"[사회] 흔들림 없는 용기와 결단력! 국민이 가장 존경하는 제복의 영웅",             job:"경찰·장군·직업군인",    saju:"편관 + 양인살",            ohaeng:"金",  color:"#ef4444" },
  mapa:      { emoji:"🐴", name:"마패",      headline:"[정치] 만인이 우러러보는 청렴한 고위 공직자, 역사에 남을 명예를 쥐다",            job:"대통령·관직·공무원",    saju:"정관(正官) 발달",          ohaeng:"金",  color:"#f97316" },
  needle:    { emoji:"🧵", name:"바늘쌈",    headline:"[라이프] 신의 손을 가진 크리에이터, 전 세계의 트렌드를 주도하다",               job:"디자이너·요리사",        saju:"묘(卯)·유(酉) 글자 있음", ohaeng:"木",  color:"#ec4899" },
  mic:       { emoji:"🎤", name:"마이크",    headline:"[연예] 무대에 서면 180도 돌변! 대중의 마음을 훔치는 최고의 스타",               job:"예술인·아나운서·기자",   saju:"식상 + 도화살 강함",       ohaeng:"火",  color:"#f43f5e" },
  silk:      { emoji:"🧶", name:"명주실",    headline:"[건강] 무병장수의 아이콘, \"스트레스 없이 매일매일이 행복해요!\"",               job:"무병장수 건강복",        saju:"사주 평온·밸런스 좋음",    ohaeng:"土",  color:"#14b8a6" },
  ball:      { emoji:"⚽", name:"공",        headline:"[스포츠] 세계 신기록 경신! 역사를 새로 쓴 스포츠계의 슈퍼스타",                  job:"운동선수",              saju:"비겁(比劫) 강·승부욕",     ohaeng:"木",  color:"#22c55e" },
  oscar:     { emoji:"🏆", name:"오스카상",  headline:"[문화] 칸과 오스카를 동시에 휩쓸다! 세기를 대표하는 천재 영화인",               job:"영화감독·배우·영화인",   saju:"식상 + 火 기운 폭발",      ohaeng:"火",  color:"#eab308" },
  // 추가 4종
  youtube:   { emoji:"▶️", name:"골드버튼",  headline:"[IT/미디어] 구독자 1억 명 돌파! 전 세계가 열광하는 2050년 최고의 크리에이터",    job:"메가 크리에이터·인플루언서", saju:"식상 + 도화살 극강",    ohaeng:"火",  color:"#ff0000" },
  rocket:    { emoji:"🚀", name:"우주선",    headline:"[과학] 화성 탐사 프로젝트 성공! 인류의 우주 시대를 연 천재 엔지니어",            job:"우주항공 전문가·미래산업", saju:"역마살 + 편인 결합",      ohaeng:"水",  color:"#6366f1" },
  headset:   { emoji:"🎧", name:"헤드셋",    headline:"[E-스포츠] 세계 대회 전승 우승 신화! \"저의 피지컬 비결은 돌잡이입니다\"",       job:"프로게이머·K-POP 프로듀서", saju:"비겁 + 집중력 강함",    ohaeng:"金",  color:"#8b5cf6" },
  chef:      { emoji:"👨‍🍳", name:"셰프모자",  headline:"[라이프] 한국인 최초 미쉐린 3스타 10년 연속 유지! 전 세계 미식가들을 홀리다",   job:"글로벌 스타 셰프·F&B 사업가", saju:"식신(食神) 발달",       ohaeng:"火",  color:"#f97316" },
  // 히든 5종
  seal:      { emoji:"👑", name:"옥새",      headline:"[특보] 상위 1% 제왕의 사주 등장! 타임지 선정 '세계를 움직이는 가장 영향력 있는 인물 1위'", job:"일국의 지도자·제왕",  saju:"건록·제왕 2개 이상",       ohaeng:"火",  color:"#f59e0b", hidden:true, hiddenRarity:"상위 1% 🔥 극희귀" },
  frog:      { emoji:"🐸", name:"황금 두꺼비",headline:"[경제] 포브스 선정 2050년 세계 1위 슈퍼리치! \"돌상에서 황금 두꺼비를 쥐었을 때부터 예견된 일\"", job:"글로벌 재벌·숨만 쉬어도 돈", saju:"진술축미(辰戌丑未) + 재성 극강", ohaeng:"土", color:"#f59e0b", hidden:true, hiddenRarity:"상위 1% 🐸 재물운 끝판왕" },
  starmap:   { emoji:"🌌", name:"천상열차분야지도", headline:"[과학] 인류의 새로운 미래를 열다! 우주의 비밀을 푼 세기의 천재 등장", job:"세기의 철학자·혁신가", saju:"천문성·화개살 3개 이상", ohaeng:"水", color:"#6366f1", hidden:true, hiddenRarity:"상위 1% 🌌 세기의 천재" },
  unicorn:   { emoji:"🦄", name:"유니콘",    headline:"[경제] 창업 3년 만에 기업가치 10조 돌파! 세상을 뒤집은 최연소 유니콘 CEO",      job:"유니콘 기업 창업자",    saju:"식상생재(食傷生財) 완벽",  ohaeng:"木",  color:"#a855f7", hidden:true, hiddenRarity:"상위 1% 🦄 스타트업 전설" },
  pearl:     { emoji:"🔮", name:"여의주",    headline:"[화제] 하는 일마다 대박 행진! \"저축해 둔 전생의 운을 이번 생에 다 쓰는 중\"",  job:"천을귀인 프리패스 운명", saju:"천을귀인 2개 이상",       ohaeng:"水",  color:"#ec4899", hidden:true, hiddenRarity:"상위 1% 🔮 프리패스 행운" },
};

// 사주 기반 아이템 매칭 로직
function matchItem(birthYear, birthMonth, gender, parentWish) {
  // 간단한 로직 (실제론 사주 계산 API 사용)
  const year = parseInt(birthYear) || 2024;
  const month = parseInt(birthMonth) || 1;
  const seed = year * 13 + month * 7 + (gender === "boy" ? 3 : 5);

  // 1% 히든 확률
  const hiddenRoll = Math.random();
  if (hiddenRoll < 0.05) { // 미리보기용 5%
    const hiddenKeys = Object.keys(ITEMS).filter(k => ITEMS[k].hidden);
    return hiddenKeys[seed % hiddenKeys.length];
  }

  const normalKeys = Object.keys(ITEMS).filter(k => !ITEMS[k].hidden);
  return normalKeys[seed % normalKeys.length];
}

// ─────────────────────────────────────────
// Step 1. 설명 팝업
// ─────────────────────────────────────────
function IntroStep({ onNext }) {
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
      </div>
      <div style={{ textAlign: "center", padding: "16px 20px 12px" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎊</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: G, margin: "0 0 6px" }}>돌잡이 시뮬레이션</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 4px" }}>아기 사주로 미래를 엿보다 · 980원</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,200,122,0.1)", border: "1px solid rgba(232,200,122,0.3)", borderRadius: 20, padding: "4px 12px" }}>
          <span style={{ fontSize: 11, color: G }}>✨ 1% 확률 히든 아이템 등장 가능!</span>
        </div>
      </div>

      {/* 미리보기 아이템 */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: G, fontWeight: 600, margin: "0 0 10px", textAlign: "center" }}>🎁 돌상에 올라갈 아이템 20종</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {Object.values(ITEMS).filter(it => !it.hidden).map((it, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                <span>{it.emoji}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{it.name}</span>
              </div>
            ))}
          </div>
        </div>

        {[
          { icon: "🔮", label: "사주 기반 돌잡이 예측", desc: "오행·십성으로 잡을 물건을 예측해요" },
          { icon: "📰", label: "2050년 가상 뉴스 헤드라인", desc: "아기의 미래를 헤드라인으로 확인!" },
          { icon: "⚖️", label: "부모 바람 vs 사주 비교", desc: "부모의 바람과 사주 기질 비교 분석" },
          { icon: "👶", label: "맞춤 육아 조언", desc: "이 아이를 어떻게 키우면 좋을지" },
          { icon: "👑", label: "1% 히든 아이템 기회", desc: "옥새·황금두꺼비·여의주 등장 가능!" },
        ].map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{it.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#F0EAD6", margin: "0 0 1px" }}>{it.label}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>
        <button onClick={onNext} style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#0D0D14", cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
          시작하기 →
        </button>
        <button style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>
          닫기
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 2. 결제
// ─────────────────────────────────────────
function PaymentStep({ onNext }) {
  const [method, setMethod] = useState("kakao");
  const ms = [{ k: "kakao", l: "카카오페이", s: "원터치 간편결제" }, { k: "toss", l: "토스페이", s: "간편결제" }, { k: "naver", l: "네이버페이", s: "포인트 적립" }, { k: "card", l: "카드결제", s: "신용/체크카드" }, { k: "phone", l: "핸드폰 결제", s: "통신사 결제" }];
  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>결제하기</h3>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>💰 보유 캐시</p><p style={{ fontSize: 18, fontWeight: 700, color: G, margin: 0 }}>2,000원</p></div>
          <button style={{ padding: "8px 14px", background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#0D0D14", cursor: "pointer" }}>캐시 사용</button>
        </div>
        {[{ i: "🎫", l: "쿠폰 (0장)" }, { i: "🎟️", l: "이용권 (0장)" }].map(it => <div key={it.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>{it.i} {it.l}</p><p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>눌러서 목록 보기</p></div><span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>›</span></div>)}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>상품 가격</span><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>980원</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#F0EAD6" }}>결제 금액</span><span style={{ fontSize: 14, fontWeight: 700, color: G }}>980원</span></div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 10px", fontWeight: 600 }}>🔐 결제 수단</p>
        {ms.map(mm => <button key={mm.k} onClick={() => setMethod(mm.k)} style={{ width: "100%", padding: "14px 16px", marginBottom: 8, background: method === mm.k ? "rgba(232,200,122,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${method === mm.k ? "rgba(232,200,122,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: method === mm.k ? "rgba(232,200,122,0.2)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>{method === mm.k && <div style={{ width: 10, height: 10, borderRadius: "50%", background: G }} />}</div><div><p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 1px" }}>{mm.l}</p><p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{mm.s}</p></div></button>)}
        <button onClick={onNext} style={{ width: "100%", padding: "16px", marginTop: 8, background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#0D0D14", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>980원 결제하기 →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 3. 사전질문
// ─────────────────────────────────────────
function QuestionStep({ onNext }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [momWish, setMomWish] = useState(null);
  const [dadWish, setDadWish] = useState(null);
  const [birth, setBirth] = useState({ year: "", month: "", day: "" });

  const wishes = [
    { e: "💰", l: "돈·재물" }, { e: "📚", l: "공부·학문" },
    { e: "🎨", l: "예술·창의력" }, { e: "⚕️", l: "의료·과학" },
    { e: "💼", l: "사업·리더십" }, { e: "🌟", l: "운명대로!" },
  ];

  const canProceed = name && gender && momWish && dadWish && birth.year && birth.month;

  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} /></div>
      <div style={{ padding: "14px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>🎊</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F0EAD6", margin: 0 }}>돌잡이 시뮬레이션</h3>
        </div>

        {/* Q1. 아기 이름 */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: G, margin: "0 0 8px" }}>Q1. 아기 이름 또는 태명은?</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 건우, 이쁜이, 콩이" style={{ width: "100%", padding: "13px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 14, color: "#F0EAD6", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
        </div>

        {/* Q2. 아기 생년월일 (사주용) */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: G, margin: "0 0 4px" }}>Q2. 아기 생년월일 (사주 분석용)</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>정확할수록 사주 기반 예측이 정밀해져요</p>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "년도", key: "year", placeholder: "2024" },
              { label: "월", key: "month", placeholder: "3" },
              { label: "일", key: "day", placeholder: "15" },
            ].map(field => (
              <div key={field.key}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>{field.label}</p>
                <input value={birth[field.key]} onChange={e => setBirth(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} style={{ width: "100%", padding: "12px 10px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 13, color: "#F0EAD6", fontFamily: "inherit", boxSizing: "border-box", outline: "none", textAlign: "center" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Q3. 성별 */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: G, margin: "0 0 8px" }}>Q3. 아기 성별은?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ e: "👦", l: "남자아이", v: "boy" }, { e: "👧", l: "여자아이", v: "girl" }].map(opt => (
              <button key={opt.v} onClick={() => setGender(opt.v)} style={{ padding: "14px", background: gender === opt.v ? "rgba(232,200,122,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${gender === opt.v ? "rgba(232,200,122,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 28 }}>{opt.e}</span>
                <span style={{ fontSize: 13, color: gender === opt.v ? G : "rgba(255,255,255,0.7)", fontWeight: gender === opt.v ? 700 : 400 }}>{opt.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q4. 엄마 바람 */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: G, margin: "0 0 4px" }}>Q4. 👩 엄마의 바람은?</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>엄마 vs 아빠 vs 사주 — 셋 다 비교해드려요 😊</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {wishes.map(opt => (
              <button key={"mom-"+opt.l} onClick={() => setMomWish(opt.l)} style={{ padding: "10px 12px", background: momWish === opt.l ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${momWish === opt.l ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{opt.e}</span>
                <span style={{ fontSize: 11, color: momWish === opt.l ? "#ff6b6b" : "rgba(255,255,255,0.7)", fontWeight: momWish === opt.l ? 700 : 400 }}>{opt.l}</span>
                {momWish === opt.l && <span style={{ marginLeft: "auto", color: "#ff6b6b", fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Q5. 아빠 바람 */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#74B9FF", margin: "0 0 8px" }}>Q5. 👨 아빠의 바람은?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {wishes.map(opt => (
              <button key={"dad-"+opt.l} onClick={() => setDadWish(opt.l)} style={{ padding: "10px 12px", background: dadWish === opt.l ? "rgba(116,185,255,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${dadWish === opt.l ? "rgba(116,185,255,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{opt.e}</span>
                <span style={{ fontSize: 11, color: dadWish === opt.l ? "#74B9FF" : "rgba(255,255,255,0.7)", fontWeight: dadWish === opt.l ? 700 : 400 }}>{opt.l}</span>
                {dadWish === opt.l && <span style={{ marginLeft: "auto", color: "#74B9FF", fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => canProceed && onNext({ name, gender, momWish, dadWish, birth })} style={{ width: "100%", padding: "16px", background: canProceed ? `linear-gradient(135deg,${G},#C4922A)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: canProceed ? "#0D0D14" : "rgba(255,255,255,0.3)", cursor: canProceed ? "pointer" : "default", fontFamily: "inherit", letterSpacing: 0.5 }}>
          돌잡이 시뮬레이션 시작 →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 4. 애니메이션 (돌잡이 연출) ── 완전 리뉴얼
// ─────────────────────────────────────────
function AnimationStep({ answers, onNext }) {
  // phase: 0=돌상등장 1=말풍선아옹다옹 2=손흔들림 3=손달려감 4=잡음 5=결과폭죽
  const [phase, setPhase] = useState(0);
  const [handX, setHandX] = useState(0); // 손 좌우 흔들림
  const [confetti, setConfetti] = useState([]);
  const ivRef = useRef(null);
  const handRef = useRef(null);

  // 사주 기반 결과 아이템
  const resultKey = matchItem(answers.birth.year, answers.birth.month, answers.gender, answers.momWish);
  const resultItem = ITEMS[resultKey];

  // 엄마/아빠 바람 이모지
  const wishEmojiMap = {"돈·재물":"💰","공부·학문":"📚","예술·창의력":"🎨","의료·과학":"⚕️","사업·리더십":"💼","운명대로!":"🌟"};
  const momEmoji = wishEmojiMap[answers.momWish] || "💰";
  const dadEmoji = wishEmojiMap[answers.dadWish] || "📚";

  // 돌상 아이템 8종 (원형 배치)
  const tableItems = ["🏢","📖","⚖️","🎤","⚽","🏆","💰","🔭"];

  // 폭죽 생성
  function spawnConfetti() {
    const items = [];
    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        color: ["#E8C87A","#FF6B6B","#4ade80","#74B9FF","#f9a8d4","#FDCB6E"][Math.floor(Math.random()*6)],
        size: 8 + Math.random() * 10,
        delay: Math.random() * 0.5,
      });
    }
    setConfetti(items);
  }

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),   // 말풍선 등장
      setTimeout(() => setPhase(2), 2400),   // 손 흔들림 시작
      setTimeout(() => setPhase(3), 4200),   // 손 달려감
      setTimeout(() => setPhase(4), 5000),   // 잡음!
      setTimeout(() => { setPhase(5); spawnConfetti(); }, 5400), // 폭죽
      setTimeout(onNext, 7200),              // 결과로 이동
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 손 흔들림 (phase 2)
  useEffect(() => {
    if (phase === 2) {
      let t = 0;
      ivRef.current = setInterval(() => {
        t += 0.35;
        setHandX(Math.sin(t * 2.5) * 22);
      }, 50);
    } else {
      if (ivRef.current) clearInterval(ivRef.current);
      if (phase >= 3) setHandX(0);
    }
    return () => { if (ivRef.current) clearInterval(ivRef.current); };
  }, [phase]);

  return (
    <div style={{ background: DG, borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", minHeight: 480, position: "relative", overflow: "hidden", fontFamily: "'Noto Serif KR',serif" }}>

      {/* 배경 별빛 */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: Math.random()*100+"%", left: Math.random()*100+"%", width: 3, height: 3, borderRadius: "50%", background: "rgba(232,200,122,0.4)", animation: `twinkle ${1+Math.random()}s ease-in-out infinite alternate`, animationDelay: `${Math.random()*2}s` }} />
      ))}

      {/* 폭죽 */}
      {confetti.map(c => (
        <div key={c.id} style={{ position: "absolute", top: "-10px", left: c.x+"%", width: c.size, height: c.size, borderRadius: "50%", background: c.color, animation: `confettiFall 1.8s ease-in forwards`, animationDelay: c.delay+"s", opacity: 0 }} />
      ))}

      {/* 제목 */}
      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>
        {phase < 4 ? `${answers.name}(이)의 돌잡이 시작!` : `${answers.name}(이)가 잡았어요!`}
      </p>
      <h3 style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: G, margin: "0 0 20px" }}>
        {phase === 0 && "🎊 돌상을 차렸어요"}
        {phase === 1 && "🗣️ 부모님의 바람은..."}
        {phase === 2 && "🍼 손이 망설이고 있어요!"}
        {phase === 3 && "😲 손이 움직였어요!"}
        {phase >= 4 && `✨ ${resultItem.emoji} ${resultItem.name}!`}
      </h3>

      {/* ── 돌상 + 아이템 원형 배치 ── */}
      <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto 16px" }}>

        {/* 돌상 테이블 */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 160, height: 100, background: "linear-gradient(135deg,rgba(139,90,43,0.6),rgba(101,67,33,0.8))", borderRadius: "50% 50% 20px 20px", border: "2px solid rgba(232,200,122,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 140, height: 80, background: "linear-gradient(135deg,rgba(232,200,122,0.15),rgba(232,200,122,0.05))", borderRadius: "50% 50% 16px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* 가운데 결과 아이템 (phase 4 이후) */}
            {phase >= 4 && (
              <span style={{ fontSize: 36, animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)" }}>{resultItem.emoji}</span>
            )}
            {phase < 4 && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>돌상</span>
            )}
          </div>
        </div>

        {/* 원형 배치 아이템 8종 */}
        {tableItems.map((emoji, i) => {
          const angle = (i / tableItems.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 110;
          const x = 130 + r * Math.cos(rad);
          const y = 130 + r * Math.sin(rad);
          const isResult = emoji === resultItem.emoji;
          const shouldHighlight = phase >= 3 && isResult;
          return (
            <div key={i} style={{
              position: "absolute", left: x-18, top: y-18, width: 36, height: 36,
              borderRadius: "50%",
              background: shouldHighlight ? "rgba(232,200,122,0.25)" : "rgba(255,255,255,0.07)",
              border: shouldHighlight ? "2px solid #E8C87A" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              transform: `scale(${phase === 0 ? 0.3 : shouldHighlight ? 1.2 : 1})`,
              opacity: phase === 0 ? 0 : (phase >= 4 && !isResult ? 0.3 : 1),
              transition: "all 0.5s cubic-bezier(0.175,0.885,0.32,1.275)",
              transitionDelay: phase === 0 ? "0s" : `${i*0.08}s`,
              boxShadow: shouldHighlight ? "0 0 16px rgba(232,200,122,0.6)" : "none",
            }}>
              {emoji}
            </div>
          );
        })}

        {/* 아기 손 🤚 */}
        {phase >= 2 && phase < 4 && (
          <div style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: `translateX(calc(-50% + ${handX}px))`,
            fontSize: 36,
            transition: phase === 3 ? "all 0.6s cubic-bezier(0.6,0,1,1)" : "transform 0.05s linear",
            ...(phase === 3 && { top: "50%", transform: "translate(-50%,-50%)" }),
            zIndex: 10,
          }}>
            🤚
          </div>
        )}

        {/* 잡는 순간 */}
        {phase === 4 && (
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 32, zIndex: 10, animation: "shake 0.4s ease" }}>
            🤜
          </div>
        )}
      </div>

      {/* ── 말풍선 영역 ── */}
      {phase >= 1 && phase < 4 && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8, padding: "0 4px" }}>
          {/* 엄마 말풍선 */}
          <div style={{ flex: 1, background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.35)", borderRadius: "12px 12px 4px 12px", padding: "10px 12px", position: "relative", animation: "slideInLeft 0.4s ease" }}>
            <p style={{ fontSize: 10, color: "#f87171", fontWeight: 700, margin: "0 0 3px" }}>👩 엄마</p>
            <p style={{ fontSize: 12, color: "#F0EAD6", margin: "0 0 3px", fontWeight: 600 }}>{momEmoji} {answers.momWish}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: 0 }}>이거 잡아 얘야!</p>
          </div>
          {/* VS */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.3)" }}>VS</span>
          </div>
          {/* 아빠 말풍선 */}
          <div style={{ flex: 1, background: "rgba(116,185,255,0.12)", border: "1px solid rgba(116,185,255,0.35)", borderRadius: "12px 12px 12px 4px", padding: "10px 12px", animation: "slideInRight 0.4s ease" }}>
            <p style={{ fontSize: 10, color: "#74B9FF", fontWeight: 700, margin: "0 0 3px" }}>👨 아빠</p>
            <p style={{ fontSize: 12, color: "#F0EAD6", margin: "0 0 3px", fontWeight: 600 }}>{dadEmoji} {answers.dadWish}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: 0 }}>이걸 잡아야 해!</p>
          </div>
        </div>
      )}

      {/* 결과 말풍선 */}
      {phase >= 5 && (
        <div style={{ textAlign: "center", animation: "fadeInUp 0.5s ease" }}>
          <div style={{ background: "rgba(232,200,122,0.12)", border: "1px solid rgba(232,200,122,0.3)", borderRadius: 14, padding: "12px 16px", marginBottom: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: G, margin: "0 0 4px" }}>{resultItem.emoji} {resultItem.name}을 잡았어요!</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "0 0 6px", lineHeight: 1.5 }}>{answers.name}(이)의 사주가 이끈 결과예요 ☯️</p>
            {/* 엄마/아빠 결과 비교 */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: answers.momWish && resultItem.job.includes(answers.momWish.split("·")[0]) ? "rgba(74,222,128,0.2)" : "rgba(255,107,107,0.15)", color: answers.momWish && resultItem.job.includes(answers.momWish.split("·")[0]) ? "#4ade80" : "#f87171", border: "1px solid currentColor" }}>
                👩 엄마 바람 {answers.momWish === resultItem.name ? "✓ 맞았어요!" : "아쉽지만..."}
              </span>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: answers.dadWish && resultItem.job.includes(answers.dadWish.split("·")[0]) ? "rgba(74,222,128,0.2)" : "rgba(116,185,255,0.15)", color: answers.dadWish && resultItem.job.includes(answers.dadWish.split("·")[0]) ? "#4ade80" : "#74B9FF", border: "1px solid currentColor" }}>
                👨 아빠 바람 {answers.dadWish === resultItem.name ? "✓ 맞았어요!" : "아쉽지만..."}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>결과 카드를 불러오는 중...</p>
        </div>
      )}

      {/* 진행 상태 */}
      {phase < 4 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${[0,20,50,80,100][Math.min(phase,4)]}%`, background: "linear-gradient(90deg,#E8C87A,#C4922A)", borderRadius: 99, transition: "width 0.8s ease" }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes twinkle { from { opacity:0.2; } to { opacity:1; } }
        @keyframes confettiFall { 0%{opacity:1;transform:translateY(0) rotate(0deg);} 100%{opacity:0;transform:translateY(600px) rotate(720deg);} }
        @keyframes popIn { 0%{transform:scale(0);} 60%{transform:scale(1.3);} 100%{transform:scale(1);} }
        @keyframes shake { 0%,100%{transform:translate(-50%,-50%) rotate(0deg);} 25%{transform:translate(-50%,-50%) rotate(-15deg);} 75%{transform:translate(-50%,-50%) rotate(15deg);} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px);} to{opacity:1;transform:translateX(0);} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// Step 5. 결과 카드
// ─────────────────────────────────────────
function ResultStep({ answers }) {
  const itemKey = matchItem(answers.birth.year, answers.birth.month, answers.gender, answers.momWish);
  const item = ITEMS[itemKey];
  const isHidden = item.hidden;

  const [tab, setTab] = useState("result");
  const TABS = [{ k: "result", l: "돌잡이 결과" }, { k: "saju", l: "사주 분석" }, { k: "compare", l: "바람 비교" }, { k: "advice", l: "육아 조언" }];

  // 부모 바람 매핑
  const wishItemMap = {
    "돈·재물": "coin", "공부·학문": "book", "예술·창의력": "mic",
    "의료·과학": "medicine", "사업·리더십": "building", "운명대로!": itemKey,
  };
  const momWishKey = wishItemMap[answers.momWish] || itemKey;
  const dadWishKey = wishItemMap[answers.dadWish] || itemKey;
  const momWishItem = ITEMS[momWishKey];
  const dadWishItem = ITEMS[dadWishKey];
  const wishKey = momWishKey; // 하위 호환
  const wishItem = momWishItem;
  const sameAsWish = momWishKey === itemKey;

  return (
    <div style={{ minHeight: "100vh", background: DG, padding: "20px 12px 40px", fontFamily: "'Noto Serif KR',serif" }}>
      <div style={{ maxWidth: 430, margin: "0 auto" }}>

        {/* ── 결과 카드 (화이트) ── */}
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 12 }}>

          {/* 브랜딩 */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "#9ca3af", letterSpacing: 1, margin: 0 }}>🔮 천기(天機) 오리지널 | 돌잡이 시뮬레이션 리포트</p>
          </div>

          {/* 아기 정보 + 결과 뱃지 */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{answers.gender === "boy" ? "👦" : "👧"}</span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{answers.name}</h2>
                  {isHidden && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontWeight: 700 }}>🔥 히든</span>}
                </div>
                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>돌잡이 시뮬레이션</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{answers.birth.year}년 {answers.birth.month}월생 · {answers.gender === "boy" ? "남자아이" : "여자아이"}</p>
              </div>
              <div style={{ background: isHidden ? "linear-gradient(135deg,#fef9c3,#fef08a)" : "#f9fafb", border: `2px solid ${isHidden ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 14, padding: "10px 12px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{item.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: isHidden ? "#92400e" : "#374151" }}>{item.name}</div>
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", overflowX: "auto", background: "#fafafa" }}>
            {TABS.map(t => <button key={t.k} onClick={() => setTab(t.k)} style={{ flexShrink: 0, padding: "12px 13px", border: "none", borderBottom: tab === t.k ? `2px solid ${DG}` : "2px solid transparent", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: tab === t.k ? 700 : 500, color: tab === t.k ? DG : "#9ca3af", fontFamily: "inherit", transition: "0.15s" }}>{t.l}</button>)}
          </div>

          {/* 탭 내용 */}
          <div style={{ padding: "18px 16px" }}>

            {/* 돌잡이 결과 */}
            {tab === "result" && (
              <>
                {isHidden && (
                  <div style={{ background: "linear-gradient(135deg,#fef9c3,#fef3c7)", border: "2px solid #f59e0b", borderRadius: 14, padding: "14px", marginBottom: 16, textAlign: "center" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", margin: "0 0 4px" }}>🎊 대박! {item.hiddenRarity}</p>
                    <p style={{ fontSize: 11, color: "#78350f", margin: 0 }}>극히 드문 히든 아이템이 등장했어요! 인스타에 자랑하세요 📸</p>
                  </div>
                )}

                {/* 2050 뉴스 헤드라인 */}
                <div style={{ background: "#1e293b", borderRadius: 12, padding: "14px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>📰</span>
                    <span style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1, fontWeight: 600 }}>2050 미래 뉴스 헤드라인</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{item.headline}</p>
                </div>

                {/* 아이템 의미 */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                  {item.emoji} {item.name}을 잡았어요!
                </h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px" }}>{item.job}</p>

                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: "0 0 14px" }}>
                  {answers.name}(이)의 사주를 분석한 결과, 수많은 돌잡이 아이템 중에서 <strong>{item.emoji} {item.name}</strong>과 가장 강하게 에너지가 연결됩니다.
                </p>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: "0 0 14px" }}>
                  이 아이는 사주에 <strong style={{ color: item.color }}>{item.ohaeng}(오행)</strong> 기운이 강하게 발달해 있어요. 그래서 수많은 물건 중에서도 {item.emoji} {item.name}에 가장 강하게 끌리는 것입니다. 타고난 에너지가 {item.job} 분야와 깊이 공명하는 사주예요.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px", border: "1px solid #bbf7d0" }}>
                    <p style={{ fontSize: 9, color: "#16a34a", fontWeight: 700, letterSpacing: 1, margin: "0 0 5px" }}>✓ 사주 근거</p>
                    <p style={{ fontSize: 11, color: "#166534", lineHeight: 1.65, margin: 0 }}>{item.saju}</p>
                  </div>
                  <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px", border: "1px solid #bfdbfe" }}>
                    <p style={{ fontSize: 9, color: "#1d4ed8", fontWeight: 700, letterSpacing: 1, margin: "0 0 5px" }}>✦ 타고난 기운</p>
                    <p style={{ fontSize: 11, color: "#1e40af", lineHeight: 1.65, margin: 0 }}>{item.ohaeng}(五行) 기운 강함</p>
                  </div>
                </div>
              </>
            )}

            {/* 사주 분석 */}
            {tab === "saju" && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{answers.name}의 사주 기질 분석</h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>{answers.birth.year}년생 · {item.ohaeng} 기운 중심</p>

                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: "0 0 14px" }}>
                  {answers.birth.year}년 {answers.birth.month}월에 태어난 {answers.name}(이)의 사주를 오행으로 분석하면, <strong style={{ color: item.color }}>{item.ohaeng}(五行) 기운</strong>이 가장 두드러집니다. 이 기운은 {item.job.split("·")[0]} 분야에서 빛을 발하는 에너지예요.
                </p>

                {[
                  { label: "타고난 강점", content: `${item.ohaeng} 기운이 강한 아이는 ${item.job.split("·")[0]} 분야에 타고난 감각을 지니고 있어요. 어릴 때부터 이 분야에 관련된 활동을 즐기고, 남들보다 빠르게 실력이 는다는 특징이 있습니다.` },
                  { label: "보완해야 할 부분", content: `강한 기운이 있는 만큼, 반대 기운의 활동도 균형 있게 접하게 해주세요. 한 분야에 너무 일찍 집중하면 시야가 좁아질 수 있어요.` },
                  { label: "사주 특이 포인트", content: `${item.saju}에 해당하는 사주로, 이 조합은 전통 명리학에서 ${item.job} 방면으로 크게 성공할 가능성이 높은 배합으로 봅니다.` },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px", marginBottom: 10, border: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 11, color: "#374151", fontWeight: 700, margin: "0 0 6px" }}>✦ {s.label}</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0 }}>{s.content}</p>
                  </div>
                ))}
              </>
            )}

            {/* 바람 비교 */}
            {tab === "compare" && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>엄마·아빠 바람 vs 사주 기질</h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>셋 다 비교해드려요! 누구 바람이 맞았을까요? 🥊</p>

                {/* 3자 비교 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 6, alignItems: "center", marginBottom: 16 }}>
                  {/* 엄마 */}
                  <div style={{ background: "#fff5f5", border: "2px solid rgba(255,107,107,0.4)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#e53e3e", margin: "0 0 6px", fontWeight: 700 }}>👩 엄마 바람</p>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{momWishItem.emoji}</div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#c53030" }}>{momWishItem.name}</p>
                    <p style={{ fontSize: 9, color: "#e53e3e", margin: "3px 0 0" }}>{answers.momWish}</p>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 14 }}>{momWishKey === itemKey ? "✅" : "❌"}</div>
                  {/* 사주 결과 */}
                  <div style={{ background: "#f0fdf4", border: "3px solid rgba(74,222,128,0.5)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#166534", margin: "0 0 6px", fontWeight: 700 }}>🔮 사주 결과</p>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{item.emoji}</div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#14532d" }}>{item.name}</p>
                    <p style={{ fontSize: 9, color: "#166534", margin: "3px 0 0" }}>정답</p>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 14 }}>{dadWishKey === itemKey ? "✅" : "❌"}</div>
                  {/* 아빠 */}
                  <div style={{ background: "#eff6ff", border: "2px solid rgba(116,185,255,0.4)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#1e40af", margin: "0 0 6px", fontWeight: 700 }}>👨 아빠 바람</p>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{dadWishItem.emoji}</div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a" }}>{dadWishItem.name}</p>
                    <p style={{ fontSize: 9, color: "#1e40af", margin: "3px 0 0" }}>{answers.dadWish}</p>
                  </div>
                </div>

                {/* 결과 판정 */}
                <div style={{ background: momWishKey === itemKey || dadWishKey === itemKey ? "#f0fdf4" : "#fef9c3", border: `1px solid ${momWishKey === itemKey || dadWishKey === itemKey ? "#bbf7d0" : "#fde68a"}`, borderRadius: 12, padding: "14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: momWishKey === itemKey || dadWishKey === itemKey ? "#166534" : "#92400e", margin: "0 0 8px" }}>
                    {momWishKey === itemKey && dadWishKey === itemKey
                      ? "🎉 엄마·아빠 바람이 모두 맞았어요!"
                      : momWishKey === itemKey
                        ? "🎊 엄마 바람이 맞았어요! 아빠는 다음에... 😅"
                        : dadWishKey === itemKey
                          ? "🎊 아빠 바람이 맞았어요! 엄마는 다음에... 😅"
                          : "💡 둘 다 빗나갔지만... 사주가 더 정확해요!"}
                  </p>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.8, margin: 0 }}>
                    {answers.name}(이)의 사주가 이끈 결과는 {item.emoji} {item.name}이에요.
                    {momWishKey !== itemKey && dadWishKey !== itemKey
                      ? ` 엄마는 ${momWishItem.name}, 아빠는 ${dadWishItem.name}을 원하셨지만, 아이의 타고난 기질은 ${item.job.split("·")[0]} 분야에 더 강한 기운을 갖고 있어요.`
                      : " 부모님의 바람과 아이의 사주가 잘 맞아요!"}
                  </p>
                </div>

                <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.9, margin: 0 }}>
                  어느 쪽이든, 아이가 행복하게 자라는 것이 가장 중요해요. 사주는 아이의 타고난 강점을 알려주는 나침반일 뿐, 최종 방향은 언제나 아이 스스로 결정하게 될 거예요 ❤️
                </p>
              </>
            )}

            {/* 육아 조언 */}
            {tab === "advice" && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                  {answers.name}을(를) 위한 맞춤 육아 조언
                </h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>이 아이의 기질을 살려주는 방법</p>

                {[
                  {
                    title: "🌱 영·유아기 (0~3세)",
                    content: `${item.ohaeng} 기운이 강한 아이는 이 시기에 오감 자극이 매우 중요해요. 특히 ${item.emoji} ${item.name}과 연관된 환경(색깔, 소리, 질감)에 노출시켜 주세요. 아이가 자연스럽게 반응하는 것들을 잘 관찰하면 재능의 단서를 찾을 수 있어요.`
                  },
                  {
                    title: "📚 학령기 (4~12세)",
                    content: `이 시기에 ${item.job.split("·")[0]} 관련 체험 활동을 자연스럽게 접하게 해주세요. 강요하지 않고 즐기는 과정에서 재능이 꽃피어요. 결과보다 과정을 칭찬해주는 것이 이 기질의 아이에게 특히 효과적이에요.`
                  },
                  {
                    title: "💪 부모님이 해줄 수 있는 것",
                    content: `${answers.name}(이)의 관심사를 '이상한 것'으로 보지 말고 '특별한 재능'으로 바라봐 주세요. 비교는 독이지만, 응원은 이 아이를 세상 밖으로 이끄는 날개가 됩니다. 지금 이 돌잡이 물건을 아이 방에 두면 그 기운이 오래도록 함께할 거예요.`
                  },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px", marginBottom: 10, border: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, margin: 0 }}>{s.content}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* 하단 해시태그 */}
          <div style={{ padding: "12px 16px 14px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: "0 0 3px", lineHeight: 1.8 }}>#천기돌잡이 #{answers.name}돌잔치 #{item.name}잡기 #{item.ohaeng}기운</p>
            <p style={{ fontSize: 10, color: "#374151", margin: 0, fontWeight: 600 }}>🌐 천기.kr</p>
          </div>
        </div>

        {/* ── 인증서 카드 ── */}
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginBottom: 20 }}>
          <div style={{ background: isHidden ? "linear-gradient(135deg,#fef9c3,#fef3c7)" : "linear-gradient(135deg,#f9fafb,#f3f4f6)", padding: "20px", textAlign: "center", border: isHidden ? "none" : "none" }}>
            <p style={{ fontSize: 8, letterSpacing: 3, color: isHidden ? "#92400e" : "#6b7280", margin: "0 0 2px" }}>
              {isHidden ? "✦ CHUNGI ORIGINALS · SPECIAL HIDDEN ✦" : "CHUNGI ORIGINALS · 돌잡이 시뮬레이션"}
            </p>
            <p style={{ fontSize: 8, letterSpacing: 2, color: isHidden ? "#b45309" : "#9ca3af", margin: "0 0 14px" }}>
              — {isHidden ? item.hiddenRarity : "돌잡이 리포트"} —
            </p>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{item.emoji}</div>
            <p style={{ fontSize: 11, color: isHidden ? "#92400e" : "#6b7280", margin: "0 0 4px" }}>— {answers.name}의 돌잡이 아이템 —</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: isHidden ? "#7c2d12" : "#111827", margin: "0 0 6px" }}>"{item.emoji} {item.name}"</p>
            <p style={{ fontSize: 11, color: isHidden ? "#b45309" : "#6b7280", margin: "0 0 10px" }}>미래 직업: {item.job}</p>
            <p style={{ fontSize: 12, color: isHidden ? "#92400e" : "#374151", lineHeight: 1.8, margin: "0 0 14px" }}>
              {item.headline.replace("[", "").replace("]", " —")}
            </p>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
              {[`#${item.name}잡기`, `#${item.ohaeng}기운`, `#${answers.name}돌잔치`, isHidden ? "#히든아이템" : "#사주맞춤"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: isHidden ? "rgba(146,64,14,0.1)" : "rgba(107,114,128,0.1)", color: isHidden ? "#92400e" : "#374151", border: `1px solid ${isHidden ? "rgba(146,64,14,0.2)" : "rgba(107,114,128,0.2)"}` }}>{t}</span>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${isHidden ? "#fde68a" : "#e5e7eb"}`, paddingTop: 10 }}>
              <p style={{ fontSize: 8, color: isHidden ? "#b45309" : "#9ca3af", margin: "0 0 2px", letterSpacing: 2 }}>✦ 天機 ORIGINAL · No. 2026-D{Math.floor(Math.random() * 9000 + 1000)}</p>
              <p style={{ fontSize: 8, color: isHidden ? "#92400e" : "#6b7280", margin: 0 }}>— 천기(天機) · 돌잡이 —</p>
            </div>
          </div>
        </div>

        {/* ── 다크그린 퍼널 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <button style={{ padding: "13px", background: "#FEE500", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#3c1e1e", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><span>💬</span> 카카오 공유</button>
          <button style={{ padding: "13px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><span>🔗</span> 링크 복사</button>
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "0 0 20px" }}>*공유하면 우리 아이 행운 기운이 더 강해져요 🌿</p>

        <p style={{ fontSize: 11, color: G, fontWeight: 600, margin: "0 0 10px" }}>✦ 이것도 해볼래요?</p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
          {[
            { e: "👶", l: "우리 아기 관상", p: "980원" },
            { e: "🧬", l: "2세 얼굴 예측", p: "4,800원" },
            { e: "👪", l: "부모자식 궁합", p: "1,980원" },
            { e: "🔮", l: "오늘의 타로", p: "무료" },
          ].map(it => (
            <div key={it.l} style={{ minWidth: 80, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 8px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{it.e}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#F0EAD6", marginBottom: 2 }}>{it.l}</div>
              <div style={{ fontSize: 10, color: it.p === "무료" ? "#4ade80" : G }}>{it.p}</div>
            </div>
          ))}
        </div>

        <button style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${G},#C4922A)`, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#0D0D14", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
          확인 완료
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 메인 — 5단계 플로우
// intro → payment → question → animation → result
// ─────────────────────────────────────────
export default function DoljabiFull() {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState(null);

  const Overlay = ({ children }) => (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'Noto Serif KR',serif" }}>
      <div style={{ width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto" }}>{children}</div>
    </div>
  );

  if (step === "intro") return <Overlay><IntroStep onNext={() => setStep("payment")} /></Overlay>;
  if (step === "payment") return <Overlay><PaymentStep onNext={() => setStep("question")} /></Overlay>;
  if (step === "question") return <Overlay><QuestionStep onNext={ans => { setAnswers(ans); setStep("animation"); }} /></Overlay>;
  if (step === "animation") return <Overlay><AnimationStep answers={answers} onNext={() => setStep("result")} /></Overlay>;
  if (step === "result") return <ResultStep answers={answers} />;
}
