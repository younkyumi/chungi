import { useState } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

const DREAM_DB = [
  { keywords:["뱀","구렁이","뱀이"], title:"뱀 꿈", good:true,
    short:"뱀 꿈은 재물과 지혜를 상징하는 길몽이에요.",
    detail:"뱀은 동양 사상에서 재물과 지혜의 상징이에요. 큰 뱀일수록 큰 재물운을 의미해요. 뱀이 나를 감쌌다면 재물이 들어오는 신호, 뱀을 잡았다면 기회를 잡게 될 것을 의미해요. 단, 뱀에 물리는 꿈은 조심해야 할 사람이 주변에 있다는 경고일 수 있어요.",
    advice:"재물 관련 결정을 앞두고 있다면 오늘이 적기일 수 있어요." },

  { keywords:["돼지","멧돼지","돼지꿈"], title:"돼지 꿈", good:true,
    short:"돼지 꿈은 대표적인 재물 길몽이에요!",
    detail:"돼지는 풍요와 재물의 상징이에요. 돼지가 집에 들어오는 꿈은 가정에 재물이 들어오는 것을 의미하고, 돼지를 잡거나 안는 꿈은 큰 횡재를 의미해요. 아기 돼지 꿈은 새로운 시작이나 임신과 관련될 수 있어요.",
    advice:"복권 구매나 재테크에 관심을 가져보기 좋은 날이에요." },

  { keywords:["용","황룡","청룡","용이"], title:"용 꿈", good:true,
    short:"용 꿈은 승진, 성공, 큰 행운을 상징하는 강력한 길몽이에요.",
    detail:"용은 권세와 성공의 상징이에요. 하늘을 나는 용을 봤다면 원대한 꿈이 이루어질 것을 의미해요. 용을 탔다면 큰 성공이, 용이 알을 낳으면 풍요로운 결실을 의미해요. 이 꿈은 특히 직업운과 관련이 깊어요.",
    advice:"오늘은 중요한 제안이나 기회에 적극적으로 나서보세요." },

  { keywords:["이빨","이가","치아","이빨이"], title:"이빨 꿈", good:false,
    short:"이빨이 빠지는 꿈은 가까운 사람의 건강이나 이별을 암시해요.",
    detail:"이빨 꿈은 가족이나 가까운 사람의 건강을 상징해요. 이빨이 빠지면 그 방향에 따라 해석이 달라져요. 앞니=부모 또는 형제, 어금니=자신의 건강과 관련이 있어요. 다만 실제 건강 검진의 계기로 삼아보는 것도 좋아요.",
    advice:"오늘은 가족의 건강을 챙겨보는 것이 좋겠어요." },

  { keywords:["물","홍수","바다","강","비"], title:"물 꿈", good:true,
    short:"맑은 물은 재물과 건강의 길몽, 흙탕물은 정리가 필요하다는 신호예요.",
    detail:"물은 재물과 감정을 상징해요. 맑고 깨끗한 물을 마시면 건강운이 상승하고, 넓은 바다를 바라보는 꿈은 큰 사업 기회를 의미해요. 홍수는 갑작스러운 변화나 감정의 범람을 나타내요. 물이 맑을수록 좋은 운을 의미해요.",
    advice:"맑은 물이라면 오늘 중요한 일을 추진하기 좋아요." },

  { keywords:["불","화재","불길","불꽃"], title:"불 꿈", good:true,
    short:"활활 타오르는 불꿈은 강력한 에너지와 열정의 길몽이에요.",
    detail:"불은 에너지와 변화를 상징해요. 활활 타오르는 불은 사업의 번창이나 강한 열정을 의미하고, 불을 끄는 꿈은 장애물 극복을 나타내요. 단 집이 불타는 꿈은 가정 내 갈등이나 변화를 의미할 수 있어요.",
    advice:"열정적으로 시작하고 싶은 일이 있다면 오늘 시작해보세요." },

  { keywords:["하늘","구름","하늘을","날다"], title:"하늘 꿈", good:true,
    short:"하늘을 나는 꿈은 자유, 성취, 목표 달성의 길몽이에요.",
    detail:"맑고 푸른 하늘은 밝은 미래와 성공을 의미해요. 하늘을 자유롭게 나는 꿈은 현재의 어려움을 이겨내고 높은 곳에 오르게 될 것을 암시해요. 구름 위를 걷는 꿈은 높은 이상을 이루게 될 것을 의미해요.",
    advice:"오늘은 자신감 있게 목표를 향해 나아가세요." },

  { keywords:["죽음","죽는","사망","시체"], title:"죽음 꿈", good:true,
    short:"죽음 꿈은 나쁜 꿈이 아니에요! 새로운 시작과 변화를 의미해요.",
    detail:"꿈에서 죽음은 실제 죽음이 아닌 '끝과 시작'을 상징해요. 내가 죽는 꿈은 현재 상황이 완전히 새롭게 변화할 것을 의미하고, 타인이 죽는 꿈은 그 사람과의 관계가 새로운 단계로 발전함을 나타내요. 걱정하지 마세요!",
    advice:"변화를 두려워하지 말고 새로운 시작을 준비해보세요." },

  { keywords:["고양이","강아지","개","동물"], title:"동물 꿈", good:true,
    short:"친근한 동물 꿈은 인연과 우정의 기운을 상징해요.",
    detail:"고양이 꿈은 독립성과 신비로운 인연을 상징해요. 강아지나 개 꿈은 충성스러운 인연이나 친구의 도움을 의미해요. 동물이 나를 따르는 꿈은 주변 사람들이 당신을 신뢰한다는 신호예요.",
    advice:"주변의 소중한 인연에 감사한 마음을 표현해보세요." },

  { keywords:["돈","지폐","금","보석"], title:"돈·보물 꿈", good:true,
    short:"돈이나 보물이 나오는 꿈은 재물운 상승의 길몽이에요!",
    detail:"꿈에서 돈이나 금을 발견하거나 받는 것은 현실에서도 재물운이 좋아질 것을 암시해요. 특히 황금이나 보석을 주는 꿈은 귀인의 도움이나 뜻밖의 수입을 의미해요. 많을수록 더 좋은 운을 의미해요.",
    advice:"재테크나 투자에 관심을 기울여볼 적기예요." },
];

const UNKNOWN_RESULT = {
  title:"특별한 꿈",
  good:null,
  short:"꿈의 상징을 분석했어요. 감정이 가장 중요한 단서예요.",
  detail:"입력하신 꿈의 요소를 분석한 결과, 당신의 무의식이 현재 상황을 정리하고 있는 것으로 보여요. 꿈에서 느낀 감정이 가장 중요한 단서예요. 기분이 좋았다면 길몽, 불안했다면 삶의 어떤 부분을 돌아보라는 신호일 수 있어요.",
  advice:"오늘 꿈에서 느낀 감정을 일기에 기록해보세요.",
};

const QUICK_KEYWORDS = ["뱀","돼지","용","이빨","물","불","하늘","죽음","고양이","돈","불","홍수"];

export default function DreamInterp() {
  const [step,   setStep]   = useState("input"); // input | result
  const [dream,  setDream]  = useState("");
  const [result, setResult] = useState(null);

  function analyze() {
    if (!dream.trim()) return;
    const lower = dream.toLowerCase();
    const found = DREAM_DB.find(d => d.keywords.some(k => lower.includes(k)));
    setResult(found || { ...UNKNOWN_RESULT, good: dream.length > 10 });
    setStep("result");
  }

  function reset() {
    setStep("input");
    setDream("");
    setResult(null);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🌙 꿈해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>어젯밤 꿈의 의미를 알려드려요 · 무료</p>
      </div>

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 16px"}}>
            꿈에서 인상적이었던 것을 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>

          {/* 빠른 키워드 */}
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>자주 나오는 꿈 키워드</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {QUICK_KEYWORDS.map(k=>(
              <button key={k} onClick={()=>setDream(d=>{
                if (d.includes(k)) return d;
                return d ? `${d} ${k}` : k;
              })} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>

          {/* 텍스트 입력 */}
          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="꿈 내용을 자유롭게 적어주세요&#10;예) 큰 뱀이 나를 감쌌어요&#10;예) 돼지가 집 안으로 들어왔어요"
            style={{width:"100%",minHeight:110,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7,marginBottom:14}}
          />

          <button
            onClick={analyze}
            style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:dream.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:dream.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:dream.trim()?"#0D0D14":"rgba(255,255,255,0.3)",transition:"0.2s"}}
          >
            꿈 해몽하기 →
          </button>

          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center",marginTop:12,lineHeight:1.6}}>
            꿈은 무의식의 메시지예요.<br/>구체적으로 적을수록 더 정확한 해몽이 가능해요.
          </p>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>

          {/* 입력한 꿈 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 4px"}}>입력한 꿈</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.6}}>"{dream}"</p>
          </div>

          {/* 길흉 판정 배너 */}
          <div style={{
            background: result.good===true ? "rgba(95,196,158,0.1)" : result.good===false ? "rgba(255,118,117,0.1)" : "rgba(232,200,122,0.08)",
            border: `1px solid ${result.good===true?"rgba(95,196,158,0.3)":result.good===false?"rgba(255,118,117,0.3)":"rgba(232,200,122,0.2)"}`,
            borderRadius:14,padding:"18px",marginBottom:12,textAlign:"center"
          }}>
            <p style={{fontSize:32,margin:"0 0 6px"}}>{result.good===true?"🌟":result.good===false?"⚠️":"🔮"}</p>
            <p style={{fontSize:17,fontWeight:700,color:result.good===true?"#5FC49E":result.good===false?"#FF7675":G,margin:"0 0 4px"}}>
              {result.title}
            </p>
            <span style={{fontSize:11,padding:"3px 12px",borderRadius:20,fontWeight:600,
              background: result.good===true?"rgba(95,196,158,0.15)":result.good===false?"rgba(255,118,117,0.12)":"rgba(232,200,122,0.1)",
              color: result.good===true?"#5FC49E":result.good===false?"#FF7675":G,
              border: `1px solid ${result.good===true?"rgba(95,196,158,0.3)":result.good===false?"rgba(255,118,117,0.25)":"rgba(232,200,122,0.2)"}`
            }}>
              {result.good===true?"✦ 길몽":result.good===false?"✦ 흉몽 (주의)":"✦ 해몽 결과"}
            </span>
          </div>

          {/* 한줄 요약 */}
          <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 한줄 해몽</p>
            <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.75,margin:0}}>{result.short}</p>
          </div>

          {/* 상세 해몽 */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"15px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 상세 해몽</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.9,margin:0}}>{result.detail}</p>
          </div>

          {/* 오늘의 조언 */}
          <div style={{background:DG,borderRadius:14,padding:"13px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>💡</span>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.7,margin:0}}>{result.advice}</p>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
              다른 꿈 해몽하기
            </button>
            <button onClick={reset} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
              ← 처음으로
            </button>
          </div>
        </div>
      )}

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
