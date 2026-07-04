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

const Q1O=[{e:"👦",l:"남자아이"},{e:"👧",l:"여자아이"},{e:"🌟",l:"아직 몰라요"},{e:"💭",l:"기타"}];
const Q2O=[{e:"🌿",l:"자연스럽고 부드럽게"},{e:"💪",l:"강하고 힘차게"},{e:"✨",l:"세련되고 현대적으로"},{e:"🏛️",l:"전통적이고 한자 의미 깊게"},{e:"🌍",l:"글로벌하게"},{e:"🌸",l:"귀엽고 사랑스럽게"},{e:"💭",l:"기타"}];
const Q3O=[{e:"✅",l:"한자 의미를 중시해요"},{e:"🔤",l:"순한글 이름을 원해요"},{e:"💭",l:"둘 다 보여주세요"}];
const Q4O=[{e:"🌿",l:"건강하고 튼튼하게"},{e:"💡",l:"지혜롭고 영리하게"},{e:"💰",l:"재물복 있게"},{e:"❤️",l:"사랑받는 사람이 되길"},{e:"📜",l:"공부 잘하고 성공하길"},{e:"🌟",l:"빛나는 존재가 되길"},{e:"💭",l:"기타"}];

function QStep({onNext}){
  const [qs,setQs]=useState(1),[q1,setQ1]=useState(null),[q2,setQ2]=useState(null),[q3,setQ3]=useState(null),[q4,setQ4]=useState([]);
  const tog=l=>setQ4(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
  const Opt=({o,sel,onClick,multi})=><button onClick={onClick} style={{padding:"12px 10px",background:sel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${sel?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}><span style={{fontSize:16,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:sel?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span>{!multi&&sel&&<span style={{marginLeft:"auto",color:G,fontSize:12,flexShrink:0}}>✓</span>}</button>;
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:24}}>🍼</span><div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>아기 이름 짓기</h3><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>사주·관상에 맞는 우리 아기 이름 · 1,980원</p></div></div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 10px"}}>{qs}/4</p>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*25}%`,background:G,borderRadius:2,transition:"0.3s"}}/></div>
      {qs===1&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 12px"}}>Q1. 성별은?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>{Q1O.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{padding:"16px 10px",background:q1===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><span style={{fontSize:28}}>{o.e}</span><span style={{fontSize:12,color:q1===o.l?G:"rgba(255,255,255,0.7)",fontWeight:q1===o.l?600:400}}>{o.l}</span></button>)}</div>
        <button onClick={()=>q1&&setQs(2)} style={{width:"100%",padding:"15px",background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></>}
      {qs===2&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 12px"}}>Q2. 원하는 이름의 느낌은?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>{Q2O.map(o=><Opt key={o.l} o={o} sel={q2===o.l} onClick={()=>setQ2(o.l)}/>)}</div>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button><button onClick={()=>q2&&setQs(3)} style={{flex:2,padding:"15px",background:q2?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></div></>}
      {qs===3&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 12px"}}>Q3. 한자 이름을 원하시나요?</p>
        {Q3O.map(o=><button key={o.l} onClick={()=>setQ3(o.l)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:q3===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q3===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,fontSize:13,color:q3===o.l?G:"rgba(255,255,255,0.7)"}}><span style={{fontSize:18}}>{o.e}</span>{o.l}{q3===o.l&&<span style={{marginLeft:"auto",color:G}}>✓</span>}</button>)}
        <div style={{display:"flex",gap:8,marginTop:4}}><button onClick={()=>setQs(2)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button><button onClick={()=>q3&&setQs(4)} style={{flex:2,padding:"15px",background:q3?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q3?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q3?"pointer":"default",fontFamily:"inherit"}}>다음 →</button></div></>}
      {qs===4&&<><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>Q4. 특별히 넣고 싶은 의미가 있나요?</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>선택사항 · 건너뛰기 가능</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>{Q4O.map(o=><Opt key={o.l} o={o} sel={q4.includes(o.l)} onClick={()=>tog(o.l)} multi/>)}</div>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setQs(3)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button><button onClick={()=>onNext({q1,q2,q3,q4})} style={{flex:2,padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>이름 추천받기 →</button></div>
        <button onClick={()=>onNext({q1,q2,q3,q4:[]})} style={{width:"100%",padding:"12px",marginTop:8,background:"rgba(255,255,255,0.05)",border:"none",borderRadius:14,fontSize:12,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>건너뛰기 → 전체 추천</button></>}
    </div>
  </div>;
}
function ResultStep({answers}){
  const NAMES=[
    {name:"이서준",hanja:"以序俊",score:95,ohaeng:"木火 조화",meaning:"차례대로 뛰어난 사람이 된다는 의미예요. 조화롭고 질서 있게 성장하며 많은 사람들에게 인정받을 이름이에요."},
    {name:"이온유",hanja:"以穩柔",score:91,ohaeng:"土水 안정",meaning:"온화하고 부드러운 기운으로 사람들을 품는 이름이에요. 타고난 포용력으로 어디서든 사랑받을 거예요."},
    {name:"이준서",hanja:"以俊序",score:88,ohaeng:"木金 균형",meaning:"뛰어난 질서와 체계를 갖춘 사람이 된다는 의미예요. 리더십과 신중함을 모두 갖춘 이름이에요."},
  ];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 아기 이름 짓기 리포트</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:18}}>🍼</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>사주 맞춤 아기 이름 TOP 3</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>{answers?.q1||"아기"} · {answers?.q2||"자연스러운"} 스타일 · {answers?.q3||"한자"} 이름</p>
        </div>
        <div style={{padding:"16px"}}>
          <p style={{fontSize:13,color:"#374151",lineHeight:1.8,margin:"0 0 14px"}}>아기의 사주 오행과 원하시는 느낌을 바탕으로 AI가 추천하는 이름이에요. 획수와 음령오행이 모두 균형 잡힌 이름들이에요.</p>
          {NAMES.map((n,i)=>(
            <div key={i} style={{background:i===0?"linear-gradient(135deg,#fef9c3,#fef3c7)":"#f9fafb",border:`1px solid ${i===0?"#fde68a":"#f3f4f6"}`,borderRadius:14,padding:"16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}><span style={{fontSize:20,fontWeight:700,color:"#111827"}}>이 {n.name.slice(1)}</span><span style={{fontSize:12,color:"#9ca3af"}}>{n.hanja}</span></div><span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(107,114,128,0.1)",color:"#6b7280"}}>{n.ohaeng}</span></div>
                <div style={{textAlign:"center",background:i===0?"rgba(245,158,11,0.15)":"rgba(34,197,94,0.1)",borderRadius:12,padding:"8px 12px"}}><div style={{fontSize:18,fontWeight:700,color:i===0?"#f59e0b":"#22c55e"}}>{n.score}</div><div style={{fontSize:9,color:"#9ca3af"}}>추천 점수</div></div>
              </div>
              <p style={{fontSize:12,color:"#6b7280",lineHeight:1.7,margin:0}}>{n.meaning}</p>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #아기이름 #작명 #사주이름</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
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
            <div style={{fontSize:40,marginBottom:8}}>🍼</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>아기 이름 짓기</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>사주·관상에 맞는 우리 아기 이름</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>1,980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🍼</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>사주 오행 맞춤 작명</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>아기 사주에 부족한 기운을 채우는 이름</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📊</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>이름 추천 점수</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>획수·음령오행 모두 분석한 추천 점수</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🏛️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>한자 의미 상세 설명</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름 한 글자씩 뜻과 기운 풀이</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🌟</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>TOP 3 이름 추천</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>조건에 맞는 최적 이름 3개 제안</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>아기 이름 추천받기 (1,980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function BabyName(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet c={<QStep onNext={a=>{setAns(a);setStep("pay");}}/>}/>;
  if(step==="pay") return <Sheet c={<PayStep price="1,980원" onNext={()=>setStep("result")}/>}/>;
  return <ResultStep answers={ans}/>;
}
