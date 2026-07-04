import { useState, useMemo } from "react";

const G = "#E8C87A", DG = "#0D2318";

// ── 띠별 데이터
const ZODIAC = [
  { key:"rat",    emoji:"🐭", name:"쥐띠",   years:"1948·1960·1972·1984·1996·2008·2020" },
  { key:"ox",     emoji:"🐮", name:"소띠",   years:"1949·1961·1973·1985·1997·2009·2021" },
  { key:"tiger",  emoji:"🐯", name:"호랑이띠", years:"1950·1962·1974·1986·1998·2010·2022" },
  { key:"rabbit", emoji:"🐰", name:"토끼띠",  years:"1951·1963·1975·1987·1999·2011·2023" },
  { key:"dragon", emoji:"🐲", name:"용띠",   years:"1952·1964·1976·1988·2000·2012·2024" },
  { key:"snake",  emoji:"🐍", name:"뱀띠",   years:"1953·1965·1977·1989·2001·2013·2025" },
  { key:"horse",  emoji:"🐴", name:"말띠",   years:"1954·1966·1978·1990·2002·2014·2026" },
  { key:"goat",   emoji:"🐑", name:"양띠",   years:"1955·1967·1979·1991·2003·2015" },
  { key:"monkey", emoji:"🐒", name:"원숭이띠", years:"1956·1968·1980·1992·2004·2016" },
  { key:"rooster",emoji:"🐓", name:"닭띠",   years:"1957·1969·1981·1993·2005·2017" },
  { key:"dog",    emoji:"🐶", name:"개띠",   years:"1958·1970·1982·1994·2006·2018" },
  { key:"pig",    emoji:"🐷", name:"돼지띠",  years:"1959·1971·1983·1995·2007·2019" },
];

// ── 별자리 데이터
const STAR = [
  { key:"aries",       emoji:"♈", name:"양자리",    period:"3.21~4.19" },
  { key:"taurus",      emoji:"♉", name:"황소자리",   period:"4.20~5.20" },
  { key:"gemini",      emoji:"♊", name:"쌍둥이자리",  period:"5.21~6.21" },
  { key:"cancer",      emoji:"♋", name:"게자리",    period:"6.22~7.22" },
  { key:"leo",         emoji:"♌", name:"사자자리",   period:"7.23~8.22" },
  { key:"virgo",       emoji:"♍", name:"처녀자리",   period:"8.23~9.22" },
  { key:"libra",       emoji:"♎", name:"천칭자리",   period:"9.23~10.23" },
  { key:"scorpio",     emoji:"♏", name:"전갈자리",   period:"10.24~11.22" },
  { key:"sagittarius", emoji:"♐", name:"사수자리",   period:"11.23~12.21" },
  { key:"capricorn",   emoji:"♑", name:"염소자리",   period:"12.22~1.19" },
  { key:"aquarius",    emoji:"♒", name:"물병자리",   period:"1.20~2.18" },
  { key:"pisces",      emoji:"♓", name:"물고기자리",  period:"2.19~3.20" },
];

// ── 혈액형 데이터
const BLOOD = [
  { key:"A",  emoji:"🅰️", name:"A형",  color:"#ef4444" },
  { key:"B",  emoji:"🅱️", name:"B형",  color:"#3b82f6" },
  { key:"O",  emoji:"⭕", name:"O형",  color:"#22c55e" },
  { key:"AB", emoji:"🆎", name:"AB형", color:"#a855f7" },
];

// ── 운세 결과 생성 (실제론 DB에서 가져옴)
function makeResult(type, key) {
  const scores = { total:Math.floor(Math.random()*25+70), love:Math.floor(Math.random()*30+65), money:Math.floor(Math.random()*30+60), work:Math.floor(Math.random()*30+65), health:Math.floor(Math.random()*25+70) };
  const stars = (s) => "★".repeat(Math.round(s/20)) + "☆".repeat(5-Math.round(s/20));

  const fortunes = {
    총운:["봄볕이 내리쬐는 창가에 앉아있는 듯한 평온한 기운의 하루입니다. 새로운 시작을 두려워하지 마세요. 오늘 내린 작은 결정이 훗날 큰 변화의 씨앗이 될 수 있어요. 주변의 소소한 인연을 소중히 여기면 예상치 못한 기쁨이 찾아올 거예요.","겨울을 이겨낸 새싹처럼 단단하고 생생한 에너지가 흐르는 날입니다. 미뤄두었던 일을 오늘 시작하면 뜻밖의 순풍을 만날 수 있어요. 작은 용기가 큰 행운을 불러오는 날이니 망설이지 마세요.","잔잔한 호수처럼 마음이 고요한 하루입니다. 서두르지 않아도 원하는 것들이 자연스럽게 흘러들어오는 기운이에요. 오늘은 무리하게 밀어붙이기보다 흐름에 몸을 맡겨보세요."],
    애정운:["오래된 감정의 실타래가 오늘 조심스럽게 풀리기 시작합니다. 먼저 한 발짝 다가가는 용기를 내어보세요. 연인이 있다면 평소에 하지 못했던 솔직한 이야기를 나눠보기 좋은 날이에요.","마음 속 깊이 숨겨두었던 감정을 표현하기 좋은 날입니다. 눈빛 하나, 작은 문자 하나가 상대에게 큰 울림을 줄 수 있어요. 싱글이라면 오늘 만나는 인연을 가볍게 여기지 마세요."],
    재물운:["예상치 못한 작은 수입의 기운이 보입니다. 다만 충동적인 소비는 자제하는 것이 좋을 것 같아요. 투자보다는 저축이 유리한 날이니 지갑을 신중하게 열어보세요.","재물의 흐름이 원활하게 돌아가는 날입니다. 오래 기다리던 금전 문제가 해결의 실마리를 찾을 수 있어요. 단, 보증이나 빌려주는 것은 삼가는 게 좋습니다."],
    직업운:["오늘은 동료나 상사에게 좋은 인상을 남길 수 있는 날입니다. 평소 미뤄뒀던 업무를 처리하면 예상보다 빠르게 마무리될 거예요. 새로운 아이디어를 적극적으로 표현해보세요.","직장이나 사업에서 작은 성과가 인정받을 수 있는 날이에요. 오늘 맺는 인연이 나중에 중요한 비즈니스 파트너가 될 수 있어요. 다만 경쟁보다는 협력을 택하는 것이 더 유리한 흐름이에요."],
    건강운:["몸의 신호에 귀를 기울여 보세요. 작은 피로가 쌓이지 않도록 오늘은 조금 일찍 쉬는 것을 추천해요. 수분 섭취를 충분히 하고, 가벼운 스트레칭으로 하루를 마무리하면 좋겠어요.","활력이 넘치는 날입니다. 오래 미뤄온 운동을 시작하기 좋은 타이밍이에요. 다만 과도한 음주나 야식은 피하는 것이 좋을 것 같아요."],
  };

  const lucky = {
    color: ["황금색","붉은색","파란색","초록색","보라색","하얀색","노란색"][Math.floor(Math.random()*7)],
    number: Math.floor(Math.random()*44+1),
    direction: ["동","서","남","북","동남","동북","서남","서북"][Math.floor(Math.random()*8)],
    time: ["오전 7~9시","오전 9~11시","오후 1~3시","오후 3~5시","저녁 7~9시"][Math.floor(Math.random()*5)],
    food: ["비빔밥","된장찌개","삼겹살","치킨","파스타","샐러드","초밥","냉면"][Math.floor(Math.random()*8)],
  };

  const r = (arr) => arr[Math.floor(Math.random()*arr.length)];

  return {
    scores,
    stars,
    total: r(fortunes.총운),
    love: r(fortunes.애정운),
    money: r(fortunes.재물운),
    work: r(fortunes.직업운),
    health: r(fortunes.건강운),
    lucky,
  };
}

// ── 결과 카드 컴포넌트
function ResultCard({ type, item }) {
  const [tab, setTab] = useState("total");
  const result = useMemo(() => makeResult(type, item.key), [type, item.key]);
  const tabs = [
    { k:"total",  l:"총운" },
    { k:"lucky",  l:"행운" },
    { k:"money",  l:"재물운" },
    { k:"love",   l:"애정운" },
    { k:"health", l:"건강운" },
    { k:"work",   l:"진로운" },
  ];

  const scoreData = {
    total:  { label:"오늘의 운세", score: result.scores.total },
    love:   { label:"애정운",      score: result.scores.love },
    money:  { label:"재물운",      score: result.scores.money },
    work:   { label:"진로운",      score: result.scores.work },
    health: { label:"건강운",      score: result.scores.health },
    lucky:  { label:"행운 지수",   score: result.scores.total },
  };

  const contentMap = {
    total:  result.total,
    love:   result.love,
    money:  result.money,
    work:   result.work,
    health: result.health,
  };

  const scoreColor = (s) => s >= 85 ? "#22c55e" : s >= 70 ? "#f59e0b" : "#ef4444";
  const sd = scoreData[tab];

  return (
    <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.4)" }}>

      {/* 브랜딩 */}
      <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid #f3f4f6", textAlign:"center" }}>
        <p style={{ fontSize:9, color:"#9ca3af", letterSpacing:1, margin:0 }}>
          🔮 천기(天機) | {type === "zodiac" ? "띠별 운세" : type === "star" ? "별자리 운세" : "혈액형 운세"} · 무료
        </p>
      </div>

      {/* 아이템 + 점수 */}
      <div style={{ padding:"14px 16px 12px", borderBottom:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:DG, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
            {item.emoji}
          </div>
          <div>
            <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", margin:"0 0 3px" }}>{item.name}</h3>
            <p style={{ fontSize:11, color:"#9ca3af", margin:0 }}>
              {type === "zodiac" ? item.years : type === "star" ? item.period : "오늘의 운세"}
            </p>
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#9ca3af", marginBottom:3 }}>오늘의 운</div>
          <div style={{ display:"flex", gap:1 }}>
            {"★".repeat(Math.round(result.scores.total/20)).split("").map((s,i) => <span key={i} style={{ fontSize:14, color:G }}>{s}</span>)}
            {"☆".repeat(5-Math.round(result.scores.total/20)).split("").map((s,i) => <span key={i} style={{ fontSize:14, color:"#e5e7eb" }}>{s}</span>)}
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display:"flex", borderBottom:"1px solid #e5e7eb", background:"#fafafa" }}>
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex:1, padding:"11px 4px", border:"none", borderBottom: tab===t.k ? `2px solid ${DG}` : "2px solid transparent", background:"transparent", cursor:"pointer", fontSize:11, fontWeight: tab===t.k ? 700 : 500, color: tab===t.k ? DG : "#9ca3af", fontFamily:"inherit", transition:"0.15s" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div style={{ padding:"16px" }}>

        {/* 점수 바 */}
        {tab !== "lucky" && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:11, color:"#6b7280" }}>{sd.label}</span>
              <span style={{ fontSize:14, fontWeight:700, color:scoreColor(sd.score) }}>{sd.score}점</span>
            </div>
            <div style={{ height:8, background:"#f3f4f6", borderRadius:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${sd.score}%`, background:`linear-gradient(90deg,${scoreColor(sd.score)},${scoreColor(sd.score)}bb)`, borderRadius:10, transition:"0.5s" }}/>
            </div>
          </div>
        )}

        {/* 본문 */}
        {tab !== "lucky" && (
          <p style={{ fontSize:13, color:"#374151", lineHeight:1.95, margin:"0 0 14px" }}>
            {contentMap[tab]}
          </p>
        )}

        {/* 총운 탭 — 4가지 영역 점수 요약 */}
        {tab === "total" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:4 }}>
            {[
              { label:"재물운", score:result.scores.money,  emoji:"💰" },
              { label:"애정운", score:result.scores.love,   emoji:"❤️" },
              { label:"건강운", score:result.scores.health, emoji:"💪" },
              { label:"진로운", score:result.scores.work,   emoji:"💼" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 12px", border:"1px solid #f3f4f6" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:"#6b7280" }}>{s.emoji} {s.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:scoreColor(s.score) }}>{s.score}</span>
                </div>
                <div style={{ height:4, background:"#e5e7eb", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${s.score}%`, background:scoreColor(s.score), borderRadius:4 }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 행운 탭 */}
        {tab === "lucky" && (
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:"#111827", margin:"0 0 12px" }}>✦ 오늘의 행운 포인트</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[
                { icon:"🎨", label:"행운의 색", value:result.lucky.color },
                { icon:"🔢", label:"행운의 숫자", value:String(result.lucky.number) },
                { icon:"🧭", label:"행운의 방향", value:result.lucky.direction },
                { icon:"⏰", label:"행운의 시간", value:result.lucky.time },
              ].map((l,i) => (
                <div key={i} style={{ background:"#fafafa", borderRadius:12, padding:"12px 14px", border:"1px solid #f3f4f6", textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{l.icon}</div>
                  <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px" }}>{l.label}</p>
                  <p style={{ fontSize:14, fontWeight:700, color:DG, margin:0 }}>{l.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background:`linear-gradient(135deg,${DG},#1a3a28)`, borderRadius:12, padding:"14px", textAlign:"center" }}>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", margin:"0 0 4px" }}>오늘의 행운 음식</p>
              <p style={{ fontSize:18, fontWeight:700, color:G, margin:0 }}>🍽️ {result.lucky.food}</p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 해시태그 */}
      <div style={{ padding:"10px 16px 14px", borderTop:"1px solid #f3f4f6", textAlign:"center" }}>
        <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px", lineHeight:1.8 }}>
          #{item.name} #{type === "zodiac" ? "띠별운세" : type === "star" ? "별자리운세" : "혈액형운세"} #오늘의운세 #천기
        </p>
        <p style={{ fontSize:10, color:"#374151", margin:0, fontWeight:600 }}>🌐 천기.kr</p>
      </div>
    </div>
  );
}

// ── 선택 팝업 (띠/별자리 선택용)
function SelectPopup({ type, onSelect, onClose }) {
  const items = type === "zodiac" ? ZODIAC : type === "star" ? STAR : BLOOD;
  const title = type === "zodiac" ? "띠를 선택하세요" : type === "star" ? "별자리를 선택하세요" : "혈액형을 선택하세요";

  return (
    <div style={{ background:DG, borderRadius:"20px 20px 0 0", padding:"0 0 32px" }}>
      <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
        <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 16px" }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#F0EAD6", margin:0 }}>{title}</h3>
        <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.1)", border:"none", color:"rgba(255,255,255,0.5)", fontSize:14, cursor:"pointer" }}>✕</button>
      </div>
      <div style={{ padding:"0 16px" }}>
        {type === "blood" ? (
          // 혈액형 — 큰 버튼 4개
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {items.map(item => (
              <button key={item.key} onClick={() => onSelect(item)} style={{ padding:"20px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:36 }}>{item.emoji}</span>
                <span style={{ fontSize:16, fontWeight:700, color:"#F0EAD6" }}>{item.name}</span>
              </button>
            ))}
          </div>
        ) : (
          // 띠/별자리 — 리스트
          <div style={{ maxHeight:400, overflowY:"auto" }}>
            {items.map(item => (
              <button key={item.key} onClick={() => onSelect(item)} style={{ width:"100%", padding:"13px 16px", marginBottom:7, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(232,200,122,0.12)", border:"1px solid rgba(232,200,122,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {item.emoji}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:"#F0EAD6", margin:"0 0 2px" }}>{item.name}</p>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)", margin:0 }}>{type === "zodiac" ? item.years : item.period}</p>
                </div>
                <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.3)", fontSize:16 }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 메인
export default function FreeFortunePreview() {
  const [mainTab, setMainTab] = useState("zodiac"); // zodiac | star | blood
  const [selected, setSelected] = useState({ zodiac: null, star: null, blood: null });
  const [showSelect, setShowSelect] = useState(false);

  const currentItem = selected[mainTab];

  const mainTabs = [
    { k:"zodiac", l:"띠별운세",  emoji:"🐯" },
    { k:"star",   l:"별자리운세", emoji:"⭐" },
    { k:"blood",  l:"혈액형운세", emoji:"🩸" },
  ];

  const Overlay = ({ children }) => (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, fontFamily:"'Noto Serif KR',serif" }}>
      <div style={{ width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:DG, fontFamily:"'Noto Serif KR',serif" }}>

      {/* 상단 탭 */}
      <div style={{ background:DG, borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"16px 16px 0" }}>
        <div style={{ display:"flex", gap:8 }}>
          {mainTabs.map(t => (
            <button key={t.k} onClick={() => { setMainTab(t.k); setShowSelect(false); }} style={{ flex:1, padding:"10px 8px", border:"none", borderRadius:"10px 10px 0 0", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, background: mainTab===t.k ? "#fff" : "rgba(255,255,255,0.06)", color: mainTab===t.k ? DG : "rgba(255,255,255,0.5)", transition:"0.2s" }}>
              {t.emoji} {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding:"20px 12px 40px" }}>
        <div style={{ maxWidth:430, margin:"0 auto" }}>

          {/* 선택 안 된 상태 */}
          {!currentItem && (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>
                {mainTab === "zodiac" ? "🐯" : mainTab === "star" ? "⭐" : "🩸"}
              </div>
              <h2 style={{ fontSize:18, fontWeight:700, color:G, margin:"0 0 10px" }}>
                {mainTab === "zodiac" ? "내 띠별 운세 보기" : mainTab === "star" ? "내 별자리 운세 보기" : "내 혈액형 운세 보기"}
              </h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", margin:"0 0 28px", lineHeight:1.8, whiteSpace:"pre-line" }}>
                {mainTab === "zodiac" ? "내 띠를 선택하면\n오늘의 운세를 바로 확인할 수 있어요" : mainTab === "star" ? "내 별자리를 선택하면\n오늘의 운세를 바로 확인할 수 있어요" : "내 혈액형을 선택하면\n오늘의 운세를 바로 확인할 수 있어요"}
              </p>
              <button onClick={() => setShowSelect(true)} style={{ padding:"16px 40px", background:`linear-gradient(135deg,${G},#C4922A)`, border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:"#0D0D14", cursor:"pointer", fontFamily:"inherit" }}>
                {mainTab === "zodiac" ? "🐯 내 띠 선택하기" : mainTab === "star" ? "⭐ 내 별자리 선택하기" : "🩸 내 혈액형 선택하기"} →
              </button>
            </div>
          )}

          {/* 선택된 상태 — 결과 카드 */}
          {currentItem && (
            <>
              {/* 변경 버튼 */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{currentItem.emoji}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:G }}>{currentItem.name}</span>
                </div>
                <button onClick={() => setShowSelect(true)} style={{ padding:"7px 14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, cursor:"pointer", fontFamily:"inherit", fontSize:11, color:"rgba(255,255,255,0.6)" }}>
                  변경하기
                </button>
              </div>

              {/* 결과 카드 */}
              <ResultCard type={mainTab} item={currentItem} />

              {/* 다크그린 퍼널 */}
              <div style={{ marginTop:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                  <button style={{ padding:"13px", background:"#FEE500", border:"none", borderRadius:12, cursor:"pointer", fontSize:12, fontWeight:700, color:"#3c1e1e", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <span>💬</span> 카카오 공유
                  </button>
                  <button style={{ padding:"13px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, cursor:"pointer", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <span>🔗</span> 링크 복사
                  </button>
                </div>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", textAlign:"center", margin:"0 0 20px" }}>
                  *친구에게 공유하면 서로의 운이 더 좋아져요 🌿
                </p>

                <p style={{ fontSize:11, color:G, fontWeight:600, margin:"0 0 10px" }}>✦ 이것도 해볼래요?</p>
                <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:20 }}>
                  {[
                    { e:"🔮", l:"오늘의 타로", p:"무료" },
                    { e:"🌙", l:"이달의 운세", p:"무료" },
                    { e:"🪞", l:"내 관상보기", p:"980원" },
                    { e:"🗝️", l:"사주풀이",    p:"3,800원" },
                  ].map(it => (
                    <div key={it.l} style={{ minWidth:80, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 8px", textAlign:"center", flexShrink:0 }}>
                      <div style={{ fontSize:22, marginBottom:4 }}>{it.e}</div>
                      <div style={{ fontSize:10, fontWeight:600, color:"#F0EAD6", marginBottom:2 }}>{it.l}</div>
                      <div style={{ fontSize:10, color:it.p==="무료"?"#4ade80":G }}>{it.p}</div>
                    </div>
                  ))}
                </div>

                <button style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg,${G},#C4922A)`, border:"none", borderRadius:14, fontSize:15, fontWeight:700, color:"#0D0D14", cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5 }}>
                  확인 완료
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 선택 팝업 */}
      {showSelect && (
        <Overlay>
          <SelectPopup
            type={mainTab}
            onSelect={item => { setSelected(p => ({ ...p, [mainTab]: item })); setShowSelect(false); }}
            onClose={() => setShowSelect(false)}
          />
        </Overlay>
      )}
    </div>
  );
}
