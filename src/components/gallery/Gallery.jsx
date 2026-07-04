"use client";
import { useState } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16 기질도 유형 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TYPES_16 = [
  { code:"양천리강", hanja:"陽天理剛", mbti:"ENTJ", name:"청룡", emoji:"🐲", color:"#4FC3F7", shared:true,
    subtitle:"하늘을 가르는 용",
    desc:"타고난 지도자. 직관과 논리로 미래를 설계하고 강한 의지로 반드시 실현해낸다.",
    strengths:["전략적 사고","추진력","카리스마","비전 제시"],
    jobs:["CEO","정치가","전략 컨설턴트","군 지휘관"],
    match:"음지정유", weak:"상대의 감정을 놓칠 수 있어. 잠깐 멈추고 주변을 살피는 습관이 필요해." },
  { code:"양천리유", hanja:"陽天理柔", mbti:"ENTP", name:"봉황", emoji:"🦅", color:"#FF7043", shared:true,
    subtitle:"판을 뒤집는 혁명가",
    desc:"아이디어의 화신. 기존 틀을 깨고 새로운 가능성을 탐색하는 것이 본능이다.",
    strengths:["창의력","논리적 유연성","토론 능력","혁신"],
    jobs:["스타트업 창업자","발명가","방송인","마케터"],
    match:"음지정강", weak:"시작은 폭발적인데 마무리가 약해. 끝맺음을 의식적으로 챙겨봐." },
  { code:"양천정강", hanja:"陽天情剛", mbti:"ENFJ", name:"백학", emoji:"🕊️", color:"#81C784", shared:true,
    subtitle:"모든 이의 길잡이",
    desc:"사람을 이끄는 타고난 멘토. 직관으로 상대의 마음을 읽고 따뜻하게 이끌어 성장시킨다.",
    strengths:["공감 능력","리더십","소통력","헌신"],
    jobs:["교사","상담사","NGO 활동가","인사담당자"],
    match:"음지리유", weak:"남을 너무 챙기다 나 자신을 소진할 수 있어." },
  { code:"양천정유", hanja:"陽天情柔", mbti:"ENFP", name:"기린", emoji:"🦄", color:"#CE93D8", shared:true,
    subtitle:"바람처럼 왔다가는 자",
    desc:"무한한 가능성을 보는 자유로운 영혼. 사람을 사랑하고 어디서든 영감을 찾아낸다.",
    strengths:["열정","창의성","공감력","낙관주의"],
    jobs:["크리에이터","작가","배우","사회운동가"],
    match:"음지리강", weak:"현실 감각을 좀 더 챙기면 꿈이 실제로 이뤄져." },
  { code:"양지리강", hanja:"陽地理剛", mbti:"ESTJ", name:"백호", emoji:"🐯", color:"#FFB74D", shared:true,
    subtitle:"땅을 지키는 수호신",
    desc:"질서와 책임감의 상징. 현실을 정확히 파악하고 계획대로 실행하며 공동체를 굳건히 지킨다.",
    strengths:["책임감","조직력","실행력","신뢰성"],
    jobs:["관리자","법조인","군인","회계사"],
    match:"음천정유", weak:"융통성이 부족해 보일 수 있어. 때로는 예외를 허용하는 것도 지혜야." },
  { code:"양지리유", hanja:"陽地理柔", mbti:"ESTP", name:"급류", emoji:"🌊", color:"#26C6DA", shared:false,
    subtitle:"흐름을 타는 자",
    desc:"현실의 파도를 타는 행동가. 이론보다 실전, 계획보다 즉흥이 특기.",
    strengths:["즉응력","현실감각","담대함","문제 해결"],
    jobs:["스포츠 선수","응급의사","영업인","탐험가"],
    match:"음천정강", weak:"충동적 결정이 나중에 발목을 잡을 수 있어." },
  { code:"양지정강", hanja:"陽地情剛", mbti:"ESFJ", name:"대지", emoji:"🌻", color:"#A5D6A7", shared:false,
    subtitle:"모두를 품는 대지",
    desc:"공동체를 살찌우는 존재. 주변 사람들의 필요를 누구보다 먼저 알아채고 묵묵히 챙긴다.",
    strengths:["배려","사회성","책임감","화합 능력"],
    jobs:["간호사","교사","이벤트 플래너","사회복지사"],
    match:"음천리유", weak:"남의 평가에 너무 신경 쓰는 경향이 있어." },
  { code:"양지정유", hanja:"陽地情柔", mbti:"ESFP", name:"나비", emoji:"🦋", color:"#F48FB1", shared:false,
    subtitle:"세상을 꽃밭으로 만드는 자",
    desc:"삶을 축제로 만드는 사람. 현재의 아름다움을 포착하고 주변에 생기를 전파한다.",
    strengths:["유쾌함","감수성","친화력","현재 집중"],
    jobs:["연예인","플로리스트","여행가이드","뷰티 크리에이터"],
    match:"음천리강", weak:"미래 준비가 약할 수 있어." },
  { code:"음천리강", hanja:"陰天理剛", mbti:"INTJ", name:"현무", emoji:"🐢", color:"#7986CB", shared:true,
    subtitle:"천 년을 내다보는 자",
    desc:"혼자만의 우주에서 세계를 설계한다. 겉보다 훨씬 깊고 치밀한 내면을 가진 진짜 실력자.",
    strengths:["전략 수립","독립성","깊이","장기 사고"],
    jobs:["과학자","전략가","아키텍트","소설가"],
    match:"양지정유", weak:"혼자 다 하려는 경향이 있어. 사람을 믿고 의지하는 것도 전략이야." },
  { code:"음천리유", hanja:"陰天理柔", mbti:"INTP", name:"안개", emoji:"🌫️", color:"#B0BEC5", shared:false,
    subtitle:"아무도 모르는 것을 아는 자",
    desc:"진리를 향한 끝없는 여정. 세상의 작동 원리를 이해하고 싶어하며 새로운 것을 생각한다.",
    strengths:["분석력","독창성","논리","지적 호기심"],
    jobs:["철학자","수학자","게임 개발자","연구원"],
    match:"양지정강", weak:"생각이 너무 많아 실행이 늦어질 수 있어." },
  { code:"음천정강", hanja:"陰天情剛", mbti:"INFJ", name:"달빛", emoji:"🌙", color:"#9575CD", shared:false,
    subtitle:"보이지 않는 것을 보는 자",
    desc:"가장 드문 기질. 깊은 직관으로 사람의 미래를 보고 조용하지만 강한 의지로 세상을 바꾸려 한다.",
    strengths:["통찰력","이상주의","공감","의지"],
    jobs:["작가","심리치료사","종교인","사회 활동가"],
    match:"양지리유", weak:"완벽주의가 자신을 갉아먹을 수 있어." },
  { code:"음천정유", hanja:"陰天情柔", mbti:"INFP", name:"난초", emoji:"🌸", color:"#F06292", shared:false,
    subtitle:"말 없이 세상을 물들이는 자",
    desc:"내면에 거대한 서사를 품은 존재. 세상이 더 아름다워질 수 있다고 믿으며 그 믿음을 지켜나간다.",
    strengths:["감수성","창의성","신념","공감"],
    jobs:["시인","상담사","예술가","작가"],
    match:"양천리강", weak:"현실과 이상의 간극에 힘들어할 수 있어." },
  { code:"음지리강", hanja:"陰地理剛", mbti:"ISTJ", name:"바위", emoji:"🪨", color:"#78909C", shared:false,
    subtitle:"천만 년 흔들리지 않는 자",
    desc:"신뢰와 책임의 상징. 말보다 행동으로 증명하고 한번 맡은 것은 끝까지 해낸다.",
    strengths:["성실함","신뢰성","꼼꼼함","인내력"],
    jobs:["회계사","공무원","엔지니어","의사"],
    match:"양천정유", weak:"변화에 저항하는 경향이 있어." },
  { code:"음지리유", hanja:"陰地理柔", mbti:"ISTP", name:"주작", emoji:"🦜", color:"#FF8A65", shared:true,
    subtitle:"홀로 완성하는 장인",
    desc:"손으로 세상을 이해하는 장인. 말보다 기술, 감정보다 논리. 혼자서 깊이 파고드는 것이 강점.",
    strengths:["기술적 능력","냉정함","실용성","집중력"],
    jobs:["엔지니어","외과의사","파일럿","장인"],
    match:"양천정강", weak:"감정 표현이 부족해 상대가 오해할 수 있어." },
  { code:"음지정강", hanja:"陰地情剛", mbti:"ISFJ", name:"옥토", emoji:"🐇", color:"#AED581", shared:true,
    subtitle:"아무도 모르게 세상을 키우는 자",
    desc:"보이지 않는 곳에서 세상을 지탱하는 존재. 주변 사람들을 세심하게 기억하고 챙긴다.",
    strengths:["세심함","헌신","기억력","안정감"],
    jobs:["간호사","사서","교사","행정가"],
    match:"양천리유", weak:"자기 감정을 너무 눌러놓는 경향이 있어." },
  { code:"음지정유", hanja:"陰地情柔", mbti:"ISFP", name:"들꽃", emoji:"🌼", color:"#FFEE58", shared:false,
    subtitle:"조용히 피어나는 자",
    desc:"세상의 아름다움을 조용히 느끼는 예술가적 영혼. 자기만의 방식으로 세상을 표현한다.",
    strengths:["감수성","유연성","현재 집중","예술적 감각"],
    jobs:["예술가","디자이너","요리사","동물 관련 직업"],
    match:"양천리강", weak:"자신을 너무 낮추는 경향이 있어." },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12수호신 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GUARDIANS_12 = [
  { name:"봉황", hanja:"鳳凰", emoji:"🦅", color:"#FF4500", bgColor:"#3a1a0a",
    subtitle:"불꽃을 품은 재생의 새",
    element:"화(火)", ohang:"목·화",
    desc:"죽음과 재생을 반복하며 더 강해지는 불멸의 새. 열정과 창조의 기운을 상징한다.",
    power:"재생의 불꽃 — 실패를 딛고 더 강하게 부활하는 힘",
    lucky:"붉은색·주황색 물건, 남쪽 방향",
    celeb:"나폴레옹, 스티브 잡스" },
  { name:"용", hanja:"龍", emoji:"🐉", color:"#00CED1", bgColor:"#0a2a2a",
    subtitle:"하늘과 땅을 잇는 신령",
    element:"수(水)·목(木)", ohang:"목·수",
    desc:"천지를 자유롭게 오가며 변화와 권위를 상징하는 최고의 영수.",
    power:"변화의 기운 — 어떤 상황에서도 주도권을 잡는 힘",
    lucky:"청록색·금색, 동쪽·북쪽 방향",
    celeb:"이순신, 세종대왕" },
  { name:"백호", hanja:"白虎", emoji:"🐯", color:"#E0E0E0", bgColor:"#1a1a2a",
    subtitle:"서쪽을 지키는 강인한 수호자",
    element:"금(金)", ohang:"금",
    desc:"서방을 수호하는 사신 중 하나. 용맹과 정의, 흔들리지 않는 의지를 상징한다.",
    power:"수호의 방패 — 나와 소중한 것을 지키는 불굴의 힘",
    lucky:"흰색·은색, 서쪽 방향",
    celeb:"박지성, 류현진" },
  { name:"현무", hanja:"玄武", emoji:"🐢", color:"#5C6BC0", bgColor:"#1a1a3a",
    subtitle:"북쪽을 지키는 지혜의 신",
    element:"수(水)", ohang:"수",
    desc:"북방을 수호하는 거북뱀. 인내와 지혜, 장수를 상징하는 신성한 존재.",
    power:"지혜의 갑옷 — 천 년의 경험으로 쌓인 통찰력",
    lucky:"검정·남색, 북쪽 방향",
    celeb:"워렌 버핏, 반기문" },
  { name:"기린", hanja:"麒麟", emoji:"🦄", color:"#AB47BC", bgColor:"#1e0a2e",
    subtitle:"평화와 길함을 전하는 상서로운 짐승",
    element:"토(土)", ohang:"목·토",
    desc:"어진 임금이 나타날 때 등장한다는 상서로운 영수. 평화와 자유, 무한한 가능성을 상징.",
    power:"길조의 뿔 — 가는 곳마다 행운과 좋은 기운을 부르는 힘",
    lucky:"보라·금색, 중앙·사방",
    celeb:"BTS 뷔, 로빈 윌리엄스" },
  { name:"주작", hanja:"朱雀", emoji:"🦜", color:"#E53935", bgColor:"#2a0a0a",
    subtitle:"남쪽 하늘을 물들이는 불새",
    element:"화(火)", ohang:"화",
    desc:"남방을 수호하는 붉은 새. 열정과 표현력, 화려한 존재감을 상징한다.",
    power:"남방의 불꽃 — 모든 이의 시선을 사로잡는 강렬한 존재감",
    lucky:"붉은색·자주색, 남쪽 방향",
    celeb:"손흥민, 제니" },
  { name:"청룡", hanja:"靑龍", emoji:"🐲", color:"#29B6F6", bgColor:"#0a1e2a",
    subtitle:"동쪽 새벽을 깨우는 선도자",
    element:"목(木)", ohang:"목",
    desc:"동방을 수호하는 푸른 용. 새로운 시작과 추진력, 리더십을 상징한다.",
    power:"동방의 번개 — 누구보다 빠르게 새벽을 여는 선구자의 힘",
    lucky:"청색·녹색, 동쪽 방향",
    celeb:"나폴레옹, BTS RM" },
  { name:"백학", hanja:"白鶴", emoji:"🕊️", color:"#80CBC4", bgColor:"#0a2020",
    subtitle:"하늘과 땅을 오가는 현자",
    element:"금(金)·목(木)", ohang:"금·목",
    desc:"하늘과 땅을 자유롭게 오가는 신선의 벗. 지혜와 장수, 고결함을 상징한다.",
    power:"신선의 날개 — 높은 곳에서 세상을 바라보는 초월적 시각",
    lucky:"흰색·옥색, 동쪽·서쪽",
    celeb:"아이유, 오프라 윈프리" },
  { name:"흑호", hanja:"黑虎", emoji:"🖤", color:"#9C27B0", bgColor:"#1a0a2a",
    subtitle:"어둠 속에서 빛나는 신비로운 존재",
    element:"수(水)·금(金)", ohang:"금·수",
    desc:"어둠 속에서도 빛을 발하는 신비로운 흑호. 독립성과 깊은 내면의 강함을 상징.",
    power:"어둠의 눈 — 남들이 보지 못하는 것을 꿰뚫어 보는 통찰력",
    lucky:"검정·보라, 북서쪽 방향",
    celeb:"크리스토퍼 놀란, 키아누 리브스" },
  { name:"금오", hanja:"金烏", emoji:"☀️", color:"#FDD835", bgColor:"#2a2000",
    subtitle:"태양을 등에 지고 나는 황금 까마귀",
    element:"화(火)·금(金)", ohang:"화·금",
    desc:"태양 속에 산다는 세 발 달린 황금 까마귀. 풍요와 행운, 밝은 에너지를 상징.",
    power:"태양의 황금빛 — 가는 곳마다 행운과 풍요를 불러오는 빛",
    lucky:"황금색·주황색, 남쪽·중앙",
    celeb:"유재석, 박보검" },
  { name:"옥토", hanja:"玉兎", emoji:"🐇", color:"#69F0AE", bgColor:"#0a2a1a",
    subtitle:"달빛 아래 불로초를 빚는 치유자",
    element:"금(金)·수(水)", ohang:"금·수",
    desc:"달 속에서 불로초를 빚는 옥토끼. 치유와 섬세함, 끈기 있는 노력을 상징.",
    power:"달빛의 치유 — 상처 입은 것을 회복시키는 신비로운 치유의 힘",
    lucky:"초록·흰색, 서쪽·북쪽",
    celeb:"뉴진스 민지, 헤르만 헤세" },
  { name:"해태", hanja:"獬豸", emoji:"🦁", color:"#D4AC0D", bgColor:"#2a2000",
    subtitle:"도성 중앙을 지키는 광화문의 신수",
    element:"토(土)·금(金)", ohang:"토·금",
    desc:"광화문 양옆에서 도성을 수호하는 외뿔의 신수. 거짓을 꿰뚫고 사악함을 들이받는 정의의 수호자.",
    power:"진실의 외뿔 — 거짓과 위선을 한눈에 가려내는 통찰의 힘",
    lucky:"황금색·붉은색, 중앙·남쪽",
    celeb:"이국종 교수, 추신수" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 카드 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TypeCard16({ t, onClick }) {
  const hex = t.color;
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (
    <div onClick={()=>onClick(t)} style={{
      background:`rgba(${r},${g},${b},0.08)`,
      border:`1px solid rgba(${r},${g},${b},0.3)`,
      borderRadius:16, padding:"16px 14px", cursor:"pointer",
      transition:"all 0.2s", position:"relative", overflow:"hidden"
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 24px rgba(${r},${g},${b},0.25)`; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
      {t.shared && <div style={{position:"absolute",top:8,right:8,fontSize:8,color:t.color,background:`rgba(${r},${g},${b},0.15)`,padding:"2px 6px",borderRadius:10,letterSpacing:1}}>수호신공유</div>}
      <div style={{fontSize:36,marginBottom:8,filter:`drop-shadow(0 0 12px rgba(${r},${g},${b},0.6))`}}>{t.emoji}</div>
      <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>
        {t.code.split("").map((ch,i)=>(
          <span key={i} style={{fontSize:11,fontWeight:700,color:t.color,background:`rgba(${r},${g},${b},0.15)`,padding:"2px 6px",borderRadius:6}}>{ch}</span>
        ))}
      </div>
      <p style={{fontSize:14,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{t.name}형</p>
      <p style={{fontSize:10,color:t.color,margin:"0 0 6px",letterSpacing:1}}>{t.subtitle}</p>
      <p style={{fontSize:9,color:"#555",margin:"0 0 8px",letterSpacing:2}}>{t.hanja} · {t.mbti}</p>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {t.strengths.slice(0,2).map(s=>(
          <span key={s} style={{fontSize:9,padding:"2px 8px",background:`rgba(${r},${g},${b},0.1)`,border:`1px solid rgba(${r},${g},${b},0.25)`,borderRadius:10,color:t.color}}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function GuardianCard({ g, onClick }) {
  const hex = g.color;
  const r=parseInt(hex.slice(1,3),16),g2=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (
    <div onClick={()=>onClick(g)} style={{
      background:`rgba(${r},${g2},${b},0.08)`,
      border:`1px solid rgba(${r},${g2},${b},0.3)`,
      borderRadius:16, padding:"16px 14px", cursor:"pointer",
      transition:"all 0.2s"
    }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 24px rgba(${r},${g2},${b},0.25)`; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
      <div style={{fontSize:38,marginBottom:8,filter:`drop-shadow(0 0 14px rgba(${r},${g2},${b},0.7))`}}>{g.emoji}</div>
      <p style={{fontSize:14,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{g.name}</p>
      <p style={{fontSize:11,color:`rgba(${r},${g2},${b},1)`,margin:"0 0 4px"}}>{g.hanja}</p>
      <p style={{fontSize:10,color:`rgba(${r},${g2},${b},0.8)`,margin:"0 0 8px",letterSpacing:1,lineHeight:1.4}}>{g.subtitle}</p>
      <div style={{fontSize:9,color:"#555",background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"4px 8px",letterSpacing:1}}>{g.element}</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상세 모달
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Modal16({ t, onClose }) {
  const hex = t.color;
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  const matchType = TYPES_16.find(x=>x.code===t.match);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:"#0D2318",borderRadius:"24px 24px 0 0",padding:"28px 24px 48px",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 24px"}}/>

        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:60,marginBottom:8,filter:`drop-shadow(0 0 20px rgba(${r},${g},${b},0.7))`}}>{t.emoji}</div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:10}}>
            {t.code.split("").map((ch,i)=>(
              <div key={i} style={{width:36,height:36,border:`2px solid ${t.color}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:t.color,background:`rgba(${r},${g},${b},0.15)`}}>{ch}</div>
            ))}
          </div>
          <h2 style={{fontSize:26,fontWeight:700,margin:"0 0 4px"}}>{t.name}형</h2>
          <p style={{fontSize:12,color:t.color,margin:"0 0 4px",letterSpacing:1}}>{t.subtitle}</p>
          <p style={{fontSize:10,color:"#555",letterSpacing:3}}>{t.hanja} · 참고 {t.mbti}</p>
        </div>

        <div style={{background:`rgba(${r},${g},${b},0.07)`,border:`1px solid rgba(${r},${g},${b},0.2)`,borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:14,lineHeight:1.9,color:"#C8BC9A",margin:0}}>{t.desc}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:10,color:"#E8C87A",letterSpacing:3,marginBottom:10}}>✦ 핵심 강점</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {t.strengths.map(s=><span key={s} style={{fontSize:12,padding:"5px 12px",background:`rgba(${r},${g},${b},0.12)`,border:`1px solid rgba(${r},${g},${b},0.3)`,borderRadius:20,color:t.color}}>{s}</span>)}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px"}}>
            <p style={{fontSize:10,color:"#E8C87A",letterSpacing:2,marginBottom:8}}>💼 직업</p>
            {t.jobs.map(j=><p key={j} style={{fontSize:11,color:"#C8BC9A",margin:"3px 0"}}>{j}</p>)}
          </div>
          {matchType && (
            <div style={{background:"rgba(245,184,196,0.05)",border:"1px solid rgba(245,184,196,0.2)",borderRadius:14,padding:"14px",textAlign:"center"}}>
              <p style={{fontSize:10,color:"#F5B8C4",letterSpacing:2,marginBottom:8}}>♡ 궁합</p>
              <div style={{fontSize:28}}>{matchType.emoji}</div>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"4px 0 2px"}}>{matchType.name}형</p>
              <p style={{fontSize:9,color:matchType.color}}>{matchType.code}</p>
            </div>
          )}
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",marginBottom:20}}>
          <p style={{fontSize:10,color:"#A89A6A",letterSpacing:3,marginBottom:8}}>☽ 성장 포인트</p>
          <p style={{fontSize:13,color:"#777",lineHeight:1.8,margin:0}}>{t.weak}</p>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:14,color:"#888",cursor:"pointer"}}>닫기</button>
      </div>
    </div>
  );
}

function ModalGuardian({ g, onClose }) {
  const hex = g.color;
  const r=parseInt(hex.slice(1,3),16),g2=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:"#0D2318",borderRadius:"24px 24px 0 0",padding:"28px 24px 48px",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 24px"}}/>

        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:64,marginBottom:8,filter:`drop-shadow(0 0 24px rgba(${r},${g2},${b},0.8))`}}>{g.emoji}</div>
          <h2 style={{fontSize:28,fontWeight:700,margin:"0 0 4px"}}>{g.name}</h2>
          <p style={{fontSize:14,color:`rgba(${r},${g2},${b},1)`,margin:"0 0 4px",letterSpacing:2}}>{g.hanja}</p>
          <p style={{fontSize:11,color:`rgba(${r},${g2},${b},0.7)`,margin:"0 0 4px",letterSpacing:1}}>{g.subtitle}</p>
          <span style={{fontSize:10,color:"#555",background:"rgba(255,255,255,0.05)",padding:"3px 10px",borderRadius:10,letterSpacing:1}}>{g.element}</span>
        </div>

        <div style={{background:`rgba(${r},${g2},${b},0.07)`,border:`1px solid rgba(${r},${g2},${b},0.2)`,borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:14,lineHeight:1.9,color:"#C8BC9A",margin:0}}>{g.desc}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(${r},${g2},${b},0.2)`,borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:10,color:`rgba(${r},${g2},${b},1)`,letterSpacing:3,marginBottom:10}}>⚡ 수호 능력</p>
          <p style={{fontSize:14,fontWeight:600,color:"#F0EAD6",lineHeight:1.8,margin:0}}>{g.power}</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:10,color:"#E8C87A",letterSpacing:3,marginBottom:10}}>🍀 행운 아이템</p>
          <p style={{fontSize:13,color:"#C8BC9A",margin:0}}>{g.lucky}</p>
        </div>

        <div style={{background:"rgba(95,196,158,0.05)",border:"1px solid rgba(95,196,158,0.2)",borderRadius:14,padding:"16px",marginBottom:20}}>
          <p style={{fontSize:10,color:"#5FC49E",letterSpacing:3,marginBottom:8}}>✦ 비슷한 유명인</p>
          <p style={{fontSize:13,color:"#C8BC9A",margin:0}}>{g.celeb}</p>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:14,color:"#888",cursor:"pointer"}}>닫기</button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Gallery() {
  const [tab, setTab] = useState("16");
  const [selected16, setSelected16] = useState(null);
  const [selectedG, setSelectedG] = useState(null);
  const G = "#E8C87A";

  return (
    <div style={{minHeight:"100vh",background:"#0D2318",fontFamily:"'Noto Serif KR',serif",color:"#F0EAD6",maxWidth:430,margin:"0 auto",boxSizing:"border-box"}}>

      {/* 헤더 */}
      <div style={{padding:"32px 24px 0",textAlign:"center"}}>
        <div style={{fontSize:11,letterSpacing:6,color:G,marginBottom:6}}>天 氣 · CHUNGI</div>
        <h1 style={{fontSize:26,fontWeight:700,margin:"0 0 6px",letterSpacing:2}}>유형 갤러리</h1>
        <p style={{fontSize:12,color:"#444",margin:"0 0 24px",letterSpacing:2}}>전체 유형을 미리 탐색해보세요</p>

        {/* 탭 */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:14,padding:4,marginBottom:24}}>
          {[{id:"16",label:"🔮 기질도 16유형",sub:"양천리강 체계"},{id:"12",label:"🐉 12수호신",sub:"조선 신성 수호자"}].map(({id,label,sub})=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              flex:1,padding:"12px 8px",border:"none",cursor:"pointer",borderRadius:10,
              background:tab===id?`linear-gradient(135deg,rgba(232,200,122,0.2),rgba(196,146,42,0.1))`:"transparent",
              color:tab===id?G:"#555",transition:"all 0.2s"
            }}>
              <div style={{fontSize:12,fontWeight:tab===id?700:400,marginBottom:2}}>{label}</div>
              <div style={{fontSize:9,letterSpacing:1,opacity:0.7}}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 16유형 그리드 */}
      {tab==="16" && (
        <div style={{padding:"0 16px 40px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,padding:"0 8px"}}>
            <p style={{fontSize:11,color:"#555",margin:0}}>총 16가지 기질 유형</p>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:9,color:"#E8C87A",background:"rgba(232,200,122,0.1)",padding:"3px 8px",borderRadius:10}}>수호신공유 = 12수호신 동일 캐릭터</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {TYPES_16.map(t=><TypeCard16 key={t.code} t={t} onClick={setSelected16}/>)}
          </div>
        </div>
      )}

      {/* 12수호신 그리드 */}
      {tab==="12" && (
        <div style={{padding:"0 16px 40px"}}>
          <div style={{padding:"0 8px",marginBottom:16}}>
            <p style={{fontSize:11,color:"#555",margin:0}}>총 12가지 수호 영수 유형</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {GUARDIANS_12.map(g=><GuardianCard key={g.name} g={g} onClick={setSelectedG}/>)}
          </div>

          {/* 안내 */}
          <div style={{margin:"24px 0 0",background:"rgba(232,200,122,0.06)",border:"1px solid rgba(232,200,122,0.15)",borderRadius:16,padding:"18px 16px",textAlign:"center"}}>
            <p style={{fontSize:12,color:"#E8C87A",fontWeight:600,margin:"0 0 6px"}}>🌟 내 수호신 알아보기</p>
            <p style={{fontSize:12,color:"#666",margin:0,lineHeight:1.7}}>생년월일 입력 → 사주 + 별자리 종합 분석<br/>→ 내 수호 영수 유형 + 종합 리포트</p>
          </div>
        </div>
      )}

      {/* 하단 CTA */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"16px 24px",background:"linear-gradient(transparent,#0D0D14 40%)",boxSizing:"border-box"}}>
        <button style={{width:"100%",padding:"17px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",letterSpacing:1,boxShadow:"0 8px 24px rgba(232,200,122,0.3)"}}>
          {tab==="16"?"기질도 테스트 시작 →":"내 수호신 알아보기 →"}
        </button>
      </div>

      {/* 모달 */}
      {selected16 && <Modal16 t={selected16} onClose={()=>setSelected16(null)}/>}
      {selectedG && <ModalGuardian g={selectedG} onClose={()=>setSelectedG(null)}/>}

      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </div>
  );
}
