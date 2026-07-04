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

const STYLE_OPTS=[
  {e:"🌿",l:"부드럽고 포용력 있는"},{e:"💪",l:"강하고 추진력 있는"},
  {e:"🌟",l:"밝고 긍정적인 에너지"},{e:"🧘",l:"차분하고 안정적인"},
  {e:"💼",l:"사업·리더십에 어울리는"},{e:"❤️",l:"인연·사랑을 끌어당기는"},
  {e:"📜",l:"명예·공직에 어울리는"},{e:"💭",l:"상관없어요, 오행만 맞춰주세요"},
];
function QStep({onNext}){
  const [name,setName]=useState("");
  const [style,setStyle]=useState(null);
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{fontSize:24}}>🌊</span><div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>파동 성명학</h3><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>불려지는 이름대로 내 운명이 바뀐다 · 4,800원</p></div></div>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 8px"}}>분석할 이름을 입력해주세요</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="예: 윤규미" style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,fontSize:16,color:"#F0EAD6",fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:20,textAlign:"center"}}/>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>어떤 이미지의 이름을 원하나요?</p>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>선택사항 · 건너뛰기 가능</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {STYLE_OPTS.map(o=><button key={o.l} onClick={()=>setStyle(o.l)} style={{padding:"11px 10px",background:style===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${style===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}><span style={{fontSize:16,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:style===o.l?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span></button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>name&&onNext({name,style})} style={{flex:2,padding:"15px",background:name?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:name?"#0D0D14":"rgba(255,255,255,0.3)",cursor:name?"pointer":"default",fontFamily:"inherit"}}>파동 분석하기 (4,800원) →</button>
        <button onClick={()=>name&&onNext({name,style:null})} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:12,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>건너뛰기</button>
      </div>
    </div>
  </div>;
}
function ResultStep({answers}){
  const nm=answers.name||"윤규미";
  const TABS=[{k:"total",l:"종합"},{k:"money",l:"재물 파동"},{k:"love",l:"인연 파동"},{k:"work",l:"사업 파동"},{k:"change",l:"개명 제안"}];
  const [tab,setTab]=useState("total");
  const CONTENT={
    total:{title:`"${nm}" 파동 종합 분석`,body:`"${nm}"이라는 이름이 방출하는 에너지 파동을 종합 분석한 결과, 전반적으로 균형 잡힌 좋은 파동을 가진 이름이에요.\n\n음령오행에서 특히 土(토)와 木(목)의 조화가 인상적이에요. 이 두 오행의 상생 관계는 '나무가 흙에서 자라듯' 안정된 기반 위에서 성장하는 에너지를 상징해요.\n\n가장 강하게 활성화된 파동 영역은 대인관계와 인연 파동이에요. 이 이름을 가진 사람은 자연스럽게 좋은 사람들을 끌어당기는 기운이 있어요.`,score:82},
    money:{title:"재물 파동 분석",body:`"${nm}"의 재물 파동은 안정적인 축적형 에너지를 가지고 있어요.\n\nEarth(土) 기운이 강한 이름은 일확천금보다는 꾸준히 쌓아가는 재물운을 의미해요. 급하게 큰돈을 노리기보다 안정적으로 자산을 늘려가는 방식이 이 이름의 에너지에 더 잘 맞아요.\n\n재물 파동을 높이려면 — 지갑은 황금색이나 베이지 계열로, 통장 비밀번호에는 3, 8, 9 같은 土와 金 오행 숫자를 활용해보세요.`,score:78},
    love:{title:"인연 파동 분석",body:`인연 파동이 이 이름의 가장 강한 영역이에요.\n\n"${nm}"이라는 이름은 불릴수록 주변에 따뜻하고 신뢰할 수 있는 이미지를 형성해요. 처음 만나는 사람에게도 '왠지 이 사람 믿을 수 있겠다'라는 느낌을 자연스럽게 주는 이름이에요.\n\n이 인연 파동 덕분에 생의 중요한 순간마다 귀인이 나타날 가능성이 높아요. 인연복이 좋은 이름이에요.`,score:88},
    work:{title:"사업·직업 파동 분석",body:`직업 파동에서는 '혼자보다는 함께'의 에너지가 두드러져요.\n\n이 이름은 독자적으로 밀어붙이는 스타일보다, 사람들의 신뢰를 얻어 함께 성장하는 방식에서 더 강한 기운이 나와요. 팀장이나 협력 구조에서 특히 빛을 발할 수 있는 이름이에요.\n\n사업을 한다면 — 파트너십이나 네트워크를 활용하는 업종이 이 이름의 파동과 잘 맞아요.`,score:74},
    change:{title:"개명 제안",body:`현재 이름의 파동이 82점으로 전반적으로 좋은 편이에요. 무리하게 개명할 필요는 없어요.\n\n다만 재물운 파동을 보강하고 싶다면, 이름의 마지막 글자를 金(금) 기운이 강한 글자로 변경하는 것을 검토해볼 수 있어요.\n\n제안 이름: "${nm.slice(0,-1)}진" (金 기운 강화)\n제안 이름: "${nm.slice(0,-1)}연" (水 기운 보완)\n\n⚠️ 개명 전 반드시 전문 명리학자와 상담을 권해드려요.`,score:null},
  };
  const c=CONTENT[tab];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 파동 성명학 리포트</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>🌊</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>"{nm}" 파동 분석</h2></div><p style={{fontSize:11,color:"#6b7280",margin:0}}>이름이 방출하는 에너지 파동 종합 분석</p></div>
          <div style={{background:"#eff6ff",border:"2px solid #bfdbfe",borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}><div style={{fontSize:26,fontWeight:700,color:"#3b82f6",lineHeight:1}}>82</div><div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>파동 점수</div></div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",overflowX:"auto",background:"#fafafa"}}>
          {TABS.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{flexShrink:0,padding:"12px 13px",border:"none",borderBottom:tab===t.k?`2px solid ${DG}`:"2px solid transparent",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t.k?700:500,color:tab===t.k?DG:"#9ca3af",fontFamily:"inherit",transition:"0.15s"}}>{t.l}</button>)}
        </div>
        <div style={{padding:"18px 16px"}}>
          {c.score&&<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#374151"}}>파동 점수</span><span style={{fontSize:13,fontWeight:700,color:"#3b82f6"}}>{c.score}점</span></div><div style={{height:8,background:"#f3f4f6",borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:`${c.score}%`,background:"#3b82f6",borderRadius:10}}/></div></div>}
          <h3 style={{fontSize:15,fontWeight:700,color:"#111827",margin:"0 0 14px"}}>{c.title}</h3>
          {c.body.split("\n\n").map((p,i)=><p key={i} style={{fontSize:13,color:"#374151",lineHeight:1.95,margin:i<c.body.split("\n\n").length-1?"0 0 14px":0}}>{p}</p>)}
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #파동성명학 #이름파동 #성명학</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
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
            <div style={{fontSize:40,marginBottom:8}}>🌊</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>파동 성명학</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>불려지는 이름대로 내 운명이 바뀐다?</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>4,800원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🌊</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>이름 파동 종합 점수</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>재물·인연·사업 파동 수치 분석</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💰</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>재물 파동 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름이 재물운에 미치는 에너지</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>❤️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>인연 파동 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름이 인연운에 방출하는 파동</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📝</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>개명 제안</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>파동을 높이는 이름 변경 제안</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>파동 분석 시작 (4,800원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function WaveName(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet c={<QStep onNext={a=>{setAns(a);setStep("pay");}}/>}/>;
  if(step==="pay") return <Sheet c={<PayStep price="4,800원" onNext={()=>setStep("result")}/>}/>;
  return <ResultStep answers={ans}/>;
}
