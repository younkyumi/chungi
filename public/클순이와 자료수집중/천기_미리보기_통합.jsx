import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

const HEADLINES = [
  "묵혀둔 일을 오늘 마무리하기 좋은 기운이에요",
  "기다리던 소식이 오늘 찾아올 수 있어요",
  "작은 용기가 큰 변화를 만드는 날",
  "예상치 못한 곳에서 행운이 찾아오는 날",
  "자신을 믿는 만큼 오늘의 운이 따라와요",
];
const AREAS = [
  { area:"총운", emoji:"✨", msgs:[["평범하지만 안정적인 하루",3],["기운이 좋아요. 추진하기 좋아요",4],["최고의 하루! 모든 일이 술술",5],["에너지 낮아요. 쉬세요",2]] },
  { area:"재물", emoji:"💰", msgs:[["현상 유지가 최선이에요",3],["작은 수입의 기회가 보여요",4],["재물운 활짝! 투자 좋아요",5],["지출 주의. 큰 결정 미루세요",2]] },
  { area:"애정", emoji:"💕", msgs:[["평온한 관계 유지되는 날",3],["사랑의 기운 넘쳐요! 고백도 좋아요",5],["설레는 만남이 기다려요",4],["오해 생기기 쉬운 날",2]] },
  { area:"건강", emoji:"🌿", msgs:[["루틴 유지하기 좋은 날",3],["활력 넘쳐요. 운동 딱 좋아요",4],["피로감 주의. 충분히 쉬세요",2],["몸과 마음 최상의 상태",5]] },
  { area:"직업", emoji:"💼", msgs:[["노력이 인정받기 시작해요",4],["실수 주의. 꼼꼼히 확인하세요",2],["중요한 기회가 찾아올 수 있어요",5],["협력이 빛을 발하는 날",3]] },
];
const LUCKYS = {
  color:["빨간색","초록색","파란색","노란색","보라색","금색"],
  num: Array.from({length:99},(_,i)=>i+1),
  dir: ["동쪽","서쪽","남쪽","북쪽","동남쪽","서북쪽"],
  food:["된장국","비빔밥","갈비탕","냉면","삼겹살","떡볶이"],
  time:["오전 7~9시","오전 9~11시","오후 1~3시","오후 3~5시","오후 5~7시"],
};
const QUOTES = [
  "하늘은 스스로 돕는 자를 돕는다",
  "천 리 길도 한 걸음부터 시작된다",
  "인내는 쓰나 그 열매는 달다",
  "밤이 가장 어두울 때 새벽이 온다",
];
const OHANG_COLORS = {
  목:{name:"새싹 그린",hex:"#4CAF50",palette:["#81C784","#4CAF50","#2E7D32","#F1F8E9","#DCEDC8"],desc:"성장과 생명력의 에너지"},
  화:{name:"불꽃 레드",hex:"#F44336",palette:["#EF9A9A","#F44336","#B71C1C","#FFF3E0","#FFCCBC"],desc:"열정과 창의력의 에너지"},
  토:{name:"황토 골드",hex:"#FF8F00",palette:["#FFE082","#FF8F00","#E65100","#FFF8E1","#FFE0B2"],desc:"안정과 신뢰의 에너지"},
  금:{name:"실버 화이트",hex:"#9E9E9E",palette:["#F5F5F5","#9E9E9E","#424242","#ECEFF1","#CFD8DC"],desc:"정밀함과 순수함의 에너지"},
  수:{name:"딥 네이비",hex:"#1A237E",palette:["#7986CB","#1A237E","#0D47A1","#E8EAF6","#C5CAE9"],desc:"지혜와 유연함의 에너지"},
};

function calcUnse(isLoggedIn) {
  const rng = seededRng(isLoggedIn ? todaySeed() + 7777 : todaySeed());
  const headline = pick(HEADLINES, rng);
  const areas = AREAS.map(({area, emoji, msgs}) => {
    const [text, score] = msgs[Math.floor(rng() * msgs.length)];
    return {area, emoji, text, score};
  });
  const star = Math.round(areas.reduce((s,a)=>s+a.score,0)/areas.length);
  const ohangKeys = Object.keys(OHANG_COLORS);
  return {
    headline, star, areas,
    luckyColor: pick(LUCKYS.color, rng),
    luckyNum:   pick(LUCKYS.num, rng),
    luckyDir:   pick(LUCKYS.dir, rng),
    luckyFood:  pick(LUCKYS.food, rng),
    luckyTime:  pick(LUCKYS.time, rng),
    quote:      pick(QUOTES, rng),
    ohang:      isLoggedIn ? OHANG_COLORS[pick(ohangKeys, rng)] : null,
  };
}

function Stars({n}) {
  return <span style={{color:G,letterSpacing:1}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function Sheet({children, onClose}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:DG,borderRadius:"20px 20px 0 0",maxHeight:"90vh",overflowY:"auto",fontFamily:"'Noto Serif KR',serif",paddingBottom:36}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"12px auto 0"}}/>
        {children}
      </div>
    </div>
  );
}

function GBtn({children, onClick, dim=false}) {
  return (
    <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.09)":`linear-gradient(135deg,${G},#C4922A)`,color:dim?"rgba(255,255,255,0.55)":"#0D0D14"}}>
      {children}
    </button>
  );
}

function UnseView({isLoggedIn}) {
  const [openArea, setOpenArea] = useState(null);
  const d = calcUnse(isLoggedIn);
  const DETAIL = {
    총운:"사주 오행 기운이 가장 강하게 작용하는 시간대를 활용하면 좋아요. 서두르기보다 타이밍을 보세요.",
    재물:"금전 운의 흐름이 보여요. 무리한 투자보다는 작은 기회를 잡는 날이에요.",
    애정:"인연의 기운이 흐르는 날이에요. 먼저 다가가는 용기가 오늘의 키워드예요.",
    건강:"몸의 신호에 집중하는 날이에요. 회복이 곧 전진이에요.",
    직업:"커리어의 흐름이 변화하는 시점이에요. 준비된 사람에게 기회가 먼저 와요.",
  };
  return (
    <div style={{background:"#111827",minHeight:"100vh",paddingBottom:80}}>
      <div style={{background:DG,padding:"20px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
            <h2 style={{fontSize:20,fontWeight:700,color:G,margin:0}}>✦ 오늘의 운세</h2>
          </div>
          <span style={{fontSize:11,padding:"5px 11px",borderRadius:20,background:isLoggedIn?"rgba(95,196,158,0.15)":"rgba(255,255,255,0.07)",color:isLoggedIn?"#5FC49E":"rgba(255,255,255,0.5)",border:`1px solid ${isLoggedIn?"rgba(95,196,158,0.3)":"rgba(255,255,255,0.12)"}`}}>
            {isLoggedIn?"🔮 개인화 운세":"🌐 공통 운세"}
          </span>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",marginBottom:0}}>
          <p style={{fontSize:16,fontWeight:600,color:"#F0EAD6",lineHeight:1.65,margin:"0 0 8px"}}>"{d.headline}"</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Stars n={d.star}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>오늘의 전체 운 {d.star}/5</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,padding:"12px 0 2px",overflowX:"auto",scrollbarWidth:"none"}}>
          {[["🎨","행운색",d.luckyColor],["🔢","숫자",String(d.luckyNum)],["🧭","방향",d.luckyDir],["🍽️","음식",d.luckyFood],["⏰","시간",d.luckyTime]].map(([icon,label,val])=>(
            <div key={label} style={{flexShrink:0,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"9px 12px",textAlign:"center",minWidth:66}}>
              <p style={{fontSize:15,margin:"0 0 3px"}}>{icon}</p>
              <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{label}</p>
              <p style={{fontSize:11,fontWeight:700,color:G,margin:0}}>{val}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 14px 0"}}>
        {isLoggedIn && d.ohang && (
          <div style={{background:DG,borderRadius:16,padding:"15px",marginBottom:10,border:`1px solid ${d.ohang.hex}33`}}>
            <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>🎨 오행 퍼스널컬러</p>
            <div style={{display:"flex",gap:5,marginBottom:10,alignItems:"flex-end"}}>
              {d.ohang.palette.map((hex,i)=>(
                <div key={i} style={{flex:1,height:i===2?42:26,background:hex,borderRadius:7,border:i===2?`2px solid ${hex}`:""}}/>
              ))}
            </div>
            <p style={{fontSize:13,fontWeight:700,color:d.ohang.hex,margin:"0 0 2px"}}>{d.ohang.name}</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>{d.ohang.desc}</p>
          </div>
        )}
        <div style={{background:DG,borderRadius:16,overflow:"hidden",marginBottom:10}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,padding:"12px 15px 9px",margin:0,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>📊 영역별 운세</p>
          {d.areas.map(({area,emoji,text,score})=>{
            const isOpen = openArea===area;
            const sc = score>=4?"#5FC49E":score>=3?G:"#FF7675";
            return (
              <div key={area} style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <button onClick={()=>setOpenArea(isOpen?null:area)} style={{width:"100%",padding:"12px 15px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:9,textAlign:"left"}}>
                  <span style={{fontSize:19,flexShrink:0}}>{emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#F0EAD6"}}>{area}</span>
                      <Stars n={score}/>
                    </div>
                    <p style={{fontSize:11,color:sc,margin:0,fontWeight:600}}>{text}</p>
                  </div>
                  <span style={{color:"rgba(255,255,255,0.3)",fontSize:10,transition:"0.2s",display:"inline-block",transform:isOpen?"rotate(180deg)":"none"}}>▼</span>
                </button>
                {isOpen && (
                  <div style={{padding:"0 15px 12px"}}>
                    {isLoggedIn
                      ? <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.8,margin:0}}>{DETAIL[area]}</p>
                      : <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:10,padding:"11px",textAlign:"center"}}>
                          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 6px"}}>🔒 사주 입력 후 개인화 상세 운세 제공</p>
                          <span style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:"rgba(232,200,122,0.1)",color:G,border:"1px solid rgba(232,200,122,0.25)"}}>로그인하고 확인하기</span>
                        </div>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!isLoggedIn && (
          <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:10,textAlign:"center",border:"1px dashed rgba(232,200,122,0.28)"}}>
            <p style={{fontSize:22,margin:"0 0 7px"}}>🔮</p>
            <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>사주 입력하면 달라져요</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.7,margin:"0 0 11px"}}>오행 퍼스널컬러 + 개인화 운세<br/>영역별 상세 풀이까지 제공해요</p>
            <span style={{fontSize:11,padding:"6px 16px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하기 →</span>
          </div>
        )}
        <div style={{background:DG,borderRadius:16,padding:"16px"}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 9px"}}>✦ 오늘의 명언</p>
          <p style={{fontSize:14,color:"#F0EAD6",fontStyle:"italic",lineHeight:1.8,margin:"0 0 5px"}}>"{d.quote}"</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>— 매일 자정 바뀌어요</p>
        </div>
      </div>
    </div>
  );
}

const LOAD_MSGS = [
  "명부전 VIP 장부에서 이름 찾는 중... 📋",
  "월하노인이 붉은 실 엮킨 곳 푸는 중... 🧶",
  "이마에서 재물선 스캔하는 중... 💫",
  "눈썹에서 인복 계산하는 중... 👁️",
  "전생 데이터베이스 조회 중... ⚡",
  "운명의 실 엮는 중... 🌟",
];
const QS = [
  {q:"가장 궁금한 건 뭐예요?", opts:["💰 돈이 모이는 체질인지","❤️ 연애/결혼 운","🎯 진로/직업 방향","🌟 그냥 다 알려줘"]},
  {q:"요즘 마음의 온도는?", opts:["❄️ 꽁꽁 (힘든 시기)","🌱 봄바람 (기대하는 중)","☀️ 따뜻 (안정적)","⛈️ 폭풍 후 (회복 중)"]},
  {q:"나이대는?", opts:["20대","30대","40대","50대+"]},
  {q:"현재 상황은?", opts:["학생","취준생","직장인","자영업","프리랜서","기타"]},
];

function GwansangPopup({initStep, onClose}) {
  const [step, setStep] = useState(initStep);
  const [qIdx, setQIdx] = useState(0);
  const [curAns, setCurAns] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [loadPct, setLoadPct] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const fileRef = useRef(null);
  const ivRef = useRef(null);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadPct(0); setMsgIdx(0);
    let pct = 0;
    ivRef.current = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 6 + 2);
      setLoadPct(Math.floor(pct));
      setMsgIdx(i => Math.random() > 0.88 ? (i+1) % LOAD_MSGS.length : i);
      if (pct >= 100) { clearInterval(ivRef.current); setTimeout(() => setStep("result"), 600); }
    }, 180);
    return () => clearInterval(ivRef.current);
  }, [step]);

  function nextQ() {
    if (!curAns) return;
    setCurAns(null);
    if (qIdx + 1 >= QS.length) { setStep("loading"); }
    else { setQIdx(i => i+1); }
  }

  const q = QS[qIdx] || QS[0];

  if (step === "who") return (
    <Sheet onClose={onClose}>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 5px"}}>👤 누구의 관상을 볼까요?</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 18px"}}>등록된 인물을 선택하거나 새로 추가하세요</p>
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px",textAlign:"center",marginBottom:10}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",margin:0}}>등록된 인물이 없어요</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={()=>setStep("upload")}>+ 새 인물 추가하고 시작</GBtn>
          <GBtn onClick={onClose} dim>취소</GBtn>
        </div>
      </div>
    </Sheet>
  );

  if (step === "upload") return (
    <Sheet onClose={onClose}>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🔍 내 관상보기</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 14px"}}>사진 한 장으로 부위별 관상 분석 · 980원</p>
        <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"13px",marginBottom:12}}>
          <p style={{fontSize:11,fontWeight:700,color:G,margin:"0 0 7px"}}>📸 정확한 분석을 위한 사진 가이드</p>
          {["✅ 1명만 나온 정면 사진","✅ 밝은 조명, 선명한 화질","❌ 선글라스·마스크·과도한 필터 금지","❌ 단체사진·아기·그림/캐릭터 불가"].map(t=>(
            <p key={t} style={{fontSize:11,color:t.startsWith("✅")?"#5FC49E":"#FF7675",margin:"0 0 2px"}}>{t}</p>
          ))}
          <p style={{fontSize:10,color:"rgba(255,255,255,0.28)",marginTop:4}}>(가이드에 맞지 않는 사진은 AI가 거절할 수 있습니다)</p>
        </div>
        <button onClick={()=>setAgreed(v=>!v)} style={{width:"100%",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:9,padding:"0 0 12px",textAlign:"left"}}>
          <div style={{width:17,height:17,border:`2px solid ${agreed?G:"rgba(255,255,255,0.3)"}`,borderRadius:4,background:agreed?G:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {agreed && <span style={{color:"#0D0D14",fontSize:10,fontWeight:700}}>✓</span>}
          </div>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>본인의 사진이거나, 당사자의 사전 동의를 받은 사진임을 확인합니다.</span>
        </button>
        <div onClick={()=>agreed&&fileRef.current?.click()} style={{border:`2px dashed rgba(232,200,122,${agreed?0.38:0.12})`,borderRadius:14,padding:"26px 18px",textAlign:"center",marginBottom:10,cursor:agreed?"pointer":"default",transition:"0.2s"}}>
          {imgUrl
            ? <img src={imgUrl} alt="preview" style={{maxHeight:150,maxWidth:"100%",borderRadius:10,objectFit:"cover"}}/>
            : <>
                <p style={{fontSize:30,margin:"0 0 7px"}}>📸</p>
                <p style={{fontSize:13,fontWeight:600,color:agreed?"#F0EAD6":"rgba(255,255,255,0.3)",margin:"0 0 3px"}}>사진을 올려주세요</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.28)",margin:0}}>정면 얼굴 1명 권장</p>
              </>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)setImgUrl(URL.createObjectURL(f));}}/>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.22)",textAlign:"center",margin:"0 0 10px"}}>※ 업로드된 사진은 분석 즉시 삭제되며, 서버에 저장되지 않습니다.</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={()=>{if(agreed)setStep("questions");}} dim={!agreed}>관상 분석하기 →</GBtn>
          <GBtn onClick={onClose} dim>취소</GBtn>
        </div>
      </div>
    </Sheet>
  );

  if (step === "questions") return (
    <Sheet onClose={onClose}>
      <div style={{padding:"20px 18px 0"}}>
        <p style={{fontSize:11,color:G,letterSpacing:2,margin:"0 0 3px"}}>🎯 더 정확한 분석을 위해</p>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>간단한 질문 {QS.length}개만 답해주세요!</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 14px"}}>({qIdx+1}/{QS.length}) {q.q}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {q.opts.map(opt=>(
            <button key={opt} onClick={()=>setCurAns(opt)} style={{
              padding:"13px 9px",borderRadius:12,cursor:"pointer",fontSize:12,
              fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",
              background:curAns===opt?"rgba(232,200,122,0.13)":"rgba(255,255,255,0.05)",
              outline:curAns===opt?`1.5px solid ${G}`:"1.5px solid rgba(255,255,255,0.1)",
              color:curAns===opt?G:"rgba(255,255,255,0.6)",
            }}>{opt}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:8}}>
          <input placeholder="직접 입력..." style={{flex:1,padding:"10px 13px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,color:"#F0EAD6",fontSize:12,fontFamily:"inherit",outline:"none"}}/>
          <button style={{padding:"10px 13px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:11,color:"#0D0D14",fontWeight:700,fontSize:12,cursor:"pointer"}}>확인</button>
        </div>
        <p onClick={()=>setStep("loading")} style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.32)",cursor:"pointer",margin:"0 0 10px",textDecoration:"underline"}}>건너뛰고 바로 분석 →</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={nextQ} dim={!curAns}>{qIdx<QS.length-1?"다음 →":"관상 분석하기 (무료) →"}</GBtn>
          <GBtn onClick={()=>{if(qIdx>0){setQIdx(i=>i-1);setCurAns(null);}else setStep("upload");}} dim>이전으로</GBtn>
        </div>
      </div>
    </Sheet>
  );

  if (step === "loading") return (
    <Sheet onClose={()=>{}}>
      <div style={{padding:"30px 18px",textAlign:"center"}}>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🔍 관상 초정밀 분석 중...</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 26px"}}>AI가 이목구비를 하나하나 스캐닝하고 있어요</p>
        <div style={{fontSize:50,marginBottom:12}}>🔮</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 16px"}}>운명을 읽고 있어요...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}>
          <div style={{height:"100%",width:`${loadPct}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.18s linear"}}/>
        </div>
        <p style={{fontSize:13,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.42)",minHeight:20,margin:"0 0 18px"}}>{LOAD_MSGS[msgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </Sheet>
  );

  if (step === "result") return (
    <Sheet onClose={onClose}>
      <div style={{padding:"22px 18px 0"}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <p style={{fontSize:34,margin:"0 0 4px"}}>✨</p>
          <p style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>분석 완료!</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>나의 오늘의 운세 (1/2)</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"14px",marginBottom:9}}>
          <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 7px"}}>✦ 핵심 분석</p>
          <p style={{fontSize:13,color:"#F0EAD6",lineHeight:1.85,margin:0}}>목(木) 기운이 강한 일간으로 창의적이고 성장 지향적 성향입니다. 2026년 하반기부터 결정적인 기회가 열립니다.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:"14px",marginBottom:9}}>
          <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 7px"}}>✦ 오행 보완</p>
          <p style={{fontSize:13,color:"#F0EAD6",margin:"0 0 9px"}}>화(火) 기운이 부족합니다. 빨간색 아이템을 지니면 도움이 돼요.</p>
          <div style={{display:"flex",gap:7}}>
            <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"rgba(255,119,117,0.14)",color:"#FF7675",border:"1px solid rgba(255,119,117,0.28)"}}>🔴 화(火) 보완 필요</span>
            <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"rgba(255,143,0,0.12)",color:"#FF8F00",border:"1px solid rgba(255,143,0,0.25)"}}>빨간 아이템 추천</span>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.13)",borderRadius:13,padding:"14px",marginBottom:9,textAlign:"center"}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",margin:"0 0 7px"}}>📸 관상 분석 이미지</p>
          <div style={{height:80,background:"rgba(255,255,255,0.04)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.18)"}}>← 관상짤로 대체 예정 →</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:9}}>
          {[["🪞","내 관상은?","내 관상보기 →","#1a3a1a"],["📸","내 관상짤은?","관상짤 →","#2a1a3a"],["☯️","내 사주는?","사주 풀이 →","#1a2a3a"],["🌟","오늘의 운세는?","오늘의 타로 →","#3a2a1a"]].map(([icon,title,sub,bg])=>(
            <div key={title} style={{background:bg,border:"1px solid rgba(255,255,255,0.09)",borderRadius:13,padding:"13px",cursor:"pointer"}}>
              <p style={{fontSize:21,margin:"0 0 4px"}}>{icon}</p>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{title}</p>
              <p style={{fontSize:10,color:G,margin:0}}>{sub}</p>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.16)",borderRadius:13,padding:"13px",marginBottom:9,textAlign:"center"}}>
          <p style={{fontSize:12,color:G,margin:"0 0 9px",fontWeight:600}}>☁️ 로그인하고 저장해요!</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {["💬 카카오톡으로 공유","🔗 링크 복사하기"].map(t=>(
              <span key={t} style={{fontSize:11,padding:"7px",borderRadius:9,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.55)",cursor:"pointer",textAlign:"center"}}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",marginBottom:9}}>
          {[["👶","아기 관상","980원"],["💑","커플 궁합","1,980원"],["🌟","오늘운세","무료"]].map(([emoji,name,price])=>(
            <div key={name} style={{flexShrink:0,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:"11px 13px",textAlign:"center",minWidth:78,cursor:"pointer"}}>
              <p style={{fontSize:20,margin:"0 0 3px"}}>{emoji}</p>
              <p style={{fontSize:11,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>{name}</p>
              <p style={{fontSize:10,color:G,margin:0}}>{price}</p>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <GBtn onClick={onClose}>확인 완료</GBtn>
          <GBtn onClick={()=>{}} dim>굿즈샵 전체 보기 →</GBtn>
        </div>
      </div>
    </Sheet>
  );

  return null;
}

export default function 천기미리보기() {
  const [tab, setTab] = useState("unse");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popup, setPopup] = useState(null);

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{background:"#0a0f1a",padding:"9px 13px",display:"flex",gap:7,alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        {[["unse","🌟 오늘의운세"],["gwansang","🔍 관상보기"]].map(([t,label])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 13px",border:"none",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",background:tab===t?G:"rgba(255,255,255,0.08)",color:tab===t?"#0D0D14":"rgba(255,255,255,0.45)"}}>
            {label}
          </button>
        ))}
        <button onClick={()=>setIsLoggedIn(v=>!v)} style={{marginLeft:"auto",padding:"5px 11px",border:"none",borderRadius:20,cursor:"pointer",fontSize:10,fontFamily:"inherit",background:isLoggedIn?"rgba(95,196,158,0.17)":"rgba(255,255,255,0.07)",color:isLoggedIn?"#5FC49E":"rgba(255,255,255,0.38)"}}>
          {isLoggedIn?"🔮 로그인":"🌐 비로그인"}
        </button>
      </div>

      {tab==="unse" && <UnseView isLoggedIn={isLoggedIn}/>}

      {tab==="gwansang" && (
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:18}}>
          <p style={{fontSize:14,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px",textAlign:"center"}}>🔍 관상보기 — 단계별 미리보기</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:"0 0 14px"}}>버튼을 눌러서 각 단계를 확인하세요</p>
          {[["who","1단계 — 누구의 관상을 볼까요?"],["upload","2단계 — 사진 업로드"],["questions","3단계 — 추가 질문 (4개)"],["loading","4단계 — 로딩 애니메이션"],["result","5단계 — 분석 결과"]].map(([s,label])=>(
            <button key={s} onClick={()=>setPopup(s)} style={{padding:"14px 17px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:13,color:"#F0EAD6",fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
              {label}
            </button>
          ))}
        </div>
      )}

      {popup && <GwansangPopup initStep={popup} onClose={()=>setPopup(null)}/>}
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
