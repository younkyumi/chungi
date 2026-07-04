import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"올해 가장 집중하고 싶은 영역은?", icon:"🎋", multi:true, skippable:false,
   opts:["💰 재물·수입·투자","❤️ 연애·결혼·인연","💼 직장·사업·승진","📜 시험·취업·진학","🌿 건강·체력","🏠 가정·가족·이사","📋 계약·문서","🌟 전체 흐름 궁금해요"]},
  {title:"작년 한 해를 한 마디로?", icon:"💭", multi:false, skippable:false,
   opts:["😊 전반적으로 좋았어","😐 그냥 평범했어","😰 많이 힘들었어","🌪️ 변화가 너무 많았어","🌈 어려웠지만 버텼어","🚀 뭔가 도약하는 느낌이었어"]},
  {title:"올해 나에게 가장 필요한 건?", icon:"🙏", multi:false, skippable:true,
   opts:["💪 용기와 추진력","🧘 안정과 평화","💡 명확한 방향","🤝 좋은 인연","💰 돈","😴 휴식과 회복","🌟 전체 다 필요해"]},
  {title:"현재 상황은?", icon:"🌱", multi:false, skippable:false,
   opts:["📚 학생","🎓 취준생·고시생","💼 직장인","🚀 자영업·사업자","🏠 주부·육아 중","🌤️ 휴식·은퇴 중"]},
  {title:"올해 가장 두렵거나 걱정되는 건?", icon:"😰", multi:false, skippable:true,
   opts:["💸 돈이 안 들어오는 것","💔 혼자 남겨지는 것","📉 일이 안 되는 것","🏥 건강이 나빠지는 것","🌪️ 예상치 못한 변화","💭 딱히 없어요"]},
];

var MONTH_DATA = [
  {m:1,mood:"🔥",grade:"대길",brief:"강한 에너지로 출발",text:"새해 첫 달부터 강한 기운이 들어와요. 중요한 시작과 결정은 이 달에 해야 해요. 재물 기운도 이 달이 가장 강해요. 오래 미뤄온 것을 이 달에 시작하세요.",do:["중요한 시작·결정","오래 미뤄온 연락","재물 관련 긍정 행동"],dont:["큰 지출","갈등 키우기"]},
  {m:2,mood:"❤️",grade:"길",brief:"인연의 달",text:"인연의 기운이 강한 달이에요. 솔로라면 새로운 만남이, 연애 중이라면 관계가 깊어지는 계기가 생겨요. 비즈니스 파트너십도 이 달에 잘 맺어져요.",do:["중요한 만남·미팅","감사 표현·관계 회복"],dont:["혼자서만 결정","사람 피하기"]},
  {m:3,mood:"⚠️",grade:"주의",brief:"충 기운 — 신중하게",text:"충 기운이 살짝 들어오는 달이에요. 예상치 못한 변수가 생길 수 있어요. 큰 결정보다 현재를 점검하고 건강을 챙기는 데 집중하세요.",do:["현재 점검·정리","여유 있게 일정","건강 체크"],dont:["새로운 투자·계약","감정적 결정"]},
  {m:4,mood:"💰",grade:"대길",brief:"올해 최고의 달",text:"4월이 올해 중 가장 강한 기운의 달이에요. 재물과 직업 모두 좋아요. 이직·창업·투자 타이밍을 노린다면 이 달이에요. 절대 그냥 보내지 마세요.",do:["중요한 결정·실행","자신을 드러내기","재물 관련 행동"],dont:["소극적 태도","기회 미루기"]},
  {m:5,mood:"✨",grade:"길",brief:"사람을 통한 기회",text:"인연과 비즈니스 기운이 동시에 강해요. 주변 사람을 통해 뜻밖의 기회가 찾아올 수 있어요. 네트워킹에 적극적으로 투자하세요.",do:["만남·네트워킹","협업·파트너십"],dont:["고립·혼자 해결","기회 거절"]},
  {m:6,mood:"✨",grade:"길",brief:"상반기 마무리",text:"상반기를 마무리하는 달이에요. 지금까지 한 것들을 점검하고 하반기를 준비하세요. 좋은 일들이 이 달에 결실을 맺기 시작해요.",do:["상반기 점검·정리","하반기 계획","감사 표현"],dont:["새로운 일 무리 시작"]},
  {m:7,mood:"😐",grade:"보통",brief:"안정·내실의 달",text:"에너지가 잠시 안정되는 달이에요. 조용히 내실을 다지기 좋은 시기예요. 무리한 확장보다 현재 유지에 집중하세요. 건강 관리도 이 달에 특히 챙겨요.",do:["내실 다지기","휴식·충전"],dont:["무리한 확장","큰 결정"]},
  {m:8,mood:"🌊",grade:"변화",brief:"예상치 못한 변화",text:"변화의 기운이 들어오는 달이에요. 예상치 못한 소식이나 만남이 생길 수 있어요. 유연하게 받아들이면 기회가 돼요. 고집스럽게 버티면 스트레스가 돼요.",do:["유연한 자세","열린 마음으로"],dont:["변화 거부","고집"]},
  {m:9,mood:"💪",grade:"길",brief:"다시 에너지 상승",text:"하반기 두 번째 기회의 달이에요. 상반기에 시작한 것들이 다시 탄력을 받는 시기예요. 포기했던 것들에 다시 도전해보세요.",do:["재도전·재시작","적극적 행동"],dont:["포기·지레 포기"]},
  {m:10,mood:"💰",grade:"대길",brief:"하반기 최고의 달",text:"하반기에서 가장 강한 기운의 달이에요. 재물이 들어오는 타이밍이에요. 지출보다 수입에 집중하세요. 들어오는 돈을 잘 지키는 게 이 달의 핵심이에요.",do:["재물 관련 행동","중요한 계약"],dont:["충동 지출","투기성 투자"]},
  {m:11,mood:"🌙",grade:"보통",brief:"마무리 준비",text:"올해를 마무리하고 내년을 설계하는 달이에요. 감사한 것들을 돌아보고 내년 계획을 구체적으로 세우세요.",do:["올해 정리","내년 계획","감사 표현"],dont:["새로운 일 시작","피로 방치"]},
  {m:12,mood:"🎉",grade:"길",brief:"결실 확인",text:"올해의 결실을 확인하는 달이에요. 한 해 동안 노력한 것들이 눈에 보이기 시작해요. 새해를 기대하며 차분하게 마무리하세요.",do:["결실 확인·감사","새해 준비"],dont:["무리한 마무리"]},
];

var CROSS = [
  {emoji:"☯️",title:"사주 풀이",desc:"내 사주 전체 완전 분석",price:"980원"},
  {emoji:"🌙",title:"월별 운세",desc:"이번 달 디테일 사주 분석",price:"첫회무료"},
  {emoji:"📜",title:"토정비결",desc:"500년 전통 작괘법 올해 운세",price:"1,980원"},
  {emoji:"🌅",title:"연도별 운세",desc:"특정 연도 완전 분석",price:"980원"},
];

var LOADING_MSGS = [
  "올해 천간지지 배열 중... 🎋","1~12월 흐름 계산 중... 📅",
  "도깨비가 올해 달력 전부 훔쳐보는 중... 🪄","용왕님이 12개월치 재물 보따리 정리 중... 💰",
  "저승사자가 2026년 운명책 펼치는 중... 📖"
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

export default function SinnyeonPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [openMonth,setOpenMonth]=useState(null);
  var [openMonth,setOpenMonth]=useState(null);
  var ivRef=useRef(null);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*2.5+1);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},500);}
    },200);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||""; var q4=answers[3]||""; var q5=answers[4]||"";

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🎋 신년 운세</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>올해 1~12월, 월별로 꼼꼼하게 풀어드려요</p></div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(232,200,122,0.18)",color:G,border:"1px solid rgba(232,200,122,0.4)",fontWeight:700}}>풀코스</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>🎋 2026년 1월~12월 월별 완전 분석</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
            {["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"].map(function(m,i){
              var isG=[0,1,3,4,5,8,9,11].includes(i);
              var isB=[2,6].includes(i);
              return(
                <div key={m} style={{background:isG?"rgba(232,200,122,0.12)":isB?"rgba(198,40,40,0.08)":"rgba(255,255,255,0.04)",border:"1px solid "+(isG?"rgba(232,200,122,0.35)":isB?"rgba(198,40,40,0.25)":"rgba(255,255,255,0.08)"),borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                  <p style={{fontSize:10,color:isG?G:isB?"#FF7675":"rgba(255,255,255,0.45)",margin:"0 0 2px",fontWeight:isG||isB?700:400}}>{m}</p>
                  <p style={{fontSize:8,color:isG?"rgba(232,200,122,0.7)":isB?"rgba(255,118,117,0.7)":"rgba(255,255,255,0.2)",margin:0}}>{isG?"길":isB?"주의":"보통"}</p>
                </div>
              );
            })}
          </div>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.65,margin:0}}>각 달을 탭하면 해야 할 것·주의할 것·특별 포인트까지 자세하게 풀어드려요.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 신년 운세에서 알 수 있는 것</p>
          {[["🎋","1~12월 월별 운세","각 달의 에너지, 해야 할 것, 주의할 것"],["💰","돈이 들어오는 달","올해 재물 기운이 가장 강한 달"],["❤️","인연 타이밍","올해 좋은 만남이 오는 시기"],["💼","직업·승진 타이밍","이직·창업·시험에 가장 좋은 달"],["⚡","특히 조심할 달","사고·손재·갈등이 생길 수 있는 달"],["🌿","월별 건강 포인트","각 달 특히 챙겨야 할 건강 포인트"],["🎁","2026년 개운법","올해 운을 극대화하는 구체적 방법"],["💎","5개 사전질문 맞춤 분석","1,980원치 퀄리티"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{f[1]}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>1,980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>1~12월 풀코스 · 사전질문 5개 맞춤 · 개운법 포함</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>🎋 누구의 신년 운세를 볼까요?</h3>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여 · 오시생</p></div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
    </div>
  );

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
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 하나만 고를수록 더 깊게 · 여러 개 선택하면 전체 흐름</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 다음 →</button>}
          </div>
        </div>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 10px"}}>✦ 입력하신 내용이 맞나요?</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 5px",lineHeight:1.6}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>상품 가격</span><span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>1,980원</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>1,980원</span></div></div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 (1,980원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>🎋</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 2026년 12개월 분석 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{LOADING_MSGS[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  if(step==="result") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 신년 운세</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🎋 2026년 신년 운세</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>1~12월 완전 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 4px"}}>올해 집중 영역: {q1.split(",")[0]}</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>💭 작년: {q2}</p>}
          {q3&&<p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:"2px 0"}}>🌱 현재: {q3}</p>}
        </div>}

        {/* 2026년 총운 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🎋 2026년 총운</p>
          <div style={{background:"rgba(232,200,122,0.06)",border:"2px solid rgba(232,200,122,0.35)",borderRadius:12,padding:"14px",marginBottom:14,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:8}}>
              <div><p style={{fontSize:30,color:"#C62828",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>丙</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>병화 (천간)</p></div>
              <div><p style={{fontSize:30,color:"#7CB87B",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>午</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>오화 (지지)</p></div>
            </div>
            <p style={{fontSize:11,color:"#7A5C00",fontWeight:700,margin:0}}>병오년 — 불꽃처럼 강한 화 기운의 해</p>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>
            {DEMO_NAME}님, 2026년을 솔직하게 말씀드릴게요. 병오년은 화 기운이 폭발하는 해예요. 적극적으로 나서는 사람에게 기회가 집중되는 해예요. {DEMO_NAME}님 사주와 이 해의 기운이 꽤 잘 맞아요.
          </p>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:0,wordBreak:"keep-all"}}>
            특히 상반기(1~6월)에 중요한 기회가 몰려있어요. 작년에 힘드셨다면 올해는 그 힘든 시간의 보상이 시작되는 해예요. {q2&&q2.includes("힘")?"지금 힘드셨던 거 알아요. 근데 그 힘든 시간이 올해 더 크게 올라가기 위한 압력을 쌓고 있었던 거예요. 올해 반드시 달라집니다.":"망설임보다 실행이 올해의 키워드예요."}
          </p>
        </div>

        {/* 1~12월 월별 — 탭 클릭시 상세 펼쳐짐 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 6px"}}>📅 1~12월 월별 운세</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 14px"}}>각 달을 탭하면 더 자세한 내용을 확인해요</p>
          {[{m:1,mood:"🔥",luck:"대길",good:true,
              short:"새해 첫 달부터 강한 에너지. 새로운 시작에 최적이에요.",
              detail:{money:"새로운 수입원을 탐색하기 좋은 달이에요. 과감하게 제안하거나 연락하세요.",love:"솔로라면 소개팅에 나가보세요. 첫 만남의 기운이 강한 달이에요.",career:"새 프로젝트 시작, 이직 시도 모두 좋아요. 적극적으로 자신을 드러내세요.",health:"겨울 끝 환절기라 면역 관리가 중요해요. 규칙적인 식사 챙기세요.",lucky_day:"1/8, 1/14, 1/19"}},
            {m:2,mood:"❤️",luck:"길",good:true,
              short:"인연의 기운이 강한 달. 좋은 만남이 생길 수 있어요.",
              detail:{money:"수입보다 지출 관리에 집중하는 달이에요. 불필요한 소비를 줄이세요.",love:"가장 인연 기운이 강한 달이에요. 고백이나 새로운 만남 모두 좋아요.",career:"팀워크와 협업에서 좋은 결과가 나오는 달이에요.",health:"심장 건강에 주의하세요. 무리한 운동보다 꾸준한 걷기가 좋아요.",lucky_day:"2/4, 2/11, 2/22"}},
            {m:3,mood:"⚠️",luck:"주의",good:false,
              short:"충 기운이 살짝 들어오는 달. 큰 결정은 피하세요.",
              detail:{money:"큰 투자나 계약은 이 달을 피하는 게 좋아요. 현상 유지가 최선이에요.",love:"오해가 생기기 쉬운 달이에요. 감정적인 말보다 차분한 대화를 하세요.",career:"새로운 것보다 기존 업무를 완성하는 데 집중하세요.",health:"환절기라 건강 관리가 가장 중요한 달이에요. 몸이 보내는 신호를 무시하지 마세요.",lucky_day:"3/7, 3/15 (이날은 피하기: 3/3, 3/13)"}},
            {m:4,mood:"💰",luck:"대길",good:true,
              short:"올해 최고의 달! 재물과 직업운 모두 폭발하는 시기예요.",
              detail:{money:"올해 재물운이 가장 강한 달이에요. 중요한 재무 결정, 투자, 계약을 이 달에 하세요.",love:"인연과 재물이 동시에 좋은 달이에요. 적극적으로 행동하세요.",career:"이직, 승진, 새 사업 모두 4월이 올해 최적의 타이밍이에요.",health:"기운이 강하지만 과로에 주의하세요. 에너지를 잘 분배하세요.",lucky_day:"4/3, 4/8, 4/14, 4/19"}},
            {m:5,mood:"💼",luck:"길",good:true,
              short:"직업운이 강한 달. 커리어 관련 중요한 행동을 하세요.",
              detail:{money:"수입이 꾸준히 들어오는 달이에요. 저축하기 좋은 시기예요.",love:"안정적인 달이에요. 연애 중이라면 깊어지는 계기가 생겨요.",career:"중요한 프레젠테이션, 면접, 제안서 제출에 좋은 달이에요.",health:"운동을 시작하기 좋은 달이에요. 꾸준한 루틴을 만들어보세요.",lucky_day:"5/5, 5/12, 5/20"}},
            {m:6,mood:"✨",luck:"길",good:true,
              short:"상반기 마무리. 시작한 것들이 결실을 맺기 시작해요.",
              detail:{money:"상반기 재물 결산의 달이에요. 들어온 것을 잘 정리하세요.",love:"관계가 한 단계 깊어지는 계기가 생겨요.",career:"상반기 성과를 정리하고 하반기 계획을 세우세요.",health:"여름 시작, 수분 보충이 중요해요. 냉방병에도 주의하세요.",lucky_day:"6/6, 6/15, 6/22"}},
            {m:7,mood:"😐",luck:"보통",good:false,
              short:"에너지가 잠시 안정되는 달. 내실 다지기에 집중하세요.",
              detail:{money:"큰 지출이나 투자보다 현상 유지가 맞는 달이에요.",love:"관계에서 답답함을 느낄 수 있어요. 상대방에게 여유를 주세요.",career:"새로운 도전보다 현재 업무를 완성하는 데 집중하세요.",health:"무더위에 과로하지 마세요. 수면과 휴식이 가장 중요한 달이에요.",lucky_day:"7/7, 7/14, 7/21"}},
            {m:8,mood:"🌊",luck:"변화",good:true,
              short:"변화의 기운이 들어오는 달. 유연하게 받아들이세요.",
              detail:{money:"예상치 못한 수입이나 지출이 생길 수 있어요. 비상금을 준비해두세요.",love:"솔로라면 의외의 곳에서 인연이 생길 수 있어요.",career:"새로운 기회나 제안이 들어올 수 있어요. 열린 마음으로 받아들이세요.",health:"면역력 관리에 집중하세요. 수분 보충과 규칙적인 수면이 중요해요.",lucky_day:"8/8, 8/15, 8/22"}},
            {m:9,mood:"💪",luck:"길",good:true,
              short:"다시 에너지가 올라오는 달. 하반기 두 번째 기회예요.",
              detail:{money:"하반기 재물 흐름이 다시 좋아지는 달이에요. 적극적으로 움직이세요.",love:"인연의 기운이 다시 강해져요. 9월 중순이 특히 좋아요.",career:"포기했던 것들에 다시 도전해보세요. 하반기 새 기회가 와요.",health:"가을 환절기 면역 관리가 중요해요. 옷을 잘 챙겨 입으세요.",lucky_day:"9/9, 9/15, 9/24"}},
            {m:10,mood:"💰",luck:"대길",good:true,
              short:"하반기 최고의 달! 재물운이 다시 강하게 들어와요.",
              detail:{money:"하반기 재물운 최고의 달이에요. 이 달 들어오는 돈은 잘 지키세요.",love:"연애운도 좋은 달이에요. 중요한 데이트나 고백에 좋아요.",career:"승진, 이직, 계약에 좋은 달이에요. 10월 중순에 행동하세요.",health:"건강이 가장 안정적인 달이에요. 이 기운을 유지하는 루틴을 만드세요.",lucky_day:"10/8, 10/14, 10/22"}},
            {m:11,mood:"🌙",luck:"보통",good:false,
              short:"올해를 마무리하는 달. 정리와 감사의 시간이에요.",
              detail:{money:"올해 재물을 정산하는 달이에요. 내년 계획을 세우기 시작하세요.",love:"관계를 돌아보는 달이에요. 감사 표현을 잊지 마세요.",career:"올해 성과를 정리하고 내년을 준비하는 달이에요.",health:"연말 과음·과식에 주의하세요. 건강 관리의 끈을 놓지 마세요.",lucky_day:"11/7, 11/15, 11/22"}},
            {m:12,mood:"🎉",luck:"길",good:true,
              short:"올해의 결실을 확인하는 달. 마무리와 새 시작의 교차점이에요.",
              detail:{money:"올해 목표한 재물을 확인하고 내년 계획을 확정하세요.",love:"연말에 소중한 사람과의 시간이 관계를 더 깊게 만들어요.",career:"올해의 성과를 정리하고 내년 비전을 세우는 달이에요.",health:"연말 무리한 스케줄에 주의하세요. 건강하게 새해를 맞이하세요.",lucky_day:"12/7, 12/14, 12/22"},},
          ].map(function(r){
            var isOpen=openMonth===r.m;
            var isGoodMonth=r.good;
            return(
              <div key={r.m} style={{marginBottom:8,border:"1px solid "+(isGoodMonth?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.12)"),borderRadius:12,overflow:"hidden"}}>
                <button onClick={function(){setOpenMonth(isOpen?null:r.m);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:isGoodMonth?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:isGoodMonth?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:isGoodMonth?"#2E7D32":"#C62828"}}>{r.m}월</span>
                  </div>
                  <span style={{fontSize:16,flexShrink:0}}>{r.mood}</span>
                  <div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:isGoodMonth?"#2E7D32":"#C62828",margin:"0 0 2px"}}>{r.luck}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.4}}>{r.short}</p></div>
                  <span style={{fontSize:14,color:"rgba(0,0,0,0.3)",transform:isOpen?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>▾</span>
                </button>
                {isOpen&&<div style={{padding:"14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                  {[["💰","재물",r.detail.money],["❤️","연애",r.detail.love],["🌿","건강",r.detail.health],["💼","직업",r.detail.career]].map(function(d,i){return(
                    <div key={i} style={{marginBottom:12}}>
                      <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 4px"}}>{d[0]} {d[1]}</p>
                      <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:10,borderLeft:"2px solid rgba(232,200,122,0.4)"}}>{d[2]}</p>
                    </div>
                  );})}
                  <div style={{background:"rgba(232,200,122,0.06)",borderRadius:8,padding:"8px 12px"}}>
                    <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 3px"}}>📅 {r.m}월 길일</p>
                    <p style={{fontSize:11,color:"#333",margin:0}}>{r.detail.lucky_day}</p>
                  </div>
                </div>}
              </div>
            );
          })}
        </div>

        {/* 올해 개운법 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>🎁 2026년 {DEMO_NAME}님 개운법</p>
          {["초록색·파란색 계열 지갑이나 소품이 올해 재물운을 높여요 — 용신 수 기운을 보충해줘요",
            "목요일이 올해 {DEMO_NAME}님의 행운 요일이에요 — 중요한 결정과 연락은 목요일에 하세요",
            "동쪽·북동쪽 방향의 활동이 기운을 살려요 — 이 방향의 사람이나 기회를 주목하세요",
            "행운 숫자 3, 8, 12 — 중요한 날짜나 번호 선택 시 활용해보세요",
            "물 가까운 곳에서의 활동 — 한강, 바다, 수영장 등 수 기운을 보충하면 기운이 살아나요",
            "매일 아침 물 한 잔 먼저 마시기 — 이 사주에 가장 간단하고 강력한 개운 습관이에요"
          ].map(function(g,i){return(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
              <span style={{fontSize:16,flexShrink:0}}>✨</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g.replace("{DEMO_NAME}",DEMO_NAME)}</p>
            </div>
          );})}
        </div>

        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>💫 {DEMO_NAME}님, 2026년은 생각만 하던 것들을 행동으로 옮길 해예요.<br/>두려움보다 가능성을 먼저 보세요.</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 신년 운세의 메시지</p>
        </div>

        <div style={{marginBottom:12}}><p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CROSS.map(function(cs){return(<div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}><p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p><p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p><span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span></div>);})}</div></div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}><p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #신년운세 #2026운세</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:"white",padding:20}}>로딩 중...</div>;
}
