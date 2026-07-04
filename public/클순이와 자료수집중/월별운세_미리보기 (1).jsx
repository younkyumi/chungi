import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";
var NOW_MONTH = 4; // 실제 구현시 new Date().getMonth()+1

var QUESTIONS = [
  {title:"어느 달이 가장 궁금한가요?", icon:"📅", multi:false, skippable:false,
   opts:["📅 이번 달 (4월)","➡️ 다음 달 (5월)","📆 6월","📆 7월","📆 8월","📆 올해 하반기 전체"]},
  {title:"가장 중점을 두고 싶은 영역은?", icon:"🌙", multi:true, skippable:false,
   opts:["💰 재물·수입·투자","❤️ 연애·결혼·인연","💼 직장·사업·커리어","📜 시험·취업·진학·관운","📋 계약·문서·부동산","🌿 건강","🏠 가정·가족","🌈 전체 다 궁금해요!"]},
];


// ━━━ 추가 달 결과 데이터 ━━━
var EXTRA_MONTH_DATA = {
  "5월 운세": {
    month:"5월", isGood:true,
    total:"5월은 직업운이 특히 강한 달이에요. 이직·승진·새 제안 모두 5월 초반이 최적 타이밍이에요. 상반기 마무리를 앞두고 중요한 커리어 결정을 내릴 수 있는 달이에요.",
    money:{score:70,text:"수입이 꾸준히 들어오는 달이에요. 투자보다 저축에 집중하는 게 맞아요. 5월 중순 이후 지출이 늘어날 수 있으니 미리 관리하세요."},
    love:{score:72,text:"안정적인 달이에요. 연애 중이라면 관계가 한 단계 깊어지는 계기가 생겨요. 솔로라면 지인 소개로 만남이 생길 수 있어요."},
    health:{score:74,text:"운동을 새로 시작하기 좋은 달이에요. 꾸준한 루틴을 만들어보세요. 5월 중순 환절기에 감기 조심하세요."},
    career:{score:83,text:"올해 직업운 최고 달 중 하나예요. 중요한 프레젠테이션·면접·제안서 제출에 최적이에요. 5/5, 5/12, 5/20일이 특히 좋아요."},
    lucky:["5월 5일 · 12일 · 20일","행운 요일: 목요일","행운 색: 초록·파랑"],
    caution:["5월 8일 · 18일 주의","큰 지출 결정 신중하게"],
  },
  "6월 운세": {
    month:"6월", isGood:true,
    total:"상반기 마무리의 달이에요. 1~5월에 시작한 것들이 결실을 맺기 시작해요. 새로운 도전보다 현재 하고 있는 일을 완성하는 데 집중하세요.",
    money:{score:68,text:"상반기 재물 결산의 달이에요. 들어온 돈을 잘 정리하고 저축하세요. 하반기 재테크 계획을 이 달에 세우면 좋아요."},
    love:{score:75,text:"인연 기운이 좋은 달이에요. 6월 중순에 중요한 만남이나 고백의 기회가 생길 수 있어요. 용기를 내보세요."},
    health:{score:70,text:"여름 시작으로 수분 보충이 중요해요. 냉방병과 과식을 주의하세요. 가벼운 수영이나 걷기가 이 달에 잘 맞아요."},
    career:{score:76,text:"상반기 성과를 정리하고 하반기 계획을 세우는 달이에요. 윗사람과의 소통이 커리어에 도움이 되는 시기예요."},
    lucky:["6월 6일 · 15일 · 22일","행운 요일: 금요일","행운 색: 흰색·실버"],
    caution:["6월 3일 · 13일 주의","무더위 과로 주의"],
  },
  "7월 운세": {
    month:"7월", isGood:false,
    total:"7월은 에너지가 잠시 안정되는 달이에요. 무리한 확장보다 현재를 지키는 데 집중하세요. 조용히 내실을 다지기 좋은 시기예요.",
    money:{score:58,text:"큰 투자나 새로운 재무 결정은 이 달을 피하는 게 좋아요. 현상 유지가 최선이에요. 충동 구매를 특히 조심하세요."},
    love:{score:62,text:"관계에서 오해가 생길 수 있어요. 감정적인 말보다 차분한 대화를 하세요. 솔로라면 억지로 만남을 만들기보다 자연스럽게 두세요."},
    health:{score:60,text:"무더위로 체력이 소진되기 쉬운 달이에요. 수면을 충분히 취하고 과로를 피하세요. 소화 기능이 떨어질 수 있으니 자극적 음식을 줄이세요."},
    career:{score:64,text:"새로운 도전보다 기존 업무를 완성하는 데 집중하세요. 이 달에 무리하게 이직이나 사업 확장을 시도하는 건 좋지 않아요."},
    lucky:["7월 7일 · 14일 · 21일","행운 요일: 월요일","행운 색: 파랑·검정"],
    caution:["7월 4일 · 13일 · 22일 주의","이 달엔 큰 결정 보류하기"],
  },
  "하반기 전체": {
    month:"하반기 (7~12월)", isGood:true,
    total:"하반기는 상반기에 심은 씨앗이 결실을 맺는 시기예요. 7월은 잠시 쉬어가는 달이지만, 8월부터 다시 기운이 올라오고 10월이 하반기 최고의 달이에요.",
    money:{score:74,text:"하반기 재물은 8월과 10월에 집중돼요. 7월은 현상 유지, 8월부터 적극적으로 움직이세요. 연말 12월에는 올해 재물을 정산하고 내년을 준비하세요."},
    love:{score:71,text:"9월 중순에 인연 기운이 다시 강해져요. 하반기 가장 좋은 만남의 시기는 9~10월이에요. 연말에는 소중한 사람과의 관계를 더 깊게 다지세요."},
    health:{score:69,text:"7~8월 무더위 과로 주의, 9~10월 환절기 면역 관리가 핵심이에요. 연말에는 과음·과식을 자제하고 건강하게 새해를 준비하세요."},
    career:{score:79,text:"10월이 하반기 커리어 최고의 달이에요. 승진·이직·계약을 노린다면 10월 중순에 행동하세요. 하반기 전체적으로 꾸준히 성과를 쌓아가는 흐름이에요."},
    lucky:["8월 8일, 10월 8~22일","하반기 행운 요일: 목·금요일","행운 색: 골드·초록"],
    caution:["7월 전체 · 11월 말 주의","환절기(9~10월) 건강 관리"],
  },
};
var CROSS = [
  {emoji:"☯️", title:"사주 풀이", desc:"내 사주 전체 완전 분석", price:"980원"},
  {emoji:"🌅", title:"연도별 운세", desc:"올해·내년 전체 흐름 분석", price:"980원"},
  {emoji:"🔄", title:"대운 해설", desc:"10년 단위 큰 흐름 보기", price:"첫회무료"},
  {emoji:"📅", title:"좋은 날 찾기", desc:"이번 달 최적의 날짜 추천", price:"980원"},
];

var LOADING_MSGS = [
  "4월 천간지지 배열 중... 🌙","월운 흐름 계산 중... ☯️",
  "도깨비가 이달 운세 뒤지는 중... 🪄","사주와 월운 대조 중... ✨",
  "디테일 맞춤 분석 중... 🎯"
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{flex:1,height:7,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}
function WeekCard({week,days,mood,good,text,detail}){
  var [open,setOpen]=useState(false);
  var isGoodWeek=good;
  return(
    <div style={{marginBottom:10,border:"1px solid "+(isGoodWeek?"rgba(46,125,50,0.15)":"rgba(198,40,40,0.12)"),borderRadius:12,overflow:"hidden"}}>
      <button onClick={function(){setOpen(!open);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:isGoodWeek?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"'Noto Serif KR',serif"}}>
        <span style={{fontSize:20,flexShrink:0}}>{mood}</span>
        <div style={{flex:1}}>
          <p style={{fontSize:12,fontWeight:700,color:"#111",margin:"0 0 2px"}}>{week} <span style={{fontSize:10,color:"rgba(0,0,0,0.4)",fontWeight:400}}>({days})</span></p>
          <p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:0,lineHeight:1.4}}>{text}</p>
        </div>
        <span style={{fontSize:14,color:"rgba(0,0,0,0.3)",transform:open?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
      </button>
      {open&&<div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
        {detail.map(function(d,i){return(
          <div key={i} style={{marginBottom:10}}>
            <p style={{fontSize:10,fontWeight:700,color:d.good?"#2E7D32":"#C62828",margin:"0 0 4px"}}>{d.good?"✓ 해야 할 것":"⚠️ 주의할 것"}</p>
            <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0,paddingLeft:10,borderLeft:"2px solid "+(d.good?"rgba(46,125,50,0.35)":"rgba(198,40,40,0.35)")}}>{d.text}</p>
          </div>
        );})}
      </div>}
    </div>
  );
}

export default function MonthPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [unlockedMonth,setUnlockedMonth]=useState({});
  var [payingMonth,setPayingMonth]=useState(null);
  var [viewMonth,setViewMonth]=useState(null);
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

  // ━━━ 추가달 풀 결과 화면 ━━━
  if(step==="result"&&viewMonth&&unlockedMonth[viewMonth]&&EXTRA_MONTH_DATA[viewMonth]){
    var md=EXTRA_MONTH_DATA[viewMonth];
    var vIsGood=md.isGood;
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <button onClick={function(){setViewMonth(null);}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            <span>←</span><span>4월 운세로 돌아가기</span>
          </button>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 월별 운세</p>
          <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🌙 {md.month} 운세</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>사주 기반 월간 정밀 분석 완료</p>
        </div>
        <div style={{padding:"14px 14px 0"}}>

          {/* 총운 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🌙 {md.month} 총운 — 한 줄 요약</p>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"14px",background:vIsGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.05)",borderRadius:12,border:vIsGood?"1px solid rgba(46,125,50,0.2)":"1px solid rgba(198,40,40,0.15)"}}>
              <span style={{fontSize:28}}>{vIsGood?"☀️":"🌧️"}</span>
              <div><p style={{fontSize:15,fontWeight:800,color:vIsGood?"#2E7D32":"#C62828",margin:"0 0 3px"}}>{vIsGood?"흐름이 좋은 달이에요":"신중함이 필요한 달이에요"}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:0}}>사주 기반 {md.month} 종합 판단</p></div>
            </div>
            <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:0,wordBreak:"keep-all"}}>{md.total}</p>
          </div>

          {/* 주차별 흐름 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 6px"}}>📅 {md.month} 주차별 흐름</p>
            <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 12px"}}>각 주차를 탭하면 해야 할 것과 주의할 것을 확인해요</p>
            <WeekCard week="1주차" days="1~7일" mood={vIsGood?"🔥":"😐"} good={vIsGood}
              text={vIsGood?"에너지가 가장 강한 시기. 새로운 시작과 중요한 연락에 최적이에요.":"에너지를 아끼는 시기예요. 무리하지 말고 현재에 집중하세요."}
              detail={[{good:true,text:vIsGood?"새로운 프로젝트 시작, 중요한 연락에 적극적으로 나서세요.":"진행 중인 업무를 꼼꼼히 마무리하는 데 집중하세요."},{good:false,text:vIsGood?"너무 무리하면 중반에 에너지가 소진될 수 있어요.":"새로운 투자나 계약은 이 주를 피하세요."}]}/>
            <WeekCard week="2주차" days="8~14일" mood={vIsGood?"✨":"😐"} good={vIsGood}
              text={vIsGood?"인연과 재물의 기운이 함께 들어오는 시기예요.":"내실을 다지기 좋은 시기예요."}
              detail={[{good:true,text:vIsGood?"비즈니스 미팅, 소개팅 모두 이 시기가 좋아요.":"기존 관계를 다지고 감사 표현을 하기 좋아요."},{good:false,text:"충동적인 결정은 피하세요."}]}/>
            <WeekCard week="3주차" days="15~21일" mood={vIsGood?"⚠️":"⚠️"} good={false}
              text="중요한 결정은 이 주를 피하는 게 좋아요."
              detail={[{good:true,text:"이미 진행 중인 일을 마무리하는 데 집중하세요."},{good:false,text:"새로운 계약, 이사, 투자 등 큰 결정은 이 주를 피하세요."}]}/>
            <WeekCard week="4주차" days="22~말일" mood="🌙" good={vIsGood}
              text="이달을 정리하고 다음 달을 준비하는 시기예요."
              detail={[{good:true,text:"성과를 정리하고 다음 달 계획을 세우기 좋아요."},{good:false,text:"무리한 야근이나 과로는 피해야 해요."}]}/>
          </div>

          {/* 영역별 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>✦ 영역별 {md.month} 운세</p>
            {[{emoji:"💰",title:"재물운",score:md.money.score,text:md.money.text},
              {emoji:"❤️",title:"연애운",score:md.love.score,text:md.love.text},
              {emoji:"🌿",title:"건강운",score:md.health.score,text:md.health.text},
              {emoji:"💼",title:"직업·사업운",score:md.career.score,text:md.career.text},
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

          {/* 길일 & 주의일 */}
          <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>📅 {md.month} 길일 & 주의일</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <p style={{fontSize:10,fontWeight:700,color:"#2E7D32",margin:"0 0 10px"}}>✦ 특히 좋은 날</p>
                {md.lucky.map(function(t,i){return(
                  <div key={i} style={{marginBottom:8,paddingLeft:8,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>
                    <p style={{fontSize:11,color:"#333",margin:0}}>{t}</p>
                  </div>
                );})}
              </div>
              <div>
                <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 10px"}}>⚠️ 주의</p>
                {md.caution.map(function(t,i){return(
                  <div key={i} style={{marginBottom:8,paddingLeft:8,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>
                    <p style={{fontSize:11,color:"#333",margin:0}}>{t}</p>
                  </div>
                );})}
              </div>
            </div>
          </div>

          {/* 확언 */}
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
            <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
              💫 {DEMO_NAME}님, {vIsGood?md.month+"은 기회를 잡을 준비를 하세요. 흐름이 와 있어요.":md.month+"의 신중함이 다음 달을 더 빛나게 만들 거예요."}
            </p>
            <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 월별 운세의 메시지</p>
          </div>

          <button onClick={function(){setViewMonth(null);}} style={{width:"100%",padding:"15px",border:"1px solid rgba(232,200,122,0.3)",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:"transparent",color:G,marginBottom:12}}>← 4월 운세로 돌아가기</button>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  var q1=answers[0]||""; var q2=answers[1]||"";
  var targetMonth=q1.includes("4월")||!q1?"4월":q1.includes("5월")?"5월":q1.includes("6월")?"6월":q1.includes("7월")?"7월":q1.includes("8월")?"8월":"4월";
  var isGood=true;

  // ── 설명팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🌙 월별 운세</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>디테일 미친 월간 내 사주 — {NOW_MONTH}월 운세</p></div>
          <div style={{textAlign:"right"}}><span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(116,185,255,0.18)",color:"#74B9FF",border:"1px solid #74B9FF44",fontWeight:700,display:"block",marginBottom:4}}>첫회무료</span><span style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>이후 980원</span></div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>🌙 {NOW_MONTH}월 사주 흐름 완전 분석</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:12}}>
            {["일","월","화","수","목","금","토"].map(function(d){return <div key={d} style={{textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.4)",padding:"4px 0"}}>{d}</div>;})}
            {Array.from({length:30},function(_,i){var isGoodDay=[3,8,14,19,25].includes(i+1);var isBadDay=[6,13,20,27].includes(i+1);return <div key={i} style={{aspectRatio:"1",background:isGoodDay?"rgba(232,200,122,0.2)":isBadDay?"rgba(198,40,40,0.1)":"rgba(255,255,255,0.04)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",border:isGoodDay?"1px solid rgba(232,200,122,0.4)":"1px solid transparent"}}><span style={{fontSize:10,color:isGoodDay?G:isBadDay?"#C62828":"rgba(255,255,255,0.4)",fontWeight:isGoodDay?700:400}}>{i+1}</span></div>;})}
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"rgba(232,200,122,0.4)"}}/><span style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>길일</span></div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"rgba(198,40,40,0.3)"}}/><span style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>주의일</span></div></div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 월별 운세에서 알 수 있는 것</p>
          {[["🌙","이번 달 전체 운세 흐름","재물·연애·직업·건강 4가지 영역 월간 흐름"],["📅","주차별 세부 흐름","1~4주차별로 어떤 일이 있을지 + 해야 할 것·주의할 것"],["💰","재물 들어오는 날","이번 달 중 특히 좋은 날과 주의해야 할 날"],["❤️","연애·인연 기운","이번 달 인연의 흐름과 최적 타이밍"],["💼","직업·사업 타이밍","이번 달 중요한 결정을 내릴 최적 날짜"],["🌿","건강 주의사항","이번 달 특히 조심해야 할 건강 포인트"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(116,185,255,0.08)",border:"1px solid rgba(116,185,255,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:22,fontWeight:900,color:"#74B9FF",margin:"0 0 2px"}}>첫 회 무료 🎁</p>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:"0 0 4px"}}>이후 월 980원 · 추가 달 980원</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>무료로 시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>🌙 누구의 월별 운세를 볼까요?</h3></div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}><div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span></button>
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
        <div style={{fontSize:50,marginBottom:14}}>🌙</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 {targetMonth} 사주 분석 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 6px"}}>{LOADING_MSGS[loadMsgIdx]}</p>
      </div>
    </div>
  );

  // ━━━ 결과 ━━━
  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 월별 운세</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🌙 {targetMonth} 운세</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>사주 기반 월간 정밀 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {/* 사전질문 요약 */}
        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{targetMonth} 운세 · {DEMO_NAME}님</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"3px 0 0"}}>🎯 집중 영역: {q2.split(",").slice(0,2).join(", ")}</p>}
        </div>}

        {/* 월간 총운 */}
        <Section title={"🌙 "+targetMonth+" 총운 — 한 줄 요약"}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"14px",background:isGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.05)",borderRadius:12,border:isGood?"1px solid rgba(46,125,50,0.2)":"1px solid rgba(198,40,40,0.15)"}}>
            <span style={{fontSize:28}}>{isGood?"☀️":"🌧️"}</span>
            <div><p style={{fontSize:15,fontWeight:800,color:isGood?"#2E7D32":"#C62828",margin:"0 0 3px"}}>{isGood?"흐름이 좋은 달이에요":"신중함이 필요한 달이에요"}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:0}}>사주 기반 {targetMonth} 종합 판단</p></div>
          </div>
          <Para text={DEMO_NAME+"님, "+targetMonth+"을 솔직하게 말씀드릴게요. 이번 달 목 기운이 강하게 들어오면서 새로운 시작과 성장의 에너지가 넘쳐요. 특히 월초부터 중순(1~15일) 사이에 중요한 기회가 생길 수 있어요. 이 시기를 절대 그냥 보내지 마세요."}/>
          <Para text={"특히 "+q2.split(",")[0]+" 분야에서 이달 기운이 집중되고 있어요. 평소보다 적극적으로 움직이면 생각보다 큰 결실을 얻을 수 있는 달이에요. 단, 하순(21일 이후)에는 에너지가 다소 꺾이는 시기라 무리한 확장은 자제하세요."}/>
        </Section>

        {/* 주차별 흐름 — 클릭 토글 */}
        <Section title={"📅 "+targetMonth+" 주차별 상세 흐름"}>
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:"0 0 12px"}}>각 주차를 탭하면 해야 할 것과 주의할 것을 확인해요</p>
          <WeekCard week="1주차" days="1~7일" mood="🔥" good={true} text="에너지가 가장 강한 시기. 새로운 시작과 중요한 연락에 최적이에요."
            detail={[{good:true,text:"새로운 프로젝트 시작, 중요한 연락, 투자 검토 등 적극적인 행동이 잘 맞아요."},{good:false,text:"첫 주부터 너무 무리하면 중반에 에너지가 소진될 수 있어요. 리듬을 조절하세요."}]}/>
          <WeekCard week="2주차" days="8~14일" mood="✨" good={true} text="인연과 재물의 기운이 함께 들어오는 시기. 중요한 만남이 생길 수 있어요."
            detail={[{good:true,text:"소개팅, 비즈니스 미팅, 계약 협의에 좋은 시기예요. 먼저 연락하는 것이 유리해요."},{good:false,text:"감정적으로 충동적인 결정은 피해야 해요. 느낌만으로 계약하거나 투자하지 마세요."}]}/>
          <WeekCard week="3주차" days="15~21일" mood="⚠️" good={false} text="충 기운이 약하게 들어와요. 중요한 결정은 이 주를 피하는 게 좋아요."
            detail={[{good:true,text:"이미 진행 중인 일을 마무리하고 정리하는 데 집중하세요. 내실 다지기에 좋아요."},{good:false,text:"새로운 계약, 이사, 수술, 투자 등 중요한 결정은 이 주를 피하세요. 예상치 못한 변수가 생길 수 있어요."}]}/>
          <WeekCard week="4주차" days="22~말일" mood="🌙" good={true} text="마무리와 준비의 시기. 이달을 정리하고 다음 달을 준비하세요."
            detail={[{good:true,text:"이번 달 성과를 정리하고 다음 달 계획을 세우기 좋아요. 감사 표현과 관계 정리도 이 시기에 해두세요."},{good:false,text:"새로운 도전보다 현재 유지에 집중하세요. 무리한 야근이나 과로는 피해야 해요."}]}/>
        </Section>

        {/* 영역별 운세 */}
        <Section title="✦ 영역별 이달 운세">
          {[{emoji:"💰",title:"재물운",score:72,color:"linear-gradient(90deg,#E8C87A,#C4922A)",
             text:DEMO_NAME+"님, 이번 달 재물 기운이 좋아요. 월초~중순에 예상치 못한 수입이 들어올 수 있어요. 특히 8일과 14일에 재물 기운이 강하게 들어오는 날이에요. 이 시기에 중요한 재무 결정을 하면 유리해요. 단, 3주차(15~21일)에는 큰 지출이나 투자를 보류하는 게 좋아요."},
            {emoji:"❤️",title:"연애운",score:68,color:"linear-gradient(90deg,#FF7675,#C62828)",
             text:"인연의 기운이 흐르는 달이에요. 솔로라면 2주차(8~14일)에 좋은 만남이 생길 수 있어요. 소개팅이 있다면 이 시기에 하는 게 좋아요. 연애 중이라면 15일 전후로 감정적 소통에서 오해가 생길 수 있으니 말 한마디 조심하세요. 특히 21~25일은 두 사람 모두 스트레스를 받기 쉬운 시기예요."},
            {emoji:"🌿",title:"건강운",score:66,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
             text:"이번 달 건강 관리에 신경 써야 해요. 특히 3주차에 면역력이 떨어지기 쉬워요. 15~20일 사이에 과로하면 이후 체력이 급격히 소진될 수 있어요. 규칙적인 식사와 수면이 이달 건강의 핵심이에요. 소화기 계통이 예민해지는 달이라 자극적인 음식은 자제하세요."},
            {emoji:"💼",title:"직업·사업운",score:81,color:"linear-gradient(90deg,#7CB87B,#2E7D32)",
             text:"이번 달 직업운이 가장 강한 달이에요. 새로운 제안이 들어오거나 중요한 기회가 생길 수 있어요. 특히 1주차(1~7일)에 적극적으로 자신을 드러내면 좋아요. 이직이나 승진을 원한다면 이달 초반에 행동을 시작하세요. 사업 중이라면 새 고객이나 파트너가 들어오는 시기예요."},
          ].map(function(r){return(
            <div key={r.title} style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><p style={{fontSize:13,fontWeight:700,color:"#111",margin:0}}>{r.emoji} {r.title}</p><span style={{fontSize:12,fontWeight:700,color:"#7A5C00"}}>{r.score}점</span></div>
              <ScoreBar score={r.score} color={r.color}/>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{r.text}</p>
            </div>
          );})}
        </Section>

        {/* 이달의 길일 & 주의일 */}
        <Section title={"📅 "+targetMonth+" 길일 & 주의일"}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#2E7D32",margin:"0 0 10px"}}>✦ 특히 좋은 날</p>
              {[["4월 3일","목요일 · 재물·계약 길일"],["4월 8일","화요일 · 인연·미팅 길일"],["4월 14일","월요일 · 재물·투자 길일"],["4월 19일","토요일 · 결정·시작 길일"],["4월 25일","금요일 · 전반적 대길일"]].map(function(d,i){return(
                <div key={i} style={{marginBottom:8}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{d[0]}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0,paddingLeft:8,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{d[1]}</p>
                </div>
              );})}
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 10px"}}>⚠️ 주의할 날</p>
              {[["4월 6일","수요일 · 갈등·손재 주의"],["4월 13일","목요일 · 계약·투자 금지"],["4월 20일","목요일 · 충 기운 강한 날"],["4월 27일","목요일 · 이동·변화 주의"]].map(function(d,i){return(
                <div key={i} style={{marginBottom:8}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#333",margin:"0 0 2px"}}>{d[0]}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0,paddingLeft:8,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>{d[1]}</p>
                </div>
              );})}
            </div>
          </div>
        </Section>

        {/* 다른 달 추가 결제 + 결과 */}
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 다른 달도 궁금하다면?</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:payingMonth||viewMonth?12:0}}>
            {[["5월 운세","다음 달","980원"],["6월 운세","두 달 뒤","980원"],["7월 운세","세 달 뒤","980원"],["하반기 전체","7~12월","1,980원"]].map(function(x){
              var isUnlocked=!!unlockedMonth[x[0]];
              var isViewing=viewMonth===x[0];
              return(
                <div key={x[0]} onClick={function(){
                  if(isUnlocked){setViewMonth(isViewing?null:x[0]);}
                  else{setPayingMonth(payingMonth===x[0]?null:x[0]);setViewMonth(null);}
                }} style={{background:isUnlocked?"rgba(46,125,50,0.12)":isViewing||payingMonth===x[0]?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.06)",border:isUnlocked?"1px solid rgba(46,125,50,0.4)":isViewing||payingMonth===x[0]?"1px solid rgba(232,200,122,0.4)":"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px",cursor:"pointer",transition:"all 0.2s"}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{x[0]}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 8px"}}>{x[1]}</p>
                  <span style={{fontSize:12,color:isUnlocked?"#7CB87B":G,fontWeight:700}}>{isUnlocked?"열림 ✓ →":x[2]+" →"}</span>
                </div>
              );
            })}
          </div>

          {/* 결제창 */}
          {payingMonth&&!unlockedMonth[payingMonth]&&(
            <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(232,200,122,0.35)",borderRadius:14,padding:"16px",marginTop:4}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <p style={{fontSize:14,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{payingMonth} 결제</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>재물·연애·건강·직업운 + 길일 포함</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{fontSize:18,fontWeight:900,color:G,margin:0}}>{payingMonth==="하반기 전체"?"1,980원":"980원"}</p>
                </div>
              </div>
              {[["🟡","카카오페이"],["🔵","토스페이"],["💚","네이버페이"]].map(function(x){return(
                <div key={x[1]} onClick={function(){
                  setUnlockedMonth(function(prev){var n=Object.assign({},prev);n[payingMonth]=true;return n;});
                  setViewMonth(payingMonth);
                  setPayingMonth(null);
                }} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                  <span style={{fontSize:18}}>{x[0]}</span>
                  <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p>
                  <span style={{fontSize:11,color:G,fontWeight:700}}>결제하고 열기 →</span>
                </div>
              );})}
              <button onClick={function(){setPayingMonth(null);}} style={{width:"100%",padding:"8px",background:"transparent",border:"none",fontSize:11,color:"rgba(255,255,255,0.35)",cursor:"pointer",fontFamily:"'Noto Serif KR',serif",marginTop:4}}>취소</button>
            </div>
          )}

          {/* 결제 완료 후 → 전체 화면으로 이동 버튼 */}
          {viewMonth&&unlockedMonth[viewMonth]&&(
            <div style={{background:"rgba(46,125,50,0.08)",border:"1px solid rgba(46,125,50,0.25)",borderRadius:12,padding:"14px",marginTop:4,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={function(){var vm=viewMonth;setViewMonth(null);setTimeout(function(){setViewMonth(vm);},10);}}>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:"#2E7D32",margin:"0 0 2px"}}>✓ {viewMonth} 열림!</p>
                <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",margin:0}}>탭해서 전체 결과 보기</p>
              </div>
              <span style={{fontSize:20,color:"#2E7D32"}}>›</span>
            </div>
          )}
        </div>

        {/* 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님, {isGood?targetMonth+"은 기회를 잡을 준비를 하세요. 흐름이 와 있어요.":targetMonth+"의 신중함이 다음 달을 더 빛나게 만들 거예요."}
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 월별 운세의 메시지</p>
        </div>

        {/* 크로스셀링 */}
        <div style={{marginBottom:12}}><p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{CROSS.map(function(cs){return(<div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}><p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p><p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p><span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span></div>);})}</div></div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #월별운세 #{targetMonth}운세</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
