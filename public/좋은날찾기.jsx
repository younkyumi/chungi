import { useState } from "react";
const G="#E8C87A", DG="#0D2318";
const Q1OPTS=[{e:"💍",l:"결혼식·약혼"},{e:"🏠",l:"이사·입주"},{e:"💼",l:"계약·창업·개업"},{e:"🌱",l:"새로운 시작"},{e:"✈️",l:"여행 출발"},{e:"🏥",l:"수술·시술"},{e:"🎓",l:"시험·면접"},{e:"💰",l:"투자·큰 지출"},{e:"💭",l:"기타"}];
const Q2OPTS=[{e:"📅",l:"이번 달"},{e:"➡️",l:"다음 달"},{e:"🗓️",l:"3개월 내"},{e:"📆",l:"6개월 내"},{e:"🌟",l:"올해 안"},{e:"💭",l:"기타"}];

function Sheet({children}){return <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}><div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{children}</div></div>;}
function Handle(){return <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;}
function PayStep({onNext}){
  const [m,setM]=useState("kakao");
  const MS=[{k:"kakao",l:"카카오페이",s:"원터치 간편결제"},{k:"toss",l:"토스페이",s:"간편결제"},{k:"naver",l:"네이버페이",s:"포인트 적립"},{k:"card",l:"카드결제",s:"신용/체크카드"},{k:"phone",l:"핸드폰 결제",s:"통신사 결제"}];
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"12px 16px 16px"}}><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
    <div style={{padding:"0 16px"}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div>
        <button style={{padding:"8px 14px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:8,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button>
      </div>
      {[{i:"🎫",l:"쿠폰 (0장)"},{i:"🎟️",l:"이용권 (0장)"}].map(it=><div key={it.l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{it.i} {it.l}</p><p style={{fontSize:12,color:"rgba(255,255,255,0.3)",margin:0}}>눌러서 목록 보기</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>›</span></div>)}
      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>상품 가격</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>980원</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:14,fontWeight:700,color:G}}>980원</span></div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>🔐 결제 수단</p>
      {MS.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:m===mm.k?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${m===mm.k?"rgba(232,200,122,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}><div style={{width:28,height:28,borderRadius:"50%",background:m===mm.k?"rgba(232,200,122,0.2)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>{m===mm.k&&<div style={{width:10,height:10,borderRadius:"50%",background:G}}/>}</div><div><p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"0 0 1px"}}>{mm.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{mm.s}</p></div></button>)}
      <button onClick={onNext} style={{width:"100%",padding:"16px",marginTop:8,background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>980원 결제하기 →</button>
    </div>
  </div>;
}

function QuestionStep({onNext}){
  const [qs,setQs]=useState(1),[q1,setQ1]=useState(null),[q2,setQ2]=useState(null);
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:24}}>📅</span>
        <div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>좋은 날 찾기</h3>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>내가 모르는 숨은 길일까지 · 980원</p></div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 10px"}}>{qs}/2</p>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*50}%`,background:G,borderRadius:2,transition:"0.3s"}}/></div>
      {qs===1&&<>
        <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 10px"}}>Q1. 어떤 날을 찾고 있나요?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {Q1OPTS.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{padding:"12px 10px",background:q1===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
            <span style={{fontSize:18,flexShrink:0}}>{o.e}</span>
            <span style={{fontSize:11,color:q1===o.l?G:"rgba(255,255,255,0.65)",lineHeight:1.4}}>{o.l}</span>
            {q1===o.l&&<span style={{marginLeft:"auto",color:G,fontSize:12,flexShrink:0}}>✓</span>}
          </button>)}
        </div>
        <button onClick={()=>q1&&setQs(2)} style={{width:"100%",padding:"15px",background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>다음 →</button>
      </>}
      {qs===2&&<>
        <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q2. 원하는 기간은?</p>
        <div style={{background:"rgba(255,165,0,0.1)",border:"1px solid rgba(255,165,0,0.2)",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
          <p style={{fontSize:11,color:"#fbbf24",margin:"0 0 2px",fontWeight:600}}>⚠️ 안내</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>요일 선택은 사주 길일과 충돌 가능해요. AI가 사주 기반으로 최적 날짜를 자동 제안해드려요.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {Q2OPTS.map(o=><button key={o.l} onClick={()=>setQ2(o.l)} style={{padding:"13px 10px",background:q2===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q2===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18,flexShrink:0}}>{o.e}</span>
            <span style={{fontSize:12,color:q2===o.l?G:"rgba(255,255,255,0.65)"}}>{o.l}</span>
            {q2===o.l&&<span style={{marginLeft:"auto",color:G,fontSize:12,flexShrink:0}}>✓</span>}
          </button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button>
          <button onClick={()=>q2&&onNext({q1,q2})} style={{flex:2,padding:"15px",background:q2?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2?"pointer":"default",fontFamily:"inherit"}}>길일 찾기 →</button>
        </div>
      </>}
    </div>
  </div>;
}

function ResultStep({answers}){
  const DATES=[{date:"4월 28일 (월)",score:94,tag:"대길일 ⭐",color:"#f59e0b"},{date:"5월 3일 (토)",score:88,tag:"길일",color:"#22c55e"},{date:"5월 7일 (수)",score:82,tag:"길일",color:"#22c55e"},{date:"5월 14일 (수)",score:79,tag:"준길일",color:"#6b7280"},{date:"5월 19일 (월)",score:75,tag:"준길일",color:"#6b7280"}];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}>
          <p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 좋은 날 찾기 리포트</p>
        </div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:20}}>📅</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>{answers.q1} · {answers.q2}</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>AI가 추천하는 길일 TOP 5</p>
        </div>
        <div style={{padding:"16px"}}>
          <p style={{fontSize:13,color:"#374151",lineHeight:1.8,margin:"0 0 14px"}}>
            {answers.q1}을(를) 위한 {answers.q2} 사주 길일을 분석했어요. 천기 AI가 오행과 간지를 분석해 도출한 최적 날짜예요.
          </p>
          {DATES.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:i===0?"linear-gradient(135deg,#fef9c3,#fef3c7)":"#f9fafb",border:`1px solid ${i===0?"#fde68a":"#f3f4f6"}`,borderRadius:12,marginBottom:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:i===0?"#f59e0b":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:700,color:i===0?"#fff":"#6b7280"}}>#{i+1}</span>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:700,color:"#111827",margin:"0 0 3px"}}>{d.date}</p>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:i===0?"rgba(245,158,11,0.15)":"rgba(107,114,128,0.1)",color:i===0?"#92400e":"#6b7280"}}>{d.tag}</span>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:18,fontWeight:700,color:d.color}}>{d.score}점</div>
                <div style={{height:4,width:56,background:"#e5e7eb",borderRadius:4,overflow:"hidden",marginTop:3}}>
                  <div style={{height:"100%",width:`${d.score}%`,background:d.color,borderRadius:4}}/>
                </div>
              </div>
            </div>
          ))}
          <div style={{background:"#f0f9ff",borderRadius:12,padding:"13px",border:"1px solid #bae6fd",marginTop:4}}>
            <p style={{fontSize:12,color:"#0369a1",lineHeight:1.7,margin:0}}>💡 <strong>4월 28일(월)</strong>이 가장 좋은 날이에요. 이 날은 사주 오행의 균형이 잘 맞고, 간지상 {answers.q1}에 최적의 기운이 흘러요.</p>
          </div>
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}>
          <p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #좋은날찾기 #길일 #{answers.q1.split("·")[0]}</p>
          <p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button>
        <button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button>
      </div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*이 날 괜찮을지 먼저 확인하고 싶다면? 좋은 날 확인하기 무료</p>
      <button style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>확인 완료</button>
    </div>
  </div>;
}

function IntroStep({onNext}){
  return(
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
            <div style={{fontSize:40,marginBottom:8}}>📅</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>좋은 날 찾기</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>내가 모르는 숨은 길일까지 AI가 찾아줘요</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📅</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>사주 기반 길일 TOP 5</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>오행과 간지 분석으로 최적 날짜 추출</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🌟</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>대길일 우선 추천</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>가장 강한 기운의 날을 1위로 정렬</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🔍</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>용도별 맞춤 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>결혼·이사·계약 등 용도에 맞는 날</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📊</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>날짜별 길흉 점수</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>각 날짜의 기운을 점수로 비교</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>길일 찾기 (980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function GoodDayFind(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet><QuestionStep onNext={a=>{setAns(a);setStep("pay");}}/></Sheet>;
  if(step==="pay") return <Sheet><PayStep onNext={()=>setStep("result")}/></Sheet>;
  return <ResultStep answers={ans}/>;
}
