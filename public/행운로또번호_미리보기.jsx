import { useState, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

var LOTTO = {
  numbers:[3,17,24,33,41,45], bonus:7,
  basis:[
    {nums:[3,17],color:"#4ade80",reason:"목(木) 기운 — 규미님의 강한 본기(本氣)에서 나온 숫자예요. 목(木)은 3·8과 공명하고, 일주(己土)와 목극토(木剋土) 작용으로 에너지가 강해요."},
    {nums:[24,33],color:"#FF6B6B",reason:"화(火) 기운 — 사주에서 목생화(木生火) 작용으로 활성화되는 숫자예요. 이달 병오년(丙午) 기운과 맞물려 특히 강해요."},
    {nums:[41,45],color:"#FDCB6E",reason:"토(土) 기운 — 일주(己土)와 직접 공명하는 숫자예요. 재물선과 연결된 재백궁 기운이에요."},
  ],
  ohaeng:[
    {el:"목",score:4,c:"#4ade80",status:"강"},
    {el:"화",score:2,c:"#FF6B6B",status:"중"},
    {el:"토",score:1,c:"#FDCB6E",status:"약"},
    {el:"금",score:0,c:"#E0E0E0",status:"없음"},
    {el:"수",score:0,c:"#74B9FF",status:"없음"},
  ],
  updated:"2026년 4월 20일 (월) · 매주 월요일 갱신",
};

var BALL_COLORS=["#FF6B6B","#FDCB6E","#4CAF50","#74B9FF","#A29BFE","#FF6B6B"];

function GBtn({children,onClick,dim,color}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",background:dim?"rgba(255,255,255,0.08)":color||"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function Sec({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>;}

export default function LottoPage(){
  var [step,setStep]=useState("info");
  var [revealed,setRevealed]=useState(false);
  var [rolling,setRolling]=useState(false);
  var [rollNums,setRollNums]=useState([0,0,0,0,0,0]);
  var ivRef=useRef(null);
  var L=LOTTO;

  function startRoll(){
    setRolling(true);setRevealed(false);
    var tick=0;
    ivRef.current=setInterval(function(){
      tick++;
      setRollNums(Array.from({length:6}).map(function(){return Math.floor(Math.random()*45)+1;}));
      if(tick>=16){clearInterval(ivRef.current);setRolling(false);setRevealed(true);}
    },110);
  }

  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'Noto Serif KR',serif"}}>
      <div style={{width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{background:DG,borderRadius:"20px 20px 0 0",padding:"0 0 32px"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}><div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}><button style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer"}}>✕</button></div>
          <div style={{textAlign:"center",padding:"0 20px 16px"}}>
            <div style={{fontSize:40,marginBottom:8}}>🎰</div>
            <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>행운 로또번호</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 8px"}}>내 사주 오행에 딱 맞춘 로또 1등 번호</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:20,padding:"5px 14px"}}>
              <span style={{fontSize:15,fontWeight:900,color:"#4ade80"}}>무료</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>매주 월요일 갱신</span>
            </div>
          </div>
          {/* 오행 미리보기 */}
          <div style={{margin:"0 16px 14px",background:"rgba(255,255,255,0.03)",borderRadius:14,padding:"14px"}}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 10px",textAlign:"center"}}>☯️ 내 오행으로 번호를 뽑아요</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
              {L.ohaeng.map(function(oh,i){return(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{height:48,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",marginBottom:4}}>
                    <div style={{height:(oh.score/4*100)+"%",background:oh.score>0?oh.color:"rgba(255,255,255,0.08)",borderRadius:4,minHeight:oh.score>0?6:0}}/>
                  </div>
                  <p style={{fontSize:9,color:"rgba(255,255,255,0.5)",margin:"0 0 1px"}}>{oh.el}</p>
                  <p style={{fontSize:8,color:oh.score>0?oh.c:"rgba(255,255,255,0.3)",margin:0,fontWeight:700}}>{oh.status}</p>
                </div>
              );})}
            </div>
          </div>
          <div style={{margin:"0 16px 16px",background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 16px"}}>
            <p style={{fontSize:11,color:G,fontWeight:600,margin:"0 0 8px"}}>🎰 행운 로또번호에는 이런 게 들어있어요</p>
            {[["☯️","오행 기반 번호 추출","목·화·토·금·수 각 기운에서 번호 도출"],["🎰","번호 뽑기 애니메이션","버튼 한 번으로 화려하게 번호 공개"],["📖","번호 근거 설명","왜 이 번호인지 오행 원리로 설명"],["⚠️","재미로 즐기는 운세","로또는 오락이에요! 부담 없이 즐기세요"]].map(function([ic,tt,dd],i){return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:16,flexShrink:0,width:24}}>{ic}</span><div><p style={{fontSize:12,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{tt}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>{dd}</p></div></div>);})}</div>
          <div style={{padding:"0 16px"}}>
            <GBtn onClick={function(){setStep("main");}}>행운 번호 뽑기 (무료) →</GBtn>
            <div style={{marginTop:8}}><GBtn dim={true} onClick={function(){}}>닫기</GBtn></div>
          </div>
        </div>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 · 행운 로또번호</p>
        <h2 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 🎰 행운 로또번호</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>{L.updated}</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>
        {/* 오행 */}
        <div style={{background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:14}}>
          <p style={{fontSize:12,fontWeight:700,color:G,margin:"0 0 10px"}}>☯️ {DEMO_NAME}님의 오행 구성</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {L.ohaeng.map(function(oh,i){return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:oh.c}}/>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{oh.el}({oh.score})</span>
                <span style={{fontSize:9,color:oh.score>0?oh.c:"rgba(255,255,255,0.35)",fontWeight:700}}>{oh.status}</span>
              </div>
            );})}
          </div>
        </div>
        {/* 번호 뽑기 메인 */}
        <div style={{background:"#fff",borderRadius:16,padding:"24px 18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",textAlign:"center"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 16px"}}>🎰 이번 주 행운 번호</p>
          {!revealed&&!rolling&&(
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                {[1,2,3,4,5,6].map(function(_,i){return(
                  <div key={i} style={{width:48,height:48,borderRadius:"50%",background:"#F0EDE6",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:20,color:"rgba(0,0,0,0.2)"}}>?</span>
                  </div>
                );})}
              </div>
              <button onClick={startRoll} style={{padding:"16px 40px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:13,cursor:"pointer",fontSize:16,fontWeight:900,color:"#0D0D14",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(232,200,122,0.3)"}}>
                🎰 번호 뽑기!
              </button>
              <p style={{fontSize:11,color:"rgba(0,0,0,0.35)",margin:"10px 0 0"}}>탭하면 오행 기운으로 번호를 뽑아요</p>
            </div>
          )}
          {rolling&&(
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                {rollNums.map(function(n,i){return(
                  <div key={i} style={{width:48,height:48,borderRadius:"50%",background:BALL_COLORS[i],display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}}>
                    <span style={{fontSize:15,fontWeight:900,color:"#fff"}}>{n}</span>
                  </div>
                );})}
              </div>
              <p style={{fontSize:13,color:"#7A5C00",fontWeight:700,margin:0}}>오행 기운 계산 중... ☯️</p>
            </div>
          )}
          {revealed&&(
            <div>
              <p style={{fontSize:11,color:"rgba(0,0,0,0.4)",margin:"0 0 12px"}}>{L.updated}</p>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                {L.numbers.map(function(n,i){return(
                  <div key={i} style={{width:50,height:50,borderRadius:"50%",background:BALL_COLORS[i],display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(0,0,0,0.25)"}}>
                    <span style={{fontSize:17,fontWeight:900,color:"#fff"}}>{n}</span>
                  </div>
                );})}
              </div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{fontSize:12,color:"rgba(0,0,0,0.4)"}}>보너스</span>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#F0EDE6",border:"2px dashed rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:15,fontWeight:900,color:"#7A5C00"}}>{L.bonus}</span>
                </div>
              </div>
              <button onClick={function(){setRevealed(false);}} style={{padding:"8px 22px",background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.3)",borderRadius:10,cursor:"pointer",fontSize:12,color:"#7A5C00",fontFamily:"inherit"}}>
                🔄 다시 뽑기
              </button>
            </div>
          )}
        </div>
        {/* 번호 근거 */}
        {revealed&&(
          <Sec title="☯️ 오행 기반 번호 근거">
            {L.basis.map(function(b,i){return(
              <div key={i} style={{marginBottom:14,padding:"12px 14px",background:"#F9F7F2",borderRadius:12}}>
                <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
                  {b.nums.map(function(n,j){return(
                    <div key={j} style={{width:32,height:32,borderRadius:"50%",background:b.color,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
                      <span style={{fontSize:12,fontWeight:900,color:"#fff"}}>{n}</span>
                    </div>
                  );})}
                </div>
                <p style={{fontSize:11,color:"#555",lineHeight:1.65,margin:0}}>{b.reason}</p>
              </div>
            );})}
          </Sec>
        )}
        {/* 주의사항 */}
        <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:11,color:"#C62828",fontWeight:700,margin:"0 0 3px"}}>⚠️ 꼭 읽어주세요</p>
          <p style={{fontSize:11,color:"#555",lineHeight:1.65,margin:0}}>로또는 오락이에요. 이 번호는 사주 오행을 재미로 해석한 것이에요. 과도한 구매는 삼가해 주세요.</p>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기 #행운로또 #사주로또</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
