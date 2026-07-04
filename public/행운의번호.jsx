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

const Q1O=[{e:"📱",l:"핸드폰 비밀번호 (4~6자리)"},{e:"💳",l:"카드 PIN번호 (4자리)"},{e:"🔐",l:"각종 비밀번호 (4~8자리)"},{e:"🏠",l:"도어락 번호"},{e:"🌟",l:"나만의 행운 번호"},{e:"💭",l:"기타"}];
const Q2O=[{e:"❌",l:"4 (사망 사)"},{e:"❌",l:"9 (고통 구)"},{e:"❌",l:"13"},{e:"✅",l:"없어요, 다 괜찮아요"},{e:"💭",l:"기타"}];
function QStep({onNext}){
  const [q1,setQ1]=useState(null),[q2,setQ2]=useState(null);
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{fontSize:24}}>📱</span><div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>행운의 번호·비밀번호</h3><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>사주에 부족한 오행 채우는 숫자 조합 · 980원</p></div></div>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 10px"}}>Q1. 어떤 번호가 필요한가요?</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {Q1O.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{padding:"12px 10px",background:q1===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}><span style={{fontSize:18,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:q1===o.l?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span>{q1===o.l&&<span style={{marginLeft:"auto",color:G,fontSize:12,flexShrink:0}}>✓</span>}</button>)}
      </div>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q2. 특별히 피하고 싶은 숫자가 있나요?</p>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>선택사항 · 건너뛰기 가능</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {Q2O.map(o=><button key={o.l} onClick={()=>setQ2(o.l)} style={{padding:"11px 10px",background:q2===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q2===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:q2===o.l?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span></button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>q1&&onNext({q1,q2})} style={{flex:2,padding:"15px",background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>행운 번호 받기 (980원) →</button>
        <button onClick={()=>q1&&onNext({q1,q2:null})} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:12,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>건너뛰기</button>
      </div>
    </div>
  </div>;
}
function ResultStep({answers}){
  const NUMS=["7","3","8","1","5"];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 행운의 번호·비밀번호 리포트</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:18}}>📱</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>나만의 행운 번호 조합</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>{answers?.q1||"행운 번호"} · 사주 오행 기반</p>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:"linear-gradient(135deg,#0D2318,#1a3a28)",borderRadius:14,padding:"20px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 14px",letterSpacing:1}}>✦ 추천 행운 번호</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:12}}>
              {NUMS.map((n,i)=><div key={i} style={{width:52,height:52,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:20,fontWeight:700,color:"#0D0D14"}}>{n}</span></div>)}
            </div>
            <p style={{fontSize:14,fontWeight:700,color:G,margin:0,letterSpacing:4}}>{NUMS.join("  -  ")}</p>
          </div>
          {[
            {title:"왜 이 숫자들인가요?",body:"사주의 오행 분석 결과, 현재 金(금)과 水(수) 기운이 부족한 상태예요. 7과 8은 金 기운을, 3은 水 기운을 보강해주는 숫자예요. 이 숫자들이 자주 눈에 들어오는 환경을 만들면 기운이 보완돼요."},
            {title:"비밀번호로 사용할 때",body:"위 숫자들을 조합해서 사용하되, 앞뒤 순서는 자유롭게 바꿔도 돼요. 중요한 건 이 숫자들이 포함되는 것이에요. 핸드폰 비밀번호, 도어락, 카드 PIN 모두 활용 가능해요."},
            {title:"행운 번호 활용법",body:"로또나 복권에 직접 활용하기보다는 일상에서 이 숫자들을 자주 접하게 해보세요. 시계 알람을 7:38로 설정하거나, 목표 금액의 끝자리를 이 숫자로 맞추는 것도 좋아요."},
          ].map((s,i)=><div key={i} style={{background:"#f9fafb",borderRadius:12,padding:"13px",marginBottom:10,border:"1px solid #f3f4f6"}}><p style={{fontSize:12,fontWeight:700,color:"#374151",margin:"0 0 5px"}}>✦ {s.title}</p><p style={{fontSize:13,color:"#374151",lineHeight:1.8,margin:0}}>{s.body}</p></div>)}
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #행운번호 #비밀번호 #사주숫자</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}><button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button><button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button></div>
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
            <div style={{fontSize:40,marginBottom:8}}>📱</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>행운의 번호·비밀번호</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>사주에 부족한 오행 채우는 숫자 조합</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🔢</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>사주 오행 기반 숫자 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>부족한 기운을 채우는 숫자 조합</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📱</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>용도별 번호 추천</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>비밀번호·PIN·도어락 맞춤 조합</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💡</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>행운 숫자 활용법</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>일상에서 기운을 높이는 방법</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>피해야 할 숫자</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>내 기운을 소모하는 숫자</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>행운 번호 받기 (980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LuckyNumber(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet c={<QStep onNext={a=>{setAns(a);setStep("pay");}}/>}/>;
  if(step==="pay") return <Sheet c={<PayStep price="980원" onNext={()=>setStep("result")}/>}/>;
  return <ResultStep answers={ans}/>;
}
