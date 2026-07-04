import { useState, useRef, useEffect } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"어느 눈 주변 점이 궁금한가요?", icon:"👁️", multi:true, skippable:false,
   opts:["👁️ 눈 아래 (와잠점)","👆 눈 위 쌍꺼풀 라인","↖️ 눈꼬리 바깥쪽","↗️ 눈두덩이 위","⬅️ 눈머리 안쪽","🌈 눈 주변 전체"]},
  {title:"가장 궁금한 건?", icon:"💭", multi:false, skippable:true,
   opts:["❤️ 연애·결혼 타이밍","💰 돈복이 있는지","💼 직업·커리어","🌿 건강 신호","🔮 복점인지 흉점인지"]},
];

var LOADING_MSGS = [
  "눈 주변 점 위치 분석 중... 👁️","점상학 데이터 대조 중... 📚",
  "도화·처첩궁 판별 중... ✨","연애운 점수 계산 중... ❤️",
  "눈물점 vs 복점 구분 중... 🔮"
];

var EYE_MOLES = [
  {id:1, x:72, y:56, r:4, name:"왼쪽 눈 아래 와잠점", area:"남녀궁·와잠 (눈 아래 애교살)",
   type:"도화점", score:88, color:"#1A0A00",
   love:"와잠(눈 아래 애교살)의 점은 관상학 최고의 도화 복점이에요! 이 위치의 점은 '도화점' 또는 '눈물점'으로 불려요. 대중의 사랑을 끄는 강력한 도화 기운이 있어요. 감수성이 풍부하고 이성 문제로 속앓이를 할 수 있지만, 연예인·인플루언서에게는 사람들의 사랑을 받는 최고의 복점이에요.",
   money:"이 위치의 점이 있는 사람은 이성을 통해 재물운이 열리는 경우가 있어요. 파트너십이나 협업을 통한 수입이 잘 맞아요.",
   career:"감성적인 표현이 필요한 분야 — 예술, 연예, 서비스, 마케팅 등에서 특히 강점을 발휘해요.",
   health:"눈 아래 점은 자녀운과 생식기 건강과 연결돼 있어요. 수분 섭취를 충분히 하고 신장 건강을 챙기세요.",
   detail:"눈 아래의 점은 관상학에서 '와잠(臥蠶)점'이라 불러요. 와잠은 남녀궁으로 자녀운·매력·정력을 주관해요. 생점(까맣고 윤기있는 점)이면 대중적 인기를 끄는 도화점이에요. 색이 탁하거나 잿빛이면 눈물점(슬픈 이성 문제)으로 해석해요. 도톰하고 윤기나는 와잠에 선명한 점이 있으면 이성에게 가장 인기 있는 얼굴 조건 중 하나예요."},
  {id:2, x:38, y:44, r:3, name:"오른쪽 눈꼬리 점", area:"처첩궁 (눈꼬리 바깥)",
   type:"연애점", score:75, color:"#2C1810",
   love:"눈꼬리 점은 처첩궁에 해당해요. 이성에게 매력을 어필하기 좋은 위치지만, 유혹에 약해 이성 관계가 복잡해질 수 있는 음란점으로 해석되기도 해요. 생점이면 치명적 매력, 흉점이면 부부 불화 주의예요.",
   money:"눈꼬리 점이 있으면 사교성과 네트워크를 통한 재물 기회가 생겨요.",
   career:"대인 관계와 커뮤니케이션이 중요한 직업에 잘 맞아요.",
   health:"눈 주변 혈액 순환에 신경 쓰세요. 눈 건강 관리가 중요해요.",
   detail:"눈꼬리의 점은 처첩궁(妻妾宮)에 위치해요. 처첩궁은 배우자·연인운을 주관해요. 생점이면 치명적 매력으로 이성을 끌어당기지만, 유혹에 약하고 바람기(음란점)로 해석될 수 있어요. 흉점(탁하거나 붉은 점)이면 부부 불화·이성 갈등 주의 신호예요. 푹 꺼지거나 흉터가 있으면 배우자 인연이 늦거나 부부 사이가 멀어질 수 있어요."},
];

var OVERALL = {
  total_score: 84,
  summary: DEMO_NAME+"님 눈 주변을 보는 순간 바로 느낌이 왔어요. 왼쪽 눈 아래 와잠점이 굉장히 선명하게 자리 잡고 있어요. 관상학에서 이 위치의 점은 최고의 도화 복점으로 꼽혀요. 이성에게 자연스럽게 매력을 발산하고, 감성적인 분위기를 만들어내는 타고난 기운이 있어요.",
  love_detail: "와잠점이 있는 분은 눈빛만으로도 이성의 마음을 끄는 매력이 있어요. 특히 처음 만났을 때 강한 인상을 남기고, 상대방이 쉽게 잊지 못하게 돼요. 연애를 시작하면 상대방이 깊이 빠져드는 경우가 많아요. 단, 인연이 자주 생기는 만큼 진지한 관계를 위해서는 선택을 신중하게 해야 해요.",
  marriage_timing: "눈 주변 점 기운이 가장 활성화되는 시기: 27~29세, 33~35세 구간에 중요한 인연이 생길 가능성이 높아요.",
  personality: "눈 주변에 점이 있는 사람은 감성이 풍부하고 표현력이 뛰어나요. 눈물이 많을 수 있고, 감정 이입을 잘 해요. 타인의 감정을 잘 읽는 공감 능력이 높아요.",
  warning: "와잠점이 선명한 분은 이성 관계에서 상처를 받기도 쉬워요. 감정적으로 성숙한 상대를 선택하는 것이 중요해요.",
  gaeun: [
    "눈 아래 와잠점 주변을 부드럽게 마사지하면 도화 기운이 활성화돼요",
    "눈 주변을 늘 촉촉하게 관리하세요 — 피부 상태가 좋을수록 점의 기운이 빛나요",
    "핑크·레드·골드 계열 아이메이크업이 와잠점의 기운을 높여줘요",
    "중요한 만남이 있는 날 눈 아래를 가볍게 하이라이팅하면 도화 기운 UP!",
  ],
};

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function Section({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>;}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

function EyeSilhouette({moles, activeMole, onMoleClick}){
  return(
    <div style={{position:"relative",width:"100%",background:"linear-gradient(135deg,#0D0D1A,#1a1a2e)",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      <svg viewBox="0 0 120 80" width="100%" style={{display:"block"}}>
        {/* 왼쪽 눈 영역 */}
        <ellipse cx="35" cy="35" rx="28" ry="16" fill="rgba(232,200,122,0.04)" stroke="rgba(232,200,122,0.15)" strokeWidth="0.5"/>
        {/* 왼쪽 눈 */}
        <path d="M 12,35 Q 35,18 58,35 Q 35,50 12,35 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <ellipse cx="35" cy="35" rx="8" ry="8" fill="rgba(60,40,20,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <ellipse cx="35" cy="35" rx="5" ry="5" fill="rgba(20,10,5,0.95)"/>
        <circle cx="32" cy="32" r="1.5" fill="rgba(255,255,255,0.5)"/>
        {/* 왼쪽 눈 구역 라벨 */}
        <text x="35" y="10" fontSize="4" fill="rgba(232,200,122,0.5)" textAnchor="middle">처첩궁</text>

        {/* 오른쪽 눈 영역 */}
        <ellipse cx="85" cy="35" rx="28" ry="16" fill="rgba(232,200,122,0.04)" stroke="rgba(232,200,122,0.15)" strokeWidth="0.5"/>
        {/* 오른쪽 눈 */}
        <path d="M 62,35 Q 85,18 108,35 Q 85,50 62,35 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <ellipse cx="85" cy="35" rx="8" ry="8" fill="rgba(60,40,20,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <ellipse cx="85" cy="35" rx="5" ry="5" fill="rgba(20,10,5,0.95)"/>
        <circle cx="82" cy="32" r="1.5" fill="rgba(255,255,255,0.5)"/>
        {/* 오른쪽 눈 구역 라벨 */}
        <text x="85" y="10" fontSize="4" fill="rgba(232,200,122,0.5)" textAnchor="middle">처첩궁</text>

        {/* 와잠 위치 표시 */}
        <text x="35" y="58" fontSize="3.5" fill="rgba(255,107,107,0.6)" textAnchor="middle">와잠(臥蠶)</text>
        <text x="85" y="58" fontSize="3.5" fill="rgba(255,107,107,0.6)" textAnchor="middle">와잠(臥蠶)</text>

        {/* 점들 */}
        {moles.map(function(m){
          var isActive=activeMole===m.id;
          return(
            <g key={m.id} onClick={function(){onMoleClick(m.id);}} style={{cursor:"pointer"}}>
              <circle cx={m.x} cy={m.y} r={m.r+4} fill="transparent"/>
              <circle cx={m.x} cy={m.y} r={m.r} fill={m.color} stroke={isActive?"#E8C87A":"rgba(232,200,122,0.5)"} strokeWidth={isActive?1.5:0.8}/>
              {isActive&&(
                <>
                  <circle cx={m.x} cy={m.y} r={m.r+2.5} fill="none" stroke="#E8C87A" strokeWidth="1" opacity="0.8" strokeDasharray="2,1"/>
                  <text x={m.x} y={m.y-m.r-2} fontSize="4" fill="#E8C87A" textAnchor="middle">✦</text>
                </>
              )}
            </g>
          );
        })}
        <text x="60" y="75" fontSize="4" fill="rgba(255,255,255,0.3)" textAnchor="middle">점을 탭하면 풀이가 나와요</text>
      </svg>
    </div>
  );
}

function EyeOverlay({imageUrl, moles, activeMole, onMoleClick}){
  return(
    <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
      <img src={imageUrl} alt="눈" style={{width:"100%",display:"block"}}/>
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} viewBox="0 0 120 80" preserveAspectRatio="none">
        {moles.map(function(m){
          var isActive=activeMole===m.id;
          return(
            <g key={m.id} onClick={function(){onMoleClick(m.id);}} style={{cursor:"pointer"}}>
              <circle cx={m.x} cy={m.y} r={m.r+5} fill="transparent"/>
              <circle cx={m.x} cy={m.y} r={m.r+2} fill="none" stroke="#E8C87A" strokeWidth="1.5" opacity={isActive?1:0.7} strokeDasharray={isActive?"none":"3,2"}/>
              {isActive&&<circle cx={m.x} cy={m.y} r={m.r+4} fill="none" stroke="#E8C87A" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,1"/>}
              <text x={m.x+m.r+2} y={m.y+1.5} fontSize="5" fill={isActive?"#E8C87A":"rgba(232,200,122,0.8)"} fontWeight="bold">✦</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function EyeMolePage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [uploadedImg,setUploadedImg]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [activeMole,setActiveMole]=useState(null);
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

  var q1=answers[0]||""; var q2=answers[1]||"";
  var currentMole=EYE_MOLES.find(function(m){return m.id===activeMole;});

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>👁️ 눈 점 풀이</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>눈가의 점 하나가 연애운을 바꾼다?</p></div>
          <div style={{textAlign:"right"}}><span style={{fontSize:13,fontWeight:900,color:G,display:"block"}}>980원</span><span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>→ 380원</span></div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>👁️ 눈 주변 점의 비밀 — 관상학의 핵심</p>
          <EyeSilhouette moles={EYE_MOLES} activeMole={null} onMoleClick={function(){}}/>
          <div style={{marginTop:12,background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:10,padding:"10px 14px"}}>
            <p style={{fontSize:11,color:"#FF7675",fontWeight:700,margin:"0 0 4px"}}>💡 눈 아래 점 = 와잠점(臥蠶點)</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.65,margin:0}}>눈 아래의 점은 관상학에서 가장 강한 도화 복점이에요. 이성에게 자연스러운 매력을 발산하는 기운이 있어요. 연예인 중에 와잠점 있는 분들이 많아요!</p>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 눈 점 풀이에서 알 수 있는 것</p>
          {[["👁️","눈 주변 점 AI 감지","점 위치를 자동으로 찾아서 표시해드려요"],["❤️","도화·연애 복점 판별","어느 점이 연애운을 높이는 복점인지"],["💰","재물 관련 점 분석","눈 주변 점이 재물에 미치는 영향"],["🔮","와잠점 상세 풀이","눈 아래 점의 크기·위치별 상세한 의미"],["💭","결혼·인연 타이밍","눈 점으로 보는 인연이 오는 시기"],["✨","눈 주변 개운법","점의 기운을 높이는 뷰티·생활 팁"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 4px"}}>📸 사진 촬영 꿀팁</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.65,margin:0}}>눈 주변이 선명하게 찍혀야 해요<br/>밝은 조명 + 정면 응시로 촬영하세요<br/>아이메이크업 지운 상태가 더 정확해요</p>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:26,fontWeight:900,color:G,margin:"0 0 2px"}}>380원</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,textDecoration:"line-through"}}>원래 980원</p>
        </div>
        <GBtn onClick={function(){setStep("upload");}}>눈 점 분석 시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="upload") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>📸 눈 주변 사진을 올려주세요</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>양쪽 눈이 모두 나오는 정면 사진 추천</p>
      </div>
      <div style={{padding:"16px"}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0]){var reader=new FileReader();reader.onload=function(ev){setUploadedImg(ev.target.result);};reader.readAsDataURL(e.target.files[0]);}}}/>
        {uploadedImg?(
          <div style={{marginBottom:14}}>
            <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",marginBottom:10}}>
              <img src={uploadedImg} alt="눈" style={{width:"100%",display:"block"}}/>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(46,125,50,0.9)",borderRadius:8,padding:"4px 10px"}}><p style={{fontSize:10,color:"#fff",fontWeight:700,margin:0}}>✓ 업로드 완료</p></div>
            </div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"inherit",marginBottom:10}}>다시 촬영하기</button>
          </div>
        ):(
          <div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",aspectRatio:"16/9",background:"rgba(255,255,255,0.03)",border:"2px dashed rgba(232,200,122,0.3)",borderRadius:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,marginBottom:12,fontFamily:"inherit"}}>
              <span style={{fontSize:48}}>👁️</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>눈 주변 사진 올리기</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>양쪽 눈이 모두 나오도록</p>
              </div>
            </button>
            <button onClick={function(){setUploadedImg("demo");}} style={{width:"100%",padding:"12px",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,cursor:"pointer",fontSize:12,color:G,fontFamily:"inherit",marginBottom:12}}>📋 사진 없이 데모로 보기</button>
          </div>
        )}
        <div style={{marginBottom:10}}><GBtn onClick={function(){if(uploadedImg){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}}} dim={!uploadedImg}>{uploadedImg?"다음 단계로 →":"사진을 먼저 올려주세요"}</GBtn></div>
        <GBtn onClick={function(){setStep("info");}} dim={true}>← 돌아가기</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="questions"){
    var curQ=QUESTIONS[qStep]; var totalQ=QUESTIONS.length; var progress=(qStep/totalQ)*100;
    function selectOpt(opt){if(curQ.multi){setMultiSel(function(prev){return prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt);});}else{var na=answers.slice();na[qStep]=opt;setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("payment");},300);}}}
    function goNext(){var na=answers.slice();if(curQ.multi&&multiSel.length>0){na[qStep]=multiSel.join(", ");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("payment");}}
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>{curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",lineHeight:1.5}}>{opt}</button>;})}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 분석 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {uploadedImg&&uploadedImg!=="demo"&&<div style={{marginBottom:12,borderRadius:12,overflow:"hidden",height:110,position:"relative"}}><img src={uploadedImg} alt="눈" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",display:"flex",alignItems:"flex-end",padding:"10px 12px"}}><p style={{fontSize:11,color:"#fff",margin:0,fontWeight:600}}>✓ 눈 사진 등록 완료</p></div></div>}
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"rgba(255,255,255,0.4)",textDecoration:"line-through"}}>정가 980원</span><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>980원</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>할인 가격</span><span style={{fontSize:16,fontWeight:700,color:G}}>380원</span></div>
        </div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>눈 점 분석하기 (380원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>👁️</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 8px"}}>{DEMO_NAME}님의 눈 점 분석 중...</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 16px"}}>눈 주변 점 → 처첩궁 → 와잠점 판별</p>
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
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 눈 점 · 점상학</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 👁️ 눈 점 풀이</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>AI 점 감지 + 처첩궁 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>분석 위치: {q1.split(",").slice(0,2).join(", ")}</p>
          {q2&&q2!=="🔮 딱히 없어요"&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>💭 가장 궁금한 것: {q2}</p>}
        </div>}

        {/* 눈 이미지 + 점 오버레이 */}
        <Section title="👁️ 눈 점 AI 감지 이미지 (점을 탭해보세요)">
          {uploadedImg&&uploadedImg!=="demo"
            ?<EyeOverlay imageUrl={uploadedImg} moles={EYE_MOLES} activeMole={activeMole} onMoleClick={setActiveMole}/>
            :<EyeSilhouette moles={EYE_MOLES} activeMole={activeMole} onMoleClick={setActiveMole}/>
          }
          {currentMole&&(
            <div style={{marginTop:12,background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.25)",borderRadius:12,padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 2px"}}>{currentMole.name}</p><p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0}}>{currentMole.area}</p></div>
                <div style={{textAlign:"right"}}><span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:"rgba(255,107,107,0.12)",color:"#C62828",fontWeight:700}}>{currentMole.type}</span><p style={{fontSize:12,fontWeight:700,color:"#7A5C00",margin:"4px 0 0"}}>{currentMole.score}점</p></div>
              </div>
              <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:"0 0 8px"}}>{currentMole.detail}</p>
              <button onClick={function(){setActiveMole(null);}} style={{background:"transparent",border:"none",fontSize:11,color:"rgba(0,0,0,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기 ✕</button>
            </div>
          )}
          {!currentMole&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:"10px 0 0"}}>⬆️ 위 이미지에서 점을 탭하면 상세 풀이가 나와요</p>}
        </Section>

        {/* 종합 총평 */}
        <Section title="🔮 눈 점 종합 총평">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(255,107,107,0.06)",borderRadius:12,border:"1px solid rgba(255,107,107,0.2)"}}>
            <span style={{fontSize:26}}>👁️</span>
            <div><p style={{fontSize:14,fontWeight:800,color:"#C62828",margin:"0 0 3px"}}>눈 점 종합 점수</p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:100,height:6,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:OVERALL.total_score+"%",background:"linear-gradient(90deg,#FF7675,#C62828)",borderRadius:99}}/></div>
                <span style={{fontSize:15,fontWeight:900,color:"#C62828"}}>{OVERALL.total_score}점</span>
              </div>
            </div>
          </div>
          <Para text={OVERALL.summary}/>
        </Section>

        {/* 와잠점 연애운 상세 */}
        <Section title="❤️ 와잠점 — 연애운 상세 풀이">
          <div style={{background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:12,padding:"14px",marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#C62828",margin:"0 0 6px"}}>👁️ 왼쪽 눈 아래 와잠점 — 연애운 {EYE_MOLES[0].score}점</p>
            <p style={{fontSize:13,color:"#222",lineHeight:1.95,margin:0,wordBreak:"keep-all"}}>{EYE_MOLES[0].love}</p>
          </div>
          <Para text={OVERALL.love_detail}/>
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 5px"}}>📅 인연 타이밍</p>
            <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{OVERALL.marriage_timing}</p>
          </div>
          <div style={{background:"rgba(255,200,0,0.06)",border:"1px solid rgba(200,100,0,0.15)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:10,color:"#C4922A",fontWeight:700,margin:"0 0 5px"}}>⚠️ 주의할 점</p>
            <p style={{fontSize:12,color:"#555",lineHeight:1.75,margin:0}}>{OVERALL.warning}</p>
          </div>
        </Section>

        {/* 점별 영역 분석 */}
        <Section title="📍 눈 점별 영역 분석">
          {EYE_MOLES.map(function(m){return(
            <div key={m.id} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:m.color,flexShrink:0,border:"2px solid rgba(255,107,107,0.4)"}}/>
                <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{m.name}</p><p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0}}>{m.area}</p></div>
                <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:"rgba(255,107,107,0.1)",color:"#C62828",fontWeight:700,flexShrink:0}}>{m.type} {m.score}점</span>
              </div>
              {[["❤️ 연애운",m.love],["💰 재물운",m.money],["💼 직업운",m.career],["🌿 건강",m.health]].map(function(r){return(
                <div key={r[0]} style={{marginBottom:8,paddingLeft:10,borderLeft:"2px solid rgba(255,107,107,0.3)"}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 2px"}}>{r[0]}</p>
                  <p style={{fontSize:11,color:"#333",lineHeight:1.7,margin:0}}>{r[1]}</p>
                </div>
              );})}
            </div>
          );})}
        </Section>

        {/* 성격 */}
        <Section title="🧬 눈 점으로 보는 성격">
          <Para text={OVERALL.personality}/>
        </Section>

        {/* 개운법 */}
        <Section title="✨ 눈 점 기반 개운법">
          {OVERALL.gaeun.map(function(g,i){return(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(255,107,107,0.04)",borderRadius:10,borderLeft:"3px solid rgba(255,107,107,0.3)"}}>
              <span style={{fontSize:16,flexShrink:0}}>✨</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g}</p>
            </div>
          );})}
        </Section>

        {/* 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(255,107,107,0.1),rgba(255,107,107,0.04))",border:"1px solid rgba(255,107,107,0.25)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#C62828",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님의 눈 아래 와잠점은<br/>가장 강한 도화 복점이에요.<br/>
            <span style={{fontSize:13,fontWeight:600}}>그 눈빛이 만들어갈 인연이 기대돼요.</span>
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 눈 점 풀이의 메시지</p>
        </div>

        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{emoji:"⚫",title:"얼굴 점 전체",desc:"얼굴 전체 점 완전 분석",price:"380원"},{emoji:"✋",title:"손금 풀이",desc:"손바닥 속 운명의 지도",price:"380원"},{emoji:"👁️",title:"관상 보기",desc:"얼굴 전체 운명 분석",price:"380원"},{emoji:"☯️",title:"사주 풀이",desc:"사주와 종합 분석",price:"980원"}].map(function(cs){return(
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
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #눈점 #와잠점 #도화점</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
