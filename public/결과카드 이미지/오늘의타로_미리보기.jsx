import { useState, useEffect, useRef } from "react";

const G  = "#E8C87A";
const DG = "#0D2318";

const TAROT_CARDS = [
  {id:0,  name:"바보",            en:"The Fool",           keyword:"새로운 시작, 모험, 순수함",    positive:true},
  {id:1,  name:"마법사",          en:"The Magician",        keyword:"의지력, 창조, 집중",           positive:true},
  {id:2,  name:"여사제",          en:"The High Priestess",  keyword:"직관, 신비, 잠재력",          positive:true},
  {id:3,  name:"여황제",          en:"The Empress",         keyword:"풍요, 창조성, 자연",          positive:true},
  {id:4,  name:"황제",            en:"The Emperor",         keyword:"권위, 안정, 리더십",          positive:true},
  {id:5,  name:"교황",            en:"The Hierophant",      keyword:"전통, 신념, 안내",            positive:true},
  {id:6,  name:"연인",            en:"The Lovers",          keyword:"사랑, 선택, 조화",            positive:true},
  {id:7,  name:"전차",            en:"The Chariot",         keyword:"승리, 의지, 전진",            positive:true},
  {id:8,  name:"힘",              en:"Strength",            keyword:"용기, 인내, 자제력",          positive:true},
  {id:9,  name:"은둔자",          en:"The Hermit",          keyword:"내면탐구, 고독, 지혜",        positive:true},
  {id:10, name:"운명의 수레바퀴", en:"Wheel of Fortune",    keyword:"변화, 운명, 순환",            positive:true},
  {id:11, name:"정의",            en:"Justice",             keyword:"균형, 진실, 인과",            positive:true},
  {id:12, name:"매달린 사람",     en:"The Hanged Man",      keyword:"희생, 새 관점, 대기",         positive:false},
  {id:13, name:"죽음",            en:"Death",               keyword:"변환, 끝과 시작, 해방",       positive:false},
  {id:14, name:"절제",            en:"Temperance",          keyword:"조화, 균형, 인내",            positive:true},
  {id:15, name:"악마",            en:"The Devil",           keyword:"속박, 욕망, 물질주의",        positive:false},
  {id:16, name:"탑",              en:"The Tower",           keyword:"갑작스런 변화, 해방",         positive:false},
  {id:17, name:"별",              en:"The Star",            keyword:"희망, 영감, 치유",            positive:true},
  {id:18, name:"달",              en:"The Moon",            keyword:"환상, 불안, 무의식",          positive:false},
  {id:19, name:"태양",            en:"The Sun",             keyword:"성공, 기쁨, 활력",            positive:true},
  {id:20, name:"심판",            en:"Judgement",           keyword:"부활, 반성, 전환점",          positive:true},
  {id:21, name:"세계",            en:"The World",           keyword:"완성, 통합, 성취",            positive:true},
  {id:22, name:"완드 에이스",     en:"Ace of Wands",        keyword:"새 에너지, 창의력, 열정",     positive:true},
  {id:23, name:"컵 에이스",       en:"Ace of Cups",         keyword:"새 감정, 직관, 사랑",         positive:true},
  {id:24, name:"소드 에이스",     en:"Ace of Swords",       keyword:"명료함, 진실, 돌파구",        positive:true},
  {id:25, name:"펜타클 에이스",   en:"Ace of Pentacles",    keyword:"물질적 시작, 기회, 번영",     positive:true},
  {id:26, name:"완드 5",          en:"Five of Wands",       keyword:"경쟁, 갈등, 도전",            positive:false},
  {id:27, name:"컵 5",            en:"Five of Cups",        keyword:"상실, 후회, 슬픔",            positive:false},
  {id:28, name:"소드 5",          en:"Five of Swords",      keyword:"패배, 갈등, 손실",            positive:false},
  {id:29, name:"펜타클 5",        en:"Five of Pentacles",   keyword:"어려움, 결핍, 시련",          positive:false},
  {id:30, name:"완드 4",          en:"Four of Wands",       keyword:"축하, 조화, 안정",            positive:true},
  {id:31, name:"컵 2",            en:"Two of Cups",         keyword:"파트너십, 유대, 상호이해",    positive:true},
  {id:32, name:"소드 4",          en:"Four of Swords",      keyword:"휴식, 회복, 명상",            positive:true},
  {id:33, name:"펜타클 3",        en:"Three of Pentacles",  keyword:"팀워크, 역량, 협력",          positive:true},
  {id:34, name:"완드 3",          en:"Three of Wands",      keyword:"확장, 리더십, 탐험",          positive:true},
  {id:35, name:"컵 3",            en:"Three of Cups",       keyword:"우정, 축하, 창의성",          positive:true},
  {id:36, name:"소드 2",          en:"Two of Swords",       keyword:"교착, 결정장애, 갈등",        positive:false},
  {id:37, name:"펜타클 2",        en:"Two of Pentacles",    keyword:"균형, 유연성, 시간관리",      positive:true},
  {id:38, name:"완드 2",          en:"Two of Wands",        keyword:"계획, 미래 비전, 결정",       positive:true},
  {id:39, name:"컵 4",            en:"Four of Cups",        keyword:"명상, 재평가, 내면탐구",      positive:false},
  {id:40, name:"소드 3",          en:"Three of Swords",     keyword:"슬픔, 이별, 상처",            positive:false},
  {id:41, name:"펜타클 4",        en:"Four of Pentacles",   keyword:"안정, 소유, 절약",            positive:true},
];
// 나머지 42~77 채우기
for(let i=42;i<78;i++) TAROT_CARDS.push({id:i,name:`카드 ${i}`,en:`Card ${i}`,keyword:"신비로운 기운이 흐릅니다",positive:i%3!==0});

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + 333;
}
function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

const READINGS_GOOD = [
  "오늘은 긍정적인 에너지가 당신을 감싸고 있어요. 망설이던 일을 시작하기 좋은 날이에요.",
  "카드가 밝은 기운을 보내고 있어요. 자신을 믿고 앞으로 나아가세요.",
  "오늘은 원하는 방향으로 흐름이 맞춰지는 날이에요. 기회가 보이면 잡으세요.",
];
const READINGS_BAD = [
  "오늘은 조금 신중하게 행동하는 것이 좋겠어요. 중요한 결정은 내일로 미루세요.",
  "카드가 잠시 멈추라고 말하고 있어요. 내면의 소리에 귀 기울여보세요.",
  "오늘은 에너지를 아끼고 충전하는 날로 삼으면 좋겠어요.",
];

function CardBack({ size=90 }) {
  return (
    <div style={{
      width:size, height:size*1.6,
      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
      borderRadius:size*0.08,
      border:`1.5px solid ${G}33`,
      display:"flex",alignItems:"center",justifyContent:"center",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",inset:5,border:`1px solid ${G}18`,borderRadius:size*0.05,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 4px,${G}07 4px,${G}07 5px)`}}/>
      <span style={{fontSize:size*0.25,filter:"brightness(0.35)",position:"relative",zIndex:1}}>🃏</span>
    </div>
  );
}

function CardFront({ card, isReversed, size=130 }) {
  return (
    <div style={{
      width:size, height:size*1.6,
      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
      borderRadius:size*0.08,
      border:`2px solid ${isReversed?"#FF7675":G}88`,
      overflow:"hidden",position:"relative",
      transform:isReversed?"rotate(180deg)":"none",
      boxShadow:`0 0 30px ${isReversed?"rgba(255,118,117,0.35)":"rgba(232,200,122,0.35)"}`,
    }}>
      <img src={`/tarot/${card.id}.png`} alt={card.name}
        style={{width:"100%",height:"100%",objectFit:"cover"}}
        onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
      />
      <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:12,position:"absolute",inset:0}}>
        <span style={{fontSize:size*0.3,marginBottom:8}}>🃏</span>
        <p style={{fontSize:size*0.1,color:G,fontWeight:700,textAlign:"center",margin:"0 0 3px"}}>{card.name}</p>
        <p style={{fontSize:size*0.08,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:0}}>{card.en}</p>
      </div>
      {isReversed && (
        <div style={{position:"absolute",top:6,right:6,fontSize:8,background:"rgba(255,80,80,0.85)",color:"#fff",padding:"2px 6px",borderRadius:5,transform:"rotate(180deg)"}}>역방향</div>
      )}
    </div>
  );
}

export default function TodayTaro() {
  const [step,      setStep]      = useState("intro");
  const [activeIdx, setActiveIdx] = useState(null);
  const [result,    setResult]    = useState(null);
  const timerRef = useRef(null);

  // 오늘의 카드 (날짜 고정)
  const rng0      = seededRng(todaySeed());
  const cardId    = Math.floor(rng0() * 78);
  const card      = TAROT_CARDS[cardId % TAROT_CARDS.length];
  const isReversed = rng0() > 0.65;
  const isGood    = card.positive && !isReversed;
  const rng1      = seededRng(todaySeed()+1);
  const reading   = isGood
    ? READINGS_GOOD[Math.floor(rng1()*READINGS_GOOD.length)]
    : READINGS_BAD[Math.floor(rng1()*READINGS_BAD.length)];

  useEffect(() => {
    if (step !== "shuffle") return;
    timerRef.current = setTimeout(() => setStep("spread"), 1500);
    return () => clearTimeout(timerRef.current);
  }, [step]);

  function pickCard(idx) {
    if (step !== "spread") return;
    setActiveIdx(idx);
    setStep("flipping");
    setTimeout(() => {
      setResult({ card, isReversed, isGood, reading });
      setStep("result");
    }, 600);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🔮 오늘의 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>매일 한 장의 카드가 당신을 기다려요 · 무료</p>
      </div>

      {step === "intro" && (
        <div style={{padding:"32px 16px",textAlign:"center"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.8,margin:"0 0 32px"}}>
            오늘 당신을 위해 한 장의 카드가 준비되어 있어요.<br/>
            <span style={{color:G}}>카드를 섞고 직관을 따라 한 장을 선택하세요.</span>
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:32,alignItems:"center"}}>
            {[-10,0,10].map((deg,i)=>(
              <div key={i} style={{transform:`rotate(${deg}deg) translateY(${i===1?-8:0}px)`}}>
                <CardBack size={80}/>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep("shuffle")} style={{
            padding:"16px 32px",background:`linear-gradient(135deg,${G},#C4922A)`,
            border:"none",borderRadius:14,fontSize:15,fontWeight:700,
            color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",
            boxShadow:`0 4px 20px rgba(232,200,122,0.3)`,
          }}>
            🃏 카드 섞기
          </button>
        </div>
      )}

      {step === "shuffle" && (
        <div style={{padding:"32px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,color:G,fontWeight:600,margin:"0 0 32px"}}>카드를 섞고 있어요...</p>
          <div style={{position:"relative",height:160,display:"flex",justifyContent:"center",alignItems:"flex-end",marginBottom:16}}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{
                position:"absolute",bottom:0,left:"calc(50% - 38px)",
                animation:`sh${i} 0.6s ease-in-out infinite alternate`,
                animationDelay:`${i*0.11}s`,
              }}>
                <CardBack size={76}/>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes sh0{from{transform:translateX(-56px) rotate(-18deg)}to{transform:translateX(-28px) rotate(-7deg)}}
            @keyframes sh1{from{transform:translateX(-18px) rotate(-5deg) translateY(-8px)}to{transform:translateX(12px) rotate(5deg) translateY(4px)}}
            @keyframes sh2{from{transform:rotate(-2deg) translateY(-14px)}to{transform:rotate(4deg) translateY(0)}}
            @keyframes sh3{from{transform:translateX(18px) rotate(7deg) translateY(-4px)}to{transform:translateX(-4px) rotate(-2deg) translateY(7px)}}
            @keyframes sh4{from{transform:translateX(52px) rotate(17deg)}to{transform:translateX(24px) rotate(6deg)}}
          `}</style>
        </div>
      )}

      {(step === "spread" || step === "flipping") && (
        <div style={{padding:"24px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:600,color:G,margin:"0 0 5px"}}>✨ 마음이 끌리는 카드를 선택하세요</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 20px"}}>직관을 따라 딱 하나만</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
            {Array.from({length:7},(_,i)=>{
              const isAct = activeIdx===i;
              return (
                <div key={i} onClick={()=>pickCard(i)} style={{
                  width:48, height:78,
                  background: isAct?`linear-gradient(135deg,${G},#C4922A)`:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                  borderRadius:7,
                  border:`1.5px solid ${isAct?G:G+"33"}`,
                  cursor:step==="spread"?"pointer":"default",
                  transition:"all 0.2s",
                  transform:isAct?"translateY(-12px) scale(1.08)":"none",
                  boxShadow:isAct?`0 10px 24px rgba(232,200,122,0.45)`:"none",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <span style={{fontSize:18,filter:isAct?"none":"brightness(0.25)"}}>🃏</span>
                </div>
              );
            })}
          </div>
          {step==="flipping" && (
            <p style={{fontSize:12,color:G,fontWeight:600,marginTop:16}}>카드를 확인하는 중...</p>
          )}
        </div>
      )}

      {step === "result" && result && (
        <div style={{padding:"24px 16px"}}>
          <div style={{textAlign:"center",marginBottom:20,animation:"revealCard 0.55s cubic-bezier(0.34,1.56,0.64,1) both"}}>
            <div style={{display:"inline-block"}}>
              <CardFront card={result.card} isReversed={result.isReversed} size={130}/>
            </div>
            <div style={{marginTop:14}}>
              <p style={{fontSize:15,fontWeight:700,color:result.isReversed?"#FF7675":G,margin:"0 0 3px"}}>
                {result.card.name}{result.isReversed?" (역방향)":""}
              </p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{result.card.en}</p>
            </div>
          </div>
          <div style={{background:DG,borderRadius:14,padding:"16px",marginBottom:10}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 10px"}}>✦ 오늘의 카드 메시지</p>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:24}}>{result.isGood?"☀️":"🌙"}</span>
              <p style={{fontSize:15,fontWeight:700,color:result.isGood?"#5FC49E":"#FF9AA2",margin:0}}>
                {result.isGood?"좋은 기운의 날":"주의가 필요한 날"}
              </p>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:"0 0 12px"}}>{result.reading}</p>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px"}}>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:"0 0 4px",letterSpacing:1}}>카드 키워드</p>
              <p style={{fontSize:12,color:G,fontWeight:600,margin:0}}>{result.card.keyword}</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",marginBottom:10,textAlign:"center"}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>🌙 내일 자정이 지나면 새로운 카드가 뽑혀요</p>
          </div>
          <button onClick={()=>{setStep("intro");setActiveIdx(null);setResult(null);}} style={{
            width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,
            fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit",
          }}>← 처음으로</button>
          <style>{`@keyframes revealCard{from{transform:rotateY(90deg) scale(0.8);opacity:0}to{transform:rotateY(0) scale(1);opacity:1}}`}</style>
        </div>
      )}
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
