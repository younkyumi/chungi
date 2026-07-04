import { useState } from "react";

const G  = "#E8C87A";
const DG = "#0D2318";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 책 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BOOKS = [
  {
    id:"chungi",
    title:"천기의 말씀",
    author:"천기(天機)",
    cover:"🔮",
    portrait:"🌟",
    portraitBg:"linear-gradient(135deg,#0D2318,#1a3a1a)",
    portraitBorder:"#E8C87A",
    accentColor:"#E8C87A",
    tag:"오늘의 추천",
    tagColor:"#E8C87A",
    tagBg:"rgba(232,200,122,0.15)",
    isLocked:false,
    intro:"천기가 오늘 당신에게 전하는 한 마디. 매일 자정 새로운 말씀이 찾아와요.",
    quotes:[
      "하늘은 스스로 돕는 자를 돕는다",
      "달도 차면 기울고, 기울면 다시 찬다",
      "강물도 흐르다 보면 바다에 닿는다",
      "밤이 가장 어두울 때 새벽이 온다",
      "꽃이 피는 데는 각자의 시간이 있어요",
      "서두르지 않아도 당신의 차례는 반드시 와요",
      "지금 이 순간이 남은 인생 중 가장 젊은 때다",
      "오늘 하루, 당신은 충분히 잘하고 있어요",
      "진심은 반드시 통한다",
      "별은 가장 어두운 밤에 가장 밝게 빛나요",
      "작은 불씨 하나가 세상을 밝힐 수 있어요",
      "비가 내린 후에 땅이 더 단단해지는 법이에요",
      "쉬어가는 것도 앞으로 나아가는 방법이에요",
      "당신이 걷는 모든 길이 결국 당신의 것이 돼요",
      "모든 끝은 새로운 시작이에요",
    ],
  },
  {
    id:"confucius",
    title:"논어 (論語)",
    author:"공자 (孔子, BC 551~479)",
    cover:"📜",
    portrait:"🧙",
    portraitBg:"linear-gradient(135deg,#2C1810,#4a2a1a)",
    portraitBorder:"#F5DEB3",
    accentColor:"#F5DEB3",
    tag:"고전",
    tagColor:"#F5DEB3",
    tagBg:"rgba(245,222,179,0.15)",
    isLocked:true,
    intro:"인의예지를 가르친 동양 최고의 성인 공자. 2500년 전 말씀이 오늘도 살아 숨쉬어요.",
    quotes:[
      "배우고 때때로 익히면 또한 기쁘지 아니한가",
      "아는 것을 안다 하고, 모르는 것을 모른다 하는 것이 앎이다",
      "군자는 말은 느리게 하고 행동은 민첩하게 한다",
      "스스로를 이기는 것이 강한 것이다",
      "허물을 고치지 않는 것이 진짜 허물이다",
      "가까운 사람을 기쁘게 하면 먼 곳의 사람도 스스로 찾아온다",
      "과함은 모자람과 같다",
      "인(仁)이란 사람을 사랑하는 것이다",
      "마흔이 되어도 의혹이 없어야 한다",
      "날마다 스스로를 세 가지로 살펴라",
    ],
  },
  {
    id:"laotzu",
    title:"도덕경 (道德經)",
    author:"노자 (老子, BC 6세기)",
    cover:"☯️",
    portrait:"🧘",
    portraitBg:"linear-gradient(135deg,#1A3A2A,#0d2a1a)",
    portraitBorder:"#A8D5B5",
    accentColor:"#A8D5B5",
    tag:"고전",
    tagColor:"#A8D5B5",
    tagBg:"rgba(168,213,181,0.15)",
    isLocked:true,
    intro:"무위자연(無爲自然)의 철학자 노자. 80개의 짧은 글 속에 우주의 이치를 담았어요.",
    quotes:[
      "천 리 길도 한 걸음부터 시작된다",
      "아는 자는 말하지 않고, 말하는 자는 알지 못한다",
      "부드러운 것이 단단한 것을 이긴다",
      "만족할 줄 아는 자는 부자다",
      "남을 아는 것은 지혜요, 자신을 아는 것은 밝음이다",
      "가장 좋은 것은 물과 같다",
      "무위(無爲)하되 이루지 못하는 것이 없다",
      "굽어야 보존되고, 구부러야 곧게 펼 수 있다",
    ],
  },
  {
    id:"myungsim",
    title:"명심보감 (明心寶鑑)",
    author:"추적 (秋適, 고려 말)",
    cover:"🏮",
    portrait:"📚",
    portraitBg:"linear-gradient(135deg,#3a1a00,#5a2a00)",
    portraitBorder:"#FFB347",
    accentColor:"#FFB347",
    tag:"처세",
    tagColor:"#FFB347",
    tagBg:"rgba(255,179,71,0.15)",
    isLocked:true,
    intro:"마음을 밝히는 보배로운 거울. 조선시대 서당에서 아이들이 가장 먼저 배운 처세의 고전이에요.",
    quotes:[
      "하루라도 책을 읽지 않으면 입 속에 가시가 돋는다",
      "남의 허물은 보지 말고 자신의 허물을 보라",
      "은혜는 오래 기억하고 원한은 빨리 잊어라",
      "한 번의 분노로 천 가지 일을 그르친다",
      "가난해도 즐거움이 있고, 부자여도 걱정이 있다",
      "말이 많으면 반드시 실수가 따른다",
      "아는 것보다 실천이 어렵다",
      "한 집안이 화목하면 만사가 이루어진다",
    ],
  },
  {
    id:"chaekeumdams",
    title:"채근담 (菜根譚)",
    author:"홍자성 (洪自誠, 명나라)",
    cover:"🌿",
    portrait:"🍃",
    portraitBg:"linear-gradient(135deg,#1a2a0a,#2a3a0a)",
    portraitBorder:"#90EE90",
    accentColor:"#90EE90",
    tag:"인생",
    tagColor:"#90EE90",
    tagBg:"rgba(144,238,144,0.15)",
    isLocked:true,
    intro:"채소 뿌리를 씹으며 삶의 진리를 담은 책. SNS에 가장 많이 공유되는 동양 고전이에요.",
    quotes:[
      "역경 속에서 얻은 교훈은 평생의 자산이다",
      "물이 너무 맑으면 고기가 없고, 사람이 너무 꼼꼼하면 친구가 없다",
      "화는 느리게 내고, 생각은 깊이 하라",
      "한가할 때 바쁠 때를 대비하고, 편안할 때 어려움을 대비하라",
      "군자는 이기더라도 자랑하지 않고, 지더라도 탓하지 않는다",
      "욕심을 줄이면 마음이 넓어진다",
      "바람이 멈추면 꽃이 떨어지고, 새가 울면 산이 고요해진다",
      "사람의 마음은 거울과 같아 자주 닦아야 한다",
    ],
  },
  {
    id:"seonjong",
    title:"이순신 난중일기",
    author:"이순신 (李舜臣, 1545~1598)",
    cover:"⚔️",
    portrait:"🛡️",
    portraitBg:"linear-gradient(135deg,#1a1a3a,#0a0a2a)",
    portraitBorder:"#6495ED",
    accentColor:"#6495ED",
    tag:"역사",
    tagColor:"#6495ED",
    tagBg:"rgba(100,149,237,0.15)",
    isLocked:true,
    intro:"임진왜란 7년의 기록. 한국인이 가장 존경하는 위인의 진솔한 내면 이야기예요.",
    quotes:[
      "살고자 하면 죽을 것이요, 죽고자 하면 살 것이다",
      "두려움을 이기는 것이 진짜 용기다",
      "신에게는 아직 열두 척의 배가 남아 있습니다",
      "한 번 싸워 이기는 것보다 항상 이기는 것이 중요하다",
      "장수된 자는 죽음을 각오하고 살아야 한다",
      "모든 것이 나로부터 시작된다",
      "지금 이 고통이 결국 나를 더 강하게 만든다",
    ],
  },
  {
    id:"aurelius",
    title:"명상록 (Meditations)",
    author:"마르쿠스 아우렐리우스 (121~180)",
    cover:"🏛️",
    portrait:"👑",
    portraitBg:"linear-gradient(135deg,#1a1a2a,#2a1a3a)",
    portraitBorder:"#DDA0DD",
    accentColor:"#DDA0DD",
    tag:"철학",
    tagColor:"#DDA0DD",
    tagBg:"rgba(221,160,221,0.15)",
    isLocked:true,
    intro:"로마 황제이자 스토아 철학자. Z세대에게 가장 사랑받는 2000년 전 자기계발서예요.",
    quotes:[
      "당신이 통제할 수 없는 것에 시간을 낭비하지 마라",
      "장애물이 길을 막는 것이 아니라, 장애물이 곧 길이다",
      "오늘이 마지막 날인 것처럼 살되, 영원히 살 것처럼 배워라",
      "다른 사람의 잘못으로 당신의 평화를 빼앗기지 마라",
      "지금 이 순간에 집중하라",
      "분노는 어리석음에서 시작되고 후회로 끝난다",
      "가장 좋은 복수는 상대방처럼 되지 않는 것이다",
      "당신이 생각하는 대로 당신의 삶이 만들어진다",
    ],
  },
  // 광고 슬롯
  {
    id:"ad_1",
    title:"광고 슬롯",
    author:"협찬 도서",
    cover:"📚",
    portrait:"📖",
    portraitBg:"linear-gradient(135deg,#2a2a1a,#3a3a1a)",
    portraitBorder:"#FFD700",
    accentColor:"#FFD700",
    tag:"AD",
    tagColor:"#FFD700",
    tagBg:"rgba(255,215,0,0.15)",
    isLocked:false,
    isAd:true,
    adLabel:"이 자리에 책을 올려보세요",
    adSub:"book@chungi.kr",
    intro:"천기 이용자에게 매일 노출되는 책 협찬 광고 슬롯이에요.",
    quotes:["협찬 도서의 명언이 이곳에 표시됩니다"],
  },
];

function seededRng(seed){let s=(seed>>>0)||1;return function(){s=(s*1664525+1013904223)>>>0;return s/0x100000000;};}
function todaySeed(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
function getTodayQuote(bookId){
  var book=BOOKS.find(function(b){return b.id===bookId;});
  if(!book||book.isAd)return "";
  var r=seededRng(todaySeed()+bookId.length*77);
  return book.quotes[Math.floor(r()*book.quotes.length)];
}

function StarSparkle(){
  return(
    <div style={{position:"relative",width:60,height:54,margin:"0 auto 0"}}>
      <div style={{position:"absolute",top:6,left:16,fontSize:24,color:"#E8C87A",animation:"sp1 2s ease-in-out infinite"}}>✦</div>
      <div style={{position:"absolute",top:0,right:6,fontSize:13,color:"#FF9AA2",animation:"sp2 2.3s ease-in-out infinite 0.3s"}}>✦</div>
      <div style={{position:"absolute",bottom:2,left:2,fontSize:10,color:"#74B9FF",animation:"sp3 1.8s ease-in-out infinite 0.6s"}}>✦</div>
      <style>{"@keyframes sp1{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.18) rotate(15deg)}}@keyframes sp2{0%,100%{transform:scale(1);opacity:0.9}50%{transform:scale(1.25) rotate(-12deg);opacity:0.6}}@keyframes sp3{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.35);opacity:1}}"}</style>
    </div>
  );
}

export default function TodayQuote(){
  var s1=useState("chungi"); var selectedBook=s1[0]; var setSelectedBook=s1[1];
  var s2=useState(false);    var copied=s2[0];       var setCopied=s2[1];

  var book=BOOKS.find(function(b){return b.id===selectedBook;})||BOOKS[0];
  var quote=getTodayQuote(selectedBook);

  function copyQuote(){
    if(navigator.clipboard)navigator.clipboard.writeText('"'+quote+'" — '+book.title+' / 천기 오늘의 명언');
    setCopied(true);
    setTimeout(function(){setCopied(false);},2000);
  }

  return(
    <div style={{minHeight:"100vh",background:"#0a1a0f",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>

      {/* ── 헤더 다크그린 ── */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 오리지널 · 오늘의 말씀</p>
        <h2 style={{fontSize:20,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>✦ 오늘의 명언</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>책을 선택하고 오늘의 구절을 받아보세요 · 무료</p>
      </div>

      <div style={{padding:"14px 14px 0"}}>

        {/* ── 책 선택 가로 스크롤 ── */}
        <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>📚 책을 선택하세요</p>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginBottom:14,scrollbarWidth:"none",WebkitOverflowScrolling:"touch",paddingLeft:2,paddingRight:2}}>
          {BOOKS.map(function(b){
            var isSel=selectedBook===b.id;
            return(
              <button key={b.id} onClick={function(){if(!b.isAd)setSelectedBook(b.id);}}
                style={{flexShrink:0,width:104,background:isSel?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)",border:isSel?"2px solid "+b.accentColor:"2px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"10px 6px",cursor:b.isAd?"default":"pointer",textAlign:"center",transition:"0.2s",position:"relative",boxShadow:isSel?"0 4px 16px rgba(0,0,0,0.4)":"none"}}>
                {b.tag&&(
                  <div style={{position:"absolute",top:-7,left:"50%",transform:"translateX(-50%)",fontSize:8,padding:"2px 6px",borderRadius:8,background:b.tagBg,color:b.tagColor,fontWeight:700,whiteSpace:"nowrap",border:"1px solid "+b.accentColor+"44"}}>
                    {b.tag}
                  </div>
                )}
                <p style={{fontSize:20,margin:"6px 0 5px"}}>{b.portrait}</p>
                <p style={{fontSize:9,fontWeight:700,color:isSel?b.accentColor:"rgba(255,255,255,0.7)",margin:"0 0 2px",lineHeight:1.4,wordBreak:"keep-all"}}>{b.title}</p>
                <p style={{fontSize:8,color:"rgba(255,255,255,0.35)",margin:0,lineHeight:1.2}}>{b.isLocked?"🔒 로그인":b.isAd?"AD":"무료"}</p>
              </button>
            );
          })}
        </div>

        {/* ── 광고 슬롯 ── */}
        {book.isAd&&(
          <div style={{background:"rgba(255,255,255,0.04)",border:"2px dashed rgba(255,215,0,0.3)",borderRadius:16,padding:"24px",textAlign:"center",marginBottom:14}}>
            <p style={{fontSize:28,margin:"0 0 8px"}}>{book.portrait}</p>
            <p style={{fontSize:14,fontWeight:700,color:"#FFD700",margin:"0 0 4px"}}>{book.adLabel}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:"0 0 14px",lineHeight:1.6}}>천기 이용자에게 매일 노출되는<br/>책 협찬 광고 슬롯이에요</p>
            <div style={{fontSize:11,padding:"8px 16px",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:20,display:"inline-block",color:"#FFD700",fontWeight:700}}>문의 → {book.adSub}</div>
          </div>
        )}

        {/* ── 로그인 유도 ── */}
        {book.isLocked&&!book.isAd&&(
          <div style={{background:DG,borderRadius:20,overflow:"hidden",marginBottom:12,boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
            {/* 인물 비주얼 헤더 */}
            <div style={{background:book.portraitBg,padding:"28px 20px 20px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontSize:56,marginBottom:8}}>{book.portrait}</div>
              <p style={{fontSize:16,fontWeight:700,color:book.accentColor,margin:"0 0 4px"}}>{book.title}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 12px"}}>{book.author}</p>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:book.tagBg,color:book.tagColor,border:"1px solid "+book.accentColor+"44",fontWeight:700}}>{book.tag}</span>
            </div>
            {/* 잠금 내용 */}
            <div style={{padding:"16px 20px",textAlign:"center"}}>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:"0 0 14px",wordBreak:"keep-all"}}>{book.intro}</p>
              <div style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"14px",marginBottom:14}}>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 6px"}}>오늘의 명언 미리보기</p>
                <p style={{fontSize:16,color:"rgba(255,255,255,0.2)",margin:0,filter:"blur(4px)",userSelect:"none"}}>"{book.quotes[0]}"</p>
              </div>
              <button style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
                🔓 로그인하고 읽기 →
              </button>
            </div>
          </div>
        )}

        {/* ── 결과 카드 (로그인 & 비잠금) ── */}
        {!book.isLocked&&!book.isAd&&(
          <>
            {/* 화이트 결과 카드 */}
            <div style={{background:"#fff",borderRadius:20,overflow:"hidden",marginBottom:12,boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              {/* 인물/책 비주얼 헤더 — 컬러 그라데이션 */}
              <div style={{background:book.portraitBg,padding:"28px 20px 24px",textAlign:"center",position:"relative"}}>
                <StarSparkle/>
                <div style={{fontSize:60,marginBottom:8,lineHeight:1}}>{book.portrait}</div>
                <p style={{fontSize:14,fontWeight:700,color:book.accentColor,margin:"0 0 2px"}}>{book.title}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>{book.author}</p>
              </div>
              {/* 명언 본문 */}
              <div style={{padding:"22px 20px 20px",textAlign:"center"}}>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",letterSpacing:3,margin:"0 0 16px"}}>✦ 오늘의 명언</p>
                <p style={{fontSize:20,fontWeight:700,color:"#111",lineHeight:1.6,margin:"0 0 16px",wordBreak:"keep-all"}}>"{quote}"</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:18}}>
                  <span style={{fontSize:11,color:"rgba(0,0,0,0.3)"}}>—</span>
                  <span style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{book.title}</span>
                  <span style={{fontSize:10,color:"rgba(0,0,0,0.25)"}}>·</span>
                  <span style={{fontSize:11,color:"rgba(0,0,0,0.4)"}}>{book.author.split(" ")[0]}</span>
                </div>
                {/* 안내 문구 */}
                <div style={{background:"#F5F5F0",borderRadius:12,padding:"12px 14px",textAlign:"center"}}>
                  <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",lineHeight:1.75,margin:0}}>
                    오늘 하루, 이 말씀을 마음에 새기고<br/>좋은 기운을 받아보세요 🌿
                  </p>
                </div>
              </div>
            </div>

            {/* 내일 안내 */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,padding:"11px 14px",marginBottom:14,textAlign:"center"}}>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>🌙 내일 자정이 지나면 새로운 명언이 찾아와요</p>
            </div>
          </>
        )}

        {/* ── 공유/광고 — 카드 밖, 배경 위에 ── */}
        {!book.isLocked&&!book.isAd&&(
          <>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:"0 0 10px",fontWeight:600}}>📸 스크린샷으로 캡쳐해서 친구에게 공유하세요!</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <button style={{padding:"13px",background:"#FEE500",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                <span style={{fontSize:18}}>💬</span>
                <span style={{fontSize:12,fontWeight:700,color:"#333"}}>카카오톡</span>
              </button>
              <button onClick={copyQuote} style={{padding:"13px",background:copied?"rgba(95,196,158,0.15)":"rgba(255,255,255,0.07)",border:copied?"2px solid rgba(95,196,158,0.4)":"2px solid rgba(255,255,255,0.1)",borderRadius:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"0.2s"}}>
                <span style={{fontSize:18}}>{copied?"✅":"🔗"}</span>
                <span style={{fontSize:12,fontWeight:700,color:copied?"#5FC49E":"rgba(255,255,255,0.6)"}}>{copied?"복사됨!":"링크 복사"}</span>
              </button>
            </div>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",margin:"0 0 14px"}}>"공유하면 50% 확률로 오늘 하루 더 용한 기운이 터짐 🌿"</p>

            {/* 닫기 */}
            <button style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
              오늘도 좋은 하루 ✨
            </button>

            {/* 해시태그 */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기명언 #오늘의명언 #좋은글 #동양고전</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
            </div>
          </>
        )}

      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
