import { useState } from "react";

const G  = "#E8C87A";
const DG = "#0D2318";
const BG = "#F5F5F0";

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
function thisMonthSeed() {
  const d = new Date();
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}
function formatMonth() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

const DEMO = { name:"규미", ohang:{ 목:8, 화:14, 토:6, 금:4, 수:10 } };

const OHANG_COLORS = {
  목:{ hex:"#4CAF50", name:"새싹 그린", palette:["#81C784","#4CAF50","#2E7D32","#F1F8E9","#DCEDC8"], desc:"성장과 생명력. 이달은 초록 계열 아이템이 행운을 불러와요." },
  화:{ hex:"#F44336", name:"불꽃 레드", palette:["#EF9A9A","#F44336","#B71C1C","#FFF3E0","#FFCCBC"], desc:"열정과 창의력. 이달은 빨간 계열 아이템이 활력을 높여줘요." },
  토:{ hex:"#FF8F00", name:"황토 골드", palette:["#FFE082","#FF8F00","#E65100","#FFF8E1","#FFE0B2"], desc:"안정과 신뢰. 이달은 황금빛 아이템이 재물운을 높여줘요." },
  금:{ hex:"#9E9E9E", name:"실버 화이트", palette:["#F5F5F5","#9E9E9E","#424242","#ECEFF1","#CFD8DC"], desc:"정밀함과 순수함. 이달은 실버·화이트 아이템이 잘 맞아요." },
  수:{ hex:"#1A237E", name:"딥 네이비", palette:["#7986CB","#1A237E","#0D47A1","#E8EAF6","#C5CAE9"], desc:"지혜와 유연함. 이달은 블루 계열 아이템이 집중력을 높여줘요." },
};

function getDominant(ohang) {
  return Object.entries(ohang).reduce((a,b) => b[1] > a[1] ? b : a)[0];
}

const MONTHLY_HEADLINES = [
  {star:5, text:"이달은 모든 기운이 당신 편이에요!"},
  {star:4, text:"꾸준히 해온 일이 결실을 맺기 시작해요"},
  {star:4, text:"좋은 흐름이 이어지는 달이에요"},
  {star:3, text:"안정 속에 작은 기회가 숨어있어요"},
  {star:2, text:"충전하며 준비하는 달이에요"},
];

const AREAS = ["총운","재물","애정","건강","직업"];
const AREA_EMOJIS = {총운:"✨",재물:"💰",애정:"💕",건강:"🌿",직업:"💼"};

const AREA_MSGS = {
  총운:[[2,"쉬어가는 달"],[3,"안정적으로 흘러가는 달"],[4,"긍정적인 흐름의 달"],[5,"이달 가장 빛나는 기운!"]],
  재물:[[2,"지출 줄이고 저축 집중"],[3,"현상 유지가 최선인 달"],[4,"뜻밖의 수입 기회가 보여요"],[5,"재물운 활짝! 투자도 좋아요"]],
  애정:[[2,"오해 쌓이기 쉬운 달"],[3,"평온한 관계 유지되는 달"],[4,"설레는 인연이 가까워지는 달"],[5,"사랑의 기운이 넘치는 달!"]],
  건강:[[2,"피로 누적 주의"],[3,"평소 루틴 유지하기 좋은 달"],[4,"활력 넘치는 달, 운동 시작 딱"],[5,"몸과 마음 최상의 컨디션!"]],
  직업:[[2,"실수 주의, 꼼꼼히 확인"],[3,"꾸준히 하면 인정받는 달"],[4,"좋은 기회가 찾아오는 달"],[5,"커리어 전환점이 될 수 있는 달!"]],
};

const WEEK_ADVICE = {
  목:{w1:"이달 첫째 주는 새로운 시작에 좋은 기운이에요. 목(木) 기운이 상승해 창의적인 아이디어가 떠오를 거예요.",w2:"둘째 주는 인간관계에서 좋은 소식이 있을 수 있어요. 협력과 소통에 집중하면 좋아요.",w3:"셋째 주는 재물운이 조심스러운 시기예요. 큰 지출보다 저축에 집중하세요.",w4:"넷째 주는 건강 관리에 특히 신경 쓰세요. 충분한 휴식이 다음 달 에너지가 돼요."},
  화:{w1:"이달 첫째 주는 화(火) 기운이 폭발적으로 상승해요. 열정을 쏟을 프로젝트를 시작하기 딱 좋아요.",w2:"둘째 주는 애정운이 특히 좋아요. 관심 있는 사람에게 먼저 다가가보세요.",w3:"셋째 주는 직업운이 상승하는 시기예요. 중요한 미팅이나 발표는 이 주에 잡으세요.",w4:"넷째 주는 에너지를 정리하고 충전하는 시간이에요. 무리하지 말고 여유를 가지세요."},
  토:{w1:"이달 첫째 주는 재물운이 강한 시기예요. 토(土)의 안정적인 에너지로 현명한 투자 결정을 내릴 수 있어요.",w2:"둘째 주는 가족이나 가까운 사람과의 관계에 집중하기 좋아요.",w3:"셋째 주는 새로운 도전보다 기존에 하던 일을 완성하는 데 집중하세요.",w4:"넷째 주는 건강한 식습관과 생활 루틴을 점검하기 좋은 시기예요."},
  금:{w1:"이달 첫째 주는 금(金) 기운의 예리함이 빛나는 시기예요. 중요한 결정을 내리기 좋아요.",w2:"둘째 주는 직업 관련 좋은 소식이 있을 수 있어요. 적극적으로 나서보세요.",w3:"셋째 주는 재물운이 상승하는 시기예요. 계획했던 투자를 실행하기 좋아요.",w4:"넷째 주는 인간관계를 정리하고 진짜 중요한 사람들에게 집중하는 시간이에요."},
  수:{w1:"이달 첫째 주는 수(水) 기운의 지혜와 직관이 빛나는 시기예요. 중요한 통찰이 올 수 있어요.",w2:"둘째 주는 건강운이 특히 좋아요. 새로운 운동이나 건강 루틴을 시작하기 좋아요.",w3:"셋째 주는 감정적으로 예민해질 수 있어요. 명상이나 산책으로 마음을 다스리세요.",w4:"넷째 주는 창의적인 활동에 집중하면 좋은 결과가 나와요."},
};

const LUCKY = {
  color:["빨간색","초록색","파란색","노란색","보라색","금색"],
  item:["동쪽 방향 소품","둥근 형태 물건","나무 소재 물건","금속 악세서리","물 관련 소품"],
  day:["매주 화요일","매주 목요일","홀수 날짜","짝수 날짜","보름 전후"],
};

function calcMonthly(isLoggedIn) {
  const seed = isLoggedIn
    ? thisMonthSeed() + Object.values(DEMO.ohang).reduce((a,b)=>a+b,0) + 500
    : thisMonthSeed();
  const rng = seededRng(seed);
  const headline = MONTHLY_HEADLINES[Math.floor(rng() * MONTHLY_HEADLINES.length)];
  const dominant = isLoggedIn ? getDominant(DEMO.ohang) : "토";
  const BONUS = {목:{직업:1,건강:.5},화:{총운:1,애정:.8},토:{재물:1,총운:.5},금:{재물:.5,직업:1},수:{건강:1,애정:.5}};
  const bonus = isLoggedIn ? (BONUS[dominant]||{}) : {};
  const areas = AREAS.map(area => {
    const opts = AREA_MSGS[area];
    const b = bonus[area]||0;
    const raw = rng()*opts.length + b*0.6;
    const idx = Math.min(opts.length-1, Math.max(0, Math.floor(raw)));
    return { area, score:opts[idx][0], text:opts[idx][1] };
  });
  return {
    headline, areas,
    luckyColor: pick(LUCKY.color, rng),
    luckyItem:  pick(LUCKY.item, rng),
    luckyDay:   pick(LUCKY.day, rng),
    weekAdvice: isLoggedIn ? WEEK_ADVICE[dominant] : null,
    ohangColor: OHANG_COLORS[isLoggedIn ? getDominant(DEMO.ohang) : "토"],
  };
}

function Stars({ n, size=13 }) {
  return <span style={{color:G,letterSpacing:1,fontSize:size}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function OhangCard({ ohangColor }) {
  return (
    <div style={{background:"#fff",border:`1px solid ${ohangColor.hex}33`,borderRadius:16,padding:"16px",marginBottom:12,boxShadow:`0 4px 18px ${ohangColor.hex}12`}}>
      <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🎨 이달의 오행 행운 컬러</p>
      <div style={{display:"flex",gap:5,marginBottom:10,alignItems:"flex-end"}}>
        {ohangColor.palette.map((hex,i)=>(
          <div key={i} style={{flex:1}}>
            <div style={{width:"100%",height:i===2?46:30,background:hex,borderRadius:8,boxShadow:i===2?`0 4px 10px ${hex}55`:"none",border:i===2?`2px solid ${hex}`:"none"}}/>
            {i===2&&<p style={{fontSize:7,color:hex,textAlign:"center",margin:"2px 0 0",fontWeight:700}}>메인</p>}
          </div>
        ))}
      </div>
      <p style={{fontSize:14,fontWeight:700,color:ohangColor.hex,margin:"0 0 3px"}}>{ohangColor.name}</p>
      <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.6}}>{ohangColor.desc}</p>
    </div>
  );
}

function OhangBanner() {
  return (
    <div style={{background:"#fff",border:"1px dashed rgba(0,0,0,0.15)",borderRadius:16,padding:"16px",marginBottom:12,textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.04)"}}>
      <p style={{fontSize:22,margin:"0 0 7px"}}>🎨</p>
      <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 4px"}}>이달의 오행 행운 컬러</p>
      <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 12px"}}>사주 오행에 맞는 이달의 행운 컬러<br/>팔레트를 로그인 후 확인해보세요</p>
      <span style={{fontSize:12,padding:"6px 16px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하기 →</span>
    </div>
  );
}

function WeekCard({ advice }) {
  return (
    <div style={{background:"#fff",borderRadius:16,padding:"15px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:0}}>📆 주차별 흐름</p>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:12,background:"rgba(95,196,158,0.1)",color:"#2E7D32",border:"1px solid rgba(95,196,158,0.2)"}}>개인화</span>
      </div>
      {[["1주차",advice.w1],["2주차",advice.w2],["3주차",advice.w3],["4주차",advice.w4]].map(([week,desc])=>(
        <div key={week} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:"rgba(232,200,122,0.1)",color:"#7A5C00",flexShrink:0,border:"1px solid rgba(232,200,122,0.2)",fontWeight:600}}>{week}</span>
          <p style={{fontSize:12,color:"rgba(0,0,0,0.6)",margin:0,lineHeight:1.75}}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

function WeekBanner() {
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 6px rgba(0,0,0,0.04)"}}>
      <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>📆 주차별 흐름</p>
      <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(200,150,0,0.18)",borderRadius:12,padding:"16px",textAlign:"center"}}>
        <p style={{fontSize:22,margin:"0 0 8px"}}>🔒</p>
        <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",margin:"0 0 10px",lineHeight:1.7}}>사주 입력 후 주차별 개인화 흐름<br/>분석을 볼 수 있어요</p>
        <span style={{fontSize:11,padding:"5px 14px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하기</span>
      </div>
    </div>
  );
}

export default function MonthlyUnse() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const d = calcMonthly(isLoggedIn);

  return (
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:"#0a0f1a",padding:"9px 14px",display:"flex",justifyContent:"center",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>미리보기</span>
        <button onClick={()=>setIsLoggedIn(v=>!v)} style={{padding:"6px 16px",background:isLoggedIn?G:"rgba(255,255,255,0.1)",border:"none",borderRadius:20,fontSize:11,fontWeight:700,color:isLoggedIn?"#0D0D14":"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
          {isLoggedIn?"🔮 로그인 상태":"🌐 비로그인 상태"}
        </button>
      </div>

      {/* 헤더 — 다크그린 */}
      <div style={{background:DG,padding:"18px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatMonth()}</p>
            <h2 style={{fontSize:20,fontWeight:700,color:G,margin:0}}>📅 이달의 운세</h2>
          </div>
          {isLoggedIn ? (
            <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(95,196,158,0.14)",border:"1px solid rgba(95,196,158,0.3)",borderRadius:20,padding:"4px 11px"}}>
              <span style={{fontSize:10}}>🔮</span>
              <span style={{fontSize:11,color:"#5FC49E"}}>{DEMO.name}님 개인화</span>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 11px"}}>
              <span style={{fontSize:10}}>🌐</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>공통 · <span style={{color:G}}>로그인하면 개인화</span></span>
            </div>
          )}
        </div>

        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:14,padding:"14px",marginBottom:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <Stars n={d.headline.star}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>이달 전체 운 {d.headline.star}/5</span>
          </div>
          <p style={{fontSize:16,fontWeight:600,color:"#F0EAD6",lineHeight:1.6,margin:0}}>"{d.headline.text}"</p>
        </div>

        <div style={{display:"flex",gap:8,padding:"12px 0 2px",overflowX:"auto",scrollbarWidth:"none"}}>
          {[["🎨","이달 행운색",d.luckyColor],["✨","행운 아이템",d.luckyItem],["📅","행운 날",d.luckyDay]].map(([icon,label,val])=>(
            <div key={label} style={{flexShrink:0,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"9px 12px",textAlign:"center",minWidth:90}}>
              <p style={{fontSize:14,margin:"0 0 3px"}}>{icon}</p>
              <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{label}</p>
              <p style={{fontSize:11,fontWeight:700,color:G,margin:0}}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 — 흰색 */}
      <div style={{padding:"12px 14px 0"}}>

        {/* 오행 퍼스널컬러 */}
        {isLoggedIn ? <OhangCard ohangColor={d.ohangColor}/> : <OhangBanner/>}

        {/* 영역별 바그래프 */}
        <div style={{background:"#fff",borderRadius:16,padding:"15px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>📊 이달의 영역별 운</p>
          {d.areas.map(({area,score,text})=>{
            const pct=(score/5)*100;
            const color=score>=4?"#2E7D32":score>=3?"#7A5C00":"#B71C1C";
            return (
              <div key={area} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:15}}>{AREA_EMOJIS[area]}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#111"}}>{area}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11,color,fontWeight:600}}>{text}</span>
                    <Stars n={score} size={11}/>
                  </div>
                </div>
                <div style={{height:6,background:"rgba(0,0,0,0.08)",borderRadius:99}}>
                  <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color}66,${color})`,borderRadius:99}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* 주차별 흐름 */}
        {isLoggedIn ? <WeekCard advice={d.weekAdvice}/> : <WeekBanner/>}

        {/* 월별 운세 상세 CTA */}
        <div style={{background:"#fff",border:`1px solid rgba(0,0,0,0.07)`,borderRadius:16,padding:"18px",marginBottom:12,textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
          <p style={{fontSize:22,margin:"0 0 6px"}}>📅</p>
          <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 4px"}}>월별 운세 상세 분석</p>
          <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 14px"}}>
            행운 날짜 + 조심할 날짜 + 특별 조언<br/>
            사주 기반 정밀 월별 운세 · <span style={{color:"#7A5C00",fontWeight:700}}>980원</span>
          </p>
          <button style={{padding:"13px 24px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:12,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
            월별 운세 상세 보기 (980원) →
          </button>
        </div>

      </div>
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
