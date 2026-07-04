import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 사주 계산
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CHEONGAN = ["갑","을","병","정","무","기","경","신","임","계"];
const JIJI = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
const CG_YANG_IDX = [0,2,4,6,8];
const CG_OHANG = ["목","목","화","화","토","토","금","금","수","수"];
const JJ_OHANG = ["수","토","목","목","토","화","화","토","금","금","토","수"];
const JJ_YANG_IDX = [2,3,6,7,10];

function getSaju(year, month, day, hour) {
  const yearCG = (year - 4) % 10;
  const yearJJ = (year - 4) % 12;
  const monthJJ = (month + 1) % 12;
  const monthCG = ((Math.floor(((year-4)%10)/1) % 5) * 2 + month - 1) % 10;
  const a = Math.floor((14 - month) / 12);
  const y = year - a, m = month + 12*a - 2;
  const jd = day + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const dayCG = (jd+4)%10, dayJJ = (jd+4)%12;
  let hourJJ=-1, hourCG=-1;
  if(hour!=null){ hourJJ=Math.floor(((hour+1)%24)/2)%12; hourCG=((dayCG%5)*2+hourJJ)%10; }
  return { year:{cg:yearCG,jj:yearJJ}, month:{cg:monthCG,jj:monthJJ}, day:{cg:dayCG,jj:dayJJ},
    hour:hourJJ>=0?{cg:hourCG,jj:hourJJ}:null, ilgan:dayCG };
}

function getOhangScore(saju) {
  const s={목:0,화:0,토:0,금:0,수:0};
  const ps=[saju.year,saju.month,saju.day]; if(saju.hour) ps.push(saju.hour);
  ps.forEach(p=>{ s[CG_OHANG[p.cg]]+=2; s[JJ_OHANG[p.jj]]+=3; }); return s;
}

function saJuToType(saju) {
  const ilgan=saju.ilgan, oh=getOhangScore(saju);
  const 기운=CG_YANG_IDX.includes(ilgan)?"양":"음";
  const 인식=(oh["목"]+oh["화"])>=(oh["토"]+oh["금"]+oh["수"])?"천":"지";
  const ilOh=CG_OHANG[ilgan];
  const 판단=(ilOh==="금"||ilOh==="수")?"리":"정";
  const ps=[saju.year,saju.month,saju.day]; if(saju.hour) ps.push(saju.hour);
  let yc=0,tot=0;
  ps.forEach(p=>{ if(CG_YANG_IDX.includes(p.cg))yc++; if(JJ_YANG_IDX.includes(p.jj))yc++; tot+=2; });
  const 생활=yc>=tot/2?"강":"유";
  return { code:기운+인식+판단+생활, 기운,인식,판단,생활, ohang:oh, ilganName:CHEONGAN[ilgan] };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16유형 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TYPES = {
  "양천리강":{ hanja:"陽天理剛", mbti:"ENTJ", name:"청룡", emoji:"🐉", color:"#4FC3F7", badge:"#1a3a4a",
    subtitle:"하늘을 가르는 용", shared:true,
    desc:"타고난 지도자. 직관과 논리로 미래를 설계하고 강한 의지로 반드시 실현해낸다. 주변이 자연스럽게 따르게 되는 기운을 가졌다.",
    character:"갑옷 입은 청년 장군. 번개를 손에 쥐고 청색 망토를 휘날리며 서 있다.",
    strengths:["전략적 사고","추진력","카리스마","비전 제시"],
    weak:"상대의 감정을 놓칠 수 있어. 잠깐 멈추고 주변을 살피는 습관이 필요해.",
    jobs:["CEO","정치가","전략 컨설턴트","군 지휘관"],
    love:"관계에서도 주도권을 잡으려 해. 상대의 속도를 존중해주면 훨씬 깊은 사랑이 돼.",
    match:"음지정유", anti:"양천리강", celeb:"나폴레옹, 스티브 잡스, BTS RM, 마거릿 대처, 고든 램지" },
  "양천리유":{ hanja:"陽天理柔", mbti:"ENTP", name:"봉황", emoji:"🔥", color:"#FF7043", badge:"#3a1a0a",
    subtitle:"판을 뒤집는 혁명가", shared:true,
    desc:"아이디어의 화신. 기존 틀을 깨고 새로운 가능성을 탐색하는 것이 본능이다. 토론에서 살아나고 변화를 즐긴다.",
    character:"불꽃 날개 달린 학자형. 한 손엔 책, 한 손엔 불꽃. 반쯤 웃는 눈빛.",
    strengths:["창의력","논리적 유연성","토론 능력","혁신"],
    weak:"시작은 폭발적인데 마무리가 약해. 끝맺음을 의식적으로 챙겨봐.",
    jobs:["스타트업 창업자","발명가","방송인","마케터"],
    love:"연애도 게임처럼 즐기는 경향이 있어. 진심을 표현하는 연습이 관계를 깊게 해.",
    match:"음지정강", anti:"양천리유", celeb:"에디슨, 유재석, 일론 머스크, 소크라테스, 셰익스피어" },
  "양천정강":{ hanja:"陽天情剛", mbti:"ENFJ", name:"백학", emoji:"🕊️", color:"#81C784", badge:"#1a2e1a",
    subtitle:"모든 이의 길잡이", shared:true,
    desc:"사람을 이끄는 타고난 멘토. 직관으로 상대의 마음을 읽고 따뜻하게 이끌어 성장시킨다.",
    character:"흰 도포의 현인. 주변에 학이 날아다니고 한 손엔 연꽃. 온화한 미소.",
    strengths:["공감 능력","리더십","소통력","헌신"],
    weak:"남을 너무 챙기다 나 자신을 소진할 수 있어. 내 감정도 소중히 챙겨.",
    jobs:["교사","상담사","NGO 활동가","인사담당자"],
    love:"상대를 위해 모든 걸 하는 헌신적인 파트너야. 내가 원하는 것도 말해줘.",
    match:"음지리유", anti:"양천정강", celeb:"오프라 윈프리, 아이유, 버락 오바마, 마틴 루터 킹, 방탄소년단 진" },
  "양천정유":{ hanja:"陽天情柔", mbti:"ENFP", name:"기린", emoji:"🦄", color:"#CE93D8", badge:"#2a1a3a",
    subtitle:"바람처럼 왔다가는 자", shared:true,
    desc:"무한한 가능성을 보는 자유로운 영혼. 사람을 사랑하고 어디서든 영감을 찾아낸다.",
    character:"뿔 달린 선녀. 연보라+금빛 한복, 구름 위에서 꽃비를 맞으며 맨발로 서 있다.",
    strengths:["열정","창의성","공감력","낙관주의"],
    weak:"현실 감각을 좀 더 챙기면 꿈이 실제로 이뤄져. 계획 하나만 잡아봐.",
    jobs:["크리에이터","작가","배우","사회운동가"],
    love:"사랑에 빠지면 온 우주가 그 사람이 돼. 관계의 지속력을 위해 현실도 챙겨.",
    match:"음지리강", anti:"양천정유", celeb:"BTS 뷔, 로빈 윌리엄스, 마크 트웨인, 레이디 가가, 르네 마그리트" },
  "양지리강":{ hanja:"陽地理剛", mbti:"ESTJ", name:"백호", emoji:"🐯", color:"#FFB74D", badge:"#3a2a0a",
    subtitle:"땅을 지키는 수호신", shared:true,
    desc:"질서와 책임감의 상징. 현실을 정확히 파악하고 계획대로 실행하며 공동체를 굳건히 지킨다.",
    character:"호랑이 문양 금빛 갑옷의 무장. 강인한 체격으로 팔짱 끼고 대지 위에 서 있다.",
    strengths:["책임감","조직력","실행력","신뢰성"],
    weak:"융통성이 부족해 보일 수 있어. 때로는 예외를 허용하는 것도 지혜야.",
    jobs:["관리자","법조인","군인","회계사"],
    love:"안정적이고 믿음직한 파트너야. 감정 표현을 조금만 더 해주면 완벽해.",
    match:"음천정유", anti:"양지리강", celeb:"박지성, 반기문, 엠마 왓슨, 세종대왕, 드와이트 아이젠하워" },
  "양지리유":{ hanja:"陽地理柔", mbti:"ESTP", name:"급류", emoji:"🌊", color:"#26C6DA", badge:"#0a2a2e",
    subtitle:"흐름을 타는 자", shared:false,
    desc:"현실의 파도를 타는 행동가. 이론보다 실전, 계획보다 즉흥이 특기. 위기 상황에서 오히려 빛나는 유형.",
    character:"파도를 맨발로 타는 젊은 무사. 쪽빛 의상에 물결 문양, 젖은 머리로 역동적인 자세.",
    strengths:["즉응력","현실감각","담대함","문제 해결"],
    weak:"충동적 결정이 나중에 발목을 잡을 수 있어. 2초만 더 생각해봐.",
    jobs:["스포츠 선수","응급의사","영업인","탐험가"],
    love:"자극적이고 재미있는 연애를 즐겨. 안정을 원하는 상대에게는 노력이 필요해.",
    match:"음천정강", anti:"양지리유", celeb:"손흥민, 어니스트 헤밍웨이, 잭 니콜슨, 마돈나, 벤자민 프랭클린" },
  "양지정강":{ hanja:"陽地情剛", mbti:"ESFJ", name:"대지", emoji:"🌻", color:"#A5D6A7", badge:"#1a2e1a",
    subtitle:"모두를 품는 대지", shared:false,
    desc:"공동체를 살찌우는 존재. 주변 사람들의 필요를 누구보다 먼저 알아채고 묵묵히 챙기는 따뜻한 기둥.",
    character:"황토색 풍성한 한복의 어머니상. 양팔에 곡식과 꽃을 들고 환하게 웃는다.",
    strengths:["배려","사회성","책임감","화합 능력"],
    weak:"남의 평가에 너무 신경 쓰는 경향이 있어. 내 기준으로 살아도 충분히 좋아.",
    jobs:["간호사","교사","이벤트 플래너","사회복지사"],
    love:"사랑하는 사람을 온 힘으로 챙겨. 나를 위한 시간도 꼭 가져.",
    match:"음천리유", anti:"양지정강", celeb:"박보검, 테일러 스위프트, 월트 디즈니, 빌 클린턴, 젠니퍼 가너" },
  "양지정유":{ hanja:"陽地情柔", mbti:"ESFP", name:"나비", emoji:"🦋", color:"#F48FB1", badge:"#2e0a1a",
    subtitle:"세상을 꽃밭으로 만드는 자", shared:false,
    desc:"삶을 축제로 만드는 사람. 현재의 아름다움을 포착하고 주변에 생기를 전파한다.",
    character:"나비 날개 달린 무희. 분홍·금 한복에 나비 머리핀, 발끝으로 서서 춤추는 자세.",
    strengths:["유쾌함","감수성","친화력","현재 집중"],
    weak:"미래 준비가 약할 수 있어. 즐기면서도 조금씩 쌓아가는 습관을 만들어봐.",
    jobs:["연예인","플로리스트","여행가이드","뷰티 크리에이터"],
    love:"연애할 때 온 세상이 반짝거려. 진지한 대화도 나눌 줄 알면 관계가 깊어져.",
    match:"음천리강", anti:"양지정유", celeb:"제니, 마릴린 먼로, 엘튼 존, 케이티 페리, 아델" },
  "음천리강":{ hanja:"陰天理剛", mbti:"INTJ", name:"현무", emoji:"🐢", color:"#7986CB", badge:"#1a1a3a",
    subtitle:"천 년을 내다보는 자", shared:true,
    desc:"혼자만의 우주에서 세계를 설계한다. 겉보다 훨씬 깊고 치밀한 내면을 가진 진짜 실력자.",
    character:"흑갑 입은 노학자. 거북 문양 방패, 긴 수염, 냉철한 눈빛. 먹구름 배경.",
    strengths:["전략 수립","독립성","깊이","장기 사고"],
    weak:"혼자 다 하려는 경향이 있어. 사람을 믿고 의지하는 것도 전략이야.",
    jobs:["과학자","전략가","아키텍트","소설가"],
    love:"좀처럼 마음을 열지 않지만 한번 열리면 평생 헌신해. 표현을 조금만 더 해줘.",
    match:"양지정유", anti:"음천리강", celeb:"니체, 크리스토퍼 놀란, 일론 머스크, 아이작 뉴턴, 미셸 오바마" },
  "음천리유":{ hanja:"陰天理柔", mbti:"INTP", name:"안개", emoji:"🌫️", color:"#B0BEC5", badge:"#1e2022",
    subtitle:"아무도 모르는 것을 아는 자", shared:false,
    desc:"진리를 향한 끝없는 여정. 세상의 작동 원리를 이해하고 싶어하며 새로운 것을 생각한다.",
    character:"안개 속 반쯤 가려진 신선. 회색 도포, 둥근 안경, 책 속에 파묻혀 흐릿한 윤곽.",
    strengths:["분석력","독창성","논리","지적 호기심"],
    weak:"생각이 너무 많아 실행이 늦어질 수 있어. 60점짜리라도 일단 내보내봐.",
    jobs:["철학자","수학자","게임 개발자","연구원"],
    love:"이론으로는 완벽한 연애를 구상하지만 표현이 서툴러. 연습이 필요해.",
    match:"양지정강", anti:"음천리유", celeb:"아인슈타인, 빌 게이츠, 찰스 다윈, 에이브러햄 링컨, 래리 페이지" },
  "음천정강":{ hanja:"陰天情剛", mbti:"INFJ", name:"달빛", emoji:"🌙", color:"#9575CD", badge:"#1a0a2e",
    subtitle:"보이지 않는 것을 보는 자", shared:false,
    desc:"가장 드문 기질. 깊은 직관으로 사람의 미래를 보고 조용하지만 강한 의지로 세상을 바꾸려 한다.",
    character:"달을 등진 무녀. 남색 한복, 달 장신구, 긴 머리. 조용히 눈을 감고 달빛 후광.",
    strengths:["통찰력","이상주의","공감","의지"],
    weak:"완벽주의가 자신을 갉아먹을 수 있어. 지금 이대로도 충분해.",
    jobs:["작가","심리치료사","종교인","사회 활동가"],
    love:"영혼의 연결을 원해. 진짜 이해해주는 한 명이면 충분해.",
    match:"양지리유", anti:"음천정강", celeb:"달라이 라마, 넬슨 만델라, 마틴 루터 킹, 레오나르도 다빈치, 방탄소년단 RM" },
  "음천정유":{ hanja:"陰天情柔", mbti:"INFP", name:"난초", emoji:"🌸", color:"#F06292", badge:"#2e0a1a",
    subtitle:"말 없이 세상을 물들이는 자", shared:false,
    desc:"내면에 거대한 서사를 품은 존재. 세상이 더 아름다워질 수 있다고 믿으며 그 믿음을 지켜나간다.",
    character:"난초 정원의 시인. 연분홍 도포, 붓을 들고 섬세한 손. 슬픈 듯 온화한 눈빛.",
    strengths:["감수성","창의성","신념","공감"],
    weak:"현실과 이상의 간극에 힘들어할 수 있어. 작은 것부터 바꿔도 충분히 의미 있어.",
    jobs:["시인","상담사","예술가","작가"],
    love:"깊고 낭만적인 사랑을 꿈꿔. 현실의 상대에게도 그 감정을 표현해줘.",
    match:"양천리강", anti:"음지정유", celeb:"헤르만 헤세, 뉴진스 민지, 윌리엄 셰익스피어, 오드리 헵번, 조니 뎁" },
  "음지리강":{ hanja:"陰地理剛", mbti:"ISTJ", name:"바위", emoji:"🪨", color:"#78909C", badge:"#1a1e20",
    subtitle:"천만 년 흔들리지 않는 자", shared:false,
    desc:"신뢰와 책임의 상징. 말보다 행동으로 증명하고 한번 맡은 것은 끝까지 해낸다.",
    character:"거대한 바위산 앞의 노장. 회갈색 무복, 팔짱, 무표정. 흔들리지 않는 자세.",
    strengths:["성실함","신뢰성","꼼꼼함","인내력"],
    weak:"변화에 저항하는 경향이 있어. 새로운 방법이 더 효율적일 수 있어.",
    jobs:["회계사","공무원","엔지니어","의사"],
    love:"말없이 옆에 있어주는 든든한 파트너야. 감정 표현을 조금만 더 하면 완벽해.",
    match:"양천정유", anti:"음지리강", celeb:"워렌 버핏, 류현진, 조지 워싱턴, 앙겔라 메르켈, 나트 킹 콜" },
  "음지리유":{ hanja:"陰地理柔", mbti:"ISTP", name:"주작", emoji:"🦚", color:"#FF8A65", badge:"#2e1a0a",
    subtitle:"홀로 완성하는 장인", shared:true,
    desc:"손으로 세상을 이해하는 장인. 말보다 기술, 감정보다 논리. 혼자서 깊이 파고드는 것이 강점.",
    character:"붉은 새 문양 먹빛 도복의 장인. 집중한 눈빛으로 섬세한 손을 써서 조용히 무언가를 만드는 중.",
    strengths:["기술적 능력","냉정함","실용성","집중력"],
    weak:"감정 표현이 부족해 상대가 오해할 수 있어. 한마디라도 더 말해줘.",
    jobs:["엔지니어","외과의사","파일럿","장인"],
    love:"말보다 행동으로 사랑해. 상대가 모를 수 있으니 가끔은 말로도 표현해줘.",
    match:"양천정강", anti:"음지리유", celeb:"클린트 이스트우드, 키아누 리브스, 스티브 잡스, 어니스트 헤밍웨이, 미야자키 하야오" },
  "음지정강":{ hanja:"陰地情剛", mbti:"ISFJ", name:"옥토", emoji:"🌾", color:"#AED581", badge:"#1a2210",
    subtitle:"아무도 모르게 세상을 키우는 자", shared:false,
    desc:"보이지 않는 곳에서 세상을 지탱하는 존재. 주변 사람들을 세심하게 기억하고 챙긴다.",
    character:"논밭 배경의 아낙. 소박한 민초 의상, 흙 묻은 손으로 씨앗을 심는 중. 묵묵한 눈빛.",
    strengths:["세심함","헌신","기억력","안정감"],
    weak:"자기 감정을 너무 눌러놓는 경향이 있어. 내 감정도 표현할 권리가 있어.",
    jobs:["간호사","사서","교사","행정가"],
    love:"상대가 뭘 좋아하는지 다 기억하고 챙겨주는 최고의 파트너. 나도 받을 줄 알아야 해.",
    match:"양천리유", anti:"음지정강", celeb:"비욘세, 케이트 미들턴, 로사 파크스, 선미, 방탄소년단 뷔" },
  "음지정유":{ hanja:"陰地情柔", mbti:"ISFP", name:"들꽃", emoji:"🌼", color:"#FFEE58", badge:"#2e2a0a",
    subtitle:"조용히 피어나는 자", shared:false,
    desc:"세상의 아름다움을 조용히 느끼는 예술가적 영혼. 자기만의 방식으로 세상을 표현한다.",
    character:"들판에 혼자 앉은 소녀. 수수한 저고리, 맨발. 노란 꽃 한 송이를 들고 스케치하는 중.",
    strengths:["감수성","유연성","현재 집중","예술적 감각"],
    weak:"자신을 너무 낮추는 경향이 있어. 네 감각과 재능은 진짜 특별해.",
    jobs:["예술가","디자이너","요리사","동물 관련 직업"],
    love:"조용하지만 깊은 사랑을 줘. 상대가 눈치채도록 조금 더 표현해줘.",
    match:"양천리강", anti:"음지정유", celeb:"반 고흐, 마이클 잭슨, 프리다 칼로, 레이디 가가, 밥 딜런" },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 차이 보완 조언
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DIFF = {
  기운:{ "양→음":{title:"타고난 양기를 감추고 살아왔어요",msg:"외향적 에너지를 타고났지만 내향적으로 살아왔어요. 원래의 활기찬 자신을 표현할 공간을 의식적으로 만들어보세요."}, "음→양":{title:"타고난 음기보다 더 활발하게 살아왔어요",msg:"본래 내향적 기질인데 외향적으로 살아왔어요. 혼자 충전하는 시간을 꼭 확보해야 번아웃을 막을 수 있어요."} },
  인식:{ "천→지":{title:"타고난 직관을 억누르고 살아왔어요",msg:"직관적 감각을 타고났지만 현실적으로 살아왔어요. 때로는 느낌을 믿어보는 연습이 필요해요."}, "지→천":{title:"타고난 감각보다 더 직관적으로 살아왔어요",msg:"현실 감각이 강한 기질인데 직관에 의존해 왔어요. 중요한 결정에서 구체적인 데이터를 더 활용하면 실수가 줄어들어요."} },
  판단:{ "리→정":{title:"타고난 논리를 감추고 감성으로 살아왔어요",msg:"이성적 판단력을 타고났지만 감성적으로 살아왔어요. 내 판단을 더 신뢰하고 논리적으로 표현하는 연습이 필요해요."}, "정→리":{title:"타고난 감성을 억누르고 논리로 살아왔어요",msg:"감성적 기질인데 이성적으로 살아왔어요. 내 감정을 솔직히 인정하고 표현하는 연습이 필요해요."} },
  생활:{ "강→유":{title:"타고난 계획성을 내려놓고 살아왔어요",msg:"계획적 기질인데 유연하게 살아왔어요. 작은 것부터 계획하고 지키는 습관을 만들면 안정감이 높아져요."}, "유→강":{title:"타고난 유연함을 억누르고 살아왔어요",msg:"유연한 기질인데 계획에 얽매여 살아왔어요. 때로는 흐름에 맡기는 것도 지혜예요."} },
};

const AXIS_ORDER=["기운","인식","판단","생활"];
const AXIS_PAIRS={"기운":["양","음"],"인식":["천","지"],"판단":["리","정"],"생활":["강","유"]};
const AXIS_HANJA={"기운":"氣運(기운)","인식":"認識(인식)","판단":"判斷(판단)","생활":"生活(생활)"};
const AXIS_HANJA_SHORT={"기운":"氣運","인식":"認識","판단":"判斷","생활":"生活"};
const AXIS_DESC={"기운":"양(외향)·음(내향) — 에너지 방향","인식":"천(직관)·지(감각) — 세상을 보는 눈","판단":"리(이성)·정(감성) — 결정의 기준","생활":"강(계획)·유(유연) — 삶의 리듬"};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 40문항 (축당 10개)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const QUESTIONS = [
  // 기운 (양/음) 10개
  {id:1,axis:"기운",text:"주말에 아무 계획 없을 때 나는...",a:{label:"친구한테 연락해서 뭔가 만든다",code:"양"},b:{label:"혼자 쉬면서 재충전한다",code:"음"}},
  {id:2,axis:"기운",text:"처음 만나는 사람들 모임에 가면 나는...",a:{label:"먼저 말 걸고 자연스럽게 섞인다",code:"양"},b:{label:"분위기 파악하면서 천천히 적응한다",code:"음"}},
  {id:3,axis:"기운",text:"힘든 일이 있을 때 에너지를 회복하는 방법은...",a:{label:"누군가와 이야기하면서 풀린다",code:"양"},b:{label:"혼자 조용히 생각 정리하는 시간이 필요하다",code:"음"}},
  {id:4,axis:"기운",text:"파티나 모임에서 나는...",a:{label:"마지막까지 남아서 분위기를 이끈다",code:"양"},b:{label:"적당히 있다가 조용히 빠져나온다",code:"음"}},
  {id:5,axis:"기운",text:"칭찬받았을 때 나는...",a:{label:"기쁨을 표현하고 주변에 공유한다",code:"양"},b:{label:"혼자 조용히 뿌듯해한다",code:"음"}},
  {id:6,axis:"기운",text:"오랜만에 혼자 있는 시간이 생기면...",a:{label:"좀 답답하고 누군가에게 연락하고 싶다",code:"양"},b:{label:"너무 좋다. 이런 시간이 필요했다",code:"음"}},
  {id:7,axis:"기운",text:"새로운 환경(학교, 직장)에 처음 갔을 때 나는...",a:{label:"빠르게 사람들을 사귀고 적응한다",code:"양"},b:{label:"시간이 좀 걸리지만 깊은 관계를 만든다",code:"음"}},
  {id:8,axis:"기운",text:"전화 통화보다 카카오톡을 선호하는 이유는...",a:{label:"실시간으로 대화하는 게 더 재밌어서",code:"양"},b:{label:"생각 정리하고 답할 수 있어서",code:"음"}},
  {id:9,axis:"기운",text:"내가 스트레스를 받을 때 주변 사람들은...",a:{label:"티가 나서 대부분 알고 있다",code:"양"},b:{label:"잘 모른다. 혼자 삭히는 편이다",code:"음"}},
  {id:10,axis:"기운",text:"이상적인 생일 파티는...",a:{label:"친구들 많이 불러서 왁자지껄하게",code:"양"},b:{label:"가까운 1~2명이랑 조용하게",code:"음"}},

  // 인식 (천/지) 10개
  {id:11,axis:"인식",text:"새로운 아이디어가 떠올랐을 때 나는...",a:{label:"왠지 될 것 같은 느낌을 믿고 밀어붙인다",code:"천"},b:{label:"실제로 가능한지 따져보고 진행한다",code:"지"}},
  {id:12,axis:"인식",text:"책을 고를 때 나는...",a:{label:"현실에 없는 세계, 가능성을 다룬 책",code:"천"},b:{label:"실용적이고 바로 써먹을 수 있는 책",code:"지"}},
  {id:13,axis:"인식",text:"처음 만난 사람의 인상은...",a:{label:"첫인상 느낌이 거의 맞다",code:"천"},b:{label:"몇 번 만나봐야 알 수 있다",code:"지"}},
  {id:14,axis:"인식",text:"내가 더 신뢰하는 것은...",a:{label:"직감과 영감",code:"천"},b:{label:"경험과 데이터",code:"지"}},
  {id:15,axis:"인식",text:"대화할 때 나는...",a:{label:"비유, 가능성, 큰 그림 이야기를 좋아한다",code:"천"},b:{label:"구체적인 사실과 현실 이야기를 좋아한다",code:"지"}},
  {id:16,axis:"인식",text:"여행 계획을 짤 때 나는...",a:{label:"큰 방향만 잡고 현지에서 즉흥적으로",code:"천"},b:{label:"숙소, 식당, 동선 다 미리 정한다",code:"지"}},
  {id:17,axis:"인식",text:"업무나 공부할 때 나는...",a:{label:"왜 해야 하는지 의미와 맥락이 중요하다",code:"천"},b:{label:"어떻게 해야 하는지 방법과 순서가 중요하다",code:"지"}},
  {id:18,axis:"인식",text:"영화를 볼 때 나는...",a:{label:"메시지, 상징, 여운을 더 중요하게 본다",code:"천"},b:{label:"스토리의 현실성, 디테일이 중요하다",code:"지"}},
  {id:19,axis:"인식",text:"문제가 생겼을 때 나는...",a:{label:"이게 왜 생겼는지 근본 원인을 파고든다",code:"천"},b:{label:"일단 지금 당장 해결하는 게 먼저다",code:"지"}},
  {id:20,axis:"인식",text:"나는 주로...",a:{label:"미래의 가능성과 변화를 먼저 생각한다",code:"천"},b:{label:"지금 눈앞의 현실을 먼저 생각한다",code:"지"}},

  // 판단 (리/정) 10개
  {id:21,axis:"판단",text:"친구가 고민을 털어놓을 때 나는...",a:{label:"원인을 분석하고 해결책을 제시한다",code:"리"},b:{label:"먼저 공감하고 감정을 나눈다",code:"정"}},
  {id:22,axis:"판단",text:"갈등이 생겼을 때 나는...",a:{label:"논리적으로 옳고 그름을 따진다",code:"리"},b:{label:"서로 감정이 상하지 않는 방향을 찾는다",code:"정"}},
  {id:23,axis:"판단",text:"중요한 결정을 내릴 때 나는...",a:{label:"장단점을 분석해서 최선을 고른다",code:"리"},b:{label:"내 마음이 원하는 쪽을 선택한다",code:"정"}},
  {id:24,axis:"판단",text:"누군가를 처음 평가할 때 나는...",a:{label:"실력과 능력을 기준으로 본다",code:"리"},b:{label:"성격과 인간적인 면을 더 중요하게 본다",code:"정"}},
  {id:25,axis:"판단",text:"팀에서 의견이 충돌할 때 나는...",a:{label:"가장 합리적인 의견이 채택되어야 한다",code:"리"},b:{label:"팀 분위기와 모두의 감정을 고려해야 한다",code:"정"}},
  {id:26,axis:"판단",text:"내가 비판을 받을 때 나는...",a:{label:"내용이 맞는지 틀린지를 먼저 따진다",code:"리"},b:{label:"말하는 방식과 상대의 감정이 더 신경 쓰인다",code:"정"}},
  {id:27,axis:"판단",text:"친구가 잘못된 선택을 하려고 할 때 나는...",a:{label:"왜 그게 잘못됐는지 논리적으로 설명한다",code:"리"},b:{label:"감정을 건드리지 않게 부드럽게 말린다",code:"정"}},
  {id:28,axis:"판단",text:"규칙이나 원칙에 대해 나는...",a:{label:"예외 없이 지켜야 한다고 생각한다",code:"리"},b:{label:"상황에 따라 유연하게 적용해야 한다",code:"정"}},
  {id:29,axis:"판단",text:"칭찬할 때 나는...",a:{label:"구체적으로 잘한 점을 말해준다",code:"리"},b:{label:"상대가 기분 좋도록 따뜻하게 말한다",code:"정"}},
  {id:30,axis:"판단",text:"드라마에서 더 이해가 되는 인물은...",a:{label:"냉정하게 옳은 길을 가는 주인공",code:"리"},b:{label:"감정에 충실하게 선택하는 주인공",code:"정"}},

  // 생활 (강/유) 10개
  {id:31,axis:"생활",text:"약속 시간에 나는...",a:{label:"항상 미리 도착해서 기다린다",code:"강"},b:{label:"딱 맞춰 오거나 약간 늦는 편이다",code:"유"}},
  {id:32,axis:"생활",text:"일을 할 때 나는...",a:{label:"미리미리 해두는 게 마음이 편하다",code:"강"},b:{label:"마감 직전에 집중력이 폭발한다",code:"유"}},
  {id:33,axis:"생활",text:"하루 일정 관리 방식은...",a:{label:"계획표를 만들고 그대로 실행한다",code:"강"},b:{label:"그때그때 기분에 맞게 유연하게",code:"유"}},
  {id:34,axis:"생활",text:"여행에서 예상 못 한 일이 생기면...",a:{label:"빨리 대안을 찾아 계획을 복구한다",code:"강"},b:{label:"오히려 재밌는 변수라 생각하고 즐긴다",code:"유"}},
  {id:35,axis:"생활",text:"방·책상 상태는 보통...",a:{label:"정리정돈이 되어 있어야 마음이 편하다",code:"강"},b:{label:"약간 어질러져 있어도 내 나름의 질서가 있다",code:"유"}},
  {id:36,axis:"생활",text:"쇼핑할 때 나는...",a:{label:"미리 살 것을 정해두고 간다",code:"강"},b:{label:"가서 마음에 드는 걸 즉흥적으로 산다",code:"유"}},
  {id:37,axis:"생활",text:"프로젝트를 시작할 때 나는...",a:{label:"전체 계획과 일정을 먼저 짠다",code:"강"},b:{label:"일단 시작하면서 방향을 잡는다",code:"유"}},
  {id:38,axis:"생활",text:"마감이 있는 일을 할 때 나는...",a:{label:"마감 훨씬 전에 끝내야 안심이 된다",code:"강"},b:{label:"마감에 맞춰 끝내면 충분하다",code:"유"}},
  {id:39,axis:"생활",text:"내 삶을 표현하는 단어는...",a:{label:"계획, 질서, 체계",code:"강"},b:{label:"자유, 유연, 즉흥",code:"유"}},
  {id:40,axis:"생활",text:"갑작스러운 일정 변경이 생기면...",a:{label:"상당히 불편하고 스트레스를 받는다",code:"강"},b:{label:"그럴 수도 있지, 하고 금방 적응한다",code:"유"}},
];

function getQType(answers) {
  const sc={};
  Object.values(AXIS_PAIRS).flat().forEach(k=>sc[k]=0);
  answers.forEach((a,i)=>{ if(a) sc[a]++; });
  return AXIS_ORDER.map(axis=>{ const [a,b]=AXIS_PAIRS[axis]; return sc[a]>=sc[b]?a:b; }).join("");
}

// 마음의 파동 (A/T) 계산
// 판단축=정(감성) + 생활축=유(유연) → T 성향 강함
// 판단축=리(이성) + 생활축=강(계획) → A 성향 강함
function getWaveType(answers) {
  const sc={};
  Object.values(AXIS_PAIRS).flat().forEach(k=>sc[k]=0);
  answers.forEach((a,i)=>{ if(a) sc[a]++; });
  // 정(감성) 점수 + 유(유연) 점수가 높을수록 T(파도형)
  const tScore = (sc["정"]||0) + (sc["유"]||0);
  const aScore = (sc["리"]||0) + (sc["강"]||0);
  const total = tScore + aScore;
  const tPct = total > 0 ? Math.round((tScore/total)*100) : 50;
  return {
    type: tPct >= 50 ? "T" : "A",
    tPct,
    aPct: 100 - tPct,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function 기질도() {
  const [screen,setScreen]=useState("intro");
  const [birth,setBirth]=useState({year:"",month:"",day:"",hour:""});
  const [sajuInfo,setSajuInfo]=useState(null);
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState(Array(40).fill(null));
  const [qType,setQType]=useState("");
  const [waveType,setWaveType]=useState(null);
  const [selected,setSelected]=useState(null);
  const [visible,setVisible]=useState(true);
  const [s1,setS1]=useState([false,false,false,false]);
  const [s2,setS2]=useState([false,false,false,false]);

  const progress=Math.round((current/QUESTIONS.length)*100);
  const curAxis=QUESTIONS[current]?.axis;

  function handleBirth(){
    const {year,month,day,hour}=birth;
    if(!year||!month||!day) return;
    const saju=getSaju(+year,+month,+day,hour?+hour:null);
    setSajuInfo(saJuToType(saju));
    setScreen("test");
  }

  function handleAnswer(code){
    if(!visible) return;
    setSelected(code);
    setTimeout(()=>{
      const na=[...answers]; na[current]=code; setAnswers(na); setSelected(null);
      if(current+1>=QUESTIONS.length){ setQType(getQType(na)); setWaveType(getWaveType(na)); setScreen("result"); }
      else { setVisible(false); setTimeout(()=>{ setCurrent(c=>c+1); setVisible(true); },260); }
    },280);
  }

  useEffect(()=>{
    if(screen==="result"){
      [0,1,2,3].forEach(i=>{
        setTimeout(()=>setS1(p=>{const n=[...p];n[i]=true;return n;}),400+i*280);
        setTimeout(()=>setS2(p=>{const n=[...p];n[i]=true;return n;}),1800+i*280);
      });
    }
  },[screen]);

  function restart(){
    setScreen("intro"); setBirth({year:"",month:"",day:"",hour:""});
    setSajuInfo(null); setCurrent(0); setAnswers(Array(40).fill(null));
    setQType(""); setWaveType(null); setS1([false,false,false,false]); setS2([false,false,false,false]);
  }

  const G="#E8C87A";
  const DG="#0D2318"; // 다크그린
  const wrap={minHeight:"100vh",background:DG,fontFamily:"'Noto Serif KR',serif",color:"#F0EAD6",maxWidth:430,margin:"0 auto",boxSizing:"border-box"};
  const wrapWhite={minHeight:"100vh",background:"#F5F5F0",fontFamily:"'Noto Serif KR',serif",color:"#1a1a1a",maxWidth:430,margin:"0 auto",boxSizing:"border-box"};

  // ── INTRO ──
  if(screen==="intro") return (
    <div style={{...wrap,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{position:"relative",marginBottom:8}}>
        <div style={{fontSize:72,filter:"drop-shadow(0 0 40px rgba(232,200,122,0.7))",animation:"float 3s ease-in-out infinite"}}>🔯</div>
        <div style={{position:"absolute",top:-4,right:-8,width:8,height:8,borderRadius:"50%",background:G,animation:"pulse 2s ease-in-out infinite"}}/>
      </div>
      <div style={{fontSize:11,letterSpacing:8,color:G,marginBottom:4}}>氣 質 圖</div>
      <h1 style={{fontSize:38,fontWeight:700,margin:"0 0 4px",letterSpacing:3}}>기질도</h1>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",letterSpacing:4,marginBottom:36}}>타고난 기질 vs 살아온 기질</p>

      <div style={{width:"100%",background:"linear-gradient(135deg,rgba(232,200,122,0.07),rgba(232,200,122,0.03))",border:"1px solid rgba(232,200,122,0.18)",borderRadius:20,padding:"24px 20px",marginBottom:20}}>
        {[{icon:"🌟",t:"사주 분석",d:"생년월일로 타고난 기질을 탐색해요"},{icon:"🪞",t:"40문항 테스트",d:"살아온 기질을 정밀하게 파악해요"},{icon:"⚖️",t:"비교 & 보완",d:"두 기질의 차이와 성장 방향을 제시해요"}].map(({icon,t,d})=>(
          <div key={t} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
            <span style={{fontSize:22,flexShrink:0,filter:"drop-shadow(0 0 8px rgba(232,200,122,0.4))"}}>{icon}</span>
            <div><p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 2px"}}>{t}</p><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>{d}</p></div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:24,width:"100%",justifyContent:"center"}}>
        {[["陽·陰(양·음)","기운 — 외향/내향"],["天·地(천·지)","인식 — 직관/감각"],["理·情(리·정)","판단 — 이성/감성"],["剛·柔(강·유)","생활 — 계획/유연"]].map(([h,l])=>(
          <div key={l} style={{flex:1,textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:12,padding:"10px 4px"}}>
            <div style={{fontSize:10,color:G,fontWeight:600,marginBottom:2,lineHeight:1.3}}>{h}</div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.45)",letterSpacing:0.5}}>{l}</div>
          </div>
        ))}
      </div>

      <button onClick={()=>setScreen("birth")} style={{width:"100%",padding:"19px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:16,fontWeight:700,color:"#0D0D14",cursor:"pointer",letterSpacing:2,boxShadow:"0 8px 32px rgba(232,200,122,0.35)"}}>
        기질 탐색 시작 →
      </button>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginTop:14,textAlign:"center",lineHeight:1.7}}>동양 철학 기반 성향 탐색용 · 의료적 진단 아님</p>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}`}</style>
    </div>
  );

  // ── 생년월일 ──
  if(screen==="birth") return (
    <div style={{...wrap,padding:"60px 24px 40px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:11,color:G,letterSpacing:4,marginBottom:10}}>STEP 1 · 사주 분석</div>
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 10px"}}>생년월일을 알려주세요</h2>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",margin:0,lineHeight:1.8}}>사주로 <span style={{color:G}}>타고난 기질</span>을 분석합니다<br/>시간은 입력하면 더 정확해요</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
        {[{label:"출생 연도 *",key:"year",ph:"예) 1995",min:1900,max:2010},{label:"출생 월 *",key:"month",ph:"예) 8 (1~12)",min:1,max:12},{label:"출생 일 *",key:"day",ph:"예) 24 (1~31)",min:1,max:31},{label:"출생 시간 (선택)",key:"hour",ph:"예) 14 (24시간, 0~23)",min:0,max:23}].map(({label,key,ph,min,max})=>(
          <div key={key}>
            <p style={{fontSize:11,color:key==="hour"?"#666":G,letterSpacing:2,marginBottom:8}}>{label}</p>
            <input type="number" min={min} max={max} placeholder={ph} value={birth[key]}
              onChange={e=>setBirth(p=>({...p,[key]:e.target.value}))}
              style={{width:"100%",padding:"16px 18px",background:"rgba(255,255,255,0.04)",border:`1.5px solid ${birth[key]?"rgba(232,200,122,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:12,fontSize:16,color:"#F0EAD6",outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border 0.2s",caretColor:G}}/>
          </div>
        ))}
      </div>
      <button onClick={handleBirth} disabled={!birth.year||!birth.month||!birth.day}
        style={{width:"100%",padding:"18px",background:(!birth.year||!birth.month||!birth.day)?"rgba(232,200,122,0.2)":`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:16,fontWeight:700,color:"#0D0D14",cursor:(!birth.year||!birth.month||!birth.day)?"not-allowed":"pointer",letterSpacing:1,transition:"all 0.3s"}}>
        사주 분석 후 질문으로 →
      </button>
    </div>
  );

  // ── 질문 ──
  if(screen==="test"){
    const q=QUESTIONS[current];
    const axisIdx=AXIS_ORDER.indexOf(curAxis);
    return (
      <div style={wrap}>
        <div style={{padding:"20px 24px 0",background:`rgba(13,35,24,0.95)`,backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:10,color:G,letterSpacing:2}}>STEP 2 · 氣質圖</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{current+1} / 40</span>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,0.12)",borderRadius:99}}>
            <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${G},#C4922A)`,borderRadius:99,transition:"width 0.5s ease",boxShadow:`0 0 8px ${G}60`}}/>
          </div>
          <div style={{display:"flex",gap:4,marginTop:10,paddingBottom:12}}>
            {AXIS_ORDER.map((axis,i)=>{
              const done=answers.filter((a,qi)=>a&&QUESTIONS[qi]?.axis===axis).length;
              const total=QUESTIONS.filter(q=>q.axis===axis).length;
              const active=axis===curAxis;
              return(
                <div key={axis} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:8,color:active?G:"rgba(255,255,255,0.25)",marginBottom:3,letterSpacing:1,transition:"color 0.3s"}}>{AXIS_HANJA_SHORT[axis]}</div>
                  <div style={{height:2,background:"rgba(255,255,255,0.05)",borderRadius:99}}>
                    <div style={{height:"100%",width:`${(done/total)*100}%`,background:active?G:"rgba(255,255,255,0.15)",borderRadius:99,transition:"width 0.3s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{padding:"24px 24px 40px",opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-14px)",transition:"opacity 0.26s,transform 0.26s"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:20,padding:"4px 12px",marginBottom:16}}>
            <span style={{fontSize:9,color:G,letterSpacing:2}}>{q.axis}의 기운 · {AXIS_DESC[q.axis]}</span>
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 8px"}}>Q.{current+1}</p>
          <p style={{fontSize:19,lineHeight:1.75,fontWeight:600,color:"#F0EAD6",margin:"0 0 28px"}}>{q.text}</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[q.a,q.b].map((opt,idx)=>{
              const isSel=selected===opt.code;
              return(
                <button key={idx} onClick={()=>handleAnswer(opt.code)} style={{
                  padding:"22px 20px",
                  background:isSel?"linear-gradient(135deg,rgba(232,200,122,0.18),rgba(232,200,122,0.08))":"rgba(255,255,255,0.03)",
                  border:isSel?`1.5px solid ${G}`:"1.5px solid rgba(255,255,255,0.07)",
                  borderRadius:16,fontSize:15,color:isSel?G:"#C8BC9A",
                  cursor:"pointer",textAlign:"left",lineHeight:1.6,
                  transition:"all 0.2s",transform:isSel?"scale(0.982)":"scale(1)",
                  boxShadow:isSel?`0 0 20px rgba(232,200,122,0.12)`:"none"
                }}>
                  <span style={{fontSize:10,opacity:0.3,marginRight:10,fontWeight:400}}>{idx===0?"一":"二"}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {/* 뒤로가기 버튼 */}
          {current > 0 && (
            <button onClick={()=>setCurrent(c=>c-1)} style={{
              marginTop:16, padding:"13px", width:"100%",
              background:"transparent",
              border:"1px solid rgba(232,200,122,0.2)",
              borderRadius:12, fontSize:13, color:"rgba(232,200,122,0.5)",
              cursor:"pointer", letterSpacing:1
            }}>← 이전 질문</button>
          )}
        </div>
      </div>
    );
  }

  // ── 결과 ──
  if(screen==="result"&&sajuInfo&&qType){
    const sData=TYPES[sajuInfo.code]||TYPES["양천리강"];
    const qData=TYPES[qType]||TYPES["양천리강"];
    const isSame=sajuInfo.code===qType;
    const sChars=sajuInfo.code.split("");
    const qChars=qType.split("");
    const diffAxes=AXIS_ORDER.filter((_,i)=>sChars[i]!==qChars[i]);
    const advices=diffAxes.map(axis=>{
      const i=AXIS_ORDER.indexOf(axis);
      const key=`${sChars[i]}→${qChars[i]}`;
      return DIFF[axis]?.[key]?{axis,...DIFF[axis][key]}:null;
    }).filter(Boolean);

    const hexToRgb=hex=>{ const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `${r},${g},${b}`; };

    return(
      <div style={{...wrapWhite,padding:"32px 24px 64px"}}>

        {/* 타이틀 */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",letterSpacing:4,marginBottom:4}}>기질 분석 완료</p>
          <h2 style={{fontSize:22,fontWeight:700,color:"#111",margin:"0 0 6px"}}>두 가지 기질 비교</h2>
          <p style={{fontSize:12,color:"rgba(0,0,0,0.5)",margin:0}}>타고난 기질과 살아온 기질을 분석했어요</p>
        </div>

        {/* 두 유형 카드 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[{data:sData,chars:sChars,anim:s1,label:"🌟 타고난 기질",sub:"사주 기반"},{data:qData,chars:qChars,anim:s2,label:"🪞 살아온 기질",sub:"질문 기반"}].map(({data,chars,anim,label,sub},cardIdx)=>(
            <div key={cardIdx} style={{background:`rgba(${hexToRgb(data.color)},0.07)`,border:`1px solid rgba(${hexToRgb(data.color)},0.25)`,borderRadius:18,padding:"18px 14px",textAlign:"center"}}>
              <p style={{fontSize:9,color:data.color,letterSpacing:1,marginBottom:10}}>{label}</p>
              <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:10}}>
                {chars.map((ch,i)=>(
                  <div key={i} style={{width:28,height:28,border:`1.5px solid ${data.color}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:data.color,transform:anim[i]?"scale(1) rotate(0)":"scale(0.3) rotate(-20deg)",opacity:anim[i]?1:0,transition:`all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i*0.1}s`,boxShadow:anim[i]?`0 0 12px rgba(${hexToRgb(data.color)},0.4)`:"none"}}>{ch}</div>
                ))}
              </div>
              <div style={{fontSize:34,marginBottom:6,filter:`drop-shadow(0 0 16px rgba(${hexToRgb(data.color)},0.6))`}}>{data.emoji}</div>
              <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 2px"}}>{data.name}형</p>
              <p style={{fontSize:10,color:data.color,margin:"0 0 6px"}}>{data.subtitle}</p>
              <p style={{fontSize:9,color:"rgba(0,0,0,0.4)"}}>{sub}</p>
            </div>
          ))}
        </div>

        {/* 종합 판정 */}
        <div style={{background:isSame?"rgba(95,196,158,0.08)":"rgba(232,200,122,0.07)",border:`1px solid ${isSame?"rgba(95,196,158,0.25)":"rgba(232,200,122,0.25)"}`,borderRadius:16,padding:"20px",marginBottom:14,textAlign:"center"}}>
          <p style={{fontSize:28,margin:"0 0 8px"}}>{isSame?"✨":"⚡"}</p>
          <p style={{fontSize:15,fontWeight:700,color:isSame?"#5FC49E":G,margin:"0 0 8px"}}>
            {isSame?"타고난 대로 살고 있어요!":`${diffAxes.length}개 축에서 차이가 있어요`}
          </p>
          <p style={{fontSize:13,color:"#777",margin:0,lineHeight:1.8}}>
            {isSame
              ?"사주 기질과 살아온 기질이 일치해요. 본성에 충실하게 살아온 사람이에요."
              :`${diffAxes.map(a=>AXIS_DESC[a]).join(", ")}에서\n타고난 기질과 다르게 살아왔어요.`}
          </p>
        </div>

        {/* 축별 비교 */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:"#9A7200",letterSpacing:3,marginBottom:14}}>⚖️ 4축 비교</p>
          {AXIS_ORDER.map((axis,i)=>{
            const sv=sChars[i],qv=qChars[i],same=sv===qv;
            return(
              <div key={axis} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{fontSize:9,color:"rgba(0,0,0,0.45)",width:32,letterSpacing:1}}>{AXIS_HANJA_SHORT[axis]}</div>
                <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:sData.color,background:`rgba(${hexToRgb(sData.color)},0.15)`,padding:"4px 10px",borderRadius:8,minWidth:24,textAlign:"center"}}>{sv}</span>
                  <span style={{fontSize:12,color:same?"#5FC49E":"#E8C87A",flexShrink:0}}>{same?"＝":"≠"}</span>
                  <span style={{fontSize:14,fontWeight:700,color:qData.color,background:`rgba(${hexToRgb(qData.color)},0.15)`,padding:"4px 10px",borderRadius:8,minWidth:24,textAlign:"center"}}>{qv}</span>
                </div>
                <span style={{fontSize:9,color:same?"#006644":"#9A7200",fontWeight:600,flexShrink:0}}>{same?"일치":"차이"}</span>
              </div>
            );
          })}
        </div>

        {/* 보완 조언 */}
        {advices.length>0&&(
          <div style={{marginBottom:14}}>
            <p style={{fontSize:10,color:"#9A7200",letterSpacing:3,marginBottom:12}}>💡 보완 포인트</p>
            {advices.map((adv,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(232,200,122,0.18)",borderRadius:16,padding:"18px",marginBottom:10}}>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",letterSpacing:2,marginBottom:6}}>{AXIS_HANJA[adv.axis]} · {AXIS_DESC[adv.axis]}</p>
                <p style={{fontSize:14,fontWeight:600,color:"#7A5C00",margin:"0 0 8px"}}>{adv.title}</p>
                <p style={{fontSize:13,color:"rgba(0,0,0,0.6)",lineHeight:1.85,margin:0}}>{adv.msg}</p>
              </div>
            ))}
          </div>
        )}

        {/* 오행 분포 */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"18px",marginBottom:14}}>
          <p style={{fontSize:10,color:"#9A7200",letterSpacing:3,marginBottom:14}}>🌿 사주 오행 분포</p>
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",marginBottom:12}}>일간: <span style={{color:"#7A5C00"}}>{sajuInfo.ilganName}</span>({CG_OHANG[getSaju(+birth.year,+birth.month,+birth.day,birth.hour?+birth.hour:null).ilgan]})</p>
          {Object.entries(sajuInfo.ohang).map(([oh,score])=>{
            const oc={목:"#81C784",화:"#FF7043",토:"#FFB74D",금:"#B0BEC5",수:"#4FC3F7"};
            const total=Object.values(sajuInfo.ohang).reduce((a,b)=>a+b,0);
            const pct=Math.round((score/total)*100);
            return(
              <div key={oh} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:12,color:oc[oh],width:14,fontWeight:600}}>{oh}</span>
                <div style={{flex:1,height:6,background:"rgba(255,255,255,0.05)",borderRadius:99}}>
                  <div style={{height:"100%",width:`${pct}%`,background:oc[oh],borderRadius:99,boxShadow:`0 0 6px ${oc[oh]}60`}}/>
                </div>
                <span style={{fontSize:11,color:"rgba(0,0,0,0.5)",width:28,textAlign:"right"}}>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* 살아온 기질 상세 */}
        <div style={{background:`rgba(${hexToRgb(qData.color)},0.05)`,border:`1px solid rgba(${hexToRgb(qData.color)},0.2)`,borderRadius:16,padding:"20px",marginBottom:14}}>
          <p style={{fontSize:10,color:qData.color,letterSpacing:3,marginBottom:12}}>🪞 살아온 기질 상세</p>
          <p style={{fontSize:15,lineHeight:1.9,color:"#222",margin:"0 0 14px"}}>{qData.desc}</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {qData.strengths.map(s=>(
              <span key={s} style={{fontSize:12,padding:"5px 12px",background:`rgba(${hexToRgb(qData.color)},0.15)`,border:`1px solid rgba(${hexToRgb(qData.color)},0.35)`,borderRadius:20,color:qData.color}}>{s}</span>
            ))}
          </div>
          <p style={{fontSize:13,color:"rgba(0,0,0,0.55)",lineHeight:1.8,margin:"0 0 10px"}}>⚠️ {qData.weak}</p>
          <p style={{fontSize:13,color:"rgba(0,0,0,0.5)",lineHeight:1.8,margin:0}}>💕 {qData.love}</p>
        </div>

        {/* 궁합 + 상극 한 줄 반반 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {/* 찰떡 궁합 */}
          {TYPES[qData.match]&&(
            <div style={{background:"rgba(245,184,196,0.07)",border:"1px solid rgba(220,150,170,0.25)",borderRadius:16,padding:"14px",textAlign:"center"}}>
              <p style={{fontSize:9,color:"#C45070",letterSpacing:2,marginBottom:10}}>♡ 찰떡 궁합</p>
              <span style={{fontSize:36,display:"block",marginBottom:6,filter:`drop-shadow(0 0 10px rgba(${hexToRgb(TYPES[qData.match].color)},0.5))`}}>{TYPES[qData.match].emoji}</span>
              <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{TYPES[qData.match].name}형</p>
              <p style={{fontSize:10,color:"#C45070",margin:"0 0 3px",letterSpacing:1}}>{qData.match}</p>
              <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0,lineHeight:1.4}}>{TYPES[qData.match].subtitle}</p>
            </div>
          )}
          {/* 상극 유형 */}
          {TYPES[qData.anti]&&(
            <div style={{background:"rgba(255,100,80,0.06)",border:"1px solid rgba(200,60,40,0.2)",borderRadius:16,padding:"14px",textAlign:"center"}}>
              <p style={{fontSize:9,color:"#CC3322",letterSpacing:2,marginBottom:10}}>⚡ 상극 유형</p>
              <span style={{fontSize:36,display:"block",marginBottom:6}}>{TYPES[qData.anti].emoji}</span>
              <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{TYPES[qData.anti].name}형</p>
              <p style={{fontSize:10,color:"#CC3322",margin:"0 0 3px",letterSpacing:1}}>{qData.anti}</p>
              <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",margin:0,lineHeight:1.4}}>{TYPES[qData.anti].subtitle}</p>
            </div>
          )}
        </div>

        {/* 유명인 */}
        <div style={{background:"rgba(95,196,158,0.05)",border:"1px solid rgba(95,196,158,0.18)",borderRadius:16,padding:"18px",marginBottom:12}}>
          <p style={{fontSize:10,color:"#006644",letterSpacing:3,marginBottom:10}}>✦ 비슷한 기질의 유명인</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {qData.celeb.split(",").map(p=>(
              <span key={p} style={{fontSize:12,padding:"4px 12px",background:"rgba(0,150,80,0.08)",border:"1px solid rgba(0,150,80,0.18)",borderRadius:20,color:"#005533"}}>{p.trim()}</span>
            ))}
          </div>
        </div>

        {/* 마음의 파동 (A/T 지표) */}
        {waveType&&(
          <div style={{background:"rgba(100,150,255,0.06)",border:"1px solid rgba(80,120,220,0.2)",borderRadius:16,padding:"20px",marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <p style={{fontSize:10,color:"#4466CC",letterSpacing:3,margin:0}}>🌊 마음의 파동 (波動)</p>
              <span style={{fontSize:11,color:"rgba(0,0,0,0.4)"}}>자기확신 vs 신경성</span>
            </div>
            <div style={{display:"flex",gap:12,marginBottom:14}}>
              {/* A 타입 */}
              <div style={{flex:1,background:waveType.type==="A"?"rgba(100,180,255,0.15)":"rgba(0,0,0,0.04)",border:waveType.type==="A"?"1.5px solid rgba(80,150,255,0.4)":"1px solid rgba(0,0,0,0.08)",borderRadius:14,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:6}}>🏔️</div>
                <div style={{fontSize:13,fontWeight:700,color:waveType.type==="A"?"#3366CC":"rgba(0,0,0,0.45)",marginBottom:3}}>A형 · 잔잔한 호수</div>
                <div style={{fontSize:11,color:"rgba(0,0,0,0.4)",marginBottom:8}}>평온 · 자기확신</div>
                <div style={{fontSize:20,fontWeight:700,color:waveType.type==="A"?"#3366CC":"rgba(0,0,0,0.3)"}}>{waveType.aPct}%</div>
              </div>
              {/* T 타입 */}
              <div style={{flex:1,background:waveType.type==="T"?"rgba(150,100,255,0.12)":"rgba(0,0,0,0.04)",border:waveType.type==="T"?"1.5px solid rgba(130,80,220,0.4)":"1px solid rgba(0,0,0,0.08)",borderRadius:14,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:6}}>🌊</div>
                <div style={{fontSize:13,fontWeight:700,color:waveType.type==="T"?"#7744BB":"rgba(0,0,0,0.45)",marginBottom:3}}>T형 · 물결치는 파도</div>
                <div style={{fontSize:11,color:"rgba(0,0,0,0.4)",marginBottom:8}}>섬세 · 신경성</div>
                <div style={{fontSize:20,fontWeight:700,color:waveType.type==="T"?"#7744BB":"rgba(0,0,0,0.3)"}}>{waveType.tPct}%</div>
              </div>
            </div>
            <div style={{background:"rgba(0,0,0,0.04)",borderRadius:12,padding:"12px"}}>
              <p style={{fontSize:13,color:"#333",lineHeight:1.8,margin:0}}>
                {waveType.type==="A"
                  ? `잔잔하고 단단한 호수형이에요. 감정의 흔들림이 적고, 자신의 판단에 확신을 가지는 편이에요. 외부 자극에 덜 흔들리고 안정적으로 나아가는 힘이 있어요.`
                  : `물결치는 파도형이에요. 감정의 진폭이 크고, 섬세하게 주변을 감지하는 능력이 있어요. 이 예민함이 공감 능력과 직관의 원천이 돼요.`}
              </p>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button style={{padding:"18px",background:`linear-gradient(135deg,${G},#C4922A)`,border:"none",borderRadius:14,fontSize:15,fontWeight:700,color:"#0D0D14",cursor:"pointer",letterSpacing:1,boxShadow:`0 8px 24px rgba(232,200,122,0.3)`}}>
            결과 공유하기 →
          </button>
          <button onClick={restart} style={{padding:"15px",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,fontSize:13,color:"#555",cursor:"pointer"}}>
            다시 테스트하기
          </button>
        </div>
        <p style={{fontSize:10,color:"#2a2a2a",textAlign:"center",marginTop:20,lineHeight:1.7}}>동양 철학 기반 성향 탐색용 · 의료적 진단 아님</p>
      </div>
    );
  }
  return null;
}
