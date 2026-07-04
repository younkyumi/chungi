import { useState, useEffect, useRef } from "react";

const G = "#E8C87A";
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
// ── 젬순 자료 기준 Yes/No 판단표 ──
// 메이저: 정방향 Yes/Maybe/No, 역방향 Yes/Maybe/No
const YESNO_TABLE = {
  // id: [정방향, 역방향]  "Y"=Yes "M"=Maybe "N"=No
  0:["M","N"], 1:["Y","M"], 2:["M","N"], 3:["Y","M"], 4:["Y","N"],
  5:["Y","M"], 6:["Y","N"], 7:["Y","N"], 8:["Y","M"], 9:["M","N"],
  10:["Y","M"],11:["M","N"],12:["N","M"],13:["N","M"],14:["Y","M"],
  15:["N","N"],16:["N","N"],17:["Y","M"],18:["N","N"],19:["Y","Y"],
  20:["Y","N"],21:["Y","M"],
};
// 마이너: 수트별 기본 경향 + good 필드 활용
function getYesNo(card, isReversed) {
  if (card.suit === "major") {
    const tbl = YESNO_TABLE[card.id];
    if (tbl) return isReversed ? tbl[1] : tbl[0];
  }
  // 마이너: good=true → 정방향 Y/역방향 M, good=false → 정방향 M/역방향 N
  if (card.good) return isReversed ? "M" : "Y";
  return isReversed ? "N" : "M";
}

const ANSWERS = {
  "Y": {
    label: "✦ Yes",
    color: "#2E7D32",
    bg: "rgba(46,125,50,0.1)",
    border: "rgba(46,125,50,0.3)",
    emoji: "✅",
    msgs: [
      "카드가 분명하게 '예스'라고 말하고 있어요. 지금 이 방향이 맞아요. 믿고 나아가세요.",
      "걱정하지 마세요. 카드의 기운이 '된다'고 말해요. 자신감 있게 행동할 때예요.",
      "이 카드가 나왔다는 건 당신의 직관도 이미 답을 알고 있다는 뜻이에요. 그 답이 맞아요.",
      "긍정적인 기운이 강하게 흐르고 있어요. 지금 이 흐름을 타세요.",
      "카드가 '고고'라고 외치고 있어요. 두려움보다 설렘을 선택하세요.",
    ],
  },
  "M": {
    label: "✦ Maybe",
    color: "#E65100",
    bg: "rgba(230,81,0,0.08)",
    border: "rgba(230,81,0,0.25)",
    emoji: "🤔",
    msgs: [
      "카드가 '아직은 모르겠다'고 말하고 있어요. 더 많은 정보가 필요한 시기예요. 서두르지 마세요.",
      "지금 당장의 결과보다 과정이 더 중요한 시기예요. 조금 더 기다려보세요.",
      "이 카드는 내 선택과 행동에 따라 결과가 달라진다는 신호예요. 내가 만들어가는 거예요.",
      "지금 당장 단정짓기보다 열린 마음으로 상황을 지켜보세요. 시간이 답을 줄 거예요.",
      "불확실한 게 맞아요. 하지만 불확실하다고 나쁜 건 아니에요. 변수가 생길 여지가 있다는 뜻이에요.",
    ],
  },
  "N": {
    label: "✦ No",
    color: "#C62828",
    bg: "rgba(198,40,40,0.08)",
    border: "rgba(198,40,40,0.25)",
    emoji: "⚠️",
    msgs: [
      "카드가 지금은 아니라고 말하고 있어요. 이 방향보다 다른 방법을 찾아보세요.",
      "이 카드가 나왔다는 건 잠시 멈추고 돌아볼 필요가 있다는 신호예요. 강행하면 더 힘들 수 있어요.",
      "지금 당장은 원하는 결과가 오기 어려워요. 하지만 영원한 건 아니에요. 타이밍을 다시 보세요.",
      "카드가 경고를 보내고 있어요. 억지로 밀어붙이기보다 흐름에 따르는 것이 현명해요.",
      "지금 이 방향은 에너지 소모만 크고 결과가 좋지 않을 수 있어요. 방향을 점검해보세요.",
    ],
  },
};

  function pickCard(idx) {
    if (shufflePhase !== "spread") return;
    setActiveIdx(idx);
    setTimeout(() => {
      const seed = Date.now() + idx * 137;
      let s = seed >>> 0;
      const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; };
      const cardId = Math.floor(rng() * 78);
      const card = TAROT_CARDS[cardId % TAROT_CARDS.length];
      const isReversed = rng() > 0.6;
      const yesno = getYesNo(card, isReversed);
      const answerData = ANSWERS[yesno];
      const msgIdx = Math.floor(rng() * answerData.msgs.length);
      setResult({ card, isReversed, yesno, answerData, msg: answerData.msgs[msgIdx] });
      setStep("result");
    }, 500);
  }

  function reset() {
    setStep("input");
    setQuestion("");
    setResult(null);
    setActiveIdx(null);
  }

  return (
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 헤더 */}
      <div style={{background:DG,padding:"18px 16px"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:G,margin:"0 0 4px"}}>🎴 YES / NO 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",margin:0}}>고민을 입력하고 카드에게 물어보세요 · 무료</p>
      </div>

      {/* ── 입력 ── */}
      {step === "input" && (
        <div style={{padding:"20px 16px"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,margin:"0 0 18px"}}>
            마음속 질문을 떠올리고<br/>
            <span style={{color:G}}>YES 또는 NO로 답할 수 있는 질문</span>을 입력해주세요.
          </p>

          {/* 예시 질문 버튼 */}
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>예시 질문</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
            {["그 사람은 나를 좋아할까?","이직해도 될까?","지금 시작하면 성공할까?","연락해도 될까?","이 결정이 맞는 걸까?"].map(ex=>(
              <button key={ex} onClick={()=>setQuestion(ex)} style={{padding:"6px 13px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,fontSize:11,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit",transition:"0.15s"}}>
                {ex}
              </button>
            ))}
          </div>

          {/* 질문 입력창 */}
          <textarea
            value={question}
            onChange={e=>setQuestion(e.target.value.slice(0,100))}
            placeholder="질문을 입력하세요..."
            style={{width:"100%",minHeight:90,padding:"14px",background:"rgba(255,255,255,0.05)",border:`1px solid ${question?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:12,color:"#F0EAD6",fontSize:13,fontFamily:"'Noto Serif KR',serif",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.7}}
          />
          <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",textAlign:"right",margin:"4px 0 16px"}}>{question.length}/100</p>

          {/* 입력된 질문 미리보기 */}
          {question.trim() && (
            <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 4px"}}>질문</p>
              <p style={{fontSize:14,fontWeight:600,color:G,margin:0}}>"{question}"</p>
            </div>
          )}

          <button
            onClick={()=>{if(question.trim())setStep("shuffle");}}
            style={{width:"100%",padding:"16px",border:"none",borderRadius:13,cursor:question.trim()?"pointer":"default",fontSize:15,fontWeight:700,fontFamily:"inherit",background:question.trim()?`linear-gradient(135deg,${G},#C4922A)`:"rgba(255,255,255,0.08)",color:question.trim()?"#0D0D14":"rgba(255,255,255,0.3)",transition:"0.2s"}}
          >
            🃏 카드 뽑기 →
          </button>
        </div>
      )}

      {/* ── 셔플 ── */}
      {step === "shuffle" && (
        <div style={{padding:"28px 16px",textAlign:"center"}}>
          <p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>질문</p>
          <p style={{fontSize:13,color:G,fontStyle:"italic",margin:"0 0 24px"}}>"{question}"</p>

          {shufflePhase === "spinning" && (
            <>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 24px"}}>카드를 섞고 있어요...</p>
              <div style={{display:"flex",justifyContent:"center",position:"relative",height:110,marginBottom:8}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{
                    width:65,height:104,
                    background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                    borderRadius:8,border:`1.5px solid ${G}33`,
                    position:"absolute",left:`calc(50% + ${(i-1)*24}px)`,
                    animation:`sw${i} 0.7s ease-in-out infinite alternate`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <span style={{fontSize:24,filter:"brightness(0.3)"}}>🃏</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {shufflePhase === "spread" && (
            <>
              <p style={{fontSize:13,color:G,fontWeight:600,margin:"0 0 4px"}}>✨ 마음이 끌리는 카드를 선택하세요</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"0 0 20px"}}>직관을 따라 딱 하나만</p>
              <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                {Array.from({length:7}, (_,i)=>(
                  <div key={i} onClick={()=>pickCard(i)} style={{
                    width:48,height:78,
                    background: activeIdx===i ? `linear-gradient(135deg,${G},#C4922A)` : "linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                    borderRadius:7,border:`1.5px solid ${activeIdx===i?G:G+"33"}`,
                    cursor:"pointer",transition:"all 0.2s",
                    transform:activeIdx===i?"translateY(-12px) scale(1.08)":"none",
                    boxShadow:activeIdx===i?`0 10px 24px rgba(232,200,122,0.45)`:"none",
                    display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    <span style={{fontSize:18,filter:activeIdx===i?"none":"brightness(0.25)"}}>🃏</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <style>{`
            @keyframes sw0{from{transform:rotate(-18deg) translateX(-12px)}to{transform:rotate(-6deg) translateX(6px)}}
            @keyframes sw1{from{transform:rotate(0deg) translateY(-6px)}to{transform:rotate(6deg) translateY(6px)}}
            @keyframes sw2{from{transform:rotate(18deg) translateX(12px)}to{transform:rotate(6deg) translateX(-6px)}}
          `}</style>
        </div>
      )}

      {/* ── 결과 ── */}
      {step === "result" && result && (
        <div style={{padding:"20px 16px"}}>
          {/* 질문 */}
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",marginBottom:14,textAlign:"center"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:"0 0 4px",letterSpacing:2}}>질문</p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",margin:0}}>"{question}"</p>
          </div>

          {/* YES / NO / 글쎄요 */}
          <div style={{background:result.answerData.bg,border:`2px solid ${result.answerData.border}`,borderRadius:16,padding:"24px 20px",marginBottom:16,textAlign:"center"}}>
            <p style={{
              fontSize:52,fontWeight:900,color:result.answerData.color,
              margin:"0 0 10px",letterSpacing:6,
              textShadow:`0 0 30px ${result.answerData.color}66`,
            }}>
              {result.yesno}
            </p>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:0}}>{result.msg}</p>
          </div>

          {/* 카드 */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{
              width:130,height:210,margin:"0 auto 12px",
              background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
              borderRadius:10,border:`2px solid ${G}55`,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              transform:result.isReversed?"rotate(180deg)":"none",
              boxShadow:`0 0 24px rgba(232,200,122,0.2)`,
              overflow:"hidden",position:"relative",
            }}>
              <img
                src={`/tarot/joseon/${result.card.id}.png`}
                alt={result.card.name}
                style={{width:"100%",height:"100%",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
              />
              <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:12,position:"absolute",inset:0}}>
                <span style={{fontSize:36,marginBottom:8}}>🃏</span>
                <p style={{fontSize:12,color:G,fontWeight:700,textAlign:"center",margin:"0 0 4px"}}>{result.card.name}</p>
                <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",textAlign:"center",margin:0}}>{result.card.en}</p>
              </div>
              {result.isReversed && (
                <div style={{position:"absolute",top:5,right:5,fontSize:8,background:"rgba(255,100,100,0.7)",color:"#fff",padding:"2px 6px",borderRadius:6,transform:"rotate(180deg)"}}>역방향</div>
              )}
            </div>
            <p style={{fontSize:13,fontWeight:700,color:result.isReversed?"#FF7675":G,margin:"0 0 2px"}}>
              {result.card.name}{result.isReversed?" (역방향)":""}
            </p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>{result.card.en}</p>
          </div>

          {/* 키워드 */}
          <div style={{background:DG,borderRadius:13,padding:"13px",marginBottom:14}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 6px"}}>카드 키워드</p>
            <p style={{fontSize:12,color:G,fontWeight:600,margin:0}}>{result.card.keyword}</p>
          </div>

          <button onClick={reset} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:13,fontSize:14,fontWeight:700,color:"#0D0D14",cursor:"pointer",fontFamily:"inherit"}}>
            다시 물어보기
          </button>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0 0",marginTop:4}}>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기타로 #예스노타로 #핵폭타로 #지금바로답</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
          </div>
        </div>
      )}

      <style>{`::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
