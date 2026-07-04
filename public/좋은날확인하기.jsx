import { useState } from "react";
const G="#E8C87A", DG="#0D2318";

const PURPOSES=[
  {e:"💍",l:"결혼식·약혼·프로포즈"},{e:"🏠",l:"이사·입주·집들이"},
  {e:"💼",l:"계약·창업·개업"},{e:"🌱",l:"새로운 시작·도전"},
  {e:"✈️",l:"여행·출장 출발"},{e:"🏥",l:"수술·시술·검사"},
  {e:"🎓",l:"시험·면접·발표"},{e:"💰",l:"투자·큰 지출 결정"},
  {e:"💭",l:"기타"},
];

function Sheet({children}){
  return(
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>{children}</div>
    </div>
  );
}
function Handle(){return <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>;}

/* ─── Step 1. 사전질문 ─── */
function QuestionStep({onNext}){
  const [date,setDate]=useState("");
  const [purpose,setPurpose]=useState(null);
  const ok=date&&purpose;

  return(
    <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
      <Handle/>
      <div style={{padding:"14px 16px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
          <span style={{fontSize:24}}>📋</span>
          <div>
            <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0}}>좋은 날 확인하기</h3>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>이 날 괜찮을까? · 무료</p>
          </div>
        </div>

        {/* Q1 날짜 */}
        <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 8px"}}>Q1. 확인하고 싶은 날짜</p>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{width:"100%",padding:"13px 14px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,fontSize:14,color:"#F0EAD6",fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:22,colorScheme:"dark"}}/>

        {/* Q2 용도 */}
        <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 10px"}}>Q2. 어떤 용도로 쓸 날인가요?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {PURPOSES.map(o=>(
            <button key={o.l} onClick={()=>setPurpose(o.l)} style={{padding:"12px 10px",background:purpose===o.l?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${purpose===o.l?"rgba(232,200,122,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,textAlign:"left",transition:"0.15s"}}>
              <span style={{fontSize:18,flexShrink:0}}>{o.e}</span>
              <span style={{fontSize:11,color:purpose===o.l?G:"rgba(255,255,255,0.65)",fontWeight:purpose===o.l?600:400,lineHeight:1.4}}>{o.l}</span>
              {purpose===o.l&&<span style={{marginLeft:"auto",color:G,fontSize:12,flexShrink:0}}>✓</span>}
            </button>
          ))}
        </div>

        <button onClick={()=>ok&&onNext({date,purpose})} style={{width:"100%",padding:"16px",background:ok?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:ok?"#0D0D14":"rgba(255,255,255,0.3)",cursor:ok?"pointer":"default",fontFamily:"inherit",letterSpacing:0.3}}>
          길흉 확인하기 (무료) →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2. 결과 카드 ─── */
function ResultStep({answers}){
  const d=new Date(answers.date);
  const days=["일","월","화","수","목","금","토"];
  const score=78;
  const scoreColor=s=>s>=80?"#22c55e":s>=65?"#f59e0b":"#ef4444";

  return(
    <div style={{minHeight:"100vh",background:DG,padding:"20px 12px 40px",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{maxWidth:430,margin:"0 auto"}}>

        {/* 결과 카드 */}
        <div style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",marginBottom:12}}>
          <div style={{padding:"12px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}>
            <p style={{fontSize:9,color:"#9ca3af",letterSpacing:1,margin:0}}>🔮 천기(天機) 오리지널 | 길일 확인 리포트 · 무료</p>
          </div>

          {/* 날짜 + 점수 */}
          <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:20}}>📋</span>
                <h2 style={{fontSize:15,fontWeight:700,color:"#111827",margin:0}}>{answers.date} ({days[d.getDay()]})</h2>
              </div>
              <p style={{fontSize:11,color:"#6b7280",margin:0}}>{answers.purpose}</p>
            </div>
            <div style={{background:score>=70?"#f0fdf4":"#fef2f2",border:`2px solid ${score>=70?"#bbf7d0":"#fecaca"}`,borderRadius:14,padding:"10px 14px",textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:26,fontWeight:700,color:scoreColor(score),lineHeight:1}}>{score}</div>
              <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>길흉 점수</div>
            </div>
          </div>

          <div style={{padding:"16px"}}>
            {/* 종합 판정 뱃지 */}
            <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #bbf7d0",borderRadius:14,padding:"14px",marginBottom:16,textAlign:"center"}}>
              <p style={{fontSize:10,color:"#166534",margin:"0 0 4px",fontWeight:600,letterSpacing:1}}>✦ 종합 판정</p>
              <p style={{fontSize:20,fontWeight:700,color:"#14532d",margin:"0 0 6px"}}>비교적 좋은 날 🌿</p>
              <p style={{fontSize:12,color:"#166534",lineHeight:1.75,margin:0}}>
                {answers.purpose}을(를) 진행하기에 무난한 날입니다.<br/>특히 오전 시간대의 기운이 좋아요.
              </p>
            </div>

            {/* 점수 바 */}
            {[{label:"길일 지수",score:82,color:"#22c55e"},{label:"주의 지수",score:35,color:"#ef4444"}].map((s,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:"#374151"}}>{s.label}</span>
                  <span style={{fontSize:13,fontWeight:700,color:s.color}}>{s.score}점</span>
                </div>
                <div style={{height:8,background:"#f3f4f6",borderRadius:10,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${s.score}%`,background:s.color,borderRadius:10,transition:"0.8s"}}/>
                </div>
              </div>
            ))}

            {/* 상세 */}
            {[
              {title:"✅ 이 날이 좋은 이유",body:"천간과 지지의 흐름이 안정적이에요. 음양의 균형이 잘 잡혀 있어 새로운 일을 시작하거나 중요한 결정을 내리기에 무리가 없는 날이에요. 특히 오전 9시~11시 사이에 시작하면 더욱 좋은 기운을 받을 수 있어요.",bg:"#f0fdf4",border:"#bbf7d0",tc:"#166534"},
              {title:"⚠️ 주의할 점",body:"오후 3시 이후에는 기운이 다소 흩어지는 경향이 있어요. 큰 결정은 오전 중에 마무리하는 것이 좋고, 서두르기보다는 차분하게 진행하는 것을 권해드려요.",bg:"#fef9c3",border:"#fde68a",tc:"#92400e"},
            ].map((s,i)=>(
              <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,padding:"13px",marginBottom:10}}>
                <p style={{fontSize:12,fontWeight:700,color:s.tc,margin:"0 0 5px"}}>{s.title}</p>
                <p style={{fontSize:12,color:s.tc,lineHeight:1.75,margin:0}}>{s.body}</p>
              </div>
            ))}

            {/* 추천 시간대 */}
            <div style={{background:"#fafafa",borderRadius:12,padding:"13px",border:"1px solid #f3f4f6"}}>
              <p style={{fontSize:12,fontWeight:700,color:"#374151",margin:"0 0 8px"}}>⏰ 추천 시간대</p>
              <div style={{display:"flex",gap:8}}>
                {["오전 9~11시","오전 11~오후 1시"].map((t,i)=>(
                  <div key={i} style={{flex:1,background:DG,borderRadius:10,padding:"10px",textAlign:"center"}}>
                    <p style={{fontSize:11,fontWeight:600,color:G,margin:0}}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{padding:"10px 16px 14px",borderTop:"1px solid #f3f4f6",textAlign:"center"}}>
            <p style={{fontSize:10,color:"#9ca3af",margin:"0 0 3px"}}>#천기 #길일확인 #{answers.purpose.split("·")[0]}</p>
            <p style={{fontSize:10,color:"#374151",margin:0,fontWeight:600}}>🌐 천기.kr</p>
          </div>
        </div>

        {/* 퍼널 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:700,color:"#3c1e1e",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>💬 카카오 공유</button>
          <button style={{padding:"13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>🔗 링크 복사</button>
        </div>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 20px"}}>*숨은 길일까지 찾고 싶다면? 좋은 날 찾기 980원 →</p>
        <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 10px"}}>✦ 이것도 해볼래요?</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
          {[{e:"📅",l:"좋은 날 찾기",p:"980원"},{e:"🔮",l:"사주풀이",p:"3,800원"},{e:"💑",l:"커플 궁합",p:"1,980원"},{e:"🪞",l:"내 관상보기",p:"980원"}].map(it=>(
            <div key={it.l} style={{minWidth:80,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 8px",textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:22,marginBottom:4}}>{it.e}</div>
              <div style={{fontSize:10,fontWeight:600,color:"#F0EAD6",marginBottom:2}}>{it.l}</div>
              <div style={{fontSize:10,color:it.p==="무료"?"#4ade80":G}}>{it.p}</div>
            </div>
          ))}
        </div>
        <button style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>확인 완료</button>
      </div>
    </div>
  );
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
            <div style={{fontSize:40,marginBottom:8}}>📋</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>좋은 날 확인하기</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>이 날 괜찮을까? 후보 날짜 길흉 점수</p>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:"#4ade80"}}>무료</span>
            </div>
          </div>
          <div style={{padding:"0 16px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>📋</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>날짜 길흉 점수 분석</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>사주 기반 해당 날의 기운 분석</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>✅</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>종합 판정</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>비교적 좋은 날 / 주의 필요 판별</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>⏰</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>추천 시간대</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>기운이 가장 좋은 시간 알려드려요</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:6,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10}}>
                <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 1px"}}>주의 포인트</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>피해야 할 시간대와 이유</p>
                </div>
                <span style={{fontSize:9,color:G,padding:"2px 8px",borderRadius:10,border:"1px solid rgba(232,200,122,0.3)",background:"rgba(232,200,122,0.1)",flexShrink:0}}>분석</span>
              </div>
          </div>
          <div style={{padding:"0 16px"}}>
            <button onClick={onNext} style={{width:"100%",padding:"16px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>길흉 확인하기 (무료) →</button>
            <button style={{width:"100%",padding:"14px",marginTop:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function GoodDayCheck(){
  const [step,setStep]=useState("intro");
  const [answers,setAnswers]=useState(null);
  if(step==="intro") return <IntroStep onNext={()=>setStep("q")}/>;  if(step==="q") return <Sheet><QuestionStep onNext={a=>{setAnswers(a);setStep("result");}}/></Sheet>;
  return <ResultStep answers={answers}/>;
}
