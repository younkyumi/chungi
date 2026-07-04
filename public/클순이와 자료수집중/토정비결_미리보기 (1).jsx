import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

// 64괘 중 주요 괘 데이터
var GWAE_DATA = {
  "곤위지": {
    hanja:"坤爲地",num:8,
    title:"곤위지 (坤爲地) — 대지의 기운",
    subtitle:"땅처럼 묵묵히 모든 것을 품고 길러내는 해",
    meaning:"곤(坤)은 땅이에요. 대지는 씨앗을 품고, 비를 맞고, 바람을 견디면서 조용히 만물을 키워내요. 화려하게 드러나지 않지만 가장 근본이 되는 기운이에요. 올해 "+DEMO_NAME+"님은 이 대지의 기운 아래에 있어요.",
    overall:"올해는 빠른 성과보다 내실을 쌓는 해예요. 급하게 결과를 내려 하기보다 묵묵히 자신의 자리를 지키는 것이 이 괘의 핵심이에요. 겉으로 느리게 가는 것 같아도 내부에서 단단하게 뿌리를 내리고 있어요.",
    caution:"조급함이 이 괘의 가장 큰 적이에요. 남들보다 느리다고 느껴질 수 있어요. 하지만 곤위지 괘가 나온 해에 조급하게 움직이면 오히려 역효과가 나요.",
    lucky_month:[1,4,8,10],bad_month:[3,7],
    months:[
      {m:1,grade:"대길",text:"새해 첫 달부터 강한 기운이에요. 무언가를 처음 시작하기에 가장 좋은 달이에요. 중요한 결정은 이 달에 하세요."},
      {m:2,grade:"중길",text:"인연의 기운이 강해요. 좋은 사람과의 만남이나 협업이 잘 이루어지는 달이에요."},
      {m:3,grade:"주의",text:"이 달은 특별히 조심해야 해요. 건강과 재물 모두 주의가 필요해요. 큰 결정은 다음 달로 미루세요."},
      {m:4,grade:"대길",text:"올해 최고의 달이에요! 이 달을 절대 그냥 보내지 마세요. 중요한 일은 모두 이 달에 실행하세요."},
      {m:5,grade:"중길",text:"직업과 사업 쪽에서 좋은 소식이 올 수 있어요. 자신을 적극적으로 드러내보세요."},
      {m:6,grade:"중길",text:"안정적으로 나아가는 달이에요. 지금까지 한 것들을 점검하고 하반기를 준비하세요."},
      {m:7,grade:"주의",text:"충 기운이 들어오는 달이에요. 건강 관리와 이동 시 주의가 필요해요. 무리하지 마세요."},
      {m:8,grade:"대길",text:"재물이 들어오는 달이에요. 이 달에 들어오는 돈은 잘 지키세요. 지출보다 저축에 집중하세요."},
      {m:9,grade:"중길",text:"인간관계가 활발해지는 달이에요. 사람을 통해 좋은 기회가 올 수 있어요."},
      {m:10,grade:"대길",text:"하반기 최고의 달이에요. 직업과 재물 모두 좋아요. 올해 두 번째 대길월이에요."},
      {m:11,grade:"중길",text:"올해를 마무리하고 내년을 계획하는 달이에요. 감사한 것들을 돌아보세요."},
      {m:12,grade:"중길",text:"마무리의 달이에요. 올해의 결실을 확인하고 내년을 기대하며 마무리하세요."},
    ]
  }
};

var QUESTIONS = [
  {title:"올해 가장 중요한 것은?", icon:"📜", multi:true, skippable:false,
   opts:["💰 재물·수입·투자","❤️ 인연·결혼·연애","💼 사업·직장·승진","📜 시험·합격·관운·취업","🌿 건강·수명","🏠 가정·이사·부동산","🎓 학업·진학","🌟 전체 다 궁금해요!"]},
  {title:"현재 나이대는?", icon:"🎂", multi:false, skippable:false,
   opts:["10대","20대","30대","40대","50대","60대","70대 이상"]},
  {title:"현재 상황은?", icon:"🌱", multi:false, skippable:false,
   opts:["📚 학생","🎓 취준생·고시생","💼 직장인","🚀 자영업·사업자","🏠 주부·육아 중","🌤️ 휴식·은퇴 중"]},
  {title:"작년과 비교해서 지금 삶은?", icon:"💭", multi:false, skippable:false,
   opts:["📈 좋아진 것 같아","📉 나빠진 것 같아","😐 변화 없어","🌪️ 변화는 많은데 방향을 모르겠어","🌈 고비 넘기고 회복 중이야"]},
];

var CROSS = [
  {emoji:"☯️",title:"사주 풀이",desc:"내 사주 전체 완전 분석",price:"980원"},
  {emoji:"🎋",title:"신년 운세",desc:"1~12월 월별 꼼꼼 분석",price:"1,980원"},
  {emoji:"🌅",title:"연도별 운세",desc:"특정 연도 완전 분석",price:"980원"},
  {emoji:"🔄",title:"대운 해설",desc:"10년 큰 그림 보기",price:"첫회무료"},
];

var LOADING_MSGS = [
  "생년월일로 작괘 계산 중... 📜","64괘 중 해당 괘 도출 중... ☯️",
  "이토정 선생님께 허락 구하는 중... 🙏","500년 전통 해석법 적용 중... 🎋",
  "도깨비가 옛날 책 먼지 털어내는 중... 🪄","1~12월 길흉 분석 중... 📅"
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

export default function TojungPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [openMonth2,setOpenMonth2]=useState(null);
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

  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||""; var q4=answers[3]||"";
  var gwae=GWAE_DATA["곤위지"];

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>📜 토정비결</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>500년 전통 작괘법, 올해 운세</p></div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(232,200,122,0.18)",color:G,border:"1px solid rgba(232,200,122,0.4)",fontWeight:700}}>풀코스</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        {/* 작괘법 설명 + 미리보기 */}
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>📜 이토정 선생의 500년 전통 작괘법</p>
          <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:12,padding:"16px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>작괘 과정</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {["생년수","생월수","생일수","×","시수"].map(function(t,i){return(
                <span key={i} style={{fontSize:11,padding:"4px 8px",background:"rgba(232,200,122,0.1)",borderRadius:6,color:G}}>{t}</span>
              );})}
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>→ 64괘 중 나만의 괘 도출</p>
            <div style={{display:"flex",justifyContent:"center",gap:12}}>
              <div style={{textAlign:"center"}}><p style={{fontSize:28,fontWeight:900,color:"#7A5C00",margin:"0 0 2px",fontFamily:"serif"}}>坤</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>지지</p></div>
              <div style={{textAlign:"center"}}><p style={{fontSize:28,fontWeight:900,color:"#C4922A",margin:"0 0 2px",fontFamily:"serif"}}>爲</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}></p></div>
              <div style={{textAlign:"center"}}><p style={{fontSize:28,fontWeight:900,color:"#7CB87B",margin:"0 0 2px",fontFamily:"serif"}}>地</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>지지</p></div>
            </div>
          </div>
          {/* 토정비결 원리 설명 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <p style={{fontSize:10,color:G,fontWeight:700,margin:"0 0 6px"}}>📖 토정비결이란?</p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.75,margin:0}}>조선 중기 학자 이지함(이토정, 1517~1578) 선생이 창안한 한국 전통 운세 예언서예요. 생년·월·일의 수를 합산해 64괘 중 하나를 도출하고, 각 괘에 담긴 가르침으로 그 해의 운세를 풀어내요. 약 500년간 정월이면 모든 조선인이 토정비결을 봤을 정도로 깊은 역사를 가지고 있어요.</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:10,color:G,fontWeight:700,margin:"0 0 6px"}}>🔢 64괘 구성</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {["건위천 ☰","곤위지 ☷","수뢰준 ☵","산수몽 ☶","수천수 ☵","천수송 ☰","지수사 ☷","수지비 ☵"].map(function(g){return(
                <div key={g} style={{background:"rgba(232,200,122,0.06)",borderRadius:6,padding:"5px 4px",textAlign:"center"}}>
                  <p style={{fontSize:9,color:"rgba(255,255,255,0.45)",margin:0,lineHeight:1.4}}>{g}</p>
                </div>
              );})}
            </div>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.3)",margin:"6px 0 0",textAlign:"center"}}>외 56괘 — 생년월일로 나만의 괘 도출</p>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 토정비결에서 알 수 있는 것</p>
          {[["📜","나만의 괘 + 현대 해석","64괘 중 내 괘를 찾아 오늘날 언어로 풀이"],["🌟","올해 총운 핵심 메시지","토정비결이 전하는 올해의 핵심"],["📅","1~12월 월별 길흉","각 달의 대길·중길·주의 판단과 이유"],["💰","재물운 상세 풀이","올해 돈이 들어오고 나가는 시기"],["❤️","인연·결혼 기운","올해 인연의 흐름과 최적 시기"],["🌿","건강 주의사항","괘에 담긴 건강 경고와 관리법"],["📖","괘 원문 + 해석","500년 전 원문과 현대적 의미"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{f[1]}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>1,980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>전통 작괘 + 1~12월 풀코스 + 사전질문 4개 맞춤</p>
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
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>📜 누구의 토정비결을 볼까요?</h3>
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
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 하나만 고를수록 더 깊게 분석해드려요</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
        </div>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 10px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 5px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
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
        <div style={{fontSize:50,marginBottom:14}}>📜</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 2026년 토정비결 작괘 중...</p>
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
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 토정비결</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 📜 2026년 토정비결</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>500년 전통 작괘법 + 현대 맞춤 해석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{DEMO_NAME}님 · {q2||"30대"} · {q3||"직장인"}</p>
          {q1&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>🎯 집중 영역: {q1.split(",")[0]}</p>}
        </div>}

        {/* 작괘법 원리 설명 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>📜 토정비결이란? — 500년 전통 작괘법</p>
          <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:12,padding:"14px",marginBottom:12}}>
            <p style={{fontSize:12,color:"#333",lineHeight:1.9,margin:0}}>
              토정비결(土亭秘訣)은 조선 중기 이지함(李之菡, 1517~1578) 선생이 만든 한 해 운세 예측서예요. 생년월일을 기반으로 태세수(年數), 월건수(月數), 일진수(日數)를 계산해 64괘 중 하나를 도출하고, 각 괘에 담긴 의미로 한 해의 흐름을 예측해요.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["📅","태세수","출생 연도로 계산"],["🌙","월건수","출생 월로 계산"],["☀️","일진수","출생 일로 계산"]].map(function(x){return(
              <div key={x[1]} style={{background:"#F9F7F2",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <p style={{fontSize:18,margin:"0 0 4px"}}>{x[0]}</p>
                <p style={{fontSize:10,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{x[1]}</p>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:0}}>{x[2]}</p>
              </div>
            );})}
          </div>
          <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0}}>세 숫자를 합산하면 1~144 사이의 수가 나오고, 이것이 64괘로 치환돼요. 단순한 운세가 아니라 500년간 수천만 명의 데이터가 담긴 통계적 지혜예요.</p>
        </div>

        {/* 나의 괘 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>📜 {DEMO_NAME}님의 2026년 괘</p>
          <div style={{background:"rgba(232,200,122,0.06)",border:"2px solid rgba(232,200,122,0.4)",borderRadius:14,padding:"20px",marginBottom:14,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:12}}>
              <div style={{display:"grid",gridTemplateRows:"repeat(6,10px)",gap:4}}>
                {[true,false,true,false,true,true].map(function(s,i){return <div key={i} style={{width:30,height:6,background:s?"#7A5C00":"transparent",borderTop:s?"none":"2px solid #7A5C00",borderBottom:s?"none":"2px solid #7A5C00",position:"relative"}}/> ;})}
              </div>
            </div>
            <p style={{fontSize:32,fontWeight:900,color:"#7A5C00",margin:"0 0 6px",fontFamily:"serif"}}>坤為地</p>
            <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 4px"}}>곤위지 (坤爲地) — 제8괘</p>
            <p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.7}}>대지처럼 모든 것을 받아들이고 꾸준히 나아가는 해</p>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>
            {DEMO_NAME}님의 올해 괘를 보는 순간 확신이 왔어요. 곤위지 괘는 땅의 기운이에요. 화려하게 드러나지 않지만 모든 생명을 키워내는 대지처럼, 올해는 {DEMO_NAME}님이 조용히 기반을 다지는 해예요.
          </p>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>
            이 괘가 나오면 서두르지 말라는 뜻이에요. 지금 당장 결과가 안 보여도 초조해하지 마세요. 땅은 겉으로 움직이지 않아 보여도 그 안에서 모든 것을 키우고 있어요. {DEMO_NAME}님의 올해가 바로 그래요.
          </p>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 14px",wordBreak:"keep-all"}}>
            {q4&&q4.includes("나빠")?"작년에 힘드셨던 거, 이 괘가 설명해줘요. 그건 나쁜 게 아니라 이 괘의 준비 기간이었어요. 곤위지 괘는 반드시 결실을 맺어요.":q4&&q4.includes("변화")?"변화가 많으셨군요. 곤위지 괘는 그 변화를 흡수하고 안정시키는 힘이 있어요. 올해는 그 변화들이 좋은 방향으로 자리를 잡아요.":"올해 이 괘를 가진 사람은 겸손하게 내실을 다지면 반드시 좋은 결과가 나와요."}
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[["💰","재물운","72점"],["❤️","인연운","68점"],["💼","직업운","81점"]].map(function(x){return(
              <div key={x[0]} style={{background:"#F9F7F2",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <p style={{fontSize:16,margin:"0 0 4px"}}>{x[0]}</p>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[1]}</p>
                <p style={{fontSize:13,fontWeight:700,color:"#7A5C00",margin:0}}>{x[2]}</p>
              </div>
            );})}
          </div>
        </div>

        {/* 1~12월 월별 길흉 — 탭 클릭 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 6px"}}>📅 1~12월 월별 길흉</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 14px"}}>각 달을 탭하면 상세 내용을 확인해요</p>
          {[{m:1,luck:"🟢",grade:"대길",text:"새해 첫 달, 강한 기운으로 시작. 새로운 일을 시작하거나 중요한 연락을 하기 좋아요.",detail:"재물: 새로운 수입원 탐색에 좋아요. 연애: 새해 소개팅 나가보세요. 직업: 새 프로젝트 시작 최적. 주의: 첫 달 무리하면 연중 체력 소진."},
            {m:2,luck:"🟡",grade:"중길",text:"인연의 기운이 강해요. 오래된 인연이 다시 연결될 수 있어요.",detail:"재물: 수입보다 지출 관리에 집중. 연애: 가장 인연 기운 강한 달. 직업: 팀워크에서 좋은 결과. 주의: 충동적 결정 금물."},
            {m:3,luck:"🔴",grade:"주의",text:"이 달은 특히 건강과 재물에 조심하세요. 큰 결정은 다음 달로 미루세요.",detail:"재물: 투자·계약 절대 금지. 연애: 감정 충돌 주의, 말 조심. 직업: 기존 업무 완성에 집중. 건강: 환절기 면역 관리 최우선."},
            {m:4,luck:"🟢",grade:"대길",text:"올해 최고의 달이에요. 이 달을 절대 그냥 보내지 마세요.",detail:"재물: 올해 재물 기운 최고 달. 중요한 재무 결정 모두 4월에. 연애: 고백, 소개팅 4월이 최적. 직업: 이직·승진 시도 최적."},
            {m:5,luck:"🟡",grade:"중길",text:"직업과 사업 관련 좋은 소식이 올 수 있어요.",detail:"재물: 꾸준한 수입 기대. 연애: 안정적인 관계 유지. 직업: 중요한 프레젠테이션·제안서에 좋아요. 주의: 과로 주의."},
            {m:6,luck:"🟡",grade:"중길",text:"안정적으로 나아가는 달이에요. 지금까지 한 것들을 점검할 시기예요.",detail:"재물: 상반기 결산. 연애: 관계 한 단계 깊어지는 계기. 직업: 상반기 성과 정리, 하반기 계획. 건강: 여름 대비 면역 강화."},
            {m:7,luck:"🔴",grade:"주의",text:"충 기운이 들어오는 달. 여행이나 큰 이동은 삼가세요.",detail:"재물: 큰 지출·투자 보류. 연애: 오해 발생 주의. 이 달엔 솔직한 대화보다 여유 주기. 건강: 무더위 과로 절대 금지."},
            {m:8,luck:"🟢",grade:"대길",text:"재물이 들어오는 달이에요. 이 달에 들어오는 돈은 잘 지키세요.",detail:"재물: 예상치 못한 수입 기대. 투자보다 저축. 연애: 의외의 곳에서 인연 가능. 직업: 새로운 제안에 열린 마음."},
            {m:9,luck:"🟡",grade:"중길",text:"인간관계가 활발해지는 달이에요. 사람을 통해 기회가 와요.",detail:"재물: 하반기 재물 회복 시작. 연애: 9월 중순 인연 기운 강함. 직업: 네트워킹이 기회를 만드는 달. 건강: 가을 환절기 면역 관리."},
            {m:10,luck:"🟢",grade:"대길",text:"하반기 최고의 달이에요. 직업과 재물 모두 좋아요.",detail:"재물: 하반기 재물 기운 최고 달. 연애: 중요한 데이트·고백에 좋은 달. 직업: 승진·이직·계약 10월 중순에 행동. 건강: 가장 안정적인 건강 유지."},
            {m:11,luck:"🟡",grade:"중길",text:"올해를 마무리할 준비를 하는 달이에요.",detail:"재물: 올해 재물 정산, 내년 계획 시작. 연애: 감사 표현이 관계를 더 깊게. 직업: 올해 성과 정리, 내년 비전 수립. 건강: 연말 음주·과식 주의."},
            {m:12,luck:"🟡",grade:"중길",text:"마무리의 달이에요. 새해를 기대하며 차분하게 마무리하세요.",detail:"재물: 올해 결실 확인. 내년 계획 확정. 연애: 연말 소중한 사람과 시간을 보내세요. 직업: 마무리와 새 시작 준비. 건강: 건강하게 새해 맞이 준비."},
          ].map(function(r){
            var isOpen=openMonth2===r.m;
            var isGoodMonth=r.grade!=="주의";
            return(
              <div key={r.m} style={{marginBottom:8,border:"1px solid "+(isGoodMonth?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.12)"),borderRadius:12,overflow:"hidden"}}>
                <button onClick={function(){setOpenMonth2(isOpen?null:r.m);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:isGoodMonth?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:isGoodMonth?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,fontWeight:700,color:isGoodMonth?"#2E7D32":"#C62828"}}>{r.m}월</span></div>
                  <span style={{fontSize:16,flexShrink:0}}>{r.luck}</span>
                  <div style={{flex:1}}><p style={{fontSize:11,fontWeight:700,color:isGoodMonth?"#2E7D32":"#C62828",margin:"0 0 2px"}}>{r.grade}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.4}}>{r.text}</p></div>
                  <span style={{fontSize:13,color:"rgba(0,0,0,0.3)",transform:isOpen?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}>▾</span>
                </button>
                {isOpen&&<div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                  <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{r.detail}</p>
                </div>}
              </div>
            );
          })}
        </div>

        {/* 핵심 조언 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>✦ 올해 {DEMO_NAME}님 핵심 조언</p>
          {[["💰","재물","큰 투자보다 꾸준한 저축이 올해 재물을 지키는 방법이에요. 4월과 8월, 10월에 들어오는 재물을 잘 지키세요. 특히 4월 재물 기운을 놓치지 마세요."],
            ["❤️","인연","올해 인연운은 나쁘지 않아요. 2월과 9월에 좋은 만남의 기회가 생겨요. 먼저 다가가는 사람에게 기회가 와요. 소극적으로 있으면 인연이 그냥 지나가요."],
            ["💼","직업·사업","4월과 10월이 올해 직업운이 가장 강한 달이에요. 이 시기에 중요한 결정을 내리거나 자신을 적극적으로 드러내세요. 곤위지 괘는 자기 자신을 드러내는 사람에게 기회가 와요."],
            ["🌿","건강","3월과 7월에 건강에 특히 신경 쓰세요. 무리한 음주나 과로는 이 달들에 조심해야 해요. 소화기 계통이 이 괘에서 가장 취약한 부위예요."],
          ].map(function(r){return(
            <div key={r[0]} style={{marginBottom:16}}>
              <p style={{fontSize:12,fontWeight:700,color:"#111",margin:"0 0 6px"}}>{r[0]} {r[1]}</p>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0,paddingLeft:12,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>{r[2]}</p>
            </div>
          );})}
        </div>

        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>💫 {DEMO_NAME}님, 땅처럼 묵묵히 나아가는 사람이 결국 가장 멀리 가요.<br/>올해 이 괘가 {DEMO_NAME}님을 지키고 있어요.</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 토정비결의 메시지</p>
        </div>

        <div style={{marginBottom:12}}><p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CROSS.map(function(cs){return(<div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}><p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p><p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p><span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span></div>);})}</div></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}><p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #토정비결 #2026운세</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:"white",padding:20}}>로딩 중...</div>;
}
