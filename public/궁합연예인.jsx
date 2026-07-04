import { useState } from "react";
const G="#E8C87A",DG="#0D2318";
const CELEBS=[
  {name:"아이유",match:94,job:"가수·배우",emoji:"🎤",ohaeng:"木",reason:"木 기운이 강해 창의적이고 감성적이에요. 서로의 에너지가 공명해 말 없이도 통하는 사이가 될 수 있어요.",tag:"#천생연분형"},
  {name:"박보검",match:88,job:"배우",emoji:"🎬",ohaeng:"土",reason:"土 기운이 안정적이에요. 든든하고 편안한 동반자 타입으로, 함께 있으면 마음이 차분해지는 사람이에요.",tag:"#안정형"},
  {name:"손흥민",match:82,job:"축구선수",emoji:"⚽",ohaeng:"金",reason:"金 기운의 강한 추진력. 서로 자극이 되어 함께 더 높이 성장할 수 있는 시너지형 관계예요.",tag:"#시너지형"},
  {name:"임영웅",match:79,job:"가수",emoji:"🎵",ohaeng:"土",reason:"土와 木의 조화로 묵묵히 서로를 지지해주는 따뜻한 관계가 될 수 있어요.",tag:"#동반성장형"},
  {name:"김연아",match:76,job:"전 피겨선수",emoji:"⛸️",ohaeng:"水",reason:"水 기운의 유연함과 강인함. 서로의 정반대 기운이 끌어당기는 음양 조화형 관계예요.",tag:"#음양조화형"},
];
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
            <div style={{fontSize:40,marginBottom:8}}>💕</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>궁합 연예인</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>내 사주랑 찰떡인 연예인은?</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:"#4ade80"}}>무료</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💕</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>사주 오행 기반 궁합 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>내 기운과 공명하는 연예인 TOP 5</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🌟</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>궁합 퍼센트 계산</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>에너지 매칭 점수를 수치로 확인</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>🔮</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>관계 유형 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>천생연분형·안정형·시너지형 등</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>💡</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>궁합이 좋은 이유</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>오행으로 보는 끌림의 이유</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>궁합 연예인 확인 (무료) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function CelebMatch(){
  const [step,setStep]=useState("intro");
  if(step==="intro") return <IntroStep onNext={()=>setStep("result")}/>;
  return <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
    <div style={{maxWidth:430,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
        <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 궁합 연예인 리포트 · 무료</p></div>
        <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:20}}>💕</span><h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>나의 찰떡 궁합 연예인 TOP 5</h2></div>
          <p style={{fontSize:11,color:"#6b7280",margin:0}}>사주 오행으로 분석한 연예인 궁합 · 무료</p>
        </div>
        <div style={{padding:"16px"}}>
          <p style={{fontSize:13,color:"#374151",lineHeight:1.8,margin:"0 0 16px"}}>사주의 오행을 분석한 결과, 아래 연예인들과 에너지가 가장 잘 맞아요. 만약 실제로 만난다면 자연스럽게 통하는 부분이 많을 거예요!</p>
          {CELEBS.map((c,i)=>(
            <div key={i} style={{background:i===0?"linear-gradient(135deg,#fef9c3,#fef3c7)":"#f9fafb",border:`1px solid ${i===0?"#fde68a":"#f3f4f6"}`,borderRadius:14,padding:"14px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{width:42,height:42,borderRadius:"50%",background:i===0?"#f59e0b":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#111827"}}>{c.name}</span>
                    <span style={{fontSize:10,color:"#9ca3af"}}>{c.job}</span>
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:10,background:i===0?"rgba(245,158,11,0.15)":"rgba(107,114,128,0.1)",color:i===0?"#92400e":"#6b7280"}}>{c.tag}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{height:4,flex:1,background:"#e5e7eb",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${c.match}%`,background:i===0?"#f59e0b":"#22c55e",borderRadius:4}}/></div>
                    <span style={{fontSize:12,fontWeight:700,color:i===0?"#f59e0b":"#374151",flexShrink:0}}>{c.match}%</span>
                  </div>
                </div>
              </div>
              <p style={{fontSize:12,color:"#6b7280",lineHeight:1.7,margin:0}}>{c.reason}</p>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}><p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #궁합연예인 #사주궁합 #무료</p><p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}><button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button><button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button></div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*공유하면 내 궁합 연예인이 나를 볼 수도 있어요 👀</p>
      <button style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>확인 완료</button>
    </div>
  </div>;
}
