import { useState } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var TODAY = {
  date: "2026년 4월 20일 (월)",
  star: 4,
  headline: "작은 씨앗이 싹을 틔우는 날",
  summary: "오늘은 새로운 시도를 해보기 좋은 날이에요. 오전에 결정한 것이 오후에 빛을 발해요.",
  sections: [
    {icon:"❤️",title:"연애운",star:5,msg:"이성에게 먼저 연락해보세요. 오늘은 당신이 먼저 말을 거는 것이 유리한 날이에요."},
    {icon:"💰",title:"재물운",star:3,msg:"큰 지출은 피하고 작은 것에 감사하는 하루예요. 예상치 못한 작은 수입이 생길 수 있어요."},
    {icon:"💼",title:"직업운",star:4,msg:"오늘은 아이디어가 샘솟는 날이에요. 메모를 챙겨다니세요. 나중에 큰 자산이 될 거예요."},
    {icon:"🌿",title:"건강운",star:4,msg:"어깨와 목이 뻐근할 수 있어요. 스트레칭을 잊지 마세요."},
  ],
  lucky:{color:"초록색",direction:"동쪽",number:"7",food:"나물 반찬"},
  word:"오늘 하루, 내가 심은 것이 언젠가 꽃이 피어요. 지금의 노력은 절대 헛되지 않아요.",
};

function Stars({count,max=5,size=13}){
  return <span style={{fontSize:size}}>{Array.from({length:max}).map(function(_,i){return <span key={i} style={{color:i<count?"#FDCB6E":"rgba(0,0,0,0.15)"}}>★</span>;})}</span>;
}
function GBtn({children,onClick,dim,color}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",background:dim?"rgba(255,255,255,0.08)":color||"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function Sec({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>;}

export default function TodayFortune(){
  var [step,setStep]=useState("info"); // info | main | gift
  var [giftName,setGiftName]=useState("");
  var T=TODAY;

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}><button style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>✕</button></div>
          <div style={{textAlign:"center",padding:"0 20px 16px"}}>
            <div style={{fontSize:40,marginBottom:8}}>🔮</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>오늘의 운세</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>친구에게 오늘의 운세를 선물하세요!</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:"#4ade80"}}>무료</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>매일 2회 · 친구 선물 가능</span>
            </div>
          </div>
          <div style={{margin:"0 16px 16px",background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px"}}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 8px"}}>🔮 오늘의 운세에는 이런 게 들어있어요</p>
            {[["⭐","오늘 총운 별점","5점 만점 종합 기운"],["❤️💰💼🌿","분야별 운세","연애·재물·직업·건강 별점 + 풀이"],["🍀","행운 아이템","오늘의 색상·방향·숫자·음식"],["🎁","친구 선물","친구 이름 입력 → 카카오톡 공유"]].map(function([ic,tt,dd],i){return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:16,flexShrink:0,width:24}}>{ic}</span><div><p style={{fontSize:12,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{tt}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>{dd}</p></div></div>);})}</div>
          <div style={{padding:"0 16px"}}>
            <GBtn onClick={function(){setStep("main");}}>오늘의 운세 보기 (무료) →</GBtn>
            <div style={{marginTop:8}}><GBtn dim={true} onClick={function(){}}>닫기</GBtn></div>
          </div>
        </div>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  if(step==="gift") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("main");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>🎁 친구에게 운세 선물하기</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>친구 이름을 입력하면 맞춤 운세 카드가 생성돼요</p>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:700,color:"#f87171",margin:"0 0 6px"}}>🎁 선물하면 나도 +1회 이용권!</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.65,margin:0}}>친구에게 선물하면 오늘의 운세 추가 1회 이용권이 생겨요. 친구도 나도 무료!</p>
        </div>
        <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 8px"}}>친구 이름</p>
        <input value={giftName} onChange={function(e){setGiftName(e.target.value);}} placeholder="예: 이지수" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,fontSize:15,color:"#F0EAD6",fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:20}}/>
        {giftName&&(
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:16,textAlign:"center"}}>
            <p style={{fontSize:13,color:"#F0EAD6",margin:"0 0 4px"}}>{giftName}님의 오늘의 운세</p>
            <Stars count={4} size={18}/>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"6px 0 0"}}>{T.date}</p>
          </div>
        )}
        <GBtn onClick={function(){if(giftName)alert(giftName+"님께 오늘의 운세를 선물했어요! 🎁");}} color={giftName?"linear-gradient(135deg,#FF6B6B,#ee5a24)":undefined} dim={!giftName}>
          {giftName?"💬 "+giftName+"님께 카카오톡으로 선물하기":"이름을 입력해주세요"}
        </GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 오늘의 운세</p>
            <h2 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🔮 오늘의 운세</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>{T.date}</p>
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <Stars count={T.star} size={16}/>
            <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"4px 0 0"}}>{T.star}/5</p>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 14px 0"}}>
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.04))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:9,color:"rgba(232,200,122,0.6)",letterSpacing:3,margin:"0 0 8px"}}>✦ 오늘의 키워드</p>
          <h3 style={{fontSize:20,fontWeight:900,color:"#F0EAD6",margin:"0 0 10px"}}>{T.headline}</h3>
          <Stars count={T.star} size={20}/>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:"12px 0 0"}}>{T.summary}</p>
        </div>
        <Sec title="🔮 분야별 오늘의 운세">
          {T.sections.map(function(s,i){return(
            <div key={i} style={{marginBottom:12,padding:"13px 14px",background:"#F9F7F2",borderRadius:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <p style={{fontSize:13,fontWeight:700,color:"#333",margin:0}}>{s.icon} {s.title}</p>
                <Stars count={s.star} size={11}/>
              </div>
              <p style={{fontSize:12,color:"#555",lineHeight:1.8,margin:0}}>{s.msg}</p>
            </div>
          );})}
        </Sec>
        <Sec title="🍀 오늘의 행운 아이템">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["🎨","행운 색상",T.lucky.color],["🧭","행운 방향",T.lucky.direction],["7️⃣","행운 숫자",T.lucky.number],["🍚","행운 음식",T.lucky.food]].map(function([ic,tt,val],i){return(
              <div key={i} style={{background:"#F9F7F2",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                <p style={{fontSize:20,margin:"0 0 4px"}}>{ic}</p>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:"0 0 3px"}}>{tt}</p>
                <p style={{fontSize:13,fontWeight:700,color:"#7A5C00",margin:0}}>{val}</p>
              </div>
            );})}
          </div>
        </Sec>
        <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:16,padding:"18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:9,color:"rgba(232,200,122,0.6)",letterSpacing:3,margin:"0 0 8px"}}>✦ 오늘의 한마디</p>
          <p style={{fontSize:14,color:"#F0EAD6",fontWeight:600,lineHeight:1.85,margin:0,wordBreak:"keep-all"}}>"{T.word}"</p>
        </div>
        <div style={{background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>🎁 친구에게 선물하기</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>선물하면 나도 +1회 이용권 증정!</p></div>
            <button onClick={function(){setStep("gift");}} style={{padding:"8px 14px",background:"linear-gradient(135deg,#FF6B6B,#ee5a24)",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>선물하기 →</button>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #오늘의운세 #무료운세</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
