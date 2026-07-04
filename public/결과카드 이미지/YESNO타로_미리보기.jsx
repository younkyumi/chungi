import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

const TAROT_CARDS = [
  {id:0,  name:"바보",           en:"The Fool",           keyword:"새로운 시작, 모험, 순수함",    positive:true},
  {id:1,  name:"마법사",         en:"The Magician",        keyword:"의지력, 창조, 집중",          positive:true},
  {id:2,  name:"여사제",         en:"The High Priestess",  keyword:"직관, 신비, 잠재력",         positive:true},
  {id:3,  name:"여황제",         en:"The Empress",         keyword:"풍요, 창조성, 자연",         positive:true},
  {id:4,  name:"황제",           en:"The Emperor",         keyword:"권위, 안정, 리더십",         positive:true},
  {id:5,  name:"교황",           en:"The Hierophant",      keyword:"전통, 신념, 안내",           positive:true},
  {id:6,  name:"연인",           en:"The Lovers",          keyword:"사랑, 선택, 조화",           positive:true},
  {id:7,  name:"전차",           en:"The Chariot",         keyword:"승리, 의지, 전진",           positive:true},
  {id:8,  name:"힘",             en:"Strength",            keyword:"용기, 인내, 자제력",         positive:true},
  {id:9,  name:"은둔자",         en:"The Hermit",          keyword:"내면탐구, 고독, 지혜",       positive:true},
  {id:10, name:"운명의 수레바퀴", en:"Wheel of Fortune",   keyword:"변화, 운명, 순환",           positive:true},
  {id:11, name:"정의",           en:"Justice",             keyword:"균형, 진실, 인과",           positive:true},
  {id:12, name:"매달린 사람",    en:"The Hanged Man",      keyword:"희생, 새 관점, 대기",        positive:false},
  {id:13, name:"죽음",           en:"Death",               keyword:"변환, 끝과 시작, 해방",      positive:false},
  {id:14, name:"절제",           en:"Temperance",          keyword:"조화, 균형, 인내",           positive:true},
  {id:15, name:"악마",           en:"The Devil",           keyword:"속박, 욕망, 물질주의",       positive:false},
  {id:16, name:"탑",             en:"The Tower",           keyword:"갑작스런 변화, 해방, 붕괴",  positive:false},
  {id:17, name:"별",             en:"The Star",            keyword:"희망, 영감, 치유",           positive:true},
  {id:18, name:"달",             en:"The Moon",            keyword:"환상, 불안, 무의식",         positive:false},
  {id:19, name:"태양",           en:"The Sun",             keyword:"성공, 기쁨, 활력",           positive:true},
  {id:20, name:"심판",           en:"Judgement",           keyword:"부활, 반성, 전환점",         positive:true},
  {id:21, name:"세계",           en:"The World",           keyword:"완성, 통합, 성취",           positive:true},
  {id:22, name:"완드 에이스",    en:"Ace of Wands",        keyword:"새 에너지, 창의력, 열정",    positive:true},
  {id:23, name:"컵 에이스",      en:"Ace of Cups",         keyword:"새 감정, 직관, 사랑",        positive:true},
  {id:24, name:"소드 에이스",    en:"Ace of Swords",       keyword:"명료함, 진실, 돌파구",       positive:true},
  {id:25, name:"펜타클 에이스",  en:"Ace of Pentacles",    keyword:"물질적 시작, 기회, 번영",    positive:true},
  {id:26, name:"완드 5",         en:"Five of Wands",       keyword:"경쟁, 갈등, 도전",           positive:false},
  {id:27, name:"컵 5",           en:"Five of Cups",        keyword:"상실, 후회, 슬픔",           positive:false},
  {id:28, name:"소드 5",         en:"Five of Swords",      keyword:"패배, 갈등, 손실",           positive:false},
  {id:29, name:"펜타클 5",       en:"Five of Pentacles",   keyword:"어려움, 결핍, 시련",         positive:false},
  ...Array.from({length:48}, (_,i) => ({id:30+i, name:`카드 ${30+i}`, en:`Card ${30+i}`, keyword:"신비로운 기운이 흐릅니다", positive:i%2===0}))
];

const ANSWERS = {
  YES: {
    color:"#5FC49E", bg:"rgba(95,196,158,0.12)", border:"rgba(95,196,158,0.35)",
    msgs:[
      "카드가 YES라고 말해요. 직관을 믿고 나아가세요!",
      "긍정의 기운이 강하게 흘러요. 지금이 적절한 타이밍이에요.",
      "우주가 당신의 선택을 응원하고 있어요. 망설이지 마세요.",
      "카드가 밝은 신호를 보내고 있어요. 행동으로 옮겨보세요.",
    ]
  },
  NO: {
    color:"#FF7675", bg:"rgba(255,118,117,0.1)", border:"rgba(255,118,117,0.35)",
    msgs:[
      "카드가 조심하라고 말해요. 좀 더 기다려보는 게 좋을 것 같아요.",
      "지금은 아닌 것 같아요. 타이밍을 다시 봐보세요.",
      "한 발 물러서서 더 신중하게 생각해보세요.",
      "카드가 경고의 신호를 보내고 있어요. 서두르지 마세요.",
    ]
  },
  글쎄요: {
    color:"#E8C87A", bg:"rgba(232,200,122,0.1)", border:"rgba(232,200,122,0.35)",
    msgs:[
      "카드가 확실한 답을 주기 어려워해요. 당신 마음속 답이 진짜 답이에요.",
      "상황이 유동적이에요. 조금 더 시간이 지나면 명확해질 거예요.",
      "지금 당장의 결정보다 더 많은 정보를 모아보세요.",
      "카드가 '아직은 모른다'고 말해요. 흐름을 지켜보세요.",
    ]
  },
};

function getYesNo(card, isReversed) {
  const maybeCards = [10, 14, 2, 9]; // 글쎄요 나올 카드들
  if (maybeCards.includes(card.id)) return "글쎄요";
  if (card.positive && !isReversed) return "YES";
  if (!card.positive && isReversed) return "YES";
  return "NO";
}

export default function YesNoTaro() {
  const [step, setStep]       = useState("input"); // input | shuffle | result
  const [question, setQuestion] = useState("");
  const [shufflePhase, setShufflePhase] = useState("spinning"); // spinning | spread
  const [activeIdx, setActiveIdx]       = useState(null);
  const [result, setResult]   = useState(null);
  const timerRef = useRef(null);

  // 셔플 → 카드 펼치기
  useEffect(() => {
    if (step !== "shuffle") return;
    setShufflePhase("spinning");
    setActiveIdx(null);
    timerRef.current = setTimeout(() => setShufflePhase("spread"), 1400);
    return () => clearTimeout(timerRef.current);
  }, [step]);

  function pickCard(idx) {
    if (shufflePhase !== "spread") return;
    setActiveIdx(idx);
    setTimeout(() => {
      const seed = Date.now() + idx * 137;
      let s = seed >>> 0;
      const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
      const cardId = Math.floor(rng() * 78);
      const card = TAROT_CARDS[cardId % TAROT_CARDS.length];
      const isReversed = rng() > 0.6;
      const yesno = getYesNo(card, isReversed);
      const answerData = ANSWERS[yesno];
      const msgIdx = Math.floor(rng() * answerData.msgs.length);
      setResult({ card, isReversed, yesno, answerData, msg: answerData.msgs[msgIdx] });
      setStep("result");
    }, 500);
  }

  function reset() {
    setStep("input");
    setQuestion("");
    setResult(null);
    setActiveIdx(null);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🎴 YES / NO 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>고민을 입력하고 카드에게 물어보세요 · 무료</p>
      </div>

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 18px"}}>
            마음속 질문을 떠올리고<br/>
            <span style={{color:G}}>YES 또는 NO로 답할 수 있는 질문</span>을 입력해주세요.
          </p>

          {/* 예시 질문 버튼 */}
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>예시 질문</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {["그 사람은 나를 좋아할까?","이직해도 될까?","지금 시작하면 성공할까?","연락해도 될까?","이 결정이 맞는 걸까?"].map(ex=>(
              <button key={ex} onClick={()=>setQuestion(ex)} style={{padding:"6px 13px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:11,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit",transition:"0.15s"}}>
                {ex}
              </button>
            ))}
          </div>

          {/* 질문 입력창 */}
          <textarea
            value={question}
            onChange={e=>setQuestion(e.target.value.slice(0,100))}
            placeholder="질문을 입력하세요..."
            style={{width:"100%",minHeight:90,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${question?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7}}
          />
          <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",textAlign:"right",margin:"4px 0 16px"}}>{question.length}/100</p>

          {/* 입력된 질문 미리보기 */}
          {question.trim() && (
            <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>질문</p>
              <p style={{fontSize:14,fontWeight:600,color:G,margin:0}}>"{question}"</p>
            </div>
          )}

          <button
            onClick={()=>{if(question.trim())setStep("shuffle");}}
            style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:question.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:question.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:question.trim()?"#0D0D14":"rgba(255,255,255,0.3)",transition:"0.2s"}}
          >
            🃏 카드 뽑기 →
          </button>
        </div>
      )}

      {/* ── 셔플 ── */}
      {step === "shuffle" && (
        <div style={{padding:"28px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>질문</p>
          <p style={{fontSize:13,color:G,fontStyle:"italic",margin:"0 0 24px"}}>"{question}"</p>

          {shufflePhase === "spinning" && (
            <>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 24px"}}>카드를 섞고 있어요...</p>
              <div style={{display:"flex",justifyContent:"center",position:"relative",height:110,marginBottom:8}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{
                    width:65,height:104,
                    background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                    borderRadius:8,border:`1.5px solid ${G}33`,
                    position:"absolute",left:`calc(50% + ${(i-1)*24}px)`,
                    animation:`sw${i} 0.7s ease-in-out infinite alternate`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <span style={{fontSize:24,filter:"brightness(0.3)"}}>🃏</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {shufflePhase === "spread" && (
            <>
              <p style={{fontSize:13,color:G,fontWeight:600,margin:"0 0 4px"}}>✨ 마음이 끌리는 카드를 선택하세요</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 20px"}}>직관을 따라 딱 하나만</p>
              <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                {Array.from({length:7}, (_,i)=>(
                  <div key={i} onClick={()=>pickCard(i)} style={{
                    width:48,height:78,
                    background: activeIdx===i ? `linear-gradient(135deg,${G},#C4922A)` : "linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                    borderRadius:7,border:`1.5px solid ${activeIdx===i?G:G+"33"}`,
                    cursor:"pointer",transition:"all 0.2s",
                    transform:activeIdx===i?"translateY(-12px) scale(1.08)":"none",
                    boxShadow:activeIdx===i?`0 10px 24px rgba(232,200,122,0.45)`:"none",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <span style={{fontSize:18,filter:activeIdx===i?"none":"brightness(0.25)"}}>🃏</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <style>{`
            @keyframes sw0{from{transform:rotate(-18deg) translateX(-12px)}to{transform:rotate(-6deg) translateX(6px)}}
            @keyframes sw1{from{transform:rotate(0deg) translateY(-6px)}to{transform:rotate(6deg) translateY(6px)}}
            @keyframes sw2{from{transform:rotate(18deg) translateX(12px)}to{transform:rotate(6deg) translateX(-6px)}}
          `}</style>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          {/* 질문 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:"0 0 4px",letterSpacing:2}}>질문</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",margin:0}}>"{question}"</p>
          </div>

          {/* YES / NO / 글쎄요 */}
          <div style={{background:result.answerData.bg,border:`2px solid ${result.answerData.border}`,borderRadius:16,padding:"24px 20px",marginBottom:16,textAlign:"center"}}>
            <p style={{
              fontSize:52,fontWeight:900,color:result.answerData.color,
              margin:"0 0 10px",letterSpacing:6,
              textShadow:`0 0 30px ${result.answerData.color}66`,
            }}>
              {result.yesno}
            </p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:0}}>{result.msg}</p>
          </div>

          {/* 카드 */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{
              width:130,height:210,margin:"0 auto 12px",
              background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
              borderRadius:10,border:`2px solid ${G}55`,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              transform:result.isReversed?"rotate(180deg)":"none",
              boxShadow:`0 0 24px rgba(232,200,122,0.2)`,
              overflow:"hidden",position:"relative",
            }}>
              <img
                src={`/tarot/${result.card.id}.png`}
                alt={result.card.name}
                style={{width:"100%",height:"100%",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
              />
              <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:12,position:"absolute",inset:0}}>
                <span style={{fontSize:36,marginBottom:8}}>🃏</span>
                <p style={{fontSize:12,color:G,fontWeight:700,textAlign:"center",margin:"0 0 4px"}}>{result.card.name}</p>
                <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:0}}>{result.card.en}</p>
              </div>
              {result.isReversed && (
                <div style={{position:"absolute",top:5,right:5,fontSize:8,background:"rgba(255,100,100,0.7)",color:"#fff",padding:"2px 6px",borderRadius:6,transform:"rotate(180deg)"}}>역방향</div>
              )}
            </div>
            <p style={{fontSize:13,fontWeight:700,color:result.isReversed?"#FF7675":G,margin:"0 0 2px"}}>
              {result.card.name}{result.isReversed?" (역방향)":""}
            </p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>{result.card.en}</p>
          </div>

          {/* 키워드 */}
          <div style={{background:DG,borderRadius:13,padding:"13px",marginBottom:14}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 6px"}}>카드 키워드</p>
            <p style={{fontSize:12,color:G,fontWeight:600,margin:0}}>{result.card.keyword}</p>
          </div>

          <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
            다시 물어보기
          </button>
        </div>
      )}

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
