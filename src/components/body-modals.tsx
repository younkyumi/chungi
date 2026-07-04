"use client";
import { useState, useRef, useEffect } from "react";
import { computeSaju } from "@/lib/saju";

// ─── 공용 mini 컴포넌트 ─────────────────────────────────
function CloseBtn({onClose}:{onClose:()=>void}){
  return <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
    <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
  </div>;
}

function FunnelGrid({onOpenService,items}:{onOpenService:any,items:any[]}){
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
    {items.map((ad:any)=>(
      <div key={ad.sid} style={{background:"#ffffff",borderRadius:12,padding:"12px 8px",border:`2px solid ${ad.bc}`,textAlign:"center",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(ad.sid,ad.name.replace(" →",""),ad.ic,ad.price||"")}>
        <div style={{fontSize:18,marginBottom:2}}>{ad.ic}</div>
        <div style={{fontSize:12,fontWeight:900,color:"#0a1f1a",marginBottom:1}}>{ad.q}</div>
        <div style={{fontSize:9,color:"#666"}}>{ad.name}</div>
      </div>
    ))}
  </div>;
}

function ThisToo({items,onOpenService}:any){
  return <div style={{marginBottom:10}}>
    <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
    <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
      {items.map((cr:any)=>(
        <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"12px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
          <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
          <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
          <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
        </div>
      ))}
    </div>
  </div>;
}

function PreQA({iconTitle,subtitle,title,opts,multi,skipable,answer,setAnswer,onNext,onBack,step,total,onClose}:any){
  const sel:string[]=multi?(Array.isArray(answer)?answer:[]):(answer?[answer]:[]);
  const pick=(l:string)=>{
    if(multi){const next=sel.includes(l)?sel.filter(x=>x!==l):[...sel,l];setAnswer(next);}
    else{setAnswer(l);setTimeout(onNext,180);}
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
        return <button key={opt.l} onClick={()=>pick(opt.l)} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:s?"rgba(212,175,55,0.12)":"var(--ink3)",border:s?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.06)",borderRadius:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
          <span style={{fontSize:18,flexShrink:0}}>{opt.e}</span>
          <div style={{flex:1,fontSize:13,fontWeight:700,color:s?"var(--gold)":"var(--white)"}}>{opt.l}</div>
          {multi&&<div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${s?"var(--gold)":"rgba(168,196,184,0.3)"}`,background:s?"var(--gold)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink)",fontSize:11,fontWeight:900}}>{s?"✓":""}</div>}
        </button>;
      })}
    </div>
    {multi&&sel.length>0&&<button className="btn btn-p" style={{marginBottom:8}} onClick={onNext}>다음 → ({sel.length}개)</button>}
    {skipable&&<button onClick={onNext} style={{width:"100%",padding:11,background:"transparent",border:"1px dashed rgba(212,175,55,0.25)",borderRadius:12,color:"var(--gold)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>건너뛰기 →</button>}
    {(onBack||onClose)&&<div style={{display:"flex",gap:6}}>
      {onBack&&<button onClick={onBack} className="btn btn-g" style={{flex:1,marginTop:0,fontSize:12}}>← 이전</button>}
      {onClose&&<button onClick={onClose} className="btn btn-g" style={{flex:1,marginTop:0}}>닫기</button>}
    </div>}
  </div>;
}

function FunLoad({onDone,duration=3500,emoji,title,msgs}:any){
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

// 사주 입력 step (4개 body 모달 공통)
function SajuInput({sajuData,setSajuData,onNext,onBack,svcLabel}:any){
  const months=Array.from({length:12},(_,i)=>i+1);
  const days=Array.from({length:31},(_,i)=>i+1);
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <button onClick={onBack} style={{background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.25)",color:"var(--gold)",fontSize:11,fontWeight:700,cursor:"pointer",padding:"6px 10px",borderRadius:10,fontFamily:"inherit"}}>← 이전</button>
      <div style={{flex:1,fontSize:11,color:"var(--gold)",fontWeight:700,letterSpacing:1}}>☯️ 사주 교차 분석 (선택사항)</div>
    </div>
    <div style={{fontSize:15,fontWeight:700,color:"var(--gold2)",marginBottom:8,lineHeight:1.6}}>생년월일과 성별을 알려주시면<br/>{svcLabel}을 더 정밀하게 풀어드려요</div>
    <div style={{background:"rgba(212,175,55,0.07)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
      <div style={{fontSize:11,color:"var(--gold)",fontWeight:700,marginBottom:6}}>☯️ 사주가 추가되면 달라지는 것</div>
      {["📅 기운이 발현되는 정확한 시기 예측 (몇 살에)","☯️ 오행 교차로 성격·직업 정밀 분석","🔮 도화살·역마살 등 신살 교차 해석","✨ 대운 흐름 + 인생 타임라인"].map((t,i)=>(
        <div key={i} style={{display:"flex",gap:8,marginBottom:3}}>
          <span style={{color:"#4ade80",fontSize:11,flexShrink:0}}>✓</span>
          <span style={{fontSize:11,color:"var(--mist)",lineHeight:1.5}}>{t}</span>
        </div>
      ))}
    </div>
    <div style={{fontSize:11,color:"var(--mist)",marginBottom:6,fontWeight:700}}>📅 생년월일</div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:14}}>
      <input type="number" placeholder="1990" value={sajuData.year} onChange={e=>setSajuData({...sajuData,year:e.target.value})} style={{padding:"12px 10px",background:"var(--ink3)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"inherit",outline:"none",textAlign:"center"}}/>
      <select value={sajuData.month} onChange={e=>setSajuData({...sajuData,month:e.target.value})} style={{padding:"12px 8px",background:"var(--ink3)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"inherit",outline:"none",textAlign:"center"}}>
        <option value="">월</option>
        {months.map(m=><option key={m} value={m}>{m}월</option>)}
      </select>
      <select value={sajuData.day} onChange={e=>setSajuData({...sajuData,day:e.target.value})} style={{padding:"12px 8px",background:"var(--ink3)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"inherit",outline:"none",textAlign:"center"}}>
        <option value="">일</option>
        {days.map(d=><option key={d} value={d}>{d}일</option>)}
      </select>
    </div>
    <div style={{fontSize:11,color:"var(--mist)",marginBottom:6,fontWeight:700}}>👤 성별</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
      {[{l:"여자",e:"👩"},{l:"남자",e:"👨"}].map(g=>{
        const sel=sajuData.gender===g.l;
        return <button key={g.l} onClick={()=>setSajuData({...sajuData,gender:g.l})} style={{padding:"14px",background:sel?"rgba(212,175,55,0.15)":"var(--ink3)",border:sel?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.06)",borderRadius:12,color:sel?"var(--gold)":"var(--white)",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{g.e} {g.l}</button>;
      })}
    </div>
    <button className="btn btn-p" onClick={onNext}>{sajuData.year&&sajuData.month&&sajuData.day&&sajuData.gender?"☯️ 사주 교차 분석으로 →":"건너뛰고 진행 →"}</button>
  </div>;
}

// 사주 교차 분석 섹션 (Body 모달 공통)
function SajuCrossSection({sajuData,svcId}:{sajuData:any,svcId:string}){
  if(!sajuData?.year||!sajuData?.month||!sajuData?.day)return null;
  const y=+sajuData.year,m=+sajuData.month,d=+sajuData.day;
  // v806(Phase2): 가짜 해시 일간 → 정확한 단일 엔진(절기·입춘)으로 교체
  const _sj=computeSaju(`${y}-${m}-${d}`,sajuData.time!=null&&sajuData.time!=="모름"?String(sajuData.time):null);
  const ilOh=_sj.ilganOh;
  const ilgan=_sj.ilganHj;
  // svcId별 교차 풀이
  const crossMap:Record<string,{title:string,items:{label:string,age:string,text:string}[]}>={
    palmistry:{title:"☯️ 사주 × 손금 교차 분석",items:[
      {label:"❤️ 연애·결혼",age:"32~36세",text:`${ilgan}(${ilOh}) 일간 + 감정선이 강한 손금 = ${ilOh==="목"?"진심으로 깊어지는 사랑":ilOh==="화"?"열정적이고 강렬한 인연":ilOh==="토"?"안정적이고 든든한 동반자":ilOh==="금"?"의리 있는 한결같은 사랑":"지혜로운 운명적 만남"}이 와요. 결혼선과 사주의 부부궁이 만나 ${32+(y%5)}~${36+(y%5)}세에 인연 결정 시기.`},
      {label:"💰 재물·직업",age:"38~45세",text:`재물선이 굵어지는 시기와 사주의 재성(財星)이 만나 ${38+(m%4)}~${45+(d%5)}세에 재물 폭발기. ${ilOh==="목"?"전문성·콘텐츠":ilOh==="화"?"미디어·세일즈":ilOh==="토"?"부동산·중개":ilOh==="금"?"금융·법조":"IT·연구"} 분야에서 빛나요.`},
      {label:"💚 건강·수명",age:"50대 이후",text:`생명선이 길고 사주 일간이 ${ilOh}이라면 ${ilOh==="목"||ilOh==="수"?"간·신장":"심장·소화기"} 계통 주의. 50대 이후 건강 관리가 운명을 좌우.`},
      {label:"🌟 인생 흐름",age:"전 인생",text:`운명선과 사주 대운이 만나는 ${30+(y%10)}대 후반이 인생의 황금기. 사주 격국 + 손금이 가리키는 핵심 = ${ilOh==="목"?"성장과 창조":ilOh==="화"?"열정과 표현":ilOh==="토"?"안정과 신뢰":ilOh==="금"?"의리와 결단":"지혜와 직관"}.`},
    ]},
    footreading:{title:"☯️ 사주 × 발금 교차 분석",items:[
      {label:"❤️ 연애·인연",age:"30~35세",text:`발금에서 정인(情仁)이 강하고 사주 ${ilgan}(${ilOh})에 도화살이 있다면 ${30+(m%5)}~${35+(d%4)}세에 운명적 만남. 발 모양이 ${ilOh==="목"?"길고 가는 형":"단단하고 균형형"}이라 ${ilOh==="목"||ilOh==="화"?"열정형":"안정형"} 인연.`},
      {label:"💰 재물",age:"40대 초반",text:`발바닥의 재물 반사구가 활성화되고 사주 재성이 강하면 ${40+(y%6)}세 전후 큰 재물 기회. 발바닥 안쪽이 두꺼우면 부동산 운, 바깥쪽이면 사업 운.`},
      {label:"💚 건강 반사구",age:"50대 이후",text:`발바닥 반사구 + 사주 일간 ${ilOh} = ${ilOh==="목"?"간·담":ilOh==="화"?"심장·혈관":ilOh==="토"?"비장·위장":ilOh==="금"?"폐·대장":"신장·방광"} 부위 집중 관리.`},
      {label:"🌟 인생 흐름",age:"전 인생",text:`발금이 깊고 선명하면 사주 대운이 받쳐주는 시기 = ${30+(y%15)}대. 활동·이동·여행이 많은 ${ilOh==="화"||ilOh==="목"?"역마형":"정착형"} 인생.`},
    ]},
    mole:{title:"☯️ 사주 × 얼굴점 교차 분석",items:[
      {label:"💰 코 옆 재물복점",age:"35~42세",text:`코 옆 점 + 사주 ${ilgan} 일간의 재성 = ${35+(y%7)}~${42+(d%6)}세에 재물 폭발. ${ilOh==="금"||ilOh==="토"?"안정적 자산":"폭발적 수입"} 패턴.`},
      {label:"💕 눈꼬리 도화점",age:"28~34세",text:`눈꼬리 점 + 사주 도화살 = 인기와 매력 폭발. ${28+(m%6)}~${34+(d%5)}세 사이 ${ilOh==="화"||ilOh==="수"?"강렬한 만남":"잔잔한 인연"}.`},
      {label:"🌟 이마 점",age:"청년기",text:`이마 위 점 = 초년운. 사주 일간 ${ilOh}이 ${ilOh==="목"||ilOh==="화"?"강하면 빠른 출세":"강하면 학업 성취"}. 인생의 첫 큰 도약 시기 ${20+(y%10)}대.`},
      {label:"🌿 입가 점",age:"40대 이후",text:`입가 점 + 사주 식상(食傷) = 말년에 대중적 인기. ${ilOh==="화"?"방송·강연":"음식·사업"} 쪽에서 두각.`},
    ]},
    eye_mole:{title:"☯️ 사주 × 눈점 교차 분석",items:[
      {label:"💧 와잠점",age:"30~36세",text:`눈 아래 와잠점 + 사주 ${ilgan} 자녀궁 = 자녀운이 깊음. ${30+(m%6)}~${36+(d%5)}세에 자녀 또는 깊은 인연.`},
      {label:"💕 눈꼬리 점",age:"이성 인연",text:`눈꼬리 점 + 사주 도화·역마 = ${ilOh==="화"||ilOh==="수"?"먼 곳에서 오는 운명":"가까이 있던 사람과 결정"}. ${28+(y%5)}세 결정적 시기.`},
      {label:"💰 눈 위 점",age:"35~44세",text:`눈 위 점 + 사주 재성 = ${35+(d%6)}~${44+(m%4)}세 큰 기회. 그 시기에 결정해야 함.`},
      {label:"🌟 명예운",age:"40대 이후",text:`눈 부위 점은 명예 + 사주 관성 = ${40+(y%5)}대에 사회적 인정. ${ilOh==="금"?"공직·법조":"교육·문화"} 분야 적합.`},
    ]},
  };
  const cross=crossMap[svcId]||crossMap.palmistry;
  return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.14)"}}>
    <div style={{fontSize:9,color:"#7A5C00",letterSpacing:3,marginBottom:6,fontWeight:700}}>{cross.title}</div>
    <div style={{fontSize:11,color:"#666",marginBottom:14,lineHeight:1.7}}>{ilgan}({ilOh}) 일간 + {svcId==="palmistry"?"손금":svcId==="footreading"?"발금":svcId==="mole"?"얼굴점":"눈점"} 교차 = <strong style={{color:"#7A5C00"}}>980원의 핵심 가치</strong></div>
    {cross.items.map((it,i)=>(
      <div key={i} style={{marginBottom:14,paddingLeft:10,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>
        <div style={{fontSize:12,fontWeight:800,color:"#1A3C32",marginBottom:3}}>{it.label} <span style={{fontSize:10,color:"#D4AF37",fontWeight:700,marginLeft:6}}>📅 {it.age}</span></div>
        <div style={{fontSize:11,color:"#555",lineHeight:1.75}}>{it.text}</div>
      </div>
    ))}
  </div>;
}

// ─── 손금 데이터 ─────────────────────────────────
const PALM_LINES=[
  {name:"❤️ 감정선",score:82,length:"길고 선명",shape:"완만한 호",color:"#FF6B6B",
   reading:"감정선이 검지 아래까지 길게 이어져요. 감정이 풍부하고 사랑에 진심인 사람의 손금이에요. 한 번 사랑하면 깊이 빠지는 타입이에요. 감정선 중간에 작은 섬(○) 모양이 보이는데, 이 시기에 감정적 시련이 있었을 거예요. 결혼선이 1~2개 보여요. 한 번의 깊은 인연이 있을 사주예요.",
   caution:"감정에 너무 치우쳐 이성적 판단을 놓치는 경우를 조심하세요."},
  {name:"💰 재물선",score:74,length:"중간 길이",shape:"중지 하단에서 시작",color:"#FDCB6E",
   reading:"재물선이 손바닥 중간에서 위로 이어져요. 30대 중반 이후부터 재물이 안정적으로 들어오는 패턴이에요. 재물선 끝이 두 갈래로 갈리는 지점이 보이는데, 이건 수입원이 여러 개 생기는 것을 의미해요.",
   caution:"한 번에 큰돈을 쫓기보다 꾸준히 쌓는 방식이 이 손금에 맞아요."},
  {name:"💚 생명선",score:88,length:"매우 길고 선명",shape:"엄지 주변을 크게 감싸는 호",color:"#4CAF50",
   reading:"생명선이 손바닥 전체를 크게 감싸는 형태예요. 생명력이 강하고 회복력이 뛰어난 손금이에요. 중간에 작은 가지선이 위로 올라가는 게 보이는데, 큰 도약이나 환경 변화가 있었음을 의미해요. 장수형 손금이에요.",
   caution:"소화기 계통이 예민할 수 있어요. 스트레스 받으면 위장부터 신호가 와요."},
  {name:"🧠 두뇌선",score:79,length:"길고 경사짐",shape:"약간 아래로 내려가는 형태",color:"#74B9FF",
   reading:"두뇌선이 감정선과 살짝 붙어서 시작하다가 분리돼요. 신중한 성격이지만 일단 결심하면 대담하게 행동하는 타입이에요. 약간 아래 방향으로 경사진 건 창의적·예술적 감수성을 의미해요.",
   caution:"생각이 너무 많아서 결정을 미루는 경향. 직관을 더 믿어보세요."},
  {name:"🌟 운명선",score:71,length:"중간",shape:"손목에서 중지 방향으로 상승",color:"#E8C87A",
   reading:"운명선이 손바닥 중앙에서 선명하게 올라가요. 뚜렷한 목표와 방향이 있다는 의미예요. 중간에 끊겼다가 다시 시작되는 부분 = 인생의 방향이 크게 바뀌는 시기. 새 운명선부터가 진짜 본인의 길이에요.",
   caution:"남의 기대보다 내 길을 가는 게 이 운명선의 핵심이에요."},
];

// 손 실루엣 SVG
function PalmSilhouette(){
  return <svg viewBox="0 0 300 400" width="100%" height="100%">
    <ellipse cx="150" cy="280" rx="80" ry="100" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
    <rect x="82" y="140" width="28" height="110" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
    <rect x="114" y="110" width="28" height="130" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
    <rect x="146" y="115" width="28" height="125" rx="14" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
    <rect x="178" y="125" width="26" height="115" rx="13" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1"/>
    <rect x="60" y="195" width="22" height="70" rx="11" fill="rgba(232,200,122,0.08)" stroke="rgba(232,200,122,0.2)" strokeWidth="1" transform="rotate(-20 60 195)"/>
    <path d="M 120,190 Q 80,210 78,250 Q 76,290 88,340" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 6px #4CAF50)"}}/>
    <path d="M 95,200 Q 140,185 185,195 Q 210,200 225,210" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 6px #FF6B6B)"}}/>
    <path d="M 100,220 Q 145,215 190,228 Q 210,234 225,245" stroke="#74B9FF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 5px #74B9FF)"}}/>
    <path d="M 150,345 Q 148,280 147,230 Q 146,190 148,160" stroke="#E8C87A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" style={{filter:"drop-shadow(0 0 5px #E8C87A)"}}/>
    <text x="148" y="158" fontSize="12" fill="#E8C87A" textAnchor="middle" opacity="0.85">★</text>
    <text x="72" y="197" fontSize="7.5" fill="#FF6B6B" fontWeight="bold" opacity="0.85">감정선</text>
    <text x="72" y="217" fontSize="7.5" fill="#74B9FF" fontWeight="bold" opacity="0.85">두뇌선</text>
    <text x="56" y="260" fontSize="7.5" fill="#4CAF50" fontWeight="bold" opacity="0.85">생명선</text>
    <text x="152" y="148" fontSize="7.5" fill="#E8C87A" fontWeight="bold" opacity="0.85" textAnchor="middle">운명선</text>
  </svg>;
}

// ─── 손금 모달 ─────────────────────────────────
export function PalmistryModal({onClose,cart,setCart,onGoShop,addHistory,isLoggedIn,onLoginRequest,onOpenService,selectedPerson,helpers}:any){
  const{PayDonePopup,ResultActions,GoodsRecSection}=helpers;
  const nm=selectedPerson?.name||"본인";
  const[step,setStep]=useState<"info"|"who"|"upload"|"q1"|"q2"|"q3"|"saju"|"pay"|"loading"|"result">("info");
  const[hand,setHand]=useState("");
  const[focus,setFocus]=useState<string[]>([]);
  const[concern,setConcern]=useState("");
  const[uploadedImg,setUploadedImg]=useState<string|null>(null);
  const[sajuData,setSajuData]=useState({year:selectedPerson?.birth?selectedPerson.birth.split("-")[0]:"",month:selectedPerson?.birth?String(parseInt(selectedPerson.birth.split("-")[1]||"")):"",day:selectedPerson?.birth?String(parseInt(selectedPerson.birth.split("-")[2]||"")):"",gender:""});
  const[showPay,setShowPay]=useState(false);
  const[openLine,setOpenLine]=useState<number|null>(null);
  const fileRef=useRef<any>(null);

  function onLoaded(){
    setStep("result");
    addHistory?.({icon:"✋",name:"손금",svcId:"palmistry",person:nm,date:new Date().toLocaleDateString("ko-KR"),result:`${hand} 분석 · 종합 78점`,resultType:{hand,focus,concern,sajuData,_imgSrc:uploadedImg},preQuestions:{hand,focus:focus.join(", "),concern}});
  }

  return<>
    <div className="ov"><div className="md" style={{maxHeight:"92vh",overflow:"auto"}}><div className="hd"/>
      <CloseBtn onClose={onClose}/>
      {step==="info"&&<>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:20,padding:"22px 18px",border:"2px solid rgba(212,175,55,0.5)",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:6}}>✋</div>
          <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:20,fontWeight:900,color:"#D4AF37",marginBottom:6,lineHeight:1.4}}>손금 풀이</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,fontStyle:"italic",lineHeight:1.6}}>&ldquo;사진 한 장으로 꿰뚫어본 손바닥 속 내 인생&rdquo;</div>
          {/* 이미지 — 손 실루엣 + 선 범례 */}
          <div style={{aspectRatio:"3/4",maxHeight:240,margin:"0 auto 12px",background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(212,175,55,0.25)"}}>
            <PalmSilhouette/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16,padding:"10px",background:"rgba(212,175,55,0.08)",borderRadius:10,border:"1px solid rgba(212,175,55,0.18)"}}>
            {[["❤️ 감정선","#FF6B6B","연애·결혼"],["💰 재물선","#FDCB6E","돈복·재물"],["💚 생명선","#4CAF50","건강·수명"],["🧠 두뇌선","#74B9FF","지능·직업"],["🌟 운명선","#E8C87A","인생방향"],["✨ 특수마크","#fff","별·삼지창 등"]].map((x,i)=>(
              <div key={x[0]} style={{display:"flex",alignItems:"center",gap:6,animation:`laserScan 3s ease-in-out infinite ${i*0.1}s`}}>
                <div style={{width:14,height:3,borderRadius:2,background:x[1],flexShrink:0,boxShadow:`0 0 4px ${x[1]}`}}/>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:10,color:"var(--white)",fontWeight:600}}>{x[0]}</div>
                  <div style={{fontSize:8,color:"var(--mist)"}}>{x[2]}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 포인트 */}
          <div style={{textAlign:"left",marginBottom:16,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(212,175,55,0.15)"}}>
            {[["✋","5대 손금 완전 분석"],["🔍","AI 선 추적 + 오버레이"],["❤️","연애·결혼 타이밍"],["💰","재물선 상세 풀이"],["⭐","특수 기호 해석"],["☯️","사주 × 손금 교차 (NEW)"],["🎯","나만의 개운법"]].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:14}}>{f[0]}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#D4AF37"}}>{f[1]}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--mist)"}}>980원</div>
        </div>
        <button onClick={()=>setStep("upload")} style={{background:"#D4AF37",width:"100%",padding:"14px",border:"none",borderRadius:12,color:"#1A3C32",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(212,175,55,0.4)",fontFamily:"inherit",marginTop:10}}>내 손바닥 속 운명 읽기 (980원) →</button>
        <button className="btn btn-g" style={{marginTop:10}} onClick={onClose}>닫기</button>
      </>}

      {step==="upload"&&<>
        <div className="mt">📸 손 사진을 올려주세요</div>
        <div className="ms">밝은 곳에서 손바닥 펴서 촬영하면 정확해요</div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>setUploadedImg(ev.target?.result as string);r.readAsDataURL(f);}}}/>
        {uploadedImg?<div style={{position:"relative",width:"100%",borderRadius:14,overflow:"hidden",marginBottom:12}}>
          <img src={uploadedImg} style={{width:"100%",display:"block"}} alt=""/>
          <div style={{position:"absolute",top:10,right:10,background:"rgba(46,125,50,0.9)",borderRadius:8,padding:"4px 10px",fontSize:10,color:"#fff",fontWeight:700}}>✓ 업로드 완료</div>
        </div>:<button onClick={()=>fileRef.current?.click()} style={{width:"100%",aspectRatio:"3/4",maxHeight:300,background:"var(--ink3)",border:"2px dashed rgba(212,175,55,0.3)",borderRadius:14,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,marginBottom:12,fontFamily:"inherit",color:"var(--white)"}}>
          <span style={{fontSize:48}}>✋</span>
          <div style={{fontSize:14,fontWeight:700}}>사진 올리기</div>
          <div style={{fontSize:11,color:"var(--mist)"}}>카메라 또는 갤러리에서 선택</div>
        </button>}
        {!uploadedImg&&<button onClick={()=>setUploadedImg("demo")} style={{width:"100%",padding:12,background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,cursor:"pointer",fontSize:12,color:"var(--gold)",fontFamily:"inherit",marginBottom:12}}>📋 사진 없이 데모로 보기</button>}
        <button className="btn btn-p" disabled={!uploadedImg} style={{opacity:uploadedImg?1:0.5}} onClick={()=>uploadedImg&&setStep("q1")}>다음 →</button>
        <button className="btn btn-g" onClick={()=>setStep("info")}>이전</button>
      </>}

      {step==="q1"&&<PreQA title="어떤 손을 분석할까요?" step={1} total={3} answer={hand} setAnswer={setHand} onNext={()=>setStep("q2")} onBack={()=>setStep("upload")}
        opts={[{e:"✋",l:"왼손 (선천운 · 타고난 잠재력)"},{e:"🤚",l:"오른손 (후천운 · 현재·미래)"}]}/>}

      {step==="q2"&&<PreQA title="가장 궁금한 손금은?" multi step={2} total={3} answer={focus} setAnswer={setFocus} onNext={()=>setStep("q3")} onBack={()=>setStep("q1")}
        opts={[{e:"❤️",l:"감정선 (연애·결혼)"},{e:"💰",l:"재물선 (돈복·재산)"},{e:"💚",l:"생명선 (건강·수명)"},{e:"🧠",l:"두뇌선 (지능·직업)"},{e:"🌟",l:"운명선 (인생 방향)"},{e:"✨",l:"태양선 (명예·성공)"},{e:"🌈",l:"전체 다 궁금해요!"}]}/>}

      {step==="q3"&&<PreQA title="지금 가장 신경 쓰이는 건?" skipable step={3} total={3} answer={concern} setAnswer={setConcern} onNext={()=>setStep("saju")} onBack={()=>setStep("q2")}
        opts={[{e:"❤️",l:"연애·결혼이 언제 될지"},{e:"💰",l:"돈복이 있는지"},{e:"💼",l:"직업·커리어 방향"},{e:"🌿",l:"건강·수명"},{e:"🌟",l:"인생 전체 흐름"},{e:"🔮",l:"딱히 없어요"}]}/>}

      {step==="saju"&&<SajuInput sajuData={sajuData} setSajuData={setSajuData} svcLabel="손금" onNext={()=>setStep("pay")} onBack={()=>setStep("q3")}/>}

      {step==="pay"&&<>
        <div className="mt">결제하기</div>
        <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.2)",borderRadius:12,padding:"12px",marginBottom:12}}>
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:1,marginBottom:6}}>입력 내용</div>
          <div style={{fontSize:11,color:"var(--white)",lineHeight:1.7}}>{hand&&<>✋ {hand}<br/></>}{focus.length>0&&<>🔍 {focus.slice(0,3).join(", ")}<br/></>}{concern&&<>💭 {concern}<br/></>}{sajuData.year&&<>☯️ 사주 교차 분석 포함</>}</div>
        </div>
        <div style={{textAlign:"center",fontSize:22,fontWeight:900,color:"var(--gold)",marginBottom:12}}>980원</div>
        <button className="btn btn-p" onClick={()=>setShowPay(true)}>결제하고 결과보기 →</button>
        <button className="btn btn-g" onClick={()=>setStep("saju")}>이전</button>
      </>}

      {step==="loading"&&<FunLoad onDone={onLoaded} emoji="✋" title={`${nm}님의 손금 분석 중...`} msgs={["손금 윤곽 분석 중... ✋","생명선 추적 중... 💚","감정선 해석 중... ❤️","재물선 감지 중... 💰","도사 할머니가 손 들여다보는 중... 🔮","사주 교차 매칭 중... ☯️"]}/>}

      {step==="result"&&<>
        <div className="succ"><div className="succ-icon">✋</div><div className="succ-title">{nm}님의 손금</div><div className="succ-sub">{hand} · 종합 78점</div></div>

        {/* 사진 + 손금 분석 */}
        {uploadedImg&&uploadedImg!=="demo"&&<div style={{background:"#fff",borderRadius:16,padding:"14px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
          <img src={uploadedImg} alt="" style={{width:"100%",borderRadius:10,display:"block"}}/>
          <div style={{fontSize:9,color:"#888",textAlign:"center",marginTop:6}}>업로드된 손 사진</div>
        </div>}

        {/* 종합 평가 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.14)"}}>
          <div style={{fontSize:9,color:"#7A5C00",letterSpacing:3,marginBottom:8,fontWeight:700}}>✋ 종합 평가</div>
          <div style={{fontSize:13,color:"#222",lineHeight:2.0}}>{nm}님의 {hand}을 보는 순간 느낌이 왔어요. 손금이 선명하고 깊게 패여있어요. 에너지가 강하고 의지력이 뚜렷한 손이에요. 생명선이 길고 끊김 없이 이어져 있고, 감정선이 유독 선명해요. 감수성이 풍부하고, 한번 마음을 먹으면 끝까지 가는 사람이에요.</div>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,background:"#fef9e7",color:"#7A5C00",border:"1px solid rgba(212,175,55,0.3)"}}>🏆 종합 78점</span>
            {focus.length>0&&<span style={{fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:20,background:"#fff",color:"#7A5C00",border:"1px solid #eee"}}>🔍 {focus[0]}</span>}
          </div>
        </div>

        {/* 5대 손금 토글 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.14)"}}>
          <div style={{fontSize:9,color:"#7A5C00",letterSpacing:3,marginBottom:8,fontWeight:700}}>📊 5대 손금 분석</div>
          <div style={{fontSize:10,color:"#666",marginBottom:12}}>각 선을 탭하면 자세히 보기</div>
          {PALM_LINES.map((line,i)=>{
            const isOpen=openLine===i;
            return <div key={i} style={{marginBottom:8,border:"1px solid #f0f0f0",borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setOpenLine(isOpen?null:i)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:isOpen?"#fafafa":"#fff",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",marginBottom:3}}>{line.name}</div>
                  <div style={{fontSize:10,color:"#888"}}>{line.length} · {line.shape}</div>
                </div>
                <div style={{fontSize:14,fontWeight:900,color:line.color,marginRight:6}}>{line.score}점</div>
                <span style={{fontSize:13,color:"#999",transform:isOpen?"rotate(180deg)":"none",transition:".2s"}}>▾</span>
              </button>
              {isOpen&&<div style={{padding:"12px 14px",background:"#fafafa",borderTop:"1px solid #f0f0f0"}}>
                <div style={{fontSize:11,color:"#555",lineHeight:1.75,marginBottom:8}}>{line.reading}</div>
                <div style={{fontSize:10,color:"#C62828",background:"#fff",padding:"8px 10px",borderRadius:8,borderLeft:"3px solid #ffccd0"}}>⚠️ {line.caution}</div>
              </div>}
            </div>;
          })}
        </div>

        {/* ☯️ 사주 교차 분석 */}
        <SajuCrossSection sajuData={sajuData} svcId="palmistry"/>

        {/* 개운법 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.14)"}}>
          <div style={{fontSize:9,color:"#7A5C00",letterSpacing:3,marginBottom:8,fontWeight:700}}>✨ 손금 개운법</div>
          {["손을 자주 펴고 손금을 보는 연습 — 긍정 기운 흐름","왼손과 오른손 손바닥을 마주 비비는 동작 — 기운 순환","오른손 중지에 금반지·금색 액세서리 — 재물선 활성화"].map((g,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"9px 12px",background:"#fef9e7",borderRadius:9,borderLeft:"3px solid rgba(212,175,55,0.4)"}}>
              <span style={{fontSize:14,flexShrink:0}}>✨</span>
              <div style={{fontSize:11,color:"#444",lineHeight:1.7}}>{g}</div>
            </div>
          ))}
        </div>

        {/* 광고배너 */}
        <FunnelGrid onOpenService={onOpenService} items={[
          {ic:"🦶",sid:"footreading",name:"발금 →",bc:"rgba(212,175,55,0.3)",q:"발금도 볼래?",price:"980원"},
          {ic:"⚫",sid:"mole",name:"얼굴 점 →",bc:"rgba(155,143,212,0.3)",q:"얼굴 점은?",price:"980원"},
          {ic:"☯️",sid:"saju",name:"사주 풀이 →",bc:"rgba(95,196,158,0.3)",q:"내 사주는?",price:"980원"},
          {ic:"👁️",sid:"eye_mole",name:"눈 점 →",bc:"rgba(255,107,173,0.3)",q:"눈 점도?",price:"980원"},
        ]}/>

        <ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}}/>

        <ThisToo onOpenService={onOpenService} items={[
          {ic:"🦶",name:"발금",price:"980원",sid:"footreading"},
          {ic:"⚫",name:"얼굴 점",price:"980원",sid:"mole"},
          {ic:"👁️",name:"눈 점",price:"980원",sid:"eye_mole"},
          {ic:"☯️",name:"사주 풀이",price:"980원",sid:"saju"},
          {ic:"🪞",name:"내 관상보기",price:"980원",sid:"gwansang_full"},
          {ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"},
        ]}/>

        <GoodsRecSection svcId="palmistry" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose();onGoShop();}} title="손금 개운 굿즈" sub="감정선·재물선 기운을 살리는 아이템"/>

        <button className="btn btn-p" onClick={onClose}>확인</button>
      </>}
    </div></div>
    {showPay&&<PayDonePopup svc={{id:"palmistry",name:"손금 풀이"}} ctx={{}} cart={cart} setCart={setCart} onClose={()=>{setShowPay(false);setStep("loading");}} onGoShop={()=>{setShowPay(false);onClose();onGoShop();}}/>}
  </>;
}

// 발금/얼굴점/눈점은 동일 패턴으로 다음 라운드에 추가 예정 (현재는 기존 SvcModal 사용)
