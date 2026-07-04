import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"대운에서 가장 궁금한 건?", icon:"🔄", multi:true, skippable:false,
   opts:["💰 재물 흐름","❤️ 인연·결혼","💼 직업·사업","📜 관운·명예운","🌿 건강","🔄 대운이 언제 바뀌는지","🌟 전체 대운 흐름","🌈 전체 다 궁금해요!"]},
  {title:"지금 대운이 어떻게 느껴지나요?", icon:"💭", multi:false, skippable:false,
   opts:["📈 뭔가 좋아지는 느낌","📉 뭔가 계속 막히는 느낌","🌪️ 너무 빠르게 변하고 있어","😐 잘 모르겠어","🔄 최근에 큰 변화가 있었어","😰 정체된 느낌, 발전이 없어"]},
];

var CROSS = [
  {emoji:"☯️",title:"사주 풀이",desc:"내 사주 전체 완전 분석",price:"980원"},
  {emoji:"🌙",title:"월별 운세",desc:"이번 달 디테일 사주 분석",price:"첫회무료"},
  {emoji:"🌅",title:"연도별 운세",desc:"특정 연도 전체 분석",price:"980원"},
  {emoji:"🎋",title:"신년 운세",desc:"올해 1~12월 월별 분석",price:"1,980원"},
];

var LOADING_MSGS = [
  "대운 구간 계산 중... 🔄","10년 흐름 분석 중... ⏳","용신 대입 중... ☯️",
  "저승사자가 대운 장부 펼치는 중... 📖","인생의 큰 그림 그리는 중... 🎨"
];

var DAEUN_DATA = [
  {age:"25~34세",sky:"甲",earth:"子",skyK:"갑",earthK:"자",element:"목",color:"#7CB87B",
   summary:"목 기운 강한 시기. 새로운 시작과 도전의 에너지가 넘쳤던 대운이에요.",
   intro:DEMO_NAME+"님, 25~34세 갑자 대운을 돌아볼게요. 이 대운은 시작의 에너지가 폭발적인 시기였어요. 처음 사회에 나와 이것저것 도전하고, 실패도 하고, 일어서기를 반복했을 거예요. 갑목은 하늘을 향해 곧게 자라는 나무예요. 이 대운에서 겪은 모든 경험이 지금의 규미님을 만든 토대예요.",
   money_score:65, love_score:78, health_score:72, career_score:70,
   money:"새로운 수입원을 시도하기 좋은 대운이었어요. 들어오고 나가는 게 빨랐고, 한 번에 큰돈보다는 경험이 쌓이는 시기였어요. 이 시기에 돈 관리를 어떻게 했느냐가 지금 재물 기반을 결정했어요.",
   love:"인연의 기운이 가장 강하게 흘렀던 대운이에요. 도화살이 폭발적으로 작동해서 감정적으로 활발했던 시기예요. 여러 인연을 만나고 헤어지며 진짜 내가 원하는 사람의 기준이 만들어진 시기예요.",
   health:"목 기운이 강해 간·담 계통에 신경 써야 했던 시기예요. 젊은 나이라 몸이 버텨줬지만, 이 시기에 쌓인 피로가 나중에 나오기도 해요. 규칙적인 생활보다 불규칙한 패턴이 많았을 거예요.",
   career:"처음 시작하는 것들이 많았던 대운이에요. 이직도 해보고, 새로운 분야도 시도해봤을 거예요. 이 시기에 발견한 내가 좋아하는 것과 잘하는 것이 지금 커리어의 씨앗이 됐어요.",
   advice:["이 대운에서 쌓은 경험이 지금 규미님의 가장 큰 자산이에요","실패했던 것들도 다 데이터예요. 아무것도 낭비된 건 없어요","이 대운의 에너지가 지금도 규미님 안에 살아있어요"],
   active:false},
  {age:"35~44세",sky:"乙",earth:"丑",skyK:"을",earthK:"축",element:"목·토",color:"#E8C87A",
   summary:"지금 흐르고 있는 대운. 안정 속에서 전문성을 쌓는 시기예요.",
   intro:DEMO_NAME+"님, 지금 흐르고 있는 을축 대운을 솔직하게 말씀드릴게요. 겉으로는 안정적이고 조용해 보이는 대운이에요. 근데 이게 막히는 게 아니에요. 이 대운은 '준비하는 시간'이에요. 지금 막힌다는 느낌 맞아요. 근데 이 막힘이 다음 대운의 폭발적 성장을 위한 압력을 쌓고 있는 거예요.",
   money_score:71, love_score:75, health_score:68, career_score:82,
   money:"급격한 변화보다 꾸준히 쌓이는 방식의 재물 흐름이에요. 이 대운에서 한꺼번에 큰돈이 오는 스타일이 아니에요. 꾸준히 전문성을 쌓으면서 그에 맞는 보상이 따라오는 구조예요. 특히 38~41세 사이에 재물의 흐름이 눈에 띄게 좋아지는 시기가 있어요.",
   love:"깊이 있는 인연을 만나거나 기존 관계를 더 탄탄하게 다지는 대운이에요. 도화살이 이 대운에서도 강하게 작동하고 있어요. 인연이 없는 게 아니라 깊어지는 과정이에요. 이 대운 안에(2025~2028년) 결혼 기운이 있어요.",
   health:"소화기와 위장에 신경 써야 하는 시기예요. 스트레스를 받으면 바로 소화 기능에 영향이 와요. 이 대운에서 건강을 잘 지키는 사람이 다음 대운을 훨씬 강하게 시작해요.",
   career:"한 분야에서 전문가로 자리잡는 대운이에요. 지금 하는 일에서 스페셜리스트가 되는 것이 이 대운의 핵심 전략이에요. 이 대운에서 전문성을 얼마나 깊이 쌓느냐가 다음 대운의 명예와 위치를 결정해요.",
   advice:["지금 이 시간이 쌓이고 있어요 — 조급해하지 마세요","전문성에 집중하세요 — 이 시기의 깊이가 다음 대운의 높이를 만들어요","건강 기반을 지금부터 다지세요 — 다음 대운을 위한 체력 투자예요"],
   active:true,now:true},
  {age:"45~54세",sky:"丙",earth:"寅",skyK:"병",earthK:"인",element:"화",color:"#E8532A",
   summary:"화 기운 강해짐. 사회적 활동과 명예가 절정에 달하는 황금기예요.",
   intro:DEMO_NAME+"님, 45~54세 병인 대운은 인생에서 가장 빛나는 시기예요. 병화는 태양의 불꽃이에요. 지금 을축 대운에서 쌓고 있는 전문성과 네트워크가 이 대운에서 폭발적으로 빛을 발해요. 사회적으로 인정받고, 원하는 것을 이룰 수 있는 황금기가 올 거예요. 지금이 준비 기간인 이유가 여기 있어요.",
   money_score:83, love_score:76, health_score:70, career_score:88,
   money:"재물이 본격적으로 결실을 맺는 시기예요. 지금 을축 대운에서 쌓은 전문성이 이 시기에 큰 돈으로 돌아와요. 투자 감각도 살아나고, 예상치 못한 큰 수입이 생길 수 있어요. 부동산이나 장기 투자가 이 대운에서 특히 잘 맞아요.",
   love:"화 기운이 강해 관계에서 활발하고 적극적인 시기예요. 이미 안정된 관계라면 더 풍요롭게 발전하고, 미혼이라면 사회적 성공이 좋은 인연을 불러오는 시기예요.",
   health:"화 기운이 강해 심장과 혈압, 눈 건강에 신경 써야 하는 시기예요. 활발한 활동 중 과로를 조심하세요. 지금 을축 대운에서 체력을 쌓아두면 이 시기를 훨씬 강하게 보낼 수 있어요.",
   career:"커리어의 정점을 찍을 수 있는 대운이에요. 사회적 인정과 명예가 따라오고, 리더 역할을 맡게 되는 시기예요. 지금 쌓는 전문성이 이 시기 커리어의 연료가 돼요.",
   advice:["지금 을축 대운에서 전문성을 쌓으면 이 대운에서 10배로 돌아와요","인간관계를 지금부터 잘 관리하세요 — 이 대운의 기회는 사람을 통해 와요","건강을 지금부터 챙기세요 — 이 대운에서 폭발적으로 활동하려면 체력이 기반이에요"],
   active:false,locked:true},
  {age:"55~64세",sky:"丁",earth:"卯",skyK:"정",earthK:"묘",element:"화·목",color:"#C4922A",
   summary:"결실과 안정의 시기. 지금까지 쌓아온 것들이 빛을 발하는 황금기예요.",
   intro:DEMO_NAME+"님, 55~64세 정묘 대운은 수확의 계절이에요. 정화는 촛불처럼 따뜻하고 안정적인 빛이에요. 병인 대운의 폭발적인 활동이 끝나고, 이제는 그 결실을 누리는 시기예요. 사회적 명예와 물질적 안정이 함께 오는 인생의 황금기 중 황금기예요.",
   money_score:80, love_score:82, health_score:72, career_score:77,
   money:"안정적인 수입과 자산이 유지되는 시기예요. 이전 대운에서 쌓아온 것들이 안정적인 현금 흐름을 만들어줘요. 무리한 투자보다 지키고 나누는 것이 이 대운의 재물 철학이에요.",
   love:"깊은 인간관계와 가족과의 유대가 중요해지는 대운이에요. 오래된 인연들이 더 깊어지고, 주변 사람들에게 의지가 되는 존재가 되는 시기예요.",
   health:"목·화 기운 교차로 심혈관과 관절에 신경 써야 하는 시기예요. 규칙적인 운동과 균형 잡힌 식사가 이 대운의 건강 핵심이에요.",
   career:"지금까지의 커리어를 완성하고, 후배들에게 전하는 시기예요. 직접 일하는 것보다 가르치고 이끄는 역할이 맞는 대운이에요.",
   advice:["지금 쌓는 것들이 이 시기에 가장 풍요롭게 돌아와요","인간관계에 투자하세요 — 이 대운의 진짜 행복은 사람에서 와요","건강이 모든 것의 기반이에요 — 지금부터 꾸준히 챙기세요"],
   active:false,locked:true},
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

export default function DaeunPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [openDaeun,setOpenDaeun]=useState(1);
  var [unlockedDaeun,setUnlockedDaeun]=useState({});
  var [payingDaeun,setPayingDaeun]=useState(null);
  var [viewDaeun,setViewDaeun]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var ivRef=useRef(null);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*3+1.5);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},500);}
    },180);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||"";

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🔄 대운 해설</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>지금 내 인생은 몇 막? 10년의 큰 그림</p></div>
          <div style={{textAlign:"right"}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(116,185,255,0.18)",color:"#74B9FF",border:"1px solid #74B9FF44",fontWeight:700,display:"block",marginBottom:4}}>첫회무료</span><span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>이후 980원</span></div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>🔄 10년 단위 인생 대운 타임라인</p>
          <div style={{position:"relative",paddingLeft:20}}>
            <div style={{position:"absolute",left:9,top:0,bottom:0,width:2,background:"rgba(232,200,122,0.2)"}}/>
            {DAEUN_DATA.map(function(d,i){return(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12,position:"relative"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:d.now?"#E8C87A":"rgba(255,255,255,0.1)",border:"2px solid "+(d.now?"#E8C87A":"rgba(255,255,255,0.2)"),flexShrink:0,marginTop:2,zIndex:1}}/>
                <div style={{flex:1,background:d.now?"rgba(232,200,122,0.1)":"rgba(255,255,255,0.04)",border:d.now?"1px solid rgba(232,200,122,0.3)":"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <p style={{fontSize:11,fontWeight:700,color:d.now?G:"rgba(255,255,255,0.7)",margin:0}}>{d.age}</p>
                    {d.now&&<span style={{fontSize:9,color:G,background:"rgba(232,200,122,0.15)",padding:"1px 6px",borderRadius:8}}>현재 ★</span>}
                    {d.locked&&<span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>🔒</span>}
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:4}}>
                    <span style={{fontSize:16,color:d.now?G:"rgba(255,255,255,0.5)",fontWeight:700}}>{d.sky}{d.earth}</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",alignSelf:"flex-end"}}>{d.skyK}{d.earthK}</span>
                  </div>
                  {d.now&&<p style={{fontSize:11,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6}}>{d.summary}</p>}
                </div>
              </div>
            );})}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 대운 해설에서 알 수 있는 것</p>
          {[["🔄","지금 대운의 정체","현재 10년 대운의 기운과 의미 완전 해석"],["💰","이 대운에서 재물 흐름","언제 돈이 들어오고 어떤 방식이 맞는지"],["❤️","이 대운에서 인연","좋은 인연이 오는 시기와 맞는 상대"],["💼","직업·사업 전략","이 대운에서 가장 유리한 커리어 방향"],["🌿","건강 주의사항","이 대운에서 특별히 챙겨야 할 건강 포인트"],["🔮","다음 대운 예고","다음 10년을 위해 지금 준비해야 할 것"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(116,185,255,0.08)",border:"1px solid rgba(116,185,255,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:22,fontWeight:900,color:"#74B9FF",margin:"0 0 2px"}}>첫 회 무료 🎁</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 4px"}}>이후 980원 · 추가 대운 380원</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>무료로 시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>🔄 누구의 대운을 볼까요?</h3></div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}><div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여 · 오시생</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span></button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
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
        <div style={{background:DG,padding:"18px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button><div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div><span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span></div><p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>{curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 하나만 고를수록 더 깊게 분석해드려요.</p>}</div>
        <div style={{padding:"16px"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>{curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}</div>{curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}</div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>무료로 시작하기 🎁</h3></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{background:"rgba(116,185,255,0.08)",border:"1px solid rgba(116,185,255,0.3)",borderRadius:13,padding:"16px",textAlign:"center",marginBottom:14}}><p style={{fontSize:20,fontWeight:900,color:"#74B9FF",margin:"0 0 4px"}}>🎁 첫 회 완전 무료</p><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>결제 없이 바로 분석 시작</p></div>
        <GBtn onClick={function(){setStep("loading");}}>무료로 분석 시작 →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>🔄</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 대운 분석 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 6px"}}>{LOADING_MSGS[loadMsgIdx]}</p>
      </div>
    </div>
  );

  // ━━━ 결과 ━━━
  var nowD=DAEUN_DATA[1];

  // ━━━ 추가 대운 결과 화면 ━━━
  if(step==="result"&&viewDaeun!==null){
    var vd=DAEUN_DATA[viewDaeun];
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <button onClick={function(){setViewDaeun(null);}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <span>←</span><span>전체 대운으로 돌아가기</span>
          </button>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 대운 해설 · {vd.age}</p>
          <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🔄 {vd.age} 대운</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>{vd.element} 기운 · {vd.sky}{vd.earth}({vd.skyK}{vd.earthK})</p>
        </div>
        <div style={{padding:"14px 14px 0"}}>

          {/* 대운 카드 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>🔄 {vd.age} 대운 — {vd.sky}{vd.earth} 기운</p>
            <div style={{background:"rgba(232,200,122,0.06)",border:"2px solid rgba(232,200,122,0.4)",borderRadius:14,padding:"18px",marginBottom:16,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:10}}>
                <div><p style={{fontSize:40,color:vd.color||"#7A5C00",fontWeight:700,margin:"0 0 4px",lineHeight:1}}>{vd.sky}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:0}}>{vd.skyK} (천간)</p></div>
                <div><p style={{fontSize:40,color:vd.color||"#C4922A",fontWeight:700,margin:"0 0 4px",lineHeight:1}}>{vd.earth}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:0}}>{vd.earthK} (지지)</p></div>
              </div>
              <span style={{fontSize:11,padding:"4px 14px",borderRadius:20,background:"rgba(232,200,122,0.2)",color:"#7A5C00",fontWeight:700}}>{vd.element} 기운의 시기</span>
            </div>
            <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:0,wordBreak:"keep-all"}}>{vd.intro}</p>
          </div>

          {/* 영역별 분석 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>✦ {vd.age} 영역별 흐름</p>
            {[{emoji:"💰",title:"재물운",score:vd.money_score,text:vd.money},
              {emoji:"❤️",title:"인연·결혼운",score:vd.love_score,text:vd.love},
              {emoji:"🌿",title:"건강운",score:vd.health_score,text:vd.health},
              {emoji:"💼",title:"직업·사업운",score:vd.career_score,text:vd.career},
            ].map(function(r){return(
              <div key={r.title} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{r.emoji} {r.title}</p>
                  <span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{r.score}점</span>
                </div>
                <div style={{height:6,background:"#F0EDE6",borderRadius:99,overflow:"hidden",marginBottom:8}}>
                  <div style={{height:"100%",width:r.score+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/>
                </div>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{r.text}</p>
              </div>
            );})}
          </div>

          {/* 이 대운을 위한 핵심 조언 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>💡 {vd.age} 핵심 조언</p>
            {vd.advice.map(function(a,i){return(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
                <span style={{fontSize:16,flexShrink:0}}>✨</span>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{a}</p>
              </div>
            );})}
          </div>

          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
            <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
              💫 {DEMO_NAME}님, {vd.age}의 기운이<br/>지금 {DEMO_NAME}님 인생에 메시지를 보내고 있어요.
            </p>
            <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 대운 해설의 메시지</p>
          </div>

          <button onClick={function(){setViewDaeun(null);}} style={{width:"100%",padding:"15px",border:"1px solid rgba(232,200,122,0.3)",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:"transparent",color:G}}>← 전체 대운으로 돌아가기</button>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 대운 해설</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🔄 대운 해설</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>10년 단위 인생의 큰 그림 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>궁금한 것: {q1.split(",")[0]}</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"3px 0 0"}}>💭 지금 느낌: {q2}</p>}
        </div>}

        {/* 현재 대운 카드 */}
        <Section title="🔄 현재 대운 — 을축(乙丑) 35~44세">
          <div style={{background:"rgba(232,200,122,0.06)",border:"2px solid rgba(232,200,122,0.4)",borderRadius:14,padding:"18px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 8px"}}>현재 흐르고 있는 대운 ★</p>
            <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:10}}>
              <div><p style={{fontSize:42,color:"#7A5C00",fontWeight:700,margin:"0 0 4px",lineHeight:1}}>乙</p><p style={{fontSize:12,color:"rgba(0,0,0,0.5)",margin:0}}>을목 (천간)</p></div>
              <div><p style={{fontSize:42,color:"#C4922A",fontWeight:700,margin:"0 0 4px",lineHeight:1}}>丑</p><p style={{fontSize:12,color:"rgba(0,0,0,0.5)",margin:0}}>축토 (지지)</p></div>
            </div>
            <span style={{fontSize:11,padding:"3px 14px",borderRadius:20,background:"rgba(232,200,122,0.2)",color:"#7A5C00",fontWeight:700}}>목·토 기운 교차의 시기</span>
          </div>
          <Para text={DEMO_NAME+"님, 지금 흐르고 있는 을축 대운을 솔직하게 말씀드릴게요. 겉으로는 안정적이고 조용해 보이는 대운이에요. 근데 이게 막히는 게 아니에요. 이 대운은 '준비하는 시간'이에요."}/>
          <Para text={"을목의 기운은 부드럽게 감기는 덩굴처럼 천천히, 하지만 확실하게 뻗어나가는 힘이 있어요. 축토는 겨울의 땅, 아직 얼어있지만 봄을 준비하는 에너지예요. "+q2.includes("막히는")?"지금 막힌다는 느낌 맞아요. 근데 이건 대운이 나쁜 게 아니에요. 이 막힘이 다음 대운(45세~)의 폭발적 성장을 위한 압력을 쌓고 있는 거예요.":"지금 이 시기에 기반을 얼마나 단단히 하느냐가 다음 대운의 크기를 결정해요."}/>
          <Para text={"이 대운에서 가장 잘못하는 것이 '지금 내가 제자리인가?' 하는 조급함이에요. "+DEMO_NAME+"님, 지금이 제자리가 아니에요. 지금 이 시간이 쌓이고 있어요. 다음 대운(45~54세 병인 대운)에서 이 시기에 쌓은 것들이 폭발적으로 빛을 발할 거예요."}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["대운 시작","35세 (2023년)"],["대운 종료","44세 (2032년)"],["남은 기간","약 7년"],["다음 대운","병인 (火) 대운"]].map(function(x){return(
              <div key={x[0]} style={{background:"#F9F7F2",borderRadius:10,padding:"10px 12px"}}>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[0]}</p>
                <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{x[1]}</p>
              </div>
            );})}
          </div>
        </Section>

        {/* 영역별 대운 분석 */}
        <Section title="✦ 이 대운에서 영역별 흐름">
          {[{emoji:"💰",title:"재물운",score:71,color:"linear-gradient(90deg,#E8C87A,#C4922A)",
              text:"급격한 변화보다 꾸준히 쌓이는 방식의 재물 흐름이에요. 이 대운에서 한꺼번에 큰돈이 오는 스타일이 아니에요. 꾸준히 전문성을 쌓으면서 그에 맞는 보상이 따라오는 구조예요. 특히 38~41세 사이에 재물의 흐름이 눈에 띄게 좋아지는 시기가 있어요. 지금 씨앗을 잘 심어두세요."},
            {emoji:"❤️",title:"인연·결혼운",score:75,color:"linear-gradient(90deg,#FF7675,#C62828)",
              text:"깊이 있는 인연을 만나거나 기존 관계를 더 탄탄하게 다지는 대운이에요. 도화살이 이 대운에서도 강하게 작동하고 있어요. 인연이 없는 게 아니라 깊어지는 과정이에요. 이 대운 안에(2025~2028년) 결혼 기운이 있어요. 조건보다 사람을 보는 게 이 대운에서 맞는 태도예요."},
            {emoji:"🌿",title:"건강운",score:68,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
              text:"을축 대운은 소화기와 위장에 신경 써야 하는 시기예요. 스트레스를 받으면 바로 소화 기능에 영향이 오는 대운이에요. 이 대운에서 건강을 잘 지키는 사람이 다음 대운을 훨씬 강하게 시작해요."},
            {emoji:"💼",title:"직업·사업운",score:82,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
              text:"한 분야에서 전문가로 자리잡는 대운이에요. 지금 하는 일에서 스페셜리스트가 되는 것이 이 대운의 핵심 전략이에요. 이 대운에서 전문성을 얼마나 깊이 쌓느냐가 다음 대운의 명예와 위치를 결정해요."},
          ].map(function(r){return(
            <div key={r.title} style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{r.emoji} {r.title}</p><span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{r.score}점</span></div>
              <ScoreBar score={r.score} color={r.color}/>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{r.text}</p>
            </div>
          );})}
        </Section>

        {/* 전체 대운 타임라인 — 잠금 처리 */}
        <Section title="🔄 전체 대운 타임라인">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:"0 0 12px",lineHeight:1.7}}>첫 회(현재 대운 35~44세)는 무료예요. 다른 대운은 380원씩 추가 결제로 열 수 있어요.</p>
          {DAEUN_DATA.map(function(d,i){
            var isUnlocked=!d.locked||unlockedDaeun[i];
            var isPaying=payingDaeun===i;
            return(
              <div key={i} style={{marginBottom:10}}>
                {/* 대운 카드 */}
                <div onClick={function(){if(isUnlocked)setOpenDaeun(openDaeun===i?null:i);}} style={{background:d.now?"rgba(232,200,122,0.08)":"rgba(0,0,0,0.03)",border:d.now?"1px solid rgba(232,200,122,0.35)":isUnlocked?"1px solid rgba(0,0,0,0.1)":"1px solid rgba(0,0,0,0.06)",borderRadius:12,padding:"14px",cursor:isUnlocked?"pointer":"default",filter:isUnlocked?"none":"blur(2.5px)",userSelect:"none",transition:"all 0.3s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <p style={{fontSize:12,fontWeight:700,color:d.now?"#7A5C00":"#555",margin:0}}>{d.age} — {d.sky}{d.earth}({d.skyK}{d.earthK}) 대운</p>
                    {d.now&&<span style={{fontSize:9,color:G,fontWeight:700}}>현재 ★</span>}
                    {isUnlocked&&!d.now&&<span style={{fontSize:9,color:"#2E7D32",fontWeight:700}}>열림 ✓</span>}
                  </div>
                  <p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.6}}>{d.summary}</p>
                  {/* 열린 상세 내용 */}
                  {isUnlocked&&openDaeun===i&&!d.now&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(0,0,0,0.08)"}}>
                      <div style={{marginBottom:10}}>
                        <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 5px"}}>💰 재물운</p>
                        <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.4)"}}>{d.money}</p>
                      </div>
                      <div style={{marginBottom:10}}>
                        <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 5px"}}>❤️ 인연·결혼운</p>
                        <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.4)"}}>{d.love}</p>
                      </div>
                      <div style={{marginBottom:10}}>
                        <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 5px"}}>🌿 건강운</p>
                        <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.4)"}}>{d.health||"이 대운에서 건강을 잘 관리하면 다음 대운을 더 강하게 시작할 수 있어요."}</p>
                      </div>
                      <div>
                        <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 5px"}}>💼 직업·사업운</p>
                        <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.4)"}}>{d.career}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* 잠금 오버레이 — 결제 전 */}
                {!isUnlocked&&!isPaying&&(
                  <div style={{background:"rgba(255,255,255,0.92)",borderRadius:12,padding:"14px",marginTop:-10,position:"relative",zIndex:1,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
                    <p style={{fontSize:13,fontWeight:700,color:"#333",margin:"0 0 10px"}}>🔒 {d.age} 대운 해설</p>
                    <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:"0 0 12px",lineHeight:1.6}}>재물·인연·건강·직업운 포함한<br/>10년 대운 전체 분석</p>
                    <button onClick={function(){setPayingDaeun(i);}} style={{padding:"10px 24px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:20,fontSize:13,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"'Noto Serif KR',serif"}}>380원에 열기 →</button>
                  </div>
                )}
                {/* 결제창 */}
                {isPaying&&(
                  <div style={{background:"#fff",border:"2px solid rgba(232,200,122,0.4)",borderRadius:12,padding:"18px",marginTop:-10,position:"relative",zIndex:2,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <p style={{fontSize:14,fontWeight:700,color:"#111",margin:0}}>🔒 {d.age} 대운 결제</p>
                      <button onClick={function(){setPayingDaeun(null);}} style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:"rgba(0,0,0,0.4)"}}>✕</button>
                    </div>
                    <div style={{padding:"10px 0",borderTop:"1px solid rgba(0,0,0,0.07)",borderBottom:"1px solid rgba(0,0,0,0.07)",marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:"rgba(0,0,0,0.55)"}}>결제 금액</span><span style={{fontSize:15,fontWeight:700,color:"#7A5C00"}}>380원</span></div>
                    </div>
                    {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false]].map(function(x){return(
                      <div key={x[1]} onClick={function(){setUnlockedDaeun(function(prev){var n=Object.assign({},prev);n[i]=true;return n;});setViewDaeun(i);setPayingDaeun(null);}} style={{background:x[2]?"rgba(232,200,122,0.08)":"rgba(0,0,0,0.02)",border:x[2]?"1px solid rgba(232,200,122,0.3)":"1px solid rgba(0,0,0,0.06)",borderRadius:10,padding:"10px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                        <span style={{fontSize:18}}>{x[0]}</span>
                        <p style={{fontSize:13,fontWeight:600,color:"#222",margin:0,flex:1}}>{x[1]}</p>
                        <span style={{fontSize:11,color:"#7A5C00",fontWeight:700}}>결제하고 열기</span>
                      </div>
                    );})}
                    <button onClick={function(){setPayingDaeun(null);}} style={{width:"100%",padding:"10px",background:"transparent",border:"none",fontSize:12,color:"rgba(0,0,0,0.4)",cursor:"pointer",fontFamily:"'Noto Serif KR',serif",marginTop:6}}>취소</button>
                  </div>
                )}
              </div>
            );
          })}
        </Section>

        {/* 다음 대운 예고 */}
        <Section title="🔮 다음 대운 예고 — 45~54세 병인(丙寅) 대운">
          <div style={{background:"rgba(255,255,255,0.6)",border:"1px solid rgba(0,0,0,0.08)",borderRadius:12,padding:"14px",filter:"blur(0px)"}}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
              <div style={{textAlign:"center"}}><p style={{fontSize:30,color:"#C62828",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>丙</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>병화</p></div>
              <div style={{textAlign:"center"}}><p style={{fontSize:30,color:"#7CB87B",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>寅</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>인목</p></div>
              <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 4px"}}>병인 대운 — 화 기운 폭발</p><p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.6}}>사회적 활동과 명예가 절정에 달하는 인생의 황금기가 올 거예요.</p></div>
            </div>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:10,padding:"10px 12px"}}>
              <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 5px"}}>💡 지금 이 대운에서 준비해야 할 것</p>
              {["전문성과 자기 브랜드를 지금부터 쌓으세요 — 다음 대운에서 그게 빛을 발해요","네트워크와 인간관계를 지금부터 관리하세요 — 다음 대운의 기회는 사람을 통해 와요","건강 기반을 다지세요 — 다음 대운에서 폭발적으로 활동하려면 체력이 기반이에요"].map(function(t,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 5px",paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.5)"}}>{t}</p>;})}
            </div>
          </div>
        </Section>

        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>💫 {DEMO_NAME}님의 인생은 지금이 준비 기간이에요.<br/>다음 대운에서 반드시 빛날 거예요.</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 대운 해설의 메시지</p>
        </div>

        <div style={{marginBottom:12}}><p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CROSS.map(function(cs){return(<div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}><p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p><p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p><span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span></div>);})}</div></div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}><p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #대운해설 #10년운세</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
