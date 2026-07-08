"use client";
import { useState, useEffect, useRef } from "react";

// ━━━ 사주 계산 ━━━
const CHEONGAN=["갑","을","병","정","무","기","경","신","임","계"];
const CG_YANG_IDX=[0,2,4,6,8];
const CG_OHANG=["목","목","화","화","토","토","금","금","수","수"];
const JJ_OHANG=["수","토","목","목","토","화","화","토","금","금","토","수"];
const JJ_YANG_IDX=[2,3,6,7,10];

function getSaju(year,month,day,hour){
  const a=Math.floor((14-month)/12),y=year-a,m=month+12*a-2;
  const jd=day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  const dayCG=(jd+4)%10,dayJJ=(jd+4)%12;
  const yearCG=(year-4)%10,yearJJ=(year-4)%12;
  const monthJJ=(month+1)%12,monthCG=((((year-4)%10)%5)*2+month-1)%10;
  let hourJJ=-1,hourCG=-1;
  if(hour!=null){hourJJ=Math.floor(((hour+1)%24)/2)%12;hourCG=((dayCG%5)*2+hourJJ)%10;}
  return{year:{cg:yearCG,jj:yearJJ},month:{cg:monthCG,jj:monthJJ},day:{cg:dayCG,jj:dayJJ},hour:hourJJ>=0?{cg:hourCG,jj:hourJJ}:null,ilgan:dayCG};
}
function getOhangScore(saju){const s={목:0,화:0,토:0,금:0,수:0};const ps=[saju.year,saju.month,saju.day];if(saju.hour)ps.push(saju.hour);ps.forEach(p=>{s[CG_OHANG[p.cg]]+=2;s[JJ_OHANG[p.jj]]+=3;});return s;}
function saJuToType(saju){
  const ilgan=saju.ilgan,oh=getOhangScore(saju);
  const 기운=CG_YANG_IDX.includes(ilgan)?"양":"음";
  const 인식=(oh["목"]+oh["화"])>=(oh["토"]+oh["금"]+oh["수"])?"천":"지";
  const ilOh=CG_OHANG[ilgan];
  const 판단=(ilOh==="금"||ilOh==="수")?"리":"정";
  const ps=[saju.year,saju.month,saju.day];if(saju.hour)ps.push(saju.hour);
  let yc=0,tot=0;ps.forEach(p=>{if(CG_YANG_IDX.includes(p.cg))yc++;if(JJ_YANG_IDX.includes(p.jj))yc++;tot+=2;});
  const 생활=yc>=tot/2?"강":"유";
  return{code:기운+인식+판단+생활,기운,인식,판단,생활,ohang:oh,ilganName:CHEONGAN[ilgan]};
}

// 16기질도 + 12수호신 캐릭터 카드 (2D) 공통 경로 — page.tsx와 동일 (URL 안전)
const CHAR_CARD=(n)=>`/guardians-2D-cards/guardian-${n}.png`;

// 16 기질도 셀럽 풀 (각 10명) — 저작권 회피: 이름 + 네이버 검색
const _GIJILDO_CELEBS={
  "양천리강":["마크 저커버그","백종원","고든 램지","이병헌","스티브 잡스","김연경","짐 캐리","정주영","엠마 왓슨","박진영"],
  "음천리강":["강동원","일론 머스크","크리스토퍼 놀란","서태지","안소희","마이클 조던","미셸 오바마","나탈리 포트만","김혜수","김남길"],
  "양천정유":["BTS 뷔","이효리","로제(BLACKPINK)","조슈아","츄","로버트 다우니 Jr.","이영지","박재범","윌 스미스","홍석천"],
  "음천정유":["아이유","조니 뎁","BTS 정국","티모시 샬라메","김고은","배두나","잔나비 최정훈","톰 히들스턴","JK 롤링","신세경"],
  "양천정강":["유재석","버락 오바마","톰 크루즈","BTS 지민","임영웅","앤 해서웨이","혜리","톰 행크스","조이(레드벨벳)","김연아"],
  "음천정강":["차은우","김태리","태연","베네딕트 컴버배치","조인성","김윤석","루니 마라","레이디 가가","하정우","남궁민"],
  "양지리강":["한동훈","서장훈","김구라","고든 램지","허성태","힐러리 클린턴","이부진","정의선","제프 베조스","김종국"],
  "음지리강":["워렌 버핏","김연아","안철수","앙겔라 메르켈","조지 워싱턴","로버트 드 니로","앤서니 홉킨스","이창용","정우성","나탈리 포트만"],
  "양지리유":["도널드 트럼프","고든 램지","에디 머피","마돈나","사무엘 L. 잭슨","밀라 쿠니스","벤 애플렉","코너 맥그리거","덱스","이정재"],
  "음지리유":["이소룡","마이클 조던","클린트 이스트우드","해리슨 포드","스칼렛 요한슨","크리스틴 스튜어트","베어 그릴스","다니엘 크레이그","주우재","침착맨"],
  "양지정유":["마릴린 먼로","엘비스 프레슬리","마일리 사이러스","저스틴 비버","케이티 페리","제니퍼 로페즈","레오나르도 디카프리오","제이미 폭스","아담 리바인","홍진영"],
  "음지정유":["마이클 잭슨","프린스","리한나","데이비드 보위","브리트니 스피어스","라이언 고슬링","브래드 피트","라나 델 레이","BTS 정국","백예린"],
  "양지정강":["테일러 스위프트","제니퍼 가너","스티브 하비","앤 해서웨이","휴 잭맨","페넬로페 크루즈","타이라 뱅크스","크리스 에반스","BTS 지민","광희"],
  "음지정강":["마더 테레사","케이트 미들턴","찰스 3세","로자 파크스","비욘세","셀레나 고메즈","할리 베리","기네스 펠트로","한지민","박보검"],
  "양천리유":["토마스 에디슨","레오나르도 다빈치","월트 디즈니","사샤 바론 코헨","로버트 다우니 Jr.","쿠엔틴 타란티노","코난 오브라이언","기안84","지드래곤","침착맨"],
  "음천리유":["아인슈타인","아이작 뉴턴","찰스 다윈","마리 퀴리","빌 게이츠","에이브러햄 링컨","래리 페이지","티나 페이","시고니 위버","페이커"],
};
// ━━━ 16유형 데이터 (확장: desc_long·money·health·celeb_saju·lucky_*) ━━━
const TYPES={
  "양천리강":{hanja:"陽天理剛",mbti:"ENTJ",name:"청룡",emoji:"🐲",card:CHAR_CARD(1),color:"#5cccff",subtitle:"하늘을 가르는 용",
    desc:"타고난 지도자의 결을 품은 분이에요. 직관으로 미래를 먼저 보고 논리로 길을 설계해, 강한 의지로 반드시 실현해내는 추진력이 있어요. 무리 안에서 자연스럽게 중심이 되고, 결단이 빠르고 책임감도 강해요. 다만 너무 빨리 달려 주변이 따라오지 못할 때가 있다는 점만 기억해두면 더 멀리 갈 수 있어요.",
    desc_long:"마치 하늘을 가르는 번개처럼, 청룡의 기운을 타고난 분은 어떤 상황에서도 주도권을 놓치지 않아요. 목표가 정해지면 주변의 시선이나 방해에 흔들리지 않고 앞으로 나아가는 추진력이 있어요. 때로는 너무 빠르게 달려서 주변이 따라오지 못할 때도 있지만, 그 열정과 카리스마는 사람들을 자연스럽게 끌어당겨요.",
    strengths:["전략적 사고","추진력","카리스마","비전 제시"],
    weak:"추진력이 강한 만큼 상대의 감정을 놓치기 쉬워요. 결과를 향해 빠르게 달려가다 보니 옆 사람의 속도나 마음의 신호를 못 보고 지나칠 때가 있어요. 잠깐 멈춰서 주변을 둘러보는 습관, 한 박자 늦춰서 듣는 연습이 리더십을 더 단단하게 만들어줘요.",
    jobs:["CEO","정치가","전략 컨설턴트","군 지휘관"],
    love:"연애에서도 주도권을 자연스럽게 잡으려는 결이에요. 빠르게 결정하고 분명하게 표현하는 매력이 있지만, 상대의 속도와 침묵을 존중해줄 때 관계가 훨씬 깊어져요. 감정을 분석하기보다 그대로 받아주는 연습이 진짜 사랑의 문을 열어줘요.",
    money:"큰 그림을 보는 사주라 소소한 저축보다 과감한 투자나 사업에서 재물이 불어나요. 단, 속도를 조절하는 훈련이 필요해요.",
    health:"넘치는 에너지로 스스로를 혹사하는 경향이 있어요. 간·담 계통을 주의하고 충분한 수면이 재물운도 지켜줘요.",
    match:"음지정유",anti:"양지리강",
    celeb:"나폴레옹, 스티브 잡스, BTS RM",
    celeb_saju:"이순신 장군, 세종대왕과 같은 일간 계열로, 실행력과 비전이 시대를 바꾸는 리더상이에요.",
    lucky_num:"1, 6",lucky_color:"청색·금색",lucky_dir:"동쪽",lucky_item:"청색 수정·용 문양 액세서리"},
  "양천리유":{hanja:"陽天理柔",mbti:"ENTP",name:"봉황",emoji:"🦅",card:CHAR_CARD(2),color:"#e3734f",subtitle:"판을 뒤집는 혁명가",
    desc:"아이디어의 화신이에요. 기존 틀에 얽매이지 않고 새로운 가능성을 탐색하는 게 본능이라, 어디서든 신선한 시각을 던져요. 토론에서는 상대의 논리에서 빈틈을 찾아내는 예리함이 빛나고, 위기 상황에서 의외의 해법이 튀어나와요. 시작이 폭발적인 만큼 마무리를 의식적으로 챙기면 결과가 더 단단해져요.",
    desc_long:"죽음과 재생을 반복하는 봉황처럼, 이 기질의 분은 실패를 두려워하지 않아요. 오히려 실패에서 새로운 아이디어를 발견하는 능력이 탁월해요. 대화할 때 상대의 논리에서 허점을 찾아내는 예리함이 있어 토론에서 빛나요. 단, 마무리 짓는 힘이 시작하는 힘보다 약한 편이에요.",
    strengths:["창의력","논리적 유연성","토론 능력","혁신"],
    weak:"시작은 폭발적인데 마무리가 약한 결이에요. 새 아이디어가 자꾸 떠오르니 손에 쥔 것을 다 끝내기 전에 다음으로 넘어가기 쉬워요. 작은 것 하나라도 끝맺는 습관, 80% 완성이 100% 시작보다 가치 있다는 감각이 진짜 실력을 만들어줘요.",
    jobs:["스타트업 창업자","발명가","방송인","마케터"],
    love:"연애를 게임처럼 즐기는 경향이 있어요. 새로운 자극과 지적 대화가 매력의 핵심이지만, 그 과정에서 진심을 표현하는 게 어색할 때가 있어요. \"재밌다\" 옆에 \"소중하다\"는 말도 같이 얹어주면, 가벼웠던 관계가 깊은 인연으로 변해요.",
    money:"아이디어로 돈을 버는 스타일. 창업·콘텐츠·컨설팅 분야에서 재물이 열려요. 분산투자보다 집중이 유리해요.",
    health:"신경계와 폐 계통을 주의하세요. 생각이 많아 불면증에 주의하고, 규칙적인 유산소 운동이 도움돼요.",
    match:"음지정강",anti:"양지리유",
    celeb:"에디슨, 유재석, 일론 머스크",
    celeb_saju:"혁신가·발명가 계열 일간으로, 기존 틀을 깨는 창의적 인물들과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"붉은색·주황색",lucky_dir:"남쪽",lucky_item:"봉황 문양·붉은 계열 스톤"},
  "양천정강":{hanja:"陽天情剛",mbti:"ENFJ",name:"백학",emoji:"🕊️",card:CHAR_CARD(3),color:"#81C784",subtitle:"모든 이의 길잡이",
    desc:"사람을 이끄는 타고난 멘토예요. 직관으로 상대의 마음을 읽고 따뜻하게 이끌어 성장시키는 결을 가졌어요. 어디서든 분위기를 부드럽게 만들고, 누군가 흔들릴 때 가장 먼저 손을 내미는 존재예요. 다만 모두를 챙기다 정작 자신은 텅 비울 수 있으니, 나를 채우는 시간도 의식적으로 만들어야 해요.",
    desc_long:"소나무 사이를 노니는 백학처럼, 이 기질의 분은 어디서나 고결함과 따뜻함을 함께 지녀요. 사람의 감정을 꿰뚫어 보는 직관이 탁월하고, 그 사람이 가야 할 방향을 먼저 보는 능력이 있어요. 리더지만 군림하지 않고, 함께 성장하는 방식을 택해요.",
    strengths:["공감 능력","리더십","소통력","헌신"],
    weak:"남을 너무 챙기다 나 자신을 소진하기 쉬운 결이에요. 누군가 슬퍼하면 내 일처럼 무거워지고, 부탁을 거절하지 못해 일이 산더미가 되곤 해요. \"나도 보살핌이 필요한 사람\"이라는 사실을 잊지 마세요. 가끔은 \"오늘은 내가 먼저\"가 진짜 사랑의 시작이에요.",
    jobs:["교사","상담사","NGO 활동가","인사담당자"],
    love:"상대를 위해 모든 걸 쏟는 헌신적인 파트너예요. 작은 기념일도 기억하고, 상대의 꿈을 자기 일처럼 응원해요. 다만 너무 다 주다 보면 상대가 부담을 느낄 수 있고 나도 지칠 수 있어요. 받는 것도 사랑의 한 형태라는 걸 받아들이면, 관계가 더 균형 잡혀요.",
    money:"사람과의 신뢰를 통해 재물이 열리는 사주예요. 강요보다 자연스러운 관계에서 기회가 와요.",
    health:"심장·순환계를 주의하세요. 타인을 너무 챙기다 번아웃이 올 수 있으니 나만의 회복 루틴이 필요해요.",
    match:"음지리유",anti:"양지정강",
    celeb:"오프라 윈프리, 아이유, 오바마",
    celeb_saju:"사람의 마음을 움직이는 지도자·멘토 계열 일간과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"흰색·옥색",lucky_dir:"동쪽·서쪽",lucky_item:"백학 문양·옥 계열 액세서리"},
  "양천정유":{hanja:"陽天情柔",mbti:"ENFP",name:"기린",emoji:"🦄",card:CHAR_CARD(4),color:"#CE93D8",subtitle:"바람처럼 왔다가는 자",
    desc:"무한한 가능성을 보는 자유로운 영혼이에요. 사람을 사랑하고 어디서든 영감을 길어 올리는 결을 가졌어요. 일상의 작은 풍경에서도 의미를 찾아내고, 만나는 사람마다 따뜻한 잔여운을 남기는 매력이 있어요. 다만 꿈이 너무 많아 현실의 무게를 잊을 때가 있으니, 가능성과 실현 사이의 균형이 핵심이에요.",
    desc_long:"어진 임금이 나타날 때만 등장한다는 기린처럼, 이 기질의 분은 세상의 아름다움과 가능성을 남보다 먼저 봐요. 꽃잎이 흩날리는 곳에 있는 것처럼, 어디서든 영감을 찾아내고 사람들에게 행운을 나눠주는 존재예요. 단, 현실의 무게를 좀 더 챙기면 꿈이 더 빨리 이뤄져요.",
    strengths:["열정","창의성","공감력","낙관주의"],
    weak:"꿈은 크고 가능성은 무한한데, 현실의 디테일이 자꾸 미뤄지는 결이에요. 마감·돈·계약 같은 현실적인 것들을 \"그건 나중에\"로 미루다 기회를 놓칠 수 있어요. 일주일에 하루는 \"현실 정비의 날\"로 정해두면 꿈이 훨씬 빨리 실현돼요.",
    jobs:["크리에이터","작가","배우","사회운동가"],
    love:"사랑에 빠지면 온 우주가 그 사람이 되는 결이에요. 마음이 가는 대로 표현하고, 상대를 시인처럼 바라보는 매력이 있어요. 다만 이상화한 모습과 실제 모습의 간극에 부딪히면 크게 흔들릴 수 있으니, 환상보다 일상의 작은 순간을 사랑하는 연습이 관계를 단단하게 해요.",
    money:"예술·창작·교육 분야에서 자연스럽게 재물이 열려요. 직관을 믿되 현실적인 플랜도 하나 옆에 두세요.",
    health:"소화기 계통과 감정 기복을 주의하세요. 규칙적인 식사와 자연 속 산책이 몸과 마음을 안정시켜줘요.",
    match:"음지리강",anti:"양지정유",
    celeb:"BTS 뷔, 로빈 윌리엄스, 유재석",
    celeb_saju:"자유롭고 창의적인 예술가·활동가 계열 일간과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"보라·금색",lucky_dir:"중앙·사방",lucky_item:"기린 문양·자수정 계열"},
  "양지리강":{hanja:"陽地理剛",mbti:"ESTJ",name:"백호",emoji:"🐯",card:CHAR_CARD(5),color:"#FFB74D",subtitle:"땅을 지키는 수호신",
    desc:"질서와 책임감의 상징이에요. 현실을 정확히 파악하고 계획대로 실행하며 공동체를 굳건히 지키는 결을 가졌어요. 신뢰가 곧 자산이고, 약속을 지키는 일관성이 주변 사람들의 든든한 버팀목이 돼요. 다만 원칙이 너무 강하면 융통성이 줄어드니, 가끔은 예외를 허용하는 여유도 큰 지혜예요.",
    desc_long:"서방을 지키는 백호처럼, 이 기질의 분은 한번 맡은 것은 끝까지 지켜내요. 원칙이 있고, 체계적이고, 신뢰할 수 있는 사람이에요. 조직이나 공동체에서 자연스럽게 중심이 되고, 누군가 흔들릴 때 가장 먼저 버팀목이 돼주는 존재예요. 가끔은 너무 딱딱해 보일 수 있지만, 그게 바로 백호의 강점이에요.",
    strengths:["책임감","조직력","실행력","신뢰성"],
    weak:"원칙과 규칙을 너무 단단하게 잡고 있어 융통성이 부족해 보일 때가 있어요. \"이건 원래 이래야 해\"라는 말이 자주 나오면 주변과 거리가 생기기 쉬워요. 때로는 예외를 허용하고, 상대의 사정을 한 번 더 듣는 여유가 백호의 권위를 더 단단하게 만들어줘요.",
    jobs:["관리자","법조인","군인","회계사"],
    love:"안정적이고 믿음직한 파트너예요. 약속한 건 무조건 지키고, 한번 마음 열면 흔들리지 않는 든든함이 매력이에요. 다만 감정 표현이 무뚝뚝해 \"날 사랑하긴 하나?\" 의심받을 수 있어요. 행동만큼 말로도 표현하는 연습이 관계의 온도를 따뜻하게 유지해줘요.",
    money:"꾸준한 저축과 부동산처럼 안정적인 자산에서 재물이 쌓여요. 한번 방향이 정해지면 흔들리지 않는 게 강점이에요.",
    health:"뼈·관절·치아를 주의하세요. 금(金) 기운이 강해 호흡기도 챙겨야 해요. 과도한 책임감이 스트레스를 만드니 쉬는 것도 일이에요.",
    match:"음천정유",anti:"양천리강",
    celeb:"박지성, 반기문, 엠마 왓슨",
    celeb_saju:"이순신 장군, 세종대왕처럼 조직을 수호하고 책임지는 사주 계열과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"흰색·금색",lucky_dir:"서쪽",lucky_item:"백호 문양·흰색 수정·금속 소품"},
  "양지리유":{hanja:"陽地理柔",mbti:"ESTP",name:"급류",emoji:"🌊",card:CHAR_CARD(9),color:"#64afd1",subtitle:"흐름을 타는 자",
    desc:"현실의 파도를 타는 행동가예요. 이론보다 실전, 계획보다 즉흥이 특기인 결을 가졌어요. 위기 상황에서 가장 빛나고, 다른 사람이 머뭇거릴 때 먼저 움직이는 추진력이 매력이에요. 다만 충동적 결정이 나중에 발목을 잡을 수 있으니, 큰 결정만은 하루 더 묵혀두는 습관이 도움돼요.",
    desc_long:"격류를 맨발로 달리는 수군 무사처럼, 이 기질의 분은 상황이 어려울수록 더 빛나요. 이론보다 실전에서 강하고, 즉각적인 판단력과 담대한 행동력이 이 분의 가장 큰 무기예요. 파도가 올 때 피하는 것이 아니라 그 위에 올라타는 사람이에요.",
    strengths:["즉응력","현실감각","담대함","문제 해결"],
    weak:"충동적 결정이 나중에 발목을 잡기 쉬운 결이에요. \"일단 해보지 뭐\"가 강점이지만, 큰 계약·이직·투자에서는 그 기세가 위험으로 바뀔 수 있어요. 중요한 결정 앞에서는 24시간 미루는 룰을 만들어두면, 추진력이 진짜 실력으로 굳어져요.",
    jobs:["스포츠 선수","응급의사","영업인","탐험가"],
    love:"자극적이고 재미있는 연애를 즐기는 결이에요. 함께 모험하고 즉흥적으로 떠나는 데이트가 가장 잘 맞아요. 다만 안정과 깊이를 원하는 상대에게는 가볍게 보일 수 있으니, 가끔은 조용히 옆에 있어주는 시간도 함께 만들면 관계가 단단해져요.",
    money:"현장에서 바로 돈을 버는 스타일. 영업·유통·현장직에서 재물이 빠르게 열려요. 충동 지출만 조심하면 돼요.",
    health:"신장·방광을 주의하세요. 수(水) 기운이 강해 과로 후 갑작스러운 체력 저하에 주의해요.",
    match:"음천정강",anti:"양천리유",
    celeb:"손흥민, 헤밍웨이, 마돈나",
    celeb_saju:"스포츠·탐험·현장의 영웅들과 오행이 닮아있어요. 몸을 쓰는 분야에서 빛나는 사주예요.",
    lucky_num:"1, 6",lucky_color:"청록색·은색",lucky_dir:"북쪽",lucky_item:"파란 계열 스톤·물결 문양 액세서리"},
  "양지정강":{hanja:"陽地情剛",mbti:"ESFJ",name:"대지",emoji:"🌻",card:CHAR_CARD(10),color:"#A5D6A7",subtitle:"모두를 품는 대지",
    desc:"공동체를 살찌우는 존재예요. 주변 사람들의 필요를 누구보다 먼저 알아채고 묵묵히 챙기는 결을 가졌어요. 모임에서 분위기를 부드럽게 만들고, 작은 기념일도 잊지 않고 챙기는 따뜻함이 매력이에요. 다만 모두를 돌보다 정작 본인의 마음은 뒤로 미루기 쉬우니, 나를 위한 시간도 의식적으로 만들어야 해요.",
    desc_long:"황금 들판을 품은 농경신처럼, 이 기질의 분은 공동체 전체를 살찌우는 사람이에요. 누군가 힘들어하면 먼저 알아채고, 말보다 따뜻한 행동으로 돌봐줘요. 아무도 배고프지 않게, 아무도 소외되지 않게 — 이것이 이 분의 삶의 방식이에요.",
    strengths:["배려","사회성","책임감","화합 능력"],
    weak:"남의 평가에 너무 신경 쓰는 결이에요. 좋은 사람으로 보이고 싶어 거절을 못 하고, 작은 비난에도 마음이 흔들리기 쉬워요. \"모두에게 사랑받을 수는 없다\"는 사실을 받아들이는 순간부터, 진짜 좋아하는 사람들과 더 깊은 관계를 만들 수 있어요.",
    jobs:["간호사","교사","이벤트 플래너","사회복지사"],
    love:"사랑하는 사람을 온 힘으로 챙기는 결이에요. 상대의 작은 변화도 알아채고, 손편지·정성 도시락 같은 디테일이 매력이에요. 다만 너무 헌신하면 상대가 부담을 느낄 수 있으니, 가끔은 받는 것도 사랑의 한 형태라는 걸 받아들이면 균형이 잡혀요.",
    money:"사람들을 돌보는 서비스·교육·의료 분야에서 안정적인 재물이 쌓여요. 관계가 곧 재산이에요.",
    health:"소화기 계통과 피부를 주의하세요. 타인을 챙기느라 정작 자신의 건강을 미루는 경향이 있어요.",
    match:"음천리유",anti:"양천정강",
    celeb:"박보검, 테일러 스위프트",
    celeb_saju:"따뜻한 공동체 리더·봉사자 계열 일간과 오행이 닮아있어요.",
    lucky_num:"5, 0",lucky_color:"황토색·초록색",lucky_dir:"중앙",lucky_item:"해바라기 문양·황토 계열 소품"},
  "양지정유":{hanja:"陽地情柔",mbti:"ESFP",name:"나비",emoji:"🦋",card:CHAR_CARD(11),color:"#F48FB1",subtitle:"세상을 꽃밭으로 만드는 자",
    desc:"삶을 축제로 만드는 사람이에요. 현재의 아름다움을 포착하고 주변에 생기를 전파하는 결을 가졌어요. 어디서나 분위기를 띄우고, 우울한 사람도 함께 있으면 미소 짓게 만드는 힘이 있어요. 다만 \"지금 좋으면 됐어\"가 미래 준비를 미루게 만들 수 있으니, 작은 저축·계획 습관 하나는 꼭 만들어두면 좋아요.",
    desc_long:"꽃밭에서 춤추는 꽃의 정령처럼, 이 기질의 분은 어디서나 생기를 불어넣어요. 지금 이 순간을 온전히 즐기는 능력이 탁월하고, 주변 사람들도 자연스럽게 행복해지게 만들어요. 무대 위에 있든 일상에 있든, 이 분이 있는 곳이 곧 무대예요.",
    strengths:["유쾌함","감수성","친화력","현재 집중"],
    weak:"미래 준비가 약한 결이에요. 지금이 즐겁고 사람이 좋으니 \"내일은 내일의 태양\"으로 미루기 쉬워요. 매달 자동이체 하나, 분기별 점검 하나 같은 작은 시스템을 만들어두면 즐거움도 지키면서 미래도 챙길 수 있어요.",
    jobs:["연예인","플로리스트","여행가이드","뷰티 크리에이터"],
    love:"연애할 때 온 세상이 반짝거리는 결이에요. 표현이 풍부하고 매일을 기념일처럼 만드는 매력이 있어요. 다만 흥미가 식으면 빠르게 식상해질 수 있으니, 일상의 평범한 순간도 함께 즐기는 연습이 관계를 길게 만들어줘요.",
    money:"엔터테인먼트·뷰티·여행 분야에서 재물이 열려요. 지금의 즐거움도 중요하지만 미래 저축 습관을 만들어가면 더 좋아요.",
    health:"심장과 소장을 주의하세요. 과도한 자극 추구가 에너지를 과소비할 수 있어요. 규칙적인 수면이 최고의 개운법이에요.",
    match:"음천리강",anti:"양천정유",
    celeb:"제니, 마릴린 먼로, 엘튼 존",
    celeb_saju:"무대 위에서 빛나는 예술가·연예인 계열과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"분홍·보라",lucky_dir:"남쪽",lucky_item:"나비 문양·핑크 계열 크리스탈"},
  "음천리강":{hanja:"陰天理剛",mbti:"INTJ",name:"현무",emoji:"🐢",card:CHAR_CARD(6),color:"#7986CB",subtitle:"천 년을 내다보는 자",
    desc:"혼자만의 우주에서 세계를 설계하는 결이에요. 겉보다 훨씬 깊고 치밀한 내면을 가진 진짜 실력자예요. 말수는 적어도 이미 열 수 앞을 보고 있고, 다른 사람이 \"이렇게 될 줄이야\" 할 때 혼자 미소 짓는 분이에요. 다만 너무 혼자 짊어지면 외로워지니, 사람을 믿고 의지하는 것도 큰 전략이에요.",
    desc_long:"팔괘와 별자리가 새겨진 거북처럼, 이 기질의 분은 등 뒤에 우주의 지도를 품고 있어요. 말수는 적지만 이미 열 수 앞을 보고 있고, 다른 사람들이 실패한 후에야 이해하는 전략을 혼자 처음부터 알고 있어요. 고독해 보이지만 가장 치밀하고 깊은 사람이에요.",
    strengths:["전략 수립","독립성","깊이","장기 사고"],
    weak:"혼자 다 하려는 경향이 강한 결이에요. \"내가 하면 더 빠르고 정확해\"가 결국 번아웃과 고립을 부를 수 있어요. 신뢰할 수 있는 한 사람에게라도 작은 일부터 위임하는 연습이 진짜 리더십을 만들어줘요.",
    jobs:["과학자","전략가","아키텍트","소설가"],
    love:"좀처럼 마음을 열지 않지만 한번 열리면 평생 헌신하는 결이에요. 깊이 있는 대화와 지적 교감이 사랑의 핵심이고, 한 명에게 집중하는 진정성이 매력이에요. 다만 감정 표현이 늦어 오해받기 쉬우니, 마음에 든 순간 작은 표현이라도 시작하는 게 관계를 살려요.",
    money:"장기 투자·부동산·전문직에서 조용하지만 단단하게 재물이 쌓여요. 조급함을 내려놓으면 더 빨리 이뤄져요.",
    health:"신장·방광·척추를 주의하세요. 과도한 고독이 면역력을 낮출 수 있어요. 햇빛을 충분히 쬐는 게 도움돼요.",
    match:"양지정유",anti:"음지리강",
    celeb:"니체, 크리스토퍼 놀란, 일론 머스크",
    celeb_saju:"조용하지만 세상을 바꾸는 전략가·학자 계열 일간과 오행이 닮아있어요.",
    lucky_num:"1, 6",lucky_color:"남색·은색",lucky_dir:"북쪽",lucky_item:"현무 문양·블랙 토르말린·별자리 아이템"},
  "음천리유":{hanja:"陰天理柔",mbti:"INTP",name:"안개",emoji:"🌫️",card:CHAR_CARD(12),color:"#99a3a8",subtitle:"아무도 모르는 것을 아는 자",
    desc:"진리를 향한 끝없는 여정을 걷는 분석가예요. 세상의 작동 원리를 이해하고 싶어하는 결을 가졌어요. 누구도 보지 못한 연결고리를 찾아내고, 당연한 것에도 \"왜?\"를 던지는 지적 호기심이 매력이에요. 다만 생각이 너무 많아 실행이 늦어질 수 있으니, 70% 확신에서 일단 시작하는 연습이 도움돼요.",
    desc_long:"산속 깊은 안개처럼, 이 기질의 분은 존재 자체가 신비로워요. 나이를 알 수 없는 도인처럼, 세상의 원리를 혼자 탐구하며 아무도 생각하지 못한 연결고리를 찾아내요. 정답을 찾는 것보다 올바른 질문을 던지는 게 더 중요하다는 것을 아는 사람이에요.",
    strengths:["분석력","독창성","논리","지적 호기심"],
    weak:"생각이 너무 많아 실행이 늦어지는 결이에요. \"좀 더 분석한 뒤에\"가 1년 미루기로 이어질 수 있어요. 작은 실행을 빨리 해보고 데이터를 모으는 방식 — 완벽한 분석보다 빠른 실험이 답에 더 가까워지는 길이에요.",
    jobs:["철학자","수학자","게임 개발자","연구원"],
    love:"이론으로는 완벽한 연애를 구상하지만 표현이 서툰 결이에요. 머릿속에서는 \"이런 데이트는 어떨까\" 그림이 다 그려져 있는데 실제로는 어색하게 끝날 때가 있어요. 완벽한 표현을 기다리지 말고 \"오늘 너 생각 났어\" 같은 짧은 한마디부터 시작하면, 마음이 자연스럽게 흘러가요.",
    money:"IT·연구·분석 분야에서 전문성이 곧 재물이에요. 아이디어를 실행으로 옮기는 파트너와 함께하면 더 빠르게 성장해요.",
    health:"신경계와 호흡기를 주의하세요. 지나친 고민이 몸을 긴장시켜요. 명상이나 자연 속 산책이 최고의 개운법이에요.",
    match:"양지정강",anti:"음지리유",
    celeb:"아인슈타인, 빌 게이츠, 다윈",
    celeb_saju:"인류의 지식을 바꾼 학자·발명가 계열과 오행이 닮아있어요.",
    lucky_num:"1, 6",lucky_color:"회색·은색",lucky_dir:"북쪽·서쪽",lucky_item:"회색 계열 스톤·철학서·퍼즐"},
  "음천정강":{hanja:"陰天情剛",mbti:"INFJ",name:"달빛",emoji:"🌙",card:CHAR_CARD(13),color:"#856fab",subtitle:"보이지 않는 것을 보는 자",
    desc:"16가지 기질 중 가장 드문 결이에요. 깊은 직관으로 사람의 미래를 보고, 조용하지만 강한 의지로 세상에 변화를 만들어내는 분이에요. 말 한마디로 상대의 진심을 꿰뚫는 통찰력이 매력이고, 묵묵히 자기 길을 가는 단단함이 특별해요. 다만 이상이 너무 높아 완벽주의가 자신을 갉아먹을 수 있으니 주의해야 해요.",
    desc_long:"보름달 앞에 선 달의 선녀처럼, 이 기질의 분은 남이 보지 못하는 것을 봐요. 말 한마디로 상대의 진심을 꿰뚫고, 조용하지만 포기하지 않는 강한 의지로 세상에 변화를 만들어요. 16가지 기질 중 가장 드물고, 그만큼 특별한 사명감을 지닌 분이에요.",
    strengths:["통찰력","이상주의","공감","의지"],
    weak:"완벽주의가 자신을 갉아먹을 수 있는 결이에요. 이상과 현실의 간극이 클수록 스스로 더 가혹해지고, \"아직 부족해\"가 번아웃을 부를 수 있어요. 70% 결과도 충분히 가치 있다는 사실을 받아들이는 순간부터, 진짜 변화가 시작돼요.",
    jobs:["작가","심리치료사","종교인","사회 활동가"],
    love:"영혼의 연결을 원하는 결이에요. 가벼운 만남보다 진짜 이해해주는 한 명을 갈망해요. 다만 이상형이 명확해 현실에서 그 사람을 못 만날까 두려워하는 경향이 있으니, 완벽한 사람을 기다리기보다 함께 자라갈 사람을 알아보는 눈이 필요해요.",
    money:"상담·치유·예술 분야에서 영혼이 담긴 재물이 열려요. 진정성이 곧 재물의 원천이에요.",
    health:"면역계와 림프계를 주의하세요. 이상과 현실 사이의 긴장이 몸에 나타나요. 창작 활동이 최고의 스트레스 해소법이에요.",
    match:"양지리유",anti:"음지정강",
    celeb:"달라이 라마, 넬슨 만델라",
    celeb_saju:"조용히 세상을 바꾼 정신적 지도자 계열과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"은색·보라색",lucky_dir:"서쪽·북쪽",lucky_item:"달빛 문양·자수정·야광 아이템"},
  "음천정유":{hanja:"陰天情柔",mbti:"INFP",name:"난초",emoji:"🌸",card:CHAR_CARD(14),color:"#F06292",subtitle:"말 없이 세상을 물들이는 자",
    desc:"내면에 거대한 서사를 품은 존재예요. 세상이 더 아름다워질 수 있다고 믿는 결을 가졌어요. 말하지 않아도 존재 자체로 분위기를 물들이고, 글·그림·음악으로 표현될 때 사람들의 마음을 깊이 울려요. 다만 이상이 너무 높아 현실과의 간극에 자주 힘들어하니, 작은 성취를 기록하는 습관이 큰 위로가 돼요.",
    desc_long:"툇마루에 앉아 난초를 그리는 문인처럼, 이 기질의 분은 말하지 않아도 존재 자체로 세상을 물들여요. 내면에 누구도 모르는 거대한 이야기를 품고 있고, 그것이 예술·글·음악으로 표현될 때 사람들의 마음을 울려요. 이상과 현실 사이의 간극이 때로는 힘들지만, 그 깊이가 이 분의 가장 큰 보물이에요.",
    strengths:["감수성","창의성","신념","공감"],
    weak:"현실과 이상의 간극에 힘들어하는 결이에요. 마음 속 그림이 너무 선명해서 현실의 평범함이 답답하게 느껴질 수 있어요. 일상의 작은 아름다움을 의식적으로 찾는 연습 — 매일 한 가지 감사 기록 같은 — 이 마음의 균형을 잡아줘요.",
    jobs:["시인","상담사","예술가","작가"],
    love:"깊고 낭만적인 사랑을 꿈꾸는 결이에요. 운명적 만남, 영혼의 교감을 갈망하고 한번 빠지면 시처럼 표현해요. 다만 이상화가 깨지면 크게 흔들리니, 상대를 환상이 아닌 사람 그대로 받아들이는 연습이 진짜 사랑을 지켜줘요.",
    money:"창작·예술·교육 분야에서 진정성이 재물로 이어져요. 자신의 가치를 낮추지 않는 연습이 필요해요.",
    health:"소화기와 감정 소화를 주의하세요. 감정을 억누르면 몸이 먼저 신호를 보내요. 일기 쓰기가 최고의 건강법이에요.",
    match:"양천리강",anti:"음지정유",
    celeb:"헤르만 헤세, 뉴진스 민지",
    celeb_saju:"감수성으로 시대를 물들인 예술가·문인 계열과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"연분홍·연보라",lucky_dir:"동쪽",lucky_item:"난초 문양·로즈쿼츠·향기 아이템"},
  "음지리강":{hanja:"陰地理剛",mbti:"ISTJ",name:"바위",emoji:"🪨",card:CHAR_CARD(15),color:"#78909C",subtitle:"천만 년 흔들리지 않는 자",
    desc:"신뢰와 책임의 상징이에요. 말보다 행동으로 증명하고, 한번 맡은 것은 끝까지 해내는 결을 가졌어요. 약속을 지키는 일관성이 주변의 든든한 버팀목이 되고, 검증된 것만 믿는 지혜로움이 매력이에요. 다만 변화에 저항하는 경향이 있어, 가끔은 새로운 시도를 허락하는 유연함이 필요해요.",
    desc_long:"돌하르방과 산신령이 합쳐진 것처럼, 이 기질의 분은 천만 년이 지나도 흔들리지 않는 존재예요. 한번 약속하면 끝까지 지키고, 말보다 행동이 먼저예요. 변화를 싫어하는 것처럼 보이지만, 사실은 검증된 것만 믿는 지혜로운 분이에요.",
    strengths:["성실함","신뢰성","꼼꼼함","인내력"],
    weak:"변화에 저항하는 경향이 강한 결이에요. \"지금 이대로도 괜찮은데\"가 새 기회를 놓치게 만들 수 있어요. 작은 변화부터 — 출근길 한 정거장 일찍 내리기, 새 카페 한 곳 도전하기 — 시작하면, 큰 변화 앞에서도 흔들리지 않는 단단함이 만들어져요.",
    jobs:["회계사","공무원","엔지니어","의사"],
    love:"말없이 옆에 있어주는 든든한 파트너예요. 화려한 이벤트보다 매일 같은 시간 같은 자리에서 기다려주는 한결같음이 매력이에요. 다만 무뚝뚝해 보일 수 있으니 \"고마워\" \"좋아해\" 같은 짧은 표현 한 마디씩 더해주면, 따뜻함이 상대에게 잘 전해져요.",
    money:"안정적인 직업과 저축에서 차근차근 재물이 쌓여요. 부동산·채권 같은 안정형 자산이 맞아요.",
    health:"뼈·관절·피부를 주의하세요. 변화를 거부하는 심리가 몸을 굳게 만들어요. 스트레칭이 최고의 개운법이에요.",
    match:"양천정유",anti:"음천리강",
    celeb:"워렌 버핏, 류현진",
    celeb_saju:"묵묵히 한 길을 가다 정상에 오른 장인·전문가 계열과 오행이 닮아있어요.",
    lucky_num:"5, 0",lucky_color:"회청색·흰색",lucky_dir:"중앙·북쪽",lucky_item:"바위 문양·그레이 스톤·철제 소품"},
  "음지리유":{hanja:"陰地理柔",mbti:"ISTP",name:"주작",emoji:"🦜",card:CHAR_CARD(7),color:"#d1473d",subtitle:"홀로 완성하는 장인",
    desc:"손으로 세상을 이해하는 장인이에요. 말보다 기술, 감정보다 논리가 먼저인 결을 가졌어요. 혼자서도 완성도 높은 결과물을 만들어내고, 손끝에서 나오는 결과가 모든 말을 대신해요. 다만 감정 표현이 부족해 상대가 오해할 수 있으니, 가끔은 결과 옆에 마음의 한 줄도 함께 보여주면 더 깊은 인정을 받아요.",
    desc_long:"남방을 지키는 주작처럼, 이 기질의 분은 혼자서도 완성도 높은 결과물을 만들어내요. 말이 많지 않아도 손끝에서 나오는 결과가 다 말해줘요. 장인 정신이 강하고, 혼자 깊이 파고드는 집중력이 이 분의 가장 강력한 무기예요.",
    strengths:["기술적 능력","냉정함","실용성","집중력"],
    weak:"감정 표현이 부족해 상대가 오해하기 쉬운 결이에요. \"굳이 말로 안 해도 알 텐데\"가 관계에서 가장 큰 함정이에요. 짧게라도 \"고마워\" \"미안\" \"좋아\"를 입으로 직접 꺼내는 연습이, 실력만큼 사람도 잘 다루는 진짜 장인을 만들어줘요.",
    jobs:["엔지니어","외과의사","파일럿","장인"],
    love:"말보다 행동으로 사랑하는 결이에요. 차 정비·요리·고장 수리 — 손으로 해결할 수 있는 모든 것이 사랑의 표현이에요. 다만 \"왜 너는 사랑한다 말 안 해?\"라는 물음에 답할 준비도 필요해요. 행동 옆에 짧은 말 한마디면, 사랑이 두 배로 전해져요.",
    money:"기술·전문직에서 실력으로 재물이 열려요. 한 가지를 깊이 파는 스페셜리스트가 재물의 지름길이에요.",
    health:"허리·관절을 주의하세요. 한 자세로 오래 집중하는 습관이 몸을 굳게 해요. 주기적인 스트레칭이 필수예요.",
    match:"양천정강",anti:"음천리유",
    celeb:"키아누 리브스, 미야자키 하야오",
    celeb_saju:"말보다 작품으로 시대를 남긴 장인·예술가 계열과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"진홍·금색",lucky_dir:"남쪽",lucky_item:"주작 문양·붉은 계열 스톤·공구·악기"},
  "음지정강":{hanja:"陰地情剛",mbti:"ISFJ",name:"옥토",emoji:"🐇",card:CHAR_CARD(8),color:"#AED581",subtitle:"아무도 모르게 세상을 키우는 자",
    desc:"보이지 않는 곳에서 세상을 지탱하는 존재예요. 세심하게 기억하고 챙기는 결을 가졌어요. 상대의 작은 디테일까지 다 기억하고, 누군가 무너질 때 가장 먼저 옆에서 받쳐주는 따뜻함이 매력이에요. 다만 자기 감정은 너무 눌러놓는 경향이 있으니, 본인 마음도 정성껏 들여다보는 시간을 꼭 만들어야 해요.",
    desc_long:"달빛 아래 불로초를 빚는 옥토끼처럼, 이 기질의 분은 아무도 보지 않는 곳에서 가장 정성스러운 일을 해요. 상대의 작은 것도 기억하고, 말없이 챙겨주는 것이 이 분의 사랑 방식이에요. 보이지 않지만 없으면 세상이 유지되지 않는, 가장 중요한 존재예요.",
    strengths:["세심함","헌신","기억력","안정감"],
    weak:"자기 감정을 너무 눌러놓는 결이에요. \"내가 참으면 모두 편한데\"가 결국 본인을 가장 무겁게 만들어요. 일주일에 한 번이라도 \"오늘 나는 이게 힘들었어\"를 일기든 가까운 사람이든 표현하는 연습 — 그게 헌신을 더 길게 가져갈 수 있게 해줘요.",
    jobs:["간호사","사서","교사","행정가"],
    love:"상대가 뭘 좋아하는지 다 기억하고 챙겨주는 최고의 파트너예요. 작은 기념일·취향·말버릇까지 다 기억하는 디테일이 매력이에요. 다만 본인이 받고 싶은 것은 표현하지 않아 서운함이 쌓일 수 있어요. \"나는 이게 좋아\"를 말하는 연습이 관계의 균형을 잡아줘요.",
    money:"교육·의료·행정 분야에서 안정적인 재물이 쌓여요. 꾸준함이 재물의 원천이에요.",
    health:"소화기와 면역계를 주의하세요. 자신의 감정을 억누르면 몸이 먼저 반응해요. 나 자신을 먼저 챙기는 것이 최고의 개운법이에요.",
    match:"양천리유",anti:"음천정강",
    celeb:"비욘세, 케이트 미들턴",
    celeb_saju:"보이지 않는 곳에서 세상을 지탱하는 헌신적인 리더 계열과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"연두·흰색",lucky_dir:"서쪽·북쪽",lucky_item:"달토끼 문양·옥 계열·약초 관련 아이템"},
  "음지정유":{hanja:"陰地情柔",mbti:"ISFP",name:"들꽃",emoji:"🌼",card:CHAR_CARD(16),color:"#f2d97e",subtitle:"조용히 피어나는 자",
    desc:"세상의 아름다움을 조용히 느끼는 예술가적 영혼이에요. 주목받지 않아도 자기만의 방식으로 세상을 아름답게 만드는 결을 가졌어요. 남들이 지나치는 것에서 의미를 찾아내고, 표현이 조용하지만 가장 깊게 마음을 울리는 매력이 있어요. 다만 자신을 너무 낮추는 경향이 있으니, 본인의 가치를 더 당당하게 인정하는 연습이 필요해요.",
    desc_long:"아무도 없는 들판에서 혼자 피어나는 야생화처럼, 이 기질의 분은 주목받지 않아도 자기만의 방식으로 세상을 아름답게 만들어요. 남들이 지나치는 것에서 아름다움을 찾아내고, 그것을 표현하는 방식이 조용하지만 가장 깊게 마음을 울려요.",
    strengths:["감수성","유연성","현재 집중","예술적 감각"],
    weak:"자신을 너무 낮추는 결이에요. \"나는 그 정도는 아니야\"가 진짜 좋은 기회를 놓치게 만들어요. 누군가 칭찬할 때 \"감사합니다\"로 받아들이는 연습 — 거절하지 않는 작은 변화가 자존감의 토대를 단단하게 만들어줘요.",
    jobs:["예술가","디자이너","요리사","동물 관련 직업"],
    love:"조용하지만 깊은 사랑을 주는 결이에요. 화려한 표현보다 매일의 작은 정성으로 사랑을 보여주는 매력이 있어요. 다만 본인의 욕구를 표현하지 않아 상대가 \"내가 잘하고 있나?\"하고 불안해할 수 있으니, \"이게 좋아\" \"여기 가고 싶어\"같은 솔직한 표현도 함께 연습해보세요.",
    money:"예술·디자인·요리 분야에서 감성이 재물로 이어져요. 자신의 가치를 더 높이 평가하는 연습이 필요해요.",
    health:"신장과 피부를 주의하세요. 감정 표현이 억눌리면 피부로 나타나요. 예술 활동이 최고의 치유법이에요.",
    match:"양천리강",anti:"음천정유",
    celeb:"반 고흐, 마이클 잭슨, 프리다 칼로",
    celeb_saju:"조용히 시대를 물들인 예술가 계열과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"노랑·연두",lucky_dir:"동쪽",lucky_item:"들꽃 문양·시트린·드로잉 용품"},
};

const DIFF={
  기운:{"양→음":{title:"타고난 양기를 감추고 살아왔어요",msg:"외향적 에너지를 타고났지만 내향적으로 살아왔어요. 원래의 활기찬 자신을 표현할 공간을 만들어보세요."},"음→양":{title:"타고난 음기보다 더 활발하게 살아왔어요",msg:"본래 내향적 기질인데 외향적으로 살아왔어요. 혼자 충전하는 시간을 꼭 확보하세요."}},
  인식:{"천→지":{title:"타고난 직관을 억누르고 살아왔어요",msg:"직관적 감각을 타고났지만 현실적으로 살아왔어요. 때로는 첫 느낌을 더 믿어보세요."},"지→천":{title:"타고난 감각보다 더 직관적으로 살아왔어요",msg:"현실 감각이 강한 기질인데 직관에 의존해 왔어요. 데이터와 경험도 함께 챙겨보세요."}},
  판단:{"리→정":{title:"타고난 논리를 감추고 감성으로 살아왔어요",msg:"이성적 판단력을 타고났지만 감성적으로 살아왔어요. 당신의 논리적 판단을 믿어도 돼요."},"정→리":{title:"타고난 감성을 억누르고 논리로 살아왔어요",msg:"감성적 기질인데 이성적으로 살아왔어요. 감정을 표현하는 연습을 해보세요."}},
  생활:{"강→유":{title:"타고난 계획성을 내려놓고 살아왔어요",msg:"계획적 기질인데 유연하게 살아왔어요. 작은 것부터 계획하고 실행하는 습관을 만들어보세요."},"유→강":{title:"타고난 유연함을 억누르고 살아왔어요",msg:"유연한 기질인데 계획에 얽매여 살아왔어요. 때로는 즉흥도 허락해보세요."}},
};

const AXIS_ORDER=["기운","인식","판단","생활"];
const AXIS_PAIRS={"기운":["양","음"],"인식":["천","지"],"판단":["리","정"],"생활":["강","유"]};
const AXIS_HANJA_SHORT={"기운":"氣運(기운)","인식":"認識(인식)","판단":"判斷(판단)","생활":"生活(생활)"};
const AXIS_DESC={"기운":"양(외향)·음(내향)","인식":"천(직관)·지(감각)","판단":"리(이성)·정(감성)","생활":"강(계획)·유(유연)"};

const QUESTIONS=[
  {id:1,axis:"기운",text:"주말에 아무 계획 없을 때 나는...",a:{label:"친구한테 연락해서 뭔가 만든다",code:"양"},b:{label:"혼자 쉬면서 재충전한다",code:"음"}},
  {id:2,axis:"기운",text:"처음 만나는 사람들 모임에 가면...",a:{label:"먼저 말 걸고 자연스럽게 섞인다",code:"양"},b:{label:"분위기 파악하면서 천천히 적응한다",code:"음"}},
  {id:3,axis:"기운",text:"힘든 일이 있을 때 에너지 회복은...",a:{label:"누군가와 이야기하면서 풀린다",code:"양"},b:{label:"혼자 조용히 생각 정리하는 시간이 필요하다",code:"음"}},
  {id:4,axis:"기운",text:"파티나 모임에서 나는...",a:{label:"마지막까지 남아서 분위기를 이끈다",code:"양"},b:{label:"적당히 있다가 조용히 빠져나온다",code:"음"}},
  {id:5,axis:"기운",text:"칭찬받았을 때 나는...",a:{label:"기쁨을 표현하고 주변에 공유한다",code:"양"},b:{label:"혼자 조용히 뿌듯해한다",code:"음"}},
  {id:6,axis:"기운",text:"오랜만에 혼자 있는 시간이 생기면...",a:{label:"좀 답답하고 누군가에게 연락하고 싶다",code:"양"},b:{label:"너무 좋다. 이런 시간이 필요했다",code:"음"}},
  {id:7,axis:"기운",text:"새로운 환경에 처음 갔을 때...",a:{label:"빠르게 사람들을 사귀고 적응한다",code:"양"},b:{label:"시간이 좀 걸리지만 깊은 관계를 만든다",code:"음"}},
  {id:8,axis:"기운",text:"전화 통화보다 카톡을 선호하는 이유...",a:{label:"실시간 대화가 더 재밌어서",code:"양"},b:{label:"생각 정리하고 답할 수 있어서",code:"음"}},
  {id:9,axis:"기운",text:"스트레스를 받을 때 주변 사람들은...",a:{label:"티가 나서 대부분 알고 있다",code:"양"},b:{label:"잘 모른다. 혼자 삭히는 편이다",code:"음"}},
  {id:10,axis:"기운",text:"이상적인 생일 파티는...",a:{label:"친구들 많이 불러서 왁자지껄하게",code:"양"},b:{label:"가까운 1~2명이랑 조용하게",code:"음"}},
  {id:11,axis:"인식",text:"새로운 아이디어가 떠올랐을 때...",a:{label:"될 것 같은 느낌을 믿고 밀어붙인다",code:"천"},b:{label:"실제로 가능한지 따져보고 진행한다",code:"지"}},
  {id:12,axis:"인식",text:"책을 고를 때 나는...",a:{label:"현실에 없는 세계, 가능성을 다룬 책",code:"천"},b:{label:"실용적이고 바로 써먹을 수 있는 책",code:"지"}},
  {id:13,axis:"인식",text:"처음 만난 사람의 인상은...",a:{label:"첫인상 느낌이 거의 맞다",code:"천"},b:{label:"몇 번 만나봐야 알 수 있다",code:"지"}},
  {id:14,axis:"인식",text:"내가 더 신뢰하는 것은...",a:{label:"직감과 영감",code:"천"},b:{label:"경험과 데이터",code:"지"}},
  {id:15,axis:"인식",text:"대화할 때 나는...",a:{label:"비유, 가능성, 큰 그림 이야기를 좋아한다",code:"천"},b:{label:"구체적인 사실과 현실 이야기를 좋아한다",code:"지"}},
  {id:16,axis:"인식",text:"여행 계획을 짤 때...",a:{label:"큰 방향만 잡고 현지에서 즉흥적으로",code:"천"},b:{label:"숙소, 식당, 동선 다 미리 정한다",code:"지"}},
  {id:17,axis:"인식",text:"업무나 공부할 때...",a:{label:"왜 해야 하는지 의미와 맥락이 중요하다",code:"천"},b:{label:"어떻게 해야 하는지 방법과 순서가 중요하다",code:"지"}},
  {id:18,axis:"인식",text:"영화를 볼 때 나는...",a:{label:"메시지, 상징, 여운을 더 중요하게 본다",code:"천"},b:{label:"스토리의 현실성, 디테일이 중요하다",code:"지"}},
  {id:19,axis:"인식",text:"문제가 생겼을 때 나는...",a:{label:"이게 왜 생겼는지 근본 원인을 파고든다",code:"천"},b:{label:"일단 지금 당장 해결하는 게 먼저다",code:"지"}},
  {id:20,axis:"인식",text:"나는 주로...",a:{label:"미래의 가능성과 변화를 먼저 생각한다",code:"천"},b:{label:"지금 눈앞의 현실을 먼저 생각한다",code:"지"}},
  {id:21,axis:"판단",text:"친구가 고민을 털어놓을 때...",a:{label:"원인을 분석하고 해결책을 제시한다",code:"리"},b:{label:"먼저 공감하고 감정을 나눈다",code:"정"}},
  {id:22,axis:"판단",text:"갈등이 생겼을 때 나는...",a:{label:"논리적으로 옳고 그름을 따진다",code:"리"},b:{label:"서로 감정이 상하지 않는 방향을 찾는다",code:"정"}},
  {id:23,axis:"판단",text:"중요한 결정을 내릴 때...",a:{label:"장단점을 분석해서 최선을 고른다",code:"리"},b:{label:"내 마음이 원하는 쪽을 선택한다",code:"정"}},
  {id:24,axis:"판단",text:"누군가를 처음 평가할 때...",a:{label:"실력과 능력을 기준으로 본다",code:"리"},b:{label:"성격과 인간적인 면을 더 중요하게 본다",code:"정"}},
  {id:25,axis:"판단",text:"팀에서 의견이 충돌할 때...",a:{label:"가장 합리적인 의견이 채택되어야 한다",code:"리"},b:{label:"팀 분위기와 모두의 감정을 고려해야 한다",code:"정"}},
  {id:26,axis:"판단",text:"내가 비판을 받을 때...",a:{label:"내용이 맞는지 틀린지를 먼저 따진다",code:"리"},b:{label:"말하는 방식과 상대의 감정이 더 신경 쓰인다",code:"정"}},
  {id:27,axis:"판단",text:"친구가 잘못된 선택을 하려고 할 때...",a:{label:"왜 그게 잘못됐는지 논리적으로 설명한다",code:"리"},b:{label:"감정을 건드리지 않게 부드럽게 말린다",code:"정"}},
  {id:28,axis:"판단",text:"규칙이나 원칙에 대해...",a:{label:"예외 없이 지켜야 한다",code:"리"},b:{label:"상황에 따라 유연하게 적용해야 한다",code:"정"}},
  {id:29,axis:"판단",text:"칭찬할 때 나는...",a:{label:"구체적으로 잘한 점을 말해준다",code:"리"},b:{label:"상대가 기분 좋도록 따뜻하게 말한다",code:"정"}},
  {id:30,axis:"판단",text:"더 이해가 되는 인물은...",a:{label:"냉정하게 옳은 길을 가는 주인공",code:"리"},b:{label:"감정에 충실하게 선택하는 주인공",code:"정"}},
  {id:31,axis:"생활",text:"약속 시간에 나는...",a:{label:"항상 미리 도착해서 기다린다",code:"강"},b:{label:"딱 맞춰 오거나 약간 늦는 편이다",code:"유"}},
  {id:32,axis:"생활",text:"일을 할 때 나는...",a:{label:"미리미리 해두는 게 마음이 편하다",code:"강"},b:{label:"마감 직전에 집중력이 폭발한다",code:"유"}},
  {id:33,axis:"생활",text:"하루 일정 관리 방식은...",a:{label:"계획표를 만들고 그대로 실행한다",code:"강"},b:{label:"그때그때 기분에 맞게 유연하게",code:"유"}},
  {id:34,axis:"생활",text:"여행에서 예상 못 한 일이 생기면...",a:{label:"빨리 대안을 찾아 계획을 복구한다",code:"강"},b:{label:"오히려 재밌는 변수라 생각하고 즐긴다",code:"유"}},
  {id:35,axis:"생활",text:"방·책상 상태는 보통...",a:{label:"정리정돈이 되어 있어야 마음이 편하다",code:"강"},b:{label:"약간 어질러져도 내 나름의 질서가 있다",code:"유"}},
  {id:36,axis:"생활",text:"쇼핑할 때 나는...",a:{label:"미리 살 것을 정해두고 간다",code:"강"},b:{label:"마음에 드는 걸 즉흥적으로 산다",code:"유"}},
  {id:37,axis:"생활",text:"프로젝트를 시작할 때...",a:{label:"전체 계획과 일정을 먼저 짠다",code:"강"},b:{label:"일단 시작하면서 방향을 잡는다",code:"유"}},
  {id:38,axis:"생활",text:"마감이 있는 일을 할 때...",a:{label:"마감 훨씬 전에 끝내야 안심이 된다",code:"강"},b:{label:"마감에 맞춰 끝내면 충분하다",code:"유"}},
  {id:39,axis:"생활",text:"내 삶을 표현하는 단어는...",a:{label:"계획, 질서, 체계",code:"강"},b:{label:"자유, 유연, 즉흥",code:"유"}},
  {id:40,axis:"생활",text:"갑작스러운 일정 변경이 생기면...",a:{label:"상당히 불편하고 스트레스를 받는다",code:"강"},b:{label:"그럴 수도 있지, 하고 금방 적응한다",code:"유"}},
];

function getQType(answers){
  const sc={};Object.values(AXIS_PAIRS).flat().forEach(k=>sc[k]=0);
  answers.forEach(a=>{if(a)sc[a]++;});
  return AXIS_ORDER.map(axis=>{const[a,b]=AXIS_PAIRS[axis];return sc[a]>=sc[b]?a:b;}).join("");
}
function getWaveType(answers){
  const sc={};Object.values(AXIS_PAIRS).flat().forEach(k=>sc[k]=0);
  answers.forEach(a=>{if(a)sc[a]++;});
  const tScore=(sc["정"]||0)+(sc["유"]||0),aScore=(sc["리"]||0)+(sc["강"]||0),total=tScore+aScore;
  const tPct=total>0?Math.round((tScore/total)*100):50;
  return{type:tPct>=50?"T":"A",tPct,aPct:100-tPct};
}

// ━━━ 사전질문 ━━━
const PRE_Q1=[
  {emoji:"🧊",label:"솔로, 연애에 관심 없음"},
  {emoji:"🌱",label:"솔로, 좋은 인연을 원함"},
  {emoji:"🌸",label:"달달한 연애 중"},
  {emoji:"🍂",label:"오랜 연인 또는 결혼 고려 중"},
  {emoji:"💒",label:"결혼 중 (기혼)"},
  {emoji:"⛈️",label:"이별·상처 회복 중"},
];
const PRE_Q2=[
  {emoji:"📚",label:"학생 (중·고·대학)"},
  {emoji:"🎓",label:"취준생·고시·자격증 준비"},
  {emoji:"💼",label:"직장인·회사원"},
  {emoji:"🚀",label:"자영업·사업·프리랜서"},
  {emoji:"🏠",label:"주부·육아"},
  {emoji:"🌤️",label:"휴식·공백·은퇴 중"},
];

// v(기질도 개인화 강화): 연애/직업 사전질문 답변을 "타입 위에 얹는" 상황별 적용 조언. 타입 본문(d.love/d.jobs)은 그대로 두고 서브섹션으로만 추가
function loveSituational(d,preQ1,personName,isNature){
  const s1=d.strengths?.[0]||"이 결";
  const s2=d.strengths?.[1]||s1;
  if(!preQ1||preQ1==="skip"){
    const generic=`${d.name}형의 연애 방식은 상황과 무관하게 대체로 ${s1}을(를) 앞세우는 쪽이에요.`;
    return isNature?`본래 성향은 이런데, 지금 상황에 대입해보면 — ${generic}`:generic;
  }
  const templates={
    "솔로, 연애에 관심 없음":`지금은 연애보다 나에게 집중하는 시기네요. ${d.name}형은 혼자 있는 시간에 ${s1}이(가) 오히려 더 빛나는 타입이라, 지금처럼 스스로를 채우는 것도 잘 맞는 선택이에요.`,
    "솔로, 좋은 인연을 원함":`지금은 혼자지만, 이 기질대로라면 좋은 인연을 만났을 때 ${s1}을(를) 앞세워 마음을 여는 편이에요. 급하게 다가가기보다 이 결을 믿고 기다려도 좋아요.`,
    "달달한 연애 중":`지금 연애가 한창이신데, 이 ${s1} 성향이 상대에게는 부담이 될 수도 있으니 가끔은 한 발짝 떨어져서 숨 쉴 틈을 주는 것도 필요해요.`,
    "오랜 연인 또는 결혼 고려 중":`오래된 관계일수록 ${d.name}형 특유의 ${s1}이(가) 무뎌지기 쉬워요. 다음 단계를 고민 중이라면 처음 끌렸던 그 결을 다시 꺼내보는 게 도움이 될 거예요.`,
    "결혼 중 (기혼)":`결혼 생활에서는 ${s1}보다 ${s2}이(가) 더 자주 시험대에 오르는 편이에요. 배우자에게 이 기질을 설명해주는 것만으로도 오해가 줄어들 수 있어요.`,
    "이별·상처 회복 중":`지금은 회복이 먼저인 시기예요. ${d.name}형은 ${s1} 덕분에 아물고 나면 이전보다 더 단단한 방식으로 사랑할 수 있는 결이니, 지금은 스스로를 다그치지 마세요.`,
  };
  const body=templates[preQ1]||templates["솔로, 좋은 인연을 원함"];
  return isNature?`본래 성향은 이런데, 지금 상황에 대입해보면 — ${body}`:body;
}
function jobSituational(d,preQ2,personName){
  const s1=d.strengths?.[0]||"강점";
  const job1=d.jobs?.[0]||"관련 분야";
  if(!preQ2||preQ2==="skip"){
    return `${d.name}형은 어떤 환경에 있든 ${s1}을(를) 살릴 방법을 스스로 찾아내는 타입이에요.`;
  }
  const templates={
    "학생 (중·고·대학)":`진로를 고민할 시기라면, ${d.name}형의 ${s1}을(를) 살릴 수 있는 ${job1} 같은 분야를 눈여겨보는 것도 방법이에요.`,
    "취준생·고시·자격증 준비":`지금은 결과를 기다리는 시간이 힘들 수 있는데, ${d.name}형의 ${s1}은(는) 면접이나 서류에서 확실한 무기가 돼요. 이 강점을 자기소개서 한 줄에 녹여보세요.`,
    "직장인·회사원":`지금 조직 안에서는 ${s1}을(를) 티 나지 않게 발휘하는 게 오히려 인정받는 지름길이에요. 작은 프로젝트에서부터 이 결을 드러내 보세요.`,
    "자영업·사업·프리랜서":`지금 하는 일에 이 통찰력을 이렇게 써보세요 — ${d.name}형 특유의 ${s1}을(를) 고객과의 신뢰를 쌓는 무기로 활용하면 확실히 차별화돼요.`,
    "주부·육아":`육아나 살림 안에서도 ${s1}은(는) 그대로 발휘돼요. 아이나 가족을 대할 때 이 기질을 인지하고 있으면 스스로를 덜 다그치게 될 거예요.`,
    "휴식·공백·은퇴 중":`지금 같은 공백기는 ${d.name}형의 ${s1}을(를) 재정비할 좋은 기회예요. 다음 스텝을 정할 때 이 강점을 중심에 두고 그려보세요.`,
  };
  return templates[preQ2]||templates["직장인·회사원"];
}

// ━━━ 메인 컴포넌트 ━━━
export default function GijildoModal({onClose,selectedPerson,addHistory,cart,setCart,onGoShop,onOpenService,isLoggedIn,onLoginRequest,onRequestPerson,preloadResult=null,forceIntro=false,helpers={}}){
  const birth=selectedPerson?.birth?(()=>{
    const parts=selectedPerson.birth.replace(/[^0-9]/g,"-").split("-").filter(Boolean);
    return parts.length>=3?{year:+parts[0],month:+parts[1],day:+parts[2]}:null;
  })():null;
  const hour=selectedPerson?.time&&selectedPerson.time!=="모름"?parseInt(selectedPerson.time):null;
  const sajuInfo=selectedPerson&&birth?saJuToType(getSaju(birth.year,birth.month,birth.day,hour)):null;

  const cntKey='chungi_gijildo_count';
  const[cnt,setCnt]=useState(()=>{try{return parseInt(localStorage.getItem(cntKey)||'0');}catch{return 0;}});
  const[loading,setLoading]=useState(false);
  const[showPayDone,setShowPayDone]=useState(false);
  // preloadResult 있으면 result로 바로 (기록소 재열람)
  // v282: 뇌과학과 흐름 통일 — 인물 있으면 test → preQ → pay (매몰비용 극대화)
  const[screen,setScreen]=useState(preloadResult?"result":(forceIntro?"intro":(selectedPerson&&sajuInfo?"test":"intro")));
  const[current,setCurrent]=useState(0);
  const[answers,setAnswers]=useState(Array(40).fill(null));
  const[qType,setQType]=useState(preloadResult?.liv_code||preloadResult?.code||"");
  const[waveType,setWaveType]=useState(preloadResult?.waveType||null);
  const[selected,setSelected]=useState(null);
  const[visible,setVisible]=useState(true);
  const[resultTab,setResultTab]=useState(1); // v249: 기본 타고난 (인증서 탭 제거됨)
  const[subTab1,setSubTab1]=useState(0); // v251: 타고난 탭 하위 카테고리
  const[subTab2,setSubTab2]=useState(0); // v251: 살아온 탭 하위 카테고리
  const[preQ1,setPreQ1]=useState(null);
  const[preStep,setPreStep]=useState(1); // v298: 사전질문 단계 별도 상태 (자동진입 방지)
  const[preQ2,setPreQ2]=useState(null);
  const[showCollection,setShowCollection]=useState(false);
  const historyDoneRef=useRef(false); // v262: addHistory 1회만 호출 보장
  const[loadPct,setLoadPct]=useState(0);
  const[loadMsgIdx,setLoadMsgIdx]=useState(0);

  const progress=Math.round((current/QUESTIONS.length)*100);
  const personName=selectedPerson?.name||"나";

  // 쪽집게 도입부 생성
  function getIntroPhrase(){
    const love=preQ1||null;
    const job=preQ2||null;
    let loveStr="";
    let jobStr="";
    if(love&&love!=="skip"){
      if(love.includes("연애 중")||love.includes("달달"))loveStr="연애 중인";
      else if(love.includes("결혼"))loveStr="결혼한";
      else if(love.includes("솔로"))loveStr="솔로인";
      else if(love.includes("이별"))loveStr="상처를 회복 중인";
    }
    if(job&&job!=="skip"){
      if(job.includes("직장"))jobStr="바쁜 직장인";
      else if(job.includes("학생"))jobStr="학생";
      else if(job.includes("취준"))jobStr="취준 중인";
      else if(job.includes("자영"))jobStr="사업가";
      else if(job.includes("주부"))jobStr="주부";
      else if(job.includes("휴식"))jobStr="잠시 쉬고 있는";
    }
    const prefix=[loveStr,jobStr].filter(Boolean).join(" ");
    return prefix?`${prefix} ${personName}님,`:`${personName}님,`;
  }

  function doStart(){
    if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"gijildo",icon:"🧬",name:"기질도",desc:"",price:"980원"});onClose();return;}
    if(!sajuInfo){setScreen("needBirth");return;}
    setScreen("test"); // v282: 뇌과학과 통일 — test → preQ → pay
  }
  function pay(){setLoading(true);setTimeout(()=>{setLoading(false);setShowPayDone(true);},1600);}
  function onPayDone(){setShowPayDone(false);setScreen("loading");} // v262: 결제 후 분석중 → result

  // v262: 분석중(loading) 화면 — 게이지 + 메시지 회전, 끝나면 history 1회 호출 + result 진입 (v264: 3.5초로 통일)
  useEffect(()=>{
    if(screen!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);let pct=0;
    const iv=setInterval(()=>{
      pct=Math.min(100,pct+Math.random()*1.4+0.8);setLoadPct(Math.floor(pct));
      if(Math.random()>0.7)setLoadMsgIdx(i=>(i+1)%4);
      if(pct>=100){
        clearInterval(iv);
        setTimeout(()=>{
          if(!historyDoneRef.current&&qType&&sajuInfo){
            historyDoneRef.current=true;
            const qData=TYPES[qType]||TYPES["양천리강"];
            const sData=TYPES[sajuInfo?.code]||TYPES["양천리강"];
            const GIJILDO_CODE_TO_ID={"양천리강":1,"양천리유":2,"양천정강":3,"양천정유":4,"양지리강":5,"양지리유":6,"양지정강":7,"양지정유":8,"음천리강":9,"음천리유":10,"음천정강":11,"음천정유":12,"음지리강":13,"음지리유":14,"음지정강":15,"음지정유":16};
            addHistory?.({icon:"🧬",name:"기질도",svcId:"gijildo",person:personName,date:new Date().toLocaleDateString("ko-KR"),
              result:`${sData.emoji} ${sData.name}(${sData.mbti}) vs ${qData.emoji} ${qData.name}(${qData.mbti})`,
              resultType:{character_type:GIJILDO_CODE_TO_ID[qType]||0,type_name:qData.name,mbti:qData.mbti,subtitle:qData.subtitle,ohang:sajuInfo?.ohang,
                saju_name:sData.name,saju_mbti:sData.mbti,saju_emoji:sData.emoji,
                liv_name:qData.name,liv_mbti:qData.mbti,liv_emoji:qData.emoji,is_same:sajuInfo?.code===qType,
                liv_code:qType,code:qType,wave_type:waveType,
                _birth:selectedPerson?.birth,_time:selectedPerson?.time,
                _testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},
              ctx:{gijildo_code:qType,saju_code:sajuInfo?.code,ohaeng:CG_OHANG[sajuInfo?.code?getSaju(birth.year,birth.month,birth.day,hour).ilgan:0]}});
            try{localStorage.setItem(cntKey,String(cnt+1));setCnt(c=>c+1);}catch{}
          }
          setScreen("result");
        },300);
      }
    },80);
    return()=>clearInterval(iv);
    // v280: deps에서 sajuInfo/birth 등 객체 reference 제거 — 매 렌더마다 새 ref로 useEffect 무한 재실행되어 게이지 0% 멈추던 버그 fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen,qType]);

  function handleAnswer(code){
    if(!visible)return;
    if(selected)return; // 이미 선택됨 — 더블클릭/연속클릭 방지 (axis undefined 에러 방지)
    setSelected(code);
    setTimeout(()=>{
      const na=[...answers];na[current]=code;setAnswers(na);setSelected(null);
      if(current+1>=QUESTIONS.length){
        const qt=getQType(na);const wt=getWaveType(na);
        setQType(qt);setWaveType(wt);
        setScreen("preQ"); // v282: 테스트 끝 → 사전질문 (그 다음 결제)
      }else{setVisible(false);setTimeout(()=>{setCurrent(c=>c+1);setVisible(true);},260);}
    },280);
  }

  const ohColors={목:"#81C784",화:"#FF7043",토:"#FFB74D",금:"#B0BEC5",수:"#4FC3F7"};

  // ━━━ 설명팝업 (육각별 SVG 인트로) ━━━
  if(screen==="intro") return(
    <div className="ov"><div className="md"><div className="hd"/>
      <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
        <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div style={{background:"rgba(0,0,0,0.2)",borderRadius:16,padding:"32px 20px",border:"2px solid rgba(5,77,149,0.4)",textAlign:"center",marginBottom:12}}>
        <div style={{padding:"6px 0 14px"}}>
          <div style={{position:"relative",width:120,height:120,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",top:-4,right:-4,width:7,height:7,borderRadius:"50%",background:"#054D95",boxShadow:"0 0 8px rgba(5,77,149,0.9)",animation:"_gjFloatDot 2.4s ease-in-out infinite 0.4s"}}/>
            <img src="/img/gemini (24)_2.png" alt="기질도" style={{width:"100%",height:"100%",objectFit:"contain",animation:"_gjFloat 2.4s ease-in-out infinite",filter:"drop-shadow(0 0 12px rgba(5,77,149,0.55))"}} onError={(e)=>{e.currentTarget.style.display="none";const fb=e.currentTarget.nextSibling;if(fb)fb.style.display="block";}}/>
            <svg width="70" height="70" viewBox="0 0 60 60" style={{display:"none",animation:"_gjFloat 2.4s ease-in-out infinite",filter:"drop-shadow(0 0 12px rgba(5,77,149,0.55))"}}>
              <polygon points="30,52 5,10 55,10" fill="rgba(5,77,149,0.07)" stroke="#054D95" strokeWidth="1.6" strokeLinejoin="round"/>
              <polygon points="30,8 55,50 5,50" fill="rgba(5,77,149,0.07)" stroke="#054D95" strokeWidth="1.6" strokeLinejoin="round"/>
              <circle cx="30" cy="30" r="2.5" fill="#054D95" opacity="0.9"/>
            </svg>
          </div>
          <div style={{fontSize:10,color:"#054D95",letterSpacing:8,fontWeight:600,marginBottom:6,fontFamily:"'Noto Serif KR','Batang',serif"}}>氣 質 圖</div>
          <div style={{fontFamily:"'Noto Serif KR','Batang',serif",fontSize:52,fontWeight:900,color:"#054D95",marginBottom:8,letterSpacing:4,lineHeight:1.0}}>기질도</div>
          <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.7,marginBottom:0}}>
            타고난 기질 <span style={{color:"#054D95",fontWeight:700,margin:"0 4px"}}>vs</span> 살아온 기질<br/>
            <span style={{fontSize:10,color:"#888"}}>백호·청룡·봉황·기린·난초… 동양식 16가지 유형</span>
          </div>
        </div>
        {/* ✦ 기질도 6대 분석 — 테두리 없이 텍스트 리스트 (v183 박스 통째 삭제 → v189 내용 복원) */}
        <div style={{textAlign:"left",marginTop:18,marginBottom:14}}>
          {[
            {icon:"🔯",title:"사주 분석",desc:"생년월일로 타고난 기질을 탐색해요"},
            {icon:"📋",title:"40문항 테스트",desc:"살아온 기질을 정밀하게 파악해요"},
            {icon:"⚡",title:"비교 & 보완",desc:"두 기질의 차이와 성장 방향을 제시해요"},
            {icon:"🌊",title:"마음의 파동 (A/T)",desc:"호수형(자기확신) vs 파도형(섬세)"},
            {icon:"💕",title:"궁합 & 상극",desc:"찰떡 궁합 + 주의할 상극 유형"},
            {icon:"✨",title:"16종 캐릭터",desc:"청룡·봉황·백호 등 나만의 캐릭터"},
          ].map(f=>(
            <div key={f.title} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{f.icon}</span>
              <div><div style={{fontSize:12,fontWeight:700,color:"#054D95"}}>{f.title}</div><div style={{fontSize:10,color:"var(--mist)",lineHeight:1.5}}>{f.desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
          {[{hanja:"陽·陰",kr:"(양·음)",axis:"기운",sub:"외향/내향"},{hanja:"天·地",kr:"(천·지)",axis:"인식",sub:"직관/감각"},{hanja:"理·情",kr:"(리·정)",axis:"판단",sub:"이성/감성"},{hanja:"剛·柔",kr:"(강·유)",axis:"생활",sub:"계획/유연"}].map(a=>(
            <div key={a.axis} style={{background:"rgba(0,0,0,0.35)",border:"1px solid rgba(5,77,149,0.4)",borderRadius:12,padding:"14px 4px",textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#054D95",marginBottom:3,fontFamily:"'Noto Serif KR','Batang',serif",lineHeight:1.2}}>{a.hanja}</div>
              <div style={{fontSize:9,color:"var(--mist)",marginBottom:8}}>{a.kr}</div>
              <div style={{fontSize:11,fontWeight:800,color:"var(--white)",marginBottom:2}}>{a.axis}</div>
              <div style={{fontSize:9,color:"var(--mist)",lineHeight:1.4}}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn" onClick={doStart} style={{background:"linear-gradient(135deg,#054D95,#032A60)",color:"#fff",boxShadow:"0 4px 16px rgba(5,77,149,0.3)"}}>내 두 기질 차이 확인하기 (할인중 980원) →</button>
      <div style={{fontSize:10,color:"rgba(168,196,184,0.5)",textAlign:"center",margin:"10px 0 0",lineHeight:1.6}}>동양 철학 기반 성향 탐색용 · 의료적 진단 아님</div>
      <button className="btn btn-g" onClick={onClose} style={{marginTop:10}}>닫기</button>
      <style>{`@keyframes _gjFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}} @keyframes _gjFloatDot{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-5px);opacity:0.7}}`}</style>
    </div></div>
  );

  if(screen==="needBirth") return(
    <div className="ov"><div className="md"><div className="hd"/>
      <div className="mt">🧬 기질도</div>
      <div className="ms">생년월일 정보가 필요합니다</div>
      <div style={{textAlign:"center",padding:"20px 0",fontSize:40}}>📝</div>
      <div style={{fontSize:13,color:"var(--mist)",textAlign:"center",lineHeight:1.7,marginBottom:16}}>
        <strong style={{color:"var(--gold)"}}>{personName}</strong>님의 인물 정보에<br/>생년월일을 등록해주세요.
      </div>
      <button className="btn btn-g" onClick={onClose}>닫기</button>
    </div></div>
  );

  if(screen==="pay") return(
    <div className="ov"><div className="md"><div className="hd"/>
      <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
        <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div className="mt">🧬 기질도 (동양식 16유형)</div>
      <div className="ms">1회 분석 980원 · 테스트 완료! 결제하면 즉시 결과 확인</div>
      <div style={{background:"var(--ink3)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center",border:"1px solid rgba(212,175,55,0.1)"}}>
        <div style={{fontSize:13,color:"var(--mist)",lineHeight:1.7}}>✓ 사전질문 + 40문항 테스트 완료<br/>= 16가지 유형 + 4축 비교 + 개운법 풀 리포트</div>
      </div>
      {/* 결제 수단 선택 — 다른 모달과 동일한 PayStepComp (카카오페이/토스/네이버페이/카드/핸드폰 + 캐시·쿠폰·이용권) */}
      {helpers?.PayStepComp
        ?<helpers.PayStepComp price="980원" onPay={pay} onBack={()=>setScreen("preQ")} loading={loading} svcId="gijildo"/>
        :<>{loading?<div style={{display:"flex",gap:5,justifyContent:"center",padding:16}}><div className="dot"/><div className="dot"/><div className="dot"/></div>:
          <button className="btn" onClick={pay} style={{background:"linear-gradient(135deg,#054D95,#032A60)",color:"#fff",boxShadow:"0 4px 16px rgba(5,77,149,0.3)"}}>980원 결제하고 시작하기 →</button>}
        <button className="btn btn-g" onClick={onClose}>닫기</button></>}
      {/* 결제 완료 팝업 — 다른 모달과 동일한 바텀시트 스타일 */}
      {showPayDone&&<div className="pay-done-ov">
        <div className="pay-done-md"><div className="hd"/>
          <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
            <button onClick={onPayDone} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {/* v652: 테스트 모드 시뮬레이션 명시 — 실제 PortOne 연동 시 원복 */}
          <div className="pdc-icon">🧪</div>
          <div className="pdc-title">테스트 모드 — 결제 시뮬레이션</div>
          <div className="pdc-sub">실제 결제는 진행되지 않았어요.<br/>{personName}님의 16유형 기질도 결과를 확인해보세요!</div>
          <button className="btn btn-p" onClick={onPayDone} style={{marginTop:16}}>결과 보기 →</button>
        </div>
      </div>}
    </div></div>
  );

  // ━━━ 사전질문 화면 (2단계) ━━━
  if(screen==="preQ"){
    const step=preStep;
    return(
      <div className="ov"><div className="md"><div className="hd"/>
        {/* 결제 후 사전질문 진행 화면 — ✕는 비상 탈출용으로 유지, 하단 닫기 버튼만 제거 */}
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* v582: 사이트 표준 (내관상보기 패턴) — 상단 콘텐츠 제목 추가 */}
        <div className="mt">🧬 {personName}님의 기질도</div>
        <div className="ms">{step}/2 · 더 정확한 분석을 위해</div>
        {/* v758: 사전질문 표준 매치 */}
        <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:99,marginBottom:14,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${step===1?50:100}%`,background:"var(--gold)",transition:"width .3s"}}/>
        </div>
        <div style={{fontSize:11,color:"var(--mist)",marginBottom:12,lineHeight:1.6,padding:"8px 11px",background:"rgba(212,175,55,0.06)",borderRadius:8,border:"1px solid rgba(212,175,55,0.12)"}}>💡 건너뛰기 가능 — 전체 균등 분석</div>
        {step===1&&<>
          <div style={{fontSize:13,fontWeight:600,color:"var(--white)",marginBottom:12,lineHeight:1.5}}>요즘 연애의 상태는?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PRE_Q1.map(opt=>{
              const sel=preQ1===opt.label;
              return <button key={opt.label} onClick={()=>setPreQ1(opt.label)} style={{padding:"14px 16px",background:sel?"rgba(212,175,55,0.12)":"var(--ink3)",border:sel?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.07)",borderRadius:14,fontSize:13,color:sel?"var(--gold)":"var(--mist)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
                <span style={{fontSize:18}}>{opt.emoji}</span>{opt.label}
              </button>;
            })}
          </div>
          {/* v298: 자동 진입 제거 — 다음 버튼 클릭 시 step 2로 */}
          {preQ1&&preQ1!=="skip"&&(
            <button className="btn btn-p" style={{marginTop:12}} onClick={()=>setPreStep(2)}>다음 →</button>
          )}
          {!preQ1&&(
            <button className="btn btn-g" style={{marginTop:12,fontSize:12}} onClick={()=>{setPreQ1("skip");setPreStep(2);}}>건너뛰기</button>
          )}
          {/* v590: 이전 = test 마지막 문항 (test → 사전질문 → 결제 흐름) */}
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={()=>setScreen("test")} className="btn btn-g" style={{flex:1,marginTop:0,fontSize:12}}>← 이전</button>
            <button onClick={onClose} className="btn btn-g" style={{flex:1,marginTop:0}}>닫기</button>
          </div>
        </>}
        {step===2&&<>
          <div style={{fontSize:13,fontWeight:600,color:"var(--white)",marginBottom:12,lineHeight:1.5}}>요즘 낮을 채우는 일은? ☀️</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PRE_Q2.map(opt=>{
              const sel=preQ2===opt.label;
              return <button key={opt.label} onClick={()=>setPreQ2(opt.label)} style={{padding:"14px 16px",background:sel?"rgba(212,175,55,0.12)":"var(--ink3)",border:sel?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.07)",borderRadius:14,fontSize:13,color:sel?"var(--gold)":"var(--mist)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
                <span style={{fontSize:18}}>{opt.emoji}</span>{opt.label}
              </button>;
            })}
          </div>
          {/* v298: 자동 진입 제거 — 다음 버튼 클릭 시 pay로 */}
          {preQ2&&preQ2!=="skip"&&(
            <button className="btn btn-p" style={{marginTop:12}} onClick={()=>setScreen("pay")}>다음 →</button>
          )}
          {!preQ2&&(
            <button className="btn btn-g" style={{marginTop:12,fontSize:12}} onClick={()=>{setPreQ2("skip");setScreen("pay");}}>건너뛰기</button>
          )}
          {/* v368: 사전질문 표준 풋터 (이전·닫기) */}
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={()=>setPreStep(1)} className="btn btn-g" style={{flex:1,marginTop:0,fontSize:12}}>← 이전</button>
            <button onClick={onClose} className="btn btn-g" style={{flex:1,marginTop:0}}>닫기</button>
          </div>
        </>}
      </div></div>
    );
  }

  // ━━━ 테스트 화면 ━━━
  if(screen==="test"){
    const q=QUESTIONS[current];
    // 가드: q가 undefined일 때 자동 복구 (사용자에게 에러 안 보여주고 매끄럽게 진행)
    // 케이스 1: current가 범위 초과 + 답변 다 됨 → 결과 화면으로 (계산 후)
    // 케이스 2: current가 범위 초과 + 답변 미완 → 마지막 미응답 위치로 복귀
    // 케이스 3: q.axis 없음 (데이터 오류) → 다음 문항으로 스킵
    if(!q||!q.axis){
      const filledCount=answers.filter(a=>a!==null).length;
      if(filledCount>=QUESTIONS.length){
        // 이미 다 답변했으면 결과로
        const qt=getQType(answers);const wt=getWaveType(answers);
        setTimeout(()=>{setQType(qt);setWaveType(wt);setScreen("result");},0);
      }else if(!q){
        // current가 범위 초과 → 미응답 첫 위치로
        const nextIdx=answers.findIndex(a=>a===null);
        setTimeout(()=>{setCurrent(nextIdx>=0?nextIdx:0);},0);
      }else{
        // q.axis 없음 → 다음 문항으로
        setTimeout(()=>{setCurrent(c=>c+1);},0);
      }
      return(<div className="ov"><div className="md"><div className="hd"/>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{display:"flex",gap:5,justifyContent:"center",padding:16}}><div className="dot"/><div className="dot"/><div className="dot"/></div>
          <div style={{fontSize:11,color:"var(--mist)",marginTop:8}}>잠시만요...</div>
        </div>
      </div></div>);
    }
    return(
      <div className="ov"><div className="md" style={{maxHeight:"100dvh",paddingBottom:20}}>
        {/* 결제 후 테스트 진행 화면 — ✕는 비상 탈출용으로 유지, 하단 닫기 버튼만 제거 */}
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-8,zIndex:5}}>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"0 0 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:10,color:"var(--gold)",letterSpacing:2}}>🧬 기질도 · {personName}</span>
            <span style={{fontSize:11,color:"var(--mist)"}}>{current+1}/40</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"var(--gold)",borderRadius:4,transition:"width .5s"}}/>
          </div>
          <div style={{display:"flex",gap:4,marginTop:8}}>
            {AXIS_ORDER.map(axis=>{
              const done=answers.filter((a,qi)=>a&&QUESTIONS[qi]?.axis===axis).length;
              const total=QUESTIONS.filter(qq=>qq.axis===axis).length;
              const active=axis===q.axis;
              return(<div key={axis} style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:8,color:active?"var(--gold)":"rgba(168,196,184,0.25)",marginBottom:2}}>{AXIS_HANJA_SHORT[axis]}</div>
                <div style={{height:2,background:"rgba(255,255,255,0.05)",borderRadius:99}}><div style={{height:"100%",width:`${(done/total)*100}%`,background:active?"var(--gold)":"rgba(255,255,255,0.15)",borderRadius:99,transition:"width .3s"}}/></div>
              </div>);
            })}
          </div>
        </div>
        <div style={{opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-10px)",transition:"opacity .26s,transform .26s",padding:"8px 0"}}>
          <div style={{fontSize:9,color:"var(--gold)",marginBottom:6}}>{q.axis}의 기운 · {AXIS_DESC[q.axis]}</div>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:4}}>Q.{current+1}</div>
          <div style={{fontSize:17,lineHeight:1.75,fontWeight:600,marginBottom:20,fontFamily:"'Noto Serif KR',serif"}}>{q.text}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[q.a,q.b].map((opt,idx)=>{
              const isSel=selected===opt.code;
              return(<button key={idx} onClick={()=>handleAnswer(opt.code)} style={{padding:"18px 16px",background:isSel?"rgba(212,175,55,0.12)":"var(--ink3)",border:isSel?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.07)",borderRadius:14,fontSize:14,color:isSel?"var(--gold)":"var(--mist)",cursor:"pointer",textAlign:"left",lineHeight:1.6,fontFamily:"inherit",transition:"all .2s",transform:isSel?"scale(0.98)":"scale(1)"}}>
                <span style={{fontSize:10,opacity:0.3,marginRight:8}}>{idx===0?"A":"B"}</span>{opt.label}
              </button>);
            })}
          </div>
          {/* v596: 흐름이 인물 → 테스트 → 사전질문이므로 1번 문항 이전은 인물 변경 */}
          <button onClick={()=>{
            if(current>0){setCurrent(c=>c-1);return;}
            if(onRequestPerson){onRequestPerson({id:"gijildo",icon:"🧬",name:"기질도",desc:"",price:"980원"});onClose();return;}
            setScreen("intro");
          }} className="btn btn-g" style={{marginTop:10,fontSize:12}}>← 이전</button>
        </div>
      </div></div>
    );
  }

  // ━━━ 분석중 화면 (v262) ━━━
  if(screen==="loading"){
    const msgs=["사주 풀어보는 중... ☯️","16유형 매칭 중... 🧬","오행 분포 분석... 🌿","결과 정리 중... ✨"];
    return(
      <div className="ov"><div className="md"><div className="hd"/>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:64,marginBottom:18,filter:"drop-shadow(0 6px 18px rgba(212,175,55,0.4))"}}>🧬</div>
          <div style={{fontSize:18,fontWeight:900,color:"var(--gold)",fontFamily:"'Noto Serif KR',serif",marginBottom:8}}>{personName}님의 기질도 분석 중</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:22,minHeight:18}}>{msgs[loadMsgIdx]||msgs[0]}</div>
          <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:6,marginBottom:8,overflow:"hidden",border:"1px solid rgba(212,175,55,0.15)"}}>
            <div style={{height:"100%",width:`${loadPct}%`,background:"linear-gradient(90deg,var(--gold),#E8C86A)",borderRadius:6,transition:"width 0.2s"}}/>
          </div>
          <div style={{fontSize:11,color:"var(--gold)",fontWeight:700}}>{loadPct}%</div>
          <div style={{fontSize:9,color:"rgba(168,196,184,0.5)",marginTop:12,textAlign:"center",letterSpacing:0.3}}>✨ 화면을 나가도 분석은 계속됩니다 · 결과는 기록소에 저장돼요</div>
        </div>
      </div></div>
    );
  }

  // ━━━ 결과 화면 (5탭) ━━━
  if(screen==="result"){
    if(!sajuInfo||!qType){
      return(
        <div className="ov"><div className="md"><div className="hd"/>
          <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div className="mt">⚠️ 결과를 불러올 수 없어요</div>
          <div className="ms">{!sajuInfo?"사주 정보가 없습니다.":"테스트 결과가 없습니다."}</div>
          <button className="btn btn-p" style={{marginTop:12}} onClick={()=>{setCurrent(0);setAnswers(Array(40).fill(null));setQType("");setWaveType(null);setScreen("test");}}>처음부터 다시</button>
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </div></div>
      );
    }

    const sData=TYPES[sajuInfo.code]||TYPES["양천리강"];
    const qData=TYPES[qType]||TYPES["양천리강"];
    const isSame=sajuInfo.code===qType;
    const sChars=(sajuInfo.code||"").split("");
    const qChars=(qType||"").split("");
    const diffAxes=AXIS_ORDER.filter((_,i)=>sChars[i]!==qChars[i]);
    // ⚠️ "Cannot read properties of undefined (reading 'axis')" 버그 가드 강화 (2026-04-26)
    // — DIFF 결과 객체에 axis 키 누락 케이스 + null 명시 필터로 안전 보장
    const advices=diffAxes.map(axis=>{
      if(!axis)return null;
      const i=AXIS_ORDER.indexOf(axis);
      if(i<0)return null;
      const key=`${sChars[i]||""}→${qChars[i]||""}`;
      const data=DIFF[axis]?.[key];
      if(!data)return null;
      return {axis,title:data.title,msg:data.msg};
    }).filter(a=>a&&a.axis);
    const introPhrase=getIntroPhrase();
    const syncRate=Math.round(((4-diffAxes.length)/4)*100);

    // 그룹화된 탭 (v348: 비교 / 개운법 분리 — 4탭)
    const TAB_GROUPS=[
      {group:1,key:1,icon:"🧬",label:"타고난 기질"},
      {group:1,key:2,icon:"🪞",label:"살아온 기질"},
      {group:2,key:3,icon:"⚡",label:"두 기질 비교 분석"},
      {group:2,key:4,icon:"🌿",label:"개운법"},
    ];
    // 타고난/살아온 탭의 하위 카테고리 sub-tab 정의 (v252: 성향=desc만, 직업 sub 보강)
    const buildSubTabs=(d)=>[
      {key:0,icon:"📌",title:`${resultTab===1?"타고난":"살아온"} 성향`,sub:`${d.name}형의 본래 결을 한 문장으로`,color:"#1a73e8",body:d.desc,badges:d.strengths,badgePrefix:"#"},
      {key:1,icon:"💰",title:"재물운 흐름",sub:"돈이 들어오는 길과 흩어지는 길",color:"#D4AF37",body:d.money},
      {key:2,icon:"❤️",title:"연애 성향",sub:"사랑하는 방식·끌리는 사람",color:"#e03131",body:d.love},
      {key:3,icon:"💼",title:"추천 직업",sub:`${d.strengths?.[0]||"강점"}을 살리는 분야`,color:"#059669",body:`${d.name}형의 ${(d.strengths||[]).slice(0,2).join(" · ")}이(가) 빛나는 일을 만났을 때 가장 멀리 가요. 아래 직업군이 결에 가장 잘 맞아요.`,badges:d.jobs},
      {key:4,icon:"🌿",title:"건강 주의점",sub:"몸과 마음의 흐름",color:"#2d6a4f",body:d.health},
      {key:5,icon:"⚠️",title:"주의할 점",sub:"성장의 그림자",color:"#b45309",body:d.weak},
    ];
    const birthStr=birth?`${birth.year}.${String(birth.month).padStart(2,"0")}.${String(birth.day).padStart(2,"0")}.${selectedPerson?.time&&selectedPerson.time!=="모름"?" "+selectedPerson.time:""}생`:"";

    return(
      <div className="ov"><div className="md"><div className="hd"/>
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* ═══════════ 메인 카드 (헤더 + 그룹 탭 + 탭 콘텐츠) ═══════════ */}
        <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 10px 30px rgba(0,0,0,0.06)",marginBottom:12,color:"#333"}}>
          {/* v428: 헤더 — 천기 라인만 borderBottom (다른 콘텐츠와 통일) */}
          <div style={{padding:"10px 16px 14px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:8}}>🧬 {personName}님의 기질도</div>
            {/* v316: 검사 정보 — 생년월일분시 + 진행 날짜시각 */}
            <div style={{fontSize:10,color:"#888",fontWeight:600,lineHeight:1.6}}>
              {birthStr&&<div>👤 {personName} : {birthStr}</div>}
              <div style={{color:"#aaa"}}>📅 {preloadResult?._testDate||new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})} 검사</div>
            </div>
          </div>

          {/* 듀얼 캐릭터 카드 — 컬러 대비 강화 (사용자 요청 v248: 연노랑 글자 안 보임 fix) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"18px 16px",background:"#fafafa"}}>
            {[{d:sData,c:sChars,label:"🔯 타고난 기질",sub:"사주 기반"},{d:qData,c:qChars,label:"🪞 살아온 기질",sub:"테스트 기반"}].map(({d,c,label,sub},ci)=>(
              <div key={ci} style={{background:`linear-gradient(135deg,${d.color}10,${d.color}20)`,border:`2px solid ${d.color}80`,borderRadius:14,padding:"14px 10px",textAlign:"center",boxShadow:`0 4px 16px ${d.color}30`}}>
                {/* 라벨 — 키컬러 칩 (강조 강화) */}
                <div style={{display:"inline-block",fontSize:11,color:"#fff",fontWeight:800,padding:"5px 14px",borderRadius:14,background:d.color,marginBottom:10,letterSpacing:0.5,boxShadow:`0 2px 6px ${d.color}55`}}>{label}</div>
                {d.card?
                  <img src={d.card} alt={d.name} style={{width:128,height:128,objectFit:"contain",margin:"0 auto 6px",display:"block",filter:`drop-shadow(0 6px 18px ${d.color}77)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                  :<div style={{fontSize:48,marginBottom:4}}>{d.emoji}</div>
                }
                <div style={{fontSize:17,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif"}}>{d.name}형</div>
                {/* 부제 — 다크 그레이 (컬러 대비 보장) */}
                <div style={{fontSize:10,color:"#6b7280",fontWeight:600,marginTop:1}}>{d.subtitle}</div>
                {/* 자모 chars — 어두운 배경 + 흰 글자 (가독성 보장) */}
                <div style={{display:"flex",justifyContent:"center",gap:3,margin:"6px 0 4px"}}>
                  {c.map((ch,i)=>(<span key={i} style={{width:18,height:18,background:d.color,border:`1px solid ${d.color}`,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff"}}>{ch}</span>))}
                </div>
                {/* 사주 기반/테스트 기반 · MBTI — 강조 (사용자 요청 v249: 굵게 살짝 크게) */}
                <div style={{fontSize:11,color:d.color,fontWeight:800,letterSpacing:0.2}}>{sub} · {d.mbti}</div>
              </div>
            ))}
          </div>

          {/* 싱크로율 — 항상 노출 */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"16px",background:"#fafafa",flexWrap:"wrap"}}>
            <div style={{fontSize:22,fontWeight:900,color:isSame?"#059669":"#D4AF37"}}>{isSame?"✨":"⚡"} {syncRate}%</div>
            <span style={{fontSize:11,color:"#666",fontWeight:700}}>{isSame?"타고난 그대로":`${diffAxes.length}축 차이`}</span>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:6,padding:"0 16px 16px",background:"#fafafa",flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#fff0f3",color:"#e03131",border:"1px solid #ffe0e6"}}>🧬 {sData.mbti}→{qData.mbti}</span>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#fffbeb",color:"#b45309",border:"1px solid #fde68a"}}>🔯 {sData.name}·{qData.name}형</span>
            {waveType&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#e8fdf4",color:"#054D95",border:"1px solid #b2f5ea"}}>🌊 {waveType.type==="A"?"호수":"파도"}형 {waveType.type==="A"?waveType.aPct:waveType.tPct}%</span>}
          </div>

          {/* ━━━━━━ PAGE 1 통합 섹션 (사용자 요청 v249: 인증서 탭 제거 + 1페이지 통합) ━━━━━━ */}

          {/* v347: 사주 오행 분포 → 페이지 2 (타고난 기질) 안으로 이동 */}

          {/* 4축 상세 비교 — 내부 구분선 제거, 간격 넓힘 */}
          <div style={{padding:"20px 16px",background:"#fff"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:14}}>⚖️ 4축 상세 비교</div>
            {AXIS_ORDER.map((axis,i)=>{
              const sv=sChars[i],qv=qChars[i],same=sv===qv;
              return(<div key={axis} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:10,color:"#888",width:65,flexShrink:0}}>{AXIS_HANJA_SHORT[axis]}</span>
                <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${sData.color}18`,padding:"3px 10px",borderRadius:6}}>{sv}</span>
                <span style={{fontSize:11,color:same?"#059669":"#D4AF37"}}>{same?"＝":"≠"}</span>
                <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${qData.color}18`,padding:"3px 10px",borderRadius:6}}>{qv}</span>
                <span style={{fontSize:9,color:same?"#059669":"#D4AF37",marginLeft:"auto"}}>{same?"일치":"차이"}</span>
              </div>);
            })}
          </div>

          {/* 마음의 파동 */}
          {waveType&&<div style={{padding:"20px 16px",background:"#fff"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#054D95",marginBottom:12}}>🌊 마음의 파동</div>
            <div style={{display:"flex",gap:8,marginBottom:6}}>
              <div style={{flex:1,background:waveType.type==="A"?"#e3f2fd":"#fafafa",border:waveType.type==="A"?"1px solid #90caf9":"1px solid #eee",borderRadius:10,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:13}}>🏔️</div>
                <div style={{fontSize:10,fontWeight:700,color:waveType.type==="A"?"#1565c0":"#aaa"}}>A형 · 호수 {waveType.aPct}%</div>
              </div>
              <div style={{flex:1,background:waveType.type==="T"?"#f3e5f5":"#fafafa",border:waveType.type==="T"?"1px solid #ce93d8":"1px solid #eee",borderRadius:10,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:13}}>🌊</div>
                <div style={{fontSize:10,fontWeight:700,color:waveType.type==="T"?"#7b1fa2":"#aaa"}}>T형 · 파도 {waveType.tPct}%</div>
              </div>
            </div>
            <div style={{fontSize:10,color:"#555",lineHeight:1.6}}>{waveType.type==="A"?"잔잔하고 단단한 호수형. 감정의 흔들림이 적고 안정적으로 나아가는 힘이 있어요.":"물결치는 파도형. 감정의 진폭이 크고 섬세하게 주변을 감지하는 능력이 있어요."}</div>
          </div>}

          {/* v346: 찰떡/상극 — 다른 1페이지 섹션들(사주 오행/4축/파동)과 통일 좌측 정렬 제목 */}
          {(TYPES[sData.match]||TYPES[sData.anti]||TYPES[qData.match]||TYPES[qData.anti])&&<div style={{padding:"20px 16px",background:"#fff"}}>
            <div style={{fontSize:11,fontWeight:800,color:"#c92a2a",marginBottom:14}}>💕 찰떡 / ⚡ 상극 매칭</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>
              {[
                {t:TYPES[sData.match],lb:"🔯 타고난 찰떡",bg:"#fff5f5",bd:"#ffe0e6",lc:"#c92a2a"},
                {t:TYPES[sData.anti], lb:"🔯 타고난 상극",bg:"#f8f9fa",bd:"#e6e6e6",lc:"#666"},
                {t:TYPES[qData.match],lb:"🪞 살아온 찰떡",bg:"#fff0f8",bd:"#ffd6ec",lc:"#a8205c"},
                {t:TYPES[qData.anti], lb:"🪞 살아온 상극",bg:"#f4f5f7",bd:"#dcdcdc",lc:"#555"},
              ].map(({t,lb,bg,bd,lc},i)=>t?<div key={i} style={{background:bg,border:`1px solid ${bd}`,borderRadius:10,padding:"8px 5px",textAlign:"center"}}>
                <div style={{fontSize:8.5,fontWeight:800,color:lc,marginBottom:4,wordBreak:"keep-all"}}>{lb}</div>
                <div style={{position:"relative",width:44,height:44,margin:"0 auto 3px"}}>
                  <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,zIndex:0}}>{t.emoji}</span>
                  {t.card&&<img src={t.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1,filter:`drop-shadow(0 2px 4px ${t.color}55)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>}
                </div>
                <div style={{fontSize:9.5,fontWeight:700,color:"#1A3C32",lineHeight:1.3}}>{t.name}형</div>
              </div>:<div key={i}/>)}
            </div>
          </div>}

          {/* 페이지 1 해시태그 푸터 (v360: borderBottom 제거 — 다른 페이지와 통일) */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,borderTop:"1px solid #f0f0f0"}}>
            <span>#{`천기기질도`} #{`성격분석`} #{`기질분석`} #{`동양식16유형`} #{(personName||"").replace(/\s/g,"")} #{`${qData.name}형`} #{qData.mbti}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>

        </div>{/* ═══════════ 메인 카드 끝 ═══════════ */}

        {/* v314: 탭 안내 + 버튼을 페이지 2 최상단으로 이동 / v743: result-tabs 통일 */}
        <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",marginBottom:12,padding:"14px 12px 12px"}}>
          <div style={{textAlign:"center",fontSize:11,marginBottom:10}}><span className="tab-hint-blink">👇 <b>탭 버튼</b>을 눌러 분야별 상세 리포트를 확인하세요!</span></div>
          <div className="result-tabs" style={{display:"flex",flexDirection:"column",gap:5}}>
            {/* 그룹1: 타고난 / 살아온 (2등분) */}
            <div style={{display:"flex",gap:5}}>
              {TAB_GROUPS.filter(t=>t.group===1).map(t=>(
                <button key={t.key} onClick={()=>setResultTab(t.key)} style={{flex:1,padding:"7px 6px",background:resultTab===t.key?"#1A3C32":"transparent",border:`1px solid ${resultTab===t.key?"#1A3C32":"#ddd"}`,color:resultTab===t.key?"#fff":"#1A3C32",borderRadius:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.icon} {t.label}</button>
              ))}
            </div>
            {/* 그룹2: 비교·개운 (풀너비) */}
            <div style={{display:"flex",gap:5}}>
              {TAB_GROUPS.filter(t=>t.group===2).map(t=>(
                <button key={t.key} onClick={()=>setResultTab(t.key)} style={{flex:1,padding:"7px 6px",background:resultTab===t.key?"#1A3C32":"transparent",border:`1px solid ${resultTab===t.key?"#1A3C32":"#ddd"}`,color:resultTab===t.key?"#fff":"#1A3C32",borderRadius:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t.icon} {t.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 탭0(인증서) — v249에서 PAGE 1으로 통합되어 제거됨 */}

        {/* 탭1: 타고난 기질 (v251 개편) */}
        {resultTab===1&&(()=>{
          const subs=buildSubTabs(sData);
          const cur=subs[subTab1]||subs[0];
          return <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333"}}>
          {/* 헤더: 이름·생년월일·사주 코드 + 큰 일러스트 + 큰 제목 */}
          <div style={{padding:"10px 16px 14px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:12,color:"#555",fontWeight:700,marginBottom:3}}>{personName} : {birthStr}</div>
            <div style={{fontSize:11,color:sData.color,fontWeight:800,marginBottom:14}}>사주 : {sajuInfo.code} ({sData.hanja}) · {sData.mbti}</div>
            {sData.card?
              <div style={{position:"relative",width:170,height:170,margin:"0 auto 10px"}}>
                <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,zIndex:0,opacity:0.9}}>{sData.emoji}</span>
                <img src={sData.card} alt={sData.name} style={{width:170,height:170,objectFit:"contain",position:"relative",zIndex:1,filter:`drop-shadow(0 8px 22px ${sData.color}66)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
              </div>
              :<div style={{fontSize:80,marginBottom:8}}>{sData.emoji}</div>
            }
            <div style={{fontSize:26,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif",lineHeight:1.2}}>{sData.name}형</div>
            <div style={{fontSize:13,color:sData.color,fontWeight:700,marginTop:6,fontStyle:"italic"}}>"{sData.subtitle}"</div>
          </div>
          {/* 인용구 */}
          <div style={{padding:"16px 16px 0"}}>
            <div style={{background:`${sData.color}10`,borderLeft:`4px solid ${sData.color}`,borderRadius:"0 12px 12px 0",padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#555",lineHeight:1.75,fontStyle:"italic"}}>"{introPhrase} 타고나길 <strong>{sData.name}</strong>의 기운을 품고 오셨네요.<br/>{sData.desc_long}"</div>
            </div>
          </div>

          {/* v347: 사주 오행 분포 — 1페이지에서 이동 + 거미줄(radar) 그래프 추가 */}
          {sajuInfo&&<div style={{padding:"0 16px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:10}}>🌿 사주 오행 분포 · 일간: {sajuInfo.ilganName}</div>
            {/* 거미줄 radar chart */}
            {(()=>{
              const total=Object.values(sajuInfo.ohang).reduce((a,b)=>a+b,0)||1;
              const order=["목","화","토","금","수"];
              const cx=110,cy=110,maxR=85;
              // 5각형 좌표 (시계 방향, 12시 시작)
              const points=order.map((oh,i)=>{
                const angle=(Math.PI*2*i/5)-Math.PI/2;
                const pct=(sajuInfo.ohang[oh]||0)/total;
                const r=pct*maxR;
                // v360: 5각형 라벨 위치 보정 — 각 방향별 textAnchor·dx·dy로 잘림 방지
                const ax=Math.cos(angle),ay=Math.sin(angle);
                const ta=ax>0.3?"start":ax<-0.3?"end":"middle";
                const dx=ax>0.3?6:ax<-0.3?-6:0;
                const dy=ay>0.3?12:ay<-0.3?-6:0;
                return{
                  x:cx+r*Math.cos(angle),
                  y:cy+r*Math.sin(angle),
                  lx:cx+maxR*ax+dx,
                  ly:cy+maxR*ay+dy,
                  ta,
                  oh,pct:Math.round(pct*100),
                };
              });
              const path=points.map((p,i)=>(i===0?"M":"L")+`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")+"Z";
              // 가이드 격자 (25%, 50%, 75%, 100%)
              const guides=[0.25,0.5,0.75,1].map(g=>{
                return order.map((_,i)=>{
                  const a=(Math.PI*2*i/5)-Math.PI/2;
                  return`${cx+g*maxR*Math.cos(a)},${cy+g*maxR*Math.sin(a)}`;
                }).join(" ");
              });
              return <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <svg width="280" height="240" viewBox="-50 -10 320 240" style={{maxWidth:"100%",height:"auto"}}>
                  {/* 가이드 격자 */}
                  {guides.map((pts,i)=>(<polygon key={i} points={pts} fill="none" stroke="#e0e0e0" strokeWidth="0.6"/>))}
                  {/* 축 라인 */}
                  {order.map((_,i)=>{const a=(Math.PI*2*i/5)-Math.PI/2;return<line key={i} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke="#e8e8e8" strokeWidth="0.6"/>;})}
                  {/* 데이터 도형 */}
                  <path d={path} fill="rgba(212,175,55,0.25)" stroke="#D4AF37" strokeWidth="1.5"/>
                  {/* 데이터 점 */}
                  {points.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="3" fill={ohColors[p.oh]}/>))}
                  {/* 라벨 */}
                  {points.map((p,i)=>(<text key={i} x={p.lx} y={p.ly} textAnchor={p.ta} dominantBaseline="central" fontSize="11" fontWeight="800" fill={ohColors[p.oh]}>{p.oh} {p.pct}%</text>))}
                </svg>
              </div>;
            })()}
            <div style={{fontSize:9,color:"#aaa",lineHeight:1.5,textAlign:"center"}}>가장 강한 오행이 {personName}님의 핵심 기운이에요.</div>
          </div>}

          {/* 6섹션 — 회색박스강조 디자인 (관상짤 상세리포트 패턴) */}
          <div style={{padding:"0 16px"}}>
            {subs.map((s)=>(
              <div key={s.key} style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>{s.icon} {s.title}: "{s.sub}"</div>
                <div style={{background:"#f8f9fa",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all",marginBottom:s.badges&&s.badges.length>0?10:0}}>{s.body}</div>
                  {s.badges&&s.badges.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {s.badges.map(b=>(<span key={b} style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:`${s.color}12`,color:s.color,border:`1px solid ${s.color}30`}}>{s.badgePrefix||""}{b}</span>))}
                  </div>}
                  {(s.key===2||s.key===3)&&(()=>{
                    const situ=s.key===2?loveSituational(sData,preQ1,personName,true):jobSituational(sData,preQ2,personName);
                    return <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed rgba(212,175,55,0.35)"}}>
                      <div style={{fontSize:10,fontWeight:800,color:"#D4AF37",marginBottom:5}}>💬 지금 {personName}님 상황에서는</div>
                      <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all"}}>{situ}</div>
                    </div>;
                  })()}
                </div>
              </div>
            ))}
          </div>
          {/* 유명인 10명 (사주 기반) */}
          {helpers?.CelebMatchSection&&(()=>{
            const _pool=(_GIJILDO_CELEBS[sajuInfo?.code]||sData.celeb.split(",")).map(p=>typeof p==="string"?p.trim():p);
            const _matched=helpers?.pickCelebs?helpers.pickCelebs(_pool,{birth:selectedPerson?.birth||preloadResult?._birth,gender:selectedPerson?.gender==="여"?"F":selectedPerson?.gender==="남"?"M":undefined,n:10}):_pool;
            return <div style={{padding:"14px 16px 0"}}>
              <helpers.CelebMatchSection
                label={`${personName}님과 닮은 [${sData.name}형 · ${sData.mbti}] 유명인 10명`}
                celebs={_matched}
                prefix={sData.emoji}
              />
            </div>;
          })()}
          {/* 하단 해시태그 사이트 — 페이지 1과 통일 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,borderTop:"1px solid #f0f0f0"}}>
            <span>#{`천기기질도`} #{`성격분석`} #{`기질분석`} #{`동양식16유형`} #{(personName||"").replace(/\s/g,"")} #{`${qData.name}형`} #{qData.mbti}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
        </div>;
        })()}

        {/* 탭2: 살아온 기질 (v251 개편) */}
        {resultTab===2&&(()=>{
          const subs=buildSubTabs(qData);
          const cur=subs[subTab2]||subs[0];
          return <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333"}}>
          {/* 헤더 */}
          <div style={{padding:"10px 16px 14px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:12,color:"#555",fontWeight:700,marginBottom:3}}>{personName} : {birthStr}</div>
            <div style={{fontSize:11,color:qData.color,fontWeight:800,marginBottom:14}}>성격 : {qType} ({qData.hanja}) · {qData.mbti}</div>
            {qData.card?
              <div style={{position:"relative",width:170,height:170,margin:"0 auto 10px"}}>
                <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,zIndex:0,opacity:0.9}}>{qData.emoji}</span>
                <img src={qData.card} alt={qData.name} style={{width:170,height:170,objectFit:"contain",position:"relative",zIndex:1,filter:`drop-shadow(0 8px 22px ${qData.color}66)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
              </div>
              :<div style={{fontSize:80,marginBottom:8}}>{qData.emoji}</div>
            }
            <div style={{fontSize:26,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif",lineHeight:1.2}}>{qData.name}형</div>
            <div style={{fontSize:13,color:qData.color,fontWeight:700,marginTop:6,fontStyle:"italic"}}>"{qData.subtitle}"</div>
          </div>
          {/* 인용구 */}
          <div style={{padding:"16px 16px 0"}}>
            <div style={{background:`${qData.color}10`,borderLeft:`4px solid ${qData.color}`,borderRadius:"0 12px 12px 0",padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#555",lineHeight:1.75,fontStyle:"italic"}}>"{introPhrase} 살아오면서 <strong>{qData.name}</strong>처럼 세상을 마주해왔네요.<br/>{qData.desc_long}"</div>
            </div>
          </div>

          {/* v347: 4축 비율 — 거미줄(radar) 그래프 (살아온 기질 = MBTI식 4축 비율) */}
          {answers&&answers.length>0&&(()=>{
            const sc={};Object.values(AXIS_PAIRS).flat().forEach(k=>sc[k]=0);
            answers.forEach(a=>{if(a)sc[a]=(sc[a]||0)+1;});
            // 각 축의 다수파 점수 (% 0~100)
            const axisColors={"기운":"#dc2626","인식":"#7c3aed","판단":"#16a34a","생활":"#0ea5e9"};
            const axisData=AXIS_ORDER.map(axis=>{
              const[a,b]=AXIS_PAIRS[axis];
              const total=(sc[a]||0)+(sc[b]||0)||1;
              const major=sc[a]>=sc[b]?a:b;
              const pct=Math.round(((sc[major]||0)/total)*100);
              return{axis,major,pct,color:axisColors[axis]};
            });
            const cx=110,cy=110,maxR=85;
            // 4각형 (4축) 좌표 — 12시/3시/6시/9시
            // v360: 라벨 위치/정렬 보정 — 4축(상우하좌) 방향에 맞춰 textAnchor + dy 조정해서 잘림 해소
            const points=axisData.map((d,i)=>{
              const angle=(Math.PI*2*i/4)-Math.PI/2;
              const r=(d.pct/100)*maxR;
              // i=0:top, i=1:right, i=2:bottom, i=3:left
              const ta=i===1?"start":i===3?"end":"middle";
              const dx=i===1?6:i===3?-6:0;
              const dy=i===0?-6:i===2?12:0;
              return{
                x:cx+r*Math.cos(angle),
                y:cy+r*Math.sin(angle),
                lx:cx+maxR*Math.cos(angle)+dx,
                ly:cy+maxR*Math.sin(angle)+dy,
                ta,
                ...d,
              };
            });
            const path=points.map((p,i)=>(i===0?"M":"L")+`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")+"Z";
            const guides=[0.25,0.5,0.75,1].map(g=>{
              return AXIS_ORDER.map((_,i)=>{
                const a=(Math.PI*2*i/4)-Math.PI/2;
                return`${cx+g*maxR*Math.cos(a)},${cy+g*maxR*Math.sin(a)}`;
              }).join(" ");
            });
            return <div style={{padding:"0 16px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:qData.color,marginBottom:10}}>🪞 살아온 기질 4축 비율 · {qType} ({qData.mbti})</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <svg width="280" height="240" viewBox="-50 -10 320 240" style={{maxWidth:"100%",height:"auto"}}>
                  {guides.map((pts,i)=>(<polygon key={i} points={pts} fill="none" stroke="#e0e0e0" strokeWidth="0.6"/>))}
                  {AXIS_ORDER.map((_,i)=>{const a=(Math.PI*2*i/4)-Math.PI/2;return<line key={i} x1={cx} y1={cy} x2={cx+maxR*Math.cos(a)} y2={cy+maxR*Math.sin(a)} stroke="#e8e8e8" strokeWidth="0.6"/>;})}
                  <path d={path} fill={`${qData.color}30`} stroke={qData.color} strokeWidth="1.5"/>
                  {points.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="3" fill={p.color}/>))}
                  {points.map((p,i)=>(<text key={i} x={p.lx} y={p.ly} textAnchor={p.ta} dominantBaseline="central" fontSize="10" fontWeight="800" fill={p.color}>{p.axis} {p.major} {p.pct}%</text>))}
                </svg>
              </div>
              <div style={{fontSize:9,color:"#aaa",lineHeight:1.5,textAlign:"center"}}>각 축에서 더 강하게 나타난 쪽의 비율이에요 · 테스트 응답 기반</div>
            </div>;
          })()}
          {/* 6섹션 — 회색박스강조 디자인 */}
          <div style={{padding:"0 16px"}}>
            {subs.map((s)=>(
              <div key={s.key} style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>{s.icon} {s.title}: "{s.sub}"</div>
                <div style={{background:"#f8f9fa",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all",marginBottom:s.badges&&s.badges.length>0?10:0}}>{s.body}</div>
                  {s.badges&&s.badges.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {s.badges.map(b=>(<span key={b} style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:`${s.color}12`,color:s.color,border:`1px solid ${s.color}30`}}>{s.badgePrefix||""}{b}</span>))}
                  </div>}
                  {(s.key===2||s.key===3)&&(()=>{
                    const situ=s.key===2?loveSituational(qData,preQ1,personName,false):jobSituational(qData,preQ2,personName);
                    return <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed rgba(212,175,55,0.35)"}}>
                      <div style={{fontSize:10,fontWeight:800,color:"#D4AF37",marginBottom:5}}>💬 지금 {personName}님 상황에서는</div>
                      <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all"}}>{situ}</div>
                    </div>;
                  })()}
                </div>
              </div>
            ))}
          </div>
          {/* 유명인 10명 (테스트 기반) */}
          {helpers?.CelebMatchSection&&(()=>{
            const _pool=(_GIJILDO_CELEBS[qType]||qData.celeb.split(",")).map(p=>typeof p==="string"?p.trim():p);
            const _matched=helpers?.pickCelebs?helpers.pickCelebs(_pool,{birth:selectedPerson?.birth||preloadResult?._birth,gender:selectedPerson?.gender==="여"?"F":selectedPerson?.gender==="남"?"M":undefined,n:10}):_pool;
            return <div style={{padding:"14px 16px 0"}}>
              <helpers.CelebMatchSection
                label={`${personName}님과 닮은 [${qData.name}형 · ${qData.mbti}] 유명인 10명`}
                celebs={_matched}
                prefix={qData.emoji}
              />
            </div>;
          })()}
          {/* 하단 해시태그 사이트 — 페이지 1과 통일 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,borderTop:"1px solid #f0f0f0"}}>
            <span>#{`천기기질도`} #{`성격분석`} #{`기질분석`} #{`동양식16유형`} #{(personName||"").replace(/\s/g,"")} #{`${qData.name}형`} #{qData.mbti}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
        </div>;
        })()}

        {/* v348: 탭3 분리 — 페이지 3 비교 분석 */}
        {resultTab===3&&<div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333",marginBottom:12}}>
          {/* 헤더 — 페이지 1·2와 통일 (양끝 구분선 한 겹) */}
          <div style={{padding:"10px 16px 14px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>⚡ 두 기질 비교 분석</div>
            <div style={{fontSize:11,color:"#888",marginTop:4,fontWeight:600}}>🔯 타고난 기질 vs 🪞 살아온 기질</div>
          </div>

          {/* 듀얼 캐릭터 카드 + 싱크로율 통합 박스 */}
          <div style={{padding:"16px"}}>
            <div style={{background:"#fff",border:`2px solid ${isSame?"#bbf7d0":"#fde68a"}`,borderRadius:16,overflow:"hidden",marginBottom:14}}>
              {/* 듀얼 캐릭터 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,alignItems:"center",padding:"14px 10px",background:"#fafafa",borderBottom:`1px solid ${isSame?"#bbf7d0":"#fde68a"}`}}>
                <div style={{textAlign:"center",padding:"0 6px"}}>
                  <div style={{display:"inline-block",fontSize:9,color:"#fff",fontWeight:800,padding:"3px 10px",borderRadius:10,background:sData.color,marginBottom:6}}>🔯 타고난 기질</div>
                  {sData.card?
                    <div style={{position:"relative",width:84,height:84,margin:"0 auto 4px"}}>
                      <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,zIndex:0}}>{sData.emoji}</span>
                      <img src={sData.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1,filter:`drop-shadow(0 4px 14px ${sData.color}55)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                    </div>
                    :<div style={{fontSize:42,marginBottom:4}}>{sData.emoji}</div>
                  }
                  <div style={{fontSize:14,fontWeight:900,color:"#1A3C32"}}>{sData.name}형</div>
                  <div style={{fontSize:9,color:"#777",fontWeight:600,marginBottom:4,wordBreak:"keep-all"}}>{sData.subtitle}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:2,margin:"4px 0"}}>
                    {sChars.map((ch,i)=>(<span key={i} style={{width:16,height:16,background:sData.color,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>{ch}</span>))}
                  </div>
                  <div style={{fontSize:10,color:sData.color,fontWeight:800}}>사주 기반 · {sData.mbti}</div>
                </div>
                <div style={{fontSize:24,color:isSame?"#059669":"#D4AF37",fontWeight:900,padding:"0 4px"}}>{isSame?"✨":"⚡"}</div>
                <div style={{textAlign:"center",padding:"0 6px"}}>
                  <div style={{display:"inline-block",fontSize:9,color:"#fff",fontWeight:800,padding:"3px 10px",borderRadius:10,background:qData.color,marginBottom:6}}>🪞 살아온 기질</div>
                  {qData.card?
                    <div style={{position:"relative",width:84,height:84,margin:"0 auto 4px"}}>
                      <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,zIndex:0}}>{qData.emoji}</span>
                      <img src={qData.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1,filter:`drop-shadow(0 4px 14px ${qData.color}55)`}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                    </div>
                    :<div style={{fontSize:42,marginBottom:4}}>{qData.emoji}</div>
                  }
                  <div style={{fontSize:14,fontWeight:900,color:"#1A3C32"}}>{qData.name}형</div>
                  <div style={{fontSize:9,color:"#777",fontWeight:600,marginBottom:4,wordBreak:"keep-all"}}>{qData.subtitle}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:2,margin:"4px 0"}}>
                    {qChars.map((ch,i)=>(<span key={i} style={{width:16,height:16,background:qData.color,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff"}}>{ch}</span>))}
                  </div>
                  <div style={{fontSize:10,color:qData.color,fontWeight:800}}>테스트 기반 · {qData.mbti}</div>
                </div>
              </div>
              {/* 싱크로율 */}
              <div style={{padding:"14px 16px",textAlign:"center",background:isSame?"#e8fdf4":"#fffbeb"}}>
                <div style={{fontSize:24,fontWeight:900,color:isSame?"#059669":"#D4AF37",marginBottom:4}}>싱크로율 {syncRate}%</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.7,wordBreak:"keep-all"}}>{isSame?"타고난 사주 기질대로 살고 있어요!":`타고난 ${sData.name}의 기운과 살아온 ${qData.name}의 방식 사이에 간극이 있어요.`}</div>
              </div>
              {/* 4축 비교 */}
              <div style={{padding:"14px 16px",borderTop:`1px solid ${isSame?"#bbf7d0":"#fde68a"}`}}>
                <div style={{fontSize:12,fontWeight:800,color:"#D4AF37",marginBottom:10,textAlign:"center"}}>⚖️ 4축 상세 비교</div>
                {AXIS_ORDER.map((axis,i)=>{
                  const sv=sChars[i],qv=qChars[i],same=sv===qv;
                  return(<div key={axis} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,padding:"8px 10px",background:same?"#f0fdf4":"#fffbeb",borderRadius:10,border:`1px solid ${same?"#bbf7d0":"#fde68a"}`}}>
                    <span style={{fontSize:10,color:"#888",width:70,flexShrink:0,fontWeight:600}}>{AXIS_HANJA_SHORT[axis]}</span>
                    <span style={{fontSize:13,fontWeight:800,color:"#1A3C32",background:`${sData.color}20`,padding:"3px 10px",borderRadius:6,minWidth:32,textAlign:"center"}}>{sv}</span>
                    <span style={{fontSize:12,color:same?"#059669":"#D4AF37",fontWeight:800}}>{same?"＝":"≠"}</span>
                    <span style={{fontSize:13,fontWeight:800,color:"#1A3C32",background:`${qData.color}20`,padding:"3px 10px",borderRadius:6,minWidth:32,textAlign:"center"}}>{qv}</span>
                    <span style={{fontSize:10,color:same?"#059669":"#D4AF37",marginLeft:"auto",fontWeight:800}}>{same?"일치":"차이"}</span>
                  </div>);
                })}
              </div>
            </div>

            {/* 왜 이런 간극 — 회색박스강조 */}
            {!isSame&&<div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>💡 왜 이런 간극이 생겼을까요?: "타고난 결과 살아온 결의 차이 해석"</div>
              <div style={{background:"#f8f9fa",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all"}}>
                  <strong>{sData.name}({sData.mbti})</strong>으로 태어난 {personName}님, 그런데 살아오면서 <strong>{qData.name}({qData.mbti})</strong>처럼 살고 있네요. 타고난 기질과 살아온 방식의 간극은 나쁜 게 아니에요. 환경과 경험이 당신을 다듬어온 흔적이에요. 이 간극을 이해하면 "<em>왜 나는 이럴까?</em>"의 답이 보여요.
                </div>
              </div>
            </div>}

            {/* 두 기질의 시너지 — 회색박스강조 */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>✨ 두 기질의 시너지: "두 결이 만났을 때 피어나는 강점"</div>
              <div style={{background:"#f8f9fa",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:11,color:"#555",lineHeight:1.85,wordBreak:"keep-all"}}>
                  <strong style={{color:sData.color}}>{sData.name}의 {sData.strengths[0]}</strong> + <strong style={{color:qData.color}}>{qData.name}의 {qData.strengths[0]}</strong> = <strong style={{color:"#059669"}}>더 깊고 입체적인 당신만의 강점</strong>. 두 기질이 균형을 이룰 때, {personName}님만이 가질 수 있는 독특한 매력이 피어나요.
                </div>
              </div>
            </div>
          </div>
          {/* v355: 하단 해시태그 — 페이지 1·2·3과 동일 형식 통일 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,borderTop:"1px solid #f0f0f0"}}>
            <span>#{`천기기질도`} #{`성격분석`} #{`기질분석`} #{`동양식16유형`} #{(personName||"").replace(/\s/g,"")} #{`${qData.name}형`} #{qData.mbti}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
        </div>}

        {/* v348: 페이지 4 — 개운법 & 천기의 한마디 (페이지 3에서 분리) */}
        {resultTab===4&&<div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333",marginBottom:12}}>
          {/* 헤더 — 페이지 1·2·3과 통일 (양끝 구분선 한 겹) */}
          <div style={{padding:"10px 16px 14px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>🌿 개운법</div>
          </div>
          <div style={{padding:"16px"}}>
            {/* 축별 보완 조언 — 회색박스강조 (간격 통일 marginBottom:16, padding:"14px 16px") */}
            {advices.length>0&&<div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>🔧 축별 보완 조언: "차이 나는 축마다 균형 잡는 한마디"</div>
              <div style={{background:"#f8f9fa",borderRadius:12,padding:"14px 16px"}}>
                {advices.map((adv,i)=>(
                  <div key={i} style={{marginBottom:i===advices.length-1?0:12}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:4,letterSpacing:0.5}}>💡 {AXIS_HANJA_SHORT[adv.axis]} 보완 — {adv.title}</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.75,wordBreak:"keep-all"}}>{adv.msg}</div>
                  </div>
                ))}
              </div>
            </div>}

            {/* 개운 포인트 — 회색박스강조 (간격 통일) */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:800,color:"#333",marginBottom:6}}>✨ {personName}님의 개운 포인트: "운의 흐름을 끌어올리는 키 아이템"</div>
              <div style={{background:"#f8f9fa",borderRadius:12,padding:"14px 16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    {icon:"🔢",label:"행운의 숫자",value:sData.lucky_num,color:"#D4AF37"},
                    {icon:"🎨",label:"행운의 색깔",value:sData.lucky_color,color:"#7c3aed"},
                    {icon:"🧭",label:"행운의 방향",value:sData.lucky_dir,color:"#059669"},
                    {icon:"🛡️",label:"수호 아이템",value:sData.lucky_item,color:"#e03131"},
                  ].map(item=>(
                    <div key={item.label} style={{background:"#fff",borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
                      <div style={{fontSize:10,color:item.color,fontWeight:800,marginBottom:6,letterSpacing:0.5}}>{item.icon} {item.label}</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#1A3C32",lineHeight:1.4,wordBreak:"keep-all"}}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 천기의 한마디 — 무지개 박스 표준 (간격 통일 marginBottom:16) */}
            <div style={{marginBottom:16,borderRadius:16,padding:1.5,backgroundImage:"linear-gradient(135deg,#ffb8b8,#ffd9a8,#b8e0c8,#bcd6f0,#cdc5e8)",boxShadow:"0 4px 14px rgba(155,143,212,0.08)"}}>
              <div style={{background:"#fafbfd",borderRadius:14.5,padding:"20px 18px",textAlign:"center"}}>
                <div style={{fontSize:13,color:"#1A3C32",letterSpacing:1.5,fontWeight:900,marginBottom:10}}>🔮 천기의 한마디</div>
                <div style={{fontSize:13,color:"#1A3C32",fontWeight:700,lineHeight:1.85,wordBreak:"keep-all",fontFamily:"'Noto Serif KR','Batang',serif"}}>{personName}님은 {sData.name}의 기운을 타고났어요. {sData.strengths[0]}과 {qData.strengths[0]}을 함께 가진 당신만의 빛나는 길을 걸어가세요. ✨</div>
              </div>
            </div>
          </div>
          {/* v355: 하단 해시태그 — 페이지 1·2·3과 동일 형식 통일 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,borderTop:"1px solid #f0f0f0"}}>
            <span>#{`천기기질도`} #{`성격분석`} #{`기질분석`} #{`동양식16유형`} #{(personName||"").replace(/\s/g,"")} #{`${qData.name}형`} #{qData.mbti}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
        </div>}

        {/* ✦ 유명인 매칭 — 탭 1·2 안으로 이동됨 (사용자 요청 v249: 사주/테스트 기반 분리) */}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ✦ 항상 노출 — 16 기질도 전체 도감 (v349: 결과카드와 여백 추가) */}
        <button onClick={()=>setShowCollection(true)} style={{width:"100%",padding:"14px",marginTop:14,marginBottom:14,background:"linear-gradient(135deg,#fef9e7,#fff8db)",color:"#6b21a8",border:"2px solid rgba(155,143,212,0.4)",borderRadius:14,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
          📚 16 기질도 전체 도감 보기 (찰떡·상극 포함)
        </button>

        {/* 1. 광고배너 (연계 콘텐츠) — 내관상보기 패턴 그대로 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
          {[
            {ic:"🧠",q:"숨겨진 뇌 특성은?",name:"뇌과학 분석 →",bc:"rgba(5,77,149,0.3)",sid:"psych"},
            {ic:"❤️",q:"가장 잘 맞는 인연은?",name:"연애운·궁합 →",bc:"rgba(244,143,177,0.3)",sid:"love"},
            {ic:"☯️",q:"내 사주 풀코스는?",name:"사주 풀이 →",bc:"rgba(155,143,212,0.3)",sid:"saju"},
            {ic:"👶",q:"우리 아이 기질은?",name:"2세 성격 예측 →",bc:"rgba(165,214,167,0.3)",sid:"baby_face"},
          ].map(ad=>(
            <div key={ad.name} style={{background:"#ffffff",borderRadius:12,padding:"12px 8px",border:`2px solid ${ad.bc}`,textAlign:"center",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(ad.sid,ad.name.replace(" →",""),ad.ic,"")}>
              <div style={{fontSize:22,marginBottom:4,fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"}}>{ad.ic}</div>
              <div style={{fontSize:12,fontWeight:900,color:"#0a1f1a",marginBottom:3}}>{ad.q}</div>
              <div style={{fontSize:9,fontWeight:600,color:"#666"}}>{ad.name}</div>
            </div>
          ))}
        </div>
        {/* 2. 공유 (ResultActions = 카톡/링크) — 내관상보기 동일 컴포넌트 */}
        {helpers?.ResultActions&&<helpers.ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="gijildo-capture"/>}
        {/* 3. 이것도 해볼래요 — 내관상보기 동일 카드 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[
              {ic:"🔢",name:"수비학",price:"980원",sid:"numerology"},
              {ic:"⏳",name:"전생 운세",price:"980원",sid:"past_life"},
              {ic:"📸",name:"관상짤",price:"380원",sid:"gwansang_zal"},
              {ic:"🪞",name:"내 관상보기",price:"980원",sid:"gwansang_full"},
              {ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"},
              {ic:"🔮",name:"12수호신",price:"무료",sid:"ytype_intro"},
            ].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#B8942E"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 4. 굿즈 (GoodsRecSection = 내관상보기 동일 컴포넌트) */}
        {helpers?.GoodsRecSection&&<helpers.GoodsRecSection svcId="gijildo" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{onClose?.();onGoShop?.();}} title={`${sData.name}형 맞춤 개운 굿즈`} sub={`${sData.emoji} 행운의 아이템으로 기운을 끌어올려보세요`}/>}
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>

        {/* 📚 16종 기질도 도감 모달 */}
        {showCollection&&(()=>{
          // v313: 사주 / 살아온 2개 표 동시 표시
          const sCur=sajuInfo?.code?TYPES[sajuInfo.code]:null;
          const qCur=qType?TYPES[qType]:null;
          const cur=qCur||sCur;
          // v354: 강조 박스 — 사주(내타입/찰떡/상극) + 살아온(내타입/찰떡/상극) 6개
          const meCodes=[sajuInfo?.code,qType].filter(Boolean);
          const bestCodes=[sCur?.match,qCur?.match].filter(Boolean);
          const worstCodes=[sCur?.anti,qCur?.anti].filter(Boolean);
          const groups=[
            {key:"양",label:"☀️ 양(陽) — 외향·드러나는 기운",color:"#E8532A",codes:["양천리강","양천리유","양천정강","양천정유","양지리강","양지리유","양지정강","양지정유"]},
            {key:"음",label:"🌙 음(陰) — 내향·깊어지는 기운",color:"#7986CB",codes:["음천리강","음천리유","음천정강","음천정유","음지리강","음지리유","음지정강","음지정유"]},
          ];
          return <div className="ov" onClick={()=>setShowCollection(false)}>
            <div className="md" style={{maxHeight:"92vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
              <div className="hd"/>
              <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
                <button onClick={()=>setShowCollection(false)} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{background:"#FDFCF8",borderRadius:18,padding:"18px 16px 20px",marginBottom:14,boxShadow:"0 8px 28px rgba(0,0,0,0.3)",border:"2px solid rgba(201,167,78,0.35)",color:"#333"}}>
              <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",marginBottom:10}}>🔮 천기(天機) 오리지널 | 16 기질도 도감</div>
              <div style={{textAlign:"center",fontSize:54,marginBottom:6}}>🧬</div>
              <div style={{textAlign:"center",fontSize:22,fontWeight:900,color:"#1A1A1A",fontFamily:"'Noto Serif KR','Batang',serif",marginBottom:4,lineHeight:1.4}}>16 기질도 전체 도감</div>
              <div style={{textAlign:"center",fontSize:12,color:"#7A5C00",marginBottom:14,fontWeight:600}}>음양 × 천지 × 리정 × 강유 = 16유형</div>

              {/* v313: 사주 / 살아온 2개 표 (내 타입 + 찰떡/상극) */}
              {(()=>{
                const renderTypeCard=(meType,label)=>{
                  if(!meType)return null;
                  const best=meType.match;const worst=meType.anti;
                  return (
                    <div key={label} style={{background:"linear-gradient(135deg,#fffbe9,#fff5d6)",border:"2px solid rgba(201,167,78,0.45)",borderRadius:14,padding:"14px",marginBottom:12}}>
                      <div style={{fontSize:10,color:"#7A5C00",fontWeight:800,letterSpacing:1.5,textAlign:"center",marginBottom:10}}>{label}: {meType.name}형</div>
                      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                        <div style={{width:84,height:84,borderRadius:"50%",overflow:"hidden",border:"3px double rgba(201,167,78,0.55)",boxShadow:"0 4px 12px rgba(201,167,78,0.25)",background:"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                          <span style={{position:"absolute",fontSize:38,zIndex:0}}>{meType.emoji}</span>
                          <img src={meType.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:900,color:"#1A1A1A",marginBottom:4,fontFamily:"'Noto Serif KR','Batang',serif"}}>{meType.emoji} {meType.name}형 ({meType.mbti})</div>
                          <div style={{fontSize:11,color:"#C4922A",fontWeight:700,marginBottom:3}}>{meType.subtitle}</div>
                          <div style={{fontSize:10,color:"#666",lineHeight:1.5,wordBreak:"keep-all"}}>{meType.hanja}</div>
                        </div>
                      </div>
                      {(best||worst)&&(
                        <div style={{display:"grid",gridTemplateColumns:best&&worst?"1fr 1fr":"1fr",gap:8,paddingTop:10,borderTop:"1px dashed rgba(201,167,78,0.3)"}}>
                          {best&&TYPES[best]&&(()=>{
                            const t=TYPES[best];
                            return <div style={{background:"#eff8f1",border:"1.5px solid #86efac",borderRadius:12,padding:"10px 10px 12px",textAlign:"center"}}>
                              <div style={{fontSize:9,color:"#16a34a",fontWeight:800,letterSpacing:1.5,marginBottom:6}}>💚 찰떡 궁합</div>
                              <div style={{width:48,height:48,margin:"0 auto 4px",borderRadius:"50%",overflow:"hidden",background:"#fff",border:`1.5px solid ${t.color}55`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                                <span style={{position:"absolute",fontSize:22,zIndex:0}}>{t.emoji}</span>
                                <img src={t.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                              </div>
                              <div style={{fontSize:12,fontWeight:800,color:"#1e3a2a",lineHeight:1.3,marginBottom:2}}>{t.name}형</div>
                              <div style={{fontSize:9,color:"#16a34a",fontWeight:700,marginBottom:6}}>{t.subtitle}</div>
                              <div style={{fontSize:10,color:"#365f4a",lineHeight:1.55,wordBreak:"keep-all",textAlign:"left",background:"#fff",borderRadius:8,padding:"6px 8px",border:"1px solid #d4f0dd"}}>
                                ✦ <b>{t.strengths.slice(0,2).join(" · ")}</b>이 {meType.name}형의 결과 자연스럽게 어울려요.<br/>서로의 빈 곳을 채워주는 사이라 옆에 있으면 마음이 편해져요.
                              </div>
                            </div>;
                          })()}
                          {worst&&TYPES[worst]&&(()=>{
                            const t=TYPES[worst];
                            return <div style={{background:"#fef2f2",border:"1.5px solid #fcb6b6",borderRadius:12,padding:"10px 10px 12px",textAlign:"center"}}>
                              <div style={{fontSize:9,color:"#dc2626",fontWeight:800,letterSpacing:1.5,marginBottom:6}}>⚡ 상극 유형</div>
                              <div style={{width:48,height:48,margin:"0 auto 4px",borderRadius:"50%",overflow:"hidden",background:"#fff",border:`1.5px solid ${t.color}55`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                                <span style={{position:"absolute",fontSize:22,zIndex:0}}>{t.emoji}</span>
                                <img src={t.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                              </div>
                              <div style={{fontSize:12,fontWeight:800,color:"#7c1d1d",lineHeight:1.3,marginBottom:2}}>{t.name}형</div>
                              <div style={{fontSize:9,color:"#dc2626",fontWeight:700,marginBottom:6}}>{t.subtitle}</div>
                              <div style={{fontSize:10,color:"#7c1d1d",lineHeight:1.55,wordBreak:"keep-all",textAlign:"left",background:"#fff",borderRadius:8,padding:"6px 8px",border:"1px solid #fcd9d9"}}>
                                ⚠️ <b>{t.strengths.slice(0,2).join(" · ")}</b>의 결이 {meType.name}형과 부딪히기 쉬워요.<br/>나쁜 인연이 아니라, 서로 거리를 두고 존중할 때 빛나는 관계예요.
                              </div>
                            </div>;
                          })()}
                        </div>
                      )}
                    </div>
                  );
                };
                return <>
                  {renderTypeCard(sCur,"🔯 사주 기반 내 타입")}
                  {renderTypeCard(qCur,"🪞 살아온 내 타입")}
                  <div style={{fontSize:10,color:"#7A5C00",margin:"4px 0 10px",textAlign:"center",lineHeight:1.6}}>아래 16종 중 ✦ 표시가 내 타입이에요</div>
                </>;
              })()}

              {/* 양/음 그룹별 16종 */}
              {groups.map(g=>(
                <div key={g.key} style={{marginBottom:14,paddingTop:12,borderTop:"1px dashed rgba(0,0,0,0.1)"}}>
                  <div style={{fontSize:13,fontWeight:800,color:g.color,marginBottom:8,letterSpacing:1}}>✦ {g.label}</div>
                  {g.codes.map(code=>{
                    const t=TYPES[code];if(!t)return null;
                    // v354: 사주 + 살아온 두 결의 내타입/찰떡/상극 모두 강조 (총 6개)
                    const isMe=meCodes.includes(code);
                    const isBest=bestCodes.includes(code);
                    const isWorst=worstCodes.includes(code);
                    const accent=isMe?(t.color||"#C4922A"):isBest?"#16a34a":isWorst?"#dc2626":"transparent";
                    return <div key={code} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 12px",marginBottom:12,background:isMe?"rgba(201,167,78,0.12)":isBest?"rgba(22,163,74,0.05)":isWorst?"rgba(220,38,38,0.05)":"#F9F7F2",border:isMe||isBest||isWorst?`2px solid ${accent}`:"1px solid transparent",borderRadius:10}}>
                      <div style={{width:48,height:48,borderRadius:"50%",overflow:"hidden",border:`1px solid ${t.color}55`,background:"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                        <span style={{position:"absolute",fontSize:22,zIndex:0}}>{t.emoji}</span>
                        <img src={t.card} alt="" style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:1}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{t.emoji} {t.name}형 <span style={{fontSize:10,color:"#888",fontWeight:500}}>({t.mbti})</span>{isMe&&<span style={{color:accent,marginLeft:6,fontSize:10,fontWeight:900}}>✦ 내 타입</span>}{isBest&&<span style={{color:"#16a34a",marginLeft:6,fontSize:10,fontWeight:900}}>💚 찰떡</span>}{isWorst&&<span style={{color:"#dc2626",marginLeft:6,fontSize:10,fontWeight:900}}>⚡ 상극</span>}</div>
                        <div style={{fontSize:10,color:t.color,marginTop:2,fontWeight:600}}>{t.subtitle}</div>
                        <div style={{fontSize:10,color:"#666",marginTop:1,lineHeight:1.4,wordBreak:"keep-all"}}>{code} · {t.hanja}</div>
                      </div>
                    </div>;
                  })}
                </div>
              ))}
              </div>
              <button className="btn btn-p" onClick={()=>setShowCollection(false)}>확인</button>
            </div>
          </div>;
        })()}

        {/* v198: 결과 화면의 중복 결제완료 모달 제거 — pay 화면 모달(line 528)만 사용 */}
      </div></div>
    );
  }
  return null;
}
