import { useState } from "react";

const G  = "#E8C87A";
const DG = "#0D2318";
const BG = "#F5F5F0";

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
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

const DEMO = { name:"규미", ohang:{ 목:8, 화:14, 토:6, 금:4, 수:10 } };

const OHANG_COLORS = {
  목:{ hex:"#4CAF50", name:"새싹 그린", palette:["#81C784","#4CAF50","#2E7D32","#F1F8E9","#DCEDC8"], desc:"성장과 생명력의 에너지. 초록 계열 아이템이 행운을 불러와요." },
  화:{ hex:"#F44336", name:"불꽃 레드", palette:["#EF9A9A","#F44336","#B71C1C","#FFF3E0","#FFCCBC"], desc:"열정과 창의력의 에너지. 빨간 계열 아이템이 활력을 높여줘요." },
  토:{ hex:"#FF8F00", name:"황토 골드", palette:["#FFE082","#FF8F00","#E65100","#FFF8E1","#FFE0B2"], desc:"안정과 신뢰의 에너지. 황금빛 아이템이 재물운을 높여줘요." },
  금:{ hex:"#9E9E9E", name:"실버 화이트", palette:["#F5F5F5","#9E9E9E","#424242","#ECEFF1","#CFD8DC"], desc:"정밀함과 순수함의 에너지. 실버·화이트 아이템이 잘 맞아요." },
  수:{ hex:"#1A237E", name:"딥 네이비", palette:["#7986CB","#1A237E","#0D47A1","#E8EAF6","#C5CAE9"], desc:"지혜와 유연함의 에너지. 블루 계열 아이템이 집중력을 높여줘요." },
};

function getDominant(ohang) {
  return Object.entries(ohang).reduce((a,b) => b[1] > a[1] ? b : a)[0];
}

const HEADLINES = [
  "묵혀둔 일을 오늘 마무리하기 좋은 기운이에요",
  "기다리던 소식이 오늘 찾아올 수 있어요",
  "작은 용기가 큰 변화를 만드는 날",
  "예상치 못한 곳에서 행운이 찾아오는 날",
  "자신을 믿는 만큼 오늘의 운이 따라와요",
  "결정을 미뤄왔다면 오늘이 적기예요",
];

const AREAS = [
  { area:"총운", emoji:"✨" },
  { area:"재물", emoji:"💰" },
  { area:"애정", emoji:"💕" },
  { area:"건강", emoji:"🌿" },
  { area:"직업", emoji:"💼" },
];

const AREA_MSGS = {
  총운:[[2,"에너지 낮아요, 무리하지 마세요","오늘은 새로운 시도보다 익숙한 일에 집중하세요. 충분한 휴식이 내일의 에너지가 돼요."],[3,"평범하지만 안정적인 하루","큰 사건 없이 무난하게 흘러가는 하루예요. 꾸준함이 오늘의 키워드예요."],[4,"긍정적인 흐름이 이어지는 날","긍정적인 에너지가 흐르는 날이에요. 망설이던 일을 오늘 시작하면 좋은 결과로 이어질 가능성이 높아요."],[5,"최고의 하루! 모든 일이 술술","오늘은 모든 일이 원활하게 흘러가는 최상의 날이에요. 중요한 결정이나 만남을 오늘로 잡으면 특히 좋아요."]],
  재물:[[2,"지출 주의, 큰 결정은 미루세요","오늘은 충동 구매나 큰 지출을 자제하세요. 가계부를 정리하거나 저축 계획을 세우기 좋은 날이에요."],[3,"현상 유지가 최선인 날","재물 흐름이 잔잔한 하루예요. 기존 자산을 유지하는 데 집중하고, 새로운 투자는 더 검토 후 결정하세요."],[4,"뜻밖의 수입 기회가 보여요","오늘은 재물운이 상승 중이에요. 협상이나 거래가 있다면 적극적으로 나서도 좋아요."],[5,"재물운 활짝! 투자·협상 좋아요","재물운이 최고조에 달한 날이에요. 중요한 계약, 투자 결정을 오늘 진행하면 유리한 결과를 얻을 가능성이 높아요."]],
  애정:[[2,"오해가 쌓이기 쉬운 날","오늘은 감정이 예민해질 수 있어요. 중요한 대화는 내일로 미루는 게 좋아요."],[3,"평온한 관계가 유지되는 날","관계가 안정적으로 유지되는 날이에요. 평소대로 따뜻하게 대하면 좋아요."],[4,"설레는 만남이 기다려요","좋은 기운이 감도는 날이에요. 오랫동안 연락하지 못했던 사람에게 먼저 손을 내밀어보세요."],[5,"사랑의 기운이 넘치는 날!","애정운이 최고조예요. 솔직한 감정 표현이 상대방의 마음을 움직일 거예요."]],
  건강:[[2,"피로감 주의, 충분히 쉬세요","오늘은 체력이 평소보다 떨어질 수 있어요. 충분한 수면과 따뜻한 음식으로 몸을 보호하세요."],[3,"평소 루틴 유지하기 좋은 날","건강 관리에 있어 지금이 루틴을 세우기 좋은 타이밍이에요."],[4,"활력 넘쳐요, 운동 딱 좋아요","에너지가 넘치는 날이에요. 평소 미뤄왔던 운동을 시작하거나 야외 활동을 즐기기 좋아요."],[5,"몸과 마음 최상의 상태!","몸과 마음 모두 최상의 컨디션이에요. 오늘 시작하는 건강 습관은 오래 지속될 가능성이 높아요."]],
  직업:[[2,"실수 주의, 꼼꼼히 확인하세요","오늘은 업무에서 사소한 실수가 발생할 수 있어요. 중요한 문서는 반드시 재확인하세요."],[3,"꾸준한 노력이 쌓이는 날","꾸준히 쌓아온 노력이 서서히 인정받기 시작하는 시기예요."],[4,"좋은 기회가 찾아올 수 있어요","중요한 프로젝트나 제안의 기회가 찾아올 수 있어요. 준비가 되어 있다면 적극적으로 나서세요."],[5,"커리어 전환점이 될 수 있는 날","직업운이 최고조예요. 오늘의 성과가 커리어에 큰 영향을 미칠 수 있어요."]],
};

const LUCKYS = {
  color:["빨간색","주황색","노란색","초록색","파란색","보라색","금색","흰색"],
  num: Array.from({length:99},(_,i)=>i+1),
  dir: ["동쪽","서쪽","남쪽","북쪽","동남쪽","서북쪽"],
  food:["된장국","비빔밥","갈비탕","냉면","삼겹살","떡볶이","순두부찌개","초밥"],
  time:["오전 7~9시","오전 9~11시","오후 1~3시","오후 3~5시","오후 5~7시","밤 9~11시"],
};


function calcUnse(isLoggedIn) {
  const seed = isLoggedIn
    ? todaySeed() + Object.values(DEMO.ohang).reduce((a,b)=>a+b,0)*7 + 1000
    : todaySeed();
  const rng = seededRng(seed);
  const headline = pick(HEADLINES, rng);
  const dominant = isLoggedIn ? getDominant(DEMO.ohang) : "토";
  const BONUS = {목:{직업:1,건강:.5},화:{총운:1,애정:.8},토:{재물:1,총운:.5},금:{재물:.5,직업:1},수:{건강:1,애정:.5}};
  const bonus = isLoggedIn ? (BONUS[dominant]||{}) : {};
  const areas = AREAS.map(({area,emoji}) => {
    const opts = AREA_MSGS[area];
    const b = bonus[area]||0;
    const raw = rng()*opts.length + b*0.6;
    const idx = Math.min(opts.length-1, Math.max(0, Math.floor(raw)));
    return { area, emoji, score:opts[idx][0], text:opts[idx][1], detail:opts[idx][2] };
  });
  return {
    headline, areas,
    star: Math.round(areas.reduce((s,a)=>s+a.score,0)/areas.length),
    luckyColor: pick(LUCKYS.color, rng),
    luckyNum:   pick(LUCKYS.num, rng),
    luckyDir:   pick(LUCKYS.dir, rng),
    luckyFood:  pick(LUCKYS.food, rng),
    luckyTime:  pick(LUCKYS.time, rng),
    ohangColor: OHANG_COLORS[isLoggedIn ? getDominant(DEMO.ohang) : "토"],
  };
}

function Stars({ n }) {
  return <span style={{color:G,letterSpacing:1,fontSize:13}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}


function OhangCard({ ohangColor }) {
  return (
    <div style={{background:"#fff",border:`1px solid ${ohangColor.hex}33`,borderRadius:16,padding:"16px",marginBottom:12,boxShadow:`0 4px 20px ${ohangColor.hex}12`}}>
      <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🎨 오행 퍼스널컬러</p>
      <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"flex-end"}}>
        {ohangColor.palette.map((hex,i)=>(
          <div key={i} style={{flex:1}}>
            <div style={{width:"100%",height:i===2?48:32,background:hex,borderRadius:9,boxShadow:i===2?`0 4px 10px ${hex}55`:"none",border:i===2?`2px solid ${hex}`:"none"}}/>
            {i===2&&<p style={{fontSize:7,color:hex,textAlign:"center",margin:"3px 0 0",fontWeight:700}}>메인</p>}
          </div>
        ))}
      </div>
      <p style={{fontSize:14,fontWeight:700,color:ohangColor.hex,margin:"0 0 4px"}}>{ohangColor.name}</p>
      <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.7}}>{ohangColor.desc}</p>
    </div>
  );
}

function OhangBanner() {
  return (
    <div style={{background:"#fff",border:"1px dashed rgba(0,0,0,0.15)",borderRadius:16,padding:"18px",marginBottom:12,textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.04)"}}>
      <p style={{fontSize:22,margin:"0 0 8px"}}>🎨</p>
      <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 5px"}}>오행 퍼스널컬러</p>
      <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 13px"}}>로그인하면 내 사주 오행에 맞는<br/>개인화 행운 컬러를 볼 수 있어요</p>
      <span style={{fontSize:12,padding:"7px 18px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하기 →</span>
    </div>
  );
}

function AreaCard({ area, emoji, score, text, detail, isLoggedIn }) {
  const [open, setOpen] = useState(false);
  const scoreColor = score>=4?"#2E7D32":score>=3?"#7A5C00":"#B71C1C";
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:14,overflow:"hidden",marginBottom:8,boxShadow:"0 2px 6px rgba(0,0,0,0.04)"}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:"100%",padding:"13px 15px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
        <span style={{fontSize:20,flexShrink:0}}>{emoji}</span>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <span style={{fontSize:13,fontWeight:700,color:"#111"}}>{area}</span>
            <Stars n={score}/>
          </div>
          <p style={{fontSize:12,color:scoreColor,margin:0,fontWeight:600}}>{text}</p>
        </div>
        <span style={{color:"rgba(0,0,0,0.3)",fontSize:10,transition:"0.2s",display:"inline-block",transform:open?"rotate(180deg)":"none"}}>▼</span>
      </button>
      {open && (
        <div style={{padding:"0 15px 13px",borderTop:"1px solid rgba(0,0,0,0.05)"}}>
          {isLoggedIn
            ? <p style={{fontSize:13,color:"rgba(0,0,0,0.65)",lineHeight:1.85,margin:"11px 0 0"}}>{detail}</p>
            : <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(200,150,0,0.18)",borderRadius:11,padding:"13px",marginTop:11,textAlign:"center"}}>
                <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",margin:"0 0 9px",lineHeight:1.7}}>🔒 사주 입력 후 개인화 상세 운세 제공</p>
                <span style={{fontSize:11,padding:"5px 14px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하고 확인하기</span>
              </div>
          }
        </div>
      )}
    </div>
  );
}

export default function TodayUnse() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState("info"); // "info" | "result"
  const d = calcUnse(isLoggedIn);

  // ── 설명 팝업 (전체화면) ──
  if(step === "info") return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 오리지널 · 매일 업데이트</p>
        <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>🌅 오늘의 운세</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>오늘 하루의 기운을 5가지 영역으로 분석해드려요</p>
      </div>
      <div style={{padding:"16px"}}>

        {/* 오행 비주얼 그리드 */}
        <div style={{background:DG,borderRadius:16,padding:"18px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 오늘의 운세 구성</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[
              {emoji:"✨",label:"총운",desc:"오늘 하루 전체 기운"},
              {emoji:"💰",label:"재물운",desc:"돈·투자·지출 흐름"},
              {emoji:"💕",label:"애정운",desc:"연애·인연·관계"},
              {emoji:"🌿",label:"건강운",desc:"몸·에너지·컨디션"},
              {emoji:"💼",label:"직업운",desc:"일·사업·진로"},
            ].map(function(item){return(
              <div key={item.label} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 10px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18,flexShrink:0}}>{item.emoji}</span>
                <div>
                  <p style={{fontSize:12,fontWeight:700,color:G,margin:"0 0 2px"}}>{item.label}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:0}}>{item.desc}</p>
                </div>
              </div>
            );})}
            <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px 10px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,flexShrink:0}}>🎨</span>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:G,margin:"0 0 2px"}}>오행 컬러</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:0}}>사주 기반 행운 팔레트</p>
              </div>
            </div>
          </div>

          {/* 비로그인/로그인 비교 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:"11px",border:"1px solid rgba(255,255,255,0.09)"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#E8C87A",margin:"0 0 6px"}}>🌐 비로그인 (공통 운세)</p>
              {["날짜 기반 공통 운세","5개 영역 별점·요약","오늘의 행운 아이템","누구나 무료 제공"].map(function(t){return(
                <p key={t} style={{fontSize:10,color:"rgba(255,255,255,0.55)",margin:"0 0 3px"}}>✓ {t}</p>
              );})}
            </div>
            <div style={{background:"rgba(95,196,158,0.07)",borderRadius:11,padding:"11px",border:"1px solid rgba(95,196,158,0.22)"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#5FC49E",margin:"0 0 6px"}}>🔮 로그인 (내 사주 기반)</p>
              {["사주 오행 개인화 분석","영역별 상세 풀이","오행 퍼스널컬러","맞춤 행운 아이템"].map(function(t){return(
                <p key={t} style={{fontSize:10,color:"rgba(255,255,255,0.6)",margin:"0 0 3px"}}>✦ {t}</p>
              );})}
            </div>
          </div>
        </div>

        {/* 행운 아이템 미리보기 */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>✦ 오늘의 행운 아이템</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {["🎨 행운 컬러","🔢 행운 숫자","🧭 행운 방향","🍱 행운 음식","⏰ 행운 시간"].map(function(item){return(
              <span key={item} style={{fontSize:11,padding:"5px 11px",borderRadius:20,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.09)"}}>{item}</span>
            );})}
          </div>
        </div>

        {/* 무료 뱃지 */}
        <div style={{textAlign:"center",marginBottom:14}}>
          <span style={{fontSize:11,padding:"4px 14px",borderRadius:20,background:"rgba(95,196,158,0.15)",color:"#5FC49E",border:"1px solid rgba(95,196,158,0.3)",fontWeight:600}}>✦ 무료 제공 · 매일 자정 업데이트</span>
        </div>

        <button onClick={function(){setStep("result");}} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
          🌅 오늘의 운세 보기 (무료) →
        </button>
        <button onClick={function(){}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:13,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>
          닫기
        </button>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 결과 화면 ──
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
            <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
            <h2 style={{fontSize:20,fontWeight:700,color:G,margin:0}}>✦ 오늘의 운세</h2>
          </div>
          <button onClick={function(){setStep("info");}} style={{padding:"5px 11px",background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.28)",borderRadius:20,fontSize:11,color:G,cursor:"pointer"}}>
            ← 뒤로
          </button>
        </div>

        {isLoggedIn ? (
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(95,196,158,0.14)",border:"1px solid rgba(95,196,158,0.3)",borderRadius:20,padding:"4px 11px",marginBottom:12}}>
            <span style={{fontSize:10}}>🔮</span>
            <span style={{fontSize:11,color:"#5FC49E"}}>{DEMO.name}님 사주 기반 개인화 운세</span>
          </div>
        ) : (
          <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 11px",marginBottom:12}}>
            <span style={{fontSize:10}}>🌐</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>공통 운세 · <span style={{color:G}}>로그인하면 개인화</span></span>
          </div>
        )}

        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:14,padding:"15px",marginBottom:0}}>
          <p style={{fontSize:16,fontWeight:600,color:"#F0EAD6",lineHeight:1.65,margin:"0 0 8px"}}>"{d.headline}"</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Stars n={d.star}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>오늘의 전체 운 {d.star}/5</span>
          </div>
        </div>

        <div style={{display:"flex",gap:8,padding:"12px 0 2px",overflowX:"auto",scrollbarWidth:"none"}}>
          {[["🎨","행운색",d.luckyColor],["🔢","숫자",String(d.luckyNum)],["🧭","방향",d.luckyDir],["🍽️","음식",d.luckyFood],["⏰","시간",d.luckyTime]].map(([icon,label,val])=>(
            <div key={label} style={{flexShrink:0,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"9px 11px",textAlign:"center",minWidth:66}}>
              <p style={{fontSize:14,margin:"0 0 3px"}}>{icon}</p>
              <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{label}</p>
              <p style={{fontSize:11,fontWeight:700,color:G,margin:0}}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 — 흰색 */}
      <div style={{padding:"12px 14px 0"}}>
        {isLoggedIn ? <OhangCard ohangColor={d.ohangColor}/> : <OhangBanner/>}

        <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:3,margin:"0 0 10px"}}>📊 영역별 운세</p>
        {d.areas.map(a=><AreaCard key={a.area} {...a} isLoggedIn={isLoggedIn}/>)}

        {!isLoggedIn && (
          <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:16,padding:"18px",marginBottom:12,marginTop:4,textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 5px"}}>🔮 더 정확한 운세를 원한다면?</p>
            <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 13px"}}>사주 오행 기반 개인화 운세<br/>영역별 상세 풀이까지 제공해요</p>
            <span style={{fontSize:12,padding:"8px 20px",borderRadius:20,background:`linear-gradient(135deg,${G},#C4922A)`,color:"#0D0D14",fontWeight:700,cursor:"pointer"}}>로그인하기 →</span>
          </div>
        )}
      </div>

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
