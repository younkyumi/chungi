import { useState, useRef, useEffect } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"어떤 점이 궁금한가요?", icon:"⚫", multi:true, skippable:false,
   opts:["❤️ 연애·결혼 관련 점","💰 재물·돈복 관련 점","💼 직업·출세 관련 점","⚠️ 주의가 필요한 점","🌟 복점인지 흉점인지","🌈 얼굴 전체 점 다"]},
  {title:"지금 가장 신경 쓰이는 점이 어디 있나요?", icon:"👁️", multi:false, skippable:true,
   opts:["👁️ 눈 주변","💋 입 주변","🦷 턱·볼","👃 코 주변","🎭 이마","🦻 귀 주변","🔮 잘 모르겠어요"]},
];

var LOADING_MSGS = [
  "얼굴 윤곽 감지 중... 👤","점 위치 좌표 분석 중... 📍",
  "점상학 데이터베이스 대조 중... 📚","복점 vs 흉점 판별 중... ⚫",
  "도사 할머니가 얼굴 들여다보는 중... 🔮",
  "관상과 점 위치 교차 분석 중... ✨"
];

// 복점/흉점 판별 기준 (젬순 자료 기반)
var MOLE_JUDGE = {
  lucky: "색이 칠흑처럼 까맣고 윤기가 나거나, 살짝 튀어나온 점(생점·生點). 또는 점에 털이 난 경우. → 복점",
  unlucky: "색이 탁하고 붉은빛이나 잿빛이 돌며, 형태가 찌그러지거나 피부 표면에 흐릿하게 번진 점(사점·死點). → 흉점",
};

// 점 위치별 의미 데이터
var MOLE_DATA = [
  {id:1, x:38, y:28, size:6, color:"#2C1810", name:"이마 왼쪽 점", area:"관록궁 (이마 중앙~좌측)",
   type:"복점", score:82,
   love:"이 위치의 점은 인연운이 좋아요. 첫 만남에서 좋은 인상을 주는 기운이 있어요.",
   money:"관록궁의 점은 직업과 명예운이 좋은 위치예요. 전문직이나 리더 역할에서 빛을 발해요.",
   career:"이 위치의 점이 있으면 윗사람의 도움을 받거나 조직에서 인정받는 경우가 많아요.",
   health:"이마 왼쪽은 간 기능과 연결돼있어요. 과로나 음주에 특히 신경 쓰세요.",
   detail:"이마의 점은 관록궁에 해당해요. 관록궁은 직업운·명예·승진운을 주관해요. 이 위치의 생점(까맣고 윤기 있는 점)은 사회적 출세와 명예 획득을 뜻하는 복점이에요. 특히 30대 이후 커리어에서 두각을 나타내는 경우가 많아요. 반면 색이 탁하거나 잿빛이면 직장 내 갈등·관재구설 주의 신호예요."},
  {id:2, x:68, y:42, size:5, color:"#1A0F0A", name:"눈꼬리 오른쪽 점", area:"처첩궁 (눈꼬리)",
   type:"복점", score:78,
   love:"눈꼬리 점은 이성에게 매력적으로 보이게 하는 도화 기운이 있어요. 특히 이성 인연이 많은 위치예요.",
   money:"이 위치의 점이 크고 선명할수록 이성을 통해 재물운이 열리는 경우가 있어요.",
   career:"대인관계와 인적 네트워크를 통해 기회가 오는 타입이에요.",
   health:"눈 주변 점은 시력과 안구 건강에 신경 쓰라는 신호예요.",
   detail:"눈꼬리의 점은 처첩궁에 위치해요. 처첩궁은 배우자운·연애운을 주관해요. 이 자리의 생점은 매력을 상징하는 도화점으로, 이성에게 인기가 많고 배우자 복이 좋아요. 다만 유혹에 약하거나 이성 관계가 복잡해질 수 있는 음란점으로 해석되기도 해요. 점이 속눈썹 가까이에 있을수록 도화 기운이 강해요. 흉점(탁하거나 붉은 점)이면 부부 불화 주의예요."},
  {id:3, x:52, y:70, size:4, color:"#2C1810", name:"코 옆 오른쪽 점", area:"재백궁 (코 옆·콧방울)",
   type:"복점", score:85,
   love:"큰 영향은 없지만 이성에게 친근한 인상을 줘요.",
   money:"콧방울 옆 점은 재물을 감추고 저축하는 능력을 뜻해요. 비상금·알짜 재산을 착착 쌓는 타입이에요.",
   career:"사업이나 장사를 하면 특히 잘 되는 위치예요. 금전 감각이 뛰어나요.",
   health:"코 옆은 소화기 계통과 연결돼 있어요. 위장 건강을 챙기세요.",
   detail:"코 옆(콧방울 근처)의 점은 재백궁에 해당해요. 코끝(준두)은 재물의 크기, 콧방울(난대·정위)은 재물을 지키는 금고 역할이에요. 콧방울 옆 생점은 비상금·재산 축적을 뜻하는 대표적인 복점이에요. 이 위치의 점이 크고 까맣고 윤기가 있을수록 알부자 기질이 강해요. 색이 탁하거나 흐리면 돈이 새어나가는 손재수 주의예요."},
];

var OVERALL = {
  total_score: 82,
  summary: DEMO_NAME+"님 얼굴을 보는 순간 느낌이 왔어요. 점의 위치들이 전체적으로 좋은 위치에 있어요. 특히 코 옆 점이 굉장히 강한 재물 복점이에요. 이마 점과 코 옆 점이 함께 있으면 '직업운과 재물운이 함께 열린다'는 의미가 있어요.",
  personality: "이 세 점의 조합을 보면 사회적으로 인정받으면서 재물도 따라오는 운명의 소유자예요. 단, 눈꼬리 점이 있어서 이성 관계에서 복잡한 일이 생길 수 있어요. 관계를 신중하게 맺는 게 중요해요.",
  lucky_mole: "코 옆 오른쪽 점 (재백궁) — 이 점이 가장 강한 복점이에요",
  warning: "점의 색깔이 갑자기 변하거나 크기가 커진다면 피부과를 방문하세요. 건강 신호일 수 있어요.",
  gaeun: [
    "복점 위치를 자주 만져주면 그 기운이 활성화돼요 — 단 너무 세게 자극하지 마세요",
    "이마 점이 있는 분은 이마를 가리지 말고 드러내는 헤어스타일이 운을 높여요",
    "점 근처 피부를 깨끗하게 관리하면 점의 기운이 더 선명하게 발현돼요",
    "코 옆 재물 복점이 있으면 지갑을 항상 깨끗하게 유지하는 게 재물운을 높여요",
  ],
};

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function Section({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>;}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

// 얼굴 실루엣 + 점 오버레이
function FaceSilhouette({moles, activeMole, onMoleClick}){
  return(
    <div style={{position:"relative",width:"100%",background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:16,overflow:"hidden",aspectRatio:"3/4",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
      <svg viewBox="0 0 100 130" width="100%" height="100%">
        {/* 얼굴 윤곽 */}
        <ellipse cx="50" cy="58" rx="34" ry="44" fill="rgba(232,200,122,0.07)" stroke="rgba(232,200,122,0.25)" strokeWidth="0.8"/>
        {/* 이마 */}
        <ellipse cx="50" cy="22" rx="28" ry="14" fill="rgba(232,200,122,0.04)" stroke="rgba(232,200,122,0.12)" strokeWidth="0.5"/>
        {/* 눈 */}
        <ellipse cx="38" cy="48" rx="7" ry="3.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <ellipse cx="62" cy="48" rx="7" ry="3.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        {/* 눈동자 */}
        <circle cx="38" cy="48" r="2.5" fill="rgba(255,255,255,0.12)"/>
        <circle cx="62" cy="48" r="2.5" fill="rgba(255,255,255,0.12)"/>
        {/* 코 */}
        <path d="M 46,58 Q 44,68 46,72 Q 50,74 54,72 Q 56,68 54,58" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        {/* 입 */}
        <path d="M 40,84 Q 50,90 60,84" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none"/>
        {/* 귀 */}
        <ellipse cx="16" cy="58" rx="5" ry="8" fill="rgba(232,200,122,0.05)" stroke="rgba(232,200,122,0.15)" strokeWidth="0.5"/>
        <ellipse cx="84" cy="58" rx="5" ry="8" fill="rgba(232,200,122,0.05)" stroke="rgba(232,200,122,0.15)" strokeWidth="0.5"/>
        {/* 구역 라벨 */}
        <text x="50" y="16" fontSize="4.5" fill="rgba(232,200,122,0.5)" textAnchor="middle">관록궁(이마)</text>
        <text x="50" y="76" fontSize="4.5" fill="rgba(232,200,122,0.5)" textAnchor="middle">재백궁(코)</text>
        <text x="75" y="48" fontSize="4" fill="rgba(255,255,255,0.35)" textAnchor="middle">처첩궁</text>
        {/* 점들 */}
        {moles.map(function(m){
          var isActive=activeMole===m.id;
          return(
            <g key={m.id} onClick={function(){onMoleClick(m.id);}} style={{cursor:"pointer"}}>
              <circle cx={m.x} cy={m.y} r={m.size/2+3} fill="transparent"/>
              <circle cx={m.x} cy={m.y} r={m.size/2} fill={m.color} stroke={isActive?"#E8C87A":"rgba(232,200,122,0.4)"} strokeWidth={isActive?1.5:0.8}/>
              {isActive&&<circle cx={m.x} cy={m.y} r={m.size/2+2.5} fill="none" stroke="#E8C87A" strokeWidth="1" opacity="0.7" strokeDasharray="2,1"/>}
              {isActive&&<text x={m.x} y={m.y-m.size/2-2} fontSize="4" fill="#E8C87A" textAnchor="middle">{m.type==="복점"?"✦복":""}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center"}}>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>점을 탭하면 상세 풀이가 나와요</p>
      </div>
    </div>
  );
}

function FaceOverlay({imageUrl, moles, activeMole, onMoleClick}){
  return(
    <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
      <img src={imageUrl} alt="얼굴" style={{width:"100%",display:"block"}}/>
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} viewBox="0 0 100 130" preserveAspectRatio="none">
        {moles.map(function(m){
          var isActive=activeMole===m.id;
          return(
            <g key={m.id} onClick={function(){onMoleClick(m.id);}} style={{cursor:"pointer"}}>
              <circle cx={m.x} cy={m.y} r={m.size/2+4} fill="transparent"/>
              <circle cx={m.x} cy={m.y} r={m.size/2+1.5} fill="none" stroke="#E8C87A" strokeWidth="1.2" opacity={isActive?1:0.7} strokeDasharray={isActive?"none":"3,2"}/>
              {isActive&&<circle cx={m.x} cy={m.y} r={m.size/2+3.5} fill="none" stroke="#E8C87A" strokeWidth="0.8" opacity="0.5" strokeDasharray="2,1"/>}
              <text x={m.x+m.size/2+2} y={m.y+1.5} fontSize="4.5" fill={isActive?"#E8C87A":"rgba(232,200,122,0.8)"} fontWeight="bold">{m.type==="복점"?"✦":""}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function MolePage(){
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
  var currentMole=MOLE_DATA.find(function(m){return m.id===activeMole;});

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>⚫ 얼굴 점</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>내 얼굴 점, 복점일까? 점 위치의 비밀</p></div>
          <div style={{textAlign:"right"}}><span style={{fontSize:13,fontWeight:900,color:G,display:"block"}}>980원</span><span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>→ 380원</span></div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>⚫ 점 하나가 운명을 바꾼다</p>
          <FaceSilhouette moles={MOLE_DATA} activeMole={null} onMoleClick={function(){}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
            {[["✦ 복점","재물·연애·명예를 불러오는 점"],["✕ 흉점","주의가 필요한 관리 포인트"],["📍 위치","같은 점도 위치에 따라 의미가 달라요"],["🔮 크기·색","점의 크기와 색깔도 운을 결정해요"]].map(function(x){return(
              <div key={x[0]} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px"}}>
                <p style={{fontSize:11,fontWeight:700,color:G,margin:"0 0 2px"}}>{x[0]}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.4}}>{x[1]}</p>
              </div>
            );})}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 얼굴 점 풀이에서 알 수 있는 것</p>
          {[["⚫","점 위치 AI 감지 + 표시","사진에서 점 위치를 찾아 표시해드려요"],["🔮","복점 vs 흉점 판별","각 점이 복점인지 흉점인지 정확히 분석"],["❤️","연애·결혼 점 풀이","어느 점이 인연운과 관련 있는지"],["💰","재물 복점 찾기","재물운을 높이는 복점 위치와 의미"],["💼","직업·명예운 분석","커리어에 영향 주는 점의 위치와 의미"],["🌿","건강 관련 점 분석","주의해야 할 건강 신호로서의 점"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 4px"}}>📸 사진 촬영 꿀팁</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.65,margin:0}}>밝은 조명에서 정면 얼굴을 찍어주세요<br/>화장을 하지 않은 상태가 더 정확해요<br/>머리카락이 얼굴을 가리지 않게 해주세요</p>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:26,fontWeight:900,color:G,margin:"0 0 2px"}}>380원</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,textDecoration:"line-through"}}>원래 980원</p>
        </div>
        <GBtn onClick={function(){setStep("upload");}}>얼굴 점 분석 시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="upload") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>📸 얼굴 사진을 올려주세요</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>정면 얼굴 · 밝은 조명 · 민낯 추천</p>
      </div>
      <div style={{padding:"16px"}}>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files&&e.target.files[0]){var reader=new FileReader();reader.onload=function(ev){setUploadedImg(ev.target.result);};reader.readAsDataURL(e.target.files[0]);}}}/>
        {uploadedImg?(
          <div style={{marginBottom:14}}>
            <div style={{position:"relative",width:"100%",borderRadius:16,overflow:"hidden",marginBottom:10}}>
              <img src={uploadedImg} alt="얼굴" style={{width:"100%",display:"block"}}/>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(46,125,50,0.9)",borderRadius:8,padding:"4px 10px"}}><p style={{fontSize:10,color:"#fff",fontWeight:700,margin:0}}>✓ 업로드 완료</p></div>
            </div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"inherit",marginBottom:10}}>다시 촬영하기</button>
          </div>
        ):(
          <div>
            <button onClick={function(){fileRef.current.click();}} style={{width:"100%",aspectRatio:"3/4",background:"rgba(255,255,255,0.03)",border:"2px dashed rgba(232,200,122,0.3)",borderRadius:16,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12,fontFamily:"inherit"}}>
              <span style={{fontSize:56}}>🤳</span>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>얼굴 사진 올리기</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>정면 얼굴 사진을 업로드해주세요</p>
              </div>
            </button>
            <button onClick={function(){setUploadedImg("demo");}} style={{width:"100%",padding:"12px",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,cursor:"pointer",fontSize:12,color:G,fontFamily:"inherit",marginBottom:12}}>📋 사진 없이 데모로 보기</button>
          </div>
        )}
        <div style={{marginBottom:10}}>
          <GBtn onClick={function(){if(uploadedImg){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}}} dim={!uploadedImg}>{uploadedImg?"다음 단계로 →":"사진을 먼저 올려주세요"}</GBtn>
        </div>
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",lineHeight:1.5}}>{opt}</button>;})}
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

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {uploadedImg&&uploadedImg!=="demo"&&<div style={{marginBottom:12,borderRadius:12,overflow:"hidden",height:120,position:"relative"}}><img src={uploadedImg} alt="얼굴" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",display:"flex",alignItems:"flex-end",padding:"10px 12px"}}><p style={{fontSize:11,color:"#fff",margin:0,fontWeight:600}}>✓ 얼굴 사진 등록 완료 — 점 분석 준비됨</p></div></div>}
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"rgba(255,255,255,0.4)",textDecoration:"line-through"}}>정가 980원</span><span style={{fontSize:12,color:"rgba(255,255,255,0.3)",textDecoration:"line-through"}}>980원</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>할인 가격</span><span style={{fontSize:16,fontWeight:700,color:G}}>380원</span></div>
        </div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>얼굴 점 분석하기 (380원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>⚫</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 8px"}}>{DEMO_NAME}님의 얼굴 점 분석 중...</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 16px"}}>점 위치 감지 → 관상 구역 매핑 → 복흉 판별</p>
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
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 얼굴 점 · 점상학</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 ⚫ 얼굴 점 풀이</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>AI 점 감지 + 점상학 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>궁금한 점: {q1.split(",").slice(0,2).join(", ")}</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>📍 특히 신경 쓰이는 위치: {q2}</p>}
        </div>}

        {/* 얼굴 이미지 + 점 오버레이 — 탭해서 점 풀이 */}
        <Section title="⚫ 얼굴 점 AI 감지 이미지 (점을 탭해보세요)">
          {uploadedImg&&uploadedImg!=="demo"
            ?<FaceOverlay imageUrl={uploadedImg} moles={MOLE_DATA} activeMole={activeMole} onMoleClick={setActiveMole}/>
            :<FaceSilhouette moles={MOLE_DATA} activeMole={activeMole} onMoleClick={setActiveMole}/>
          }
          {/* 점 탭 시 미니 팝업 */}
          {currentMole&&(
            <div style={{marginTop:12,background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.35)",borderRadius:12,padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 2px"}}>{currentMole.name}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0}}>{currentMole.area}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:currentMole.type==="복점"?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.1)",color:currentMole.type==="복점"?"#2E7D32":"#C62828",fontWeight:700}}>{currentMole.type}</span>
                  <p style={{fontSize:12,fontWeight:700,color:"#7A5C00",margin:"4px 0 0"}}>{currentMole.score}점</p>
                </div>
              </div>
              <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0}}>{currentMole.detail}</p>
              <button onClick={function(){setActiveMole(null);}} style={{marginTop:8,background:"transparent",border:"none",fontSize:11,color:"rgba(0,0,0,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기 ✕</button>
            </div>
          )}
          {!currentMole&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:"10px 0 0"}}>⬆️ 위 이미지에서 점을 탭하면 상세 풀이가 나와요</p>}
        </Section>

        {/* 종합 총평 */}
        <Section title="🔮 얼굴 점 종합 총평">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"12px 14px",background:"rgba(232,200,122,0.06)",borderRadius:12,border:"1px solid rgba(232,200,122,0.25)"}}>
            <span style={{fontSize:26}}>⚫</span>
            <div><p style={{fontSize:14,fontWeight:800,color:"#7A5C00",margin:"0 0 3px"}}>종합 점 운세 점수</p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:100,height:6,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:OVERALL.total_score+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div>
                <span style={{fontSize:15,fontWeight:900,color:"#7A5C00"}}>{OVERALL.total_score}점</span>
              </div>
            </div>
          </div>
          <Para text={OVERALL.summary}/>
          {/* 복점/흉점 판별 기준 */}
          <div style={{marginBottom:12}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,letterSpacing:2,margin:"0 0 8px"}}>⚫ 복점 vs 흉점 판별 기준</p>
            {[
              {label:"복점 (생점·生點)",color:"#2E7D32",bg:"rgba(46,125,50,0.06)",border:"rgba(46,125,50,0.2)",desc:"칠흑처럼 까맣고 윤기가 나거나, 살짝 튀어나온 점. 점에 털이 난 경우도 복점이에요."},
              {label:"흉점 (사점·死點)",color:"#C62828",bg:"rgba(198,40,40,0.05)",border:"rgba(198,40,40,0.15)",desc:"색이 탁하고 붉은빛·잿빛이 돌며, 형태가 찌그러지거나 피부에 흐릿하게 번진 점이에요."},
            ].map(function(j,i){return(
              <div key={i} style={{background:j.bg,border:"1px solid "+j.border,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                <p style={{fontSize:11,fontWeight:700,color:j.color,margin:"0 0 3px"}}>{j.label}</p>
                <p style={{fontSize:11,color:"#444",lineHeight:1.7,margin:0}}>{j.desc}</p>
              </div>
            );})}
          </div>
          <div style={{background:"rgba(46,125,50,0.06)",border:"1px solid rgba(46,125,50,0.2)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <p style={{fontSize:10,color:"#2E7D32",fontWeight:700,margin:"0 0 5px"}}>✦ 가장 강한 복점</p>
            <p style={{fontSize:12,color:"#333",margin:0,fontWeight:600}}>{OVERALL.lucky_mole}</p>
          </div>
          <div style={{background:"rgba(255,200,0,0.06)",border:"1px solid rgba(200,100,0,0.15)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:10,color:"#C4922A",fontWeight:700,margin:"0 0 5px"}}>⚠️ 중요 안내</p>
            <p style={{fontSize:11,color:"#555",margin:0,lineHeight:1.7}}>{OVERALL.warning}</p>
          </div>
        </Section>

        {/* 점별 영역 분석 */}
        <Section title="📍 점별 영역 상세 분석">
          {MOLE_DATA.map(function(m){return(
            <div key={m.id} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:m.color,flexShrink:0,border:"2px solid rgba(232,200,122,0.4)"}}/>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{m.name}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0}}>{m.area}</p>
                </div>
                <span style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:m.type==="복점"?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)",color:m.type==="복점"?"#2E7D32":"#C62828",fontWeight:700,flexShrink:0}}>{m.type} {m.score}점</span>
              </div>
              {[["❤️ 연애운",m.love],["💰 재물운",m.money],["💼 직업운",m.career],["🌿 건강",m.health]].map(function(r){return(
                <div key={r[0]} style={{marginBottom:8,paddingLeft:10,borderLeft:"2px solid rgba(232,200,122,0.35)"}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#7A5C00",margin:"0 0 2px"}}>{r[0]}</p>
                  <p style={{fontSize:11,color:"#333",lineHeight:1.7,margin:0}}>{r[1]}</p>
                </div>
              );})}
            </div>
          );})}
        </Section>

        {/* 성격 총평 */}
        <Section title="🧬 점으로 보는 성격·운명">
          <Para text={OVERALL.personality}/>
        </Section>

        {/* 개운법 */}
        <Section title="✨ 점 기반 개운법">
          {OVERALL.gaeun.map(function(g,i){return(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
              <span style={{fontSize:16,flexShrink:0}}>✨</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g}</p>
            </div>
          );})}
        </Section>

        {/* 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님 얼굴의 점들은<br/>우연이 아니에요. 운명이 새긴 표시예요.<br/>
            <span style={{fontSize:13,fontWeight:600}}>그 중에서 코 옆 복점이 특히 강해요.</span>
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 얼굴 점 풀이의 메시지</p>
        </div>

        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{emoji:"👁️",title:"눈 점 풀이",desc:"눈가 점 하나가 연애운을 바꾼다",price:"380원"},{emoji:"✋",title:"손금 풀이",desc:"손바닥 속 운명의 지도",price:"380원"},{emoji:"👁️",title:"관상 보기",desc:"얼굴 전체로 보는 운명",price:"380원"},{emoji:"☯️",title:"사주 풀이",desc:"점과 사주를 종합 분석",price:"980원"}].map(function(cs){return(
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
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #얼굴점 #복점 #점상학</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
