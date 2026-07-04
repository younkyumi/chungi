import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const G  = "#E8C87A";
const DG = "#0D2318";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타로 카드 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CARDS = [
  {id:0,  name:"바보",            en:"The Fool",           keyword:"새로운 시작, 모험"},
  {id:1,  name:"마법사",          en:"The Magician",        keyword:"의지력, 창조"},
  {id:2,  name:"여사제",          en:"The High Priestess",  keyword:"직관, 잠재력"},
  {id:3,  name:"여황제",          en:"The Empress",         keyword:"풍요, 자연"},
  {id:4,  name:"황제",            en:"The Emperor",         keyword:"권위, 안정"},
  {id:5,  name:"교황",            en:"The Hierophant",      keyword:"전통, 안내"},
  {id:6,  name:"연인",            en:"The Lovers",          keyword:"사랑, 조화"},
  {id:7,  name:"전차",            en:"The Chariot",         keyword:"승리, 전진"},
  {id:8,  name:"힘",              en:"Strength",            keyword:"용기, 인내"},
  {id:9,  name:"은둔자",          en:"The Hermit",          keyword:"내면탐구, 지혜"},
  {id:10, name:"운명의 수레바퀴", en:"Wheel of Fortune",    keyword:"변화, 순환"},
  {id:11, name:"정의",            en:"Justice",             keyword:"균형, 진실"},
  {id:12, name:"매달린 사람",     en:"The Hanged Man",      keyword:"희생, 대기"},
  {id:13, name:"죽음",            en:"Death",               keyword:"변환, 해방"},
  {id:14, name:"절제",            en:"Temperance",          keyword:"조화, 인내"},
  {id:15, name:"악마",            en:"The Devil",           keyword:"속박, 욕망"},
  {id:16, name:"탑",              en:"The Tower",           keyword:"갑작스런 변화"},
  {id:17, name:"별",              en:"The Star",            keyword:"희망, 치유"},
  {id:18, name:"달",              en:"The Moon",            keyword:"환상, 무의식"},
  {id:19, name:"태양",            en:"The Sun",             keyword:"성공, 기쁨"},
  {id:20, name:"심판",            en:"Judgement",           keyword:"전환점, 반성"},
  {id:21, name:"세계",            en:"The World",           keyword:"완성, 성취"},
  ...Array.from({length:56}, (_,i)=>({id:22+i, name:`${["완드","컵","소드","펜타클"][Math.floor(i/14)]} ${(i%14)+2}`, en:`Card ${22+i}`, keyword:"신비로운 기운"}))
];

function seededRng(seed) {
  let s=(seed>>>0)||1;
  return ()=>{ s=(s*1664525+1013904223)>>>0; return s/0x100000000; };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타로 종류 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TARO_TYPES = {
  money: {
    id:"money", emoji:"💰", name:"재물 타로", badge:"인기",
    desc:"5장 — 내 지갑 언제 빵빵해질까?", cardCount:5, price:980,
    positions:["현재 재물 상태","장애물","숨겨진 기회","단기 전망","최종 조언"],
    question:"돈에 관해 가장 궁금한 건?",
    qOpts:["💰 언제 돈이 들어올까","📈 투자/사업 방향","💳 지출을 줄여야 할까","🎯 재물운의 흐름"],
    loading:["금고 자물쇠 따는 중... 🔐","재물신 호출 중... 💸","돈이 오는 방향 추적 중... 🧭","지갑 기운 스캔 중... 👛"],
    results:{
      good:["재물 기운이 강하게 상승하고 있어요. 곧 좋은 소식이 들려올 것 같아요.","이 카드는 돈이 들어오는 경로가 열리고 있음을 의미해요.","지금 당장은 아니더라도 착실한 준비가 빛을 발하는 시기예요."],
      bad:["지출을 줄이고 내실을 다져야 할 시기예요.","무리한 투자보다 안정을 택하는 것이 현명해요.","잠시 재정적 여유를 만드는 데 집중하세요."],
    }
  },
  love: {
    id:"love", emoji:"💘", name:"연애 타로", badge:null,
    desc:"3장 — 그 사람의 진짜 속마음은?", cardCount:3, price:980,
    positions:["상대방의 현재 마음","우리 관계의 흐름","앞으로의 전망"],
    question:"연애에서 가장 궁금한 건?",
    qOpts:["💕 그 사람이 나를 좋아할까","💍 우리 결혼할 수 있을까","💔 헤어진 사람과 다시 될까","🆕 새로운 인연이 올까"],
    loading:["월하노인 전화 연결 중... ☎️","붉은 실 연결 상태 확인 중... 🧶","두 사람의 기운 분석 중... 💫","인연의 실 측정 중... ❤️"],
    results:{
      good:["상대방의 마음이 당신을 향하고 있어요. 조금 더 적극적으로 나서보세요.","두 사람 사이의 기운이 점점 가까워지고 있어요.","좋은 인연이 가까이 있어요. 눈을 크게 뜨고 주변을 살펴보세요."],
      bad:["지금은 서로에게 여유가 필요한 시기예요.","조급하게 행동하기보다 자연스럽게 흘러가도록 두세요.","상대방의 마음이 아직 정해지지 않았어요. 기다리는 것이 좋겠어요."],
    }
  },
  health: {
    id:"health", emoji:"🌿", name:"건강 타로", badge:null,
    desc:"3장 — 타로가 경고하는 건강운", cardCount:3, price:980,
    positions:["현재 몸의 상태","주의해야 할 부분","건강을 위한 조언"],
    question:"건강에서 가장 신경 쓰이는 건?",
    qOpts:["😴 피로와 수면 문제","💪 운동/다이어트","🧠 스트레스/멘탈","🏥 특정 건강 고민"],
    loading:["몸의 기운 스캔 중... 🌿","오장육부 에너지 측정 중... 🔍","건강 경고 신호 분석 중... ⚠️","회복 에너지 계산 중... 💪"],
    results:{
      good:["전반적인 건강 기운이 좋아요. 지금의 생활 습관을 유지하세요.","몸이 회복 중이에요. 충분한 휴식을 취하면 더욱 좋아질 거예요.","에너지가 충만한 시기예요. 운동을 시작하기 좋은 때예요."],
      bad:["몸이 보내는 신호에 귀 기울여야 할 시기예요.","과로와 스트레스를 줄이는 것이 시급해요.","작은 증상도 무시하지 마세요. 검진을 받아보는 게 좋겠어요."],
    }
  },
  career: {
    id:"career", emoji:"🎯", name:"진로 타로", badge:null,
    desc:"5장 — 뒤사할까? 고민 끝내줄 해답", cardCount:5, price:980,
    positions:["현재 상황","내면의 욕구","외부 환경","선택의 결과","최종 방향"],
    question:"진로에서 가장 고민되는 건?",
    qOpts:["🔄 이직/전직해야 할까","🚀 창업/사업 시작할까","📚 공부/자격증 방향","🌏 현재 직장 계속 다닐까"],
    loading:["운명의 직업 데이터베이스 조회 중... 💼","천기에 새겨진 재능 분석 중... ✨","커리어 경로 탐색 중... 🗺️","성공 확률 계산 중... 📊"],
    results:{
      good:["지금이 변화를 시도하기 좋은 시기예요. 두려워하지 말고 나아가세요.","당신의 재능이 빛을 발할 기회가 다가오고 있어요.","준비해온 것들이 드디어 인정받을 때가 됐어요."],
      bad:["지금은 변화보다 현 상황을 다지는 것이 좋아요.","섣부른 결정보다 더 많은 정보를 모으고 결정하세요.","잠시 방향을 재검토하는 시간이 필요해요."],
    }
  },
  life: {
    id:"life", emoji:"🌟", name:"인생 타로", badge:"한정판",
    desc:"10장 — 켈틱크로스 — 내 인생 지도", cardCount:10, price:980,
    positions:["현재 상황","장애물","기반/과거","최근 과거","가능한 미래","가까운 미래","자신의 태도","외부 환경","희망과 두려움","최종 결과"],
    question:"지금 인생에서 가장 중요한 건?",
    qOpts:["🌱 전반적인 인생 방향","💫 올해 운의 흐름","🔮 5년 후 내 모습","🎯 지금 가장 중요한 결정"],
    loading:["아카식 레코드 접속 중... 📜","10개의 운명 경로 탐색 중... 🌌","전생 데이터 다운로드 중... ⚡","인생 지도 렌더링 중... 🗺️","켈틱크로스 배열 완성 중... ✦"],
    results:{
      good:["당신의 인생은 지금 중요한 전환점에 있어요. 두려워하지 마세요.","10장의 카드가 말하는 당신의 운명은 생각보다 훨씬 풍요로워요.","지금의 어려움은 더 큰 성장을 위한 준비 과정이에요."],
      bad:["인생의 흐름을 다시 점검해야 할 시기예요.","내면의 두려움이 앞길을 막고 있어요. 용기를 내야 해요.","잠시 멈추고 진짜 원하는 것이 무엇인지 생각해보세요."],
    }
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 공통 UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Sheet({children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:430,background:DG,borderRadius:"20px 20px 0 0",maxHeight:"92vh",overflowY:"auto",fontFamily:"'Noto Serif KR',serif",paddingBottom:40}}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"12px auto 0"}}/>
        {children}
      </div>
    </div>
  );
}

function GBtn({children, onClick, dim=false, color=null}) {
  return (
    <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:color||(dim?"rgba(255,255,255,0.09)":`linear-gradient(135deg,${G},#C4922A)`),color:dim?"rgba(255,255,255,0.55)":"#0D0D14"}}>
      {children}
    </button>
  );
}

function CardBack({size=72}) {
  return (
    <div style={{width:size,height:size*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:size*0.08,border:`1.5px solid ${G}33`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:4,border:`1px solid ${G}15`,borderRadius:size*0.06,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 4px,${G}06 4px,${G}06 5px)`}}/>
      <span style={{fontSize:size*0.25,filter:"brightness(0.35)",position:"relative",zIndex:1}}>🃏</span>
    </div>
  );
}

function CardFront({card, isReversed, size=110}) {
  return (
    <div style={{width:size,height:size*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:size*0.08,border:`2px solid ${G}77`,overflow:"hidden",position:"relative",transform:isReversed?"rotate(180deg)":"none",boxShadow:`0 0 24px rgba(232,200,122,0.3)`}}>
      <img src={`/tarot/${card.id}.png`} alt={card.name} style={{width:"100%",height:"100%",objectFit:"cover"}}
        onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
      <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:10,position:"absolute",inset:0}}>
        <span style={{fontSize:size*0.28,marginBottom:6}}>🃏</span>
        <p style={{fontSize:size*0.1,color:G,fontWeight:700,textAlign:"center",margin:"0 0 2px"}}>{card.name}</p>
        <p style={{fontSize:size*0.08,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:0}}>{card.en}</p>
      </div>
      {isReversed&&<div style={{position:"absolute",top:4,right:4,fontSize:8,background:"rgba(255,80,80,0.8)",color:"#fff",padding:"1px 5px",borderRadius:5,transform:"rotate(180deg)"}}>역방향</div>}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타로 플로우 팝업
// step: who → question → shuffle → spread → payment → loading → result
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TaroFlow({taro, onClose}) {
  const [step,      setStep]      = useState("who");
  const [qAnswer,   setQAnswer]   = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [drawnCards,setDrawnCards]= useState([]);
  const [loadPct,   setLoadPct]   = useState(0);
  const [loadMsgIdx,setLoadMsgIdx]= useState(0);
  const [openCard,  setOpenCard]  = useState(null);
  const ivRef = useRef(null);

  // 카드 생성
  const rng = seededRng(Date.now());
  const picked = Array.from({length:taro.cardCount}, (_,i)=>{
    const id = Math.floor(seededRng(Date.now()+i*137)()*78);
    return {card:CARDS[id%CARDS.length], isReversed:seededRng(Date.now()+i*999)()>0.6, pos:taro.positions[i]};
  });

  // 로딩 타이머
  useEffect(()=>{
    if(step!=="loading") return;
    setLoadPct(0); setLoadMsgIdx(0);
    let pct=0;
    ivRef.current=setInterval(()=>{
      pct=Math.min(100,pct+Math.random()*5+2);
      setLoadPct(Math.floor(pct));
      if(Math.random()>0.88) setLoadMsgIdx(i=>(i+1)%taro.loading.length);
      if(pct>=100){ clearInterval(ivRef.current); setDrawnCards(picked); setTimeout(()=>setStep("result"),600); }
    },180);
    return ()=>clearInterval(ivRef.current);
  },[step]);

  // ── 누구의 타로? ──
  if(step==="who") return (
    <Sheet>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{taro.emoji} 누구의 {taro.name}을(를) 볼까요?</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 18px"}}>등록된 인물을 선택하거나 새로 추가하세요</p>
        {/* 등록 인물 */}
        <button onClick={()=>setStep("question")} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.15)",padding:"1px 7px",borderRadius:10}}>본인</span></p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>2028-04-07 · 양력</p>
          </div>
          <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.3)",fontSize:16}}>›</span>
        </button>
        <button onClick={()=>setStep("question")} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.3)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>
          + 새 인물 추가하고 시작
        </button>
        <div style={{height:8}}/>
        <GBtn onClick={onClose} dim>취소</GBtn>
      </div>
    </Sheet>
  );

  // ── 사전 질문 ──
  if(step==="question") return (
    <Sheet>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:11,color:G,letterSpacing:2,margin:"0 0 4px"}}>🎯 더 정확한 분석을 위해</p>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 16px"}}>{taro.question}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {taro.qOpts.map(opt=>(
            <button key={opt} onClick={()=>setQAnswer(opt)} style={{
              padding:"14px 10px",borderRadius:12,cursor:"pointer",fontSize:12,
              fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",
              background:qAnswer===opt?"rgba(232,200,122,0.13)":"rgba(255,255,255,0.05)",
              outline:qAnswer===opt?`1.5px solid ${G}`:"1.5px solid rgba(255,255,255,0.1)",
              color:qAnswer===opt?G:"rgba(255,255,255,0.6)",transition:"0.15s",
            }}>{opt}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={()=>{if(qAnswer)setStep("shuffle");}} dim={!qAnswer}>
            카드 섞기 시작 →
          </GBtn>
          <GBtn onClick={()=>setStep("who")} dim>이전으로</GBtn>
        </div>
      </div>
    </Sheet>
  );

  // ── 셔플 ──
  if(step==="shuffle") {
    useEffect(()=>{ setTimeout(()=>setStep("spread"),1400); },[]);
    return (
      <Sheet>
        <div style={{padding:"32px 18px",textAlign:"center"}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 4px"}}>{taro.name} · {taro.cardCount}장</p>
          <p style={{fontSize:14,color:G,fontWeight:600,margin:"0 0 28px"}}>카드를 섞고 있어요...</p>
          <div style={{position:"relative",height:150,display:"flex",justifyContent:"center",alignItems:"flex-end",marginBottom:16}}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{position:"absolute",bottom:0,left:"calc(50% - 36px)",animation:`sh${i} 0.65s ease-in-out infinite alternate`,animationDelay:`${i*0.11}s`}}>
                <CardBack size={72}/>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes sh0{from{transform:translateX(-54px) rotate(-17deg)}to{transform:translateX(-27px) rotate(-7deg)}}
            @keyframes sh1{from{transform:translateX(-17px) rotate(-5deg) translateY(-9px)}to{transform:translateX(11px) rotate(4deg) translateY(4px)}}
            @keyframes sh2{from{transform:rotate(-2deg) translateY(-13px)}to{transform:rotate(4deg) translateY(0)}}
            @keyframes sh3{from{transform:translateX(17px) rotate(6deg) translateY(-4px)}to{transform:translateX(-4px) rotate(-2deg) translateY(7px)}}
            @keyframes sh4{from{transform:translateX(50px) rotate(16deg)}to{transform:translateX(23px) rotate(6deg)}}
          `}</style>
        </div>
      </Sheet>
    );
  }

  // ── 카드 고르기 ──
  if(step==="spread") return (
    <Sheet>
      <div style={{padding:"24px 18px",textAlign:"center"}}>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 4px"}}>{taro.cardCount}장을 차례로 선택하세요</p>
        <p style={{fontSize:14,fontWeight:600,color:G,margin:"0 0 6px"}}>✨ 마음이 끌리는 카드를 선택하세요</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 22px"}}>직관을 따라 하나씩</p>
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginBottom:20}}>
          {Array.from({length:7},(_,i)=>{
            const isAct=activeIdx===i;
            return (
              <div key={i} onClick={()=>{ setActiveIdx(i); setTimeout(()=>setStep("payment"),600); }} style={{
                width:46,height:74,background:isAct?`linear-gradient(135deg,${G},#C4922A)`:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                borderRadius:7,border:`1.5px solid ${isAct?G:G+"33"}`,cursor:"pointer",transition:"all 0.2s",
                transform:isAct?"translateY(-12px) scale(1.08)":"none",
                boxShadow:isAct?`0 10px 24px rgba(232,200,122,0.5)`:"none",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                <span style={{fontSize:16,filter:isAct?"none":"brightness(0.25)"}}>🃏</span>
              </div>
            );
          })}
        </div>
        <GBtn onClick={()=>setStep("who")} dim>← 이전으로</GBtn>
      </div>
    </Sheet>
  );

  // ── 결제 ──
  if(step==="payment") return (
    <Sheet>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>결제하기</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 20px"}}>안전하게 처리됩니다</p>

        {/* 보유 캐시 */}
        <div style={{background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 3px"}}>💰 보유 캐시</p>
            <p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p>
          </div>
          <button style={{padding:"7px 14px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button>
        </div>

        {/* 쿠폰/이용권 */}
        {[["🎟️","쿠폰 (0장)","눌러서 쿠폰 목록 보기"],["📋","이용권 (0장)","눌러서 이용권 목록 보기"]].map(([icon,title,sub])=>(
          <div key={title} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:13,padding:"13px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <div>
              <p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",margin:"0 0 2px"}}>{icon} {title}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>{sub}</p>
            </div>
            <span style={{color:"rgba(255,255,255,0.3)"}}>▾</span>
          </div>
        ))}

        {/* 금액 */}
        <div style={{padding:"14px 0",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>상품 가격</span>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{taro.price.toLocaleString()}원</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span>
            <span style={{fontSize:16,fontWeight:700,color:G}}>{taro.price.toLocaleString()}원</span>
          </div>
        </div>

        {/* 결제 수단 */}
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 10px",letterSpacing:1}}>= 결제 수단</p>
        {[
          {icon:"🟡",name:"카카오페이",sub:"원터치 간편결제",selected:true},
          {icon:"🔵",name:"토스페이",sub:"간편결제",selected:false},
          {icon:"💚",name:"네이버페이",sub:"포인트 적립",selected:false},
          {icon:"💳",name:"카드결제",sub:"신용/체크카드",selected:false},
          {icon:"📱",name:"핸드폰 결제",sub:"통신사 결제",selected:false},
        ].map(({icon,name,sub,selected})=>(
          <div key={name} style={{background:selected?"rgba(232,200,122,0.08)":"rgba(255,255,255,0.03)",border:`1px solid ${selected?"rgba(232,200,122,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"13px 16px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <span style={{fontSize:20,flexShrink:0}}>{icon}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{name}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{sub}</p>
            </div>
            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${selected?G:"rgba(255,255,255,0.25)"}`,background:selected?G:"transparent",flexShrink:0}}/>
          </div>
        ))}

        <div style={{height:12}}/>
        <GBtn onClick={()=>setStep("loading")}>
          분석하기 ({taro.price.toLocaleString()}원) →
        </GBtn>
        <div style={{height:8}}/>
        <GBtn onClick={()=>setStep("spread")} dim>취소</GBtn>
      </div>
    </Sheet>
  );

  // ── 로딩 ──
  if(step==="loading") return (
    <Sheet>
      <div style={{padding:"32px 18px",textAlign:"center"}}>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{taro.emoji} {taro.name}</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 26px"}}>AI가 카드의 기운을 읽고 있어요</p>
        <div style={{fontSize:50,marginBottom:14}}>🔮</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 16px"}}>운명을 읽고 있어요...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${loadPct}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.18s"}}/>
        </div>
        <p style={{fontSize:13,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:22,margin:"0 0 16px"}}>{taro.loading[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </Sheet>
  );

  // ── 결과 ──
  if(step==="result" && drawnCards.length>0) return (
    <Sheet>
      <div style={{padding:"22px 18px 0"}}>
        {/* 완료 헤더 */}
        <div style={{textAlign:"center",marginBottom:18}}>
          <p style={{fontSize:28,margin:"0 0 4px"}}>✨</p>
          <p style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{taro.name} 완료!</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>카드를 탭해서 자세한 해석을 확인하세요</p>
        </div>

        {/* 카드 배열 — 3장/5장/10장 */}
        {taro.cardCount <= 3 && (
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:16}}>
            {drawnCards.map(({card,isReversed,pos},i)=>(
              <div key={i} onClick={()=>setOpenCard(openCard===i?null:i)} style={{textAlign:"center",cursor:"pointer"}}>
                <CardFront card={card} isReversed={isReversed} size={100}/>
                <p style={{fontSize:9,color:"rgba(255,255,255,0.45)",margin:"6px 0 2px",letterSpacing:1}}>{pos}</p>
                <p style={{fontSize:10,fontWeight:600,color:G}}>{card.name}</p>
              </div>
            ))}
          </div>
        )}
        {taro.cardCount === 5 && (
          <>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}>
              {drawnCards.slice(0,3).map(({card,isReversed,pos},i)=>(
                <div key={i} onClick={()=>setOpenCard(openCard===i?null:i)} style={{textAlign:"center",cursor:"pointer",flex:1}}>
                  <CardFront card={card} isReversed={isReversed} size={90}/>
                  <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"5px 0 1px",letterSpacing:0.5}}>{pos}</p>
                  <p style={{fontSize:9,fontWeight:600,color:G}}>{card.name}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
              {drawnCards.slice(3,5).map(({card,isReversed,pos},i)=>(
                <div key={i+3} onClick={()=>setOpenCard(openCard===i+3?null:i+3)} style={{textAlign:"center",cursor:"pointer",flex:1,maxWidth:100}}>
                  <CardFront card={card} isReversed={isReversed} size={90}/>
                  <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"5px 0 1px",letterSpacing:0.5}}>{pos}</p>
                  <p style={{fontSize:9,fontWeight:600,color:G}}>{card.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {taro.cardCount === 10 && (
          <>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12,justifyContent:"center"}}>
              {drawnCards.map(({card,isReversed,pos},i)=>(
                <div key={i} onClick={()=>setOpenCard(openCard===i?null:i)} style={{textAlign:"center",cursor:"pointer",width:"calc(20% - 5px)"}}>
                  <CardFront card={card} isReversed={isReversed} size={60}/>
                  <p style={{fontSize:7,color:"rgba(255,255,255,0.35)",margin:"3px 0 0",lineHeight:1.2}}>{pos.slice(0,4)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 선택된 카드 상세 */}
        {openCard!==null && drawnCards[openCard] && (
          <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"14px",marginBottom:12,animation:"fadeIn 0.3s ease"}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ {drawnCards[openCard].pos}</p>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
              <CardFront card={drawnCards[openCard].card} isReversed={drawnCards[openCard].isReversed} size={70}/>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:700,color:G,margin:"0 0 3px"}}>{drawnCards[openCard].card.name}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 8px"}}>{drawnCards[openCard].card.en}{drawnCards[openCard].isReversed?" (역방향)":""}</p>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"8px 10px"}}>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 3px"}}>키워드</p>
                  <p style={{fontSize:11,color:G,fontWeight:600,margin:0}}>{drawnCards[openCard].card.keyword}</p>
                </div>
              </div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:0}}>
              {drawnCards[openCard].isReversed
                ? taro.results.bad[openCard % taro.results.bad.length]
                : taro.results.good[openCard % taro.results.good.length]}
            </p>
          </div>
        )}

        {/* 전체 요약 */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:"13px",marginBottom:14}}>
          <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 종합 해석</p>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:0}}>
            {taro.results.good[0]} 카드들이 보여주는 전체적인 흐름은 당신이 지금 중요한 갈림길에 있다는 것이에요. {taro.positions[taro.cardCount-1]}에 놓인 카드가 최종 방향을 알려주고 있어요.
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={onClose}>확인 완료</GBtn>
          <GBtn onClick={onClose} dim>닫기</GBtn>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Sheet>
  );

  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 — 타로 목록
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function TaroList() {
  const [activeTaro, setActiveTaro] = useState(null);

  const BADGE_STYLE = {
    인기:{bg:"rgba(255,80,80,0.2)",color:"#FF7675",border:"rgba(255,80,80,0.3)"},
    한정판:{bg:"rgba(130,80,220,0.2)",color:"#B39DDB",border:"rgba(130,80,220,0.3)"},
  };

  return (
    <div style={{minHeight:"100vh",background:"#0D1117",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:40}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🃏 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>카드가 말하는 당신의 운명</p>
      </div>

      <div style={{padding:"14px"}}>
        {/* 무료 타로 */}
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:3,margin:"0 0 10px"}}>✦ 무료</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {emoji:"🔮",name:"오늘의 타로",desc:"카드 한 장이 오늘 하루를 바꿔줄지도?",price:"무료",badge:null},
            {emoji:"✨",name:"YES/NO 타로",desc:"할까 말까? 단도박 해답",price:"무료",badge:"핵폭"},
          ].map(({emoji,name,desc,price,badge})=>(
            <div key={name} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:"16px",cursor:"pointer",position:"relative"}}>
              {badge&&<span style={{position:"absolute",top:8,right:8,fontSize:9,padding:"2px 7px",borderRadius:10,background:"rgba(100,100,100,0.4)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.12)"}}>{badge}</span>}
              <p style={{fontSize:24,margin:"0 0 8px"}}>{emoji}</p>
              <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{name}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 10px",lineHeight:1.5}}>{desc}</p>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(95,196,158,0.15)",color:"#5FC49E",border:"1px solid rgba(95,196,158,0.25)",fontWeight:600}}>{price}</span>
            </div>
          ))}
        </div>

        {/* 유료 타로 */}
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:3,margin:"0 0 10px"}}>✦ 프리미엄</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {Object.values(TARO_TYPES).map(taro=>(
            <div key={taro.id} onClick={()=>setActiveTaro(taro)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:16,padding:"16px",cursor:"pointer",position:"relative",transition:"0.15s"}}>
              {taro.badge && (
                <span style={{position:"absolute",top:8,right:8,fontSize:9,padding:"2px 7px",borderRadius:10,...(BADGE_STYLE[taro.badge]||{}),border:`1px solid ${BADGE_STYLE[taro.badge]?.border||"transparent"}`}}>
                  {taro.badge}
                </span>
              )}
              <p style={{fontSize:24,margin:"0 0 8px"}}>{taro.emoji}</p>
              <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{taro.name}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 10px",lineHeight:1.5}}>{taro.desc}</p>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(232,200,122,0.12)",color:G,border:`1px solid rgba(232,200,122,0.25)`,fontWeight:600}}>{taro.price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>

      {activeTaro && <TaroFlow taro={activeTaro} onClose={()=>setActiveTaro(null)}/>}
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
