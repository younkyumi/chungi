import { useState, useRef, useEffect } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"어떤 발을 분석할까요?", icon:"🦶", multi:false, skippable:false,
   opts:["왼발 (타고난 기질·성격)","오른발 (현재·미래 운)","양발 다 (풀코스)"]},
  {title:"가장 궁금한 것은?", icon:"🔍", multi:true, skippable:false,
   opts:["❤️ 연애·결혼 인연운","💰 재물·돈복","💼 직업·커리어","🌿 건강·체질","🌟 인생 전체 흐름","🌈 전체 다 궁금해요!"]},
  {title:"지금 가장 신경 쓰이는 건?", icon:"💭", multi:false, skippable:true,
   opts:["❤️ 연애·결혼이 언제 될지","💰 돈복이 있는지","💼 직업·커리어 방향","🌿 건강·수명","🌟 인생 전체 흐름","🔮 딱히 없어요"]},
];

var LOADING_MSGS = [
  "발바닥 윤곽 분석 중... 🦶","발가락 길이 측정 중... 📏",
  "발금선 추적 중... ✨","도사 할머니가 발바닥 들여다보는 중... 🔮",
  "기혈 흐름 감지 중... ☯️","족상학 데이터베이스 대조 중... 📚",
  "발바닥 전체 기운 측정 중... 🌊"
];

var FOOT_RESULT = {
  foot: "오른발",
  foot_shape: "이집트형 (엄지발가락이 가장 긴 형태)",
  overview: DEMO_NAME+"님 발바닥을 보는 순간 느낌이 왔어요. 발금이 손금보다 더 솔직하게 타고난 기질을 보여줘요. 이 발바닥은 생명력이 강하고 의지력이 뚜렷한 사람의 것이에요. 발바닥 두께가 있고, 아치가 적당히 높아요. 이건 체력이 좋고 끈기 있는 타입의 특징이에요.",
  toe_reading: {
    title: "발가락 형태로 보는 성격",
    shape: "이집트형 — 엄지가 가장 길고 새끼발가락 쪽으로 갈수록 짧아지는 형태 (전체의 약 60%)",
    meaning: "이집트형 발은 로맨틱하고 다정다감한 감수성이 특징이에요. 감정이 풍부하고 상대방을 배려하는 마음이 깊어요. 단, 감정 기복이 있는 편이며 상처도 깊게 받는 타입이에요. 예술적 감각이 뛰어나고 섬세한 일에 강점을 보여요.",
    foot_types: [
      {type:"이집트형", desc:"엄지가 가장 긺", personality:"로맨틱·다정다감·감정기복", ratio:"60%"},
      {type:"그리스형", desc:"검지가 엄지보다 긺", personality:"리더십·창의력·진취적", ratio:"20%"},
      {type:"로마형", desc:"발가락 길이가 비슷", personality:"외향적·사교적·현실적", ratio:"10%"},
      {type:"게르만형", desc:"엄지만 크고 나머지 짧고 일자", personality:"뚝심·실용주의·한 우물", ratio:"6%"},
      {type:"켈트형", desc:"검지 길고 나머지 들쭉날쭉", personality:"호기심·자유로움·틀에 얽매임 싫어함", ratio:"4%"},
    ],
    toes: [
      {name:"엄지 (목성구)","reading":"엄지가 굵고 길면 의지력과 생명력이 강해요. 한번 마음먹은 건 끝까지 가는 타입이에요."},
      {name:"검지 (화성구)","reading":"검지가 엄지보다 짧으면 겉으로는 차분해 보이지만 내면에 강한 열정이 숨어있어요."},
      {name:"중지 (토성구)","reading":"중지 길이가 균형 잡혀 있으면 현실감각과 안정감이 좋은 타입이에요."},
      {name:"약지 (태양구)","reading":"약지가 반듯하면 예술적 감각과 심미안이 발달해 있어요."},
      {name:"새끼 (수성구)","reading":"새끼발가락이 안쪽으로 살짝 굽어있으면 비밀이 많은 타입이에요. 속내를 잘 드러내지 않아요."},
    ]
  },
  lines: [
    {name:"❤️ 감정선 (발바닥 상단 가로선)",score:79,
     reading:"발바닥 상단을 가로지르는 선이 선명하게 보여요. 이 선이 선명할수록 감정이 풍부하고 인간관계에서 깊은 유대를 형성해요. 이 선이 중간에 끊김 없이 이어지는 건 감정적으로 안정적이고 한 사람을 깊이 사랑하는 타입을 의미해요. 발바닥 감정선이 손금보다 더 솔직하게 진짜 감정 패턴을 보여줘요.",
     caution:"감정이 너무 풍부해서 상처도 깊게 받는 타입이에요. 상처 받은 감정을 오래 붙잡아두지 않는 연습이 필요해요."},
    {name:"💰 재물선 (발바닥 세로선)",score:76,
     reading:"발바닥 중앙을 세로로 내려가는 선이 희미하게 보여요. 발금 재물선은 손금보다 더 깊은 재물 기질을 보여줘요. 이 선이 세로로 길게 이어질수록 꾸준한 재물 축적 능력이 있어요. 선이 중간에 끊겼다가 다시 시작하는 건 재물에 큰 변화가 있는 시기가 있었음을 의미해요. 40대부터 재물이 안정적으로 쌓이는 패턴이에요.",
     caution:"한꺼번에 큰돈을 노리기보다 꾸준히 쌓는 방식이 이 발금에 맞아요."},
    {name:"💚 생명선 (엄지 아래 아치선)",score:86,
     reading:"엄지 아래에서 시작해 발바닥 전체를 크게 감싸는 아치선이 뚜렷해요. 이 선이 넓고 깊을수록 생명력과 체력이 강해요. 발바닥 생명선이 손금 생명선보다 실제 체력과 건강을 더 직접적으로 반영해요. 이 선이 끊김 없이 깨끗하면 건강하게 장수하는 타입이에요.",
     caution:"하체와 발 건강에 신경 쓰세요. 장시간 서있거나 걷는 일이 많으면 발바닥 피로가 전신 피로로 이어질 수 있어요."},
    {name:"🌟 운명선 (발뒤꿈치에서 중지 방향)",score:68,
     reading:"발뒤꿈치에서 시작해 중지 방향으로 올라가는 선이 보여요. 이 선이 있다는 것 자체가 뚜렷한 사명과 방향성이 있다는 의미예요. 발금 운명선은 손금 운명선보다 더 원초적이고 타고난 방향성을 보여줘요. 선이 굵고 선명할수록 자기 길에 대한 확신이 강해요.",
     caution:"운명선이 가다가 갈라지는 부분이 보이는데, 이건 인생에서 중요한 선택의 기로가 있었거나 앞으로 있을 것을 의미해요."},
  ],
  pressure_points: [
    {zone:"엄지발가락 아래 (목성구)","meaning":"이 부분이 두툼하고 단단하면 의지력과 리더십이 강한 타입이에요.","yours":"발달해있어요 — 강한 의지력의 소유자"},
    {zone:"발바닥 중앙 오목한 부분","meaning":"이 아치가 적당히 높으면 정서적 균형과 심리적 안정감이 좋아요.","yours":"아치가 적당 — 균형 잡힌 심리 상태"},
    {zone:"발뒤꿈치","meaning":"뒤꿈치가 단단하고 두툼하면 현실 감각과 안정성이 강해요.","yours":"단단함 — 현실 감각 발달"},
  ],
  reflexology: {
    title: "발바닥 반사구로 보는 건강",
    desc: "발바닥의 각 부위는 신체 기관과 연결되어 있어요. 발바닥을 눌렀을 때 특히 아픈 부위가 있다면, 그 기관을 더 신경 써야 한다는 신호예요.",
    zones: [
      {area:"엄지발가락",organ:"머리·뇌·스트레스",status:"이 부분에 굳은살이 잦으면 만성 두통이나 스트레스 주의 신호예요."},
      {area:"발볼 (발가락 아래 볼록한 부분)",organ:"심장·폐·감정적 압박",status:"이 부분이 딱딱하거나 예민하면 심폐 기능과 불안도를 챙기세요."},
      {area:"발바닥 중앙 아치",organ:"소화기·위장",status:"중앙 아치가 팽팽하거나 주름이 많으면 소화 불량 신호예요."},
      {area:"발뒤꿈치",organ:"생식기·골반·에너지 기반",status:"뒤꿈치가 건조하거나 갈라지면 신체 전반의 순환이 떨어진 신호예요."},
    ]
  },
  overall_score: 77,
  personality: "발금 전체를 보면 감수성이 풍부하고 다정다감한 이집트형 기질의 소유자예요. 로맨틱한 면이 강하고 타인을 배려하는 마음이 깊어요. 감정 기복이 있지만, 그만큼 깊이 있는 감성과 예술적 감각을 지닌 타입이에요.",
  gaeun: [
    "매일 아침 발바닥 마사지 5분 — 기혈 순환을 활성화하고 하루 기운을 열어줘요",
    "따뜻한 족욕 (38~40도) 주 3회 — 발금 기운을 살리는 가장 효과적인 방법이에요",
    "발가락 사이 사이 스트레칭 — 막힌 기운을 풀어줘요",
    "오른발 중지 아래에 금색이나 적색 계열 양말 — 재물선 기운을 활성화해요",
  ],
};

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function Section({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>;}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

function FootSilhouette(){
  return(
    <div style={{position:"relative",width:"100%",background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:16,overflow:"hidden",aspectRatio:"3/4",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
      <svg viewBox="0 0 300 400" width="100%" height="100%">
        {/* 발바닥 실루엣 */}
        <ellipse cx="150" cy="240" rx="75" ry="130" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1.5"/>
        {/* 발뒤꿈치 */}
        <ellipse cx="150" cy="355" rx="55" ry="35" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        {/* 발가락들 */}
        <ellipse cx="115" cy="95" rx="18" ry="28" fill="rgba(232,200,122,0.1)" stroke="rgba(232,200,122,0.25)" strokeWidth="1.5"/>
        <ellipse cx="142" cy="80" rx="14" ry="24" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <ellipse cx="165" cy="85" rx="13" ry="22" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <ellipse cx="185" cy="96" rx="12" ry="18" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        <ellipse cx="200" cy="110" rx="10" ry="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
        {/* 감정선 (상단 가로) */}
        <path d="M 90,145 Q 145,130 205,148" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 5px #FF6B6B)"}}/>
        {/* 생명선 (엄지 아래 아치) */}
        <path d="M 88,130 Q 65,200 70,280 Q 78,330 100,350" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 5px #4CAF50)"}}/>
        {/* 재물선 (세로 중앙) */}
        <path d="M 148,165 Q 150,220 152,290 Q 153,320 152,350" stroke="#FDCB6E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" style={{filter:"drop-shadow(0 0 4px #FDCB6E)"}}/>
        {/* 운명선 */}
        <path d="M 155,350 Q 158,290 162,230 Q 165,180 168,150" stroke="#E8C87A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" style={{filter:"drop-shadow(0 0 4px #E8C87A)"}}/>
        {/* 발가락 라벨 */}
        <text x="115" y="65" fontSize="8" fill="#E8C87A" textAnchor="middle" opacity="0.8">엄지</text>
        <text x="143" y="53" fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle" opacity="0.8">검지</text>
        {/* 선 라벨 */}
        <text x="72" y="141" fontSize="7.5" fill="#FF6B6B" fontWeight="bold" opacity="0.85">감정선</text>
        <text x="44" y="215" fontSize="7.5" fill="#4CAF50" fontWeight="bold" opacity="0.85">생명선</text>
        <text x="156" y="185" fontSize="7.5" fill="#FDCB6E" fontWeight="bold" opacity="0.8">재물선</text>
        <text x="172" y="148" fontSize="7.5" fill="#E8C87A" fontWeight="bold" opacity="0.8">운명선</text>
        {/* 반사구 영역 표시 */}
        <ellipse cx="120" cy="170" rx="22" ry="15" fill="rgba(255,107,107,0.12)" stroke="rgba(255,107,107,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="120" y="174" fontSize="7" fill="#FF6B6B" textAnchor="middle" opacity="0.7">심폐</text>
        <ellipse cx="150" cy="240" rx="28" ry="22" fill="rgba(116,185,255,0.1)" stroke="rgba(116,185,255,0.25)" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="150" y="244" fontSize="7" fill="#74B9FF" textAnchor="middle" opacity="0.7">소화기</text>
        <ellipse cx="150" cy="330" rx="35" ry="22" fill="rgba(130,204,221,0.1)" stroke="rgba(130,204,221,0.25)" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="150" y="334" fontSize="7" fill="#81ECEC" textAnchor="middle" opacity="0.7">척추·신장</text>
      </svg>
    </div>
  );
}

function FootOverlay({imageUrl}){
  return(
    <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
      <img src={imageUrl} alt="발금" style={{width:"100%",display:"block"}}/>
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} viewBox="0 0 300 400" preserveAspectRatio="none">
        <path d="M 80,140 Q 145,125 215,143" stroke="#FF6B6B" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" style={{filter:"drop-shadow(0 0 4px #FF6B6B)"}}/>
        <path d="M 78,125 Q 58,200 62,280 Q 70,335 95,358" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" style={{filter:"drop-shadow(0 0 4px #4CAF50)"}}/>
        <path d="M 148,160 Q 150,230 151,300 Q 151,330 150,360" stroke="#FDCB6E" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 3px #FDCB6E)"}}/>
        <path d="M 160,358 Q 163,285 166,220 Q 168,175 170,148" stroke="#E8C87A" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 3px #E8C87A)"}}/>
        <text x="65" y="137" fontSize="8" fill="#FF6B6B" fontWeight="bold" opacity="0.9">감정선</text>
        <text x="40" y="210" fontSize="8" fill="#4CAF50" fontWeight="bold" opacity="0.9">생명선</text>
        <text x="154" y="180" fontSize="8" fill="#FDCB6E" fontWeight="bold" opacity="0.85">재물선</text>
        <text x="172" y="146" fontSize="8" fill="#E8C87A" fontWeight="bold" opacity="0.85">운명선</text>
      </svg>
    </div>
  );
}

export default function FootPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [uploadedImg,setUploadedImg]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [openLine,setOpenLine]=useState(null);
  var [openToe,setOpenToe]=useState(false);
  var [sajuData,setSajuData]=useState({year:"",month:"",day:"",gender:null});
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
  var R=FOOT_RESULT;

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
            <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}>
            <button style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>✕</button>
          </div>
          <div style={{textAlign:"center",padding:"0 20px 16px"}}>
            <div style={{fontSize:40,marginBottom:8}}>🦶</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>발금 풀이</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>사진으로 보는 손금보다 정확한 발금</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",textDecoration:"line-through"}}>980원</span>
              <span style={{fontSize:15,fontWeight:900,color:G}}>980원</span>
              <span style={{fontSize:10,color:"#ef4444",fontWeight:700,background:"rgba(239,68,68,0.15)",padding:"1px 6px",borderRadius:8}}>할인중</span>
            </div>
          </div>
          <div style={{margin:"0 16px 14px",background:"rgba(255,255,255,0.03)",borderRadius:16,padding:"14px"}}>
            <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px",textAlign:"center"}}>🦶 발금학 — 손금보다 솔직한 운명의 지도</p>
            <FootSilhouette/>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:10,padding:"10px 12px",marginTop:10}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 4px"}}>💡 왜 발금이 손금보다 정확할까요?</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.65,margin:0}}>손은 후천적 노력으로 변하지만, 발은 타고난 기질과 운명을 더 솔직하게 담고 있어요. 원본 정보가 더 많이 남아있어요.</p>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
            {[["🦶","발바닥 4대 선 분석","감정·재물·생명·운명선 + 발금선 오버레이"],["👁️","발가락 형태로 보는 성격","이집트·그리스·로마형 등 발 모양 풀이"],["🫁","발바닥 반사구 건강 분석","각 부위와 연결된 신체 기관 상태"],["💰","재물·인연 타이밍","발금으로 읽는 재물과 인연의 흐름"],["🌿","족상학 기반 체질 분석","발바닥 두께·아치·색깔로 보는 건강 체질"],["✨","발금 개운법","족욕·마사지·컬러 양말 등 맞춤 개운 정보"]].map(function(f,i){return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{f[0]}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{f[1]}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>{f[2]}</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
            );})}
          </div>
          <div style={{margin:"0 16px 16px",background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 5px"}}>📸 정확한 분석을 위한 사진 가이드</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:0}}>
              발바닥 전체가 나오게 촬영하세요<br/>
              발등 아닌 발바닥이 찍혀야 해요!<br/>
              <span style={{color:G}}>업로드된 사진은 분석 즉시 삭제됩니다.</span>
            </p>
          </div>
          <div style={{padding:"0 16px"}}>
            <GBtn onClick={function(){setStep("upload");}}>발금 분석 시작하기 →</GBtn>
            <div style={{marginTop:8}}><GBtn dim={true} onClick={function(){}}>닫기</GBtn></div>
          </div>
        </div>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="upload") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>📸 발바닥 사진을 올려주세요</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>발등 아닌 발바닥이 찍혀야 해요!</p>
      </div>
      <div style={{padding:"16px"}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0]){var reader=new FileReader();reader.onload=function(ev){setUploadedImg(ev.target.result);};reader.readAsDataURL(e.target.files[0]);}}}/>
        {uploadedImg?(
          <div style={{marginBottom:14}}>
            <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",marginBottom:10}}>
              <img src={uploadedImg} alt="발" style={{width:"100%",display:"block"}}/>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(46,125,50,0.9)",borderRadius:8,padding:"4px 10px"}}><p style={{fontSize:10,color:"#fff",fontWeight:700,margin:0}}>✓ 업로드 완료</p></div>
            </div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"inherit",marginBottom:10}}>다시 촬영하기</button>
          </div>
        ):(
          <div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",aspectRatio:"3/4",background:"rgba(255,255,255,0.03)",border:"2px dashed rgba(232,200,122,0.3)",borderRadius:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12,fontFamily:"inherit"}}>
              <span style={{fontSize:56}}>🦶</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>발바닥 사진 올리기</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>카메라 또는 갤러리에서 선택</p>
              </div>
            </button>
            <button onClick={function(){setUploadedImg("demo");}} style={{width:"100%",padding:"12px",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,cursor:"pointer",fontSize:12,color:G,fontFamily:"inherit",marginBottom:12}}>📋 사진 없이 데모로 보기</button>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <GBtn onClick={function(){if(uploadedImg){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}}} dim={!uploadedImg}>{uploadedImg?"다음 단계로 →":"사진을 먼저 올려주세요"}</GBtn>
        </div>
        <GBtn onClick={function(){setStep("info");}} dim={true}>← 돌아가기</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="questions"){
    var curQ=QUESTIONS[qStep]; var totalQ=QUESTIONS.length; var progress=(qStep/totalQ)*100;
    function selectOpt(opt){if(curQ.multi){setMultiSel(function(prev){return prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt);});}else{var na=answers.slice();na[qStep]=opt;setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("saju");},300);}}}
    function goNext(){var na=answers.slice();if(curQ.multi&&multiSel.length>0){na[qStep]=multiSel.join(", ");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("saju");}}
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("upload");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 여러 개 선택 가능해요</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("saju");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 분석 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }


  // ── 사주 입력 step ──
  if(step==="saju") {
    var [sy,setSy]=typeof useState==="function"?[sajuData.year,function(v){setSajuData(function(p){return {...p,year:v};})}]:["",""];
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <button onClick={function(){setStep("questions");setQStep(QUESTIONS.length-1);}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
          <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 4px"}}>☯️ 사주 교차 분석</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>생년월일을 입력해주세요</h3>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>사주와 교차 분석해 훨씬 정밀해져요 · 선택사항</p>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"14px",marginBottom:16}}>
            <p style={{fontSize:12,fontWeight:700,color:G,margin:"0 0 6px"}}>☯️ 사주가 추가되면 달라지는 것</p>
            {["손금·점의 기운이 발현되는 정확한 시기 예측","오행 교차 분석으로 더 정밀한 성격·직업 분석","도화살·역마살 등 신살과 손금·점 교차 해석","대운 흐름과 손금 변화를 연결한 인생 타임라인"].map(function(t,i){
              return <div key={i} style={{display:"flex",gap:8,marginBottom:4}}><span style={{color:"#4ade80",fontSize:11,flexShrink:0}}>✓</span><span style={{fontSize:11,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>{t}</span></div>;
            })}
          </div>
          <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 10px"}}>생년월일 입력</p>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[{label:"년도",ph:"1990",key:"year"},{label:"월",ph:"4",key:"month"},{label:"일",ph:"7",key:"day"}].map(function(f){
              return(
                <div key={f.key}>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 4px"}}>{f.label}</p>
                  <input value={sajuData[f.key]} onChange={function(e){var v=e.target.value;setSajuData(function(p){var n={...p};n[f.key]=v;return n;});}}
                    placeholder={f.ph} style={{width:"100%",padding:"12px 10px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,fontSize:14,color:"#F0EAD6",fontFamily:"inherit",boxSizing:"border-box",outline:"none",textAlign:"center"}}/>
                </div>
              );
            })}
          </div>
          <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 8px"}}>성별</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {[{e:"👩",l:"여성",v:"여"},{e:"👨",l:"남성",v:"남"}].map(function(opt){
              return(
                <button key={opt.v} onClick={function(){setSajuData(function(p){return {...p,gender:opt.v};});}}
                  style={{padding:"14px",background:sajuData.gender===opt.v?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:"1px solid "+(sajuData.gender===opt.v?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"),borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:26}}>{opt.e}</span>
                  <span style={{fontSize:13,color:sajuData.gender===opt.v?G:"rgba(255,255,255,0.7)",fontWeight:sajuData.gender===opt.v?700:400}}>{opt.l}</span>
                </button>
              );
            })}
          </div>
          <GBtn onClick={function(){setStep("payment");}}>사주 입력 완료 · 결제로 →</GBtn>
          <div style={{marginTop:8}}><GBtn dim={true} onClick={function(){setStep("payment");}}>건너뛰고 결제하기 →</GBtn></div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {uploadedImg&&uploadedImg!=="demo"&&<div style={{marginBottom:12,borderRadius:12,overflow:"hidden",height:120,position:"relative"}}><img src={uploadedImg} alt="발" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",display:"flex",alignItems:"flex-end",padding:"10px 12px"}}><p style={{fontSize:11,color:"#fff",margin:0,fontWeight:600}}>✓ 발바닥 사진 등록 완료</p></div></div>}
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"rgba(255,255,255,0.4)",textDecoration:"line-through"}}>정가 980원</span><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>980원</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>980원</span></div>
        </div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>발금 분석하기 (980원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>🦶</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 8px"}}>{DEMO_NAME}님의 발금 분석 중...</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 16px"}}>{q1||"오른발"} 족상학 분석</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.2s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:0}}>{LOADING_MSGS[loadMsgIdx]}</p>
      </div>
    </div>
  );

  // ━━━ 결과 ━━━
  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 발금 풀이 · 족상학</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🦶 발금 풀이</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>{q1||"오른발"} · AI 발금선 + 족상학 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q2&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>분석 발: {q1||"오른발"}</p>
          <p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>🔍 집중: {q2.split(",").slice(0,2).join(", ")}</p>
          {q3&&q3!=="🔮 딱히 없어요"&&<p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:"2px 0"}}>💭 {q3}</p>}
        </div>}

        {/* 발금 이미지 */}
        <Section title="🦶 발금 AI 분석 이미지">
          {uploadedImg&&uploadedImg!=="demo"?<FootOverlay imageUrl={uploadedImg}/>:<FootSilhouette/>}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>
            {[["❤️","감정선","#FF6B6B"],["💚","생명선","#4CAF50"],["💰","재물선","#FDCB6E"],["🌟","운명선","#E8C87A"]].map(function(x){return(
              <div key={x[1]} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:"rgba(255,255,255,0.05)",borderRadius:20}}>
                <div style={{width:14,height:2.5,borderRadius:2,background:x[2],boxShadow:"0 0 4px "+x[2]}}/>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.6)"}}>{x[1]}</span>
              </div>
            );})}
          </div>
        </Section>

        {/* 종합 총평 */}
        <Section title="🔮 발금 종합 총평">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(232,200,122,0.06)",borderRadius:12,border:"1px solid rgba(232,200,122,0.25)"}}>
            <span style={{fontSize:26}}>🦶</span>
            <div><p style={{fontSize:14,fontWeight:800,color:"#7A5C00",margin:"0 0 3px"}}>종합 발금 점수</p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:100,height:6,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:R.overall_score+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div>
                <span style={{fontSize:15,fontWeight:900,color:"#7A5C00"}}>{R.overall_score}점</span>
              </div>
            </div>
          </div>
          <Para text={R.overview}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {[["발 형태",R.foot_shape.split(" ")[0]],["발 사이즈","중형 (안정형)"],["아치","적당히 높음"]].map(function(x){return(
              <div key={x[0]} style={{background:"#F9F7F2",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[0]}</p>
                <p style={{fontSize:10,fontWeight:700,color:"#333",margin:0}}>{x[1]}</p>
              </div>
            );})}
          </div>
        </Section>

        {/* 발가락 형태 — 클릭 토글 */}
        <Section title="👣 발가락 형태로 보는 성격">
          <button onClick={function(){setOpenToe(!openToe);}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#FAFAFA",border:"1px solid rgba(0,0,0,0.07)",borderRadius:12,cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif",marginBottom:openToe?10:0}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 2px"}}>이집트형 발 👑 <span style={{fontSize:10,color:"#7A5C00",fontWeight:400}}>가장 흔한 형태 (약 60%)</span></p>
              <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0}}>엄지가 가장 길고 순서대로 짧아지는 형태 · 로맨틱·다정다감</p>
            </div>
            <span style={{fontSize:14,color:"rgba(0,0,0,0.3)",transform:openToe?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
          </button>
          {openToe&&<div>
            <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:"0 0 14px",paddingLeft:12,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>{R.toe_reading.meaning}</p>
            {/* 5가지 발 형태 비교 */}
            <div style={{background:"rgba(232,200,122,0.04)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
              <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,letterSpacing:2,margin:"0 0 10px"}}>✦ 5가지 발 형태 비교</p>
              {R.toe_reading.foot_types.map(function(ft,i){return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 10px",background:i===0?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.5)",borderRadius:8,border:i===0?"1px solid rgba(232,200,122,0.3)":"1px solid transparent"}}>
                  <span style={{fontSize:10,color:"#7A5C00",width:14,fontWeight:700}}>{i===0?"👑":"·"}</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:12,fontWeight:i===0?700:500,color:"#222",margin:"0 0 1px"}}>{ft.type} <span style={{fontSize:10,color:"rgba(0,0,0,0.4)",fontWeight:400}}>({ft.desc})</span></p>
                    <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0}}>{ft.personality}</p>
                  </div>
                  <span style={{fontSize:9,color:"rgba(0,0,0,0.3)",flexShrink:0}}>{ft.ratio}</span>
                </div>
              );})}
            </div>
            {R.toe_reading.toes.map(function(t,i){return(
              <div key={i} style={{marginBottom:8,padding:"8px 12px",background:"rgba(232,200,122,0.04)",borderRadius:8}}>
                <p style={{fontSize:10,fontWeight:700,color:"#7A5C00",margin:"0 0 3px"}}>{t.name}</p>
                <p style={{fontSize:11,color:"#333",lineHeight:1.7,margin:0}}>{t.reading}</p>
              </div>
            );})}
          </div>}
        </Section>

        {/* 4대 발금선 상세 */}
        <Section title="🔍 4대 발금선 상세 분석 (탭해서 펼치기)">
          {R.lines.map(function(line){
            var isOpen=openLine===line.name;
            var lineColor=line.name.includes("감정")?"#FF6B6B":line.name.includes("재물")?"#FDCB6E":line.name.includes("생명")?"#4CAF50":"#E8C87A";
            return(
              <div key={line.name} style={{marginBottom:10,borderRadius:12,overflow:"hidden",border:"1px solid rgba(0,0,0,0.07)"}}>
                <button onClick={function(){setOpenLine(isOpen?null:line.name);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:"#FAFAFA",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:lineColor,flexShrink:0,boxShadow:"0 0 6px "+lineColor}}/>
                  <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 1px"}}>{line.name}</p></div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{line.score}점</span>
                    <span style={{display:"block",fontSize:14,color:"rgba(0,0,0,0.3)",transform:isOpen?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
                  </div>
                </button>
                {isOpen&&<div style={{padding:"14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                  <div style={{height:5,background:"#F0EDE6",borderRadius:99,overflow:"hidden",marginBottom:12}}><div style={{height:"100%",width:line.score+"%",background:lineColor,borderRadius:99}}/></div>
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

        {/* 발바닥 반사구 건강 */}
        <Section title="🫁 발바닥 반사구로 보는 건강">
          <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",lineHeight:1.7,margin:"0 0 14px"}}>{R.reflexology.desc}</p>
          {R.reflexology.zones.map(function(z,i){return(
            <div key={i} style={{marginBottom:12,padding:"12px",background:i%2===0?"rgba(116,185,255,0.04)":"rgba(76,175,80,0.04)",borderRadius:10,borderLeft:"3px solid "+(i%2===0?"rgba(116,185,255,0.4)":"rgba(76,175,80,0.4)")}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <p style={{fontSize:12,fontWeight:700,color:"#111",margin:0}}>{z.area}</p>
                <span style={{fontSize:10,color:"#7A5C00",fontWeight:700,flexShrink:0,marginLeft:6}}>→ {z.organ}</span>
              </div>
              <p style={{fontSize:11,color:"#555",lineHeight:1.65,margin:0}}>{z.status}</p>
            </div>
          );})}
        </Section>

        {/* 압력점 분석 */}
        <Section title="👁️ 발바닥 주요 압력점 분석">
          {R.pressure_points.map(function(p,i){return(
            <div key={i} style={{marginBottom:12,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:32,height:32,borderRadius:8,background:"rgba(232,200,122,0.12)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16}}>🦶</span></div>
              <div style={{flex:1}}>
                <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 2px"}}>{p.zone}</p>
                <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:"0 0 3px",lineHeight:1.5}}>{p.meaning}</p>
                <p style={{fontSize:11,color:"#2E7D32",fontWeight:600,margin:0}}>→ {p.yours}</p>
              </div>
            </div>
          );})}
        </Section>

        {/* 성격 총평 */}
        <Section title="🧬 발금으로 보는 성격·기질">
          <Para text={R.personality}/>
        </Section>

        {/* 개운법 */}
        {/* 사주 × 발금 교차 분석 */}
        <Section title="☯️ 사주 × 발금 교차 분석">
          <div style={{background:"rgba(232,200,122,0.05)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <p style={{fontSize:11,color:"#7A5C00",fontWeight:600,margin:"0 0 4px"}}>🔮 분석 기준</p>
            <p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.6}}>오행 · 십성 · 신살 × 발금선 4종 + 반사구 교차 분석</p>
          </div>
          {[
            {icon:"❤️", title:"연애·인연 교차 분석",
             content:"발금의 감정선이 선명하고 길게 이어지는데, 사주에 도화살과 역마살이 함께 있어요. 이 조합은 인연이 예상치 못한 곳에서 찾아오는 패턴이에요. 발바닥 감정선 끝의 갈라짐은 사주 배우자 자리의 불안정한 기운과 맞물려요 — 쉽게 만나지만 오래 가기 위해 신중함이 필요해요.

📅 인연 타이밍: 사주 대운 흐름상 28~31세가 가장 강한 인연의 시기예요."},
            {icon:"💰", title:"재물 교차 분석",
             content:"발금의 재물선이 발바닥 중앙에서 선명하게 올라오는데, 사주에 정재(正財) 기운이 강해요. 안정적이고 꾸준한 수입 구조예요. 발바닥 목성구(엄지 아래 두툼한 부분)가 발달한 것은 사주 인성(印星)과 결합해 부동산·저축으로 재산을 쌓는 패턴이에요.

📅 재물 상승 시기: 33~38세 구간, 사주와 발금이 모두 이 시기에 재물 상승을 가리켜요."},
            {icon:"🫁", title:"건강 반사구 × 사주 교차 분석",
             content:"발바닥 반사구와 사주 오행을 교차 분석하면 — 발바닥 중앙 위장 반사구 부위에 두꺼운 굳은살이 있는데 사주에 土(토) 기운이 약해요. 이는 소화기 기능이 예민하다는 신호예요. 발바닥 폐 반사구 부위의 색깔이 탁한 것은 사주의 金(금) 기운 부족과 연결돼요.

✨ 개선법: 발 아치 부분을 집중적으로 마사지하면 사주의 부족한 水(수) 기운을 보강할 수 있어요."},
            {icon:"🌟", title:"인생 흐름 교차 분석",
             content:"발금의 운명선이 발뒤꿈치에서 시작해 중지 방향으로 길게 이어지는데, 이는 사주에 관성(官星)이 발달한 것과 맞물려요. 조직 내에서 차근차근 자리를 잡는 타입이에요.

✦ 천기 인사이트: 발금과 사주가 공통적으로 가리키는 것은 '늦게 꽃피는 인생'이에요. 40대 이후에 진짜 전성기가 시작되는 운명의 소유자예요."},
          ].map(function(item, i){
            return(
              <div key={i} style={{marginBottom:14,padding:"14px 16px",background:"#fff",borderRadius:14,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",border:"1px solid rgba(232,200,122,0.15)"}}>
                <p style={{fontSize:12,fontWeight:700,color:"#7A5C00",margin:"0 0 8px"}}>{item.icon} {item.title}</p>
                {item.content.split("\n\n").map(function(p,j){
                  return <p key={j} style={{fontSize:12,color:"#333",lineHeight:1.85,margin:j<item.content.split("\n\n").length-1?"0 0 8px":0}}>{p}</p>;
                })}
              </div>
            );
          })}
        </Section>

        <Section title="✨ 발금 기반 개운법">
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
            💫 {DEMO_NAME}님의 발바닥에는<br/>단단한 생명력과 깊은 여정이 새겨져 있어요.<br/>
            <span style={{fontSize:13,fontWeight:600}}>그 발이 걸어갈 길이 빛날 거예요.</span>
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 발금 풀이의 메시지</p>
        </div>

        {/* 크로스셀링 */}
        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{emoji:"✋",title:"손금 풀이",desc:"손금과 발금을 함께 보면 더 정확해요",price:"380원"},{emoji:"⚫",title:"얼굴 점",desc:"복점일까? 점 위치의 비밀",price:"380원"},{emoji:"☯️",title:"사주 풀이",desc:"발금과 사주 종합 분석",price:"980원"},{emoji:"👁️",title:"관상 보기",desc:"얼굴로 보는 운명과 기질",price:"380원"}].map(function(cs){return(
              <div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}>
                <p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p>
                <span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span>
              </div>
            );})}
          </div>
        </div>
        {/* 다른 발 추가결제 배너 */}
        {(q1.includes("왼발") || q1.includes("오른발")) && (
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.35)",borderRadius:16,padding:"16px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 3px"}}>
                  {q1.includes("왼발") ? "🦶 오른발(현재운)도 보실래요?" : "🦶 왼발(선천운)도 보실래요?"}
                </p>
                <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>
                  {q1.includes("왼발") ? "오른발 — 현재·미래를 만들어가는 운" : "왼발 — 타고난 기질·성격·잠재력"}
                </p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0,lineHeight:1.5}}>
                  두 발을 비교하면 타고난 운과<br/>지금 만들어가는 운의 차이가 보여요
                </p>
              </div>
              <button onClick={function(){setStep("intro");}} style={{flexShrink:0,marginLeft:12,padding:"10px 14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                <p style={{fontSize:13,fontWeight:900,color:"#0D0D14",margin:"0 0 1px"}}>380원</p>
                <p style={{fontSize:10,color:"rgba(13,35,24,0.6)",margin:0}}>바로 보기 →</p>
              </button>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #발금 #족상학 #발바닥운세</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
