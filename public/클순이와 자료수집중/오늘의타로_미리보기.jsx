import { useState, useEffect, useRef } from "react";

const G  = "#E8C87A";
const DG = "#0D2318";

const TAROT_CARDS = [
  {id:0,  suit:"major", name:"봇짐 멘 유랑 선비",    en:"The Fool",           display:"바보",           keyword:"새로운 시작, 모험, 순수함",   good:true},
  {id:1,  suit:"major", name:"도사 전우치",           en:"The Magician",       display:"마법사",         keyword:"의지력, 창조, 집중",          good:true},
  {id:2,  suit:"major", name:"국무 대무당",            en:"The High Priestess", display:"여사제",         keyword:"직관, 신비, 잠재력",         good:true},
  {id:3,  suit:"major", name:"모후 중전마마",          en:"The Empress",        display:"여황제",         keyword:"풍요, 창조성, 자연",         good:true},
  {id:4,  suit:"major", name:"곤룡포를 입은 왕",      en:"The Emperor",        display:"황제",           keyword:"권위, 안정, 리더십",         good:true},
  {id:5,  suit:"major", name:"대제학 큰 스승",         en:"The Hierophant",     display:"교황",           keyword:"전통, 신념, 안내",           good:true},
  {id:6,  suit:"major", name:"견우와 직녀",            en:"The Lovers",         display:"연인",           keyword:"사랑, 선택, 조화",           good:true},
  {id:7,  suit:"major", name:"거북선 위 장군",         en:"The Chariot",        display:"전차",           keyword:"승리, 의지, 전진",           good:true},
  {id:8,  suit:"major", name:"해태를 길들이는 여인",  en:"Strength",           display:"힘",             keyword:"용기, 인내, 자제력",         good:true},
  {id:9,  suit:"major", name:"산속의 고승",            en:"The Hermit",         display:"은둔자",         keyword:"내면탐구, 고독, 지혜",       good:true},
  {id:10, suit:"major", name:"사방신과 윤도",          en:"Wheel of Fortune",   display:"운명의 수레바퀴",keyword:"변화, 운명, 순환",           good:true},
  {id:11, suit:"major", name:"암행어사 판관",          en:"Justice",            display:"정의",           keyword:"균형, 진실, 인과",           good:true},
  {id:12, suit:"major", name:"유배된 유학자",          en:"The Hanged Man",     display:"매달린 사람",    keyword:"희생, 새 관점, 대기",        good:false},
  {id:13, suit:"major", name:"저승사자",               en:"Death",              display:"죽음",           keyword:"변환, 끝과 시작, 해방",      good:false},
  {id:14, suit:"major", name:"물을 나누는 선녀",       en:"Temperance",         display:"절제",           keyword:"조화, 균형, 인내",           good:true},
  {id:15, suit:"major", name:"도깨비",                 en:"The Devil",          display:"악마",           keyword:"속박, 욕망, 물질주의",       good:false},
  {id:16, suit:"major", name:"벼락 맞는 경회루",      en:"The Tower",          display:"탑",             keyword:"갑작스런 변화, 해방",        good:false},
  {id:17, suit:"major", name:"칠성신",                 en:"The Star",           display:"별",             keyword:"희망, 영감, 치유",           good:true},
  {id:18, suit:"major", name:"달토끼와 월궁",          en:"The Moon",           display:"달",             keyword:"환상, 불안, 무의식",         good:false},
  {id:19, suit:"major", name:"해님과 동자",            en:"The Sun",            display:"태양",           keyword:"성공, 기쁨, 활력",           good:true},
  {id:20, suit:"major", name:"나팔 부는 신선",         en:"Judgement",          display:"심판",           keyword:"부활, 반성, 전환점",         good:true},
  {id:21, suit:"major", name:"천하도 속 무희",         en:"The World",          display:"세계",           keyword:"완성, 통합, 성취",           good:true},
  {id:22, suit:"붓",    name:"붓의 시작",              en:"Ace of Wands",       display:"붓 에이스",      keyword:"창의적 열정, 새 에너지",     good:true},
  {id:23, suit:"붓",    name:"한양을 바라보는 선비",   en:"Two of Wands",       display:"붓 2",           keyword:"야망, 계획, 미래 비전",      good:true},
  {id:24, suit:"붓",    name:"무역선을 기다리는 보부상",en:"Three of Wands",    display:"붓 3",           keyword:"확장, 리더십, 탐험",         good:true},
  {id:25, suit:"붓",    name:"잔칫날",                 en:"Four of Wands",      display:"붓 4",           keyword:"완성, 축제, 조화",           good:true},
  {id:26, suit:"붓",    name:"선비들의 논쟁",          en:"Five of Wands",      display:"붓 5",           keyword:"갈등, 경쟁, 도전",           good:false},
  {id:27, suit:"붓",    name:"장원급제 금의환향",      en:"Six of Wands",       display:"붓 6",           keyword:"승리, 인정, 귀환",           good:true},
  {id:28, suit:"붓",    name:"고수부지 수호",           en:"Seven of Wands",     display:"붓 7",           keyword:"방어, 결단, 도전",           good:true},
  {id:29, suit:"붓",    name:"하늘을 나는 붓들",       en:"Eight of Wands",     display:"붓 8",           keyword:"신속, 행동, 진전",           good:true},
  {id:30, suit:"붓",    name:"성벽 위의 보초",         en:"Nine of Wands",      display:"붓 9",           keyword:"경계, 인내, 회복력",         good:true},
  {id:31, suit:"붓",    name:"서책을 짊어진 선비",     en:"Ten of Wands",       display:"붓 10",          keyword:"책임, 부담, 완성",           good:false},
  {id:32, suit:"붓",    name:"붓을 든 동자",           en:"Page of Wands",      display:"붓 시종",        keyword:"탐구, 열정, 새 소식",        good:true},
  {id:33, suit:"붓",    name:"말을 탄 젊은 화공",      en:"Knight of Wands",    display:"붓 기사",        keyword:"모험, 충동, 여행",           good:true},
  {id:34, suit:"붓",    name:"붓을 든 신사임당",       en:"Queen of Wands",     display:"붓 왕비",        keyword:"창의력, 자신감, 카리스마",   good:true},
  {id:35, suit:"붓",    name:"붓을 든 세종대왕",       en:"King of Wands",      display:"붓 왕",          keyword:"비전, 리더십, 열정",         good:true},
  {id:36, suit:"청자",  name:"청자의 넘치는 복",       en:"Ace of Cups",        display:"청자 에이스",    keyword:"감정의 시작, 사랑, 직관",    good:true},
  {id:37, suit:"청자",  name:"정분을 나누는 연인",     en:"Two of Cups",        display:"청자 2",         keyword:"결합, 파트너십, 상호이해",   good:true},
  {id:38, suit:"청자",  name:"기생들의 풍류",          en:"Three of Cups",      display:"청자 3",         keyword:"우정, 축하, 창의성",         good:true},
  {id:39, suit:"청자",  name:"명상하는 선비",          en:"Four of Cups",       display:"청자 4",         keyword:"명상, 재평가, 내면탐구",     good:false},
  {id:40, suit:"청자",  name:"깨진 도자기와 후회",     en:"Five of Cups",       display:"청자 5",         keyword:"상실, 후회, 슬픔",           good:false},
  {id:41, suit:"청자",  name:"어린 시절의 추억",       en:"Six of Cups",        display:"청자 6",         keyword:"순수, 추억, 과거",           good:true},
  {id:42, suit:"청자",  name:"환상과 유혹",            en:"Seven of Cups",      display:"청자 7",         keyword:"선택, 환상, 욕망",           good:false},
  {id:43, suit:"청자",  name:"길을 떠나는 나그네",     en:"Eight of Cups",      display:"청자 8",         keyword:"이행, 포기, 새 길",          good:false},
  {id:44, suit:"청자",  name:"만석꾼의 만족",          en:"Nine of Cups",       display:"청자 9",         keyword:"성취, 만족, 풍요",           good:true},
  {id:45, suit:"청자",  name:"화목한 가족",            en:"Ten of Cups",        display:"청자 10",        keyword:"행복, 완성, 가족",           good:true},
  {id:46, suit:"청자",  name:"연못가의 동자",          en:"Page of Cups",       display:"청자 시종",      keyword:"감수성, 창의, 소식",         good:true},
  {id:47, suit:"청자",  name:"시를 읊는 선비",         en:"Knight of Cups",     display:"청자 기사",      keyword:"낭만, 이상, 감정",           good:true},
  {id:48, suit:"청자",  name:"자애로운 안주인",        en:"Queen of Cups",      display:"청자 왕비",      keyword:"공감, 직관, 돌봄",           good:true},
  {id:49, suit:"청자",  name:"바다 위의 군주",         en:"King of Cups",       display:"청자 왕",        keyword:"감정적 성숙, 지혜, 균형",    good:true},
  {id:50, suit:"환도",  name:"검의 결단",              en:"Ace of Swords",      display:"환도 에이스",    keyword:"명료함, 결단, 돌파구",       good:true},
  {id:51, suit:"환도",  name:"눈 가린 무사",           en:"Two of Swords",      display:"환도 2",         keyword:"균형, 교착, 갈등",           good:false},
  {id:52, suit:"환도",  name:"심장에 꽂힌 칼",         en:"Three of Swords",    display:"환도 3",         keyword:"비탄, 이별, 상처",           good:false},
  {id:53, suit:"환도",  name:"전사의 휴식",            en:"Four of Swords",     display:"환도 4",         keyword:"안식, 회복, 명상",           good:true},
  {id:54, suit:"환도",  name:"패배자의 뒷모습",        en:"Five of Swords",     display:"환도 5",         keyword:"항복, 패배, 갈등",           good:false},
  {id:55, suit:"환도",  name:"밤배를 타는 피난길",     en:"Six of Swords",      display:"환도 6",         keyword:"회복, 이동, 평화로의 길",    good:true},
  {id:56, suit:"환도",  name:"칼을 훔치는 도적",       en:"Seven of Swords",    display:"환도 7",         keyword:"계략, 기만, 전략",           good:false},
  {id:57, suit:"환도",  name:"포위된 여인",            en:"Eight of Swords",    display:"환도 8",         keyword:"구속, 두려움, 자기 제한",    good:false},
  {id:58, suit:"환도",  name:"악몽을 꾼 선비",         en:"Nine of Swords",     display:"환도 9",         keyword:"고뇌, 불안, 악몽",           good:false},
  {id:59, suit:"환도",  name:"몰락한 장수",            en:"Ten of Swords",      display:"환도 10",        keyword:"종결, 몰락, 새 시작",        good:false},
  {id:60, suit:"환도",  name:"검술을 익히는 소년",     en:"Page of Swords",     display:"환도 시종",      keyword:"호기심, 경계, 소통",         good:true},
  {id:61, suit:"환도",  name:"돌격하는 장군",          en:"Knight of Swords",   display:"환도 기사",      keyword:"결단, 돌진, 대담",           good:true},
  {id:62, suit:"환도",  name:"단호한 대비마마",        en:"Queen of Swords",    display:"환도 왕비",      keyword:"독립, 명철함, 결단",         good:true},
  {id:63, suit:"환도",  name:"공정한 판관",            en:"King of Swords",     display:"환도 왕",        keyword:"권위, 공정, 분석력",         good:true},
  {id:64, suit:"엽전",  name:"엽전의 복",              en:"Ace of Pentacles",   display:"엽전 에이스",    keyword:"물질적 시작, 기회, 번영",    good:true},
  {id:65, suit:"엽전",  name:"엽전을 굴리는 광대",     en:"Two of Pentacles",   display:"엽전 2",         keyword:"변화, 균형, 시간관리",       good:true},
  {id:66, suit:"엽전",  name:"단청을 그리는 장인",     en:"Three of Pentacles", display:"엽전 3",         keyword:"협력, 역량, 팀워크",         good:true},
  {id:67, suit:"엽전",  name:"자린고비",               en:"Four of Pentacles",  display:"엽전 4",         keyword:"집착, 안정, 절약",           good:false},
  {id:68, suit:"엽전",  name:"눈보라 속 거지",         en:"Five of Pentacles",  display:"엽전 5",         keyword:"역경, 결핍, 시련",           good:false},
  {id:69, suit:"엽전",  name:"베푸는 대감",            en:"Six of Pentacles",   display:"엽전 6",         keyword:"관용, 나눔, 균형",           good:true},
  {id:70, suit:"엽전",  name:"수확을 기다리는 농부",   en:"Seven of Pentacles", display:"엽전 7",         keyword:"인내, 평가, 장기적 관점",    good:true},
  {id:71, suit:"엽전",  name:"엽전을 깎는 장인",       en:"Eight of Pentacles", display:"엽전 8",         keyword:"숙련, 노력, 세공",           good:true},
  {id:72, suit:"엽전",  name:"정원의 귀부인",          en:"Nine of Pentacles",  display:"엽전 9",         keyword:"독립, 풍요, 자기 충족",      good:true},
  {id:73, suit:"엽전",  name:"명문가의 유산",          en:"Ten of Pentacles",   display:"엽전 10",        keyword:"전통, 유산, 완성",           good:true},
  {id:74, suit:"엽전",  name:"엽전을 살피는 유생",     en:"Page of Pentacles",  display:"엽전 시종",      keyword:"탐구, 학습, 기회",           good:true},
  {id:75, suit:"엽전",  name:"신중한 무관",            en:"Knight of Pentacles",display:"엽전 기사",      keyword:"신중, 성실, 책임",           good:true},
  {id:76, suit:"엽전",  name:"내조의 여왕",            en:"Queen of Pentacles", display:"엽전 왕비",      keyword:"안정, 풍요, 돌봄",           good:true},
  {id:77, suit:"엽전",  name:"만석꾼 최부자",          en:"King of Pentacles",  display:"엽전 왕",        keyword:"성공, 번영, 안정",           good:true},
];
// 나머지 42~77 채우기
for(let i=42;i<78;i++) TAROT_CARDS.push({id:i,name:`카드 ${i}`,en:`Card ${i}`,keyword:"신비로운 기운이 흐릅니다",positive:i%3!==0});

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
}
function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + 333;
}
function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

const READINGS_GOOD = [
  "오늘은 긍정적인 에너지가 당신을 감싸고 있어요. 망설이던 일을 시작하기 좋은 날이에요.",
  "카드가 밝은 기운을 보내고 있어요. 자신을 믿고 앞으로 나아가세요.",
  "오늘은 원하는 방향으로 흐름이 맞춰지는 날이에요. 기회가 보이면 잡으세요.",
];
const READINGS_BAD = [
  "오늘은 조금 신중하게 행동하는 것이 좋겠어요. 중요한 결정은 내일로 미루세요.",
  "카드가 잠시 멈추라고 말하고 있어요. 내면의 소리에 귀 기울여보세요.",
  "오늘은 에너지를 아끼고 충전하는 날로 삼으면 좋겠어요.",
];

function CardBack({ size=90 }) {
  return (
    <div style={{
      width:size, height:size*1.6,
      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
      borderRadius:size*0.08,
      border:`1.5px solid ${G}33`,
      display:"flex",alignItems:"center",justifyContent:"center",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",inset:5,border:`1px solid ${G}18`,borderRadius:size*0.05,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 4px,${G}07 4px,${G}07 5px)`}}/>
      <span style={{fontSize:size*0.25,filter:"brightness(0.35)",position:"relative",zIndex:1}}>🃏</span>
    </div>
  );
}

function CardFront({ card, isReversed, size=130 }) {
  return (
    <div style={{
      width:size, height:size*1.6,
      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
      borderRadius:size*0.08,
      border:`2px solid ${isReversed?"#FF7675":G}88`,
      overflow:"hidden",position:"relative",
      transform:isReversed?"rotate(180deg)":"none",
      boxShadow:`0 0 30px ${isReversed?"rgba(255,118,117,0.35)":"rgba(232,200,122,0.35)"}`,
    }}>
      <img src={`/tarot/joseon/${card.id}.png`} alt={card.name}
        style={{width:"100%",height:"100%",objectFit:"cover"}}
        onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
      />
      <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:12,position:"absolute",inset:0}}>
        <span style={{fontSize:size*0.3,marginBottom:8}}>🃏</span>
        <p style={{fontSize:size*0.1,color:G,fontWeight:700,textAlign:"center",margin:"0 0 3px"}}>{card.name}</p>
        <p style={{fontSize:size*0.08,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:0}}>{card.en}</p>
      </div>
      {isReversed && (
        <div style={{position:"absolute",top:6,right:6,fontSize:8,background:"rgba(255,80,80,0.85)",color:"#fff",padding:"2px 6px",borderRadius:5,transform:"rotate(180deg)"}}>역방향</div>
      )}
    </div>
  );
}

export default function TodayTaro() {
  const [step,      setStep]      = useState("intro");
  const [activeIdx, setActiveIdx] = useState(null);
  const [result,    setResult]    = useState(null);
  const timerRef = useRef(null);

  // 오늘의 카드 (날짜 고정)
  const rng0      = seededRng(todaySeed());
  const cardId    = Math.floor(rng0() * 78);
  const card      = TAROT_CARDS[cardId % TAROT_CARDS.length];
  const isReversed = rng0() > 0.65;
  const isGood    = card.positive && !isReversed;
  const rng1      = seededRng(todaySeed()+1);
  const reading   = isGood
    ? READINGS_GOOD[Math.floor(rng1()*READINGS_GOOD.length)]
    : READINGS_BAD[Math.floor(rng1()*READINGS_BAD.length)];

  useEffect(() => {
    if (step !== "shuffle") return;
    timerRef.current = setTimeout(() => setStep("spread"), 1500);
    return () => clearTimeout(timerRef.current);
  }, [step]);

  function pickCard(idx) {
    if (step !== "spread") return;
    setActiveIdx(idx);
    setStep("flipping");
    setTimeout(() => {
      setResult({ card, isReversed, isGood, reading });
      setStep("result");
    }, 600);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:3,margin:"0 0 3px"}}>{formatDate()}</p>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🔮 오늘의 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>매일 한 장의 카드가 당신을 기다려요 · 무료</p>
      </div>

      {step === "intro" && (
        <div style={{padding:"32px 16px",textAlign:"center"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.8,margin:"0 0 32px"}}>
            오늘 당신을 위해 한 장의 카드가 준비되어 있어요.<br/>
            <span style={{color:G}}>카드를 섞고 직관을 따라 한 장을 선택하세요.</span>
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:32,alignItems:"center"}}>
            {[-10,0,10].map((deg,i)=>(
              <div key={i} style={{transform:`rotate(${deg}deg) translateY(${i===1?-8:0}px)`}}>
                <CardBack size={80}/>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep("shuffle")} style={{
            padding:"16px 32px",background:`linear-gradient(135deg,${G},#C4922A)`,
            border:"none",borderRadius:14,fontSize:15,fontWeight:700,
            color:"#0D0D14",cursor:"pointer",fontFamily:"inherit",
            boxShadow:`0 4px 20px rgba(232,200,122,0.3)`,
          }}>
            🃏 카드 섞기
          </button>
        </div>
      )}

      {step === "shuffle" && (
        <div style={{padding:"32px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,color:G,fontWeight:600,margin:"0 0 32px"}}>카드를 섞고 있어요...</p>
          <div style={{position:"relative",height:160,display:"flex",justifyContent:"center",alignItems:"flex-end",marginBottom:16}}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{
                position:"absolute",bottom:0,left:"calc(50% - 38px)",
                animation:`sh${i} 0.6s ease-in-out infinite alternate`,
                animationDelay:`${i*0.11}s`,
              }}>
                <CardBack size={76}/>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes sh0{from{transform:translateX(-56px) rotate(-18deg)}to{transform:translateX(-28px) rotate(-7deg)}}
            @keyframes sh1{from{transform:translateX(-18px) rotate(-5deg) translateY(-8px)}to{transform:translateX(12px) rotate(5deg) translateY(4px)}}
            @keyframes sh2{from{transform:rotate(-2deg) translateY(-14px)}to{transform:rotate(4deg) translateY(0)}}
            @keyframes sh3{from{transform:translateX(18px) rotate(7deg) translateY(-4px)}to{transform:translateX(-4px) rotate(-2deg) translateY(7px)}}
            @keyframes sh4{from{transform:translateX(52px) rotate(17deg)}to{transform:translateX(24px) rotate(6deg)}}
          `}</style>
        </div>
      )}

      {(step === "spread" || step === "flipping") && (
        <div style={{padding:"24px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:600,color:G,margin:"0 0 5px"}}>✨ 마음이 끌리는 카드를 선택하세요</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 20px"}}>직관을 따라 딱 하나만</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8}}>
            {Array.from({length:7},(_,i)=>{
              const isAct = activeIdx===i;
              return (
                <div key={i} onClick={()=>pickCard(i)} style={{
                  width:48, height:78,
                  background: isAct?`linear-gradient(135deg,${G},#C4922A)`:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                  borderRadius:7,
                  border:`1.5px solid ${isAct?G:G+"33"}`,
                  cursor:step==="spread"?"pointer":"default",
                  transition:"all 0.2s",
                  transform:isAct?"translateY(-12px) scale(1.08)":"none",
                  boxShadow:isAct?`0 10px 24px rgba(232,200,122,0.45)`:"none",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <span style={{fontSize:18,filter:isAct?"none":"brightness(0.25)"}}>🃏</span>
                </div>
              );
            })}
          </div>
          {step==="flipping" && (
            <p style={{fontSize:12,color:G,fontWeight:600,marginTop:16}}>카드를 확인하는 중...</p>
          )}
        </div>
      )}

      {step === "result" && result && (
        <div style={{padding:"24px 16px"}}>
          <div style={{textAlign:"center",marginBottom:20,animation:"revealCard 0.55s cubic-bezier(0.34,1.56,0.64,1) both"}}>
            <div style={{display:"inline-block"}}>
              <CardFront card={result.card} isReversed={result.isReversed} size={130}/>
            </div>
            <div style={{marginTop:14}}>
              <p style={{fontSize:15,fontWeight:700,color:result.isReversed?"#FF7675":G,margin:"0 0 3px"}}>
                {result.card.name}{result.isReversed?" (역방향)":""}
              </p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{result.card.en}</p>
            </div>
          </div>
          <div style={{background:DG,borderRadius:14,padding:"16px",marginBottom:10}}>
            <p style={{fontSize:10,color:G,letterSpacing:2,margin:"0 0 10px"}}>✦ 오늘의 카드 메시지</p>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:24}}>{result.isGood?"☀️":"🌙"}</span>
              <p style={{fontSize:15,fontWeight:700,color:result.isGood?"#5FC49E":"#FF9AA2",margin:0}}>
                {result.isGood?"좋은 기운의 날":"주의가 필요한 날"}
              </p>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.85,margin:"0 0 12px"}}>{result.reading}</p>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px"}}>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:"0 0 4px",letterSpacing:1}}>카드 키워드</p>
              <p style={{fontSize:12,color:G,fontWeight:600,margin:0}}>{result.card.keyword}</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",marginBottom:10,textAlign:"center"}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>🌙 내일 자정이 지나면 새로운 카드가 뽑혀요</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0 0",marginTop:4}}><p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0,lineHeight:1.7}}>#천기타로 #오늘의타로 #무료타로 #조선타로</p><p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0,fontWeight:600}}>🌐 천기.kr</p></div>
          </div>
          <button onClick={()=>{setStep("intro");setActiveIdx(null);setResult(null);}} style={{
            width:"100%",padding:"14px",background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,
            fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit",
          }}>← 처음으로</button>
          <style>{`@keyframes revealCard{from{transform:rotateY(90deg) scale(0.8);opacity:0}to{transform:rotateY(0) scale(1);opacity:1}}`}</style>
        </div>
      )}
      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
