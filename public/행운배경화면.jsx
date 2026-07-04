import { useState } from "react";
const G="#E8C87A",DG="#0D2318";
function Sheet({c}){return <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}><div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{c}</div></div>;}
function Handle(){return <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;}
function PayStep({price,onNext}){
  const [m,setM]=useState("kakao");
  const MS=[{k:"kakao",l:"카카오페이",s:"원터치 간편결제"},{k:"toss",l:"토스페이",s:"간편결제"},{k:"naver",l:"네이버페이",s:"포인트 적립"},{k:"card",l:"카드결제",s:"신용/체크카드"},{k:"phone",l:"핸드폰 결제",s:"통신사 결제"}];
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"12px 16px 16px"}}><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
    <div style={{padding:"0 16px"}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"8px 14px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:8,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
      {[{i:"🎫",l:"쿠폰 (0장)"},{i:"🎟️",l:"이용권 (0장)"}].map(it=><div key={it.l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{it.i} {it.l}</p><p style={{fontSize:12,color:"rgba(255,255,255,0.3)",margin:0}}>눌러서 목록 보기</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>›</span></div>)}
      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px 16px",marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>상품 가격</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{price}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:14,fontWeight:700,color:G}}>{price}</span></div></div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>🔐 결제 수단</p>
      {MS.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:m===mm.k?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${m===mm.k?"rgba(232,200,122,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}><div style={{width:28,height:28,borderRadius:"50%",background:m===mm.k?"rgba(232,200,122,0.2)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>{m===mm.k&&<div style={{width:10,height:10,borderRadius:"50%",background:G}}/>}</div><div><p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"0 0 1px"}}>{mm.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{mm.s}</p></div></button>)}
      <button onClick={onNext} style={{width:"100%",padding:"16px",marginTop:8,background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>{price} 결제하기 →</button>
    </div>
  </div>;
}

const Q1O=[{e:"💰",l:"재물운·금전운"},{e:"❤️",l:"인연·사랑 기운"},{e:"💪",l:"건강·활력"},{e:"💼",l:"직장·사업·승진운"},{e:"📜",l:"시험·합격·관운"},{e:"🌟",l:"전반적인 행운"},{e:"🧘",l:"안정·평화"},{e:"🌈",l:"전체 다 넣어줘!"},{e:"💭",l:"기타"}];
const Q2O=[{e:"🏯",l:"동양적·전통적"},{e:"🌸",l:"자연·꽃·식물"},{e:"✨",l:"신비롭고 우주적인"},{e:"🎨",l:"현대적·세련된 추상화"},{e:"🔮",l:"타로·신비주의 느낌"},{e:"🌊",l:"물·달·밤하늘"},{e:"🌟",l:"전체 다 조합해줘!"},{e:"💭",l:"기타"}];
const Q3O=[{e:"🌙",l:"다크·딥 계열"},{e:"☀️",l:"밝고 화사한 계열"},{e:"🌿",l:"자연 그린 계열"},{e:"💙",l:"블루·퍼플 계열"},{e:"🌸",l:"핑크·로즈 계열"},{e:"🥇",l:"골드·럭셔리 계열"},{e:"🌟",l:"전체 다 조합해줘!"},{e:"💭",l:"기타"}];

function QStep({onNext}){
  const [qs,setQs]=useState(1),[q1,setQ1]=useState([]),[q2,setQ2]=useState([]),[q3,setQ3]=useState([]);
  const tog=(setter)=>(l)=>setter(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
  const Grid=({opts,sel,onTog})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
    {opts.map(o=><button key={o.l} onClick={()=>onTog(o.l)} style={{padding:"11px 10px",background:sel.includes(o.l)?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${sel.includes(o.l)?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}><span style={{fontSize:16,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:sel.includes(o.l)?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span></button>)}
  </div>;
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:24}}>🌌</span><div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>AI 행운 배경화면</h3><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>내 사주 맞춤 핸드폰 배경화면 · 1,980원</p></div></div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 10px"}}>{qs}/3</p>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*33.3}%`,background:G,borderRadius:2,transition:"0.3s"}}/></div>
      {qs===1&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q1. 지금 가장 필요한 기운은?</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요</p>
        <Grid opts={Q1O} sel={q1} onTog={tog(setQ1)}/>
        <button onClick={()=>q1.length>0&&setQs(2)} style={{width:"100%",padding:"15px",background:q1.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1.length>0?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1.length>0?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></>}
      {qs===2&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q2. 선호하는 스타일은?</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 복수 선택 가능</p>
        <Grid opts={Q2O} sel={q2} onTog={tog(setQ2)}/>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button><button onClick={()=>q2.length>0&&setQs(3)} style={{flex:2,padding:"15px",background:q2.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2.length>0?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2.length>0?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></div></>}
      {qs===3&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q3. 선호하는 색감은?</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 복수 선택 가능</p>
        <Grid opts={Q3O} sel={q3} onTog={tog(setQ3)}/>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setQs(2)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button><button onClick={()=>q3.length>0&&onNext({q1,q2,q3})} style={{flex:2,padding:"15px",background:q3.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q3.length>0?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q3.length>0?"pointer":"default",fontFamily:"inherit"}}>배경화면 생성하기 →</button></div></>}
    </div>
  </div>;
}
function ResultStep({answers}){
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | AI 행운 배경화면</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:18}}>🌌</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>나만의 행운 배경화면 완성!</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>{answers?.q1?.[0]||"행운"} · {answers?.q2?.[0]||"동양적"} · {answers?.q3?.[0]||"다크"} 스타일</p>
        </div>
        <div style={{padding:"16px"}}>
          {/* 배경화면 미리보기 */}
          <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,position:"relative",background:"linear-gradient(135deg,#0D2318,#1a0a2e,#0a1a2e)",aspectRatio:"9/19",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 30%,rgba(232,200,122,0.2) 0%,transparent 55%),radial-gradient(ellipse at 70% 70%,rgba(99,102,241,0.2) 0%,transparent 55%)"}}/>
            <div style={{textAlign:"center",zIndex:1,padding:"20px"}}>
              <div style={{fontSize:52,marginBottom:14}}>✦</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:4,margin:"0 0 8px"}}>CHUNGI · 천기</p>
              <p style={{fontSize:22,fontWeight:700,color:"#E8C87A",margin:"0 0 6px"}}>나만의 행운</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 16px"}}>사주 맞춤 배경화면</p>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                {(answers?.q1?.slice(0,3)||["💰","❤️","🌟"]).map((e,i)=><span key={i} style={{fontSize:24,opacity:0.85}}>{e}</span>)}
              </div>
            </div>
            <div style={{position:"absolute",bottom:16,textAlign:"center"}}>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:2,margin:0}}>AI GENERATED · 천기.kr</p>
            </div>
          </div>
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"13px",marginBottom:10}}>
            <p style={{fontSize:12,fontWeight:700,color:"#166534",margin:"0 0 5px"}}>✦ 이 배경화면에 담긴 기운</p>
            <p style={{fontSize:12,color:"#166534",lineHeight:1.75,margin:0}}>사주의 부족한 金(금) 기운을 보강하기 위해 황금빛 포인트를 배치했어요. 딥 그린과 인디고의 조화는 안정과 성장의 기운을 동시에 담고 있어요.</p>
          </div>
          <div style={{background:"#fafafa",borderRadius:12,padding:"13px",border:"1px solid #f3f4f6"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#374151",margin:"0 0 5px"}}>💡 효과를 높이는 방법</p>
            <p style={{fontSize:12,color:"#6b7280",lineHeight:1.75,margin:0}}>이 배경화면을 잠금화면으로 설정하면 하루에도 수십 번 이 기운과 접촉하게 돼요. 볼 때마다 가볍게 바라보는 습관이 기운을 활성화시켜요.</p>
          </div>
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #행운배경화면 #AI배경 #사주맞춤</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <button style={{padding:"13px",background:DG,border:`1px solid ${G}`,borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:G,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💾 저장하기</button>
        <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 공유하기</button>
      </div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*주 1회 갱신으로 기운을 새롭게 충전해요 🌟</p>
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
            <div style={{fontSize:40,marginBottom:8}}>🌌</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>AI 행운 배경화면</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>내 사주 맞춤 핸드폰 배경화면</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>1,980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🌌</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>사주 맞춤 AI 이미지 생성</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>부족한 오행 기운을 담은 배경화면</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🎨</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>스타일·색감 맞춤 제작</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>원하는 분위기로 커스터마이징</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💰</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>기운별 이미지 최적화</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>재물·인연·건강운 등 원하는 기운 집중</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💾</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>즉시 다운로드·저장</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>생성 즉시 핸드폰에 저장 가능</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>배경화면 생성하기 (1,980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LuckyWallpaper(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet c={<QStep onNext={a=>{setAns(a);setStep("pay");}}/>}/>;
  if(step==="pay") return <Sheet c={<PayStep price="1,980원" onNext={()=>setStep("result")}/>}/>;
  return <ResultStep answers={ans}/>;
}
