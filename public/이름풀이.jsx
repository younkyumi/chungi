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

const FOCUS_OPTS=[
  {e:"💰",l:"재물운에 미치는 영향"},{e:"❤️",l:"인연·결혼운에 미치는 영향"},
  {e:"💼",l:"직업·사업·출세운에 미치는 영향"},{e:"📜",l:"시험·관운·합격운에 미치는 영향"},
  {e:"🌿",l:"건강운에 미치는 영향"},{e:"🧠",l:"성격·기질·대인관계에 미치는 영향"},
  {e:"🌈",l:"전체 다 강조해서 봐줘!"},{e:"💭",l:"기타"},
];
function QStep({onNext}){
  const [name,setName]=useState("");
  const [focus,setFocus]=useState([]);
  const tog=l=>setFocus(p=>p.includes(l)?p.filter(v=>v!==l):[...p,l]);
  return <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}><Handle/>
    <div style={{padding:"14px 16px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{fontSize:24}}>📝</span><div><h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>이름 풀이</h3><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>한자 획수·뜻만으로 푸는 이름 운세 · 980원</p></div></div>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 8px"}}>이름을 입력해주세요</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="예: 윤규미" style={{width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,fontSize:16,color:"#F0EAD6",fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:20,textAlign:"center"}}/>
      <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>특별히 더 강조해서 봐드릴 부분이 있나요?</p>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 12px"}}>💡 건너뛰면 전체 균등 분석 · 선택하면 해당 항목을 더 깊이 풀어드려요</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {FOCUS_OPTS.map(o=><button key={o.l} onClick={()=>tog(o.l)} style={{padding:"11px 10px",background:focus.includes(o.l)?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${focus.includes(o.l)?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
          <span style={{fontSize:16,flexShrink:0}}>{o.e}</span><span style={{fontSize:11,color:focus.includes(o.l)?G:"rgba(255,255,255,0.65)",lineHeight:1.35}}>{o.l}</span>
        </button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>name&&onNext({name,focus})} style={{flex:2,padding:"15px",background:name?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:name?"#0D0D14":"rgba(255,255,255,0.3)",cursor:name?"pointer":"default",fontFamily:"inherit"}}>이름 풀이 보기 (980원) →</button>
        <button onClick={()=>name&&onNext({name,focus:[]})} style={{flex:1,padding:"15px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:12,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>건너뛰기</button>
      </div>
    </div>
  </div>;
}
function ResultStep({answers}){
  const nm=answers.name||"윤규미";
  const TABS=[{k:"total",l:"종합"},{k:"ohaeng",l:"음령오행"},{k:"suri",l:"수리풀이"},{k:"influence",l:"운명 영향"},{k:"advice",l:"조언"}];
  const [tab,setTab]=useState("total");
  const CONTENT={
    total:{title:`"${nm}" 이름 종합 분석`,sub:"음령오행·수리풀이·운명 영향 종합",body:`"${nm}"의 이름 에너지를 종합 분석한 결과, 전반적으로 균형 잡힌 좋은 기운을 가진 이름이에요.\n\n음령오행에서 木과 土 기운이 조화롭게 배합되어 있고, 수리 점수 역시 재물운과 직업운에 유리한 배합을 이루고 있어요.\n\n이 이름은 불려질수록 주변에 따뜻하고 신뢰할 수 있는 이미지를 자연스럽게 형성해요. 사람들이 "${nm}"이라는 이름을 들으면 무의식적으로 호감과 믿음이 연결되는 이름이에요.`},
    ohaeng:{title:"음령오행(音靈五行) 분석",sub:"이름 발음의 오행 에너지",body:`"${nm}"의 발음에서 나오는 오행 에너지를 분석하면 木(목)과 土(토) 기운이 조화롭게 배합되어 있어요.\n\n木 기운은 성장과 창의력을, 土 기운은 안정과 신뢰를 상징해요. 이 조합은 사람들에게 '믿음직하면서도 창의적인 사람'이라는 인상을 자연스럽게 줍니다.\n\n특히 이름의 초성에서 나오는 진동이 주변 사람들의 잠재의식에 긍정적인 파동을 전달해요. 직장이나 사회생활에서 이름 자체가 좋은 인상의 역할을 해줄 거예요.`},
    suri:{title:"수리 풀이 (획수 분석)",sub:"이름 획수의 수리 에너지",body:`"${nm}"의 획수 합이 재물운과 관련된 수리 배합을 이루고 있어요.\n\n특히 직업운에 미치는 영향이 큰 편으로, 전문직이나 자신의 이름을 걸고 하는 사업에서 빛을 발할 수 있는 이름이에요.\n\n대인관계에서도 호감을 주는 수리 배합이에요. 처음 만나는 사람에게 이름을 소개할 때 자연스럽게 좋은 첫인상을 만들어주는 효과가 있어요.`},
    influence:{title:"이름이 운명에 미치는 영향",sub:"하루에도 수십 번 불려지는 소리의 파동",body:`이름은 하루에도 수십 번 불려지는 소리의 파동이에요. "${nm}"이라는 이름은 불릴수록 주변에 따뜻하고 긍정적인 에너지를 방출해요.\n\n재물운: 土 기운의 안정적인 축적형 재물운이에요. 한 번에 큰돈을 버는 스타일보다는 꾸준히 쌓아가는 형이에요.\n\n인연운: 木 기운의 따뜻한 인연을 끌어당기는 이름이에요. 오래 알고 지낸 인연에서 진심 어린 관계가 많이 생겨요.\n\n직업운: 이름에서 풍기는 신뢰감이 직업적으로 큰 자산이 돼요. 사람을 상대하는 직업에서 특히 빛을 발할 수 있어요.`},
    advice:{title:"이름을 더 잘 활용하는 법",sub:"이 이름이 가진 기운을 극대화하는 방법",body:`"${nm}"이라는 이름의 기운을 최대한 활용하려면:\n\n첫째, 이름 전체를 부를 때 가장 기운이 강하게 나와요. 약칭이나 별명보다 풀네임으로 불릴 수 있는 환경을 만들어보세요.\n\n둘째, 명함이나 SNS에 이름을 예쁘게 표기하는 것도 중요해요. 이름이 잘 보이는 환경이 기운을 활성화시켜요.\n\n셋째, 이름을 직접 쓰는 연습을 꾸준히 해보세요. 서명이나 손글씨로 이름을 쓸 때 가장 강한 에너지 파동이 나와요.`},
  };
  const c=CONTENT[tab];
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 이름 풀이 리포트</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:18}}>📝</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>"{nm}" 이름 풀이</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>음령오행·수리풀이 종합 분석</p></div>
          <div style={{background:"#f0f9ff",border:"2px solid #bae6fd",borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:26,fontWeight:700,color:"#0ea5e9",lineHeight:1}}>82</div>
            <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>이름 에너지</div>
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
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #이름풀이 #성명학 #음령오행</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button><button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button></div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*이름이 마음에 안 든다면? 파동 성명학으로 개운하기 4,800원</p>
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
            <div style={{fontSize:40,marginBottom:8}}>📝</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>이름 풀이</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>한자 획수·뜻만으로 푸는 이름 운세</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:G}}>980원</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📝</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>음령오행(音靈五行) 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름 발음의 오행 에너지</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🔢</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>수리 풀이 (획수 분석)</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름 획수의 수리 에너지</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💰</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>재물·인연·직업운 영향</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이름이 운명에 미치는 영향</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>✨</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>이름 활용법</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>이 이름의 기운을 극대화하는 방법</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>이름 풀이 시작 (980원) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function NameReading(){
  const [step,setStep]=useState("intro");
  const [ans,setAns]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet c={<QStep onNext={a=>{setAns(a);setStep("pay");}}/>}/>;
  if(step==="pay") return <Sheet c={<PayStep price="980원" onNext={()=>setStep("result")}/>}/>;
  return <ResultStep answers={ans}/>;
}
