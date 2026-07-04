import { useState, useRef, useEffect } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"어떤 손을 분석할까요?", icon:"✋", multi:false, skippable:false,
   opts:["왼손 (선천운 · 타고난 잠재력)","오른손 (후천운 · 현재·미래)"]},
  {title:"가장 궁금한 손금은?", icon:"🔍", multi:true, skippable:false,
   opts:["❤️ 감정선 (연애·결혼)","💰 재물선 (돈복·재산)","💼 생명선 (건강·수명)","📜 두뇌선 (지능·직업)","🌟 운명선 (인생 방향)","✨ 태양선 (명예·성공)","🌈 전체 다 궁금해요!"]},
  {title:"지금 가장 신경 쓰이는 건?", icon:"💭", multi:false, skippable:true,
   opts:["❤️ 연애·결혼이 언제 될지","💰 돈복이 있는지","💼 직업·커리어 방향","🌿 건강·수명","🌟 인생 전체 흐름","🔮 딱히 없어요"]},
];

var LOADING_MSGS = [
  "손금 윤곽 분석 중... ✋","생명선 추적 중... 💚",
  "감정선 해석 중... ❤️","재물선 감지 중... 💰",
  "도사 할머니가 손 들여다보는 중... 🔮","운명선 스캔 중... 🌟",
  "손바닥 전체 기운 측정 중... ☯️"
];

// 손금 분석 결과 (실제는 Claude Vision API로 생성)
var PALM_RESULT = {
  hand: "오른손",
  dominant_lines: ["감정선 ❤️","생명선 💚","두뇌선 🧠","운명선 🌟"],
  overview: DEMO_NAME+"님 손을 보는 순간 느낌이 왔어요. 손금이 선명하고 깊게 패여있어요. 이건 에너지가 강하고 의지력이 뚜렷한 손이에요. 생명선이 길고 끊김 없이 이어져 있고, 감정선이 유독 선명해요. 이 손금의 주인은 감수성이 풍부하고, 한번 마음을 먹으면 끝까지 가는 사람이에요.",
  lines: [
    {name:"❤️ 감정선",score:82,length:"길고 선명",shape:"완만한 호",
     reading:"감정선이 검지 아래까지 길게 이어져요. 이건 감정이 풍부하고 사랑에 진심인 사람의 손금이에요. 한 번 사랑하면 깊이 빠지는 타입이에요. 감정선 중간에 작은 섬(○) 모양이 보이는데, 이 시기에 감정적인 시련이나 이별 경험이 있었을 거예요. 하지만 선이 끊기지 않고 계속 이어져서 결국 좋은 인연으로 마무리되는 손금이에요. 결혼선이 1~2개 보여요. 한 번의 깊은 인연이 있을 사주예요.",
     caution:"감정에 너무 치우쳐 이성적인 판단을 놓치는 경우를 조심하세요."},
    {name:"💰 재물선",score:74,length:"중간 길이",shape:"중지 하단에서 시작",
     reading:"재물선이 손바닥 중간에서 시작해 위로 이어져요. 처음에는 가늘다가 점점 굵어지는 형태인데, 이건 나이가 들수록 재물이 쌓이는 손금이에요. 젊을 때는 수입이 불규칙했을 수 있지만, 30대 중반 이후부터 재물이 안정적으로 들어오는 패턴이에요. 재물선 끝이 두 갈래로 갈리는 지점이 보이는데, 이건 수입원이 여러 개 생기는 것을 의미해요.",
     caution:"한 번에 큰돈을 쫓기보다 꾸준히 쌓는 방식이 이 손금에 맞아요."},
    {name:"💚 생명선",score:88,length:"매우 길고 선명",shape:"엄지 주변을 크게 감싸는 호",
     reading:"생명선이 손바닥 전체를 크게 감싸는 형태예요. 이건 생명력이 강하고 회복력이 뛰어난 손금이에요. 중간에 작은 가지선이 위로 올라가는 게 보이는데, 이건 특정 시기에 큰 도약이나 환경 변화가 있었음을 의미해요. 생명선의 끝이 손목 가까이까지 길게 내려오는 건 장수형 손금이에요. 건강에 대한 걱정은 크게 않아도 돼요.",
     caution:"소화기 계통이 예민할 수 있어요. 스트레스 받으면 위장부터 신호가 와요."},
    {name:"🧠 두뇌선",score:79,length:"길고 경사짐",shape:"약간 아래로 내려가는 형태",
     reading:"두뇌선이 감정선과 살짝 붙어서 시작하다가 분리돼요. 이건 신중한 성격이지만 일단 결심하면 대담하게 행동하는 타입의 손금이에요. 두뇌선이 약간 아래 방향으로 경사진 건 창의적이고 예술적인 감수성을 의미해요. 직선보다 약간 곡선을 이루는 두뇌선은 현실과 창의성의 균형을 잘 잡는 타입이에요.",
     caution:"생각이 너무 많아서 결정을 미루는 경향이 있어요. 직관을 더 믿어보세요."},
    {name:"💼 태양선 (진로·명예선)",score:76,length:"중간~길이",shape:"약지 방향으로 상승",
     reading:"태양선이 손바닥 중간부터 약지(태양구) 방향으로 올라가요. 이 선이 있다는 건 자기 분야에서 인정받고 빛날 수 있는 기운이 있다는 의미예요. 태양선은 '성공선'이라고도 불려요. 이 선이 선명할수록 전문성을 인정받는 직업이나 대중에게 알려지는 일에서 두각을 나타내요. 특히 창작·기획·예술·교육 분야에서 강점을 발휘하는 손금이에요. 태양선이 중간에 짧게 끊겼다가 다시 이어지는 건 커리어에서 한 번의 큰 전환점이 있음을 의미해요. 그 전환 이후에 더 빛날 거예요.",
     caution:"태양선이 가늘고 흐릿한 부분이 있으면 그 시기에 자신감이 떨어지거나 방향을 잃을 수 있어요. 그럴 때일수록 기본을 지키세요."},
    {name:"🌟 운명선",score:71,length:"중간",shape:"손목에서 중지 방향으로 상승",
     reading:"운명선이 손바닥 중앙에서 선명하게 올라가요. 운명선이 있다는 것 자체가 뚜렷한 목표와 방향이 있다는 의미예요. 운명선이 중간에 끊겼다가 다시 시작되는 부분이 있는데, 이건 인생의 방향이 크게 바뀌는 시기가 있었음을 뜻해요. 새로운 운명선이 시작된 지점부터가 진짜 본인의 길이에요.",
     caution:"남의 기대보다 내 길을 가는 게 이 운명선의 핵심이에요."},
  ],
  special_marks: [
    {name:"섬 모양 (○)",위치:"각 선 중간",meaning:"해당 선의 에너지가 분산되는 구간이에요. 슬럼프·만성 질환·장애물을 뜻해요. 감정선에 있으면 그 시기의 이별이나 감정적 시련, 생명선에 있으면 건강 이상 신호예요."},
    {name:"별 모양 (★)",위치:"각 구(丘) 위",meaning:"돌발적인 행운이나 큰 충격을 뜻해요. 목성구(검지 아래)의 별은 명예·리더십 대길. 토성구(중지 아래)의 별은 사고 유의. 위치에 따라 길흉이 크게 달라요."},
    {name:"십자 모양 (+)",위치:"감정선·두뇌선 사이",meaning:"감정선과 두뇌선 사이의 십자는 신비십자선이에요. 직관력이 뛰어나고 종교·활인업(사람을 살리는 직업)에 적합한 손금이에요."},
    {name:"끊김 (Break)",위치:"각 선 중간",meaning:"삶의 급격한 변화나 사고, 이직 등 환경의 단절을 뜻해요. 완전히 끊긴 것보다 겹쳐서 이어지면 전환 후 더 강해지는 의미예요."},
    {name:"삼지창 (Ψ)",위치:"생명선 끝·태양선 끝",meaning:"에너지가 세 방향으로 뻗어나가는 표시예요. 말년에 활동력이 왕성하고 건강하게 지내는 대길 표시예요."},
    {name:"M자 손금",위치:"손바닥 전체",meaning:"감정선·두뇌선·생명선이 이어져 M자를 이루는 손금이에요. 대부호나 직관력이 뛰어난 사람에게 나타나는 특수한 손금이에요."},
  ],
  hand_difference: {
    left:"왼손은 선천운이에요. 타고난 잠재력과 유전적 기질, 과거의 흔적을 담고 있어요. 바꾸기 어렵지만 내면의 진짜 나를 보여줘요.",
    right:"오른손은 후천운이에요. 현재의 노력으로 만들어가는 미래를 담고 있어요. 왼손과 다르다면 그만큼 스스로 운명을 개척하고 있다는 뜻이에요.",
  },
  overall_score: 78,
  personality: "손금 전체를 보면 강한 의지와 풍부한 감성이 공존하는 손이에요. 이성과 감성의 균형을 잘 잡으면서도, 깊이 있는 인간관계를 추구하는 타입이에요.",
  fortune: "30대 후반~40대가 인생의 황금기예요. 지금 하고 있는 일을 계속 이어나가면 40대에 큰 결실이 와요.",
  gaeun: ["손을 자주 펴고 손금을 보는 연습을 하세요 — 긍정적 기운을 불러와요","왼손과 오른손 손바닥을 마주 비비는 동작이 기운 순환을 도와요","오른손 중지에 금반지나 금색 악세서리 — 재물선을 활성화해요"],
};

function GBtn({children,onClick,dim,color}){
  return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":color||"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;
}
function ScoreBar({score,color}){
  return <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
    <div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}>
      <div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/>
    </div>
    <span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span>
  </div>;
}
function Section({title,children}){
  return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
    <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>
    {children}
  </div>;
}
function Para({text}){
  return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;
}

// 손금선 오버레이 SVG 컴포넌트
function PalmOverlay({imageUrl}){
  return(
    <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
      {/* 실제 손 사진 */}
      <img src={imageUrl} alt="손금" style={{width:"100%",display:"block"}}/>
      {/* 손금선 오버레이 SVG */}
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} viewBox="0 0 300 400" preserveAspectRatio="none">
        {/* 생명선 - 초록 */}
        <path d="M 120,80 Q 80,150 75,220 Q 70,290 85,360" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85"
          style={{filter:"drop-shadow(0 0 4px #4CAF50)"}}/>
        {/* 감정선 - 빨강 */}
        <path d="M 60,130 Q 130,110 200,120 Q 240,125 265,135" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85"
          style={{filter:"drop-shadow(0 0 4px #FF6B6B)"}}/>
        {/* 두뇌선 - 파랑 */}
        <path d="M 80,160 Q 150,165 210,180 Q 240,188 260,200" stroke="#74B9FF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85"
          style={{filter:"drop-shadow(0 0 4px #74B9FF)"}}/>
        {/* 운명선 - 골드 */}
        <path d="M 155,360 Q 150,280 148,200 Q 147,150 150,100" stroke="#E8C87A" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85"
          style={{filter:"drop-shadow(0 0 4px #E8C87A)"}}/>
        {/* 재물선 - 노랑 */}
        <path d="M 210,200 Q 220,160 225,130 Q 228,110 230,90" stroke="#FDCB6E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"
          style={{filter:"drop-shadow(0 0 3px #FDCB6E)"}}/>
        {/* 태양선 (진로·명예선) - 보라 */}
        <path d="M 190,250 Q 195,200 198,160 Q 200,130 200,105" stroke="#A29BFE" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.82"
          style={{filter:"drop-shadow(0 0 3px #A29BFE)"}}/>
        {/* 특수 표시 - 별 */}
        <text x="148" y="98" fontSize="14" fill="#E8C87A" textAnchor="middle" opacity="0.9">★</text>
        {/* 라벨 */}
        <text x="58" y="127" fontSize="8" fill="#FF6B6B" fontWeight="bold" opacity="0.9">감정선</text>
        <text x="55" y="157" fontSize="8" fill="#74B9FF" fontWeight="bold" opacity="0.9">두뇌선</text>
        <text x="40" y="220" fontSize="8" fill="#4CAF50" fontWeight="bold" opacity="0.9">생명선</text>
        <text x="155" y="75" fontSize="8" fill="#E8C87A" fontWeight="bold" opacity="0.9" textAnchor="middle">운명선</text>
        <text x="232" y="87" fontSize="8" fill="#FDCB6E" fontWeight="bold" opacity="0.9">재물선</text>
        <text x="205" y="102" fontSize="8" fill="#A29BFE" fontWeight="bold" opacity="0.9">태양선</text>
        <path d="M 194,268 Q 199,218 207,172 Q 214,142 219,114" stroke="#A29BFE" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.82"/>
        <text x="223" y="110" fontSize="8" fill="#A29BFE" fontWeight="bold" opacity="0.9">태양선</text>
      </svg>
    </div>
  );
}

// 손 실루엣 (사진 없을 때)
function PalmSilhouette(){
  return(
    <div style={{position:"relative",width:"100%",background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:16,overflow:"hidden",aspectRatio:"3/4",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
      <svg viewBox="0 0 300 400" width="100%" height="100%">
        {/* 손 실루엣 */}
        <ellipse cx="150" cy="280" rx="80" ry="100" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        {/* 손가락들 */}
        <rect x="82" y="140" width="28" height="110" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <rect x="114" y="110" width="28" height="130" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <rect x="146" y="115" width="28" height="125" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <rect x="178" y="125" width="26" height="115" rx="13" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <rect x="60" y="195" width="22" height="70" rx="11" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1" transform="rotate(-20 60 195)"/>
        {/* 손금선들 */}
        <path d="M 120,190 Q 80,210 78,250 Q 76,290 88,340" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" style={{filter:"drop-shadow(0 0 6px #4CAF50)"}}/>
        <path d="M 95,200 Q 140,185 185,195 Q 210,200 225,210" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" style={{filter:"drop-shadow(0 0 6px #FF6B6B)"}}/>
        <path d="M 100,220 Q 145,215 190,228 Q 210,234 225,245" stroke="#74B9FF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" style={{filter:"drop-shadow(0 0 5px #74B9FF)"}}/>
        <path d="M 150,345 Q 148,280 147,230 Q 146,190 148,160" stroke="#E8C87A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" style={{filter:"drop-shadow(0 0 5px #E8C87A)"}}/>
        {/* 별 표시 */}
        <text x="148" y="158" fontSize="12" fill="#E8C87A" textAnchor="middle" opacity="0.85">★</text>
        {/* 라벨 */}
        <text x="72" y="197" fontSize="7.5" fill="#FF6B6B" fontWeight="bold" opacity="0.85">감정선</text>
        <text x="72" y="217" fontSize="7.5" fill="#74B9FF" fontWeight="bold" opacity="0.85">두뇌선</text>
        <text x="56" y="260" fontSize="7.5" fill="#4CAF50" fontWeight="bold" opacity="0.85">생명선</text>
        <text x="152" y="148" fontSize="7.5" fill="#E8C87A" fontWeight="bold" opacity="0.85" textAnchor="middle">운명선</text>
        <path d="M 200,310 Q 204,260 210,215 Q 216,180 222,155" stroke="#A29BFE" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.72"/>
        <text x="226" y="152" fontSize="7.5" fill="#A29BFE" fontWeight="bold" opacity="0.85">태양선</text>
      </svg>
    </div>
  );
}

export default function PalmPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [uploadedImg,setUploadedImg]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [openLine,setOpenLine]=useState(null);
  var ivRef=useRef(null);
  var fileRef=useRef(null);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*2.5+1);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},600);}
    },200);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||"";

  // ── 설명팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>✋ 손금 풀이</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>사진으로 꿰뚫어본 손바닥 속 내 인생</p>
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:13,fontWeight:900,color:G,display:"block"}}>980원</span>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>→ 380원</span>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        {/* 손금선 범례 미리보기 */}
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✋ 사진 한 장으로 5가지 손금 완전 분석</p>
          <PalmSilhouette/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>
            {[["❤️ 감정선","#FF6B6B","연애·결혼·인연"],["💰 재물선","#FDCB6E","돈복·재물·투자"],["💚 생명선","#4CAF50","건강·수명·활력"],["🧠 두뇌선","#74B9FF","지능·직업·성격"],["🌟 운명선","#E8C87A","인생방향·사명"],["✨ 특수마크","#fff","별·삼지창·섬 등"]].map(function(x){return(
              <div key={x[0]} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:16,height:3,borderRadius:2,background:x[1],flexShrink:0,boxShadow:"0 0 4px "+x[1]}}/>
                <div>
                  <p style={{fontSize:9,color:"rgba(255,255,255,0.7)",margin:0,fontWeight:600}}>{x[0]}</p>
                  <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:0}}>{x[2]}</p>
                </div>
              </div>
            );})}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 손금 풀이에서 알 수 있는 것</p>
          {[["✋","5대 손금선 완전 분석","감정·재물·생명·두뇌·운명선 전부"],["🔍","AI 선 추적 + 선명 오버레이","사진 위에 손금선을 색으로 그려드려요"],["❤️","연애·결혼 타이밍","감정선과 결혼선으로 인연 시기 분석"],["💰","재물선 상세 풀이","돈이 들어오는 방식과 시기"],["⭐","특수 기호 해석","별(★)·삼지창·섬 등 특수 마크 풀이"],["🎯","나만의 개운법","손금 기반 맞춤 행운 정보"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"14px",marginBottom:6,textAlign:"center"}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",margin:"0 0 2px"}}>📸 사진 촬영 꿀팁</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.65,margin:0}}>밝은 조명 아래 손바닥 쫙 펴서 촬영<br/>손가락 오므리지 말고 자연스럽게<br/>배경은 흰색이나 밝은 색이 좋아요</p>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:26,fontWeight:900,color:G,margin:"0 0 2px"}}>380원</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,textDecoration:"line-through"}}>원래 980원</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>손금 분석 시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 인물선택 ──
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>✋ 누구의 손금을 볼까요?</h3>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("upload");}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여</p>
          </div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("upload");}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 다른 사람 손금 보기</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사진 업로드 ──
  if(step==="upload") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>📸 손 사진을 올려주세요</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>밝은 곳에서 손바닥 펴서 촬영하면 정확해요</p>
      </div>
      <div style={{padding:"16px"}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={function(e){
          if(e.target.files&&e.target.files[0]){
            var reader=new FileReader();
            reader.onload=function(ev){setUploadedImg(ev.target.result);};
            reader.readAsDataURL(e.target.files[0]);
          }
        }}/>

        {uploadedImg?(
          <div style={{marginBottom:14}}>
            <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",marginBottom:10}}>
              <img src={uploadedImg} alt="손" style={{width:"100%",display:"block"}}/>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(46,125,50,0.9)",borderRadius:8,padding:"4px 10px"}}>
                <p style={{fontSize:10,color:"#fff",fontWeight:700,margin:0}}>✓ 업로드 완료</p>
              </div>
            </div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"inherit",marginBottom:10}}>다시 촬영하기</button>
          </div>
        ):(
          <div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",aspectRatio:"3/4",background:"rgba(255,255,255,0.03)",border:"2px dashed rgba(232,200,122,0.3)",borderRadius:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,marginBottom:14,fontFamily:"inherit"}}>
              <span style={{fontSize:48}}>✋</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>사진 올리기</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0,lineHeight:1.5}}>카메라 촬영 또는 갤러리에서 선택</p>
              </div>
            </button>
            {/* 데모용 — 실제 없어도 진행 가능 */}
            <button onClick={function(){setUploadedImg("demo");}} style={{width:"100%",padding:"12px",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,cursor:"pointer",fontSize:12,color:G,fontFamily:"inherit",marginBottom:14}}>📋 사진 없이 데모로 보기</button>
          </div>
        )}

        <GBtn onClick={function(){if(uploadedImg){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}}} dim={!uploadedImg}>
          {uploadedImg?"다음 단계로 →":"사진을 먼저 올려주세요"}
        </GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사전질문 ──
  if(step==="questions"){
    var curQ=QUESTIONS[qStep]; var totalQ=QUESTIONS.length; var progress=(qStep/totalQ)*100;
    function selectOpt(opt){
      if(curQ.multi){setMultiSel(function(prev){return prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt);});}
      else{var na=answers.slice();na[qStep]=opt;setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("payment");},300);}}
    }
    function goNext(){var na=answers.slice();if(curQ.multi&&multiSel.length>0){na[qStep]=multiSel.join(", ");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("payment");}}
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("upload");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 여러 개 선택 가능해요</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 분석 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 결제 ──
  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {/* 업로드 사진 미리보기 */}
        {uploadedImg&&uploadedImg!=="demo"&&(
          <div style={{marginBottom:12,borderRadius:12,overflow:"hidden",height:120,position:"relative"}}>
            <img src={uploadedImg} alt="손" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",display:"flex",alignItems:"flex-end",padding:"10px 12px"}}>
              <p style={{fontSize:11,color:"#fff",margin:0,fontWeight:600}}>✓ 사진 등록 완료 — 분석 준비됨</p>
            </div>
          </div>
        )}
        {answers.filter(function(a){return a&&a!=="";}).length>0&&(
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>
            {answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}
          </div>
        )}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"rgba(255,255,255,0.4)",textDecoration:"line-through"}}>정가 980원</span><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>980원</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>할인 가격</span><span style={{fontSize:16,fontWeight:700,color:G}}>380원</span></div>
        </div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>손금 분석하기 (380원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 로딩 ──
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>✋</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 8px"}}>{DEMO_NAME}님의 손금 분석 중...</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 16px"}}>{q1||"오른손"} · {q2?q2.split(",")[0]:"전체 손금"}</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.2s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:0}}>{LOADING_MSGS[loadMsgIdx]}</p>
      </div>
    </div>
  );

  // ━━━ 결과 ━━━
  var R=PALM_RESULT;
  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 손금 풀이</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 ✋ 손금 풀이</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>{q1||"오른손"} · AI 손금선 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {/* ① 사전질문 요약 */}
        {q2&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>분석 손: {q1||"오른손"}</p>
          <p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>🔍 집중 분석: {q2.split(",").slice(0,2).join(", ")}</p>
          {q3&&q3!=="🔮 딱히 없어요"&&<p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:"2px 0"}}>💭 가장 궁금한 것: {q3}</p>}
        </div>}

        {/* ② 손금 이미지 + 오버레이 */}
        <Section title="✋ 손금 AI 분석 이미지">
          {uploadedImg&&uploadedImg!=="demo"?<PalmOverlay imageUrl={uploadedImg}/>:<PalmSilhouette/>}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>
            {[["❤️","감정선","#FF6B6B"],["💚","생명선","#4CAF50"],["🧠","두뇌선","#74B9FF"],["🌟","운명선","#E8C87A"],["💰","재물선","#FDCB6E"],["💼","태양선","#A29BFE"]].map(function(x){return(
              <div key={x[1]} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:"rgba(255,255,255,0.05)",borderRadius:20}}>
                <div style={{width:14,height:2.5,borderRadius:2,background:x[2],boxShadow:"0 0 4px "+x[2]}}/>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.6)"}}>{x[1]}</span>
              </div>
            );})}
          </div>
        </Section>

        {/* ③ 종합 총평 */}
        <Section title="🔮 손금 종합 총평">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(232,200,122,0.06)",borderRadius:12,border:"1px solid rgba(232,200,122,0.25)"}}>
            <span style={{fontSize:26}}>✋</span>
            <div>
              <p style={{fontSize:14,fontWeight:800,color:"#7A5C00",margin:"0 0 2px"}}>종합 손금 점수</p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:100,height:6,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:R.overall_score+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div>
                <span style={{fontSize:15,fontWeight:900,color:"#7A5C00"}}>{R.overall_score}점</span>
              </div>
            </div>
          </div>
          <Para text={R.overview}/>
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:11,color:"#7A5C00",fontWeight:700,margin:"0 0 5px"}}>🎯 인생 전체 흐름</p>
            <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0}}>{R.fortune}</p>
          </div>
        </Section>

        {/* ④ 5대 손금선 상세 — 클릭 토글 */}
        <Section title="🔍 6대 손금선 상세 분석 (탭해서 펼치기)">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:"0 0 12px"}}>각 손금선을 탭하면 상세 풀이를 확인해요</p>
          {R.lines.map(function(line){
            var isOpen=openLine===line.name;
            var lineColor=line.name.includes("감정")?"#FF6B6B":line.name.includes("재물")?"#FDCB6E":line.name.includes("생명")?"#4CAF50":line.name.includes("두뇌")?"#74B9FF":"#E8C87A";
            return(
              <div key={line.name} style={{marginBottom:10,borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,0.07)"}}>
                <button onClick={function(){setOpenLine(isOpen?null:line.name);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:"#FAFAFA",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:lineColor,flexShrink:0,boxShadow:"0 0 6px "+lineColor}}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 2px"}}>{line.name}</p>
                    <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0}}>{line.length} · {line.shape}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{line.score}점</span>
                    <span style={{display:"block",fontSize:14,color:"rgba(0,0,0,0.3)",transform:isOpen?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
                  </div>
                </button>
                {isOpen&&<div style={{padding:"14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                  <div style={{height:5,background:"#F0EDE6",borderRadius:99,overflow:"hidden",marginBottom:12}}>
                    <div style={{height:"100%",width:line.score+"%",background:"linear-gradient(90deg,"+lineColor+","+lineColor+"aa)",borderRadius:99}}/>
                  </div>
                  <p style={{fontSize:13,color:"#222",lineHeight:1.95,margin:"0 0 10px",wordBreak:"keep-all"}}>{line.reading}</p>
                  <div style={{background:"rgba(255,200,0,0.06)",border:"1px solid rgba(200,100,0,0.15)",borderRadius:8,padding:"8px 12px"}}>
                    <p style={{fontSize:10,color:"#C4922A",fontWeight:700,margin:"0 0 3px"}}>⚠️ 주의할 점</p>
                    <p style={{fontSize:11,color:"#555",margin:0,lineHeight:1.7}}>{line.caution}</p>
                  </div>
                </div>}
              </div>
            );
          })}
        </Section>

        {/* ⑤ 특수 기호 */}
        <Section title="⭐ 특수 기호 & 마크 해석">
          <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",lineHeight:1.7,margin:"0 0 12px"}}>손금에는 선 외에도 별(★), 삼지창(Ψ), 섬(○), 십자(+) 같은 특수 기호가 나타나요. 이 기호들이 어느 위치에 있느냐에 따라 의미가 달라져요.</p>
          {R.special_marks.map(function(m,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14,padding:"12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
              <span style={{fontSize:22,flexShrink:0}}>⭐</span>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:"#7A5C00",margin:"0 0 3px"}}>{m.name} · {m["위치"]}</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{m["meaning"]}</p>
              </div>
            </div>
          );})}
        </Section>

        {/* ⑤-1 왼손 vs 오른손 차이 */}
        <Section title="✋ 왼손과 오른손의 차이">
          {[
            {hand:"✋ 왼손 (선천운)",color:"#5FC49E",text:R.hand_difference.left},
            {hand:"🤚 오른손 (후천운)",color:"#E8C87A",text:R.hand_difference.right},
          ].map(function(h,i){return(
            <div key={i} style={{marginBottom:12,padding:"14px",background:"rgba(255,255,255,0.6)",borderRadius:12,borderLeft:"4px solid "+h.color}}>
              <p style={{fontSize:12,fontWeight:700,color:"#333",margin:"0 0 6px"}}>{h.hand}</p>
              <p style={{fontSize:12,color:"#444",lineHeight:1.8,margin:0}}>{h.text}</p>
            </div>
          );})}
          <div style={{background:"rgba(232,200,122,0.08)",borderRadius:10,padding:"12px",marginTop:4}}>
            <p style={{fontSize:11,color:"#7A5C00",lineHeight:1.75,margin:0}}>💡 왼손과 오른손의 손금이 다를수록, 타고난 운명을 스스로 개척하고 있다는 뜻이에요. 오른손 운명선이 더 선명하다면 노력으로 운을 바꾸고 있는 거예요!</p>
          </div>
        </Section>

        {/* ⑥ 성격 총평 */}
        <Section title="🧬 손금으로 보는 성격">
          <Para text={R.personality}/>
        </Section>

        {/* ⑦ 개운법 */}
        <Section title="✨ 손금 기반 개운법">
          {R.gaeun.map(function(g,i){return(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
              <span style={{fontSize:16,flexShrink:0}}>✨</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g}</p>
            </div>
          );})}
        </Section>

        {/* 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님의 손에는<br/>강인한 의지와 깊은 감성이 새겨져 있어요.<br/>
            <span style={{fontSize:13,fontWeight:600}}>그 손이 만들어갈 미래가 기대돼요.</span>
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 손금 풀이의 메시지</p>
        </div>

        {/* 크로스셀링 */}
        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{emoji:"🦶",title:"발금 풀이",desc:"손금보다 정확하다는 발바닥",price:"380원"},{emoji:"⚫",title:"얼굴 점",desc:"복점일까? 점 위치의 비밀",price:"380원"},{emoji:"☯️",title:"사주 풀이",desc:"손금과 사주를 함께 분석",price:"980원"},{emoji:"👁️",title:"관상 보기",desc:"얼굴로 보는 운명과 기질",price:"380원"}].map(function(cs){return(
              <div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}>
                <p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p>
                <span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span>
              </div>
            );})}
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #손금 #손금풀이 #운명선</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
