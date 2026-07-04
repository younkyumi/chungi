import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

// ─── 유틸 ───
function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
function todaySeed(offset = 0) {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + offset;
}
function thisMonthSeed() {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}
function formatMonth() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
}
function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

// ─── 타로 78장 데이터 ───
const TAROT_CARDS = [
  // 메이저 아르카나 0~21
  {id:0,  name:"바보",      en:"The Fool",          keyword:"새로운 시작, 모험, 순수함"},
  {id:1,  name:"마법사",    en:"The Magician",       keyword:"의지력, 창조, 집중"},
  {id:2,  name:"여사제",    en:"The High Priestess", keyword:"직관, 신비, 잠재력"},
  {id:3,  name:"여황제",    en:"The Empress",        keyword:"풍요, 창조성, 자연"},
  {id:4,  name:"황제",      en:"The Emperor",        keyword:"권위, 안정, 리더십"},
  {id:5,  name:"교황",      en:"The Hierophant",     keyword:"전통, 신념, 안내"},
  {id:6,  name:"연인",      en:"The Lovers",         keyword:"사랑, 선택, 조화"},
  {id:7,  name:"전차",      en:"The Chariot",        keyword:"승리, 의지, 전진"},
  {id:8,  name:"힘",        en:"Strength",           keyword:"용기, 인내, 자제력"},
  {id:9,  name:"은둔자",    en:"The Hermit",         keyword:"내면탐구, 고독, 지혜"},
  {id:10, name:"운명의 수레바퀴", en:"Wheel of Fortune", keyword:"변화, 운명, 순환"},
  {id:11, name:"정의",      en:"Justice",            keyword:"균형, 진실, 인과"},
  {id:12, name:"매달린 사람", en:"The Hanged Man",   keyword:"희생, 새 관점, 대기"},
  {id:13, name:"죽음",      en:"Death",              keyword:"변환, 끝과 시작, 해방"},
  {id:14, name:"절제",      en:"Temperance",         keyword:"조화, 균형, 인내"},
  {id:15, name:"악마",      en:"The Devil",          keyword:"속박, 욕망, 물질주의"},
  {id:16, name:"탑",        en:"The Tower",          keyword:"갑작스런 변화, 해방, 붕괴"},
  {id:17, name:"별",        en:"The Star",           keyword:"희망, 영감, 치유"},
  {id:18, name:"달",        en:"The Moon",           keyword:"환상, 불안, 무의식"},
  {id:19, name:"태양",      en:"The Sun",            keyword:"성공, 기쁨, 활력"},
  {id:20, name:"심판",      en:"Judgement",          keyword:"부활, 반성, 전환점"},
  {id:21, name:"세계",      en:"The World",          keyword:"완성, 통합, 성취"},
  // 마이너 아르카나 (대표 22장만, 실제는 56장)
  {id:22, name:"완드 에이스", en:"Ace of Wands",    keyword:"새 에너지, 창의력, 열정"},
  {id:23, name:"완드 2",    en:"Two of Wands",       keyword:"계획, 미래 비전, 결정"},
  {id:24, name:"완드 3",    en:"Three of Wands",     keyword:"확장, 리더십, 탐험"},
  {id:25, name:"완드 4",    en:"Four of Wands",      keyword:"축하, 조화, 안정"},
  {id:26, name:"완드 5",    en:"Five of Wands",      keyword:"경쟁, 갈등, 도전"},
  {id:27, name:"컵 에이스", en:"Ace of Cups",        keyword:"새 감정, 직관, 사랑"},
  {id:28, name:"컵 2",      en:"Two of Cups",        keyword:"파트너십, 유대, 상호이해"},
  {id:29, name:"컵 3",      en:"Three of Cups",      keyword:"우정, 축하, 창의성"},
  {id:30, name:"컵 4",      en:"Four of Cups",       keyword:"명상, 재평가, 내면탐구"},
  {id:31, name:"컵 5",      en:"Five of Cups",       keyword:"상실, 후회, 슬픔"},
  {id:32, name:"소드 에이스", en:"Ace of Swords",   keyword:"명료함, 진실, 돌파구"},
  {id:33, name:"소드 2",    en:"Two of Swords",      keyword:"교착, 결정장애, 갈등"},
  {id:34, name:"소드 3",    en:"Three of Swords",    keyword:"슬픔, 이별, 상처"},
  {id:35, name:"소드 4",    en:"Four of Swords",     keyword:"휴식, 회복, 명상"},
  {id:36, name:"소드 5",    en:"Five of Swords",     keyword:"패배, 갈등, 손실"},
  {id:37, name:"펜타클 에이스", en:"Ace of Pentacles", keyword:"물질적 시작, 기회, 번영"},
  {id:38, name:"펜타클 2",  en:"Two of Pentacles",   keyword:"균형, 유연성, 시간관리"},
  {id:39, name:"펜타클 3",  en:"Three of Pentacles", keyword:"팀워크, 역량, 협력"},
  {id:40, name:"펜타클 4",  en:"Four of Pentacles",  keyword:"안정, 소유, 절약"},
  {id:41, name:"펜타클 5",  en:"Five of Pentacles",  keyword:"어려움, 결핍, 시련"},
  // 나머지는 36~77 번호 채우기
  ...Array.from({length:36}, (_,i) => ({
    id: 42+i, name:`카드 ${42+i}`, en:`Card ${42+i}`, keyword:"신비로운 기운이 흐릅니다"
  }))
];

// YES/NO 판정 (카드 ID 기반)
function getYesNo(cardId, isReversed) {
  const positiveCards = [0,1,2,3,4,6,7,8,10,14,17,19,20,21,22,25,27,28,29,32,37,39,40];
  const isPositive = positiveCards.includes(cardId);
  const result = isReversed ? !isPositive : isPositive;
  if (cardId === 10 || cardId === 14) return "글쎄요";
  return result ? "YES" : (Math.random() > 0.7 ? "글쎄요" : "NO");
}

// 꿈 해몽 DB
const DREAM_DB = [
  {keywords:["뱀","뱀이","구렁이"], title:"뱀 꿈", good:true,
   result:"뱀 꿈은 대체로 길몽이에요. 특히 큰 뱀일수록 재물운과 관련이 깊어요.",
   detail:"뱀은 동양 사상에서 재물과 지혜의 상징이에요. 뱀이 나를 감쌌다면 재물이 들어오는 신호, 뱀을 잡았다면 기회를 잡게 될 것을 의미해요. 단, 뱀에 물리는 꿈은 조심해야 할 사람이 주변에 있다는 경고일 수 있어요."},
  {keywords:["돼지","돼지꿈","멧돼지"], title:"돼지 꿈", good:true,
   result:"돼지 꿈은 대표적인 재물 길몽이에요! 특히 돼지를 잡거나 안는 꿈은 큰 횡재를 의미해요.",
   detail:"돼지는 풍요와 재물의 상징이에요. 돼지가 집에 들어오는 꿈은 가정에 재물이 들어오는 것을 의미하고, 아기 돼지 꿈은 새로운 시작이나 임신과 관련될 수 있어요."},
  {keywords:["용","용이","황룡","청룡"], title:"용 꿈", good:true,
   result:"용 꿈은 매우 강력한 길몽이에요. 승진, 사업 성공, 큰 행운을 상징해요.",
   detail:"용은 권세와 성공의 상징이에요. 하늘을 나는 용을 봤다면 원대한 꿈이 이루어질 것을 의미해요. 용을 탔다면 큰 성공이, 용이 알을 낳으면 풍요로운 결실을 의미해요."},
  {keywords:["이빨","이가","이빨이","치아"], title:"이빨 꿈", good:false,
   result:"이빨이 빠지는 꿈은 주변 사람과의 이별이나 건강에 주의하라는 신호예요.",
   detail:"이빨 꿈은 일반적으로 가족이나 가까운 사람의 건강을 상징해요. 이빨이 빠지면 그 방향(앞니=부모형제, 어금니=자신)에 따라 해석이 달라요. 다만 건강 검진의 계기로 삼아보세요."},
  {keywords:["물","홍수","바다","강"], title:"물 꿈", good:true,
   result:"맑은 물 꿈은 재물과 건강의 길몽, 흙탕물은 주변 정리가 필요하다는 신호예요.",
   detail:"물은 재물과 감정을 상징해요. 맑고 깨끗한 물을 마시면 건강운이 상승하고, 넓은 바다를 바라보는 꿈은 큰 사업 기회를 의미해요. 홍수는 갑작스러운 변화나 감정의 범람을 나타내요."},
  {keywords:["불","화재","불길"], title:"불 꿈", good:true,
   result:"활활 타오르는 불꿈은 강력한 에너지와 열정을 상징하는 길몽이에요.",
   detail:"불은 에너지와 변화를 상징해요. 활활 타오르는 불은 사업의 번창이나 강한 열정을 의미하고, 불을 끄는 꿈은 장애물 극복을 나타내요. 단 집이 불타는 꿈은 가정 내 갈등이나 변화를 의미할 수 있어요."},
  {keywords:["하늘","구름","하늘을"], title:"하늘 꿈", good:true,
   result:"하늘을 나는 꿈은 자유, 성취, 높은 목표 달성을 상징하는 길몽이에요.",
   detail:"맑고 푸른 하늘은 밝은 미래와 성공을 의미해요. 하늘을 자유롭게 날면 현재의 어려움을 이겨내고 높은 곳에 오르게 될 것을 암시해요."},
  {keywords:["죽음","죽는","사망","시체"], title:"죽음 꿈", good:true,
   result:"죽음 꿈은 나쁜 꿈이 아니에요! 오히려 새로운 시작이나 큰 변화를 의미해요.",
   detail:"꿈에서 죽음은 실제 죽음이 아닌 '끝과 시작'을 상징해요. 내가 죽는 꿈은 현재 상황이 완전히 새롭게 변화할 것을 의미하고, 타인이 죽는 꿈은 그 사람과의 관계가 새로운 단계로 발전함을 나타내요."},
];

// 태몽 DB
const TAEMONG_DB = [
  {keywords:["호랑이","범"], result:"호랑이 태몽은 강하고 리더십 있는 아이를 상징해요.", gender:"아들", trait:"강인함·리더십"},
  {keywords:["용","구렁이"], result:"용 태몽은 큰 인물이 될 아이를 상징해요.", gender:"아들", trait:"권세·성공"},
  {keywords:["꽃","꽃밭","장미"], result:"꽃 태몽은 아름답고 재능 있는 아이를 상징해요.", gender:"딸", trait:"예술성·아름다움"},
  {keywords:["복숭아","사과","과일"], result:"과일 태몽은 풍요롭고 다복한 아이를 상징해요.", gender:"딸", trait:"풍요·다복"},
  {keywords:["돼지","멧돼지"], result:"돼지 태몽은 재물복 많은 아이를 상징해요.", gender:"아들", trait:"재물운·복"},
  {keywords:["태양","해","햇빛"], result:"태양 태몽은 밝고 빛나는 아이를 상징해요.", gender:"아들", trait:"빛·긍정"},
  {keywords:["달","보름달"], result:"달 태몽은 감성 풍부하고 지혜로운 아이를 상징해요.", gender:"딸", trait:"감성·지혜"},
];

// ─── 공통 UI ───
function Sheet({children, onClose}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:DG,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",fontFamily:"'Noto Serif KR',serif",paddingBottom:40}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"12px auto 0"}}/>
        {children}
      </div>
    </div>
  );
}

function GBtn({children, onClick, dim=false, color=null}) {
  return (
    <button onClick={onClick} style={{
      width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",
      fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",
      background: color || (dim ? "rgba(255,255,255,0.09)" : `linear-gradient(135deg,${G},#C4922A)`),
      color: dim ? "rgba(255,255,255,0.55)" : "#0D0D14",
    }}>{children}</button>
  );
}

// ─── 타로카드 컴포넌트 ───
function TarotCardDisplay({card, isReversed, size="normal"}) {
  const isSmall = size === "small";
  const w = isSmall ? 90 : 140;
  const h = isSmall ? 150 : 230;
  return (
    <div style={{textAlign:"center"}}>
      <div style={{
        width:w, height:h, margin:"0 auto",
        background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
        borderRadius:10, border:`2px solid ${G}44`,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transform: isReversed ? "rotate(180deg)" : "none",
        boxShadow:`0 0 20px rgba(232,200,122,0.2)`,
        position:"relative", overflow:"hidden",
        cursor:"pointer",
      }}>
        {/* 타로 이미지 — public/tarot/[id].png */}
        <img
          src={`/tarot/${card.id}.png`}
          alt={card.name}
          style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:8}}
          onError={e => {
            // 이미지 없을 때 플레이스홀더
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* 이미지 로드 실패 시 플레이스홀더 */}
        <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:10}}>
          <div style={{fontSize:isSmall?24:36,marginBottom:6}}>🃏</div>
          <p style={{fontSize:isSmall?9:11,color:G,fontWeight:700,margin:"0 0 3px",textAlign:"center"}}>{card.name}</p>
          <p style={{fontSize:isSmall?7:9,color:"rgba(255,255,255,0.4)",margin:0,textAlign:"center"}}>{card.en}</p>
        </div>
        {/* 역방향 표시 */}
        {isReversed && (
          <div style={{position:"absolute",top:4,right:4,fontSize:8,background:"rgba(255,100,100,0.6)",color:"#fff",padding:"1px 5px",borderRadius:6,transform:"rotate(180deg)"}}>역방향</div>
        )}
      </div>
      {!isReversed && (
        <div style={{marginTop:8}}>
          <p style={{fontSize:isSmall?10:13,fontWeight:700,color:G,margin:"0 0 2px"}}>{card.name}</p>
          <p style={{fontSize:isSmall?8:10,color:"rgba(255,255,255,0.4)",margin:0}}>{card.en}</p>
        </div>
      )}
      {isReversed && (
        <div style={{marginTop:8}}>
          <p style={{fontSize:isSmall?10:13,fontWeight:700,color:"#FF7675",margin:"0 0 2px"}}>{card.name} (역방향)</p>
          <p style={{fontSize:isSmall?8:10,color:"rgba(255,255,255,0.4)",margin:0}}>{card.en}</p>
        </div>
      )}
    </div>
  );
}

// ─── 카드 셔플 애니메이션 ───
function CardShuffleAnim({onDone}) {
  const [phase, setPhase] = useState("shuffle"); // shuffle | pick | reveal
  const [picked, setPicked] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const cards = [0,1,2,3,4,5,6]; // 7장 펼치기

  useEffect(() => {
    // 1초 셔플 애니 후 카드 펼치기
    setTimeout(() => setPhase("pick"), 1200);
  }, []);

  function pickCard(idx) {
    if (phase !== "pick") return;
    setActiveIdx(idx);
    setPhase("reveal");
    const rng = seededRng(Date.now());
    const cardId = Math.floor(rng() * 78);
    const isReversed = rng() > 0.6;
    setTimeout(() => onDone(TAROT_CARDS[cardId] || TAROT_CARDS[0], isReversed), 600);
  }

  return (
    <div style={{padding:"24px 18px",textAlign:"center"}}>
      {phase === "shuffle" && (
        <>
          <p style={{fontSize:14,color:G,margin:"0 0 20px"}}>카드를 섞고 있어요...</p>
          <div style={{display:"flex",justifyContent:"center",gap:-8,position:"relative",height:100}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{
                width:60,height:95,
                background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                borderRadius:8,border:`1.5px solid ${G}44`,
                position:"absolute",
                left:`calc(50% + ${(i-1)*22}px)`,
                transform:`rotate(${(i-1)*12}deg)`,
                animation:`shuffle${i} 0.6s ease-in-out infinite alternate`,
              }}/>
            ))}
          </div>
        </>
      )}
      {(phase === "pick" || phase === "reveal") && (
        <>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:"0 0 6px"}}>
            {phase === "pick" ? "✨ 마음이 끌리는 카드를 선택하세요" : "카드를 확인하는 중..."}
          </p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 16px"}}>직관을 따라 하나만 선택해요</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
            {cards.map(i=>(
              <div key={i} onClick={()=>pickCard(i)} style={{
                width:50,height:80,
                background: activeIdx===i ? `linear-gradient(135deg,${G},#C4922A)` : "linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                borderRadius:7,border:`1.5px solid ${activeIdx===i?G:G+"33"}`,
                cursor:"pointer",transition:"all 0.2s",
                transform: activeIdx===i ? "translateY(-10px) scale(1.05)" : "none",
                boxShadow: activeIdx===i ? `0 8px 20px rgba(232,200,122,0.4)` : "none",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <span style={{fontSize:20,filter:"brightness(0.3)"}}>🃏</span>
              </div>
            ))}
          </div>
        </>
      )}
      <style>{`
        @keyframes shuffle0{from{transform:rotate(-15deg) translateX(-10px)}to{transform:rotate(-5deg) translateX(5px)}}
        @keyframes shuffle1{from{transform:rotate(0deg) translateY(-5px)}to{transform:rotate(5deg) translateY(5px)}}
        @keyframes shuffle2{from{transform:rotate(15deg) translateX(10px)}to{transform:rotate(5deg) translateX(-5px)}}
      `}</style>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 이달의 운세
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MONTHLY_MSGS = [
  {star:3, headline:"안정 속에 작은 기회가 숨어있어요", summary:"큰 변화보다 지금을 다지는 달이에요.", tip:"이달의 키워드: 내실"},
  {star:4, headline:"좋은 흐름이 이어지는 달이에요", summary:"꾸준히 해온 일이 결실을 맺기 시작해요.", tip:"이달의 키워드: 성장"},
  {star:5, headline:"최고의 기운이 흐르는 달이에요!", summary:"도전하는 모든 것에서 좋은 결과가 나와요.", tip:"이달의 키워드: 전진"},
  {star:2, headline:"에너지를 아끼고 충전하는 달이에요", summary:"무리한 도전보다 준비에 집중하세요.", tip:"이달의 키워드: 재충전"},
];
const MONTHLY_AREAS = ["총운","재물","애정","건강","직업"];
const MONTHLY_AREA_MSGS = [
  ["무난한 흐름","작은 기회가 보여요","최고의 달!","주의가 필요해요"],
];

function MonthlyUnse({isLoggedIn}) {
  const rng = seededRng(isLoggedIn ? thisMonthSeed()+999 : thisMonthSeed());
  const msg = MONTHLY_MSGS[Math.floor(rng() * MONTHLY_MSGS.length)];
  const areaScores = MONTHLY_AREAS.map(() => Math.floor(rng()*3)+3); // 3~5

  return (
    <div style={{padding:"20px 16px 0",background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      {/* 헤더 */}
      <div style={{background:DG,margin:"-20px -16px 12px",padding:"18px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatMonth()}</p>
            <h2 style={{fontSize:19,fontWeight:700,color:G,margin:0}}>✦ 이달의 운세</h2>
          </div>
          <span style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:isLoggedIn?"rgba(95,196,158,0.15)":"rgba(255,255,255,0.07)",color:isLoggedIn?"#5FC49E":"rgba(255,255,255,0.5)",border:`1px solid ${isLoggedIn?"rgba(95,196,158,0.3)":"rgba(255,255,255,0.12)"}`}}>
            {isLoggedIn?"🔮 개인화":"🌐 공통"}
          </span>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"14px"}}>
          <p style={{fontSize:15,fontWeight:600,color:"#F0EAD6",margin:"0 0 6px",lineHeight:1.6}}>"{msg.headline}"</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:G,letterSpacing:1}}>{"★".repeat(msg.star)}{"☆".repeat(5-msg.star)}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>이달의 전체 운 {msg.star}/5</span>
          </div>
        </div>
      </div>

      {/* 5가지 영역 미니 바 */}
      <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>📊 영역별 이달의 운</p>
        {MONTHLY_AREAS.map((area,i) => {
          const score = areaScores[i];
          const pct = (score/5)*100;
          const color = score>=4?"#5FC49E":score>=3?G:"#FF7675";
          return (
            <div key={area} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:12,color:"#F0EAD6",fontWeight:600}}>{area}</span>
                <span style={{fontSize:11,color:color,fontWeight:700}}>{"★".repeat(score)}</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.08)",borderRadius:99}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:99,transition:"width 1s ease"}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* 한 줄 요약 */}
      <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 8px"}}>✦ 이달의 한마디</p>
        <p style={{fontSize:13,color:"#F0EAD6",lineHeight:1.8,margin:"0 0 6px"}}>{msg.summary}</p>
        <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(232,200,122,0.1)",color:G,border:"1px solid rgba(232,200,122,0.25)"}}>{msg.tip}</span>
      </div>

      {/* 더 상세한 월별 운세 CTA */}
      <div style={{background:"linear-gradient(135deg,#1a3a1a,#0d2318)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:14,padding:"16px",textAlign:"center"}}>
        <p style={{fontSize:22,margin:"0 0 6px"}}>📅</p>
        <p style={{fontSize:13,fontWeight:700,color:G,margin:"0 0 4px"}}>월별 운세 상세 분석</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:"0 0 12px"}}>주차별 흐름 + 특별 조언 + 행운 날짜<br/>사주 기반 정밀 월별 운세 · 980원</p>
        <div style={{padding:"12px 20px",background:`linear-gradient(135deg,${G},#C4922A)`,borderRadius:12,fontSize:13,fontWeight:700,color:"#0D0D14",cursor:"pointer",display:"inline-block"}}>
          월별 운세 상세 보기 (980원) →
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 오늘의 타로
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TodayTaro() {
  const [revealed, setRevealed] = useState(false);
  const rng = seededRng(todaySeed(333));
  const cardId = Math.floor(rng() * 78);
  const card = TAROT_CARDS[cardId] || TAROT_CARDS[0];
  const isReversed = rng() > 0.65;

  const positiveCards = [0,1,3,6,7,8,10,14,17,19,20,21];
  const isGood = positiveCards.includes(card.id) && !isReversed;

  const READINGS = {
    true: [
      "오늘은 긍정적인 에너지가 당신을 감싸고 있어요. 망설이던 일을 시작하기 좋은 날이에요.",
      "카드가 오늘 좋은 기운을 보내고 있어요. 자신을 믿고 앞으로 나아가세요.",
      "오늘은 당신이 원하는 방향으로 흐름이 맞춰지는 날이에요.",
    ],
    false: [
      "오늘은 조금 신중하게 행동하는 것이 좋겠어요. 중요한 결정은 내일로 미루세요.",
      "카드가 잠시 멈추라고 말하고 있어요. 내면의 소리에 귀 기울여보세요.",
      "오늘은 에너지를 아끼고 충전하는 날로 삼으면 좋겠어요.",
    ],
  };
  const reading = pick(READINGS[String(isGood)], seededRng(todaySeed(444)));

  return (
    <div style={{background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
        <h2 style={{fontSize:19,fontWeight:700,color:G,margin:"0 0 4px"}}>🔮 오늘의 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>매일 자정 새로운 카드가 뽑혀요 · 무료</p>
      </div>
      <div style={{padding:"20px 16px"}}>
        {!revealed ? (
          <div style={{textAlign:"center"}}>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 28px",lineHeight:1.7}}>오늘 당신을 위해 한 장의 카드가 뽑혔어요.<br/>준비가 되면 카드를 열어보세요.</p>
            <div onClick={()=>setRevealed(true)} style={{
              width:140,height:230,margin:"0 auto 20px",
              background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
              borderRadius:12,border:`2px solid ${G}44`,
              cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 30px rgba(232,200,122,0.15)`,
              transition:"transform 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <span style={{fontSize:40,marginBottom:10}}>🃏</span>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>탭하여 열기</p>
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>카드를 터치해 오늘의 운을 확인하세요</p>
          </div>
        ) : (
          <div style={{textAlign:"center"}}>
            <TarotCardDisplay card={card} isReversed={isReversed}/>
            <div style={{marginTop:16,background:DG,borderRadius:14,padding:"16px",textAlign:"left"}}>
              <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 6px"}}>✦ 오늘의 카드 메시지</p>
              <p style={{fontSize:14,fontWeight:600,color:isGood?"#5FC49E":"#FF9AA2",margin:"0 0 8px"}}>{isGood?"☀️ 좋은 기운":"🌙 주의의 기운"}</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:"0 0 10px"}}>{reading}</p>
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 3px"}}>카드 키워드</p>
                <p style={{fontSize:12,color:G,fontWeight:600,margin:0}}>{card.keyword}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. YES/NO 타로
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const YESNO_ANSWERS = {
  YES: {
    color:"#5FC49E", bg:"rgba(95,196,158,0.12)", border:"rgba(95,196,158,0.3)",
    msgs: [
      "카드가 YES라고 말하고 있어요. 직관을 믿고 나아가세요!",
      "긍정의 기운이 강하게 흘러요. 지금이 적절한 타이밍이에요.",
      "우주가 당신의 선택을 응원하고 있어요. 망설이지 마세요.",
    ]
  },
  NO: {
    color:"#FF7675", bg:"rgba(255,118,117,0.1)", border:"rgba(255,118,117,0.3)",
    msgs: [
      "카드가 조심하라고 말하고 있어요. 좀 더 기다려보는 게 좋을 것 같아요.",
      "지금은 아닌 것 같아요. 타이밍을 다시 봐보세요.",
      "한 발 물러서서 더 신중하게 생각해보세요.",
    ]
  },
  글쎄요: {
    color:"#E8C87A", bg:"rgba(232,200,122,0.1)", border:"rgba(232,200,122,0.3)",
    msgs: [
      "카드가 확실한 답을 주기 어려워해요. 당신의 마음속 답이 진짜 답이에요.",
      "상황이 유동적이에요. 조금 더 시간이 지나면 명확해질 거예요.",
      "지금 당장의 결정보다 더 많은 정보를 모아보세요.",
    ]
  },
};

function YesNoTaro() {
  const [step, setStep] = useState("input"); // input | shuffle | result
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);

  function startShuffle() {
    if (!question.trim()) return;
    setStep("shuffle");
  }

  function onCardPicked(card, isReversed) {
    const yesno = getYesNo(card.id, isReversed);
    const answerData = YESNO_ANSWERS[yesno];
    const rng = seededRng(Date.now());
    const msg = pick(answerData.msgs, rng);
    setResult({card, isReversed, yesno, msg, answerData});
    setStep("result");
  }

  function reset() {
    setStep("input");
    setQuestion("");
    setResult(null);
  }

  return (
    <div style={{background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:19,fontWeight:700,color:G,margin:"0 0 4px"}}>🎴 YES/NO 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>고민을 입력하고 카드에게 물어보세요 · 무료</p>
      </div>

      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 20px"}}>
            마음속에 있는 질문 하나를 떠올리고<br/>
            <span style={{color:G}}>"YES 또는 NO로 대답할 수 있는 질문"</span>을 입력해주세요.
          </p>
          <div style={{marginBottom:16}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>예시 질문</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
              {["그 사람은 나를 좋아할까?","이직해도 될까?","지금 시작하면 성공할까?","연락해도 될까?"].map(ex=>(
                <button key={ex} onClick={()=>setQuestion(ex)} style={{padding:"6px 12px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:11,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                  {ex}
                </button>
              ))}
            </div>
            <textarea
              value={question}
              onChange={e=>setQuestion(e.target.value)}
              placeholder="질문을 입력하세요..."
              style={{width:"100%",minHeight:90,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${question?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.6}}
            />
            <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",margin:"6px 0 0",textAlign:"right"}}>{question.length}/100</p>
          </div>
          {question.trim() && (
            <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px",marginBottom:16,textAlign:"center"}}>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 4px"}}>질문</p>
              <p style={{fontSize:14,fontWeight:600,color:G,margin:0}}>"{question}"</p>
            </div>
          )}
          <GBtn onClick={startShuffle} dim={!question.trim()}>
            🃏 카드 뽑기 →
          </GBtn>
        </div>
      )}

      {step === "shuffle" && (
        <CardShuffleAnim onDone={onCardPicked}/>
      )}

      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          {/* 질문 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>질문</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",margin:0}}>"{question}"</p>
          </div>

          {/* YES/NO 결과 */}
          <div style={{background:result.answerData.bg,border:`1px solid ${result.answerData.border}`,borderRadius:16,padding:"20px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:42,fontWeight:900,color:result.answerData.color,margin:"0 0 8px",letterSpacing:4,textShadow:`0 0 20px ${result.answerData.color}66`}}>
              {result.yesno}
            </p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:0}}>{result.msg}</p>
          </div>

          {/* 카드 */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <TarotCardDisplay card={result.card} isReversed={result.isReversed}/>
          </div>

          {/* 카드 키워드 */}
          <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:16}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 뽑힌 카드</p>
            <p style={{fontSize:14,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{result.card.name} {result.isReversed?"(역방향)":""}</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 8px"}}>{result.card.en}</p>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 12px"}}>
              <p style={{fontSize:11,color:G,fontWeight:600,margin:0}}>키워드: {result.card.keyword}</p>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <GBtn onClick={reset}>다시 물어보기</GBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 꿈해몽 (무료)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function DreamInterp() {
  const [step, setStep] = useState("input"); // input | result
  const [dream, setDream] = useState("");
  const [result, setResult] = useState(null);

  function analyze() {
    if (!dream.trim()) return;
    const lower = dream.toLowerCase();
    const found = DREAM_DB.find(d => d.keywords.some(k => lower.includes(k)));
    if (found) {
      setResult({...found, isFound:true});
    } else {
      setResult({
        title:"특별한 꿈",
        good: Math.random() > 0.4,
        result:"꿈의 상징을 분석하고 있어요. 꿈은 무의식의 메시지예요.",
        detail:"입력하신 꿈의 요소를 분석한 결과, 당신의 무의식이 현재 상황을 정리하고 있는 것으로 보여요. 꿈에서 느낀 감정이 가장 중요한 단서예요. 기분이 좋았다면 길몽, 불안했다면 삶의 어떤 부분을 돌아보라는 신호일 수 있어요.",
        isFound:false,
      });
    }
    setStep("result");
  }

  return (
    <div style={{background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:19,fontWeight:700,color:G,margin:"0 0 4px"}}>🌙 꿈해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>어젯밤 꿈을 알려주세요 · 무료</p>
      </div>

      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 18px"}}>
            꿈에서 인상적인 것을 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
            {["뱀","돼지","용","이빨","물","불","하늘","죽음"].map(k=>(
              <button key={k} onClick={()=>setDream(d=>d+(d?" ":"")+k)} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>
          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="꿈 내용을 자유롭게 적어주세요... (예: 큰 뱀이 나를 감쌌어요)"
            style={{width:"100%",minHeight:100,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:14}}
          />
          <GBtn onClick={analyze} dim={!dream.trim()}>꿈 해몽하기 →</GBtn>
        </div>
      )}

      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>입력한 꿈</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",margin:0}}>"{dream}"</p>
          </div>
          {/* 길흉 판정 */}
          <div style={{background:result.good?"rgba(95,196,158,0.1)":"rgba(255,118,117,0.1)",border:`1px solid ${result.good?"rgba(95,196,158,0.3)":"rgba(255,118,117,0.3)"}`,borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center"}}>
            <p style={{fontSize:28,margin:"0 0 6px"}}>{result.good?"🌟":"⚠️"}</p>
            <p style={{fontSize:16,fontWeight:700,color:result.good?"#5FC49E":"#FF7675",margin:"0 0 6px"}}>{result.title}</p>
            <p style={{fontSize:13,color:result.good?"#5FC49E":"#FF7675",fontWeight:600}}>{result.good?"✦ 길몽":"✦ 흉몽 (주의)"}  </p>
          </div>
          {/* 해몽 결과 */}
          <div style={{background:DG,borderRadius:14,padding:"16px",marginBottom:12}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 한줄 해몽</p>
            <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",lineHeight:1.7,margin:0}}>{result.result}</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px",marginBottom:16}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 상세 해몽</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.85,margin:0}}>{result.detail}</p>
          </div>
          <GBtn onClick={()=>{setStep("input");setDream("");setResult(null);}}>다른 꿈 해몽하기</GBtn>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 태몽해몽 (유료 380원)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TaemongInterp() {
  const [step, setStep] = useState("intro"); // intro | input | loading | result
  const [dream, setDream] = useState("");
  const [result, setResult] = useState(null);
  const [loadPct, setLoadPct] = useState(0);
  const ivRef = useRef(null);

  const LOAD_MSGS = [
    "태몽 기운을 분석하는 중... 🌟",
    "아이의 사주 기운을 읽는 중... 🔮",
    "전생 인연을 확인하는 중... ✨",
    "아이의 재능을 탐색하는 중... 💫",
  ];
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadPct(0);
    let pct = 0;
    ivRef.current = setInterval(() => {
      pct = Math.min(100, pct + Math.random()*5+2);
      setLoadPct(Math.floor(pct));
      setLoadMsgIdx(i => Math.random()>0.9?(i+1)%LOAD_MSGS.length:i);
      if (pct >= 100) {
        clearInterval(ivRef.current);
        setTimeout(() => {
          const lower = dream.toLowerCase();
          const found = TAEMONG_DB.find(d => d.keywords.some(k => lower.includes(k)));
          setResult(found || {
            result:"특별한 아이가 찾아올 것 같아요.",
            gender:"미정",
            trait:"독특한 기질·개성",
          });
          setStep("result");
        }, 500);
      }
    }, 200);
    return () => clearInterval(ivRef.current);
  }, [step]);

  return (
    <div style={{background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:19,fontWeight:700,color:G,margin:"0 0 4px"}}>👶 태몽해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>태몽의 의미를 분석해드려요 · 380원</p>
      </div>

      {step === "intro" && (
        <div style={{padding:"20px 16px"}}>
          {/* 설명 */}
          <div style={{background:DG,borderRadius:14,padding:"18px",marginBottom:14}}>
            <p style={{fontSize:14,fontWeight:700,color:G,margin:"0 0 12px"}}>🌟 태몽이란?</p>
            {[
              {icon:"🤰",t:"임신 중 또는 임신 직전에 꾸는 특별한 꿈이에요"},
              {icon:"👶",t:"아이의 기질, 재능, 성별을 암시한다고 믿어져요"},
              {icon:"🔮",t:"꿈의 상징을 분석해 아이의 운명을 미리 엿볼 수 있어요"},
            ].map(({icon,t})=>(
              <div key={t} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>{t}</p>
              </div>
            ))}
          </div>
          {/* 가격 안내 */}
          <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>AI 태몽 분석</p>
            <p style={{fontSize:26,fontWeight:700,color:G,margin:"0 0 4px"}}>380원</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>태몽 상세 분석 + 아이 기질 예측 + 이름 방향 제안</p>
          </div>
          <GBtn onClick={()=>setStep("input")}>태몽 분석 시작하기 →</GBtn>
        </div>
      )}

      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 16px"}}>
            태몽 내용을 자세히 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
            {["호랑이","용","꽃","복숭아","돼지","태양","달","구렁이"].map(k=>(
              <button key={k} onClick={()=>setDream(d=>d+(d?" ":"")+k)} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>
          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="태몽 내용을 입력하세요... (예: 커다란 호랑이가 품 안으로 들어왔어요)"
            style={{width:"100%",minHeight:100,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.6,marginBottom:14}}
          />
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <GBtn onClick={()=>{if(dream.trim())setStep("loading");}} dim={!dream.trim()}>
              태몽 분석하기 (380원) →
            </GBtn>
            <GBtn onClick={()=>setStep("intro")} dim>이전으로</GBtn>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div style={{padding:"40px 16px",textAlign:"center"}}>
          <div style={{fontSize:50,marginBottom:14}}>👶</div>
          <p style={{fontSize:14,fontWeight:700,color:G,margin:"0 0 16px"}}>태몽 분석 중...</p>
          <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:`${loadPct}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.18s"}}/>
          </div>
          <p style={{fontSize:12,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",minHeight:22}}>{LOAD_MSGS[loadMsgIdx]}</p>
        </div>
      )}

      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <p style={{fontSize:34,margin:"0 0 4px"}}>✨</p>
            <p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>태몽 분석 완료!</p>
          </div>
          {/* 성별 예측 */}
          <div style={{background:result.gender==="아들"?"rgba(100,150,255,0.1)":result.gender==="딸"?"rgba(255,150,180,0.1)":"rgba(232,200,122,0.08)",border:`1px solid ${result.gender==="아들"?"rgba(100,150,255,0.3)":result.gender==="딸"?"rgba(255,150,180,0.3)":"rgba(232,200,122,0.2)"}`,borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center"}}>
            <p style={{fontSize:28,margin:"0 0 6px"}}>{result.gender==="아들"?"👦":result.gender==="딸"?"👧":"🌟"}</p>
            <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>
              {result.gender==="미정"?"성별 예측 불확실":result.gender+" 예측"}
            </p>
            <span style={{fontSize:11,padding:"3px 12px",borderRadius:20,background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)"}}>
              참고용 · 실제와 다를 수 있어요
            </span>
          </div>
          {/* 해몽 */}
          <div style={{background:DG,borderRadius:14,padding:"16px",marginBottom:12}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 태몽 해석</p>
            <p style={{fontSize:13,color:"#F0EAD6",lineHeight:1.8,margin:"0 0 10px"}}>{result.result}</p>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:10,padding:"10px 12px"}}>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>✦ 아이의 기질 예측</p>
              <p style={{fontSize:13,fontWeight:600,color:G,margin:0}}>{result.trait}</p>
            </div>
          </div>
          {/* 이름 제안 방향 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"16px",marginBottom:16}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 이름 방향 제안</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.8,margin:0}}>
              {result.trait}의 기질을 가진 아이에게는 강함과 유연함을 동시에 담은 이름이 잘 어울려요.
              천기의 <span style={{color:G}}>아기 이름 짓기 서비스</span>와 연결하면 더 정확한 이름을 추천받을 수 있어요.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <GBtn onClick={()=>{}} color={`linear-gradient(135deg,#9B59B6,#6C3483)`}>
              👶 아기 이름 짓기 연결 (1,980원)
            </GBtn>
            <GBtn onClick={()=>{setStep("intro");setDream("");setResult(null);}} dim>다시 분석하기</GBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TABS = [
  {id:"monthly", label:"📅 이달"},
  {id:"todaytaro", label:"🔮 타로"},
  {id:"yesno", label:"🎴 YES/NO"},
  {id:"dream", label:"🌙 꿈해몽"},
  {id:"taemong", label:"👶 태몽"},
];

export default function 천기콘텐츠미리보기() {
  const [tab, setTab] = useState("monthly");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif"}}>
      {/* 탑바 */}
      <div style={{background:"#0a0f1a",padding:"8px 12px",display:"flex",gap:5,alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.07)",overflowX:"auto",scrollbarWidth:"none"}}>
        {TABS.map(({id,label})=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            flexShrink:0,padding:"5px 11px",border:"none",borderRadius:20,cursor:"pointer",
            fontSize:10,fontWeight:700,fontFamily:"inherit",
            background:tab===id?G:"rgba(255,255,255,0.08)",
            color:tab===id?"#0D0D14":"rgba(255,255,255,0.45)",
          }}>{label}</button>
        ))}
        <button onClick={()=>setIsLoggedIn(v=>!v)} style={{marginLeft:"auto",flexShrink:0,padding:"5px 10px",border:"none",borderRadius:20,cursor:"pointer",fontSize:9,fontFamily:"inherit",background:isLoggedIn?"rgba(95,196,158,0.17)":"rgba(255,255,255,0.07)",color:isLoggedIn?"#5FC49E":"rgba(255,255,255,0.38)"}}>
          {isLoggedIn?"🔮":"🌐"}
        </button>
      </div>

      {tab==="monthly"   && <MonthlyUnse isLoggedIn={isLoggedIn}/>}
      {tab==="todaytaro" && <TodayTaro/>}
      {tab==="yesno"     && <YesNoTaro/>}
      {tab==="dream"     && <DreamInterp/>}
      {tab==="taemong"   && <TaemongInterp/>}

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
