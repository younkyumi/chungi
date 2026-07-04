import { useState, useEffect } from "react";

const G = "#E8C87A";
const DG = "#0D2318";

// ─── 유틸 ───
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
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const DEMO_USER = {
  name: "규미",
  ohang: { 목:8, 화:14, 토:6, 금:4, 수:10 },
};

// 숫자-오행 배속 (하도낙서 기준): 1,6=水 / 2,7=火 / 3,8=木 / 4,9=金 / 5,10=土
const OHANG_INFO = {
  목:{color:"#4CAF50",label:"목(木)",lucky:[3,8,13,18,23,28,33,38,43]},
  화:{color:"#F44336",label:"화(火)",lucky:[2,7,12,17,22,27,32,37,42]},
  토:{color:"#FF8F00",label:"토(土)",lucky:[5,10,15,20,25,30,35,40,45]},
  금:{color:"#9E9E9E",label:"금(金)",lucky:[4,9,14,19,24,29,34,39,44]},
  수:{color:"#1A237E",label:"수(水)",lucky:[1,6,11,16,21,26,31,36,41]},
};

function getDominantOhang(score) {
  return Object.entries(score).reduce((a,b)=>b[1]>a[1]?b:a)[0];
}

// 비로그인: 날짜 기반 랜덤 6개
function getCommonNumbers() {
  const rng = seededRng(todaySeed() + 5555);
  const pool = Array.from({length:45},(_,i)=>i+1);
  const result = [];
  while(result.length < 6) {
    const idx = Math.floor(rng() * pool.length);
    result.push(pool.splice(idx,1)[0]);
  }
  return result.sort((a,b)=>a-b);
}

// 로그인: 사주 오행 기반 개인화
function getPersonalNumbers(ohang) {
  const dominant = getDominantOhang(ohang);
  const secondary = Object.entries(ohang).sort((a,b)=>b[1]-a[1])[1][0];
  const info1 = OHANG_INFO[dominant];
  const info2 = OHANG_INFO[secondary];

  const seed = todaySeed() + Object.values(ohang).reduce((a,b)=>a+b,0)*7;
  const rng = seededRng(seed);

  // 오행 행운 번호 풀에서 우선 뽑고, 나머지 채우기
  const luckyPool = [...new Set([...info1.lucky, ...info2.lucky])];
  const regularPool = Array.from({length:45},(_,i)=>i+1).filter(n=>!luckyPool.includes(n));

  const result = [];
  // 오행 번호에서 3~4개
  const luckyCount = Math.floor(rng()*2)+3;
  const shuffledLucky = [...luckyPool].sort(()=>rng()-0.5);
  result.push(...shuffledLucky.slice(0,luckyCount));
  // 나머지 채우기
  const shuffledRegular = [...regularPool].sort(()=>rng()-0.5);
  while(result.length < 6) result.push(shuffledRegular.shift());

  return result.sort((a,b)=>a-b).map(n=>({
    n,
    isLucky: luckyPool.includes(n),
    ohang: info1.lucky.includes(n)?dominant:info2.lucky.includes(n)?secondary:null,
  }));
}

// 번호 색상
function getBallColor(n) {
  if (n <= 10)  return {bg:"#fbc400",text:"#000"};
  if (n <= 20)  return {bg:"#69c8f2",text:"#000"};
  if (n <= 30)  return {bg:"#ff7272",text:"#fff"};
  if (n <= 40)  return {bg:"#aaa",text:"#fff"};
  return             {bg:"#b0d840",text:"#000"};
}

// 번호 공 컴포넌트
function Ball({n, size=44, isLucky=false, ohang=null, highlight=false}) {
  const {bg, text} = getBallColor(n);
  const ohangColor = ohang ? OHANG_INFO[ohang]?.color : null;
  return (
    <div style={{position:"relative",display:"inline-flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{
        width:size,height:size,borderRadius:"50%",
        background:bg,color:text,
        fontSize:size*0.36,fontWeight:700,
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow: highlight
          ? `0 0 0 3px ${ohangColor||G}, 0 4px 16px ${ohangColor||G}66`
          : "0 2px 8px rgba(0,0,0,0.2)",
        fontFamily:"'Noto Serif KR',serif",
        transition:"all 0.3s",
        position:"relative",
      }}>
        {n}
        {isLucky && (
          <div style={{position:"absolute",top:-3,right:-3,width:12,height:12,borderRadius:"50%",background:ohangColor||G,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:6,color:"#fff"}}>✦</span>
          </div>
        )}
      </div>
      {ohang && isLucky && (
        <span style={{fontSize:8,color:ohangColor,marginTop:3,fontWeight:600}}>{ohang}</span>
      )}
    </div>
  );
}

// 번호 굴러들어오는 애니
function NumbersReveal({numbers, isLoggedIn}) {
  const [visible, setVisible] = useState([]);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    setVisible([]);
    setShowBonus(false);
    const timers = [];
    numbers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(v=>[...v,i]), 300+i*200));
    });
    timers.push(setTimeout(() => setShowBonus(true), 300+numbers.length*200+300));
    return () => timers.forEach(clearTimeout);
  }, [numbers]);

  return (
    <div style={{display:"flex",justifyContent:"center",gap:8,alignItems:"flex-end",minHeight:60}}>
      {numbers.map((item,i) => {
        const n = isLoggedIn ? item.n : item;
        const isLucky = isLoggedIn ? item.isLucky : false;
        const ohang = isLoggedIn ? item.ohang : null;
        return visible.includes(i) ? (
          <Ball key={i} n={n} isLucky={isLucky} ohang={ohang} highlight={isLucky}
            size={isLoggedIn&&isLucky?48:44}/>
        ) : (
          <div key={i} style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)"}}/>
        );
      })}
    </div>
  );
}


export default function LottoPreview() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step,       setStep]       = useState("info"); // "info" | "result"
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [key, setKey] = useState(0);

  const commonNums = getCommonNumbers();
  const personalNums = getPersonalNumbers(DEMO_USER.ohang);
  const dominant = getDominantOhang(DEMO_USER.ohang);
  const ohangInfo = OHANG_INFO[dominant];

  function handleDraw() {
    if (isRolling) return;
    setIsRolling(true);
    setIsRevealed(false);
    setKey(k=>k+1);
    setTimeout(()=>{
      setIsRevealed(true);
      setIsRolling(false);
    }, 200);
  }

  const luckyCount = personalNums.filter(n=>n.isLucky).length;

  // ── 설명 팝업 전체화면 ──
  if(step === "info") return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:"#0D2318",padding:"18px 16px"}}>
        <p style={{fontSize:9,color:"#E8C87A",letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 오리지널 · 사주 오행 기반</p>
        <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>✨ 내 사주 맞춤 행운번호</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>1일 1회 무료 · 매주 갱신</p>
      </div>
      <div style={{padding:"16px"}}>

        {/* 추첨기계 이미지 */}
        <div style={{background:"#0D2318",borderRadius:16,padding:"20px",marginBottom:12,textAlign:"center"}}>
          <img src="/lotto_machine.png" alt="천기 행운 추첨기계"
            style={{width:180,height:180,objectFit:"contain",filter:"drop-shadow(0 0 24px rgba(232,200,122,0.45))",marginBottom:14}}
            onError={function(e){e.target.style.display="none";e.target.nextSibling.style.display="block";}}
          />
          <div style={{display:"none",fontSize:80,marginBottom:14}}>🎰</div>

          <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.75,margin:0,wordBreak:"keep-all"}}>
            내 사주 오행의 기운이 담긴 숫자를 선별해<br/>이번 주 가장 강한 행운번호 6개를 뽑아드려요
          </p>
        </div>

        {/* 특징 */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:"#E8C87A",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 번호예요</p>
          {[
            {icon:"🔮", title:"사주 오행 분석", desc:"목·화·토·금·수 5가지 기운 중 가장 강한 오행의 숫자를 우선 선별해요"},
            {icon:"🌐", title:"비로그인 — 오늘의 공통 행운번호", desc:"날짜 기반 공통 번호 6개. 매일 자정에 바뀌어요"},
            {icon:"🌟", title:"로그인 — 사주 맞춤 행운번호", desc:"내 사주 오행 비율에 맞춘 개인화 번호. 황금색으로 오행 번호를 표시해요"},
            {icon:"📅", title:"매주 갱신", desc:"매주 토요일 자정에 새 번호가 생성돼요"},
          ].map(function(item){return(
            <div key={item.title} style={{display:"flex",gap:10,marginBottom:10}}>
              <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:"#E8C87A",margin:"0 0 3px"}}>{item.title}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.65}}>{item.desc}</p>
              </div>
            </div>
          );})}
        </div>

        {/* 면책 문구 */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.8,margin:0,textAlign:"center"}}>
            ⚠️ 본 번호는 사주 오행 기운을 바탕으로 생성된 <strong style={{color:"rgba(255,255,255,0.55)"}}>참고용 번호</strong>이며,<br/>
            당첨을 예측하거나 보장하지 않습니다.
          </p>
        </div>

        {/* 무료 뱃지 */}
        <div style={{textAlign:"center",marginBottom:14}}>
          <span style={{fontSize:11,padding:"4px 14px",borderRadius:20,background:"rgba(95,196,158,0.15)",color:"#5FC49E",border:"1px solid rgba(95,196,158,0.3)",fontWeight:600}}>✦ 1일 1회 무료</span>
        </div>

        <button onClick={function(){setStep("result");}} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
          이번 주 행운 번호 뽑기 ✨
        </button>
        <button onClick={function(){}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>
          취소
        </button>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 결과 화면 ──
  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 탑 토글 */}
      <div style={{background:"#0a0f1a",padding:"9px 14px",display:"flex",justifyContent:"center",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>미리보기</span>
        <button onClick={()=>{setIsLoggedIn(v=>!v);setIsRevealed(false);}} style={{padding:"6px 16px",background:isLoggedIn?G:"rgba(255,255,255,0.1)",border:"none",borderRadius:20,fontSize:11,fontWeight:700,color:isLoggedIn?"#0D0D14":"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
          {isLoggedIn?"🔮 로그인 상태":"🌐 비로그인 상태"}
        </button>
      </div>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🎰 행운 로또번호</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>
          {isLoggedIn ? "사주 오행 기반 개인화 번호 · 무료" : "오늘의 공통 행운 번호 · 무료"}
        </p>
      </div>

      <div style={{padding:"16px 14px"}}>

        {/* 비로그인 */}
        {!isLoggedIn && (
          <>
            <div style={{background:DG,borderRadius:16,padding:"18px",marginBottom:12,textAlign:"center"}}>
              <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>🌐 오늘의 공통 행운 번호</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 20px",lineHeight:1.6}}>
                오늘 날짜를 기반으로 생성된 번호예요.<br/>매일 자정에 새롭게 바뀌어요.
              </p>
              {!isRevealed ? (
                <button onClick={handleDraw} style={{padding:"14px 28px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:12,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
                  오늘의 번호 뽑기 🎰
                </button>
              ) : (
                <>
                  <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14,flexWrap:"wrap"}} key={key}>
                    {commonNums.map((n,i)=>(
                      <div key={n} style={{animation:`ballPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,animationDelay:`${i*0.12}s`}}>
                        <Ball n={n}/>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>매일 자정 새로운 번호가 나와요</p>
                </>
              )}
            </div>

            {/* 로그인 유도 */}
            <div style={{background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",border:"1px solid rgba(232,200,122,0.28)",borderRadius:16,padding:"18px",textAlign:"center"}}>
              <p style={{fontSize:22,margin:"0 0 8px"}}>🔮</p>
              <p style={{fontSize:14,fontWeight:700,color:G,margin:"0 0 6px"}}>사주 맞춤 행운 번호</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:"0 0 14px"}}>
                내 사주 오행(목·화·토·금·수) 기운에 맞는<br/>
                개인화된 번호를 받아보세요.<br/>
                <span style={{color:G}}>오행 행운 번호가 강조 표시돼요!</span>
              </p>
              <button style={{padding:"12px 24px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:12,fontSize:13,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
                로그인하고 개인화 번호 받기 →
              </button>
            </div>
          </>
        )}

        {/* 로그인 */}
        {isLoggedIn && (
          <>
            {/* 오행 설명 */}
            <div style={{background:DG,borderRadius:14,padding:"14px",marginBottom:12,border:`1px solid ${ohangInfo.color}33`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`${ohangInfo.color}33`,border:`2px solid ${ohangInfo.color}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:14,color:ohangInfo.color,fontWeight:700}}>{dominant}</span>
                </div>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:ohangInfo.color,margin:0}}>{ohangInfo.label} 기운 중심</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>✦ 표시 번호 = {DEMO_USER.name}님의 오행 행운 번호</p>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {ohangInfo.lucky.slice(0,5).map(n=>(
                  <span key={n} style={{fontSize:11,padding:"2px 10px",borderRadius:12,background:`${ohangInfo.color}22`,color:ohangInfo.color,border:`1px solid ${ohangInfo.color}44`,fontWeight:600}}>{n}</span>
                ))}
                <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",padding:"2px 4px"}}>등 {ohangInfo.lucky.length}개</span>
              </div>
            </div>

            {/* 번호 뽑기 */}
            <div style={{background:DG,borderRadius:16,padding:"18px",marginBottom:12,textAlign:"center"}}>
              <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>🔮 {DEMO_USER.name}님의 오늘 행운 번호</p>

              {!isRevealed ? (
                <>
                  <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 20px",lineHeight:1.6}}>
                    {DEMO_USER.name}님의 사주 오행을 분석해<br/>
                    행운 번호를 생성할게요.
                  </p>
                  <button onClick={handleDraw} style={{padding:"14px 28px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:12,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
                    나의 행운 번호 뽑기 🔮
                  </button>
                </>
              ) : (
                <>
                  {/* 번호 공 — 하나씩 팝 등장 */}
                  <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14,flexWrap:"wrap"}} key={key}>
                    {personalNums.map(({n,isLucky,ohang},i)=>(
                      <div key={n} style={{animation:`ballPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,animationDelay:`${i*0.12}s`}}>
                        <Ball n={n} isLucky={isLucky} ohang={ohang} highlight={isLucky} size={isLucky?50:44}/>
                      </div>
                    ))}
                  </div>

                  {/* 오행 번호 설명 */}
                  {luckyCount > 0 && (
                    <div style={{background:`${ohangInfo.color}18`,border:`1px solid ${ohangInfo.color}33`,borderRadius:12,padding:"10px 14px",marginBottom:12,textAlign:"left"}}>
                      <p style={{fontSize:11,color:ohangInfo.color,fontWeight:600,margin:"0 0 4px"}}>
                        ✦ 오행 행운 번호 {luckyCount}개 포함
                      </p>
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>
                        ✦ 표시된 번호는 {DEMO_USER.name}님의 {ohangInfo.label} 기운에서 나온 행운 번호예요.
                      </p>
                    </div>
                  )}

                  <button onClick={handleDraw} style={{padding:"11px 24px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,fontSize:12,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
                    🔄 다시 뽑기
                  </button>
                </>
              )}
            </div>

            {/* 오행별 번호 범위 안내 */}
            <div style={{background:DG,borderRadius:14,padding:"14px"}}>
              <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 오행별 행운 번호 범위</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(OHANG_INFO).map(([k,info])=>{
                  const isDom = k===dominant;
                  const myOhang = DEMO_USER.ohang[k];
                  const maxOhang = Math.max(...Object.values(DEMO_USER.ohang));
                  const pct = myOhang/maxOhang*100;
                  return (
                    <div key={k} style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:12,color:info.color,fontWeight:isDom?700:400,width:40,flexShrink:0}}>{info.label}</span>
                      <div style={{flex:1,height:5,background:"rgba(255,255,255,0.08)",borderRadius:99}}>
                        <div style={{height:"100%",width:`${pct}%`,background:info.color,borderRadius:99}}/>
                      </div>
                      <div style={{display:"flex",gap:3,flexShrink:0}}>
                        {info.lucky.slice(0,3).map(n=>(
                          <span key={n} style={{fontSize:9,padding:"1px 5px",borderRadius:8,background:`${info.color}22`,color:info.color,border:`1px solid ${info.color}33`}}>{n}</span>
                        ))}
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>...</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:12,lineHeight:1.6}}>
                기운이 강할수록 해당 오행 번호가 더 많이 포함돼요.<br/>
                매일 조금씩 달라지는 조합으로 뽑혀요.
              </p>
            </div>
          </>
        )}
      </div>
      <style>{`::-webkit-scrollbar{display:none}@keyframes ballPop{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
