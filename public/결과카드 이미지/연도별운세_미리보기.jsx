import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var QUESTIONS = [
  {title:"어느 해가 가장 궁금한가요?", icon:"🌅", multi:false, skippable:false,
   opts:["📅 올해 (2026)","➡️ 내년 (2027)","🗓️ 2028년","⏪ 작년 (2025) 돌아보기","💭 다른 연도 직접 입력"]},
  {title:"올해 가장 중요한 영역은?", icon:"🎯", multi:true, skippable:false,
   opts:["💰 재물·투자","❤️ 연애·결혼","💼 직업·사업","📜 시험·취업","📋 계약·부동산","🌿 건강","🌟 전체 다 궁금해요!"]},
  {title:"요즘 가장 간절한 게 있다면?", icon:"🙏", multi:false, skippable:true,
   opts:["💸 돈이 들어오는 시기가 언제인지","❤️ 좋은 인연이 언제 오는지","💼 이 방향이 맞는지","📜 합격·취업이 될지","🏠 이사·계약 타이밍","🌿 건강이 걱정돼"]},
];

var CROSS = [
  {emoji:"☯️",title:"사주 풀이",desc:"내 사주 전체 완전 분석",price:"980원"},
  {emoji:"🌙",title:"월별 운세",desc:"이번 달 디테일 분석",price:"첫회무료"},
  {emoji:"🔄",title:"대운 해설",desc:"10년 큰 그림 보기",price:"첫회무료"},
  {emoji:"🎋",title:"신년 운세",desc:"1~12월 월별 꼼꼼 분석",price:"1,980원"},
];

var LOADING_MSGS = [
  "연도 사주 배열 중... 🌅","그 해 천간지지 분석 중... ☯️",
  "도깨비가 그 해 달력 훔쳐보는 중... 🪄","용왕님이 연간 재물 보따리 정리 중... 💰",
  "저승사자가 그 해 운명책 펼치는 중... 📖"
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}

export default function YearPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var ivRef=useRef(null);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*4+2);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},500);}
    },160);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||"";
  var targetYear=q1.includes("올해")||!q1?"2026년":q1.includes("내년")?"2027년":q1.includes("2028")?"2028년":q1.includes("작년")?"2025년":"2026년";
  var isLook=q1.includes("작년");

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🌅 연도별 운세</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>그 해, 나에겐 무슨 일이? 과거·현재·미래</p></div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(232,200,122,0.18)",color:G,border:"1px solid rgba(232,200,122,0.4)",fontWeight:700}}>풀코스</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>🌅 태어난 해부터 110세까지 모든 연도 분석 가능</p>
          <div style={{display:"flex",gap:5,marginBottom:12}}>
            {["2024","2025","2026","2027","2028"].map(function(y,i){return(
              <div key={y} style={{flex:1,textAlign:"center",background:i===2?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.04)",border:i===2?"1px solid rgba(232,200,122,0.4)":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 4px"}}>
                <p style={{fontSize:10,fontWeight:i===2?700:400,color:i===2?G:"rgba(255,255,255,0.45)",margin:"0 0 2px"}}>{y}</p>
                {i===2&&<span style={{fontSize:8,color:G}}>올해</span>}
                {i<2&&<span style={{fontSize:8,color:"rgba(255,255,255,0.25)"}}>과거</span>}
                {i>2&&<span style={{fontSize:8,color:"rgba(255,255,255,0.25)"}}>미래</span>}
              </div>
            );})}
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:0}}>과거 연도는 "왜 그때 그랬는지" 사주로 이해할 수 있어요. 미래 연도는 언제 어떤 기회가 오는지 미리 알 수 있어요.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 연도별 운세에서 알 수 있는 것</p>
          {[["🌅","그 해 전체 운세 흐름","재물·연애·직업·건강 연간 종합 전망"],["📅","분기별 에너지 흐름","1~4분기 각각의 기운과 좋은 시기"],["💰","그 해 재물 타이밍","돈이 들어오는 시기와 나가는 시기"],["❤️","그 해 인연 기운","인연이 오는 시기와 결혼 기운"],["💼","그 해 직업·사업 기운","이직·승진·창업 최적 시기"],["🔮","과거 돌아보기","왜 그때 그런 일이 생겼는지 이해"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:16}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>{f[1]}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:"0 0 3px"}}>연도 풀 리딩 · 추가 연도 380원</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0}}>예) 올해+내년 = 980+380 = 1,360원</p>
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
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>🌅 누구의 연도별 운세를 볼까요?</h3>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여</p></div>
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
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 분석 →</button>}
          </div>
        </div>
      </div>
    );
  }

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:11,color:"rgba(255,255,255,0.65)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}</div>}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>980원</span></div></div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 (980원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
    </div>
  );

  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>🌅</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 {targetYear} 분석 중...</p>
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
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 연도별 운세</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🌅 {targetYear} 운세</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>사주 기반 연도 정밀 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{targetYear} · {DEMO_NAME}님</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"3px 0 0"}}>🎯 집중 영역: {q2.split(",").slice(0,2).join(", ")}</p>}
        </div>}

        {/* 연도 총운 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🌅 {targetYear} 총운</p>
          <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.3)",borderRadius:12,padding:"14px",marginBottom:14,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:8}}>
              <div style={{textAlign:"center"}}><p style={{fontSize:32,color:"#C62828",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>丙</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>병화 (천간)</p></div>
              <div style={{textAlign:"center"}}><p style={{fontSize:32,color:"#7CB87B",fontWeight:700,margin:"0 0 2px",lineHeight:1}}>午</p><p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:0}}>오화 (지지)</p></div>
            </div>
            <p style={{fontSize:11,color:"#7A5C00",fontWeight:700,margin:0}}>병오년 · 화(火) 기운이 폭발하는 해</p>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>
            {DEMO_NAME}님, {targetYear}을 솔직하게 말씀드릴게요. 병오년은 화 기운이 폭발하는 해예요. 적극적으로 나서는 사람에게 기회가 집중되고, 움츠러드는 사람은 흘러가버리는 해예요.
          </p>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:0,wordBreak:"keep-all"}}>
            {DEMO_NAME}님 사주와 이 해의 기운이 꽤 잘 맞아요. 특히 상반기(1~6월)에 중요한 기회가 몰려있어요. 이 시기를 절대 그냥 보내지 마세요. {q2&&q2.split(",")[0].includes("재물")?"특히 재물운에서 상반기에 움직여야 해요. 하반기는 거두는 시기예요.":""}
          </p>
        </div>

        {/* 분기별 흐름 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>📅 분기별 상세 흐름</p>
          {[{q:"1분기",months:"1~3월",mood:"🔥",good:true,
              text:"올해 에너지가 가장 강한 시기예요. 새로운 것을 시작하거나 중요한 결정을 내리기 최적이에요.",
              do_:["새로운 프로젝트나 사업 시작","중요한 계약과 협의","자기계발·학습 시작"],
              dont:["망설임에 시간 낭비","큰 지출이나 리스크"]},
            {q:"2분기",months:"4~6월",mood:"✨",good:true,
              text:"재물과 인연의 기운이 함께 들어오는 시기예요. 올해 최고의 달들이 모여있어요.",
              do_:["중요한 인간관계 투자","재물 관련 결정","이직이나 승진 시도"],
              dont:["감정적 충동 결정","과도한 소비"]},
            {q:"3분기",months:"7~9월",mood:"😐",good:false,
              text:"에너지가 잠시 안정되는 시기예요. 상반기에 심은 씨앗이 자라는 중이에요.",
              do_:["내실 다지기·정리","장기 계획 수립","건강 관리"],
              dont:["새로운 큰 결정","무리한 확장"]},
            {q:"4분기",months:"10~12월",mood:"💰",good:true,
              text:"올해의 결실이 나타나는 시기예요. 재물운이 다시 올라오고 중요한 마무리가 이루어져요.",
              do_:["올해 성과 정리·수확","내년 계획 수립","중요한 마무리"],
              dont:["새해를 앞두고 무리한 투자","연말 과음·과로"]},
          ].map(function(r){return(
            <div key={r.q} style={{marginBottom:14,background:r.good?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"1px solid "+(r.good?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.12)"),borderRadius:12,padding:"14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:20}}>{r.mood}</span>
                <div><p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{r.q} <span style={{fontSize:10,color:"rgba(0,0,0,0.4)",fontWeight:400}}>({r.months})</span></p></div>
                <span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:10,background:r.good?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.08)",color:r.good?"#2E7D32":"#C62828",fontWeight:700}}>{r.good?"기운 ↑":"주의"}</span>
              </div>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:"0 0 10px"}}>{r.text}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><p style={{fontSize:10,color:"#2E7D32",fontWeight:700,margin:"0 0 5px"}}>✓ 해야 할 것</p>{r.do_.map(function(d,i){return <p key={i} style={{fontSize:10,color:"#333",margin:"0 0 4px",paddingLeft:6,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{d}</p>;})}</div>
                <div><p style={{fontSize:10,color:"#C62828",fontWeight:700,margin:"0 0 5px"}}>✗ 주의할 것</p>{r.dont.map(function(d,i){return <p key={i} style={{fontSize:10,color:"#333",margin:"0 0 4px",paddingLeft:6,borderLeft:"2px solid rgba(198,40,40,0.25)"}}>{d}</p>;})}</div>
              </div>
            </div>
          );})}
        </div>

        {/* 영역별 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>✦ {targetYear} 영역별 운세</p>
          {[{emoji:"💰",title:"재물운",score:75,color:"linear-gradient(90deg,#E8C87A,#C4922A)",
              text:"올해 재물 흐름이 좋아요. 상반기(특히 3월과 5월)에 새로운 수입 루트가 열리거나 기다리던 돈이 들어올 수 있어요. 하반기는 그것을 잘 지키고 불리는 시기예요. 올해 투자는 상반기에, 저축은 하반기에 집중하는 것이 이 사주와 올해 기운에 맞아요."},
            {emoji:"❤️",title:"연애운",score:70,color:"linear-gradient(90deg,#FF7675,#C62828)",
              text:"인연의 기운이 강한 해예요. 솔로라면 상반기에 좋은 만남이 생길 수 있어요. 특히 4~5월이 인연의 기운이 가장 강해요. 연애 중이라면 3분기(7~9월)에 감정적 소통에서 오해가 생길 수 있으니 이 시기 대화에 특히 신경 쓰세요."},
            {emoji:"🌿",title:"건강운",score:72,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
              text:"올해 화 기운이 강한 병오년이라 심장과 순환계, 눈 건강에 신경 써야 해요. 특히 여름(6~8월)에 과로와 더위로 체력이 소진될 수 있어요. 이 시기를 잘 넘기면 하반기는 오히려 건강이 안정돼요."},
            {emoji:"💼",title:"직업·사업운",score:83,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
              text:"올해 직업운이 가장 강한 해예요. 이직이나 승진을 원한다면 올해가 최적의 타이밍이에요. 특히 1분기와 4분기에 중요한 커리어 결정을 내리면 좋아요. 사업 중이라면 상반기에 새로운 고객이나 파트너가 들어오는 시기예요."},
          ].map(function(r){return(
            <div key={r.title} style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{r.emoji} {r.title}</p><span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{r.score}점</span></div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:r.score+"%",background:r.color,borderRadius:99}}/></div></div>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{r.text}</p>
            </div>
          );})}
        </div>

        {/* 올해 길일 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>📅 {targetYear} 주요 길일 & 주의 시기</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#2E7D32",margin:"0 0 10px"}}>✦ 올해 최고의 달</p>
              {[["1월","새해 기운 강한 대길월"],["4월","재물·인연 복합 길월"],["5월","직업·사업 최고 달"],["10월","하반기 최고 재물월"]].map(function(d,i){return(
                <div key={i} style={{marginBottom:8}}><p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{d[0]}</p><p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0,paddingLeft:6,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{d[1]}</p></div>
              );})}
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 10px"}}>⚠️ 주의해야 할 시기</p>
              {[["3월","환절기 건강 주의"],["7~8월","과로·과열 주의"],["11월","감정적 결정 주의"]].map(function(d,i){return(
                <div key={i} style={{marginBottom:8}}><p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{d[0]}</p><p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0,paddingLeft:6,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>{d[1]}</p></div>
              );})}
            </div>
          </div>
        </div>

        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>💫 {DEMO_NAME}님, {targetYear}은 망설이는 사람보다 행동하는 사람에게 기회가 오는 해예요.</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 연도별 운세의 메시지</p>
        </div>

        {/* 다른 연도 추가결제 */}
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 다른 연도도 궁금하다면?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["2025년 운세","작년 돌아보기","380원"],["2027년 운세","내년 준비하기","380원"],["2028년 운세","2년 후 전망","380원"],["2024년 운세","2년 전 왜 그랬나","380원"]].map(function(x){return(
              <div key={x[0]} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px",cursor:"pointer"}}>
                <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{x[0]}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 8px"}}>{x[1]}</p>
                <span style={{fontSize:12,color:G,fontWeight:700}}>{x[2]} →</span>
              </div>
            );})}
          </div>
        </div>
        <div style={{marginBottom:12}}><p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CROSS.map(function(cs){return(<div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}><p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p><p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p><span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span></div>);})}</div></div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}><p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #연도별운세 #{targetYear}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:'white',padding:20}}>로딩 중...</div>;
}