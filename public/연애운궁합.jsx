import { useState } from "react";
const G="#E8C87A",DG="#0D2318",AC="#ec4899";
const Q1O=[{e:"🌱",l:"썸 타는 중"},{e:"💕",l:"연애 중 (1년 미만)"},{e:"💑",l:"연애 중 (1년 이상)"},{e:"💍",l:"결혼 고려 중"},{e:"💒",l:"결혼 중"},{e:"💔",l:"솔로"},{e:"😢",l:"이별 직후"},{e:"💭",l:"기타"}];
const Q2O=[{e:"❤️",l:"우리 잘 될까"},{e:"💘",l:"그 사람 내 마음 알까"},{e:"💍",l:"결혼 타이밍은 언제"},{e:"🆕",l:"새 인연이 언제 올까"},{e:"💔",l:"헤어질 위기인가"},{e:"🔮",l:"전생 인연인가"},{e:"🌟",l:"전체 다 궁금해요!"},{e:"💭",l:"기타"}];
const TABS=[{k:"total",l:"총운"},{k:"love",l:"연애운"},{k:"timing",l:"타이밍"},{k:"past",l:"전생인연"},{k:"advice",l:"조언"}];

function Sheet({children}){return <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}><div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{children}</div></div>;}
function Handle(){return <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;}
function PayStep({onNext}){
  const [m,setM]=useState("kakao");
  const MS=[{k:"kakao",l:"카카오페이",s:"원터치 간편결제"},{k:"toss",l:"토스페이",s:"간편결제"},{k:"naver",l:"네이버페이",s:"포인트 적립"},{k:"card",l:"카드결제",s:"신용/체크카드"},{k:"phone",l:"핸드폰 결제",s:"통신사 결제"}];
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"12px 16px 16px"}}><h3 style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:0}}>결제하기</h3></div>
    <div style={{padding:"0 16px"}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"8px 14px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:8,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
      {[{i:"🎫",l:"쿠폰 (0장)"},{i:"🎟️",l:"이용권 (0장)"}].map(it=><div key={it.l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>{it.i} {it.l}</p><p style={{fontSize:12,color:"rgba(255,255,255,0.3)",margin:0}}>눌러서 목록 보기</p></div><span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>›</span></div>)}
      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px 16px",marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>상품 가격</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>1,980원</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:14,fontWeight:700,color:G}}>1,980원</span></div></div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 10px",fontWeight:600}}>🔐 결제 수단</p>
      {MS.map(mm=><button key={mm.k} onClick={()=>setM(mm.k)} style={{width:"100%",padding:"14px 16px",marginBottom:8,background:m===mm.k?"rgba(236,72,153,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${m===mm.k?"rgba(236,72,153,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}><div style={{width:28,height:28,borderRadius:"50%",background:m===mm.k?"rgba(236,72,153,0.2)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}>{m===mm.k&&<div style={{width:10,height:10,borderRadius:"50%",background:AC}}/>}</div><div><p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",margin:"0 0 1px"}}>{mm.l}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{mm.s}</p></div></button>)}
      <button onClick={onNext} style={{width:"100%",padding:"16px",marginTop:8,background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.5}}>1,980원 결제하기 →</button>
    </div>
  </div>;
}
function QuestionStep({onNext}){
  const [qs,setQs]=useState(1),[q1,setQ1]=useState(null),[q2,setQ2]=useState([]);
  const tog=l=>setQ2(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <span style={{fontSize:24}}>💌</span>
        <div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>연애운·궁합</h3>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>둘이 봐도 1,980원! 쪽집게 궁합</p></div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:"0 0 10px"}}>{qs}/2</p>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,marginBottom:20}}><div style={{height:"100%",width:`${qs*50}%`,background:AC,borderRadius:2,transition:"0.3s"}}/></div>
      {qs===1&&<>
        <p style={{fontSize:13,fontWeight:600,color:"#f9a8d4",margin:"0 0 10px"}}>Q1. 현재 연애 상태는?</p>
        {Q1O.map(o=><button key={o.l} onClick={()=>setQ1(o.l)} style={{width:"100%",padding:"13px 16px",marginBottom:7,background:q1===o.l?"rgba(236,72,153,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q1===o.l?"rgba(236,72,153,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q1===o.l?"#fbcfe8":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span>{o.e}</span>{o.l}{q1===o.l&&<span style={{marginLeft:"auto",color:AC}}>✓</span>}
        </button>)}
        <button onClick={()=>q1&&setQs(2)} style={{width:"100%",padding:"15px",marginTop:8,background:q1?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q1?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q1?"pointer":"default",fontFamily:"inherit"}}>다음 →</button>
      </>}
      {qs===2&&<>
        <p style={{fontSize:13,fontWeight:600,color:"#f9a8d4",margin:"0 0 4px"}}>Q2. 지금 가장 궁금한 건?</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요</p>
        {Q2O.map(o=><button key={o.l} onClick={()=>tog(o.l)} style={{width:"100%",padding:"13px 16px",marginBottom:7,background:q2.includes(o.l)?"rgba(236,72,153,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${q2.includes(o.l)?"rgba(236,72,153,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:q2.includes(o.l)?"#fbcfe8":"rgba(255,255,255,0.7)",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span>{o.e}</span><span style={{flex:1}}>{o.l}</span>
          <div style={{width:18,height:18,borderRadius:4,flexShrink:0,background:q2.includes(o.l)?AC:"transparent",border:`2px solid ${q2.includes(o.l)?AC:"rgba(255,255,255,0.3)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{q2.includes(o.l)&&<span style={{fontSize:10,color:"#fff"}}>✓</span>}</div>
        </button>)}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={()=>setQs(1)} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>← 이전</button>
          <button onClick={()=>q2.length>0&&onNext({q1,q2})} style={{flex:2,padding:"15px",background:q2.length>0?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:q2.length>0?"#0D0D14":"rgba(255,255,255,0.3)",cursor:q2.length>0?"pointer":"default",fontFamily:"inherit"}}>분석 시작 →</button>
        </div>
      </>}
    </div>
  </div>;
}
function ResultStep({answers}){
  const [tab,setTab]=useState("total");
  const CONTENT={
    total:{title:"봄비처럼 조용히 스며드는 사랑의 기운",sub:"2026년 하반기, 연애운이 서서히 피어오르는 시기",body:"오래된 동백나무가 한겨울에 꽃을 피우듯, 연애운은 지금 이 순간에도 천천히 무르익고 있습니다. 서두르지 않아도 돼요.\n\n현재 사주를 보면 도화(桃花)의 기운이 2026년 하반기부터 본격적으로 활성화되기 시작해요. 지금은 씨앗을 심는 시간이에요. 조급하게 결과를 바라기보다는 자신을 가꾸고 기다리는 것이 더 현명한 전략이에요.\n\n솔로이신 분이라면 억지로 인연을 찾으러 다니기보다는 자신이 좋아하는 활동을 즐기다 보면 자연스럽게 마음이 맞는 인연이 나타날 거예요."},
    love:{title:"연애운 상세 분석",sub:"감정의 흐름과 인연의 패턴",body:"연애 패턴을 보면, 처음엔 크게 설레지 않았는데 알면 알수록 좋아지는 '후발형' 인연이 많아요.\n\n이런 분들은 소개팅이나 첫인상보다는 오랫동안 알고 지낸 인연에서 진짜 사랑을 찾는 경우가 많아요. 지금 주변에 소홀히 대했던 인연은 없나요?\n\n2026년 특히 5월과 8월에 새로운 인연의 기운이 강하게 들어와요. 이 시기에는 평소보다 조금 더 적극적으로 마음을 표현해보세요."},
    timing:{title:"결혼·연애 타이밍 분석",sub:"언제가 가장 좋은 시기일까요?",body:"사주를 보면 결혼운은 28~32세 사이에 가장 강하게 들어와요. 특히 2027년은 혼인과 관련된 기운이 매우 강한 해예요.\n\n다만 '타이밍'이라는 것은 준비된 사람에게 찾아오는 거예요. 지금부터 자신을 사랑하는 연습, 상대를 받아들이는 연습을 해두면 그 기운이 찾아왔을 때 놓치지 않을 수 있어요.\n\n현재 연애 중이라면 2026년 하반기가 관계를 한 단계 발전시키기 좋은 시기예요."},
    past:{title:"전생 인연 분석",sub:"지금 이 사람과의 전생 연결고리",body:"사주에서 읽히는 전생의 흔적은 — 인연을 만날 때 '처음인데 왜 이렇게 낯설지 않지?'라는 느낌을 자주 받는 이유와 연결돼요.\n\n이 감각은 단순한 착각이 아니에요. 전통 명리학에서는 이를 '숙연(宿緣)'이라 부르는데, 전생에서 이미 깊은 인연을 맺었던 사람이 이번 생에서 다시 만났을 때 느끼는 직감이에요.\n\n지금 마음이 이끌리는 사람이 있다면, 그 직감을 믿어보세요. 이유 없이 편안하고 오래된 친구 같은 느낌 — 그것이 진짜 인연의 신호예요."},
    advice:{title:"연애 맞춤 조언",sub:"지금 해야 할 것",body:`${answers?.q1==="솔로"?"지금 이 시간은 낭비가 아니에요. 혼자인 시간이 길수록, 나중에 만날 인연과 더 깊은 대화를 나눌 수 있는 사람이 돼요. 자신을 가장 아끼고 사랑하는 연습부터 시작해보세요.":"오늘 옆에 있는 사람에게 '고마워, 오늘도 네가 있어서 좋아'라고 한마디 건네보세요. 작은 표현이 관계를 오랫동안 따뜻하게 유지시켜줘요."}\n\n✨ 지금 당장 실천할 수 있는 것\n첫째, 외모보다 내면의 매력을 키우는 데 집중하세요.\n둘째, 연락을 기다리는 것보다 먼저 다가가는 용기를 내보세요.\n셋째, 완벽한 타이밍을 기다리기보다 지금 이 순간에 충실하세요.`},
  };
  const c=CONTENT[tab];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 연애운·궁합 리포트</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>💌</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>연애운·궁합 리포트</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:"0 0 2px"}}>연애운·궁합</p>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>{answers?.q1||"연애 상태"}</p></div>
          <div style={{background:"#fdf2f8",border:"2px solid #f9a8d4",borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:26,fontWeight:700,color:AC,lineHeight:1}}>78</div>
            <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>연애운 점수</div>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",overflowX:"auto",background:"#fafafa"}}>
          {TABS.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{flexShrink:0,padding:"12px 13px",border:"none",borderBottom:tab===t.k?`2px solid ${DG}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t.k?700:500,color:tab===t.k?DG:"#9ca3af",fontFamily:"inherit",transition:"0.15s"}}>{t.l}</button>)}
        </div>
        <div style={{padding:"18px 16px"}}>
          <h3 style={{fontSize:15,fontWeight:700,color:"#111827",margin:"0 0 4px"}}>{c.title}</h3>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 14px"}}>{c.sub}</p>
          {c.body.split("\n\n").map((p,i)=><p key={i} style={{fontSize:13,color:"#374151",lineHeight:1.95,margin:i<c.body.split("\n\n").length-1?"0 0 14px":0}}>{p}</p>)}
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #연애운 #궁합 #사주연애</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button>
        <button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button>
      </div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*공유하면 좋은 인연이 더 빨리 찾아와요 💕</p>
      <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 10px"}}>✦ 이것도 해볼래요?</p>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {[{e:"💑",l:"커플 관상 궁합",p:"1,980원"},{e:"💕",l:"궁합 연예인",p:"무료"},{e:"🔮",l:"사주풀이",p:"3,800원"},{e:"📅",l:"좋은 날 찾기",p:"980원"}].map(it=>(
          <div key={it.l} style={{minWidth:82,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 8px",textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:22,marginBottom:4}}>{it.e}</div>
            <div style={{fontSize:10,fontWeight:600,color:"#F0EAD6",marginBottom:2}}>{it.l}</div>
            <div style={{fontSize:10,color:it.p==="무료"?"#4ade80":G}}>{it.p}</div>
          </div>
        ))}
      </div>
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
            <div style={{fontSize:40,marginBottom:8}}>💌</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>연애운·궁합</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>둘이 봐도 1,980원! 커플·베프 쪽집게 궁합</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>1,980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>❤️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>연애운 상세 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>지금 내 연애운의 흐름과 방향</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💍</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>결혼·연애 타이밍</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>언제가 가장 좋은 시기인지</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🔮</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>전생 인연 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이 사람과의 전생 연결고리</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💌</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>맞춤 연애 조언</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>지금 해야 할 것들</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>연애운 분석 시작 (1,980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LoveFortune(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet><QuestionStep onNext={a=>{setAns(a);setStep("pay");}}/></Sheet>;
  if(step==="pay") return <Sheet><PayStep onNext={()=>setStep("result")}/></Sheet>;
  return <ResultStep answers={ans}/>;
}
