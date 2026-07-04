"use client";
import { useState, useEffect, useRef } from "react";
import PAST_LIFE_DB from "../../public/past_life_types.json";
import { enrichSajuText } from "@/lib/saju-gloss";
import { ResultCard, formatPersonInfoLine, formatTestDateLine, PersonInfo } from "./ResultCard";

// ─── 공용 mini 컴포넌트 ────────────────────────────────────────
function CloseBtn({onClose}:{onClose:()=>void}){
  return <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
    <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
  </div>;
}

function FunnelGrid({onOpenService,items}:{onOpenService:any,items:any[]}){
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
    {items.map((ad:any)=>(
      <div key={ad.sid} style={{background:"#ffffff",borderRadius:12,padding:"10px 8px",border:`2px solid ${ad.bc}`,textAlign:"center",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(ad.sid,ad.name.replace(" →",""),ad.ic,ad.price||"")}>
        <div style={{fontSize:18,marginBottom:2}}>{ad.ic}</div>
        <div style={{fontSize:10,fontWeight:800,color:"#1A3C32",marginBottom:1}}>{ad.q}</div>
        <div style={{fontSize:9,color:"#666"}}>{ad.name}</div>
      </div>
    ))}
  </div>;
}

function PreQA({iconTitle,subtitle,title,opts,multi,skipable,answer,setAnswer,onNext,onBack,step,total,onClose}:any){
  const sel:string[]=multi?(Array.isArray(answer)?answer:[]):(answer?[answer]:[]);
  // v279: single select 자동 진행 제거 — 명시적 '다음' 버튼 노출
  const pick=(l:string)=>{
    if(multi){
      const next=sel.includes(l)?sel.filter(x=>x!==l):[...sel,l];
      setAnswer(next);
    }else{
      setAnswer(answer===l?undefined:l); // 자동 진행 X + 같은 거 다시 누르면 해제(건너뛰기 복귀)
    }
  };
  // v758: PreQuestionFlow 표준 매치 — 안내박스 자동 생성, 진행바 단독 위치, 질문 13px 보통
  const autoHint = multi && skipable ? "여러 개 선택 가능 · 건너뛰기 가능"
    : multi ? "여러 개 선택 가능 — 폭넓게 분석"
    : skipable ? "건너뛰기 가능 — 전체 균등 분석"
    : "가장 가까운 것 하나만 선택";
  return <div>
    {iconTitle&&<div className="mt">{iconTitle}</div>}
    {iconTitle&&<div className="ms">{step}/{total}{subtitle?` · ${subtitle}`:""}</div>}
    <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:99,marginBottom:14,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(step/total)*100}%`,background:"var(--gold)",transition:"width .3s"}}/>
    </div>
    <div style={{fontSize:11,color:"var(--mist)",marginBottom:12,lineHeight:1.6,padding:"8px 11px",background:"rgba(212,175,55,0.06)",borderRadius:8,border:"1px solid rgba(212,175,55,0.12)"}}>💡 {autoHint}</div>
    <div style={{fontSize:13,fontWeight:600,color:"var(--white)",marginBottom:12,lineHeight:1.5}}>{title}</div>
    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
      {opts.map((opt:any)=>{
        const s=sel.includes(opt.l);
        return <button key={opt.l} onClick={()=>pick(opt.l)} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:s?"rgba(212,175,55,0.12)":"var(--ink3)",border:s?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.06)",borderRadius:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .18s"}}>
          <span style={{fontSize:18,flexShrink:0}}>{opt.e}</span>
          <div style={{flex:1,fontSize:13,fontWeight:700,color:s?"var(--gold)":"var(--white)"}}>{opt.l}</div>
          {multi&&<div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${s?"var(--gold)":"rgba(168,196,184,0.3)"}`,background:s?"var(--gold)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink)",fontSize:11,fontWeight:900}}>{s?"✓":""}</div>}
        </button>;
      })}
    </div>
    {sel.length>0&&<button className="btn btn-p" style={{marginBottom:8}} onClick={onNext}>다음 → ({sel.length}개 선택)</button>}
    {skipable&&<button onClick={onNext} style={{width:"100%",padding:11,background:"transparent",border:"1px dashed rgba(212,175,55,0.25)",borderRadius:12,color:"var(--gold)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>건너뛰기 →</button>}
    {(onBack||onClose)&&<div style={{display:"flex",gap:6}}>
      {onBack&&<button onClick={onBack} className="btn btn-g" style={{flex:1,marginTop:0,fontSize:12}}>← 이전</button>}
      {onClose&&<button onClick={onClose} className="btn btn-g" style={{flex:1,marginTop:0}}>닫기</button>}
    </div>}
  </div>;
}

function FunLoad({onDone,duration=2500,emoji,title,msgs}:any){
  const[pct,setPct]=useState(0);
  const[mi,setMi]=useState(0);
  const ref=useRef<any>(null);
  useEffect(()=>{
    let p=0;
    ref.current=setInterval(()=>{
      p=Math.min(100,p+Math.random()*4+2);setPct(Math.floor(p));
      if(Math.random()>0.85)setMi(i=>(i+1)%msgs.length);
      if(p>=100){clearInterval(ref.current);setTimeout(onDone,400);}
    },duration/40);
    return()=>clearInterval(ref.current);
  },[]);
  return <div style={{textAlign:"center",padding:"30px 10px"}}>
    <div style={{fontSize:46,marginBottom:12}}>{emoji}</div>
    <div style={{fontSize:13,color:"var(--gold)",fontWeight:700,marginBottom:12}}>{title}</div>
    <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:6}}>
      <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,var(--gold),var(--gold3))",borderRadius:99,transition:"width 0.18s"}}/>
    </div>
    <div style={{fontSize:13,color:"var(--gold)",fontWeight:700,marginBottom:8}}>{pct}%</div>
    <div style={{fontSize:11,color:"var(--mist)",minHeight:16}}>{msgs[mi]}</div>
    <div style={{fontSize:9,color:"rgba(168,196,184,0.5)",marginTop:12,textAlign:"center",letterSpacing:0.3}}>✨ 화면을 나가도 분석은 계속됩니다 · 결과는 기록소에 저장돼요</div>
  </div>;
}

// 사주 인트로 카드 (천간지지 표시) — 결과 헤더용
function SajuHeaderCard({pillars,labels,subtitle}:any){
  return <div style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.18)",borderLeft:"4px solid var(--gold)"}}>
    <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:8}}>✦ 사주 기반 분석</div>
    <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:8}}>
      {pillars.map((p:any,i:number)=>(
        <div key={i} style={{textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:700,color:i===0?"#C62828":"#7CB87B",margin:"0 0 2px",lineHeight:1,fontFamily:"serif"}}>{p}</div>
          <div style={{fontSize:9,color:"rgba(0,0,0,0.4)"}}>{labels[i]}</div>
        </div>
      ))}
    </div>
    {subtitle&&<div style={{fontSize:11,color:"#7A5C00",fontWeight:700,textAlign:"center"}}>{subtitle}</div>}
  </div>;
}

function WhiteCard({label,children,emoji}:any){
  return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.14)"}}>
    <div style={{fontSize:9,color:"#7A5C00",letterSpacing:3,marginBottom:14}}>{emoji} {label}</div>
    {children}
  </div>;
}

// 천기 오리지널 브랜드 헤더 (각 Rich 모달 결과 최상단)
function RichBrandHeader({svcLabel}:{svcLabel:string}){
  return <div style={{textAlign:"center",marginBottom:8,padding:"6px 12px",background:"linear-gradient(135deg,rgba(212,175,55,0.08),rgba(155,143,212,0.05))",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10}}>
    <div style={{fontSize:9,color:"#7A5C00",fontWeight:700,letterSpacing:2}}>🔮 천기(天機) 오리지널 | {svcLabel}</div>
  </div>;
}

function Para({text}:{text:string}){return <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>{enrichSajuText(text)}</p>;}

// v434: 사주 고정 chip (일간/띠/별자리) — 사주 그룹 모달 헤더 통일
export function SajuChips({selectedPerson,ilOh,hideDdi,hideZodiac}:{selectedPerson:any,ilOh?:string|null,hideDdi?:boolean,hideZodiac?:boolean}){
  if(!selectedPerson?.birth)return null;
  const y0=parseInt(selectedPerson.birth.slice(0,4));
  const mm=parseInt(selectedPerson.birth.slice(5,7));
  const dd=parseInt(selectedPerson.birth.slice(8,10));
  const yDdi=(mm<2||(mm===2&&dd<4))?y0-1:y0;
  const dIdx=((yDdi-4)%12+12)%12;
  const ddiList=[{n:"쥐띠",ic:"🐭"},{n:"소띠",ic:"🐮"},{n:"범띠",ic:"🐯"},{n:"토끼띠",ic:"🐰"},{n:"용띠",ic:"🐲"},{n:"뱀띠",ic:"🐍"},{n:"말띠",ic:"🐴"},{n:"양띠",ic:"🐑"},{n:"원숭이띠",ic:"🐵"},{n:"닭띠",ic:"🐔"},{n:"개띠",ic:"🐶"},{n:"돼지띠",ic:"🐷"}];
  const ddi=ddiList[dIdx];
  const t=mm*100+dd;
  let z="염소자리",zIc="♑";
  if(t<120){}else if(t<219){z="물병자리";zIc="♒";}else if(t<321){z="물고기자리";zIc="♓";}else if(t<420){z="양자리";zIc="♈";}else if(t<521){z="황소자리";zIc="♉";}else if(t<622){z="쌍둥이자리";zIc="♊";}else if(t<723){z="게자리";zIc="♋";}else if(t<823){z="사자자리";zIc="♌";}else if(t<923){z="처녀자리";zIc="♍";}else if(t<1023){z="천칭자리";zIc="♎";}else if(t<1122){z="전갈자리";zIc="♏";}else if(t<1222){z="사수자리";zIc="♐";}
  const ohHanja:any={"목":"木","화":"火","토":"土","금":"金","수":"水"};
  const ohColors:any={목:"#5FC49E",화:"#DC3545",토:"#C8834A",금:"#D4AF37",수:"#7c3aed"};
  return <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",marginTop:10,marginBottom:6}}>
    {ilOh&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,background:`${ohColors[ilOh]}15`,color:ohColors[ilOh],border:`1px solid ${ohColors[ilOh]}40`}}>☯️ 내 사주 일간 : {ilOh}({ohHanja[ilOh]||""})</span>}
    {!hideDdi&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,background:"#fff7ed",color:"#9a3412",border:"1px solid #fed7aa"}}>{ddi.ic} 내 띠 : {ddi.n}</span>}
    {!hideZodiac&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a"}}>{zIc} 내 별자리 : {z}</span>}
  </div>;
}

function ScoreRow({items}:{items:{e:string,n:string,s:number}[]}){
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${items.length},1fr)`,gap:8,marginBottom:6}}>
    {items.map((x,i)=>(
      <div key={i} style={{textAlign:"center",background:"#F9F7F2",borderRadius:10,padding:"10px 4px"}}>
        <div style={{fontSize:18,marginBottom:3}}>{x.e}</div>
        <div style={{fontSize:9,color:"rgba(0,0,0,0.45)",marginBottom:3}}>{x.n}</div>
        <div style={{fontSize:13,fontWeight:700,color:x.s>=75?"#2E7D32":x.s>=55?"#7A5C00":"#C62828"}}>{x.s}점</div>
      </div>
    ))}
  </div>;
}

function Affirm({name,text}:{name:string,text:string}){
  return <div style={{borderRadius:16,padding:1.5,backgroundImage:"linear-gradient(135deg,#ffb8b8,#ffd9a8,#b8e0c8,#bcd6f0,#cdc5e8)",boxShadow:"0 4px 14px rgba(155,143,212,0.08)",marginBottom:12}}>
    <div style={{background:"#fafbfd",borderRadius:14.5,padding:"20px 18px",textAlign:"center"}}>
      <div style={{fontSize:13,color:"#1A3C32",letterSpacing:1.5,fontWeight:900,marginBottom:10}}>🔮 천기의 한마디</div>
      <div style={{fontSize:13,color:"#1A3C32",fontWeight:700,lineHeight:1.85,wordBreak:"keep-all" as any,fontFamily:"'Noto Serif KR','Batang',serif"}}>{text.replace(/\{nm\}/g,name)}</div>
    </div>
  </div>;
}

// 사주 헬퍼 — 사용자 정보로 천간지지 추출
function getSajuSimple(sajuPillars:any,birth?:string){
  if(sajuPillars){
    const dayPillar=sajuPillars.pillars?.find((p:any)=>p.label==="일주");
    const monthPillar=sajuPillars.pillars?.find((p:any)=>p.label==="월주");
    return {ilgan:sajuPillars.ilgan||"乙",ilOh:sajuPillars.ilOh||"목",dayJj:dayPillar?.jj??0,monthCg:monthPillar?.cg??0};
  }
  // 폴백: 생년월일 → 간단한 일간 추정
  const y=birth?parseInt(birth.split("-")[0]):1990;
  const ohMap=["목","화","토","금","수"];
  return {ilgan:"乙",ilOh:ohMap[(y%5)],dayJj:0,monthCg:0};
}

// ─────────────────────────────────────────────────────────────
// 1. MonthlyModal (saju_monthly) — 월별 운세 풀버전
// ─────────────────────────────────────────────────────────────
const MONTH_DATA=[
  {m:1,mood:"🔥",grade:"대길",good:true,short:"새해 첫 달부터 강한 에너지",text:"새해 첫 달부터 강한 기운이 들어와요. 중요한 시작과 결정은 이 달에 해야 해요.",detail:{money:"새로운 수입원을 탐색하기 좋은 달이에요. 과감하게 제안하거나 연락하세요.",love:"솔로라면 소개팅에 나가보세요. 첫 만남의 기운이 강한 달이에요.",career:"새 프로젝트 시작, 이직 시도 모두 좋아요.",health:"환절기 면역 관리가 중요해요.",lucky:"1/8, 1/14, 1/19"}},
  {m:2,mood:"❤️",grade:"길",good:true,short:"인연의 달",text:"인연의 기운이 강한 달이에요. 솔로라면 새로운 만남이, 연애 중이라면 관계가 깊어져요.",detail:{money:"수입보다 지출 관리에 집중하세요.",love:"가장 인연 기운이 강한 달이에요.",career:"팀워크와 협업에서 좋은 결과가 나와요.",health:"심장 건강에 주의하세요.",lucky:"2/4, 2/11, 2/22"}},
  {m:3,mood:"⚠️",grade:"주의",good:false,short:"충 기운 — 신중하게",text:"충 기운이 살짝 들어오는 달. 큰 결정은 피하세요.",detail:{money:"큰 투자나 계약은 이 달을 피하세요.",love:"오해가 생기기 쉬운 달이에요.",career:"기존 업무를 완성하는 데 집중하세요.",health:"환절기 건강 관리가 가장 중요한 달이에요.",lucky:"3/7, 3/15"}},
  {m:4,mood:"💰",grade:"대길",good:true,short:"올해 최고의 달",text:"4월이 올해 중 가장 강한 기운의 달이에요. 재물과 직업 모두 좋아요.",detail:{money:"올해 재물운이 가장 강한 달이에요. 중요한 재무 결정을 이 달에 하세요.",love:"인연과 재물이 동시에 좋은 달이에요.",career:"이직, 승진, 새 사업 모두 4월이 최적이에요.",health:"기운이 강하지만 과로에 주의하세요.",lucky:"4/3, 4/8, 4/14, 4/19"}},
  {m:5,mood:"💼",grade:"길",good:true,short:"직업·사업 강세",text:"커리어 관련 중요한 행동을 하기 좋은 달이에요.",detail:{money:"수입이 꾸준히 들어오는 달이에요.",love:"안정적인 달이에요. 깊어지는 계기가 생겨요.",career:"중요한 프레젠테이션, 면접에 좋아요.",health:"운동을 시작하기 좋은 달이에요.",lucky:"5/5, 5/12, 5/20"}},
  {m:6,mood:"✨",grade:"길",good:true,short:"상반기 마무리",text:"시작한 것들이 결실을 맺기 시작하는 달이에요.",detail:{money:"상반기 재물 결산의 달이에요.",love:"관계가 한 단계 깊어져요.",career:"상반기 성과를 정리하고 하반기 계획을 세우세요.",health:"여름 시작, 수분 보충이 중요해요.",lucky:"6/6, 6/15, 6/22"}},
  {m:7,mood:"😐",grade:"보통",good:false,short:"안정·내실 시기",text:"에너지가 잠시 안정되는 달. 내실을 다지기 좋아요.",detail:{money:"큰 지출보다 현상 유지가 맞는 달이에요.",love:"관계에서 답답함을 느낄 수 있어요.",career:"새로운 도전보다 현재 업무에 집중하세요.",health:"무더위에 과로하지 마세요.",lucky:"7/7, 7/14, 7/21"}},
  {m:8,mood:"🌊",grade:"변화",good:true,short:"예상치 못한 변화",text:"변화의 기운이 들어오는 달. 유연하게 받아들이세요.",detail:{money:"예상치 못한 수입이나 지출이 있을 수 있어요.",love:"의외의 곳에서 인연이 생길 수 있어요.",career:"새로운 기회나 제안이 들어와요.",health:"면역력 관리가 중요해요.",lucky:"8/8, 8/15, 8/22"}},
  {m:9,mood:"💪",grade:"길",good:true,short:"하반기 두 번째 기회",text:"하반기 에너지가 다시 올라오는 달이에요.",detail:{money:"하반기 재물 흐름이 다시 좋아져요.",love:"인연의 기운이 다시 강해져요.",career:"포기했던 것들에 다시 도전해보세요.",health:"가을 환절기 면역 관리가 중요해요.",lucky:"9/9, 9/15, 9/24"}},
  {m:10,mood:"💰",grade:"대길",good:true,short:"하반기 최고의 달",text:"재물운이 다시 강하게 들어오는 달이에요.",detail:{money:"하반기 재물운 최고의 달. 들어오는 돈을 잘 지키세요.",love:"중요한 데이트나 고백에 좋아요.",career:"승진, 이직, 계약에 좋은 달이에요.",health:"건강이 가장 안정적인 달이에요.",lucky:"10/8, 10/14, 10/22"}},
  {m:11,mood:"🌙",grade:"보통",good:false,short:"마무리 준비",text:"올해를 마무리하고 내년을 설계하는 달이에요.",detail:{money:"올해 재물 정산. 내년 계획을 세우세요.",love:"관계를 돌아보는 달이에요.",career:"올해 성과 정리, 내년 비전 수립.",health:"연말 과음·과식에 주의하세요.",lucky:"11/7, 11/15, 11/22"}},
  {m:12,mood:"🎉",grade:"길",good:true,short:"결실 확인",text:"올해의 결실이 보이기 시작하는 달이에요.",detail:{money:"올해 목표 재물을 확인하고 내년 계획을 확정하세요.",love:"연말에 소중한 사람과의 시간이 관계를 깊게 만들어요.",career:"올해 성과를 정리하고 내년 비전을 세우세요.",health:"건강하게 새해를 맞이하세요.",lucky:"12/7, 12/14, 12/22"}},
];

export function MonthlyModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  const yr=new Date().getFullYear();
  // v275: 인물 등록되면 인트로 두번 안 뜨도록 → 바로 q1
  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[selMonth,setSelMonth]=useState(preloadResult?.selMonth||new Date().getMonth()+1);
  const[openMonths,setOpenMonths]=useState<Set<number>>(new Set());
  const[showPay,setShowPay]=useState(false);
  const[extraPay,setExtraPay]=useState<number|null>(null);
  const[dbData,setDbData]=useState<{gwe_number:number,months:{month:number,content:string}[]}|null>(preloadResult?.dbData||null);
  // DB 토정비결 fetch (loading 진입 시) — 월별운세 통합 데이터로 활용
  useEffect(()=>{
    if(step!=="loading")return;
    const birth=selectedPerson?.birth||"1990-01-01";
    fetch(`/api/tojeong?birth=${encodeURIComponent(birth)}&year=${yr}`)
      .then(r=>r.json())
      .then(j=>{if(!j.error)setDbData({gwe_number:j.gwe_number,months:j.months||[]});})
      .catch(()=>{});
  },[step,selectedPerson,yr]);
  // selMonth의 DB content 추출 (있으면)
  const dbCurContent=dbData?.months?.find(m=>m.month===selMonth)?.content||null;
  const[extraPaid,setExtraPaid]=useState<number[]>([]);

  const focusArea=ans2||"전체 흐름";
  const cur=MONTH_DATA[selMonth-1];

  function goResult(){
    setStep("loading");
  }
  function onLoaded(){
    setStep("result");
    addHistory({icon:"🌙",name:"월별 운세",svcId:"saju_monthly",person:nm,result:`${selMonth}월 ${cur.grade}`,date:new Date().toLocaleDateString("ko-KR"),preQuestions:{focus:ans1,area:ans2},resultType:{_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}});
  }
  function buyExtra(m:number){
    setExtraPay(m);
    setShowPay(true);
  }
  function extraPayDone(){
    if(extraPay)setExtraPaid([...extraPaid,extraPay]);
    setShowPay(false);
    if(extraPay)setSelMonth(extraPay);
    setExtraPay(null);
  }

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(155,143,212,0.55)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#9B8FD4",marginBottom:6,lineHeight:1.4}}>🌙 월별 운세</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;한 달 한 달, 내 사주에 새겨진 흐름의 지도&rdquo;</div>
          {/* 12달 애니메이션 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4,marginBottom:16,padding:"10px",background:"rgba(212,175,55,0.08)",borderRadius:12,border:"1px solid rgba(212,175,55,0.2)"}}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((m,i)=>(<div key={m} style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"8px 2px",fontSize:11,fontWeight:700,color:"var(--white)",border:"1px solid rgba(212,175,55,0.15)",animation:`laserScan 3s ease-in-out infinite ${i*0.1}s`}}>{m}월</div>))}
          </div>
          {/* 포인트 — 테두리 제거, 내용 유지 */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["🌟","월간 총운","그 달의 핵심 메시지와 키워드"],["📊","영역별 점수","재물·연애·건강·직업 4영역"],["📅","길일·주의일","구체 날짜와 추천 행동"],["🎯","집중 영역 맞춤","사전질문 기반 1:1 풀이"],["✨","개운법","그 달 운을 살리는 구체 방법"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:"var(--white)"}}>{f[1]}</div><div style={{fontSize:10,color:"#C1D1C1"}}>{f[2]}</div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--mist)"}}>980원 <span style={{opacity:0.7}}>· 다른 달 추가 380원</span></div>
        </div>
        <button onClick={()=>{
          if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"saju_monthly",icon:"🌙",name:"월별 운세",desc:"",price:"980원"});onClose();return;}
          setStep("q1");
        }} style={{background:"#9B8FD4",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(155,143,212,0.4)",fontFamily:"inherit",marginTop:10}}>원하는 달 디테일한 운세 보기 (980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q1"&&<PreQA iconTitle={`🌙 ${nm}님의 월별 운세`} subtitle="더 정확한 분석을 위해" title="어느 달이 가장 궁금한가요?" step={1} total={2} answer={ans1} setAnswer={setAns1} onNext={()=>setStep("q2")} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"saju_monthly",icon:"🌙",name:"월별 운세",desc:"",price:"980원"});onClose();}}} opts={[{e:"📅",l:"이번 달"},{e:"📅",l:"다음 달"},{e:"📅",l:"올해 하반기 전체"},{e:"📅",l:"내년 1년"}]} onClose={onClose}/>}
      {step==="q2"&&<PreQA iconTitle={`🌙 ${nm}님의 월별 운세`} subtitle="더 정확한 분석을 위해" title="가장 중점을 두고 싶은 영역은?" step={2} total={2} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>setStep("q1")} opts={[{e:"💰",l:"재물·수입"},{e:"❤️",l:"연애·인연"},{e:"💼",l:"직업·사업"},{e:"🌿",l:"건강"},{e:"🌟",l:"전체 흐름"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">🌙 월별 운세</div>
        <div className="ms">사주 기반 월별 흐름 분석 · 980원</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          {ans1&&<div style={{fontSize:11,color:"var(--white)",marginBottom:3}}>📅 {ans1}</div>}
          {ans2&&<div style={{fontSize:11,color:"var(--white)"}}>🎯 {ans2}</div>}
        </div>
        {PayStepComp?<PayStepComp price="980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="saju_monthly"/>:<>
          <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
          <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
        </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="🌙" title={`${nm}님의 ${selMonth}월 운세 분석 중...`} msgs={["사주 천간지지 배열 중... 🌙","월간 흐름 계산 중... 📅","길일·주의일 추출 중... ✨","집중 영역 맞춤 분석 중... 🎯","마지막 마무리 중... 💫"]}/>}
      {step==="result"&&<>
        <div id="monthly-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1: 총운 + 사주 헤더 + 영역별 점수 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 월별 운세 리포트"
          title={`PAGE 1 · ${selMonth}월 총운 + 영역별`}
          hash={`#천기월별운세 #${selMonth}월 #${cur.grade}`}
        >
          <div style={{textAlign:"center",marginBottom:6}}>
            {/* v654: 거대 달 이모지 삭제, 제목에 이모지 통합 */}
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:4}}>🌙 {nm}님의 {selMonth}월 운세</div>
            <div style={{fontSize:12,color:"#7A5C00",fontWeight:700}}>{cur.grade} · {cur.short}</div>
          </div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson}/>
          <SajuHeaderCard pillars={["丙","午"]} labels={["천간","지지"]} subtitle={`${selMonth}월 핵심 기운 — ${cur.short}`}/>
          {(ans1||ans2)&&<div style={{background:"#f8f9fa",borderRadius:9,padding:"12px 14px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:6,fontWeight:800}}>✦ {nm}님 맞춤 분석</div>
            <div style={{fontSize:12,color:"#222",lineHeight:1.7}}>{ans1&&<>📅 {ans1}<br/></>}{ans2&&<>🎯 {ans2}</>}</div>
          </div>}
        <WhiteCard label="월간 총운" emoji="🌟">
          {dbCurContent&&<div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:4,fontWeight:700}}>📜 토정비결 #{dbData?.gwe_number}괘 — {selMonth}월 원문</div>
            <div style={{fontSize:13,color:"#222",lineHeight:1.85,fontStyle:"italic"}}>"{dbCurContent}"</div>
          </div>}
          <Para text={`${nm}님, ${selMonth}월의 핵심을 솔직하게 말씀드릴게요. ${cur.text} 이 달은 일간 ${sajuInfo.ilgan}(${sajuInfo.ilOh}) 사주에 ${cur.good?"꽤 잘 맞는":"신중함이 필요한"} 시기예요.`}/>
          <Para text={`${focusArea.includes("재물")?cur.detail.money:focusArea.includes("연애")?cur.detail.love:focusArea.includes("직업")?cur.detail.career:focusArea.includes("건강")?cur.detail.health:`이 달은 전체적으로 ${cur.good?"기회가 많은":"조심이 필요한"} 시기예요. 어느 영역이든 ${cur.good?"적극적으로 움직이세요":"무리하지 말고 안정을 추구하세요"}.`}`}/>
        </WhiteCard>
        <WhiteCard label={`${selMonth}월 영역별 점수`} emoji="📊">
          <ScoreRow items={[
            {e:"💰",n:"재물",s:cur.good?72+selMonth%20:48+selMonth%15},
            {e:"❤️",n:"연애",s:cur.good?68+selMonth%18:52+selMonth%12},
            {e:"🌿",n:"건강",s:cur.good?75+selMonth%15:55+selMonth%10},
            {e:"💼",n:"직업",s:cur.good?78+selMonth%14:50+selMonth%18},
          ]}/>
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 2: 영역별 상세 + 길일 + 개운법 + 추가결제 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 월별 운세 리포트"
          title="PAGE 2 · 영역별 상세 + 길일 + 개운법"
          hash="#천기월별운세 #영역별상세 #길일"
        >
        <WhiteCard label="영역별 상세 풀이" emoji="📝">
          {[["💰","재물",cur.detail.money],["❤️","연애",cur.detail.love],["🌿","건강",cur.detail.health],["💼","직업",cur.detail.career]].map((d,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#111",marginBottom:5}}>{d[0]} {d[1]}</div>
              <div style={{fontSize:12,color:"#333",lineHeight:1.85,paddingLeft:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>{d[2]}</div>
            </div>
          ))}
        </WhiteCard>
        <WhiteCard label={`${selMonth}월 길일 & 주의일`} emoji="📅">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"rgba(46,125,50,0.06)",borderRadius:10,padding:"10px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#2E7D32",marginBottom:6}}>✦ 길일</div>
              <div style={{fontSize:11,color:"#333"}}>{cur.detail.lucky}</div>
              <div style={{fontSize:10,color:"#666",marginTop:4}}>중요한 결정·미팅에 활용하세요</div>
            </div>
            <div style={{background:"rgba(198,40,40,0.06)",borderRadius:10,padding:"10px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#C62828",marginBottom:6}}>⚠️ 주의일</div>
              <div style={{fontSize:11,color:"#333"}}>{selMonth}/{(selMonth*3)%28+1}, {selMonth}/{(selMonth*7)%28+1}</div>
              <div style={{fontSize:10,color:"#666",marginTop:4}}>큰 결정·계약은 피하기</div>
            </div>
          </div>
        </WhiteCard>
        <WhiteCard label={`${selMonth}월 ${nm}님 개운법`} emoji="✨">
          {[`${cur.good?"초록":"파랑"}색 계열 소품을 가까이 두기 — 이 달 기운을 보충해줘요`,
            "아침에 따뜻한 차 한 잔으로 하루 시작 — 일간 기운 안정",
            `${["월","화","수","목","금","토","일"][selMonth%7]}요일이 이 달의 행운 요일`,
            `행운 숫자: ${selMonth*2-1}, ${selMonth+8}, ${selMonth*3}`,
            `${cur.good?"동":"북"}쪽 방향 활동에 좋은 기운이 모여요`].map((g,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8,padding:"9px 12px",background:"rgba(212,175,55,0.05)",borderRadius:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>
              <span style={{fontSize:14,flexShrink:0}}>✨</span>
              <div style={{fontSize:12,color:"#333",lineHeight:1.7}}>{g}</div>
            </div>
          ))}
        </WhiteCard>
        {/* 다른 달 추가결제 — 사주아이 스타일 */}
        <div style={{background:"#f8f9fa",border:"1px solid #e5e7eb",borderRadius:14,padding:"16px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
          <div style={{fontSize:11,color:"#7A5C00",letterSpacing:2,marginBottom:4,fontWeight:800,textAlign:"center"}}>🔓 다른 달도 펼쳐보세요</div>
          <div style={{fontSize:10,color:"#8b6f1c",marginBottom:12,textAlign:"center"}}>{selMonth}월은 무료로 보셨어요 · 다른 달은 각 380원</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {MONTH_DATA.map(m=>{
              const isCur=m.m===selMonth;
              const isPaid=extraPaid.includes(m.m);
              return <button key={m.m} onClick={()=>{if(isCur)return;if(isPaid){setSelMonth(m.m);setOpenMonths(new Set());}else{buyExtra(m.m);}}} style={{padding:"10px 4px",borderRadius:10,border:isCur?"2px solid #D4AF37":isPaid?"1.5px solid #5FC49E":"1px solid rgba(201,167,78,0.4)",background:isCur?"#fff8eb":isPaid?"rgba(95,196,158,0.12)":"rgba(255,255,255,0.7)",color:"#5a4316",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:isCur?"default":"pointer",textAlign:"center",position:"relative",boxShadow:isCur?"none":"0 2px 6px rgba(0,0,0,0.06)"}}>
                {!isCur&&!isPaid&&<div style={{position:"absolute",top:3,right:5,fontSize:9,opacity:0.5}}>🔒</div>}
                {isPaid&&<div style={{position:"absolute",top:3,right:5,fontSize:9,color:"#059669"}}>✓</div>}
                <div style={{fontWeight:900}}>{m.m}월</div>
                <div style={{fontSize:8,color:isCur?"#7A5C00":isPaid?"#059669":"#8b6f1c",marginTop:2,fontWeight:600}}>{isCur?"보는 중":isPaid?"열람":m.grade==="대길"?"대길":m.grade==="주의"?"주의":"+380원"}</div>
              </button>;
            })}
          </div>
        </div>
        </ResultCard>

        {/* ━━━ PAGE 3: 천기 메시지 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 월별 운세 리포트"
          title="PAGE 3 · 천기의 메시지"
          hash={`#천기월별운세 #${selMonth}월 #천기메시지`}
        >
          <Affirm name={nm} text={`${nm}님, ${selMonth}월은 ${cur.good?"움직이는 사람에게 기회가 오는":"내실을 다져야 하는"} 달이에요.`}/>
        </ResultCard>
        </div>{/* ═══ monthly-capture 닫기 ═══ */}

        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🌅",sid:"yearly_unse",name:"연도별 운세 →",bc:"rgba(95,196,158,0.3)",q:"올해는?"},
          {ic:"🎋",sid:"newyear",name:"신년 운세 →",bc:"rgba(155,143,212,0.3)",q:"내년은?"},
          {ic:"📜",sid:"tojeong",name:"토정비결 →",bc:"rgba(255,107,173,0.3)",q:"500년 전통"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="monthly-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"🎋",name:"신년 운세",price:"1,980원",sid:"newyear"},{ic:"📜",name:"토정비결",price:"1,980원",sid:"tojeong"},{ic:"🔄",name:"대운 해설",price:"980원",sid:"daeun"},{ic:"🌅",name:"연도별 운세",price:"980원",sid:"yearly_unse"},{ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},{ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="saju_monthly" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="월별 개운 굿즈" sub={`${selMonth}월 기운을 살리는 아이템`}/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"saju_monthly",name:extraPay?`${extraPay}월 운세 추가`:"월별 운세"}} ctx={{}} cart={cart} setCart={setCart} onClose={extraPay?extraPayDone:()=>{setShowPay(false);goResult();}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// ─────────────────────────────────────────────────────────────
// 2. NewYearModal (newyear) — 신년 운세 풀버전
// ─────────────────────────────────────────────────────────────
export function NewYearModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  const yr=new Date().getFullYear();
  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[openMonths,setOpenMonths]=useState<Set<number>>(new Set());
  const[showPay,setShowPay]=useState(false);
  const[dbData,setDbData]=useState<{gwe_number:number,months:{month:number,content:string}[]}|null>(preloadResult?.dbData||null);
  // DB 토정비결 fetch (신년 12개월 통합 데이터로 활용)
  useEffect(()=>{
    if(step!=="loading")return;
    const birth=selectedPerson?.birth||"1990-01-01";
    fetch(`/api/tojeong?birth=${encodeURIComponent(birth)}&year=${yr}`)
      .then(r=>r.json())
      .then(j=>{if(!j.error)setDbData({gwe_number:j.gwe_number,months:j.months||[]});})
      .catch(()=>{});
  },[step,selectedPerson,yr]);
  // m -> DB content lookup
  const dbMonthMap:Record<number,string>={};
  if(dbData?.months)dbData.months.forEach(m=>{dbMonthMap[m.month]=m.content;});

  function goResult(){setStep("loading");}
  function onLoaded(){
    setStep("result");
    addHistory({icon:"🎋",name:"신년 운세",svcId:"newyear",person:nm,result:`${yr}년 신년 운세${dbData?` · 토정 #${dbData.gwe_number}괘`:""}`,date:new Date().toLocaleDateString("ko-KR"),preQuestions:{focus:ans1,need:ans2},resultType:{_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}});
  }

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(235,162,73,0.55)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#eba249",marginBottom:6,lineHeight:1.4}}>🎋 {yr}년 신년 운세</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;1~12월, 한 해의 운명을 미리 들여다보다&rdquo;</div>
          {/* 12달 길흉 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:16,padding:"10px",background:"rgba(212,175,55,0.08)",borderRadius:12,border:"1px solid rgba(212,175,55,0.2)"}}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((m,i)=>{
              const isG=[1,2,4,5,6,9,10,12].includes(m);
              const isB=[3,7,11].includes(m);
              return <div key={m} style={{background:isG?"rgba(212,175,55,0.12)":isB?"rgba(198,40,40,0.08)":"rgba(255,255,255,0.04)",border:`1px solid ${isG?"rgba(212,175,55,0.3)":isB?"rgba(198,40,40,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:8,padding:"6px 4px",textAlign:"center",animation:`laserScan 3s ease-in-out infinite ${i*0.12}s`}}>
                <div style={{fontSize:10,color:isG?"var(--gold)":isB?"#FF7675":"var(--mist)",fontWeight:isG||isB?700:400}}>{m}월</div>
                <div style={{fontSize:8,color:isG?"rgba(212,175,55,0.6)":isB?"rgba(255,118,117,0.6)":"rgba(168,196,184,0.4)"}}>{isG?"길":isB?"주의":"보통"}</div>
              </div>;
            })}
          </div>
          {/* 포인트 — 테두리 제거, 내용 유지 */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["🎋","1~12월 월별 운세","각 달 에너지·할 일·주의할 것"],["💰","돈 들어오는 달","올해 재물 기운 가장 강한 달"],["❤️","인연 타이밍","좋은 만남이 오는 시기"],["⚡","조심할 달","갈등·손재 주의 시기"],["🎁","2026년 개운법","올해 운을 극대화하는 방법"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:"var(--white)",lineHeight:1.5}}>{f[1]}</div><div style={{fontSize:10,color:"#C1D1C1",lineHeight:1.6,marginTop:2}}>{f[2]}</div></div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>{
          if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"newyear",icon:"🎋",name:"신년 운세",desc:"",price:"1,980원"});onClose();return;}
          setStep("q1");
        }} style={{background:"#eba249",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(235,162,73,0.4)",fontFamily:"inherit",marginTop:10}}>2026년 1~12월 풀코스 운세 보기 (1,980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q1"&&<PreQA iconTitle={`🎋 ${nm}님의 신년 운세`} subtitle="더 정확한 분석을 위해" title={`${yr}년에 가장 집중하고 싶은 건?`} step={1} total={2} answer={ans1} setAnswer={setAns1} onNext={()=>setStep("q2")} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"newyear",icon:"🎋",name:"신년 운세",desc:"",price:"1,980원"});onClose();}}} opts={[{e:"💰",l:"돈을 더 벌고 싶어"},{e:"❤️",l:"좋은 인연을 만나고 싶어"},{e:"💼",l:"일에서 성과를 내고 싶어"},{e:"🌿",l:"건강을 챙기고 싶어"},{e:"🌟",l:"인생 전체를 바꾸고 싶어"}]} onClose={onClose}/>}
      {step==="q2"&&<PreQA iconTitle={`🎋 ${nm}님의 신년 운세`} subtitle="더 정확한 분석을 위해" title="올해 나에게 가장 필요한 건?" step={2} total={2} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>setStep("q1")} opts={[{e:"💪",l:"용기"},{e:"🧘",l:"안정"},{e:"💡",l:"방향"},{e:"🤝",l:"인연"},{e:"💰",l:"돈"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">🎋 신년 운세</div>
        <div className="ms">{yr}년 1~12월 풀코스 · 1,980원</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          {ans1&&<div style={{fontSize:11,color:"var(--white)",marginBottom:3}}>🎯 집중: {ans1}</div>}
          {ans2&&<div style={{fontSize:11,color:"var(--white)"}}>🙏 필요: {ans2}</div>}
        </div>
        {PayStepComp?<PayStepComp price="1,980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="newyear"/>:<>
          <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
          <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
        </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="🎋" title={`${nm}님의 ${yr}년 12개월 분석 중...`} msgs={["올해 천간지지 배열 중... 🎋","1~12월 흐름 계산 중... 📅","도깨비가 올해 달력 훔쳐보는 중... 🪄","용왕님이 12개월치 재물 보따리 정리 중... 💰","마지막 마무리 중... 💫"]}/>}
      {step==="result"&&<>
        <div id="newyear-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1: 총운 + 사주 헤더 + 영역별 점수 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${yr}년 신년 운세 풀코스`}
          title={`PAGE 1 · ${yr}년 총운 + 영역별`}
          hash={`#천기신년운세 #${yr}년 #총운`}
        >
          <div style={{textAlign:"center",marginBottom:14}}>
            {/* v654: 거대 이모지 삭제, 제목에 이모지 통합 */}
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:4}}>🎋 {nm}님의 {yr}년 신년 운세</div>
            <div style={{fontSize:12,color:"#7A5C00",fontWeight:700}}>1~12월 풀코스 완성</div>
          </div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson}/>
          <SajuHeaderCard pillars={["丙","午"]} labels={["천간","지지"]} subtitle={`${yr}년 — 화(火) 기운이 폭발하는 병오년`}/>
          {(ans1||ans2)&&<div style={{background:"#f8f9fa",borderRadius:9,padding:"12px 14px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:6,fontWeight:800}}>✦ {nm}님 맞춤 분석</div>
            <div style={{fontSize:12,color:"#222",lineHeight:1.7}}>{ans1&&<>🎯 {ans1}<br/></>}{ans2&&<>🙏 {ans2}</>}</div>
          </div>}
          <WhiteCard label={`${yr}년 총운`} emoji="🌟">
            <Para text={`${nm}님, ${yr}년을 솔직하게 말씀드릴게요. 병오년은 화 기운이 폭발하는 해예요. 적극적으로 나서는 사람에게 기회가 집중되는 해예요. ${nm}님 일간 ${sajuInfo.ilgan}(${sajuInfo.ilOh})와 이 해의 기운이 꽤 잘 맞아요.`}/>
            <Para text={`특히 상반기(1~6월)에 중요한 기회가 몰려있어요. ${ans1.includes("돈")?"돈을 더 벌고 싶다는 마음, 올해 정말 잘 잡으셨어요. 4월과 10월이 재물 기운 최고의 달이에요.":ans1.includes("인연")?"좋은 인연을 만나고 싶은 마음이 올해 통해요. 2월과 9월이 인연의 기운이 가장 강한 달이에요.":ans1.includes("일")?"일에서 성과를 내고 싶다면 4월과 5월이 결정적이에요. 이직·승진·창업 모두 이 시기에 움직이세요.":"인생 전체를 바꾸고 싶다는 결심이 올해에 답을 줘요. 망설이는 사람보다 행동하는 사람이 답을 가져가요."}`}/>
            <Para text={`${ans2.includes("용기")?"올해 가장 필요한 건 용기. 사주에 이미 추진력은 있어요. 망설임을 줄이고 한 발만 내밀어보세요.":ans2.includes("안정")?"안정이 필요한 시기. 내실을 다지고 기반을 단단히 하면 하반기에 큰 도약이 와요.":ans2.includes("방향")?"명확한 방향을 찾는 해. 4월에 큰 깨달음이 와요. 그 직관을 믿으세요.":ans2.includes("인연")?"좋은 인연이 들어오는 해. 마음을 먼저 열어두면 자연스럽게 다가와요.":"돈이 필요한 만큼, 올해 4월·10월 두 번의 큰 재물 기운을 절대 놓치지 마세요."}`}/>
          </WhiteCard>
          <WhiteCard label={`${yr}년 영역별 점수`} emoji="📊">
            <ScoreRow items={[{e:"💰",n:"재물",s:78},{e:"❤️",n:"연애",s:72},{e:"🌿",n:"건강",s:75},{e:"💼",n:"직업",s:84}]}/>
            <div style={{fontSize:11,color:"#666",marginTop:8,textAlign:"center"}}>올해 직업운이 가장 강해요</div>
          </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 2: 1~12월 월별 운세 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${yr}년 신년 운세`}
          title="PAGE 2 · 1~12월 월별 흐름"
          hash="#천기신년운세 #1~12월흐름"
        >
          <WhiteCard label="1~12월 월별 운세" emoji="📅">
          <div style={{fontSize:11,color:"#444",marginBottom:10,fontWeight:600}}>👆 각 달을 <span style={{color:"#C4922A",fontWeight:800}}>탭</span>하면 자세한 내용이 펼쳐져요 (여러 개 동시에 열기 가능){dbData&&<span style={{color:"var(--gold)",marginLeft:6,fontWeight:700}}>· 토정비결 #{dbData.gwe_number}괘 DB 연동</span>}</div>
          {MONTH_DATA.map(r=>{
            const isOpen=openMonths.has(r.m);
            const dbCt=dbMonthMap[r.m];
            const toggle=()=>{const next=new Set(openMonths);if(next.has(r.m))next.delete(r.m);else next.add(r.m);setOpenMonths(next);};
            return <div key={r.m} style={{marginBottom:8,border:`1px solid ${r.good?"rgba(46,125,50,0.18)":"rgba(198,40,40,0.18)"}`,borderRadius:12,overflow:"hidden"}}>
              <button onClick={toggle} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:isOpen?(r.good?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)"):r.good?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:r.good?"rgba(46,125,50,0.18)":"rgba(198,40,40,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:800,color:r.good?"#2E7D32":"#C62828"}}>{r.m}월</div>
                <span style={{fontSize:18}}>{r.mood}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:800,color:r.good?"#2E7D32":"#C62828"}}>{r.grade}</div>
                  <div style={{fontSize:12,color:"#444",fontWeight:500}}>{r.short}</div>
                </div>
                <span style={{fontSize:16,color:"#666",transform:isOpen?"rotate(180deg)":"none",transition:".2s",fontWeight:700}}>▾</span>
              </button>
              {isOpen&&<div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                {dbCt&&<div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                  <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:3,fontWeight:700}}>📜 토정비결 원문</div>
                  <div style={{fontSize:12,color:"#222",lineHeight:1.85,fontStyle:"italic"}}>"{dbCt}"</div>
                </div>}
                {[["💰","재물",r.detail.money],["❤️","연애",r.detail.love],["🌿","건강",r.detail.health],["💼","직업",r.detail.career]].map((d,i)=>(
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#7A5C00",marginBottom:3}}>{d[0]} {d[1]}</div>
                    <div style={{fontSize:11,color:"#333",lineHeight:1.7,paddingLeft:9,borderLeft:"2px solid rgba(212,175,55,0.4)"}}>{d[2]}</div>
                  </div>
                ))}
                <div style={{background:"rgba(212,175,55,0.06)",borderRadius:8,padding:"7px 11px"}}>
                  <div style={{fontSize:10,color:"#7A5C00",fontWeight:700,marginBottom:2}}>📅 길일</div>
                  <div style={{fontSize:11,color:"#333"}}>{r.detail.lucky}</div>
                </div>
              </div>}
            </div>;
          })}
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 3: 개운법 + 천기 메시지 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${yr}년 신년 운세`}
          title="PAGE 3 · 개운법 + 천기 메시지"
          hash={`#천기신년운세 #${yr}년 #개운법 #천기메시지`}
        >
          <WhiteCard label={`${yr}년 ${nm}님 개운법`} emoji="🎁">
          {[`초록색·파란색 계열 지갑이나 소품이 올해 재물운을 높여요`,
            `목요일이 ${nm}님의 행운 요일 — 중요한 결정과 연락은 목요일에`,
            "동쪽·북동쪽 방향 활동에 좋은 기운이 있어요",
            "행운 숫자 3, 8, 12 — 중요한 날짜·번호 선택 시 활용",
            "물 가까운 곳(한강·바다·수영장)에서 활동하면 기운 보충",
            "매일 아침 물 한 잔 먼저 마시기 — 가장 강력한 개운 습관"].map((g,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8,padding:"9px 12px",background:"rgba(212,175,55,0.05)",borderRadius:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>
              <span style={{fontSize:14,flexShrink:0}}>✨</span>
              <div style={{fontSize:12,color:"#333",lineHeight:1.7}}>{g}</div>
            </div>
          ))}
        </WhiteCard>
          <Affirm name={nm} text={`${nm}님, ${yr}년은 생각만 하던 것들을 행동으로 옮길 해예요. 두려움보다 가능성을 먼저 보세요.`}/>
        </ResultCard>
        </div>{/* ═══ newyear-capture 닫기 ═══ */}

        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🌙",sid:"saju_monthly",name:"월별 운세 →",bc:"rgba(155,143,212,0.3)",q:"이번 달은?"},
          {ic:"📜",sid:"tojeong",name:"토정비결 →",bc:"rgba(255,107,173,0.3)",q:"500년 전통"},
          {ic:"🌅",sid:"yearly_unse",name:"연도별 운세 →",bc:"rgba(95,196,158,0.3)",q:"다른 해는?"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="newyear-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"📜",name:"토정비결",price:"1,980원",sid:"tojeong"},{ic:"📊",name:"월별 운세",price:"980원",sid:"saju_monthly"},{ic:"🔄",name:"대운 해설",price:"980원",sid:"daeun"},{ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},{ic:"🌅",name:"연도별 운세",price:"980원",sid:"yearly_unse"},{ic:"🌙",name:"오늘운세",price:"무료",sid:"today_unse"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="newyear" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title={`${yr}년 개운 굿즈`} sub="새해의 기운을 살리는 아이템"/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"newyear",name:"신년 운세"}} ctx={{}} cart={cart} setCart={setCart} onClose={()=>{setShowPay(false);goResult();}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// ─────────────────────────────────────────────────────────────
// 3. TojeongModal (tojeong) — 토정비결
// ─────────────────────────────────────────────────────────────
const GWAE_DATA={hanja:"坤爲地",num:8,name:"곤위지",subtitle:"대지처럼 모든 것을 받아들이고 꾸준히 나아가는 해",
  meaning:"곤(坤)은 땅이에요. 대지는 씨앗을 품고, 비를 맞고, 바람을 견디면서 조용히 만물을 키워내요. 화려하게 드러나지 않지만 가장 근본이 되는 기운이에요."};
const TOJEONG_MONTHS=[
  {m:1,grade:"대길",text:"새해 첫 달, 강한 기운으로 시작. 새로운 일을 시작하거나 중요한 연락을 하기 좋아요."},
  {m:2,grade:"중길",text:"인연의 기운이 강해요. 오래된 인연이 다시 연결될 수 있어요."},
  {m:3,grade:"주의",text:"이 달은 특히 건강과 재물에 조심하세요. 큰 결정은 다음 달로 미루세요."},
  {m:4,grade:"대길",text:"올해 최고의 달이에요. 이 달을 절대 그냥 보내지 마세요."},
  {m:5,grade:"중길",text:"직업과 사업 관련 좋은 소식이 올 수 있어요."},
  {m:6,grade:"중길",text:"안정적으로 나아가는 달. 지금까지 한 것들을 점검할 시기예요."},
  {m:7,grade:"주의",text:"충 기운이 들어오는 달. 여행이나 큰 이동은 삼가세요."},
  {m:8,grade:"대길",text:"재물이 들어오는 달. 이 달에 들어오는 돈은 잘 지키세요."},
  {m:9,grade:"중길",text:"인간관계가 활발해지는 달. 사람을 통해 기회가 와요."},
  {m:10,grade:"대길",text:"하반기 최고의 달. 직업과 재물 모두 좋아요."},
  {m:11,grade:"중길",text:"올해를 마무리할 준비를 하는 달이에요."},
  {m:12,grade:"중길",text:"마무리의 달. 새해를 기대하며 차분하게 마무리하세요."},
];

export function TojeongModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  const yr=new Date().getFullYear();
  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[openMonths,setOpenMonths]=useState<Set<number>>(new Set());
  const[showPay,setShowPay]=useState(false);
  const[dbData,setDbData]=useState<{gwe_number:number,months:{month:number,content:string}[]}|null>(preloadResult?.dbData||null);
  const[dbErr,setDbErr]=useState<string|null>(null);

  function goResult(){setStep("loading");}
  function onLoaded(){
    setStep("result");
    addHistory({icon:"📜",name:"토정비결",svcId:"tojeong",person:nm,result:`${yr}년 ${dbData?.gwe_number?`#${dbData.gwe_number}괘`:GWAE_DATA.name}`,date:new Date().toLocaleDateString("ko-KR"),preQuestions:{focus:ans1,age:ans2},resultType:{_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}});
  }
  // DB 토정비결 데이터 fetch (loading → result 전환 시)
  useEffect(()=>{
    if(step!=="loading")return;
    const birth=selectedPerson?.birth||"1990-01-01";
    fetch(`/api/tojeong?birth=${encodeURIComponent(birth)}&year=${yr}`)
      .then(r=>r.json())
      .then(j=>{
        if(j.error){setDbErr(j.error);return;}
        setDbData({gwe_number:j.gwe_number,months:j.months||[]});
      })
      .catch(e=>setDbErr(String(e)));
  },[step,selectedPerson,yr]);

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(232,200,122,0.55)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#E8C87A",marginBottom:6,lineHeight:1.4}}>📜 토정비결 {yr}</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;500년간 조선이 정월마다 열어본 운명서&rdquo;</div>
          {/* 작괘 비주얼 */}
          <div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.25)",borderRadius:12,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--mist)",letterSpacing:2,marginBottom:8}}>✦ 작괘 과정 ✦</div>
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:8}}>
              {["생년수","생월수","생일수","×","시수"].map((t,i)=>(
                <span key={i} style={{fontSize:10,padding:"4px 8px",background:"rgba(212,175,55,0.1)",borderRadius:6,color:"var(--gold)",fontWeight:700,animation:`laserScan 3s ease-in-out infinite ${i*0.15}s`}}>{t}</span>
              ))}
            </div>
            <div style={{fontSize:11,color:"#D4AF37",fontWeight:700}}>→ 64괘 중 나만의 괘 도출</div>
          </div>
          {/* 역사 박스 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",marginBottom:14,textAlign:"left",border:"1px solid rgba(212,175,55,0.15)"}}>
            <div style={{fontSize:10,color:"var(--gold)",fontWeight:800,marginBottom:4,letterSpacing:1}}>📖 토정비결이란?</div>
            <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.7}}>조선 중기 학자 이지함(이토정, 1517~1578) 선생이 창안한 한국 전통 운세서. 약 500년간 정월이면 온 조선인이 본 유서 깊은 예언법이에요.</div>
          </div>
          {/* 포인트 — 테두리 제거, 내용 유지 */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["📜","나만의 괘 + 현대 해석"],["🌟","올해 총운 핵심 메시지"],["📅","1~12월 월별 길흉"],["💰","재물운 상세 풀이"],["❤️","인연·결혼 기운"],["🌿","건강 주의사항"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,fontSize:11,color:"#D4AF37",fontWeight:700,lineHeight:1.6}}>
                <span style={{fontSize:13}}>{f[0]}</span><span>{f[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>{
          if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"tojeong",icon:"📜",name:"토정비결",desc:"",price:"1,980원"});onClose();return;}
          setStep("q2");
        }} style={{background:"#E8C87A",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#1A3C32",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(232,200,122,0.4)",fontFamily:"inherit",marginTop:10}}>500년 전통으로 올해 운세 보기 (1,980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q2"&&<PreQA iconTitle={`📜 ${nm}님의 토정비결`} subtitle="더 정확한 분석을 위해" title="현재 나이대는?" step={1} total={1} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"tojeong",icon:"📜",name:"토정비결",desc:"",price:"1,980원"});onClose();}}} opts={[{e:"👤",l:"20대"},{e:"👤",l:"30대"},{e:"👤",l:"40대"},{e:"👤",l:"50대+"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">📜 토정비결</div>
        <div className="ms">{yr}년 64괘 작괘 + 12개월 길흉 · 1,980원</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          {ans2&&<div style={{fontSize:11,color:"var(--white)"}}>👤 {ans2}</div>}
        </div>
        {PayStepComp?<PayStepComp price="1,980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="tojeong"/>:<>
          <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
          <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
        </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="📜" title={`${nm}님의 ${yr}년 토정비결 작괘 중...`} msgs={["생년월일로 작괘 계산 중... 📜","64괘 중 해당 괘 도출 중... ☯️","이토정 선생님께 허락 구하는 중... 🙏","500년 전통 해석법 적용 중... 🎋","1~12월 길흉 분석 중... 📅"]}/>}
      {step==="result"&&(()=>{
        // DB에서 받은 month별 content를 우선 사용, 없으면 fallback (TOJEONG_MONTHS)
        const monthList = dbData?.months?.length === 12
          ? dbData.months.map(m => ({m: m.month, grade: "DB", text: m.content, fromDb: true}))
          : TOJEONG_MONTHS.map(r => ({m: r.m, grade: r.grade, text: r.text, fromDb: false}));
        const gweLabel = dbData?.gwe_number ? `#${dbData.gwe_number}괘` : GWAE_DATA.name;
        return <>
        <div id="tojeong-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1: 괘 + 영역별 점수 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 500년 전통 토정비결"
          title={`PAGE 1 · ${yr}년 괘 + 영역별 점수`}
          hash={`#천기토정비결 #${yr}년 #${gweLabel.replace(/\s/g,"")}`}
        >
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:4}}>📜 {nm}님의 {yr}년 토정비결</div>
            <div style={{fontSize:12,color:"#7A5C00",fontWeight:700}}>{gweLabel}{dbErr?" (캐시 사용)":""}</div>
          </div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson}/>
          {ans2&&<div style={{background:"#f8f9fa",borderRadius:9,padding:"12px 14px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:6,fontWeight:800}}>✦ {nm}님 맞춤 분석</div>
            <div style={{fontSize:12,color:"#222",lineHeight:1.7}}>👤 연령: {ans2}</div>
          </div>}
        <WhiteCard label={`${nm}님의 ${yr}년 괘`} emoji="📜">
          <div style={{background:"rgba(212,175,55,0.06)",border:"2px solid rgba(212,175,55,0.4)",borderRadius:12,padding:"18px",marginBottom:12,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:900,color:"#7A5C00",marginBottom:6,fontFamily:"serif"}}>{dbData?.gwe_number||GWAE_DATA.hanja}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:4}}>{dbData?.gwe_number?`제 ${dbData.gwe_number}괘`:`${GWAE_DATA.name} — 제${GWAE_DATA.num}괘`}</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>{dbData?.gwe_number?`500년 전통 토정비결 ${(dbData as any).total_distinct||126}괘 중 ${nm}님 사주 매칭`:GWAE_DATA.subtitle}</div>
          </div>
          <Para text={`${nm}님의 올해 괘를 보는 순간 확신이 왔어요. ${dbData?.months?.[0]?.content||GWAE_DATA.meaning} 올해 ${nm}님은 이 괘의 기운 아래에 있어요.`}/>
          <Para text={`이 괘는 한 해의 흐름을 12개월로 나눠 보여줘요. 아래에서 각 달을 탭하면 그 달의 운세를 자세히 확인할 수 있어요.`}/>
          <Para text={`${ans2.includes("20")?"20대는 이 괘가 더 의미가 있어요. 지금이 평생의 뿌리를 내리는 시기예요. 화려한 결과보다 깊이를 추구하세요.":ans2.includes("30")?"30대에 이 괘가 나온 건 정말 의미가 커요. 지금 다지는 기반이 40대 이후의 모든 결실이 되어요.":ans2.includes("40")?"40대에 이 괘는 결실의 준비예요. 지금까지의 노력이 곧 큰 형태로 드러나기 시작해요.":"50대 이상에게 이 괘는 안정과 깊이의 시기를 알려요. 화려함보다 진짜 가치를 추구할 때예요."}`}/>
        </WhiteCard>
        <WhiteCard label="영역별 점수" emoji="📊">
          <ScoreRow items={[{e:"💰",n:"재물",s:72},{e:"❤️",n:"인연",s:68},{e:"💼",n:"직업",s:81},{e:"🌿",n:"건강",s:74}]}/>
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 2: 1~12월 월별 길흉 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 500년 전통 토정비결"
          title="PAGE 2 · 1~12월 월별 길흉"
          hash="#천기토정비결 #월별길흉"
        >
        <WhiteCard label="1~12월 월별 길흉" emoji="📅">
          <div style={{fontSize:11,color:"#444",marginBottom:10,fontWeight:600}}>👆 각 달을 <span style={{color:"#C4922A",fontWeight:800}}>탭</span>하면 {dbData?"500년 전통 토정비결 원문":"상세 내용"}이 펼쳐져요 (여러 개 동시에 열기 가능){dbData&&<span style={{color:"var(--gold)",marginLeft:6,fontWeight:700}}>· DB 연동</span>}</div>
          {monthList.map(r=>{
            const isOpen=openMonths.has(r.m);
            const isGood=r.grade!=="주의";
            const summary=r.text.length>50?r.text.slice(0,50)+"...":r.text;
            const toggle=()=>{const next=new Set(openMonths);if(next.has(r.m))next.delete(r.m);else next.add(r.m);setOpenMonths(next);};
            return <div key={r.m} style={{marginBottom:8,border:`1px solid ${isGood?"rgba(46,125,50,0.18)":"rgba(198,40,40,0.18)"}`,borderRadius:12,overflow:"hidden"}}>
              <button onClick={toggle} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:isOpen?(isGood?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)"):isGood?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:isGood?"rgba(46,125,50,0.18)":"rgba(198,40,40,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:800,color:isGood?"#2E7D32":"#C62828"}}>{r.m}월</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:800,color:isGood?"#2E7D32":"#C62828"}}>{r.grade==="DB"?"":r.grade}</div>
                  <div style={{fontSize:12,color:"#444",fontWeight:500}}>{summary}</div>
                </div>
                <span style={{fontSize:16,color:"#666",transform:isOpen?"rotate(180deg)":"none",transition:".2s",fontWeight:700}}>▾</span>
              </button>
              {isOpen&&<div style={{padding:"14px",background:"#fff",borderTop:"1px solid rgba(0,0,0,0.08)",fontSize:13,color:"#222",lineHeight:1.9}}>
                {r.text}
              </div>}
            </div>;
          })}
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 3: 핵심 조언 + 천기 메시지 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 500년 전통 토정비결"
          title="PAGE 3 · 핵심 조언 + 천기 메시지"
          hash="#천기토정비결 #핵심조언 #천기메시지"
        >
        <WhiteCard label={`${nm}님 핵심 조언`} emoji="✦">
          {[["💰","재물","큰 투자보다 꾸준한 저축이 올해 재물을 지키는 방법이에요. 4월·8월·10월에 들어오는 재물을 잘 지키세요. 특히 4월 재물 기운을 놓치지 마세요."],
            ["❤️","인연","올해 인연운은 나쁘지 않아요. 2월과 9월에 좋은 만남의 기회가 생겨요. 먼저 다가가는 사람에게 기회가 와요."],
            ["💼","직업·사업","4월과 10월이 올해 직업운이 가장 강한 달이에요. 이 시기에 중요한 결정을 내리거나 자신을 적극적으로 드러내세요."],
            ["🌿","건강","3월과 7월에 건강에 특히 신경 쓰세요. 무리한 음주나 과로는 이 달들에 조심해야 해요. 소화기 계통이 이 괘에서 가장 취약한 부위예요."]].map(r=>(
            <div key={r[0]} style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#111",marginBottom:5}}>{r[0]} {r[1]}</div>
              <div style={{fontSize:12,color:"#333",lineHeight:1.85,paddingLeft:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>{r[2]}</div>
            </div>
          ))}
        </WhiteCard>
          <Affirm name={nm} text={`${nm}님, 땅처럼 묵묵히 나아가는 사람이 결국 가장 멀리 가요. 올해 이 괘가 ${nm}님을 지키고 있어요.`}/>
        </ResultCard>
        </div>{/* ═══ tojeong-capture 닫기 ═══ */}

        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🎋",sid:"newyear",name:"신년 운세 →",bc:"rgba(155,143,212,0.3)",q:"꼼꼼한 1년"},
          {ic:"🌙",sid:"saju_monthly",name:"월별 운세 →",bc:"rgba(95,196,158,0.3)",q:"이번 달은?"},
          {ic:"🔄",sid:"daeun",name:"대운 해설 →",bc:"rgba(255,107,173,0.3)",q:"10년 큰그림"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="tojeong-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"🎋",name:"신년 운세",price:"1,980원",sid:"newyear"},{ic:"📊",name:"월별 운세",price:"980원",sid:"saju_monthly"},{ic:"🔄",name:"대운 해설",price:"980원",sid:"daeun"},{ic:"🌅",name:"연도별 운세",price:"980원",sid:"yearly_unse"},{ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},{ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="tojeong" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="토정비결 개운 굿즈" sub="올해 운을 다스리는 전통 아이템"/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
        </>;
      })()}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"tojeong",name:"토정비결"}} ctx={{}} cart={cart} setCart={setCart} onClose={()=>{setShowPay(false);goResult();}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// ─────────────────────────────────────────────────────────────
// 4. PastLifeModal (past_life) — 전생 운세
// ─────────────────────────────────────────────────────────────
// 전생 25유형 셀럽 풀 (각 10명, 저작권 회피: 이름 + 네이버 검색 링크)
const _PASTLIFE_CELEBS:Record<string,string[]>={
  "선비형":["이도현","박보검","차은우","임시완","안효섭","김선호","로운","육성재","BTS 진","한지민"],
  "예인형":["아이유","BTS 뷔","로제(BLACKPINK)","태연","백예린","조이(레드벨벳)","박재범","지코","권진아","정승환"],
  "농부형":["기안84","유해진","대성","김종민","차승원","류준열","김대호","이천희","육중완","송해"],
  "혁명가형":["유아인","한소희","화사","이효리","엠마 왓슨","전종서","이제훈","허성태","변요한","서태지"],
  "화원형":["김태리","전여빈","천우희","배두나","박소담","공효진","김다미","구교환","박정민","정호연"],
  "무사형":["이진욱","주지훈","장혁","김무열","위하준","공유","옥택연","지창욱","우도환","이준기"],
  "장군형":["마동석","정우성","조진웅","추성훈","김종국","허성태","드웨인 존슨","안정환","서장훈","강호동"],
  "야망캐형":["이병헌","송중기","유아인","김혜수","고현정","이부진","정용진","일론 머스크","톰 크루즈","조우진"],
  "암행어사형":["이제훈","김남길","BTS 지민","강하늘","이승기","여진구","윤균상","최우식","박해일","조승우"],
  "포수형":["하정우","곽도원","유해진","정만식","조진웅","박희순","진선규","배성우","성동일","마동석"],
  "왕족형":["송중기","이건희","이부진","윌리엄 왕세자","정해인","박보검","공유","현빈","김수현","강동원"],
  "객주형":["조세호","전현무","김구라","탁재훈","신동엽","남희석","지석진","김준호","박명수","하하"],
  "한량형":["덱스","지드래곤","주우재","조인성","유재석","BTS 뷔","노홍철","양세형","박재범","주지훈"],
  "상궁형":["김서형","배종옥","진경","김선영","장영남","문소리","라미란","김소진","염정아","김정난"],
  "주모형":["김숙","라미란","이정은","김수미","홍윤화","김민경","박나래","이영자","엄정화","박준금"],
  "상인형":["백종원","정용진","이재용","정의선","최태원","박진영","방시혁","일론 머스크","워렌 버핏","빌 게이츠"],
  "호위무사형":["정우성","조인성","공유","이진욱","주지훈","강동원","옥택연","최민호","NCT 지수","변우석"],
  "장인형":["봉준호","크리스토퍼 놀란","한석규","전도연","신구","이순재","김혜자","박찬욱","조승우","무라카미 하루키"],
  "훈장형":["설민석","오은영 박사","강형욱","김창옥","김경일","유시민","최진기","김영하","현우진","장승수"],
  "사헌부형":["조승우","한동훈","이제훈","표창원","권일용","이수정","이병헌","지성","남궁민","지진희"],
  "승려형":["혜민","법정","기안84","고두심","김혜자","윤여정","법륜","성철","원택","원성"],
  "무녀형":["김고은","박소담","에스파 카리나","비비(BIBI)","화사","이효리","곽선영","김옥빈","서예지","김소진"],
  "도인형":["침착맨","이외수","도올","기안84","김동욱","하정우","류승룡","박신양","임시완","강동원"],
  "신관형":["에스파 카리나","엠마 왓슨","베네딕트 컴버배치","김태리","티모시 샬라메","배두나","틸다 스윈튼","조승우","수현","클라우디아 킴"],
  "역술가형":["허영만","유재석","박성준","최제우","조우종","전현무","신동엽","김구라","홍진경","박명수"],
};

const PAST_LIFE_TYPES_MIN=[
  {ohaeng:"木",emoji:"📜",name:"선비형",item:"지혜의 붓",hashtag:"#갓생러 지식인",
   identity:"새벽 4시에 혼자 책 펴고 촛불 다 태워먹는 조선판 갓생러. 남들 잘 때 지식 쌓고, 그 지식으로 세상 바꾸려다 현실에 치인 낭만 지식인.",
   trace:"그래서 지금도 배우는 거 엄청 좋아하고, 남들한테 설명할 때 도파민 터짐. 책 한 권 잡으면 밤새 읽는 거 전생에서 온 거임.",
   message:"지식 쌓는 건 전생에 다 했음. 이번 생은 그 지식을 써먹을 시간이에요.",
   talent:["언어·글쓰기 능력","깊이 있는 학습력","논리적 분석력"],good_match:"도인형",rival:"상인형"},
  {ohaeng:"火",emoji:"⚔️",name:"무사형",item:"용기의 검",hashtag:"#불도저 낭만 검객",
   identity:"앞만 보고 달리다 벽을 만나도 돌아가지 않고 박살내는 낭만 검객. 생각보다 몸이 먼저 움직이고, 나중에 왜 그랬나 생각하는 열정 과잉형.",
   trace:"그래서 지금도 결정이 빠르고, 뒤돌아보지 않는 추진력이 있음.",
   message:"칼은 충분히 예리해요. 이제 언제 쓸지 타이밍을 배우세요.",
   talent:["폭발적인 추진력","빠른 결단력","열정적 에너지"],good_match:"농부형",rival:"선비형"},
  {ohaeng:"土",emoji:"🏰",name:"왕족형",item:"골드 크라운",hashtag:"#조선 제일 셀럽",
   identity:"태어날 때부터 VIP였던 조선판 셀럽. 걷는 것도 앉는 것도 다 폼이 나고, 타고난 품격으로 자연스럽게 주변을 장악하는 존재감 끝판왕.",
   trace:"그래서 지금도 어딜 가나 자연스럽게 주목받고, 싸구려를 못 참으며, 뭐든 최고를 원함.",
   message:"전생엔 태어난 것만으로 특별했지만, 이번 생엔 내가 만든 것으로 특별해지세요.",
   talent:["타고난 존재감","심미안과 품격","자연스러운 카리스마"],good_match:"상궁형",rival:"혁명가형"},
  {ohaeng:"金",emoji:"💰",name:"상인형",item:"황금 동전",hashtag:"#네고왕 거상",
   identity:"말빨 하나로 조선 상권을 씹어먹던 거상. 뭐든 사고팔 줄 알고, 물건 값이 얼마가 됐든 무조건 이득 보고 나오는 협상의 달인.",
   trace:"그래서 지금도 경제 감각이 남다르고, 어떤 상황에서도 이득을 찾아내는 본능이 있음.",
   message:"이번 생엔 돈만 버는 거 넘어서서 그 돈으로 의미 있는 걸 만드세요.",
   talent:["남다른 경제 감각","협상 능력","기회를 찾는 눈"],good_match:"상궁형",rival:"농부형"},
  {ohaeng:"水",emoji:"🌙",name:"무녀형",item:"문스톤 목걸이",hashtag:"#원조 타로마스터",
   identity:"조선 제일의 촉. 남들 고민은 기가 막히게 꿰뚫어 보면서 정작 내 앞가림은 못해서 맨날 밤비 맞으며 울던 원조 타로마스터.",
   trace:"그래서 지금도 근거 없는 쎄한 직감이 무조건 맞고, 친구들이 너한테만 오면 속마음 줄줄 부는 거임.",
   message:"남 걱정은 그만! 내 인생 떡상시키는 데 촉을 쓰세요.",
   talent:["타고난 직관력","사람 마음 읽는 능력","신비로운 감지 능력"],good_match:"상인형",rival:"왕족형"},
];

export function PastLifeModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,pushModal,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  // v578: 도감 inline 토글 (다른 도감과 동일 패턴)
  const[showCollection,setShowCollection]=useState(false);
  // 인물 미등록 가드 — 생년월일 없으면 인물 등록 요청 (선비형만 나오는 버그 방지)
  const _hasBirth=!!(selectedPerson?.birth&&selectedPerson.birth.replace(/[^0-9]/g,"-").split("-").filter(Boolean).length>=3);
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  // 일간 오행(한글) → 한자 五行 → 25종 중 5종 후보 → 일간(천간) seed로 1종 결정
  const ohMap:any={"목":"木","화":"火","토":"土","금":"金","수":"水"};
  const targetOh=ohMap[sajuInfo.ilOh]||"木";
  const ALL_TYPES=(PAST_LIFE_DB as any).types as any[];
  const candidates=ALL_TYPES.filter(t=>t.ohaeng===targetOh);
  // ilgan(천간) 글자코드를 seed로 5종 중 1종 픽 → 같은 사람은 항상 같은 결과
  // ⚠️ ilgan이 number(0~9)일 수도 있고 string("甲")일 수도 있어 String() 강제 변환 (2026-04-26 fix)
  const seed=String(sajuInfo.ilgan||"甲").charCodeAt(0)+String(nm||"").charCodeAt(0);
  const pl=candidates.length?candidates[seed%candidates.length]:ALL_TYPES[0];
  // 호환 필드 (기존 코드와 매핑)
  const plCompat:any={
    ohaeng:pl.ohaeng,emoji:pl.emoji,name:pl.name,
    item:pl.subtitle,hashtag:`#${pl.keyword}`,
    identity:pl.story,trace:pl.connection,message:pl.mission,
    talent:pl.talent||["깊이 있는 통찰력","독특한 감각","흔들리지 않는 의지"],
    good_match:pl.soulmate?.name||"도인형",rival:pl.rival?.name||"상인형",
    soulmateEmoji:pl.soulmate?.emoji||"🌊",rivalEmoji:pl.rival?.emoji||"💰",
    image:pl.image,goods_copy:pl.goods_copy,keyword:pl.keyword,
  };
  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[showPay,setShowPay]=useState(false);
  const[showAllTypes,setShowAllTypes]=useState(false);
  // v611: 4탭 인덱스 (0:인연+닮은영혼 / 1:카르마 / 2:이번생 / 3:영혼결+천기한마디)
  const[pastTab,setPastTab]=useState(0);

  // ⚠️ 광고퍼널에서 인물 선택 후 다시 모달 진입 시 인트로 무한반복 방지
  // v584: mount 시점에만 자동 진입 (의존성 빈 배열) — 사용자가 q1에서 이전 누르면 info로 정상 복귀
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(_hasBirth&&!preloadResult){
      setStep("q1");
    }
  },[]);

  function goResult(){setStep("loading");}
  function onLoaded(){
    setStep("result");
    const typeIdx=ALL_TYPES.indexOf(pl)+1;
    addHistory({icon:"⏳",name:"전생 운세",svcId:"past_life",person:nm,result:`${plCompat.name}`,date:new Date().toLocaleDateString("ko-KR"),resultType:{character_type:typeIdx,name:pl.name,ohaeng:pl.ohaeng,emoji:pl.emoji,ans1,ans2,_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},preQuestions:{curious:ans1,drawn:ans2}});
  }

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(115,79,56,0.55)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#c4ad94",marginBottom:16,lineHeight:1.5}}>👑 500년 전 사주로 본<br/>나의 전생의 기운은?</div>
          {/* 포인트 — 테두리 제거, 내용 유지 (브라운 톤) */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["⏳","25종 중 내 전생 정체","사주 일간 오행으로 결정"],["💪","전생에서 가져온 재능 3가지","지금 잘하는 것의 전생 기원"],["❤️","전생 찰떡 동료 & 라이벌","함께한 인연과 맞선 상대"],["🔮","3단계 서사","전생 → 현생 흔적 → 메시지"],["🛍️","소울 아이템","전생부터 이어진 행운 아이템"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:"var(--white)"}}>{f[1]}</div><div style={{fontSize:10,color:"var(--mist)"}}>{f[2]}</div></div>
              </div>
            ))}
          </div>
          {/* 오행 5종 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12,padding:"10px",background:"rgba(115,79,56,0.08)",borderRadius:12,border:"1px solid rgba(115,79,56,0.25)"}}>
            {[["🌿","木","5종"],["🔴","火","5종"],["🟡","土","5종"],["⚪","金","5종"],["🌊","水","5종"]].map((x,i)=>(
              <div key={x[1]} style={{textAlign:"center",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(115,79,56,0.22)",borderRadius:8,padding:"7px 4px",animation:`laserScan 3s ease-in-out infinite ${i*0.15}s`}}>
                <div style={{fontSize:14,marginBottom:3}}>{x[0]}</div>
                <div style={{fontSize:11,color:"#c4ad94",fontWeight:700}}>{x[1]}</div>
                <div style={{fontSize:9,color:"var(--mist)"}}>{x[2]}</div>
              </div>
            ))}
          </div>
          {/* 25종 전생 캐릭터 미리보기 — 제일 하단 */}
          <div style={{background:"rgba(115,79,56,0.06)",border:"1px solid rgba(115,79,56,0.25)",borderRadius:12,padding:"10px 8px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#c4ad94",marginBottom:8,letterSpacing:0.5,textAlign:"center"}}>👑 25종 전생 캐릭터 중 1종 매칭</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:3}}>
              {((PAST_LIFE_DB as any).types as any[]).slice(0,25).map((t:any)=>(
                <div key={t.id} title={t.name} style={{aspectRatio:"1",borderRadius:5,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                  {t.image?<img src={t.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";}}/>:null}
                  <div style={{position:"absolute",fontSize:11,opacity:t.image?0:1}}>{t.emoji}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={()=>{
          if(!_hasBirth){
            if(onRequestPerson){onRequestPerson({id:"past_life",icon:"⏳",name:"전생 운세",desc:"500년 전 나의 정체",price:"980원"});onClose();return;}
            alert("⏳ 전생 운세는 사주 기반으로 25종 중 1종을 매칭해드려요.\n\n인물 등록(생년월일) 후 다시 시도해주세요!");onClose();return;
          }
          setStep("q1");
        }} style={{background:"linear-gradient(135deg,#734f38,#4d3929)",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(115,79,56,0.4)",fontFamily:"inherit",marginTop:10}}>내 전생 정체 확인하기 (980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q1"&&<PreQA iconTitle={`⏳ ${nm}님의 전생 운세`} subtitle="더 정확한 분석을 위해" title="전생에서 가장 궁금한 건?" step={1} total={2} answer={ans1} setAnswer={setAns1} onNext={()=>setStep("q2")} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"past_life",icon:"⏳",name:"전생 운세",desc:"500년 전 나의 정체",price:"980원"});onClose();}}} opts={[{e:"👑",l:"어떤 신분·직업이었을까"},{e:"🌍",l:"어느 나라·시대에 살았을까"},{e:"❤️",l:"지금 내 주변 인연과의 전생 관계"},{e:"🔮",l:"전생이 지금 내 삶에 미치는 영향"}]} onClose={onClose}/>}
      {step==="q2"&&<PreQA iconTitle={`⏳ ${nm}님의 전생 운세`} subtitle="더 정확한 분석을 위해" title="요즘 이상하게 끌리는 게 있나요?" skipable step={2} total={2} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>setStep("q1")} opts={[{e:"🗺️",l:"특정 시대나 나라"},{e:"🌿",l:"자연·동물"},{e:"🎨",l:"특정 직업이나 예술"},{e:"🔮",l:"딱히 없어요"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">⏳ 전생 운세</div>
        <div className="ms">1회 분석 980원</div>
        {helpers?.PayStepComp
          ?<helpers.PayStepComp price="980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="past_life"/>
          :<>
            <button className="btn btn-p" onClick={()=>setShowPay(true)}>980원 결제하고 결과 보기 →</button>
            <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
          </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="⏳" title={`${nm}님의 전생 기록 탐색 중...`} msgs={["전생 기록 탐색 중... ⏳","사주에서 전생 흔적 찾는 중... 🔮","업보와 인연 계산 중... ☯️","전생 신분 특정 중... 👑","500년 전 기억 복원 중... 🌟","팩폭 준비 중... 😈"]}/>}
      {step==="result"&&<>
        <div id="pastlife-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1 (메인 캡쳐): 사주풀이 + 전생서사 3단계 통합 ━━━ */}
        <div style={{background:"#ffffff",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 28px rgba(0,0,0,0.15)",border:"1px solid rgba(212,175,55,0.3)"}}>
          <div style={{padding:"10px 16px 10px"}}>
          {/* v608: 헤더 부제 변경 — "500년 전 나의 운명 기운" */}
          <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 전생 운세 · 500년 전 나의 운명 기운</div>
          {/* v608: 제목 한 줄 (PAGE 1 부제 삭제) */}
          <div style={{textAlign:"center",fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",marginBottom:6,lineHeight:1.35}}>⏳ {nm}님의 <span style={{color:"#C4922A"}}>전생의 기운</span></div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson} hideDdi hideZodiac/>
          {/* 일러스트 (큰 네모) */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{width:"94%",aspectRatio:"1/1",borderRadius:14,overflow:"hidden",border:"3px double rgba(201,167,78,0.55)",boxShadow:"0 6px 20px rgba(201,167,78,0.25)",background:"linear-gradient(135deg,#fdfcf8,#f0e6d2)",position:"relative"}}>
              <img src={plCompat.image||`/past-life-cards/${plCompat.name}.png`} alt={plCompat.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling as HTMLElement;if(fb)fb.style.display="flex";}}/>
              <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:120}}>{plCompat.emoji}</div>
            </div>
          </div>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:24,fontWeight:900,color:"#1A1A1A",marginBottom:8,fontFamily:"'Noto Serif KR','Batang',serif"}}>{plCompat.emoji} {plCompat.name}</div>
            {/* v737: 2개 배지 나란히 — keyword(원조 타로마스터) + story 첫 문장(조선 제일의 촉) (사용자 명시) */}
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
              {(plCompat.hashtag||plCompat.keyword)&&<span style={{fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:14,background:"linear-gradient(135deg,#fffbe9,#fff5d4)",color:"#7A5C00",border:"1px solid rgba(212,175,55,0.4)",letterSpacing:0.3}}>{plCompat.hashtag||plCompat.keyword}</span>}
              {(plCompat.story||plCompat.identity)&&<span style={{fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:14,background:"linear-gradient(135deg,#fff5f0,#ffe9dd)",color:"#a14d2a",border:"1px solid rgba(196,108,42,0.35)",letterSpacing:0.3}}>{(plCompat.story||plCompat.identity).split(/[.!?]/)[0].trim()}</span>}
            </div>
          </div>
          {/* ☯️ 사주로 풀어본 이유 — v611: 큰제목 박스 밖으로 */}
          <div style={{textAlign:"center",marginBottom:8}}>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>☯️ 사주로 풀어본 이유</div>
          </div>
          <div style={{background:"#f8f9fa",borderRadius:12,padding:"14px 16px",marginBottom:16,borderLeft:"4px solid #C4922A"}}>
            <div style={{fontSize:12,color:"#555",lineHeight:1.75,wordBreak:"keep-all"}}>
              {nm}님의 사주에서 일간(日干)은 <strong style={{color:"#C4922A"}}>{sajuInfo.ilgan}</strong>이에요. 일간은 사주 8글자 중에서도 <strong>나 자신</strong>을 상징하는 가장 핵심적인 글자죠.
              <br/><br/>
              {sajuInfo.ilgan}({sajuInfo.ilOh}) 일간은 오행 중 <strong style={{color:"#C4922A"}}>{plCompat.ohaeng}({sajuInfo.ilOh})</strong> 기운을 띄어요. {plCompat.ohaeng==="木"?"성장·창의·문인의":plCompat.ohaeng==="火"?"열정·매력·예능의":plCompat.ohaeng==="土"?"안정·신뢰·풍요의":plCompat.ohaeng==="金"?"결단·의리·정의의":"지혜·깊이·직관의"} 에너지로, 전생에서도 이 기운을 따라 살았던 영혼이에요.
              <br/><br/>
              {plCompat.ohaeng} 기운을 가진 25명 중에서도 {nm}님의 사주 흐름과 가장 정확히 맞아떨어지는 전생 정체가 바로 <strong style={{color:"#C4922A"}}>{plCompat.name}</strong>이에요.
            </div>
          </div>
          {/* v771: 사전질문(ans1/ans2) 반영 — 답에 따라 다른 맞춤 안내 (이전엔 답이 결과에 안 쓰였음) */}
          {ans1&&<div style={{background:"#fdf6ec",borderRadius:12,padding:"14px 16px",marginBottom:16,borderLeft:"4px solid #C4922A"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#C4922A",marginBottom:6}}>🔮 {nm}님이 가장 궁금해한 것</div>
            <div style={{fontSize:12,color:"#555",lineHeight:1.75,wordBreak:"keep-all"}}>
              {ans1.includes("신분")?<>전생의 <strong>신분·직업</strong>이 가장 궁금하셨죠. {nm}님의 전생 정체는 바로 <strong style={{color:"#C4922A"}}>{plCompat.name}</strong> — 아래 전생 서사 [1] 전생의 정체성에서 자세히 풀어드릴게요.</>
              :ans1.includes("나라")||ans1.includes("시대")?<>전생에 <strong>어느 시대·나라</strong>에 살았는지 궁금하셨죠. <strong style={{color:"#C4922A"}}>{plCompat.name}</strong>로 살았던 그 시대 — 아래 전생 서사 3단계에서 배경까지 그려드릴게요.</>
              :ans1.includes("인연")?<>지금 주변 인연과의 <strong>전생 관계</strong>가 가장 궁금하셨죠. 아래 <strong>[전생 인연]</strong> 탭에서 전생 찰떡 동료·라이벌까지 짚어드릴게요.</>
              :<>전생이 지금 삶에 미치는 <strong>영향</strong>이 가장 궁금하셨죠. 아래 <strong>[현생 업보]·[이번 생에서는]</strong> 탭에서 그 흔적과 메시지를 풀어드릴게요.</>}
              {ans2&&!ans2.includes("딱히")&&<><br/><br/>요즘 <strong>{ans2}</strong>에 끌리신다고 했죠 — 그것도 전생의 기운이 보내는 신호일 수 있어요.</>}
            </div>
          </div>}
          {/* 📜 전생 서사 3단계 — v611: 큰제목 밖, 각 단계 관상짤 패턴 (소제목+회색박스) */}
          <div style={{textAlign:"center",marginBottom:8}}>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>📜 전생 서사 3단계</div>
          </div>
          <div style={{marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:2}}>[1] 전생의 정체성</div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",background:"#f8f9fa",padding:"8px 12px",borderRadius:12,wordBreak:"keep-all"}}>{plCompat.identity}</div>
          </div>
          <div style={{marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:2}}>[2] 내 몸에 남은 전생의 흔적</div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",background:"#f8f9fa",padding:"8px 12px",borderRadius:12,wordBreak:"keep-all"}}>{plCompat.trace}</div>
          </div>
          <div style={{marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:2}}>[3] 전생이 보내는 현생의 메시지</div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",background:"#f8f9fa",padding:"8px 12px",borderRadius:12,wordBreak:"keep-all"}}>{plCompat.message}</div>
          </div>
          {/* v736: ✦ 전생에서 가져온 재능 3가지 — [2] 안 → 3단계 다 끝나고 제일 하단으로 이동 (사용자 명시) */}
          <div style={{background:"rgba(201,167,78,0.08)",borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#C4922A",fontWeight:700,marginBottom:6}}>✦ 전생에서 가져온 재능 3가지</div>
            {plCompat.talent.map((t,i)=>(<div key={i} style={{fontSize:12,color:"#555",margin:"0 0 4px",paddingLeft:10,borderLeft:"2px solid rgba(201,167,78,0.5)"}}>{t}</div>))}
          </div>
          {/* 푸터 — 내관상보기 표준 (borderTop·-16 마진 패턴) */}
          <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:10,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderTop:"1px solid #f0f0f0",flexWrap:"wrap",gap:4}}>
            <span>#천기전생 #전생운세 #내전생 #{plCompat.name} #{(plCompat.keyword||"").replace(/\s/g,"")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
          </div>
        </div>

        {/* ━━━ PAGE 2 (탭 nav 카드 — 기질도 패턴) ━━━ */}
        {/* v615: 탭 nav만 별도 카드로 분리. 콘텐츠는 PAGE 3에서. 순서: 인연→카르마→영혼결→이번생 */}
        <div style={{background:"#ffffff",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 28px rgba(0,0,0,0.15)",border:"1px solid rgba(212,175,55,0.3)"}}>
          <div style={{padding:"14px 12px 12px"}}>
          <div style={{textAlign:"center",fontSize:11,marginBottom:10}}><span className="tab-hint-blink">👇 아래 <b>탭 버튼</b>을 눌러 분야별 상세 리포트를 확인하세요!</span></div>
          {/* v658: 탭 이름 통일 — 카르마 → 현생 업보, 이번 생 → 이번 생에서는 / v743: result-tabs 통일 */}
          <div className="result-tabs" style={{display:"flex",flexDirection:"column",gap:5}}>
            <div style={{display:"flex",gap:5}}>
              {[{i:0,ic:"💞",lb:"전생 인연"},{i:1,ic:"🔮",lb:"현생 업보"}].map(t=>(
                <button key={t.i} onClick={()=>setPastTab(t.i)} style={{flex:1,padding:"7px 6px",background:pastTab===t.i?"#1A3C32":"transparent",border:`1px solid ${pastTab===t.i?"#1A3C32":"#ddd"}`,color:pastTab===t.i?"#fff":"#7A5C00",borderRadius:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.ic} {t.lb}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:5}}>
              {[{i:2,ic:"⚖️",lb:"영혼의 결"},{i:3,ic:"🎯",lb:"이번 생에서는"}].map(t=>(
                <button key={t.i} onClick={()=>setPastTab(t.i)} style={{flex:1,padding:"7px 6px",background:pastTab===t.i?"#1A3C32":"transparent",border:`1px solid ${pastTab===t.i?"#1A3C32":"#ddd"}`,color:pastTab===t.i?"#fff":"#7A5C00",borderRadius:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.ic} {t.lb}</button>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* ━━━ PAGE 3 (탭 콘텐츠 카드) ━━━ */}
        {/* v615: 탭 라벨이 큰 제목, 각 박스 위는 관상짤 패턴 소제목 (fontSize:12, color:#333) */}
        <div style={{background:"#ffffff",borderRadius:18,overflow:"hidden",boxShadow:"0 8px 28px rgba(0,0,0,0.15)",border:"1px solid rgba(212,175,55,0.3)"}}>
          <div style={{padding:"10px 16px 10px"}}>
          <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 전생 운세 · 500년 전 나의 운명 기운</div>

          {/* ━━ 탭 0: 💞 전생 인연 ━━ */}
          {pastTab===0&&<>
            {/* 큰 제목 (탭 라벨) */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>💞 전생 인연</div>
            </div>
            {/* 💡 인연을 알아보는 신호 — v793: 맨 위로 (사용자 지시) */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>💡 인연을 알아보는 신호</div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",background:"#f8f9fa",padding:"8px 12px",borderRadius:12,wordBreak:"keep-all",marginBottom:12}}>
              현생에서 처음 만났는데도 <strong>"이 사람 어디서 봤더라"</strong>는 느낌이 강하면 — 전생에서 깊이 얽혔던 사이일 가능성이 높아요. 특히 <strong style={{color:"#C4922A"}}>{plCompat.good_match}·{plCompat.rival}</strong> 기운을 가진 사람이 주변에 있다면, 이번 생에서도 그 인연이 다시 펼쳐질 거예요.
            </div>
            {/* 소제목 (관상짤 패턴) */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>💖 전생 찰떡 동료 & 라이벌</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[
                {label:"💖 전생 찰떡 동료",name:plCompat.good_match,sub:"전생에 함께 걸었던 운명의 동료",bg:"linear-gradient(135deg,#fff5f8,#ffe7ef)",border:"rgba(244,114,182,0.3)",color:"#9d174d"},
                {label:"⚡ 전생 라이벌",name:plCompat.rival,sub:"맞부딪혀 성장시킨 운명의 상대",bg:"linear-gradient(135deg,#fff7ed,#fed7aa)",border:"rgba(220,38,38,0.3)",color:"#991b1b"},
              ].map((b,bi)=>{
                const matchPl=(PAST_LIFE_DB as any).types?.find?.((t:any)=>t.name===b.name);
                const imgSrc=matchPl?.image||`/past-life-cards/${b.name}.png`;
                return <div key={bi} style={{background:b.bg,borderRadius:14,padding:"12px 10px",textAlign:"center",border:`2px solid ${b.border}`}}>
                  <div style={{fontSize:10,color:b.color,marginBottom:6,fontWeight:700}}>{b.label}</div>
                  <div style={{width:64,height:64,margin:"0 auto 6px",borderRadius:10,overflow:"hidden",border:`2px solid ${b.border}`,background:"#fff"}}>
                    <img src={imgSrc} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";}}/>
                  </div>
                  <div style={{fontSize:14,fontWeight:900,color:b.color}}>{b.name}</div>
                  <div style={{fontSize:9,color:"#777",marginTop:4,lineHeight:1.5,wordBreak:"keep-all"}}>{b.sub}</div>
                </div>;
              })}
            </div>
            {/* 소제목 — 닮은 영혼 */}
            {_PASTLIFE_CELEBS[plCompat.name]&&<>
              <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>✨ {nm}님과 닮은 영혼</div>
              <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#555",marginBottom:8,textAlign:"center"}}>전생에서 같은 [{plCompat.name}] 길을 걸었던 영혼들 10명</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
                  {(helpers?.pickCelebs?helpers.pickCelebs(_PASTLIFE_CELEBS[plCompat.name],{birth:selectedPerson?.birth,gender:selectedPerson?.gender==="여"?"F":selectedPerson?.gender==="남"?"M":undefined,n:10}):_PASTLIFE_CELEBS[plCompat.name]).map((cn:string)=>(
                    <a key={cn} href={`https://search.naver.com/search.naver?query=${encodeURIComponent(cn)}`} target="_blank" rel="noreferrer" style={{fontSize:10,fontWeight:700,color:"#1A3C32",padding:"4px 8px",background:"#fffbe9",border:"1px solid rgba(212,175,55,0.4)",borderRadius:12,textDecoration:"none"}}>{plCompat.emoji} {cn}</a>
                  ))}
                </div>
                <div style={{fontSize:9,color:"#888",textAlign:"center",lineHeight:1.5,marginTop:8}}>이름 클릭 시 네이버 검색</div>
              </div>
            </>}
          </>}

          {/* ━━ 탭 1: ♻️ 카르마 ━━ */}
          {/* v658: ♻️ 카르마 → 🔮 현생에 남은 전생 업보로 큰 제목 변경, 회색박스 → 소제목으로 빼내기 */}
          {pastTab===1&&<>
            {/* 큰 제목 — 현생에 남은 전생 업보 */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>🔮 현생에 남은 전생 업보</div>
            </div>
            {/* v736: 현생 업보 3개 — 회색박스강조 패턴 적용 (사용자 컴플레인 "회색박스 모두 왜 없지?") */}
            {[
              ["💰 재물 업보",`전생에 ${plCompat.name.replace("형","")}로 살면서 가진 것에 집착하는 패턴이 이번 생 재물 흐름에 영향을 줘요. ${plCompat.name}은 재물을 어떻게 다루느냐에 따라 이번 생 재물운이 크게 달라져요.`],
              ["❤️ 인연 업보",`전생에서 깊은 인연을 맺었던 사람들이 이번 생에 다시 나타나요. 처음 만났는데 오래 알던 것 같은 사람이 있다면, 그 인연을 주목하세요.`],
              ["🌿 건강 체질",`전생에서 ${plCompat.name.replace("형","")}로 살면서 생긴 신체 패턴이 이번 생에도 이어지고 있어요. 전생의 생활 방식에서 온 취약한 부위가 있어요.`],
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:10,wordBreak:"keep-all",background:"#f8f9fa",padding:"12px 14px",borderRadius:9,borderLeft:"4px solid #D4AF37"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",marginBottom:5}}>{r[0]}</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.85}}>{r[1]}</div>
              </div>
            ))}
            {/* v736: 현생 업보 ↔ 풀어야 할 카르마 사이 구분선 (사용자 명시) */}
            <div style={{margin:"24px -2px 0",borderTop:"1px dashed rgba(0,0,0,0.12)",paddingTop:18}}>
              <div style={{textAlign:"center",marginBottom:14}}>
                <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>♻️ 풀어야 할 카르마</div>
              </div>
              <div style={{fontSize:12,color:"#555",lineHeight:1.85,marginBottom:14,wordBreak:"keep-all",paddingLeft:14,paddingRight:14}}>{nm}님의 영혼에는 전생부터 이어진 작은 업보가 있어요. 이건 무거운 짐이 아니라, 이번 생에 풀고 가면 영혼이 한층 더 자유로워지는 숙제 같은 거예요.</div>
              {/* v736: 풀어야 할 카르마 3개도 회색박스강조 패턴 통일 */}
              <div style={{marginBottom:10,wordBreak:"keep-all",background:"#f8f9fa",padding:"12px 14px",borderRadius:9,borderLeft:"4px solid #D4AF37"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",marginBottom:5}}>💸 재물 카르마</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.85}}>전생에 가졌던 것에 대한 집착·아쉬움이 이번 생 재물 패턴에 흔적을 남겼어요. 한번 잃으면 잊지 못하거나, 너무 쉽게 베풀고 후회하는 경향이 있다면 — 그건 전생의 잔상이에요. 이번 생엔 <strong>"흐름"</strong>으로 보세요. 들어오면 받고, 나가면 보내고. 그게 카르마를 푸는 첫걸음이에요.</div>
              </div>
              <div style={{marginBottom:10,wordBreak:"keep-all",background:"#f8f9fa",padding:"12px 14px",borderRadius:9,borderLeft:"4px solid #D4AF37"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",marginBottom:5}}>❤️ 인연 카르마</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.85}}>전생에 못다 한 사랑·우정·은혜가 이번 생에 비슷한 모습으로 다시 나타나요. 처음 만났는데 묘하게 끌리거나, 이유 없이 미운 사람이 있다면 — 그건 전생의 인연이 다시 풀어보자고 찾아온 거예요. 사랑하는 만큼만, 미워하지 않는 만큼만 — 그게 답이에요.</div>
              </div>
              <div style={{wordBreak:"keep-all",background:"#f8f9fa",padding:"12px 14px",borderRadius:9,borderLeft:"4px solid #D4AF37"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",marginBottom:5}}>🌿 건강 카르마</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.85}}>전생의 {plCompat.name.replace("형","")} 생활 방식이 이번 생 신체 패턴에도 이어져요. {plCompat.ohaeng==="木"?"간·근육·시력":plCompat.ohaeng==="火"?"심장·혈압·열":plCompat.ohaeng==="土"?"위장·소화·근심":plCompat.ohaeng==="金"?"폐·기관지·피부":"신장·방광·수면"} 부위가 가장 민감하니, 이 부분을 특히 챙기시면 영혼과 몸이 함께 가벼워져요.</div>
              </div>
            </div>
          </>}

          {/* ━━ 탭 2: ⚖️ 영혼의 결 ━━ */}
          {pastTab===2&&<>
            {/* 큰 제목 */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>⚖️ 영혼의 결</div>
            </div>
            {/* 소제목 — 영혼의 강점·약점 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>⚖️ 영혼의 강점·약점</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
              <div style={{background:"#eff8f1",borderRadius:10,padding:"11px 12px",border:"1px solid #b5d8c0"}}>
                <div style={{fontSize:10,color:"#16a34a",fontWeight:800,marginBottom:6}}>💪 타고난 강점</div>
                <div style={{fontSize:11,color:"#1e3a2a",lineHeight:1.7}}>
                  {plCompat.talent.map((t:string,i:number)=>(<div key={i} style={{marginBottom:3}}>· {t}</div>))}
                </div>
              </div>
              <div style={{background:"#fef2f2",borderRadius:10,padding:"11px 12px",border:"1px solid #fcb6b6"}}>
                <div style={{fontSize:10,color:"#dc2626",fontWeight:800,marginBottom:6}}>⚠️ 주의할 약점</div>
                <div style={{fontSize:11,color:"#7c1d1d",lineHeight:1.7}}>
                  <div style={{marginBottom:3}}>· {plCompat.ohaeng==="木"?"고집이 센 면이 있어요":plCompat.ohaeng==="火"?"감정이 너무 빨리 달아올라요":plCompat.ohaeng==="土"?"변화를 싫어해서 기회를 놓쳐요":plCompat.ohaeng==="金"?"날카로움이 인간관계를 다쳐요":"우유부단함으로 결정을 미뤄요"}</div>
                  <div style={{marginBottom:3}}>· 전생의 패턴이 무의식 행동으로 나옴</div>
                  <div>· 같은 실수를 반복하기 쉬운 영역</div>
                </div>
              </div>
            </div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",marginBottom:14,wordBreak:"keep-all"}}>{nm}님의 강점은 의식적으로 끌어올리고, 약점은 알아차리기만 해도 절반은 풀려요. 약점을 부끄러워하지 마세요 — 그건 {plCompat.name.replace("형","")}로서 평생 가지고 살았던 {plCompat.ohaeng} 기운의 자연스러운 그림자예요.</div>
            {/* 소제목 — 전생의 마지막 시기 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>🕯️ 전생의 마지막 시기</div>
            <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px",marginBottom:12,wordBreak:"keep-all"}}>
              <div style={{fontSize:11,color:"#555",lineHeight:"18px",marginBottom:6}}>{nm}님이 전생에서 마지막으로 머물렀던 시기는 인생의 정점을 지나 잔잔해진 시기였어요. {plCompat.name.replace("형","")}로서 이루어야 할 큰 뜻은 거의 다 이뤘지만, 마음 한구석에 {plCompat.talent[1]||"조용한 미련"}이 남아있던 채로 떠나셨죠. 그 미련이 바로 이번 생에 태어난 첫 번째 이유예요.</div>
              <div style={{fontSize:11,color:"#555",lineHeight:"18px"}}>전생의 마지막 풍경은 {plCompat.ohaeng==="木"?"늦봄의 큰 나무 아래":plCompat.ohaeng==="火"?"노을이 붉게 물든 하늘 아래":plCompat.ohaeng==="土"?"넓은 들판 한가운데":plCompat.ohaeng==="金"?"늦가을 단단한 산 위에서":"맑은 호수가 보이는 누각에서"}였어요. 그 평화로운 장면이 영혼 깊은 곳에 새겨져 있어서, 지금도 비슷한 풍경을 보면 까닭 모를 안정감을 느끼실 거예요.</div>
            </div>
            {/* 소제목 — 발현 시기 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>📅 전생 기운이 발현되는 시기</div>
            <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px",marginBottom:8,wordBreak:"keep-all"}}>
              <div style={{fontSize:11.5,fontWeight:700,color:"#B8942E",marginBottom:4}}>🌅 초년 (10~25세)</div>
              <div style={{fontSize:11,color:"#555",lineHeight:"18px"}}>어린 시절부터 또래와 다른 깊이가 있어요. 친구들이 노는 데 관심 없고 혼자만의 세계에 빠지는 시간이 많았을 거예요. 이 시기엔 전생 기운이 어렴풋이만 깨어있어서, 본인도 자기 안의 무언가를 다 모르고 살아요.</div>
            </div>
            <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px",marginBottom:8,wordBreak:"keep-all"}}>
              <div style={{fontSize:11.5,fontWeight:700,color:"#d97706",marginBottom:4}}>☀️ 중년 (30~50세)</div>
              <div style={{fontSize:11,color:"#555",lineHeight:"18px"}}>{plCompat.name.replace("형","")} 기운이 본격적으로 깨어나는 시기. 우연히 들른 곳, 우연히 만난 사람에게 강한 기시감(데자뷰)을 느끼고, 어느 순간 자신의 천직 같은 일을 발견해요. 30대 중반~40대 초반이 영혼의 골든 타임.</div>
            </div>
            <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px",wordBreak:"keep-all"}}>
              <div style={{fontSize:11.5,fontWeight:700,color:"#7e22ce",marginBottom:4}}>🌙 말년 (60세~)</div>
              <div style={{fontSize:11,color:"#555",lineHeight:"18px"}}>전생에서 못 이룬 꿈 하나가 마지막 불꽃처럼 타오르는 시기. 60대 이후에 새로운 도전(저서·강연·후학 양성·예술 활동)을 시작하면 인생 두 번째 정점을 만들 수 있어요. 절대 늦지 않았어요.</div>
            </div>
          </>}

          {/* ━━ 탭 3: 🎯 이번 생 (+ 천기 한마디) ━━ */}
          {pastTab===3&&<>
            {/* 큰 제목 */}
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>🎯 이번 생에서는</div>
            </div>
            {/* 소제목 — 이번 생의 숙제 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>📋 이번 생의 숙제</div>
            <div style={{fontSize:11,color:"#555",lineHeight:"18px",background:"#f8f9fa",padding:"8px 12px",borderRadius:12,marginBottom:12,wordBreak:"keep-all"}}>{nm}님이 이번 생에 태어난 이유가 있어요. 전생에서 완성하지 못한 것들을 이번 생에 마무리하러 온 거예요. 전생의 재능인 <strong style={{color:"#C4922A"}}>{plCompat.talent[0]}</strong>을 이번에는 더 많은 사람에게 닿게 하는 것이 이번 생의 숙제예요.</div>
            {/* 소제목 — 잘 살기 위한 3가지 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>🌟 이번 생을 잘 살기 위한 3가지</div>
            <div style={{background:"#f8f9fa",borderRadius:12,padding:"10px 12px",marginBottom:12}}>
              {["전생에서 가져온 재능을 혼자 쌓지 않고 나누기","업보를 풀기 위해 나보다 약한 사람 한 명 도와주기","전생에서 못 이룬 꿈 하나 이번 생에서 완성하기"].map((t,i)=>(
                <div key={i} style={{fontSize:11,color:"#555",lineHeight:"18px",marginBottom:i<2?4:0,wordBreak:"keep-all"}}>· {t}</div>
              ))}
            </div>
            {/* v658: 전생의 편지 박스 — 골드 강조 + 큰 따옴표 인용구 디자인 */}
            <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:8,textAlign:"center"}}>✦ 전생의 {plCompat.name.replace("형","")}가 {nm}님께</div>
            <div style={{position:"relative",background:"linear-gradient(135deg,#fffbe9 0%,#fff8db 100%)",border:"1px solid rgba(212,175,55,0.35)",borderRadius:14,padding:"22px 18px 16px",marginBottom:12,boxShadow:"0 2px 8px rgba(212,175,55,0.08)"}}>
              {/* v736: 좌상단 큰 따옴표 — 둥근 곡선 따옴표(") 사용. 직선 큰따옴표(")보다 천기 명언 분위기 */}
              <div style={{position:"absolute",top:-2,left:10,fontSize:48,color:"rgba(196,146,42,0.4)",fontFamily:"'Noto Serif KR','Batang','Georgia',serif",lineHeight:1,fontWeight:900}}>“</div>
              <div style={{fontSize:11.5,color:"#1A3C32",lineHeight:1.95,fontStyle:"italic",wordBreak:"keep-all",padding:"4px 0"}}>
                그때의 나는 {plCompat.name.replace("형","")}로 살았다. {plCompat.ohaeng==="木"?"단단한 나무처럼 천천히, 그러나 깊이 자랐다.":plCompat.ohaeng==="火"?"불꽃처럼 뜨겁게, 모든 걸 사랑했다.":plCompat.ohaeng==="土"?"흙처럼 묵묵하게, 사람들을 품었다.":plCompat.ohaeng==="金"?"칼처럼 단단하게, 옳은 길을 갔다.":"물처럼 흘러, 어디든 닿았다."} 마지막 순간, 한 가지가 마음에 걸렸다 — 그건 너에게 남기고 싶었던 <strong style={{color:"#B8942E",fontStyle:"normal"}}>{plCompat.talent[0]||"용기"}</strong>였다.
                <br/><br/>
                이번 생엔 그걸 마음껏 펼쳐다오. 두려워하지 마라. 너는 이미 그것을 가지고 태어났다. 단지 그 사실을 잊었을 뿐이야. 천천히, 깊이, 그리고 따뜻하게 — 너답게 살면 된다.
              </div>
              {/* v736: 우하단 큰 따옴표 — 둥근 곡선 닫는 따옴표(") */}
              <div style={{textAlign:"right",fontSize:48,color:"rgba(196,146,42,0.4)",fontFamily:"'Noto Serif KR','Batang','Georgia',serif",lineHeight:0.3,fontWeight:900,marginTop:6}}>”</div>
            </div>
            {/* 천기의 한마디 — Affirm 무지개 박스 (v615: 이번 생 탭 마지막) */}
            <Affirm name={nm} text={`${nm}님은 우연히 이 세상에 온 게 아니에요. 전생의 ${plCompat.talent[0]}을 이 세상에 꽃피우러 온 사람이에요.`}/>
          </>}

          {/* 푸터 */}
          <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:10,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderTop:"1px solid #f0f0f0",flexWrap:"wrap",gap:4}}>
            <span>#천기전생 #전생운세 #내전생 #{plCompat.name} #{(plCompat.keyword||"").replace(/\s/g,"")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
          </div>
        </div>
        </div>{/* ═══ pastlife-capture 닫기 ═══ */}

        {/* 📚 25종 전생 캐릭터 전체 도감 — v578: inline 토글로 다른 도감과 통일 */}
        <button onClick={()=>setShowCollection(true)} style={{width:"100%",padding:"14px",marginBottom:12,background:"linear-gradient(135deg,#fef9e7,#fff8db)",color:"#7A5C00",border:"2px solid rgba(212,175,55,0.4)",borderRadius:14,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
          📚 25종 전생 캐릭터 전체 도감 보기 (오행 5종 비교 포함)
        </button>
        {showCollection&&<PastLifeFullModal onClose={()=>setShowCollection(false)} modal={{_curType:plCompat}} helpers={{ResultActions}}/>}
        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🌟",sid:"gijildo",name:"기질도 →",bc:"rgba(95,196,158,0.3)",q:"전생 기질"},
          {ic:"👁️",sid:"gwansang_full",name:"내 관상보기 →",bc:"rgba(155,143,212,0.3)",q:"얼굴 흔적"},
          {ic:"🔄",sid:"daeun",name:"대운 해설 →",bc:"rgba(255,107,173,0.3)",q:"10년 흐름"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="pastlife-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 (공유 다음, 굿즈 위) */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"},{ic:"🌙",name:"오늘운세",price:"무료",sid:"today_unse"},{ic:"🔮",name:"수비학",price:"980원",sid:"numerology"},{ic:"📜",name:"토정비결",price:"1,980원",sid:"tojeong"},{ic:"🌅",name:"연도별 운세",price:"980원",sid:"yearly_unse"},{ic:"🔄",name:"대운 운세",price:"980원",sid:"daeun"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="past_life" ctx={{ohaeng:plCompat.ohaeng}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="전생 소울 굿즈" sub={`${plCompat.name}의 ${plCompat.item} 같은 영혼 아이템`}/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"past_life",name:"전생 운세"}} ctx={{}} cart={cart} setCart={setCart} onClose={()=>{setShowPay(false);goResult();}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// ─────────────────────────────────────────────────────────────
// 5. PastLifeFullModal — 전생 25종 전체 풀이북 (추가결제 후 새 팝업)
// ─────────────────────────────────────────────────────────────
const PAST_LIFE_25=[
  {oh:"木",emoji:"📜",name:"선비형",hashtag:"#갓생러 지식인",keyword:"새벽 4시 책더미"},
  {oh:"木",emoji:"🎭",name:"예인형",hashtag:"#조선판 아이돌",keyword:"무대 위 빛"},
  {oh:"木",emoji:"🌱",name:"농부형",hashtag:"#존버 투자자",keyword:"꾸준한 결실"},
  {oh:"木",emoji:"⛓️",name:"혁명가형",hashtag:"#조선판 스파르타쿠스",keyword:"불의에 저항"},
  {oh:"木",emoji:"🎨",name:"화원형",hashtag:"#천재 아티스트",keyword:"붓 한 번 휘두르면"},
  {oh:"火",emoji:"⚔️",name:"무사형",hashtag:"#불도저 검객",keyword:"앞만 보고 달리는"},
  {oh:"火",emoji:"🪖",name:"장군형",hashtag:"#캡틴 아메리카",keyword:"팀원 멱살 캐리"},
  {oh:"火",emoji:"👑",name:"야망캐형",hashtag:"#수양대군 재질",keyword:"권력을 향해 직진"},
  {oh:"火",emoji:"🕵️",name:"암행어사형",hashtag:"#다크히어로",keyword:"신분 숨기고 정의"},
  {oh:"火",emoji:"🐯",name:"포수형",hashtag:"#조선 헌터",keyword:"호랑이도 잡는 담대함"},
  {oh:"土",emoji:"🏰",name:"왕족형",hashtag:"#제일 셀럽",keyword:"태어날 때부터 VIP"},
  {oh:"土",emoji:"🍶",name:"객주형",hashtag:"#살아있는 위키",keyword:"인싸 허브"},
  {oh:"土",emoji:"🎋",name:"한량형",hashtag:"#폼생폼사",keyword:"풍류 즐기는 철학자"},
  {oh:"土",emoji:"🪷",name:"상궁형",hashtag:"#비선 실세",keyword:"뒤에서 판 짜는"},
  {oh:"土",emoji:"🍜",name:"주모형",hashtag:"#국민 힐러",keyword:"국밥 한 그릇 포용"},
  {oh:"金",emoji:"💰",name:"상인형",hashtag:"#네고왕 거상",keyword:"말빨로 상권 장악"},
  {oh:"金",emoji:"🗡️",name:"호위무사형",hashtag:"#인간 쉴드",keyword:"충성도 9999"},
  {oh:"金",emoji:"🔨",name:"장인형",hashtag:"#디테일 변태",keyword:"1mm 오차도 못 참는"},
  {oh:"金",emoji:"🎓",name:"훈장형",hashtag:"#1타 강사",keyword:"설명할 때 도파민"},
  {oh:"金",emoji:"⚖️",name:"사헌부형",hashtag:"#감사원장",keyword:"부정부패 못 참는"},
  {oh:"水",emoji:"🪷",name:"승려형",hashtag:"#번뇌왕 명상러",keyword:"속세 끊으려다 실패"},
  {oh:"水",emoji:"🌙",name:"무녀형",hashtag:"#원조 타로마스터",keyword:"조선 제일의 촉"},
  {oh:"水",emoji:"🔮",name:"도인형",hashtag:"#일론 머스크",keyword:"500년 앞서간 천재"},
  {oh:"水",emoji:"⭐",name:"신관형",hashtag:"#메가 인플루언서",keyword:"묘한 카리스마"},
  {oh:"水",emoji:"✨",name:"역술가형",hashtag:"#천기인",keyword:"별과 사주로 운명 읽던"},
];

export function PastLifeFullModal({onClose,modal,helpers}:any){
  const{ResultActions}=helpers;
  const curName=modal?._curType?.name||"";
  return <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
    <CloseBtn onClose={onClose}/>
    {/* 화이트 카드 통일 */}
    <div style={{background:"#FDFCF8",borderRadius:18,padding:"18px 16px 20px",marginBottom:14,boxShadow:"0 8px 28px rgba(0,0,0,0.4)",border:"2px solid rgba(201,167,78,0.35)"}}>
      <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 전생 운세 · 25종 영혼 전체 풀이북</div>
      <div style={{textAlign:"center",fontSize:54,marginBottom:6}}>📚</div>
      <div style={{textAlign:"center",fontSize:22,fontWeight:900,color:"#1A1A1A",fontFamily:"'Noto Serif KR','Batang',serif",marginBottom:4,lineHeight:1.4}}>전생 25종 전체 풀이북</div>
      <div style={{textAlign:"center",fontSize:12,color:"#7A5C00",marginBottom:14,fontWeight:600}}>5종 오행별 25개 전생 유형 비교</div>
      {curName&&(()=>{
        const me=PAST_LIFE_25.find(t=>t.name===curName);
        // 오행 상생/상극 자동 매칭
        const _ohSheng:any={木:"火",火:"土",土:"金",金:"水",水:"木"};
        const _ohKeuk:any={木:"土",土:"水",水:"火",火:"金",金:"木"};
        const myOh=me?.oh;
        const bestOh=myOh?_ohSheng[myOh]:null;
        const worstOh=myOh?_ohKeuk[myOh]:null;
        const bestOne=bestOh?PAST_LIFE_25.find(t=>t.oh===bestOh&&t.name!==curName):null;
        const worstOne=worstOh?PAST_LIFE_25.find(t=>t.oh===worstOh&&t.name!==curName):null;
        return <div style={{background:"#fafafa",border:"1px solid #e5e7eb",borderRadius:14,padding:"14px",marginBottom:14}}>
          <div style={{fontSize:10,color:"#7A5C00",fontWeight:800,letterSpacing:2,textAlign:"center",marginBottom:10}}>✦ {curName ? `내 전생: ${curName}` : "내 전생"} ✦</div>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:(bestOne||worstOne)?12:0}}>
            <div style={{width:84,height:84,borderRadius:12,overflow:"hidden",border:"3px double rgba(201,167,78,0.55)",boxShadow:"0 4px 12px rgba(201,167,78,0.25)",background:"#fff",flexShrink:0}}>
              <img src={`/past-life-cards/${curName}.png`} alt={curName} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling as HTMLElement;if(fb)fb.style.display="flex";}}/>
              <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:36}}>{me?.emoji||"🌟"}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:900,color:"#1A1A1A",marginBottom:4,fontFamily:"'Noto Serif KR','Batang',serif"}}>{me?.emoji} {curName}</div>
              {me?.hashtag&&<div style={{fontSize:11,color:"#C4922A",fontWeight:700,marginBottom:3}}>{me.hashtag}</div>}
              {me?.keyword&&<div style={{fontSize:10,color:"#666",lineHeight:1.5}}>{me.keyword}</div>}
            </div>
          </div>
          {/* 찰떡 + 상극 mini 카드 */}
          {(bestOne||worstOne)&&(
            <div style={{display:"grid",gridTemplateColumns:bestOne&&worstOne?"1fr 1fr":"1fr",gap:6,paddingTop:10,borderTop:"1px dashed rgba(201,167,78,0.3)"}}>
              {bestOne&&(
                <div style={{background:"#eff8f1",border:"1.5px solid #86efac",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#16a34a",fontWeight:800,letterSpacing:1.5,marginBottom:4}}>💚 찰떡 동료</div>
                  <div style={{width:48,height:48,margin:"0 auto 4px",borderRadius:8,overflow:"hidden",border:"1.5px solid #86efac",background:"#fff"}}>
                    <img src={`/past-life-cards/${bestOne.name}.png`} alt={bestOne.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling as HTMLElement;if(fb)fb.style.display="flex";}}/>
                    <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:22}}>{bestOne.emoji}</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"#1e3a2a",lineHeight:1.3,marginBottom:4}}>{bestOne.name}</div>
                  {/* v657: 해시태그/키워드 박스에 넣어 허전한 느낌 제거 */}
                  {bestOne.hashtag&&<div style={{display:"inline-block",padding:"2px 8px",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:10,fontSize:9,color:"#16a34a",fontWeight:700,marginTop:2,wordBreak:"keep-all"}}>{bestOne.hashtag}</div>}
                  {bestOne.keyword&&<div style={{padding:"4px 8px",background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)",borderRadius:8,fontSize:9,color:"#555",lineHeight:1.45,marginTop:4,wordBreak:"keep-all"}}>{bestOne.keyword}</div>}
                </div>
              )}
              {worstOne&&(
                <div style={{background:"#fef2f2",border:"1.5px solid #fcb6b6",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#dc2626",fontWeight:800,letterSpacing:1.5,marginBottom:4}}>⚡ 라이벌</div>
                  <div style={{width:48,height:48,margin:"0 auto 4px",borderRadius:8,overflow:"hidden",border:"1.5px solid #fcb6b6",background:"#fff"}}>
                    <img src={`/past-life-cards/${worstOne.name}.png`} alt={worstOne.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling as HTMLElement;if(fb)fb.style.display="flex";}}/>
                    <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:22}}>{worstOne.emoji}</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:"#7c1d1d",lineHeight:1.3,marginBottom:4}}>{worstOne.name}</div>
                  {worstOne.hashtag&&<div style={{display:"inline-block",padding:"2px 8px",background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:10,fontSize:9,color:"#dc2626",fontWeight:700,marginTop:2,wordBreak:"keep-all"}}>{worstOne.hashtag}</div>}
                  {worstOne.keyword&&<div style={{padding:"4px 8px",background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)",borderRadius:8,fontSize:9,color:"#555",lineHeight:1.45,marginTop:4,wordBreak:"keep-all"}}>{worstOne.keyword}</div>}
                </div>
              )}
            </div>
          )}
          <div style={{fontSize:10,color:"#7A5C00",marginTop:10,textAlign:"center",lineHeight:1.6}}>아래 25종 중 ✦ 표시가 내 전생이에요</div>
        </div>;
      })()}
      {(()=>{
        // 찰떡/상극 자동 매칭 (오행 기반) — 리스트 하이라이트용
        const _ohSheng:any={木:"火",火:"土",土:"金",金:"水",水:"木"};
        const _ohKeuk:any={木:"土",土:"水",水:"火",火:"金",金:"木"};
        const meEntry=PAST_LIFE_25.find(t=>t.name===curName);
        const _myOh=meEntry?.oh;
        const _bestOh=_myOh?_ohSheng[_myOh]:null;
        const _worstOh=_myOh?_ohKeuk[_myOh]:null;
        const _bestEntry=_bestOh?PAST_LIFE_25.find(t=>t.oh===_bestOh&&t.name!==curName):null;
        const _worstEntry=_worstOh?PAST_LIFE_25.find(t=>t.oh===_worstOh&&t.name!==curName):null;
        return [
          {oh:"木",label:"나무 — 창의·성장·독립",color:"#7CB87B"},
          {oh:"火",label:"불 — 열정·카리스마·리더십",color:"#E8532A"},
          {oh:"土",label:"흙 — 안정·포용·신뢰",color:"#C4922A"},
          {oh:"金",label:"금 — 의리·결단·전문성",color:"#888"},
          {oh:"水",label:"물 — 지혜·직관·신비",color:"#4A90D9"},
        ].map(group=>(
          <div key={group.oh} style={{marginBottom:14,paddingTop:12,borderTop:"1px dashed rgba(0,0,0,0.1)"}}>
            <div style={{fontSize:13,fontWeight:800,color:group.color,marginBottom:8,letterSpacing:1}}>✦ {group.oh} — {group.label}</div>
            {PAST_LIFE_25.filter(t=>t.oh===group.oh).map(t=>{
              const isMe=t.name===curName;
              const isBest=_bestEntry&&t.name===_bestEntry.name;
              const isWorst=_worstEntry&&t.name===_worstEntry.name;
              const accent=isMe?group.color:isBest?"#16a34a":isWorst?"#dc2626":"transparent";
              return <div key={t.name} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 12px",marginBottom:12,background:isMe?"rgba(201,167,78,0.12)":isBest?"rgba(22,163,74,0.05)":isWorst?"rgba(220,38,38,0.05)":"#F9F7F2",border:isMe||isBest||isWorst?`2px solid ${accent}`:"1px solid transparent",borderRadius:10}}>
                <div style={{width:48,height:48,borderRadius:8,overflow:"hidden",border:isMe||isBest||isWorst?`2px solid ${accent}`:"1px solid rgba(0,0,0,0.06)",background:"#fff",flexShrink:0}}>
                  <img src={`/past-life-cards/${t.name}.png`} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e:any)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling as HTMLElement;if(fb)fb.style.display="flex";}}/>
                  <div style={{display:"none",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",fontSize:22}}>{t.emoji}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#111",marginBottom:4}}>{t.emoji} {t.name}{isMe&&<span style={{color:group.color,marginLeft:6,fontSize:10,fontWeight:900}}>✦ 내 전생</span>}{isBest&&<span style={{color:"#16a34a",marginLeft:6,fontSize:10,fontWeight:900}}>💚 찰떡 동료</span>}{isWorst&&<span style={{color:"#dc2626",marginLeft:6,fontSize:10,fontWeight:900}}>⚡ 라이벌</span>}</div>
                  {/* v669: 25종 전생 도감 리스트 — 해시태그/키워드 박스화 (찰떡/라이벌 카드와 동일 패턴) */}
                  {t.hashtag&&<div style={{display:"inline-block",padding:"2px 8px",background:isBest?"rgba(34,197,94,0.12)":isWorst?"rgba(220,38,38,0.1)":"rgba(122,92,0,0.08)",border:`1px solid ${isBest?"rgba(34,197,94,0.3)":isWorst?"rgba(220,38,38,0.3)":"rgba(122,92,0,0.2)"}`,borderRadius:10,fontSize:9,color:isBest?"#16a34a":isWorst?"#dc2626":"#7A5C00",fontWeight:700,marginTop:2,wordBreak:"keep-all"}}>{t.hashtag}</div>}
                  {t.keyword&&<div style={{padding:"4px 8px",background:"rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)",borderRadius:8,fontSize:9,color:"#555",lineHeight:1.45,marginTop:4,wordBreak:"keep-all"}}>{t.keyword}</div>}
                </div>
              </div>;
            })}
          </div>
        ));
      })()}
      {/* v658: 도감 안내 — 찰떡/라이벌, 1순위 설명, 푸터 해시태그 모두 삭제 (사용자 요청) */}
      <div style={{marginTop:14,paddingTop:12,borderTop:"1px dashed rgba(0,0,0,0.1)"}}>
        <div style={{fontSize:13,fontWeight:800,color:"#7A5C00",marginBottom:8,letterSpacing:1}}>🌟 오행별 전생 매칭표</div>
        {/* v736: 도감 줄간격 기본으로 좁힘 (사용자 명시 "줄간격 기본으로 좁혀주고") 1.95 → 1.6 */}
        <div style={{fontSize:12,color:"#333",lineHeight:1.6,padding:"10px 12px",background:"#F9F7F2",borderRadius:10}}>
          <p style={{margin:0}}>각 오행은 5가지 전생 유형으로 세분돼요. 이름의 한자 획수와 사주 일간이 합쳐져 25종 중 1종이 결정됩니다.</p>
        </div>
      </div>
      {/* v736: 도감 푸터 🌐 천기.kr 제거 (사용자 명시 "도감 제일 하단 삭제 바람") */}
    </div>
    {/* v577: 도감 통일 — 다른 도감처럼 확인 버튼만 (ResultActions 공유/링크/기록소 안내 제거) */}
    <button className="btn btn-p" onClick={onClose}>확인</button>
  </div></div>;
}

// ─────────────────────────────────────────────────────────────
// 6. DaeunRichModal (daeun) — 대운 해설 풀버전
// ─────────────────────────────────────────────────────────────
export function DaeunRichModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,pushModal,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  const birthYear=selectedPerson?.birth?parseInt(selectedPerson.birth.split("-")[0]):1990;
  const curAge=new Date().getFullYear()-birthYear;
  const curDaeunStart=Math.floor((curAge-5)/10)*10+5;
  const curDaeunEnd=curDaeunStart+9;
  const nextDaeunStart=curDaeunStart+10;
  const nextDaeunEnd=nextDaeunStart+9;
  const periods:any[]=[];
  for(let age=5;age<=104;age+=10){
    periods.push({age,endAge:age+9,label:`${age}~${age+9}세`,yearRange:`${birthYear+age}~${birthYear+age+9}`,isCurrent:curAge>=age&&curAge<=age+9});
  }

  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[showPay,setShowPay]=useState(false);
  const[selectedPeriod,setSelectedPeriod]=useState<any>(null);

  function goResult(){setStep("loading");}
  function onLoaded(){
    setStep("result");
    addHistory({icon:"🔄",name:"대운 해설",svcId:"daeun",person:nm,result:`${curDaeunStart}~${curDaeunEnd}세 대운`,date:new Date().toLocaleDateString("ko-KR"),preQuestions:{focus:ans1,feel:ans2},resultType:{_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}});
  }

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(126,189,185,0.55)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#7ebdb9",marginBottom:6,lineHeight:1.4}}>🔄 대운 해설</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;지금 내 인생은 몇 막? 10년 단위 큰 그림&rdquo;</div>
          {/* 대운 타임라인 비주얼 */}
          <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.25)",borderRadius:12,padding:"14px 12px",marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--mist)",letterSpacing:2,marginBottom:10}}>✦ 대운(大運)의 구조 ✦</div>
            <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}>
              {[0,10,20,30,40,50,60,70,80,90].map((age,i)=>{
                const isCur=age<=curDaeunStart&&curDaeunStart<age+10;
                return <div key={age} style={{background:isCur?"rgba(212,175,55,0.25)":"rgba(255,255,255,0.04)",border:`1px solid ${isCur?"#D4AF37":"rgba(255,255,255,0.1)"}`,borderRadius:6,padding:"5px 6px",fontSize:9,color:isCur?"#D4AF37":"var(--mist)",fontWeight:isCur?800:500,animation:`laserScan 3s ease-in-out infinite ${i*0.1}s`}}>{age}</div>;
              })}
            </div>
            <div style={{fontSize:10,color:"#D4AF37",fontWeight:700,marginTop:8}}>🔥 현재 {curDaeunStart}~{curDaeunEnd}세 구간</div>
          </div>
          {/* 설명 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",marginBottom:14,textAlign:"left",border:"1px solid rgba(212,175,55,0.15)"}}>
            <div style={{fontSize:10,color:"var(--gold)",fontWeight:800,marginBottom:4,letterSpacing:1}}>📖 대운이란?</div>
            <div style={{fontSize:11,color:"var(--mist)",lineHeight:1.7}}>사주 명리학의 핵심. 인생을 10년 단위로 나눈 큰 흐름. 개인의 사주가 시대(세운)와 만나 운명을 결정하는 근본 기둥이에요.</div>
          </div>
          {/* 포인트 — 테두리 제거, 내용 유지 */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["🌟","현재 대운 풀버전",`지금 ${curDaeunStart}~${curDaeunEnd}세 대운 분석`],["📊","영역별 흐름","재물·연애·직업·건강 4영역"],["📈","전체 타임라인","태어나서 100세까지 한눈에"],["🔮","다음 대운 예고","앞으로 어떻게 변하는지"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:"var(--white)"}}>{f[1]}</div><div style={{fontSize:10,color:"#C1D1C1"}}>{f[2]}</div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--mist)"}}>980원 <span style={{opacity:0.7}}>· 다른 시기 +380원</span></div>
        </div>
        <button onClick={()=>{
          if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"daeun",icon:"🔄",name:"대운 해설",desc:"",price:"980원"});onClose();return;}
          setStep("q1");
        }} style={{background:"#7ebdb9",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#1A3C32",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(126,189,185,0.4)",fontFamily:"inherit",marginTop:10}}>인생의 10년마다 대운 보기 (980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q1"&&<PreQA iconTitle={`🔄 ${nm}님의 대운 해설`} subtitle="더 정확한 분석을 위해" title="대운에서 가장 궁금한 건?" step={1} total={2} answer={ans1} setAnswer={setAns1} onNext={()=>setStep("q2")} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"daeun",icon:"🔄",name:"대운 해설",desc:"",price:"980원"});onClose();}}} opts={[{e:"💰",l:"재물 흐름"},{e:"❤️",l:"인연·결혼"},{e:"💼",l:"직업·사업"},{e:"🌿",l:"건강"},{e:"🌟",l:"전체 대운 흐름"}]} onClose={onClose}/>}
      {step==="q2"&&<PreQA iconTitle={`🔄 ${nm}님의 대운 해설`} subtitle="더 정확한 분석을 위해" title="지금 대운이 어떻게 느껴지나요?" step={2} total={2} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>setStep("q1")} opts={[{e:"📈",l:"뭔가 좋아지는 느낌"},{e:"📉",l:"뭔가 막히는 느낌"},{e:"😐",l:"잘 모르겠어"},{e:"🔄",l:"최근에 큰 변화가 있었어"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">🔄 대운 해설</div>
        <div className="ms">10년 단위 인생 큰 흐름 · 980원</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          {ans1&&<div style={{fontSize:11,color:"var(--white)",marginBottom:3}}>🎯 {ans1}</div>}
          {ans2&&<div style={{fontSize:11,color:"var(--white)"}}>💭 {ans2}</div>}
        </div>
        {PayStepComp?<PayStepComp price="980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="daeun"/>:<>
          <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
          <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
        </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="🔄" title={`${nm}님의 대운 분석 중...`} msgs={["사주 천간지지 배열 중... ☯️","대운 10년 단위 계산 중... 📊","현재 대운 기운 분석 중... 🌟","과거·미래 대운 흐름 추적 중... 📈","마지막 마무리 중... 💫"]}/>}
      {step==="result"&&<>
        <div id="daeun-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1: 현재 대운 + 사주 헤더 + 영역별 흐름 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 100세 인생 대운 타임라인"
          title="PAGE 1 · 현재 대운 + 영역별 흐름"
          hash={`#천기대운 #${curDaeunStart}~${curDaeunEnd}세 #${sajuInfo.ilOh}일간`}
        >
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:4}}>🔄 {nm}님의 {curDaeunStart}~{curDaeunEnd}세 대운</div>
            <div style={{fontSize:12,color:"#7A5C00",fontWeight:700}}>{curAge}세 (현재)</div>
          </div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson}/>
          <SajuHeaderCard pillars={["乙","丑"]} labels={["천간","지지"]} subtitle={`${curDaeunStart}~${curDaeunEnd}세 대운 — 을축(乙丑) 대운`}/>
          {(ans1||ans2)&&<div style={{background:"#f8f9fa",borderRadius:9,padding:"12px 14px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:6,fontWeight:800}}>✦ {nm}님 맞춤 분석</div>
            <div style={{fontSize:12,color:"#222",lineHeight:1.7}}>{ans1&&<>🎯 {ans1}<br/></>}{ans2&&<>💭 {ans2}</>}</div>
          </div>}
        <WhiteCard label={`현재 대운 (${curDaeunStart}~${curDaeunEnd}세)`} emoji="🌟">
          <Para text={`${nm}님, 지금 ${curDaeunStart}~${curDaeunEnd}세 대운에 들어와 있어요. 이 시기는 ${curAge<35?"인생의 기반을 다지는":curAge<45?"인생의 결실이 본격적으로 드러나는":curAge<55?"축적된 모든 것이 무르익는":"완성과 마무리의"} 시기예요. 일간 ${sajuInfo.ilgan}(${sajuInfo.ilOh}) 사주에 이 대운은 꽤 중요한 의미가 있어요.`}/>
          <Para text={`${ans2.includes("좋아")?"좋아지는 느낌이 든다면 그 직감이 맞아요. 이 대운은 본격적인 상승 곡선이에요. 망설임을 줄이고 적극적으로 움직이세요.":ans2.includes("막히")?"막힌 느낌이 든다면 잠시의 정체기예요. 이 대운 후반부터 다시 풀려요. 지금은 내실을 다지는 시간이에요.":ans2.includes("변화")?"큰 변화가 있었다면 이 대운의 시작 신호예요. 변화는 더 커지지만 결국 더 좋은 방향으로 가요.":"아직 잘 모르겠다면 이 대운의 본 흐름은 아직 시작 중. 36개월 정도 지나면 명확해져요."}`}/>
          <Para text={`이 대운의 핵심 키워드는 ${ans1.includes("재물")?"축적과 분배":ans1.includes("인연")?"진짜 사람을 만나기":ans1.includes("직업")?"전문성 완성":ans1.includes("건강")?"체력 관리와 회복":"균형과 깊이"}예요.`}/>
        </WhiteCard>
        <WhiteCard label="영역별 대운 흐름" emoji="📊">
          <ScoreRow items={[{e:"💰",n:"재물",s:74},{e:"❤️",n:"인연",s:68},{e:"💼",n:"직업",s:82},{e:"🌿",n:"건강",s:71}]}/>
          {[["💰","재물 흐름","이 대운에는 본업과 부업의 구분이 명확해져요. 본업에서 안정 + 부업/투자에서 도약. 4년차에 큰 재물 기회가 와요."],
            ["❤️","인연 흐름","깊이 있는 인연이 형성되는 시기. 특히 36~38세 사이 결혼·장기 관계 결정이 많이 일어나요."],
            ["💼","직업 흐름","전문성이 본격 발휘되는 시기. 이직·승진·창업 모두 이 대운 중간에 결정적 기회가 와요."],
            ["🌿","건강 흐름","체력 자본이 줄어드는 시기 시작. 운동 루틴을 만들어두면 50대 이후 큰 차이를 만들어요."]].map(r=>(
            <div key={r[0]} style={{marginTop:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#111",marginBottom:5}}>{r[0]} {r[1]}</div>
              <div style={{fontSize:12,color:"#333",lineHeight:1.85,paddingLeft:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>{r[2]}</div>
            </div>
          ))}
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 2: 타임라인 + 다음 대운 + 추가결제 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 100세 인생 대운 타임라인"
          title="PAGE 2 · 100세 타임라인 + 다음 대운"
          hash="#천기대운 #100세타임라인 #다음대운"
        >
        <WhiteCard label="전체 대운 타임라인" emoji="📈">
          <div style={{fontSize:10,color:"#666",marginBottom:10}}>태어나서 100세까지의 10개 대운</div>
          {periods.slice(0,10).map(p=>(
            <div key={p.age} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",marginBottom:5,background:p.isCurrent?"rgba(212,175,55,0.08)":"#F9F7F2",border:p.isCurrent?"1.5px solid rgba(212,175,55,0.4)":"1px solid transparent",borderRadius:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{p.label} {p.isCurrent&&<span style={{color:"var(--gold)",marginLeft:6,fontSize:10}}>← 현재</span>}</div>
                <div style={{fontSize:10,color:"#666"}}>{p.yearRange}</div>
              </div>
              <div style={{fontSize:10,color:"#7A5C00"}}>{p.age<25?"성장기":p.age<45?"활동기":p.age<65?"결실기":"안정기"}</div>
            </div>
          ))}
        </WhiteCard>
        <WhiteCard label={`다음 대운 예고 (${nextDaeunStart}~${nextDaeunEnd}세)`} emoji="🔮">
          <Para text={`다음 대운은 ${nextDaeunStart}~${nextDaeunEnd}세 — 병인(丙寅) 대운이에요. 지금보다 ${nextDaeunStart>=45?"안정과 결실":"확장과 도약"}의 기운이 더 강해져요.`}/>
          <Para text={`이 다음 대운에서 가장 중요한 건 ${nextDaeunStart>=45?"건강 관리와 인간관계 정리":"전문성을 바탕으로 한 자기 브랜딩과 리더십 발휘"}예요. 지금 이 대운 동안 그 준비를 해두면 다음 대운이 훨씬 풍성해져요.`}/>
        </WhiteCard>
        {/* 추가결제: 다른 시기 대운 — 사주아이 스타일 (현재만 무료, 나머지 잠금) */}
        <div style={{background:"#f8f9fa",border:"1px solid #e5e7eb",borderRadius:14,padding:"16px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
          <div style={{fontSize:11,color:"#7A5C00",letterSpacing:2,marginBottom:4,fontWeight:800,textAlign:"center"}}>🔓 다른 시기 대운도 펼쳐보세요</div>
          <div style={{fontSize:10,color:"#8b6f1c",marginBottom:12,textAlign:"center"}}>현재 대운은 무료로 보셨어요 · 다른 시기는 각 380원</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {periods.filter(p=>!p.isCurrent).slice(0,6).map(p=>(
              <button key={p.age} onClick={()=>{setSelectedPeriod(p);setShowPay(true);}} style={{padding:"12px 10px",borderRadius:12,border:"1px solid rgba(201,167,78,0.4)",background:"rgba(255,255,255,0.7)",color:"#5a4316",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"center",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{position:"absolute",top:6,right:8,fontSize:13,opacity:0.5}}>🔒</div>
                <div style={{fontSize:13,fontWeight:900,marginBottom:3}}>{p.label}</div>
                <div style={{fontSize:9,color:"#8b6f1c",fontWeight:600,marginBottom:6}}>{p.yearRange}</div>
                <div style={{display:"inline-block",fontSize:10,fontWeight:800,color:"#fff",background:"linear-gradient(135deg,#D4AF37,#B8942E)",padding:"3px 10px",borderRadius:14}}>+380원</div>
              </button>
            ))}
          </div>
        </div>
        </ResultCard>

        {/* ━━━ PAGE 3: 천기 메시지 + 다른 콘텐츠 추천 ━━━ */}
        <ResultCard
          brand="🔮 천기(天機) 오리지널 | 100세 인생 대운 타임라인"
          title="PAGE 3 · 천기의 메시지"
          hash={`#천기대운 #${sajuInfo.ilOh}일간 #천기메시지`}
        >
          <Affirm name={nm} text={`${nm}님, 이 대운은 ${nm}님 인생에서 가장 중요한 결정들이 일어나는 10년이에요.`}/>
        </ResultCard>
        </div>{/* ═══ daeun-capture 닫기 ═══ */}

        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🌅",sid:"yearly_unse",name:"연도별 운세 →",bc:"rgba(155,143,212,0.3)",q:"특정 연도"},
          {ic:"🌙",sid:"saju_monthly",name:"월별 운세 →",bc:"rgba(95,196,158,0.3)",q:"이번 달은?"},
          {ic:"📜",sid:"tojeong",name:"토정비결 →",bc:"rgba(255,107,173,0.3)",q:"500년 전통"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="daeun-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},{ic:"📜",name:"토정비결",price:"1,980원",sid:"tojeong"},{ic:"🎋",name:"신년 운세",price:"1,980원",sid:"newyear"},{ic:"📊",name:"월별 운세",price:"980원",sid:"saju_monthly"},{ic:"🌅",name:"연도별 운세",price:"980원",sid:"yearly_unse"},{ic:"⏳",name:"전생 운세",price:"980원",sid:"past_life"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="daeun" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="대운 개운 굿즈" sub="10년 흐름을 더 좋게 만드는 아이템"/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"daeun",name:selectedPeriod?`${selectedPeriod.label} 대운`:"대운 해설"}} ctx={{}} cart={cart} setCart={setCart} onClose={()=>{setShowPay(false);if(selectedPeriod){setSelectedPeriod(null);goResult();}else{goResult();}}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// ─────────────────────────────────────────────────────────────
// 7. YearlyRichModal (yearly_unse) — 연도별 운세 풀버전
// ─────────────────────────────────────────────────────────────
export function YearlyRichModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,selectedPerson,onLoginRequest,onOpenService,onRequestPerson,forceIntro,helpers,preloadResult}:any){
  const{PayDonePopup,PayStepComp,ResultActions,GoodsRecSection,sajuPillars}=helpers;
  const sajuInfo=getSajuSimple(sajuPillars,selectedPerson?.birth);
  const nm=selectedPerson?.name||"나";
  const curYear=new Date().getFullYear();
  const[step,setStep]=useState<"info"|"q1"|"q2"|"pay"|"loading"|"result">(preloadResult?"result":(selectedPerson&&!forceIntro?"q1":"info"));
  const[ans1,setAns1]=useState<string>(preloadResult?.ans1||"");
  const[ans2,setAns2]=useState<string>(preloadResult?.ans2||"");
  const[showPay,setShowPay]=useState(false);
  const[targetYear,setTargetYear]=useState(preloadResult?.targetYear||curYear);
  const[extraPaid,setExtraPaid]=useState<number[]>(preloadResult?.extraPaid||[]);
  const[extraPay,setExtraPay]=useState<number|null>(null);

  function goResult(){setStep("loading");}
  function onLoaded(){
    setStep("result");
    addHistory({icon:"🌅",name:"연도별 운세",svcId:"yearly_unse",person:nm,result:`${targetYear}년 운세`,date:new Date().toLocaleDateString("ko-KR"),preQuestions:{year:ans1,area:ans2},resultType:{_birth:selectedPerson?.birth,_time:selectedPerson?.time,_testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}});
  }
  function buyExtra(y:number){setExtraPay(y);setShowPay(true);}
  function extraPayDone(){
    if(extraPay){
      setExtraPaid([...extraPaid,extraPay]);
      setTargetYear(extraPay);
    }
    setShowPay(false);
    setExtraPay(null);
  }

  const yearOpts=[curYear-2,curYear-1,curYear,curYear+1,curYear+2,curYear+3];

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(58,58,94,0.6)",textAlign:"center"}}>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#9B8FD4",marginBottom:6,lineHeight:1.4}}>🌅 연도별 운세</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;그 해, 나에겐 무슨 일이? 과거·현재·미래&rdquo;</div>
          {/* 연도 타임라인 */}
          <div style={{display:"flex",gap:5,marginBottom:16,padding:"10px",background:"rgba(212,175,55,0.08)",borderRadius:12,border:"1px solid rgba(212,175,55,0.2)"}}>
            {[curYear-2,curYear-1,curYear,curYear+1,curYear+2].map((y,i)=>(
              <div key={y} style={{flex:1,textAlign:"center",background:i===2?"rgba(212,175,55,0.2)":"rgba(255,255,255,0.04)",border:i===2?"1px solid rgba(212,175,55,0.5)":"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 4px",animation:`laserScan 3s ease-in-out infinite ${i*0.15}s`}}>
                <div style={{fontSize:10,fontWeight:i===2?800:400,color:i===2?"#D4AF37":"var(--mist)"}}>{y}</div>
                {i===2&&<div style={{fontSize:8,color:"#D4AF37",fontWeight:700}}>올해</div>}
                {i<2&&<div style={{fontSize:8,color:"rgba(168,196,184,0.4)"}}>과거</div>}
                {i>2&&<div style={{fontSize:8,color:"rgba(168,196,184,0.4)"}}>미래</div>}
              </div>
            ))}
          </div>
          {/* 포인트 — 테두리 제거, 내용 유지 */}
          <div style={{textAlign:"left",marginBottom:16}}>
            {[["🌅","그 해 전체 운세 흐름","재물·연애·직업·건강 종합"],["📅","분기별 에너지 흐름","1~4분기 각 기운"],["💰","재물 타이밍","돈이 들어오는 시기"],["❤️","인연 기운","좋은 만남 시기"],["🔮","과거 돌아보기","왜 그때 그런 일이"]].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:"var(--white)"}}>{f[1]}</div><div style={{fontSize:10,color:"#C1D1C1"}}>{f[2]}</div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--mist)"}}>980원 <span style={{opacity:0.7}}>· 추가 연도 380원</span></div>
        </div>
        <button onClick={()=>{
          if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"yearly_unse",icon:"🌅",name:"연도별 운세",desc:"",price:"980원"});onClose();return;}
          setStep("q1");
        }} style={{background:"#3a3a5e",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(58,58,94,0.4)",fontFamily:"inherit",marginTop:10}}>원하는 년도 디테일한 운세 보기 (980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}
      {step==="q1"&&<PreQA iconTitle={`🌅 ${nm}님의 연도별 운세`} subtitle="더 정확한 분석을 위해" title="어느 해가 궁금한가요?" step={1} total={2} answer={ans1} setAnswer={setAns1} onBack={()=>{if(onRequestPerson){onRequestPerson({id:"yearly_unse",icon:"🌅",name:"연도별 운세",desc:"",price:"980원"});onClose();}}} onNext={()=>{
        if(ans1.includes("내년"))setTargetYear(curYear+1);
        else if(ans1.includes("2년 후"))setTargetYear(curYear+2);
        else if(ans1.includes("지난"))setTargetYear(curYear-1);
        else setTargetYear(curYear);
        setStep("q2");
      }} onBack={()=>setStep("info")} opts={[{e:"📅",l:`올해 (${curYear})`},{e:"📅",l:`내년 (${curYear+1})`},{e:"📅",l:"2년 후"},{e:"📅",l:"지난해 돌아보기"}]} onClose={onClose}/>}
      {step==="q2"&&<PreQA iconTitle={`🌅 ${nm}님의 연도별 운세`} subtitle="더 정확한 분석을 위해" title="가장 중요한 영역은?" step={2} total={2} answer={ans2} setAnswer={setAns2} onNext={()=>setStep("pay")} onBack={()=>setStep("q1")} opts={[{e:"💰",l:"재물"},{e:"❤️",l:"연애·결혼"},{e:"💼",l:"직업·사업"},{e:"🌟",l:"전체"}]} onClose={onClose}/>}
      {step==="pay"&&<>
        <div className="mt">🌅 연도별 운세</div>
        <div className="ms">{targetYear}년 한 해 운세 · 980원</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          <div style={{fontSize:11,color:"var(--white)",marginBottom:3}}>📅 {targetYear}년</div>
          {ans2&&<div style={{fontSize:11,color:"var(--white)"}}>🎯 {ans2}</div>}
        </div>
        {PayStepComp?<PayStepComp price="980원" onPay={()=>setShowPay(true)} onBack={()=>setStep("q2")} loading={false} svcId="yearly_unse"/>:<>
          <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
          <button className="btn btn-g" onClick={()=>setStep("q2")}>이전</button>
        </>}
      </>}
      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="🌅" title={`${nm}님의 ${targetYear}년 분석 중...`} msgs={["연도 사주 배열 중... 🌅","그 해 천간지지 분석 중... ☯️","도깨비가 그 해 달력 훔쳐보는 중... 🪄","용왕님이 연간 재물 보따리 정리 중... 💰","마지막 마무리 중... 💫"]}/>}
      {step==="result"&&<>
        <div id="yearly-capture" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:14}}>
        {/* ━━━ PAGE 1: 총운 + 사주 헤더 + 영역별 점수 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${targetYear}년 연간 운세 정밀 분석`}
          title={`PAGE 1 · ${targetYear}년 총운 + 영역별`}
          hash={`#천기연도별운세 #${targetYear}년 #총운`}
        >
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:4}}>🌅 {nm}님의 {targetYear}년 운세</div>
            <div style={{fontSize:12,color:"#7A5C00",fontWeight:700}}>사주 기반 정밀 분석</div>
          </div>
          {/* v322: 검사 정보 */}
          <PersonInfo align="center" marginBottom={14} name={nm} birth={selectedPerson?.birth} time={selectedPerson?.time} calendar={selectedPerson?.calendar} gender={selectedPerson?.gender} testDate={preloadResult?._testDate}/>
          <SajuChips selectedPerson={selectedPerson}/>
          <SajuHeaderCard pillars={["丙","午"]} labels={["천간","지지"]} subtitle={`${targetYear}년 — 화 기운이 폭발하는 병오년`}/>
          {(ans1||ans2)&&<div style={{background:"#f8f9fa",borderRadius:9,padding:"12px 14px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
            <div style={{fontSize:9,color:"#7A5C00",letterSpacing:2,marginBottom:6,fontWeight:800}}>✦ {nm}님 맞춤 분석</div>
            <div style={{fontSize:12,color:"#222",lineHeight:1.7}}>📅 {targetYear}년<br/>{ans2&&<>🎯 집중: {ans2}</>}</div>
          </div>}
        <WhiteCard label={`${targetYear}년 총운`} emoji="🌟">
          <Para text={`${nm}님, ${targetYear}년을 솔직하게 말씀드릴게요. 병오년은 화 기운이 폭발하는 해예요. 적극적으로 나서는 사람에게 기회가 집중되는 해예요.`}/>
          <Para text={`${nm}님 일간 ${sajuInfo.ilgan}(${sajuInfo.ilOh}) 사주와 이 해의 기운이 꽤 잘 맞아요. 특히 상반기(1~6월)에 중요한 기회가 몰려있어요. ${ans2.includes("재물")?"재물 영역에서 상반기에 움직여야 해요. 하반기는 거두는 시기예요.":ans2.includes("연애")?"인연 영역은 4~5월이 인연의 기운이 가장 강해요.":ans2.includes("직업")?"직업 영역은 4월·10월 두 번의 큰 기회가 와요.":"전 영역에서 적극적인 사람이 답을 가져가요."}`}/>
        </WhiteCard>
        <WhiteCard label="영역별 점수" emoji="📊">
          <ScoreRow items={[{e:"💰",n:"재물",s:75},{e:"❤️",n:"연애",s:70},{e:"🌿",n:"건강",s:72},{e:"💼",n:"직업",s:83}]}/>
        </WhiteCard>
        </ResultCard>

        {/* ━━━ PAGE 2: 분기별 상세 + 길일 + 추가결제 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${targetYear}년 연간 운세`}
          title="PAGE 2 · 분기별 흐름 + 길일"
          hash="#천기연도별운세 #분기별흐름 #길일"
        >
        <WhiteCard label="분기별 상세 흐름" emoji="📅">
          {[{q:"1분기",months:"1~3월",mood:"🔥",good:true,text:"올해 에너지가 가장 강한 시기예요. 새로운 시작·중요한 결정 최적이에요.",dos:["새 프로젝트 시작","중요한 계약·협의","자기계발 시작"],dont:["망설임","큰 지출"]},
            {q:"2분기",months:"4~6월",mood:"✨",good:true,text:"재물과 인연의 기운이 함께 들어오는 시기. 올해 최고의 달들이 모여있어요.",dos:["인간관계 투자","재물 결정","이직·승진 시도"],dont:["충동 결정","과소비"]},
            {q:"3분기",months:"7~9월",mood:"😐",good:false,text:"에너지가 잠시 안정되는 시기. 상반기에 심은 씨앗이 자라는 중이에요.",dos:["내실 다지기","장기 계획","건강 관리"],dont:["새 큰 결정","무리한 확장"]},
            {q:"4분기",months:"10~12월",mood:"💰",good:true,text:"올해의 결실이 나타나는 시기. 재물운이 다시 올라와요.",dos:["성과 정리","내년 계획","중요한 마무리"],dont:["연말 무리한 투자","과음·과로"]},
          ].map(r=>(
            <div key={r.q} style={{marginBottom:14,background:r.good?"rgba(46,125,50,0.04)":"rgba(198,40,40,0.04)",border:`1px solid ${r.good?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.12)"}`,borderRadius:12,padding:"12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:18}}>{r.mood}</span>
                <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{r.q} <span style={{fontSize:10,color:"#666",fontWeight:400}}>({r.months})</span></div>
                <span style={{marginLeft:"auto",fontSize:9,padding:"2px 7px",borderRadius:8,background:r.good?"rgba(46,125,50,0.12)":"rgba(198,40,40,0.08)",color:r.good?"#2E7D32":"#C62828",fontWeight:700}}>{r.good?"기운 ↑":"주의"}</span>
              </div>
              <div style={{fontSize:11,color:"#333",lineHeight:1.7,marginBottom:8}}>{r.text}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:"#2E7D32",fontWeight:700,marginBottom:3}}>✓ 해야 할 것</div>
                  {r.dos.map((d,i)=>(<div key={i} style={{fontSize:10,color:"#333",marginBottom:3,paddingLeft:5,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{d}</div>))}
                </div>
                <div>
                  <div style={{fontSize:9,color:"#C62828",fontWeight:700,marginBottom:3}}>✗ 주의할 것</div>
                  {r.dont.map((d,i)=>(<div key={i} style={{fontSize:10,color:"#333",marginBottom:3,paddingLeft:5,borderLeft:"2px solid rgba(198,40,40,0.25)"}}>{d}</div>))}
                </div>
              </div>
            </div>
          ))}
        </WhiteCard>
        <WhiteCard label={`${targetYear}년 길일 & 주의 시기`} emoji="📅">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#2E7D32",marginBottom:8}}>✦ 최고의 달</div>
              {[["1월","새해 기운 강한 대길월"],["4월","재물·인연 복합 길월"],["10월","하반기 최고 재물월"]].map((d,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#333"}}>{d[0]}</div>
                  <div style={{fontSize:10,color:"#666",paddingLeft:5,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{d[1]}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#C62828",marginBottom:8}}>⚠️ 주의 시기</div>
              {[["3월","환절기 건강 주의"],["7~8월","과로·과열 주의"],["11월","감정적 결정 주의"]].map((d,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#333"}}>{d[0]}</div>
                  <div style={{fontSize:10,color:"#666",paddingLeft:5,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>{d[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </WhiteCard>
        {/* 다른 연도 추가결제 — 사주아이 스타일 */}
        <div style={{background:"#f8f9fa",border:"1px solid #e5e7eb",borderRadius:14,padding:"16px",marginBottom:12,borderLeft:"4px solid #D4AF37"}}>
          <div style={{fontSize:11,color:"#7A5C00",letterSpacing:2,marginBottom:4,fontWeight:800,textAlign:"center"}}>🔓 다른 연도 운세도 펼쳐보세요</div>
          <div style={{fontSize:10,color:"#8b6f1c",marginBottom:12,textAlign:"center"}}>{targetYear}년은 무료로 보셨어요 · 다른 연도는 각 380원</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {yearOpts.map(y=>{
              const isCur=y===targetYear;
              const isPaid=extraPaid.includes(y);
              return <button key={y} onClick={()=>{if(isCur)return;if(isPaid){setTargetYear(y);}else{buyExtra(y);}}} style={{padding:"12px 8px",borderRadius:12,border:isCur?"2px solid #D4AF37":isPaid?"1.5px solid #5FC49E":"1px solid rgba(201,167,78,0.4)",background:isCur?"#fff8eb":isPaid?"rgba(95,196,158,0.12)":"rgba(255,255,255,0.7)",color:isCur?"#7A5C00":"#5a4316",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:isCur?"default":"pointer",textAlign:"center",position:"relative",boxShadow:isCur?"none":"0 2px 8px rgba(0,0,0,0.06)"}}>
                {!isCur&&!isPaid&&<div style={{position:"absolute",top:6,right:8,fontSize:11,opacity:0.5}}>🔒</div>}
                {isPaid&&<div style={{position:"absolute",top:6,right:8,fontSize:11,color:"#059669"}}>✓</div>}
                <div style={{fontSize:14,fontWeight:900,marginBottom:3}}>{y}</div>
                <div style={{fontSize:9,color:isCur?"#7A5C00":isPaid?"#059669":"#8b6f1c",fontWeight:600,marginBottom:isCur||isPaid?0:6}}>{isCur?"✓ 보는 중":isPaid?"열람 가능":y===curYear?"올해":y<curYear?"과거":"미래"}</div>
                {!isCur&&!isPaid&&<div style={{display:"inline-block",fontSize:10,fontWeight:800,color:"#fff",background:"linear-gradient(135deg,#D4AF37,#B8942E)",padding:"3px 10px",borderRadius:14}}>+380원</div>}
              </button>;
            })}
          </div>
          <div style={{fontSize:10,color:"#8b6f1c",marginTop:10,textAlign:"center"}}>결제 시 동일한 풀버전이 새로 열려요</div>
        </div>
        </ResultCard>

        {/* ━━━ PAGE 3: 천기 메시지 ━━━ */}
        <ResultCard
          brand={`🔮 천기(天機) 오리지널 | ${targetYear}년 연간 운세`}
          title="PAGE 3 · 천기의 메시지"
          hash={`#천기연도별운세 #${targetYear}년 #천기메시지`}
        >
          <Affirm name={nm} text={`${nm}님, ${targetYear}년은 망설이는 사람보다 행동하는 사람에게 기회가 오는 해예요.`}/>
        </ResultCard>
        </div>{/* ═══ yearly-capture 닫기 ═══ */}

        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",q:"내 사주 전체"},
          {ic:"🌙",sid:"saju_monthly",name:"월별 운세 →",bc:"rgba(155,143,212,0.3)",q:"이번 달은?"},
          {ic:"🔄",sid:"daeun",name:"대운 해설 →",bc:"rgba(95,196,158,0.3)",q:"10년 큰그림"},
          {ic:"🎋",sid:"newyear",name:"신년 운세 →",bc:"rgba(255,107,173,0.3)",q:"꼼꼼한 1년"},
        ]}/>
        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="yearly-capture"/>
        {/* ✦ 이것도 해볼래요? — 표준 순서 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[{ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},{ic:"🎋",name:"신년 운세",price:"1,980원",sid:"newyear"},{ic:"📜",name:"토정비결",price:"1,980원",sid:"tojeong"},{ic:"📊",name:"월별 운세",price:"980원",sid:"saju_monthly"},{ic:"🔄",name:"대운 해설",price:"980원",sid:"daeun"},{ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"}].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        <GoodsRecSection svcId="yearly_unse" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="연도별 개운 굿즈" sub={`${targetYear}년 기운을 살리는 아이템`}/>
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"yearly_unse",name:extraPay?`${extraPay}년 운세 추가`:"연도별 운세"}} ctx={{}} cart={cart} setCart={setCart} onClose={extraPay?extraPayDone:()=>{setShowPay(false);goResult();}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}
