import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

const TAEMONG_DB = [
  { keywords:["호랑이","범","백호"],
    title:"호랑이 태몽", gender:"아들", prob:75,
    trait:"강인함·리더십·개척정신",
    result:"호랑이 태몽은 강하고 리더십 있는 아이를 상징해요. 특히 큰 호랑이일수록 더 강한 기질의 아이가 태어남을 의미해요.",
    detail:"호랑이는 예로부터 강인함과 권위를 상징해요. 이 태몽을 꾼 아이는 타고난 리더십과 강한 의지력을 가질 가능성이 높아요. 어떤 분야에서든 최고를 향해 나아가는 개척자 기질이 있어요. 체력도 강하고, 어려움 앞에서 물러서지 않는 용기를 가질 것입니다.",
    name_tip:"강함과 용기를 담은 이름이 잘 어울려요. 한자로 勇(용기 용), 剛(굳셀 강), 豪(호걸 호) 같은 글자가 좋아요." },

  { keywords:["용","구렁이","황룡","청룡"],
    title:"용 태몽", gender:"아들", prob:80,
    trait:"권세·성공·큰 인물",
    result:"용 태몽은 크게 성공하고 이름을 떨칠 큰 인물이 될 아이를 상징해요.",
    detail:"용은 동양에서 가장 강력한 길상의 상징이에요. 용 태몽을 꾼 아이는 어릴 때부터 범상치 않은 재능을 보이고, 성장하면서 큰 성취를 이루는 경우가 많아요. 특히 사회적으로 인정받고 리더가 되는 운명을 타고나요.",
    name_tip:"권세와 성취를 담은 이름이 좋아요. 龍(용 룡), 昇(오를 승), 俊(준걸 준) 같은 한자를 활용해보세요." },

  { keywords:["꽃","꽃밭","장미","벚꽃","꽃이"],
    title:"꽃 태몽", gender:"딸", prob:78,
    trait:"아름다움·예술성·감수성",
    result:"꽃 태몽은 아름답고 예술적 재능이 풍부한 아이를 상징해요.",
    detail:"꽃은 아름다움, 우아함, 예술적 감수성의 상징이에요. 이 태몽을 꾼 아이는 미적 감각이 뛰어나고, 예술·음악·문학 방면에서 특별한 재능을 보일 가능성이 높아요. 주변 사람들에게 사랑받는 밝고 따뜻한 성격을 가질 거예요.",
    name_tip:"아름다움과 우아함을 담은 이름이 어울려요. 花(꽃 화), 美(아름다울 미), 雅(우아할 아) 같은 한자를 활용해보세요." },

  { keywords:["복숭아","사과","과일","배","포도"],
    title:"과일 태몽", gender:"딸", prob:65,
    trait:"풍요·다복·사교성",
    result:"과일 태몽은 풍요롭고 복이 많은 아이를 상징해요.",
    detail:"과일 태몽은 풍요와 다복의 상징이에요. 특히 복숭아는 장수와 복을, 사과는 건강과 평화를 의미해요. 이 태몽을 꾼 아이는 재물복과 인복이 풍부하고, 주변 사람들과 잘 어울리는 사교적인 성격을 가질 거예요.",
    name_tip:"풍요와 복을 담은 이름이 어울려요. 福(복 복), 豊(풍성할 풍), 實(열매 실) 같은 한자를 고려해보세요." },

  { keywords:["돼지","멧돼지","돼지꿈"],
    title:"돼지 태몽", gender:"아들", prob:70,
    trait:"재물복·건강·명랑함",
    result:"돼지 태몽은 재물복이 많고 건강한 아이를 상징해요.",
    detail:"돼지는 풍요와 재물의 상징이에요. 태몽에 돼지가 나왔다면 재물운이 뛰어나고 경제적으로 성공할 가능성이 높아요. 건강하고 활달한 성격을 가지며, 사람들에게 호감을 주는 밝은 에너지를 타고나요.",
    name_tip:"건강함과 풍요를 담은 이름이 좋아요. 健(건강할 건), 富(부유할 부), 壽(장수할 수) 같은 한자를 활용해보세요." },

  { keywords:["태양","해","햇빛","햇살"],
    title:"태양 태몽", gender:"아들", prob:72,
    trait:"빛·긍정·에너지",
    result:"태양 태몽은 밝고 에너지 넘치는 아이를 상징해요.",
    detail:"태양은 빛, 생명, 긍정의 에너지를 상징해요. 이 태몽을 꾼 아이는 타고난 밝은 에너지로 주변 사람들에게 활력을 주는 존재가 될 거예요. 리더십이 강하고, 어떤 상황에서도 긍정적인 자세를 잃지 않아요.",
    name_tip:"밝음과 빛을 담은 이름이 어울려요. 日(해 일), 陽(볕 양), 明(밝을 명) 같은 한자를 활용해보세요." },

  { keywords:["달","보름달","달빛"],
    title:"달 태몽", gender:"딸", prob:74,
    trait:"감성·지혜·포용력",
    result:"달 태몽은 감성이 풍부하고 지혜로운 아이를 상징해요.",
    detail:"달은 감성, 지혜, 포용력의 상징이에요. 이 태몽을 꾼 아이는 섬세한 감수성과 깊은 지혜를 타고나요. 예술적 감각이 뛰어나고, 주변 사람들의 마음을 잘 이해하는 공감 능력이 있어요. 차분하고 사려 깊은 성격으로 많은 이에게 사랑받아요.",
    name_tip:"감성과 지혜를 담은 이름이 좋아요. 月(달 월), 慧(슬기로울 혜), 晨(새벽 신) 같은 한자를 활용해보세요." },
];

const LOADING_MSGS = [
  "태몽 기운을 분석하는 중... 🌟",
  "아이의 사주 기운을 읽는 중... 🔮",
  "전생 인연을 확인하는 중... ✨",
  "아이의 재능을 탐색하는 중... 💫",
  "하늘의 뜻을 살피는 중... 🌙",
];

const QUICK_KEYWORDS = ["호랑이","용","꽃","복숭아","돼지","태양","달","구렁이","사과","벚꽃"];

export default function TaemongInterp() {
  const [step,       setStep]       = useState("intro");  // intro | input | loading | result
  const [dream,      setDream]      = useState("");
  const [result,     setResult]     = useState(null);
  const [loadPct,    setLoadPct]    = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const ivRef = useRef(null);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadPct(0); setLoadMsgIdx(0);
    let pct = 0;
    ivRef.current = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 5 + 2);
      setLoadPct(Math.floor(pct));
      if (Math.random() > 0.88) setLoadMsgIdx(i => (i + 1) % LOADING_MSGS.length);
      if (pct >= 100) {
        clearInterval(ivRef.current);
        setTimeout(() => {
          const lower = dream.toLowerCase();
          const found = TAEMONG_DB.find(d => d.keywords.some(k => lower.includes(k)));
          setResult(found || {
            title:"특별한 태몽",
            gender:"미정",
            prob:50,
            trait:"독특한 기질·개성·창의성",
            result:"특별하고 개성 넘치는 아이가 찾아올 것 같아요.",
            detail:"입력하신 태몽의 상징을 분석했어요. 뚜렷한 상징이 있다면 더 자세한 분석이 가능해요. 이 아이는 틀에 얽매이지 않는 창의적인 기질을 가질 것으로 보여요.",
            name_tip:"개성과 창의성을 담은 이름이 어울릴 것 같아요.",
          });
          setStep("result");
        }, 500);
      }
    }, 180);
    return () => clearInterval(ivRef.current);
  }, [step]);

  function reset() {
    setStep("intro");
    setDream("");
    setResult(null);
    setLoadPct(0);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>👶 태몽해몽</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>태몽의 의미를 AI가 분석해드려요 · 380원</p>
      </div>

      {/* ── 인트로 ── */}
      {step === "intro" && (
        <div style={{padding:"20px 16px"}}>
          <div style={{background:DG,borderRadius:16,padding:"18px",marginBottom:12}}>
            <p style={{fontSize:15,fontWeight:700,color:G,margin:"0 0 14px"}}>🌟 태몽이란?</p>
            {[
              {icon:"🤰", t:"임신 중 또는 임신 직전에 꾸는 특별한 꿈이에요"},
              {icon:"👶", t:"아이의 기질, 재능, 성별을 암시한다고 믿어져요"},
              {icon:"🔮", t:"꿈의 상징을 분석해 아이의 운명을 엿볼 수 있어요"},
              {icon:"📖", t:"이름 지을 때 태몽의 의미를 참고하면 좋아요"},
            ].map(({icon,t})=>(
              <div key={t} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.7}}>{t}</p>
              </div>
            ))}
          </div>

          {/* 가격 */}
          <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:14,padding:"18px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 6px"}}>AI 태몽 분석</p>
            <p style={{fontSize:30,fontWeight:700,color:G,margin:"0 0 4px"}}>380원</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 12px",lineHeight:1.6}}>
              태몽 상세 분석 + 아이 기질 예측<br/>성별 예측 + 이름 방향 제안
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              {["💳 카드결제","🟡 카카오페이","💵 토스페이"].map(p=>(
                <span key={p} style={{fontSize:10,padding:"3px 8px",borderRadius:12,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>{p}</span>
              ))}
            </div>
          </div>

          <button onClick={()=>setStep("input")} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
            태몽 분석 시작하기 →
          </button>
        </div>
      )}

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 16px"}}>
            태몽 내용을 자세히 적어주세요.<br/>
            <span style={{color:G}}>어떤 것이 나왔나요?</span>
          </p>

          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>자주 나오는 태몽 키워드</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {QUICK_KEYWORDS.map(k=>(
              <button key={k} onClick={()=>setDream(d=>d?`${d} ${k}`:k)} style={{padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:12,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit"}}>
                {k}
              </button>
            ))}
          </div>

          <textarea
            value={dream}
            onChange={e=>setDream(e.target.value)}
            placeholder="태몽 내용을 입력하세요&#10;예) 커다란 호랑이가 품 안으로 들어왔어요&#10;예) 황금빛 용이 하늘에서 내려왔어요"
            style={{width:"100%",minHeight:110,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${dream?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7,marginBottom:14}}
          />

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{if(dream.trim())setStep("loading");}} style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:dream.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:dream.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:dream.trim()?"#0D0D14":"rgba(255,255,255,0.3)"}}>
              태몽 분석하기 (380원) →
            </button>
            <button onClick={()=>setStep("intro")} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
              ← 이전으로
            </button>
          </div>
        </div>
      )}

      {/* ── 로딩 ── */}
      {step === "loading" && (
        <div style={{padding:"40px 16px",textAlign:"center"}}>
          <div style={{fontSize:54,marginBottom:14}}>👶</div>
          <p style={{fontSize:15,fontWeight:700,color:G,margin:"0 0 18px"}}>태몽 분석 중...</p>
          <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:`${loadPct}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.18s linear"}}/>
          </div>
          <p style={{fontSize:13,color:G,fontWeight:700,margin:"0 0 12px"}}>{loadPct}%</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:22}}>{LOADING_MSGS[loadMsgIdx]}</p>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <p style={{fontSize:36,margin:"0 0 4px"}}>✨</p>
            <p style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>태몽 분석 완료!</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>"{dream.slice(0,20)}{dream.length>20?"...":""}"</p>
          </div>

          {/* 성별 예측 */}
          <div style={{
            background: result.gender==="아들"?"rgba(100,150,255,0.1)":result.gender==="딸"?"rgba(255,150,180,0.1)":"rgba(232,200,122,0.08)",
            border:`1px solid ${result.gender==="아들"?"rgba(100,150,255,0.3)":result.gender==="딸"?"rgba(255,150,180,0.3)":"rgba(232,200,122,0.2)"}`,
            borderRadius:14,padding:"18px",marginBottom:12,textAlign:"center"
          }}>
            <p style={{fontSize:32,margin:"0 0 6px"}}>{result.gender==="아들"?"👦":result.gender==="딸"?"👧":"🌟"}</p>
            <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>
              {result.gender==="미정"?"성별 예측 불확실":`${result.gender} 예측`}
            </p>
            {result.prob && result.gender !== "미정" && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,margin:"8px 0"}}>
                <div style={{height:6,width:120,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${result.prob}%`,background:result.gender==="아들"?"rgba(100,150,255,0.7)":"rgba(255,150,180,0.7)",borderRadius:99}}/>
                </div>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>예측 확률 {result.prob}%</span>
              </div>
            )}
            <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0}}>참고용 · 실제와 다를 수 있어요</p>
          </div>

          {/* 태몽 해석 */}
          <div style={{background:DG,borderRadius:14,padding:"15px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 태몽 해석</p>
            <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.7,margin:"0 0 10px"}}>{result.result}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.85,margin:0}}>{result.detail}</p>
          </div>

          {/* 아이 기질 */}
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:10}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 아이의 기질 예측</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {result.trait.split("·").map(t=>(
                <span key={t} style={{fontSize:12,padding:"4px 12px",borderRadius:20,background:"rgba(232,200,122,0.1)",color:G,border:"1px solid rgba(232,200,122,0.25)",fontWeight:600}}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* 이름 방향 */}
          <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 이름 방향 제안</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:"0 0 10px"}}>{result.name_tip}</p>
            <div style={{background:"linear-gradient(135deg,#2a1a3a,#1a1030)",border:"1px solid rgba(150,80,220,0.3)",borderRadius:12,padding:"12px",textAlign:"center"}}>
              <p style={{fontSize:12,color:"rgba(200,150,255,0.8)",margin:"0 0 8px"}}>더 정확한 이름이 필요하다면?</p>
              <button style={{padding:"9px 20px",background:"linear-gradient(135deg,#9B59B6,#6C3483)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>
                👶 아기 이름 짓기 (1,980원)
              </button>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
              다시 분석하기
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
