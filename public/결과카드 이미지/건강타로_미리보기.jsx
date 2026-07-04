import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
const CFG = {
  emoji:"🌿", name:"건강 타로", badge:null,
  badgeColor:"#E8C87A", badgeBg:"transparent",
  cardCount:3, price:980,
  desc:"3장 — 타로가 경고하는 건강운",
  subtitle:"✦ 천기 오리지널 · 몸이 보내는 신호를 읽다",
  hashtags:"#천기타로 #건강타로 #몸의신호 #건강운",
  intro:"3장의 카드로 몸의 현재 상태, 주의해야 할 부분, 건강을 지키는 맞춤 조언을 드려요.",
  features:["🏥 현재 몸 상태 진단","⚠️ 주의해야 할 건강 신호","💪 건강 회복·유지 조언"],
  positions:["현재 몸의 상태","주의해야 할 부분","건강을 위한 조언"],
  loading:["몸의 기운 스캔 중... 🌿","오장육부 에너지 측정 중... 🔍","건강 경고 신호 분석 중... ⚠️","회복 에너지 계산 중... 💪"],
  questions:[
    {title:"건강에서 가장 신경 쓰이는 건?", icon:"🏥", opts:["😴 피로·수면 문제","💪 운동·다이어트","🧠 스트레스·멘탈","🏥 특정 부위 건강 고민"], freeInput:false, skippable:false, placeholder:""},
    {title:"요즘 몸 컨디션은?", icon:"💊", opts:["😊 좋아, 에너지 넘쳐","😐 보통, 그냥 저냥","😰 피곤해, 자도 피곤해","😷 아픈 곳이 있어"], freeInput:false, skippable:false, placeholder:""},
    {title:"구체적인 건강 고민이 있다면?", icon:"✏️", opts:[], freeInput:true, skippable:true, placeholder:"예: 허리가 자주 아파요, 잠을 잘 못 자요"},
  ],
  cardGood:[
    "현재 당신의 몸 상태는 전반적으로 안정적이에요. 카드가 보여주는 것은 내면의 생명 에너지가 활발하게 흐르고 있다는 신호예요. 지금 느끼는 작은 피로나 불편함은 몸이 더 강해지기 위해 스스로 조율하는 과정일 수 있어요. 현재의 건강한 습관들을 꾸준히 유지하는 것이 가장 중요해요.",
    "주의해야 할 부분에서 카드가 좋은 기운을 보내고 있어요. 걱정하고 있는 건강 문제가 있다면, 지금 당장 심각한 상황은 아니에요. 하지만 방심은 금물이에요. 지금 이 기회에 예방적 관리를 시작하면 훨씬 좋은 결과를 얻을 수 있어요. 정기 검진을 미루고 있었다면 이번 달 안에 받아보세요.",
    "카드가 전하는 건강 조언은 지금이 새로운 건강 습관을 시작하기에 완벽한 타이밍이라는 거예요. 운동이든, 식단이든, 수면 패턴이든 한 가지만 바꿔도 몸 전체에 긍정적인 변화가 일어날 거예요. 작은 것부터, 오늘부터 시작하세요.",
  ],
  cardBad:[
    "몸이 지금 과부하 상태일 수 있어요. 카드는 당신의 몸이 쉬고 싶다는 신호를 보내고 있다고 말해요. 최근에 잠을 제대로 못 자거나, 식사를 건너뛰거나, 스트레스를 많이 받고 있지 않나요? 지금 당장 하루 이틀이라도 완전히 쉬는 것이 가장 좋은 처방이에요. 몸의 소리에 귀를 기울이세요.",
    "주의해야 할 건강 신호가 있어요. 이 카드는 오랫동안 무시해온 작은 증상이나 불편함이 있다면 지금 확인하라고 경고하고 있어요. 귀찮거나 바빠서 미뤄온 검진이나 치료가 있다면 더 이상 미루지 마세요. 초기에 발견하면 해결하기 훨씬 쉬워요.",
    "카드가 전하는 건강 조언은 근본적인 생활 습관의 변화가 필요하다는 거예요. 임시방편으로 대처하는 것으로는 부족해요. 수면, 식사, 운동, 스트레스 관리 중에서 가장 취약한 부분을 찾아 집중적으로 개선해보세요. 전문가의 도움을 받는 것도 좋은 방법이에요.",
  ],
  synGood:"3장의 카드가 전반적으로 안정적인 건강 기운을 보여줘요. 규칙적인 생활 패턴이 핵심이에요. 지금 관리하면 충분히 좋아질 수 있어요.",
  synBad:"카드가 경고 신호를 보내고 있어요. 지금 당장 생활 습관을 점검하고, 필요하다면 전문가를 찾아보세요.",
};

const CARDS = [
  {id:0,suit:"major",name:"봇짐 멘 유랑 선비",en:"The Fool",display:"바보",keyword:"새로운 시작, 모험, 순수함",good:true},
  {id:1,suit:"major",name:"도사 전우치",en:"The Magician",display:"마법사",keyword:"의지력, 창조, 집중",good:true},
  {id:2,suit:"major",name:"국무 대무당",en:"The High Priestess",display:"여사제",keyword:"직관, 신비, 잠재력",good:true},
  {id:3,suit:"major",name:"모후 중전마마",en:"The Empress",display:"여황제",keyword:"풍요, 창조성, 자연",good:true},
  {id:4,suit:"major",name:"곤룡포를 입은 왕",en:"The Emperor",display:"황제",keyword:"권위, 안정, 리더십",good:true},
  {id:5,suit:"major",name:"대제학 큰 스승",en:"The Hierophant",display:"교황",keyword:"전통, 신념, 안내",good:true},
  {id:6,suit:"major",name:"견우와 직녀",en:"The Lovers",display:"연인",keyword:"사랑, 선택, 조화",good:true},
  {id:7,suit:"major",name:"거북선 위 장군",en:"The Chariot",display:"전차",keyword:"승리, 의지, 전진",good:true},
  {id:8,suit:"major",name:"해태를 길들이는 여인",en:"Strength",display:"힘",keyword:"용기, 인내, 자제력",good:true},
  {id:9,suit:"major",name:"산속의 고승",en:"The Hermit",display:"은둔자",keyword:"내면탐구, 고독, 지혜",good:true},
  {id:10,suit:"major",name:"사방신과 윤도",en:"Wheel of Fortune",display:"운명의 수레바퀴",keyword:"변화, 운명, 순환",good:true},
  {id:11,suit:"major",name:"암행어사 판관",en:"Justice",display:"정의",keyword:"균형, 진실, 인과",good:true},
  {id:12,suit:"major",name:"유배된 유학자",en:"The Hanged Man",display:"매달린 사람",keyword:"희생, 새 관점, 대기",good:false},
  {id:13,suit:"major",name:"저승사자",en:"Death",display:"죽음",keyword:"변환, 끝과 시작, 해방",good:false},
  {id:14,suit:"major",name:"물을 나누는 선녀",en:"Temperance",display:"절제",keyword:"조화, 균형, 인내",good:true},
  {id:15,suit:"major",name:"도깨비",en:"The Devil",display:"악마",keyword:"속박, 욕망, 물질주의",good:false},
  {id:16,suit:"major",name:"벼락 맞는 경회루",en:"The Tower",display:"탑",keyword:"갑작스런 변화, 해방",good:false},
  {id:17,suit:"major",name:"칠성신",en:"The Star",display:"별",keyword:"희망, 영감, 치유",good:true},
  {id:18,suit:"major",name:"달토끼와 월궁",en:"The Moon",display:"달",keyword:"환상, 불안, 무의식",good:false},
  {id:19,suit:"major",name:"해님과 동자",en:"The Sun",display:"태양",keyword:"성공, 기쁨, 활력",good:true},
  {id:20,suit:"major",name:"나팔 부는 신선",en:"Judgement",display:"심판",keyword:"부활, 반성, 전환점",good:true},
  {id:21,suit:"major",name:"천하도 속 무희",en:"The World",display:"세계",keyword:"완성, 통합, 성취",good:true},
  ...Array.from({length:56},(_,i)=>({id:22+i,suit:["붓","청자","환도","엽전"][Math.floor(i/14)],name:["붓","청자","환도","엽전"][Math.floor(i/14)]+" "+((i%14)+2),en:"Card "+(22+i),display:["붓","청자","환도","엽전"][Math.floor(i/14)]+" "+((i%14)+2),keyword:"신비로운 기운이 흐릅니다",good:i%3!==0}))
];

function rng(seed){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/0x100000000;};}
function GBtn({children,onClick,dim}){
  return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;
}
function CardBack({size}){
  var s=size||72;
  return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:s*0.08,border:"1.5px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:s*0.25,filter:"brightness(0.35)"}}>🃏</span></div>;
}
function CardFront({card,isReversed,size}){
  var s=size||100;
  return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:s*0.08,border:"2px solid rgba(232,200,122,0.5)",overflow:"hidden",position:"relative",transform:isReversed?"rotate(180deg)":"none",boxShadow:"0 0 20px rgba(232,200,122,0.2)"}}>
    <img src={"/tarot/joseon/"+card.id+".png"} alt={card.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={function(e){e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
    <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:8,position:"absolute",inset:0}}><span style={{fontSize:s*0.28,marginBottom:4}}>🃏</span><p style={{fontSize:s*0.1,color:G,fontWeight:700,textAlign:"center",margin:0}}>{card.display}</p></div>
    {isReversed&&<div style={{position:"absolute",top:4,right:4,fontSize:8,background:"rgba(255,80,80,0.85)",color:"#fff",padding:"1px 5px",borderRadius:5,transform:"rotate(180deg)"}}>역방향</div>}
  </div>;
}

export default function TaroPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [freeText,setFreeText]=useState("");
  var [activeIdx,setActiveIdx]=useState(null);
  var [cards,setCards]=useState([]);
  var [openCard,setOpenCard]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [selectedCards,setSelectedCards]=useState([]);
  var ivRef=useRef(null);
  var needed=3;
  var shuffledRef=useRef(null);
  if(!shuffledRef.current){var arr=CARDS.slice();for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}shuffledRef.current=arr;}
  var deck=shuffledRef.current;
  var timerRef=useRef(null);
  var ivRef=useRef(null);
  var c=CFG;

  useEffect(function(){
    if(step==="shuffle"){timerRef.current=setTimeout(function(){setStep("spread");},1400);}
    return function(){if(timerRef.current)clearTimeout(timerRef.current);};
  },[step,selectedCards]);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*4+2);
      setLoadPct(Math.floor(pct));
      if(Math.random()>0.9)setLoadMsgIdx(function(i){return(i+1)%c.loading.length;});
      if(pct>=100){
        clearInterval(ivRef.current);
        var drawn=selectedCards.map(function(idx,i){var card=deck[idx];var rev=Math.random()>0.62;return {card:card,isReversed:rev,pos:c.positions[i],isGood:card.good&&!rev};});
        setCards(drawn);
        setTimeout(function(){setStep("result");},500);
      }
    },160);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var goodCount=cards.filter(function(x){return x.isGood;}).length;
  var isGood=goodCount>=Math.ceil(c.cardCount/2);
  var q1=answers[0]||""; var q2=answers[1]||"";
  var synText=isGood?c.synGood:c.synBad;

  // ── 설명 팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>🌿 건강 타로</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>3장의 카드로 몸의 기운, 주의할 부분, 건강 조언을 알려드려요</p>
          </div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(85,239,196,0.18)",color:"#55EFC4",border:"1px solid #55EFC444",fontWeight:700,flexShrink:0,marginLeft:8}}>추천</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>🃏 조선 타로 78장 풀덱</p>
          <div style={{position:"relative",marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(13,1fr)",gap:3,filter:"blur(1.5px)",opacity:0.5,pointerEvents:"none"}}>
              {CARDS.map(function(card,i){return(
                <div key={i} style={{width:"100%",aspectRatio:"2/3",background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:3,border:"1px solid rgba(232,200,122,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:7,filter:"brightness(0.3)"}}>🃏</span>
                </div>
              );})}
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(13,35,24,0.6)",borderRadius:6}}>
              <span style={{fontSize:24,marginBottom:6}}>🃏</span>
              <p style={{fontSize:12,color:G,fontWeight:700,margin:"0 0 3px",textAlign:"center"}}>시작하면 78장이 펼쳐져요</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0,textAlign:"center"}}>그 중 3장을 직관으로 직접 선택해요</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:1,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>🎴 3장 직접 선택</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>78장 중 직접 고르기</p>
            </div>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:2,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>🌿 3장 헬스 리딩</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>정방향 / 역방향 전부 해석</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 이 타로에서 알 수 있는 것</p>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🌿</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>현재 몸의 기운</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 내 몸이 보내는 신호를 카드로 읽기</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>⚠️</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>주의해야 할 부분</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>특별히 챙겨야 할 건강 포인트</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>💡</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>건강 조언</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>몸에 맞는 구체적인 생활 습관 조언</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>✅</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>오늘 당장 행동</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 바로 실천할 수 있는 건강 행동</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>😴</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>수면·피로·멘탈</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>번아웃, 스트레스, 에너지 상태 분석</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🍀</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>건강 행운 정보</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>행운 음식·컬러·시간·날짜</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 카드 배열 (3장)</p>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>1</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>현재 몸의 상태</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>2</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>주의해야 할 부분</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>3</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>건강을 위한 조언</span>
          </div>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>3장 풀 리딩 + 건강 상태별 맞춤 분석 + 오늘 행동 조언</p>
        </div>
        <GBtn onClick={function(){setStep("questions");}}>시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 누구? ──
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{c.emoji} 누구의 {c.name}을(를) 볼까요?</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>등록된 인물을 선택하거나 새로 추가하세요</p>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>2028-04-07 · 양력 · 여</p></div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사전질문 (단계별) ──
  if(step==="questions"){
    var curQ=c.questions[qStep];
    var totalQ=c.questions.length;
    var progress=(qStep/totalQ)*100;
    function selectOpt(opt){
      var na=answers.slice(); na[qStep]=opt; setAnswers(na);
      if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}
      else{setTimeout(function(){setStep("spread");},300);}
    }
    function goNext(){
      var na=answers.slice();
      if(curQ.freeInput&&freeText){na[qStep]=freeText;setFreeText("");}
      else if(!na[qStep]){na[qStep]="";}
      setAnswers(na);
      if(qStep<totalQ-1){setQStep(qStep+1);}
      else{setStep("spread");}
    }
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}>
              <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/>
            </div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
        </div>
        <div style={{padding:"16px"}}>
          {curQ.opts.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {curQ.opts.map(function(opt){
                var isSel=answers[qStep]===opt;
                return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"14px 10px",borderRadius:13,cursor:"pointer",fontSize:12,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;
              })}
            </div>
          )}
          {curQ.freeInput&&(
            <div style={{marginBottom:14}}>
              <textarea value={freeText} onChange={function(e){setFreeText(e.target.value);}} placeholder={curQ.placeholder} rows={3}
                style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#F0EAD6",fontFamily:"'Noto Serif KR',serif",resize:"none",boxSizing:"border-box",outline:"none",lineHeight:1.7}}/>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(curQ.freeInput||curQ.skippable)&&(
              <GBtn onClick={goNext}>{freeText?"이걸로 분석하기 →":qStep<c.questions.length-1?"다음 →":"카드 섞기 시작 →"}</GBtn>
            )}
            {curQ.skippable&&(
              <button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);if(qStep<c.questions.length-1){setQStep(qStep+1);}else{setStep("spread");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>
                건너뛰고 바로 분석 →
              </button>
            )}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 78장 카드 선택 ── 한 번 선택하면 확정 (취소 불가)
  if(step==="spread"){
    var done=selectedCards.length>=3;
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:100}}>
        <div style={{background:DG,padding:"18px 16px 14px",position:"sticky",top:0,zIndex:10}}>
          <h3 style={{fontSize:16,fontWeight:700,color:G,margin:"0 0 3px"}}>✨ 마음이 끌리는 카드를 {needed}장 고르세요</h3>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 10px"}}>⚠️ 한 번 고른 카드는 바꿀 수 없어요 · {selectedCards.length}/3장 중 {selectedCards.length}장 선택됨</p>
          {/* 선택 진행 바 */}
          <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:(selectedCards.length/needed*100)+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.3s"}}/>
          </div>
        </div>

        {/* 선택된 카드 - 세로로 크게 공개 */}
        {selectedCards.length>0&&(
          <div style={{padding:"14px 14px 0"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 10px"}}>✦ 선택된 카드</p>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none"}}>
              {selectedCards.map(function(idx,i){
                var card=deck[idx];
                var isRev=Math.random()>0.62;
                return(
                  <div key={i} style={{flexShrink:0,textAlign:"center"}}>
                    <div style={{
                      width:80,height:124,
                      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                      borderRadius:8,
                      border:"2px solid #E8C87A",
                      display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",
                      boxShadow:"0 0 20px rgba(232,200,122,0.3)",
                      position:"relative",
                      animation:"cardReveal 0.4s ease-out"
                    }}>
                      <span style={{fontSize:28,marginBottom:4}}>🃏</span>
                      <p style={{fontSize:8,color:G,fontWeight:700,textAlign:"center",margin:0,padding:"0 4px",lineHeight:1.3}}>{card.display}</p>
                      <div style={{position:"absolute",top:4,left:4,width:16,height:16,borderRadius:"50%",background:"#E8C87A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:9,color:"#0D0D14",fontWeight:900}}>{i+1}</span>
                      </div>
                    </div>
                    <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"5px 0 0",maxWidth:80}}>{c.positions[i]||""}</p>
                  </div>
                );
              })}
              {/* 빈 슬롯 */}
              {Array.from({length:needed-selectedCards.length},function(_,i){return(
                <div key={"empty"+i} style={{flexShrink:0,width:80,height:124,borderRadius:8,border:"1px dashed rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:20,color:"rgba(255,255,255,0.15)"}}>+</span>
                </div>
              );})}
            </div>
          </div>
        )}

        <div style={{padding:"8px 10px 0"}}>
          {q1&&<p style={{fontSize:10,color:G,marginBottom:10,background:"rgba(232,200,122,0.08)",padding:"7px 12px",borderRadius:20,display:"inline-block"}}>✦ {q1}</p>}
          <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:"0 0 10px"}}>아래 {deck.length}장 중에서 끌리는 카드를 골라주세요</p>
          {/* 78장 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:20}}>
            {deck.map(function(card,idx){
              var selPos=selectedCards.indexOf(idx);
              var isSel=selPos!==-1;
              var isFull=selectedCards.length>=needed&&!isSel;
              return(
                <div key={idx}
                  onClick={function(){
                    // 한 번 선택하면 취소 불가 / 아직 안 뽑은 카드만 선택 가능
                    if(!isSel&&!isFull){
                      setSelectedCards(function(prev){return prev.concat(idx);});
                    }
                  }}
                  style={{
                    position:"relative",
                    cursor:isFull||isSel?"default":"pointer",
                    opacity:isFull?0.25:isSel?1:1,
                    transition:"transform 0.15s",
                    transform:isSel?"scale(0.9)":"none",
                    filter:isSel?"brightness(0.4)":"none"
                  }}>
                  <CardBack size={44}/>
                  {isSel&&(
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",borderRadius:4}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#E8C87A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:10,color:"#0D0D14",fontWeight:900}}>{selPos+1}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"12px 16px",background:"rgba(17,24,39,0.97)",borderTop:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(10px)"}}>
          {done
            ?<GBtn onClick={function(){setStep("payment");}}>✨ {needed}장 선택 완료 → 결제하기</GBtn>
            :<div style={{textAlign:"center"}}><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 8px"}}>카드를 {needed-selectedCards.length}장 더 고르면 결제로 넘어가요</p><div style={{height:4,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:(selectedCards.length/needed*100)+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.3s"}}/></div></div>
          }
        </div>
        <style>{"@keyframes cardReveal{from{opacity:0;transform:scale(0.8) rotateY(90deg)}to{opacity:1;transform:scale(1) rotateY(0)}}::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 결제 ──
  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>안전하게 처리됩니다</p></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&(
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>
            {answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:11,color:"rgba(255,255,255,0.65)",margin:"0 0 4px"}}>{c.questions[i].icon} {a}</p>):null;})}
          </div>
        )}
        <div style={{background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"7px 14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
        {[["🎟️","쿠폰 (0장)","눌러서 쿠폰 목록 보기"],["📋","이용권 (0장)","눌러서 이용권 목록 보기"]].map(function(x){return(<div key={x[1]} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}><div><p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.65)",margin:"0 0 1px"}}>{x[0]} {x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.3)",margin:0}}>{x[2]}</p></div><span style={{color:"rgba(255,255,255,0.3)"}}>▾</span></div>);})}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>상품 가격</span><span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{c.price.toLocaleString()}원</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>{c.price.toLocaleString()}원</span></div></div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 10px",letterSpacing:1}}>= 결제 수단</p>
        {[["🟡","카카오페이","원터치 간편결제",true],["🔵","토스페이","간편결제",false],["💚","네이버페이","포인트 적립",false],["💳","카드결제","신용/체크카드",false],["📱","핸드폰 결제","통신사 결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[3]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[3]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20,flexShrink:0}}>{x[0]}</span><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>{x[2]}</p></div><div style={{width:18,height:18,borderRadius:"50%",border:x[3]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[3]?"#E8C87A":"transparent",flexShrink:0}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 ({c.price.toLocaleString()}원) →</GBtn><div style={{height:8}}/><GBtn onClick={function(){setStep("spread");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 로딩 ──
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>{c.emoji} {c.name}</p>
        {answers[0]&&<p style={{fontSize:11,color:G,margin:"0 0 20px",background:"rgba(232,200,122,0.08)",padding:"6px 12px",borderRadius:20}}>✦ {answers[0]}</p>}
        <div style={{fontSize:50,marginBottom:14}}>🔮</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>운명을 읽고 있어요...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{c.loading[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  // ── 결과 ──
  if(step==="result"&&cards.length>0) return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>{c.subtitle}</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{c.emoji} {c.name} 완료</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>카드를 탭하면 상세 해석이 펼쳐져요</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>
        {/* 사전질문 요약 카드 */}
        {q1&&q1!==""&&(
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ 질문 분석</p>
            <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 3px"}}>"{q1}" 상황이시군요</p>
            {q2&&q2!==""&&<p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:"3px 0 0"}}>{c.questions[1].icon} {q2}</p>}
            {answers[2]&&answers[2]!==""&&<p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:"3px 0 0",fontStyle:"italic"}}>✏️ "{answers[2]}"</p>}
          </div>
        )}
        {/* 카드 배열 — 5장: 3+2 */}
        <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🃏 뽑힌 카드 · 탭하면 해석</p>
          <div style={{display:"flex",justifyContent:"center",gap:12}}>
            {cards.slice(0,3).map(function(cd,i){return(
              <div key={i} onClick={function(){setOpenCard(openCard===i?null:i);}} style={{textAlign:"center",cursor:"pointer",flex:1,maxWidth:115}}>
                <div style={{border:openCard===i?"2.5px solid #E8C87A":"2.5px solid transparent",borderRadius:10,padding:2,transition:"0.2s"}}><CardFront card={cd.card} isReversed={cd.isReversed} size={95}/></div>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"6px 0 2px"}}>{cd.pos}</p>
                <p style={{fontSize:10,fontWeight:700,color:cd.isGood?"#2E7D32":"#C62828"}}>{cd.card.display}</p>
              </div>
            );})}
          </div>
        </div>
        {/* ③ 카드 상세 해석 - 탭시 펼쳐짐 */}
        {openCard!==null&&cards[openCard]&&(function(){
          var cd=cards[openCard];
          var posKey="pos"+openCard;
          var posData=POS_RICH[posKey];
          var msg="";
          if(posData){
            var pool=posData[cd.isGood?"good":"bad"];
            if(pool) msg=pool[q2]||pool["default"]||"";
          }
          if(!msg) msg=cd.isGood
            ?DEMO_NAME+"님, 이 자리에 좋은 기운이 나왔어요. 재물 흐름이 긍정적으로 향하고 있어요. 이 에너지를 믿고 앞으로 나아가세요."
            :DEMO_NAME+"님, 이 자리에서 잠시 점검 신호가 나왔어요. 몸이 지금 무리하고 있어요. 더 이상 미루지 말고 점검해보세요.";
          return(
            <div style={{background:"#fff",border:cd.isGood?"2px solid rgba(46,125,50,0.25)":"2px solid rgba(198,40,40,0.2)",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <CardFront card={cd.card} isReversed={cd.isReversed} size={82}/>
                <div style={{flex:1,paddingTop:4}}>
                  <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 5px"}}>✦ {cd.pos}</p>
                  <p style={{fontSize:15,fontWeight:800,color:"#111",margin:"0 0 2px"}}>{cd.card.display}{cd.isReversed?" (역방향)":""}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 8px"}}>{cd.card.name}</p>
                  <div style={{background:"#F5F5F0",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                    <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 2px"}}>카드 키워드</p>
                    <p style={{fontSize:11,color:"#7A5C00",fontWeight:600,margin:0}}>{cd.card.keyword}</p>
                  </div>
                  <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:cd.isGood?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)",color:cd.isGood?"#2E7D32":"#C62828",border:cd.isGood?"1px solid rgba(46,125,50,0.25)":"1px solid rgba(198,40,40,0.2)",fontWeight:700}}>{cd.isGood?"✦ 길한 기운":"⚠️ 주의 기운"}</span>
                </div>
              </div>
              {/* 재물 관련 카드 의미 */}
              <div style={{background:"rgba(255,248,220,0.5)",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                <p style={{fontSize:9,color:"#7A5C00",fontWeight:700,margin:"0 0 4px"}}>💰 건강 타로에서 이 카드는</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{cd.card.keyword}</p>
              </div>
              {/* 소제목 구조 상세 해석 */}
              {q2&&<div style={{background:"rgba(255,248,220,0.6)",borderRadius:8,padding:"4px 10px",marginBottom:10,display:"inline-block"}}><span style={{fontSize:10,color:"#7A5C00",fontWeight:700}}>📊 {q2} 맞춤 해석</span></div>}
              <p style={{fontSize:13,color:"#222",lineHeight:2.1,margin:"0 0 14px",wordBreak:"keep-all"}}>{msg}</p>
              {/* 이 카드가 현재 위치에서 주는 조언 */}
              <div style={{background:"#F9F7F2",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 6px"}}>🎯 {cd.pos}에서 이 카드의 조언</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>
                  {cd.isGood
                    ?"지금 이 자리에서 긍정적인 에너지가 흐르고 있어요. 이 자리는 "+DEMO_NAME+"님의 재물 여정에서 중요한 위치예요. 카드가 보내는 신호를 믿고, 오늘 이 에너지를 실제 행동으로 연결해보세요. 작은 실행 하나가 이 흐름을 이어가게 해줘요."
                    :"이 자리에서 주의 신호가 켜졌어요. 하지만 경고는 위기가 아니라 기회예요. 지금 이 부분을 미리 알았다는 것 자체가 "+DEMO_NAME+"님에게 큰 강점이에요. 알고 대비하면 충분히 막을 수 있어요."
                  }
                </p>
              </div>
              {/* q3 자유입력 연동 */}
              {q3&&<div style={{background:cd.isGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.05)",borderRadius:10,padding:"12px 14px",borderLeft:cd.isGood?"3px solid rgba(46,125,50,0.4)":"3px solid rgba(198,40,40,0.3)",marginBottom:12}}>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",fontWeight:700,margin:"0 0 6px"}}>✏️ "{q3}"에 대한 이 카드의 답</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{cd.isGood?"이 카드는 "+DEMO_NAME+"님이 고민하시는 상황에서도 긍정적인 방향을 가리키고 있어요. 지금 그 걱정보다 앞으로 나아가는 것에 에너지를 쓰세요. 방향은 맞아요.":"이 카드는 "+DEMO_NAME+"님의 고민이 가볍지 않다는 걸 보여주고 있어요. 더 신중한 판단이 필요하고, 가능하면 전문가나 신뢰할 수 있는 사람과 상의해보세요."}</p>
              </div>}
              {/* 오늘 당장 해야 할 행동 */}
              <div style={{background:cd.isGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.04)",borderRadius:10,padding:"12px 14px",border:cd.isGood?"1px solid rgba(46,125,50,0.15)":"1px solid rgba(198,40,40,0.12)"}}>
                <p style={{fontSize:10,color:cd.isGood?"#2E7D32":"#C62828",fontWeight:700,margin:"0 0 6px"}}>⚡ 오늘 당장 해야 할 행동</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{cd.isGood?"오늘 30분 걷기, 물 2리터 마시기, 일찍 자기 중 하나만 실천해보세요.":"오늘 무리한 운동이나 음주, 늦은 취침은 피하세요."}</p>
              </div>
            </div>
          );
        })()}

        {/* 종합 해석 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>✦ 종합 해석</p>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:24}}>{isGood?"☀️":"🌙"}</span>
            <div><p style={{fontSize:15,fontWeight:800,color:isGood?"#2E7D32":"#C62828",margin:"0 0 2px"}}>{isGood?"전반적으로 좋은 기운":"주의가 필요한 기운"}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.45)",margin:0}}>{goodCount}장 길 · {c.cardCount-goodCount}장 주의</p></div>
            <span style={{fontSize:11,padding:"4px 10px",borderRadius:10,background:isGood?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)",color:isGood?"#2E7D32":"#C62828",border:isGood?"1px solid rgba(46,125,50,0.25)":"1px solid rgba(198,40,40,0.2)",marginLeft:"auto",fontWeight:700}}>{goodCount}/{c.cardCount}</span>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2,margin:0,wordBreak:"keep-all"}}>{q1&&q1!==""?"\""+q1+"\" 고민을 가지고 계시는군요. ":""}{synText}</p>
        </div>
        {/* ⑦ 마무리 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.75,margin:"0 0 8px",wordBreak:"keep-all"}}>isGood?'💫 규미님, 꾸준히 관리하는 것이 최고의 건강 비결이에요. 잘 하고 있어요!':'💫 규미님, 몸의 소리에 귀 기울이는 것이 용기예요. 지금 챙겨주세요.'</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 카드의 메시지</p>
        </div>
        {/* ⑧ 크로스셀링 */}
        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{"emoji":"🔮","title":"사주 풀이","desc":"사주로 보는 건강운·수명운","price":"980원"},
            {"emoji":"✋","title":"손금 보기","desc":"손금에 새겨진 건강선 분석","price":"380원"},
            {"emoji":"🧠","title":"뇌과학 분석","desc":"나의 강점과 취약점 파악","price":"980원"},
            {"emoji":"📅","title":"좋은 날 찾기","desc":"수술·시술·검사에 좋은 날","price":"980원"}].map(function(cs){return(
              <div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}>
                <p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p>
                <span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span>
              </div>
            );})}
          </div>
        </div>

        {/* 해시태그 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>{c.hashtags}</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:"white",padding:20}}>로딩 중...</div>;
}
