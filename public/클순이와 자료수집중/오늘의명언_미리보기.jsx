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
      "上善若水 — 최고의 선은 물과 같다. 오늘 하루, 물처럼 유연하게 흘러가세요",
      "疾風知勁草 — 매서운 바람이 불어야 강한 풀을 안다. 지금의 시련이 당신을 더 강하게 만들어요",
      "伏久者 飛必高 — 오래 엎드려 있던 새가 반드시 높이 난다. 기다림의 시간도 성장이에요",
      "千里之行 始於足下 — 천 리 길도 발밑의 한 걸음부터. 오늘 그 한 걸음을 내딛어보세요",
      "歲寒然後 知松柏之後凋 — 추위 속에서야 소나무의 진가가 드러난다. 당신의 빛은 반드시 발해요",
      "德不孤 必有隣 — 덕이 있는 사람은 외롭지 않다. 진심은 반드시 통해요",
      "滴水穿石 — 물방울이 바위를 뚫는다. 작은 노력도 쌓이면 세상을 바꿔요",
      "知足不辱 — 족함을 알면 욕되지 않는다. 오늘 가진 것에 감사해보세요",
      "根深者 其枝葉必茂 — 뿌리 깊은 나무는 무성하다. 보이지 않는 곳에서 쌓은 노력이 결실을 맺어요",
      "退步原來是向前 — 물러나는 것이 때론 앞으로 나아가는 것. 쉬어가는 것도 용기예요",
      "光陰似箭 — 세월은 화살같다. 오늘 이 순간이 남은 인생 중 가장 젊은 때예요",
      "和而不同 — 조화를 이루되 나를 잃지 않는다. 당신답게 살아가는 것이 가장 아름다워요",
      "勝人者有力 自勝者强 — 자신을 이기는 자가 진정 강하다. 오늘도 어제의 나보다 한 걸음 앞으로",
      "見義不爲 無勇也 — 옳은 일을 알면서도 행하지 않는 것은 용기가 없는 것. 작은 용기를 내어보세요",
      "飮水思源 — 물을 마실 때 그 근원을 생각하라. 오늘 당신 곁의 소중한 인연에 감사해보세요",
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
      "學而不思則罔 思而不學則殆 — 배우기만 하고 생각하지 않으면 어둡고, 생각만 하고 배우지 않으면 위태롭다",
      "歲寒然後 知松柏之後凋 — 날씨가 추워진 뒤에야 소나무와 잣나무가 늦게 시듦을 안다. 시련 속에서 진가가 드러난다",
      "知之者 不如好之者 好之者 不如樂之者 — 아는 자는 좋아하는 자만 못하고, 좋아하는 자는 즐기는 자만 못하다",
      "見賢思齊焉 見不賢而內自省也 — 어진 사람을 보면 그와 같아지기를 생각하고, 어질지 못한 사람을 보면 안으로 자신을 반성하라",
      "知者不惑 仁者不憂 勇者不懼 — 지혜로운 자는 미혹되지 않고, 어진 자는 근심하지 않으며, 용기 있는 자는 두려워하지 않는다",
      "己所不欲 勿施於人 — 내가 원하지 않는 바를 남에게 베풀지 말라",
      "溫故而知新 可以爲師矣 — 옛것을 익혀 새로운 것을 알면 능히 스승이 될 수 있다",
      "過猶不及 — 지나친 것은 미치지 못한 것과 같다",
      "德不孤 必有隣 — 덕이 있는 사람은 외롭지 않다. 반드시 이웃이 있다",
      "吾日三省吾身 — 나는 하루에 세 번 나 자신을 반성한다",
      "三軍可奪帥也 匹夫不可奪志也 — 삼군의 장수는 빼앗을 수 있어도, 한 사내의 뜻은 빼앗을 수 없다",
      "君子 不器 — 군자는 한 가지 용도로만 쓰이는 그릇이 되어서는 안 된다",
      "見義不爲 無勇也 — 의로움을 보고도 행하지 않는 것은 용기가 없는 것이다",
      "和而不同 — 군자는 조화를 이루되 부화뇌동하지 않는다",
      "朝聞道 夕死可矣 — 아침에 도를 들으면 저녁에 죽어도 한이 없다",
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
      "上善若水 — 최고의 선은 물과 같다. 물은 만물을 이롭게 하면서도 다투지 않는다",
      "千里之行 始於足下 — 천 리 길도 발밑의 한 걸음부터 시작된다",
      "知足不辱 知止不殆 — 족함을 알면 욕되지 않고, 멈출 줄 알면 위태롭지 않다",
      "天下莫柔弱於水 而攻堅强者莫之能勝 — 천하에 물보다 유약한 것이 없으나, 견고한 것을 치는 데 물을 이길 자가 없다",
      "勝人者有力 自勝者强 — 남을 이기는 자는 힘이 있는 것이고, 자신을 이기는 자가 진정 강한 자다",
      "大器晩成 大音希聲 大象無形 — 큰 그릇은 늦게 완성되고, 큰 소리는 들리지 않으며, 큰 형상은 형태가 없다",
      "厚德載物 — 덕을 두텁게 하여 만물을 포용한다",
      "江海所以能爲百谷王者 以其善下之 — 강과 바다가 온갖 골짜기의 왕이 될 수 있는 까닭은 몸을 낮추기 때문이다",
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
      "滿招損 謙受益 — 교만은 손해를 부르고, 겸손은 이익을 받는다",
      "忍一時之忿 免百日之憂 — 한때의 분노를 참으면 백일의 근심을 면할 수 있다",
      "言必忠信 行必篤敬 — 말은 반드시 진실되고 미덥게 하고, 행동은 반드시 돈독하고 공경스럽게 하라",
      "見義不爲 無勇也 — 의로움을 보고도 행하지 않는 것은 용기가 없는 것이다",
      "結怨於人 謂之種禍 — 남과 원수를 맺는 것은 재앙의 씨를 심는 것이다",
      "少年易老學難成 — 소년은 늙기 쉽고 학문은 이루기 어렵다. 젊은 날의 시간을 아껴 배우라",
      "光陰似箭 — 세월은 쏘아 놓은 화살과 같다. 열정을 다해 현재에 충실하라",
      "一諾千金 — 한 번 승낙한 약속은 천금의 무게를 지닌다",
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
      "伏久者 飛必高 — 오래 엎드려 있던 새가 반드시 높이 난다. 인내의 시간이 길수록 도약은 더 크다",
      "水淸無大魚 — 물이 너무 맑으면 큰 고기가 살 수 없다. 타인의 흠을 덮어주는 여유를 가져라",
      "疾風知勁草 — 매서운 바람이 불어야 비로소 강한 풀을 안다. 위기 속에서 진짜 실력이 드러난다",
      "根深者 其枝葉必茂 — 뿌리가 깊은 나무는 그 가지와 잎이 반드시 무성하다. 보이지 않는 기초가 중요하다",
      "退步原來是向前 — 뒤로 물러나는 것이 원래는 앞으로 나아가는 것이다. 양보의 위대함",
      "滴水穿石 — 떨어지는 물방울이 바위를 뚫는다. 부드럽지만 멈추지 않는 지독한 인내력",
      "飮水思源 — 물을 마실 때 그 근원을 생각한다. 본질과 초심을 잃지 않는 통찰력",
      "靜中靜 靜中動 — 고요함 속의 고요함은 진짜 고요함이 아니다. 움직임 속에서 평정을 찾는 것이 진짜다",
    ],
  },
  {
    id:"jangja",
    title:"장자 (莊子)",
    author:"장자 (莊周, BC 369~286)",
    cover:"🦋",
    portrait:"🌊",
    portraitBg:"linear-gradient(135deg,#0a1a2a,#1a2a3a)",
    portraitBorder:"#74B9FF",
    accentColor:"#74B9FF",
    tag:"고전",
    tagColor:"#74B9FF",
    tagBg:"rgba(116,185,255,0.15)",
    isLocked:true,
    intro:"나비가 되는 꿈을 꾼 철학자 장자. 자유와 무위자연의 경지를 유쾌하게 담아낸 동양 철학의 정수예요.",
    quotes:[
      "吾生也有涯 而知也無涯 — 내 삶은 끝이 있으나 배움에는 끝이 없다",
      "井蛙不可以語於海者 — 우물 안 개구리에게 바다를 말할 수 없다. 편견 없는 열린 눈을 가져라",
      "鵬之徙於南冥也 水擊三千里 — 대붕이 남쪽 바다로 날아갈 때 물결을 삼천 리나 친다. 크게 꿈꾸어라",
      "虛室生白 — 방을 비워두면 밝은 빛이 들어온다. 마음을 비워야 지혜가 생긴다",
      "夫水之積也不厚 則其負大舟也無力 — 물이 깊게 쌓이지 않으면 큰 배를 띄울 힘이 없다. 내공을 쌓아라",
      "魚相忘乎江湖 人相忘乎道術 — 물고기는 강호를 잊고 사람은 도를 잊는다. 진정한 경지는 방법마저 초월한다",
      "知足者不以利自累 — 족함을 아는 자는 이익으로 스스로를 얽매지 않는다",
      "相濡以沫 不如相忘於江湖 — 서로 침으로 적셔주기보다 강호에서 서로 잊는 것이 낫다. 집착을 내려놓아라",
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
