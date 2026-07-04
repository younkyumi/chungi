"use client";
import { useState, useEffect } from "react";

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

// ━━━ 16유형 데이터 ━━━
const TYPES={
  "양천리강":{hanja:"陽天理剛",mbti:"ENTJ",name:"청룡",emoji:"🐲",color:"#4FC3F7",subtitle:"하늘을 가르는 용",
    desc:"타고난 지도자. 직관과 논리로 미래를 설계하고 강한 의지로 반드시 실현해낸다.",
    desc_long:"마치 하늘을 가르는 번개처럼, 청룡의 기운을 타고난 분은 어떤 상황에서도 주도권을 놓치지 않아요. 목표가 정해지면 주변의 시선이나 방해에 흔들리지 않고 앞으로 나아가는 추진력이 있어요. 때로는 너무 빠르게 달려서 주변이 따라오지 못할 때도 있지만, 그 열정과 카리스마는 사람들을 자연스럽게 끌어당겨요.",
    strengths:["전략적 사고","추진력","카리스마","비전 제시"],
    weak:"상대의 감정을 놓칠 수 있어. 잠깐 멈추고 주변을 살피는 습관이 필요해.",
    jobs:["CEO","정치가","전략 컨설턴트","군 지휘관"],
    love:"관계에서도 주도권을 잡으려 해. 상대의 속도를 존중해주면 훨씬 깊은 사랑이 돼.",
    money:"큰 그림을 보는 사주라 소소한 저축보다 과감한 투자나 사업에서 재물이 불어나요. 단, 속도를 조절하는 훈련이 필요해요.",
    health:"넘치는 에너지로 스스로를 혹사하는 경향이 있어요. 간·담 계통을 주의하고 충분한 수면이 재물운도 지켜줘요.",
    match:"음지정유",anti:"양천리강",
    celeb:"나폴레옹, 스티브 잡스, BTS RM",
    celeb_saju:"이순신 장군, 세종대왕과 같은 일간 계열로, 실행력과 비전이 시대를 바꾸는 리더상이에요.",
    lucky_num:"1, 6",lucky_color:"청색·금색",lucky_dir:"동쪽",lucky_item:"청색 수정·용 문양 액세서리"},
  "양천리유":{hanja:"陽天理柔",mbti:"ENTP",name:"봉황",emoji:"🦅",color:"#FF7043",subtitle:"판을 뒤집는 혁명가",
    desc:"아이디어의 화신. 기존 틀을 깨고 새로운 가능성을 탐색하는 것이 본능이다.",
    desc_long:"죽음과 재생을 반복하는 봉황처럼, 이 기질의 분은 실패를 두려워하지 않아요. 오히려 실패에서 새로운 아이디어를 발견하는 능력이 탁월해요. 대화할 때 상대의 논리에서 허점을 찾아내는 예리함이 있어 토론에서 빛나요. 단, 마무리 짓는 힘이 시작하는 힘보다 약한 편이에요.",
    strengths:["창의력","논리적 유연성","토론 능력","혁신"],
    weak:"시작은 폭발적인데 마무리가 약해. 끝맺음을 의식적으로 챙겨봐.",
    jobs:["스타트업 창업자","발명가","방송인","마케터"],
    love:"연애도 게임처럼 즐기는 경향이 있어. 진심을 표현하는 연습이 관계를 깊게 해.",
    money:"아이디어로 돈을 버는 스타일. 창업·콘텐츠·컨설팅 분야에서 재물이 열려요. 분산투자보다 집중이 유리해요.",
    health:"신경계와 폐 계통을 주의하세요. 생각이 많아 불면증에 주의하고, 규칙적인 유산소 운동이 도움돼요.",
    match:"음지정강",anti:"양천리유",
    celeb:"에디슨, 유재석, 일론 머스크",
    celeb_saju:"혁신가·발명가 계열 일간으로, 기존 틀을 깨는 창의적 인물들과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"붉은색·주황색",lucky_dir:"남쪽",lucky_item:"봉황 문양·붉은 계열 스톤"},
  "양천정강":{hanja:"陽天情剛",mbti:"ENFJ",name:"백학",emoji:"🕊️",color:"#81C784",subtitle:"모든 이의 길잡이",
    desc:"사람을 이끄는 타고난 멘토. 직관으로 상대의 마음을 읽고 따뜻하게 이끌어 성장시킨다.",
    desc_long:"소나무 사이를 노니는 백학처럼, 이 기질의 분은 어디서나 고결함과 따뜻함을 함께 지녀요. 사람의 감정을 꿰뚫어 보는 직관이 탁월하고, 그 사람이 가야 할 방향을 먼저 보는 능력이 있어요. 리더지만 군림하지 않고, 함께 성장하는 방식을 택해요.",
    strengths:["공감 능력","리더십","소통력","헌신"],
    weak:"남을 너무 챙기다 나 자신을 소진할 수 있어.",
    jobs:["교사","상담사","NGO 활동가","인사담당자"],
    love:"상대를 위해 모든 걸 하는 헌신적인 파트너야.",
    money:"사람과의 신뢰를 통해 재물이 열리는 사주예요. 강요보다 자연스러운 관계에서 기회가 와요.",
    health:"심장·순환계를 주의하세요. 타인을 너무 챙기다 번아웃이 올 수 있으니 나만의 회복 루틴이 필요해요.",
    match:"음지리유",anti:"양천정강",
    celeb:"오프라 윈프리, 아이유, 오바마",
    celeb_saju:"사람의 마음을 움직이는 지도자·멘토 계열 일간과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"흰색·옥색",lucky_dir:"동쪽·서쪽",lucky_item:"백학 문양·옥 계열 액세서리"},
  "양천정유":{hanja:"陽天情柔",mbti:"ENFP",name:"기린",emoji:"🦄",color:"#CE93D8",subtitle:"바람처럼 왔다가는 자",
    desc:"무한한 가능성을 보는 자유로운 영혼. 사람을 사랑하고 어디서든 영감을 찾아낸다.",
    desc_long:"어진 임금이 나타날 때만 등장한다는 기린처럼, 이 기질의 분은 세상의 아름다움과 가능성을 남보다 먼저 봐요. 꽃잎이 흩날리는 곳에 있는 것처럼, 어디서든 영감을 찾아내고 사람들에게 행운을 나눠주는 존재예요. 단, 현실의 무게를 좀 더 챙기면 꿈이 더 빨리 이뤄져요.",
    strengths:["열정","창의성","공감력","낙관주의"],
    weak:"현실 감각을 좀 더 챙기면 꿈이 실제로 이뤄져.",
    jobs:["크리에이터","작가","배우","사회운동가"],
    love:"사랑에 빠지면 온 우주가 그 사람이 돼.",
    money:"예술·창작·교육 분야에서 자연스럽게 재물이 열려요. 직관을 믿되 현실적인 플랜도 하나 옆에 두세요.",
    health:"소화기 계통과 감정 기복을 주의하세요. 규칙적인 식사와 자연 속 산책이 몸과 마음을 안정시켜줘요.",
    match:"음지리강",anti:"양천정유",
    celeb:"BTS 뷔, 로빈 윌리엄스, 유재석",
    celeb_saju:"자유롭고 창의적인 예술가·활동가 계열 일간과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"보라·금색",lucky_dir:"중앙·사방",lucky_item:"기린 문양·자수정 계열"},
  "양지리강":{hanja:"陽地理剛",mbti:"ESTJ",name:"백호",emoji:"🐯",color:"#FFB74D",subtitle:"땅을 지키는 수호신",
    desc:"질서와 책임감의 상징. 현실을 정확히 파악하고 계획대로 실행하며 공동체를 굳건히 지킨다.",
    desc_long:"서방을 지키는 백호처럼, 이 기질의 분은 한번 맡은 것은 끝까지 지켜내요. 원칙이 있고, 체계적이고, 신뢰할 수 있는 사람이에요. 조직이나 공동체에서 자연스럽게 중심이 되고, 누군가 흔들릴 때 가장 먼저 버팀목이 돼주는 존재예요. 가끔은 너무 딱딱해 보일 수 있지만, 그게 바로 백호의 강점이에요.",
    strengths:["책임감","조직력","실행력","신뢰성"],
    weak:"융통성이 부족해 보일 수 있어. 때로는 예외를 허용하는 것도 지혜야.",
    jobs:["관리자","법조인","군인","회계사"],
    love:"안정적이고 믿음직한 파트너야.",
    money:"꾸준한 저축과 부동산처럼 안정적인 자산에서 재물이 쌓여요. 한번 방향이 정해지면 흔들리지 않는 게 강점이에요.",
    health:"뼈·관절·치아를 주의하세요. 금(金) 기운이 강해 호흡기도 챙겨야 해요. 과도한 책임감이 스트레스를 만드니 쉬는 것도 일이에요.",
    match:"음천정유",anti:"양지리강",
    celeb:"박지성, 반기문, 엠마 왓슨",
    celeb_saju:"이순신 장군, 세종대왕처럼 조직을 수호하고 책임지는 사주 계열과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"흰색·금색",lucky_dir:"서쪽",lucky_item:"백호 문양·흰색 수정·금속 소품"},
  "양지리유":{hanja:"陽地理柔",mbti:"ESTP",name:"급류",emoji:"🌊",color:"#26C6DA",subtitle:"흐름을 타는 자",
    desc:"현실의 파도를 타는 행동가. 이론보다 실전, 계획보다 즉흥이 특기.",
    desc_long:"격류를 맨발로 달리는 수군 무사처럼, 이 기질의 분은 상황이 어려울수록 더 빛나요. 이론보다 실전에서 강하고, 즉각적인 판단력과 담대한 행동력이 이 분의 가장 큰 무기예요. 파도가 올 때 피하는 것이 아니라 그 위에 올라타는 사람이에요.",
    strengths:["즉응력","현실감각","담대함","문제 해결"],
    weak:"충동적 결정이 나중에 발목을 잡을 수 있어.",
    jobs:["스포츠 선수","응급의사","영업인","탐험가"],
    love:"자극적이고 재미있는 연애를 즐겨.",
    money:"현장에서 바로 돈을 버는 스타일. 영업·유통·현장직에서 재물이 빠르게 열려요. 충동 지출만 조심하면 돼요.",
    health:"신장·방광을 주의하세요. 수(水) 기운이 강해 과로 후 갑작스러운 체력 저하에 주의해요.",
    match:"음천정강",anti:"양지리유",
    celeb:"손흥민, 헤밍웨이, 마돈나",
    celeb_saju:"스포츠·탐험·현장의 영웅들과 오행이 닮아있어요. 몸을 쓰는 분야에서 빛나는 사주예요.",
    lucky_num:"1, 6",lucky_color:"청록색·은색",lucky_dir:"북쪽",lucky_item:"파란 계열 스톤·물결 문양 액세서리"},
  "양지정강":{hanja:"陽地情剛",mbti:"ESFJ",name:"대지",emoji:"🌻",color:"#A5D6A7",subtitle:"모두를 품는 대지",
    desc:"공동체를 살찌우는 존재. 주변 사람들의 필요를 누구보다 먼저 알아채고 묵묵히 챙긴다.",
    desc_long:"황금 들판을 품은 농경신처럼, 이 기질의 분은 공동체 전체를 살찌우는 사람이에요. 누군가 힘들어하면 먼저 알아채고, 말보다 따뜻한 행동으로 돌봐줘요. 아무도 배고프지 않게, 아무도 소외되지 않게 — 이것이 이 분의 삶의 방식이에요.",
    strengths:["배려","사회성","책임감","화합 능력"],
    weak:"남의 평가에 너무 신경 쓰는 경향이 있어.",
    jobs:["간호사","교사","이벤트 플래너","사회복지사"],
    love:"사랑하는 사람을 온 힘으로 챙겨.",
    money:"사람들을 돌보는 서비스·교육·의료 분야에서 안정적인 재물이 쌓여요. 관계가 곧 재산이에요.",
    health:"소화기 계통과 피부를 주의하세요. 타인을 챙기느라 정작 자신의 건강을 미루는 경향이 있어요.",
    match:"음천리유",anti:"양지정강",
    celeb:"박보검, 테일러 스위프트",
    celeb_saju:"따뜻한 공동체 리더·봉사자 계열 일간과 오행이 닮아있어요.",
    lucky_num:"5, 0",lucky_color:"황토색·초록색",lucky_dir:"중앙",lucky_item:"해바라기 문양·황토 계열 소품"},
  "양지정유":{hanja:"陽地情柔",mbti:"ESFP",name:"나비",emoji:"🦋",color:"#F48FB1",subtitle:"세상을 꽃밭으로 만드는 자",
    desc:"삶을 축제로 만드는 사람. 현재의 아름다움을 포착하고 주변에 생기를 전파한다.",
    desc_long:"꽃밭에서 춤추는 꽃의 정령처럼, 이 기질의 분은 어디서나 생기를 불어넣어요. 지금 이 순간을 온전히 즐기는 능력이 탁월하고, 주변 사람들도 자연스럽게 행복해지게 만들어요. 무대 위에 있든 일상에 있든, 이 분이 있는 곳이 곧 무대예요.",
    strengths:["유쾌함","감수성","친화력","현재 집중"],
    weak:"미래 준비가 약할 수 있어.",
    jobs:["연예인","플로리스트","여행가이드","뷰티 크리에이터"],
    love:"연애할 때 온 세상이 반짝거려.",
    money:"엔터테인먼트·뷰티·여행 분야에서 재물이 열려요. 지금의 즐거움도 중요하지만 미래 저축 습관을 만들어가면 더 좋아요.",
    health:"심장과 소장을 주의하세요. 과도한 자극 추구가 에너지를 과소비할 수 있어요. 규칙적인 수면이 최고의 개운법이에요.",
    match:"음천리강",anti:"양지정유",
    celeb:"제니, 마릴린 먼로, 엘튼 존",
    celeb_saju:"무대 위에서 빛나는 예술가·연예인 계열과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"분홍·보라",lucky_dir:"남쪽",lucky_item:"나비 문양·핑크 계열 크리스탈"},
  "음천리강":{hanja:"陰天理剛",mbti:"INTJ",name:"현무",emoji:"🐢",color:"#7986CB",subtitle:"천 년을 내다보는 자",
    desc:"혼자만의 우주에서 세계를 설계한다. 겉보다 훨씬 깊고 치밀한 내면을 가진 진짜 실력자.",
    desc_long:"팔괘와 별자리가 새겨진 거북처럼, 이 기질의 분은 등 뒤에 우주의 지도를 품고 있어요. 말수는 적지만 이미 열 수 앞을 보고 있고, 다른 사람들이 실패한 후에야 이해하는 전략을 혼자 처음부터 알고 있어요. 고독해 보이지만 가장 치밀하고 깊은 사람이에요.",
    strengths:["전략 수립","독립성","깊이","장기 사고"],
    weak:"혼자 다 하려는 경향이 있어. 사람을 믿고 의지하는 것도 전략이야.",
    jobs:["과학자","전략가","아키텍트","소설가"],
    love:"좀처럼 마음을 열지 않지만 한번 열리면 평생 헌신해.",
    money:"장기 투자·부동산·전문직에서 조용하지만 단단하게 재물이 쌓여요. 조급함을 내려놓으면 더 빨리 이뤄져요.",
    health:"신장·방광·척추를 주의하세요. 과도한 고독이 면역력을 낮출 수 있어요. 햇빛을 충분히 쬐는 게 도움돼요.",
    match:"양지정유",anti:"음천리강",
    celeb:"니체, 크리스토퍼 놀란, 일론 머스크",
    celeb_saju:"조용하지만 세상을 바꾸는 전략가·학자 계열 일간과 오행이 닮아있어요.",
    lucky_num:"1, 6",lucky_color:"남색·은색",lucky_dir:"북쪽",lucky_item:"현무 문양·블랙 토르말린·별자리 아이템"},
  "음천리유":{hanja:"陰天理柔",mbti:"INTP",name:"안개",emoji:"🌫️",color:"#B0BEC5",subtitle:"아무도 모르는 것을 아는 자",
    desc:"진리를 향한 끝없는 여정. 세상의 작동 원리를 이해하고 싶어하는 분석가.",
    desc_long:"산속 깊은 안개처럼, 이 기질의 분은 존재 자체가 신비로워요. 나이를 알 수 없는 도인처럼, 세상의 원리를 혼자 탐구하며 아무도 생각하지 못한 연결고리를 찾아내요. 정답을 찾는 것보다 올바른 질문을 던지는 게 더 중요하다는 것을 아는 사람이에요.",
    strengths:["분석력","독창성","논리","지적 호기심"],
    weak:"생각이 너무 많아 실행이 늦어질 수 있어.",
    jobs:["철학자","수학자","게임 개발자","연구원"],
    love:"이론으로는 완벽한 연애를 구상하지만 표현이 서툴러.",
    money:"IT·연구·분석 분야에서 전문성이 곧 재물이에요. 아이디어를 실행으로 옮기는 파트너와 함께하면 더 빠르게 성장해요.",
    health:"신경계와 호흡기를 주의하세요. 지나친 고민이 몸을 긴장시켜요. 명상이나 자연 속 산책이 최고의 개운법이에요.",
    match:"양지정강",anti:"음천리유",
    celeb:"아인슈타인, 빌 게이츠, 다윈",
    celeb_saju:"인류의 지식을 바꾼 학자·발명가 계열과 오행이 닮아있어요.",
    lucky_num:"1, 6",lucky_color:"회색·은색",lucky_dir:"북쪽·서쪽",lucky_item:"회색 계열 스톤·철학서·퍼즐"},
  "음천정강":{hanja:"陰天情剛",mbti:"INFJ",name:"달빛",emoji:"🌙",color:"#9575CD",subtitle:"보이지 않는 것을 보는 자",
    desc:"가장 드문 기질. 깊은 직관으로 사람의 미래를 보고 조용하지만 강하게 세상을 바꾸려 한다.",
    desc_long:"보름달 앞에 선 달의 선녀처럼, 이 기질의 분은 남이 보지 못하는 것을 봐요. 말 한마디로 상대의 진심을 꿰뚫고, 조용하지만 포기하지 않는 강한 의지로 세상에 변화를 만들어요. 16가지 기질 중 가장 드물고, 그만큼 특별한 사명감을 지닌 분이에요.",
    strengths:["통찰력","이상주의","공감","의지"],
    weak:"완벽주의가 자신을 갉아먹을 수 있어.",
    jobs:["작가","심리치료사","종교인","사회 활동가"],
    love:"영혼의 연결을 원해. 진짜 이해해주는 한 명이면 충분해.",
    money:"상담·치유·예술 분야에서 영혼이 담긴 재물이 열려요. 진정성이 곧 재물의 원천이에요.",
    health:"면역계와 림프계를 주의하세요. 이상과 현실 사이의 긴장이 몸에 나타나요. 창작 활동이 최고의 스트레스 해소법이에요.",
    match:"양지리유",anti:"음천정강",
    celeb:"달라이 라마, 넬슨 만델라",
    celeb_saju:"조용히 세상을 바꾼 정신적 지도자 계열과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"은색·보라색",lucky_dir:"서쪽·북쪽",lucky_item:"달빛 문양·자수정·야광 아이템"},
  "음천정유":{hanja:"陰天情柔",mbti:"INFP",name:"난초",emoji:"🌸",color:"#F06292",subtitle:"말 없이 세상을 물들이는 자",
    desc:"내면에 거대한 서사를 품은 존재. 세상이 더 아름다워질 수 있다고 믿는다.",
    desc_long:"툇마루에 앉아 난초를 그리는 문인처럼, 이 기질의 분은 말하지 않아도 존재 자체로 세상을 물들여요. 내면에 누구도 모르는 거대한 이야기를 품고 있고, 그것이 예술·글·음악으로 표현될 때 사람들의 마음을 울려요. 이상과 현실 사이의 간극이 때로는 힘들지만, 그 깊이가 이 분의 가장 큰 보물이에요.",
    strengths:["감수성","창의성","신념","공감"],
    weak:"현실과 이상의 간극에 힘들어할 수 있어.",
    jobs:["시인","상담사","예술가","작가"],
    love:"깊고 낭만적인 사랑을 꿈꿔.",
    money:"창작·예술·교육 분야에서 진정성이 재물로 이어져요. 자신의 가치를 낮추지 않는 연습이 필요해요.",
    health:"소화기와 감정 소화를 주의하세요. 감정을 억누르면 몸이 먼저 신호를 보내요. 일기 쓰기가 최고의 건강법이에요.",
    match:"양천리강",anti:"음지정유",
    celeb:"헤르만 헤세, 뉴진스 민지",
    celeb_saju:"감수성으로 시대를 물들인 예술가·문인 계열과 오행이 닮아있어요.",
    lucky_num:"4, 9",lucky_color:"연분홍·연보라",lucky_dir:"동쪽",lucky_item:"난초 문양·로즈쿼츠·향기 아이템"},
  "음지리강":{hanja:"陰地理剛",mbti:"ISTJ",name:"바위",emoji:"🪨",color:"#78909C",subtitle:"천만 년 흔들리지 않는 자",
    desc:"신뢰와 책임의 상징. 말보다 행동으로 증명하고 한번 맡은 것은 끝까지 해낸다.",
    desc_long:"돌하르방과 산신령이 합쳐진 것처럼, 이 기질의 분은 천만 년이 지나도 흔들리지 않는 존재예요. 한번 약속하면 끝까지 지키고, 말보다 행동이 먼저예요. 변화를 싫어하는 것처럼 보이지만, 사실은 검증된 것만 믿는 지혜로운 분이에요.",
    strengths:["성실함","신뢰성","꼼꼼함","인내력"],
    weak:"변화에 저항하는 경향이 있어.",
    jobs:["회계사","공무원","엔지니어","의사"],
    love:"말없이 옆에 있어주는 든든한 파트너야.",
    money:"안정적인 직업과 저축에서 차근차근 재물이 쌓여요. 부동산·채권 같은 안정형 자산이 맞아요.",
    health:"뼈·관절·피부를 주의하세요. 변화를 거부하는 심리가 몸을 굳게 만들어요. 스트레칭이 최고의 개운법이에요.",
    match:"양천정유",anti:"음지리강",
    celeb:"워렌 버핏, 류현진",
    celeb_saju:"묵묵히 한 길을 가다 정상에 오른 장인·전문가 계열과 오행이 닮아있어요.",
    lucky_num:"5, 0",lucky_color:"회청색·흰색",lucky_dir:"중앙·북쪽",lucky_item:"바위 문양·그레이 스톤·철제 소품"},
  "음지리유":{hanja:"陰地理柔",mbti:"ISTP",name:"주작",emoji:"🦜",color:"#FF8A65",subtitle:"홀로 완성하는 장인",
    desc:"손으로 세상을 이해하는 장인. 말보다 기술, 감정보다 논리.",
    desc_long:"남방을 지키는 주작처럼, 이 기질의 분은 혼자서도 완성도 높은 결과물을 만들어내요. 말이 많지 않아도 손끝에서 나오는 결과가 다 말해줘요. 장인 정신이 강하고, 혼자 깊이 파고드는 집중력이 이 분의 가장 강력한 무기예요.",
    strengths:["기술적 능력","냉정함","실용성","집중력"],
    weak:"감정 표현이 부족해 상대가 오해할 수 있어.",
    jobs:["엔지니어","외과의사","파일럿","장인"],
    love:"말보다 행동으로 사랑해.",
    money:"기술·전문직에서 실력으로 재물이 열려요. 한 가지를 깊이 파는 스페셜리스트가 재물의 지름길이에요.",
    health:"허리·관절을 주의하세요. 한 자세로 오래 집중하는 습관이 몸을 굳게 해요. 주기적인 스트레칭이 필수예요.",
    match:"양천정강",anti:"음지리유",
    celeb:"키아누 리브스, 미야자키 하야오",
    celeb_saju:"말보다 작품으로 시대를 남긴 장인·예술가 계열과 오행이 닮아있어요.",
    lucky_num:"3, 8",lucky_color:"진홍·금색",lucky_dir:"남쪽",lucky_item:"주작 문양·붉은 계열 스톤·공구·악기"},
  "음지정강":{hanja:"陰地情剛",mbti:"ISFJ",name:"옥토",emoji:"🐇",color:"#AED581",subtitle:"아무도 모르게 세상을 키우는 자",
    desc:"보이지 않는 곳에서 세상을 지탱하는 존재. 세심하게 기억하고 챙긴다.",
    desc_long:"달빛 아래 불로초를 빚는 옥토끼처럼, 이 기질의 분은 아무도 보지 않는 곳에서 가장 정성스러운 일을 해요. 상대의 작은 것도 기억하고, 말없이 챙겨주는 것이 이 분의 사랑 방식이에요. 보이지 않지만 없으면 세상이 유지되지 않는, 가장 중요한 존재예요.",
    strengths:["세심함","헌신","기억력","안정감"],
    weak:"자기 감정을 너무 눌러놓는 경향이 있어.",
    jobs:["간호사","사서","교사","행정가"],
    love:"상대가 뭘 좋아하는지 다 기억하고 챙겨주는 최고의 파트너.",
    money:"교육·의료·행정 분야에서 안정적인 재물이 쌓여요. 꾸준함이 재물의 원천이에요.",
    health:"소화기와 면역계를 주의하세요. 자신의 감정을 억누르면 몸이 먼저 반응해요. 나 자신을 먼저 챙기는 것이 최고의 개운법이에요.",
    match:"양천리유",anti:"음지정강",
    celeb:"비욘세, 케이트 미들턴",
    celeb_saju:"보이지 않는 곳에서 세상을 지탱하는 헌신적인 리더 계열과 오행이 닮아있어요.",
    lucky_num:"2, 7",lucky_color:"연두·흰색",lucky_dir:"서쪽·북쪽",lucky_item:"달토끼 문양·옥 계열·약초 관련 아이템"},
  "음지정유":{hanja:"陰地情柔",mbti:"ISFP",name:"들꽃",emoji:"🌼",color:"#FFEE58",subtitle:"조용히 피어나는 자",
    desc:"세상의 아름다움을 조용히 느끼는 예술가적 영혼.",
    desc_long:"아무도 없는 들판에서 혼자 피어나는 야생화처럼, 이 기질의 분은 주목받지 않아도 자기만의 방식으로 세상을 아름답게 만들어요. 남들이 지나치는 것에서 아름다움을 찾아내고, 그것을 표현하는 방식이 조용하지만 가장 깊게 마음을 울려요.",
    strengths:["감수성","유연성","현재 집중","예술적 감각"],
    weak:"자신을 너무 낮추는 경향이 있어.",
    jobs:["예술가","디자이너","요리사","동물 관련 직업"],
    love:"조용하지만 깊은 사랑을 줘.",
    money:"예술·디자인·요리 분야에서 감성이 재물로 이어져요. 자신의 가치를 더 높이 평가하는 연습이 필요해요.",
    health:"신장과 피부를 주의하세요. 감정 표현이 억눌리면 피부로 나타나요. 예술 활동이 최고의 치유법이에요.",
    match:"양천리강",anti:"음지정유",
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

// ━━━ 사전질문 선택지 ━━━
const PRE_Q1=[
  {emoji:"🧊",label:"솔로, 연애에 관심 없음"},
  {emoji:"🌱",label:"솔로, 좋은 인연을 원함"},
  {emoji:"🌸",label:"달달한 연애 중"},
  {emoji:"🍂",label:"오랜 연인 또는 결혼 고려 중"},
  {emoji:"💒",label:"결혼 중"},
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

// ━━━ 메인 컴포넌트 ━━━
export default function GijildoModal({onClose,selectedPerson,addHistory,cart,setCart,onGoShop,onOpenService,isLoggedIn,onLoginRequest,onRequestPerson}){
  // ━━━ 미리보기용 더미 데이터 ━━━
  const DUMMY_PERSON={name:"윤규미",birth:"1990-04-17",gender:"여",time:"모름"};
  const DUMMY_SAJU=saJuToType(getSaju(1990,4,17,null));
  const _selectedPerson=selectedPerson||DUMMY_PERSON;
  const _sajuInfo=sajuInfo||DUMMY_SAJU;
  const _personName=_selectedPerson?.name||"나";

  const birth=_selectedPerson?.birth?(()=>{
    const parts=_selectedPerson.birth.replace(/[^0-9]/g,"-").split("-").filter(Boolean);
    return parts.length>=3?{year:+parts[0],month:+parts[1],day:+parts[2]}:null;
  })():null;
  const hour=_selectedPerson?.time&&_selectedPerson.time!=="모름"?parseInt(_selectedPerson.time):null;
  const sajuInfo=_sajuInfo||(_selectedPerson&&birth?saJuToType(getSaju(birth.year,birth.month,birth.day,hour)):null);

  const cntKey='chungi_gijildo_count';
  const[cnt,setCnt]=useState(()=>{try{return parseInt(localStorage.getItem(cntKey)||'0');}catch{return 0;}});
  const[loading,setLoading]=useState(false);
  const[showPayDone,setShowPayDone]=useState(false);
  const[screen,setScreen]=useState("result"); // 미리보기: 바로 결과
  const[current,setCurrent]=useState(0);
  const[answers,setAnswers]=useState(Array(40).fill(null));
  const[qType,setQType]=useState("음천정유"); // 미리보기: 난초(INFP)
  const[waveType,setWaveType]=useState({type:"T",tPct:65,aPct:35}); // 미리보기 더미
  const[selected,setSelected]=useState(null);
  const[visible,setVisible]=useState(true);
  const[resultTab,setResultTab]=useState(0);

  // 사전질문 답변
  const[preQ1,setPreQ1]=useState("달달한 연애 중"); // 미리보기 더미
  const[preQ2,setPreQ2]=useState("직장인·회사원"); // 미리보기 더미

  const progress=Math.round((current/QUESTIONS.length)*100);
  const personName=_personName;

  // 쪽집게 도입부 생성
  function getIntroPhrase(sData,qData){
    const love=preQ1||null;
    const job=preQ2||null;
    let loveStr="";
    let jobStr="";
    if(love){
      if(love.includes("연애 중")||love.includes("달달"))loveStr="연애 중인";
      else if(love.includes("결혼"))loveStr="결혼한";
      else if(love.includes("솔로"))loveStr="솔로인";
      else if(love.includes("이별"))loveStr="상처를 회복 중인";
    }
    if(job){
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
    setScreen("pay");
  }
  function pay(){setLoading(true);setTimeout(()=>{setLoading(false);setShowPayDone(true);},1600);}
  function onPayDone(){setShowPayDone(false);setScreen("preQ");}

  function handleAnswer(code){
    if(!visible)return;
    setSelected(code);
    setTimeout(()=>{
      const na=[...answers];na[current]=code;setAnswers(na);setSelected(null);
      if(current+1>=QUESTIONS.length){
        const qt=getQType(na);const wt=getWaveType(na);
        setQType(qt);setWaveType(wt);setScreen("result");
        const qData=TYPES[qt]||TYPES["양천리강"];
        addHistory?.({icon:"🧬",name:"기질도",svcId:"gijildo",person:personName,date:new Date().toLocaleDateString("ko-KR"),
          result:`${qData.emoji} ${qData.name}형 (${qData.mbti})`,
          resultType:{type_name:qData.name,mbti:qData.mbti,subtitle:qData.subtitle,ohang:sajuInfo?.ohang},
          ctx:{gijildo_code:qt,saju_code:sajuInfo?.code}});
        try{localStorage.setItem(cntKey,String(cnt+1));setCnt(c=>c+1);}catch{}
      }else{setVisible(false);setTimeout(()=>{setCurrent(c=>c+1);setVisible(true);},260);}
    },280);
  }

  const ohColors={목:"#81C784",화:"#FF7043",토:"#FFB74D",금:"#B0BEC5",수:"#4FC3F7"};

  // ━━━ 설명팝업 ━━━
  if(screen==="intro") return(
    <div className="ov"><div className="md"><div className="hd"/>
      <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
        <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div style={{background:"rgba(0,0,0,0.25)",borderRadius:20,padding:"24px 16px 20px",border:"2px solid rgba(91,181,214,0.4)",textAlign:"center",marginBottom:12}}>
        <div style={{padding:"6px 0 14px"}}>
          {/* 육각별 + 우측 상단 떠있는 점 */}
          <div style={{position:"relative",width:80,height:80,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* 오른쪽 위 떠있는 점 — 별 바깥 */}
            <div style={{
              position:"absolute",top:-4,right:-4,
              width:7,height:7,borderRadius:"50%",
              background:"#5BB5D6",
              boxShadow:"0 0 8px rgba(91,181,214,0.9)",
              animation:"_gjFloatDot 2.4s ease-in-out infinite 0.4s"
            }}/>
            {/* 다윗의 별 SVG (🔯) — 위 삼각형 + 아래 삼각형 겹침 */}
            <svg width="70" height="70" viewBox="0 0 60 60" style={{
              display:"block",
              animation:"_gjFloat 2.4s ease-in-out infinite",
              filter:"drop-shadow(0 0 12px rgba(91,181,214,0.55))"
            }}>
              {/* 아래 삼각형 (▽) */}
              <polygon points="30,52 5,10 55,10"
                fill="rgba(91,181,214,0.07)" stroke="#5BB5D6" strokeWidth="1.6" strokeLinejoin="round"/>
              {/* 위 삼각형 (△) */}
              <polygon points="30,8 55,50 5,50"
                fill="rgba(91,181,214,0.07)" stroke="#5BB5D6" strokeWidth="1.6" strokeLinejoin="round"/>
              {/* 중앙 점 */}
              <circle cx="30" cy="30" r="2.5" fill="#5BB5D6" opacity="0.9"/>
            </svg>
          </div>
          <div style={{fontSize:10,color:"#5BB5D6",letterSpacing:8,fontWeight:600,marginBottom:6,fontFamily:"'Noto Serif KR','Batang',serif"}}>氣 質 圖</div>
          <div style={{fontFamily:"'Noto Serif KR','Batang',serif",fontSize:52,fontWeight:900,color:"#5BB5D6",marginBottom:8,letterSpacing:4,lineHeight:1.0}}>기질도</div>
          <div style={{fontSize:12,color:"var(--mist)",lineHeight:1.7,marginBottom:0}}>
            타고난 기질 <span style={{color:"#5BB5D6",fontWeight:700,margin:"0 4px"}}>vs</span> 살아온 기질<br/>
            <span style={{fontSize:11,color:"#aaa"}}>"내 사주 동물은? 🐯🐲🦅🦄"</span><br/>
            <span style={{fontSize:10,color:"#888"}}>백호·청룡·봉황·기린·난초… 동양식 16유형</span>
          </div>
        </div>
        <div style={{textAlign:"left",marginBottom:16,marginTop:18,padding:"14px 12px",background:"rgba(0,0,0,0.25)",borderRadius:12,border:"1px solid rgba(91,181,214,0.18)"}}>
          {[
            {icon:"🌟",title:"사주 분석",desc:"생년월일로 타고난 기질을 탐색해요"},
            {icon:"📋",title:"40문항 테스트",desc:"살아온 기질을 정밀하게 파악해요"},
            {icon:"⚡",title:"비교 & 보완",desc:"두 기질의 차이와 성장 방향을 제시해요"},
            {icon:"🌊",title:"마음의 파동 (A/T)",desc:"호수형(자기확신) vs 파도형(섬세)"},
            {icon:"💕",title:"궁합 & 상극",desc:"찰떡 궁합 + 주의할 상극 유형"},
            {icon:"✨",title:"16종 캐릭터",desc:"청룡·봉황·백호 등 나만의 캐릭터"},
          ].map(f=>(
            <div key={f.title} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{f.icon}</span>
              <div><div style={{fontSize:12,fontWeight:700,color:"#5BB5D6"}}>{f.title}</div><div style={{fontSize:10,color:"var(--mist)",lineHeight:1.5}}>{f.desc}</div></div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
          {[{hanja:"陽·陰",kr:"(양·음)",axis:"기운",sub:"외향/내향"},{hanja:"天·地",kr:"(천·지)",axis:"인식",sub:"직관/감각"},{hanja:"理·情",kr:"(리·정)",axis:"판단",sub:"이성/감성"},{hanja:"剛·柔",kr:"(강·유)",axis:"생활",sub:"계획/유연"}].map(a=>(
            <div key={a.axis} style={{background:"rgba(0,0,0,0.35)",border:"1px solid rgba(91,181,214,0.4)",borderRadius:12,padding:"14px 4px",textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#5BB5D6",marginBottom:3,fontFamily:"'Noto Serif KR','Batang',serif",lineHeight:1.2}}>{a.hanja}</div>
              <div style={{fontSize:9,color:"var(--mist)",marginBottom:8}}>{a.kr}</div>
              <div style={{fontSize:11,fontWeight:800,color:"var(--white)",marginBottom:2}}>{a.axis}</div>
              <div style={{fontSize:9,color:"var(--mist)",lineHeight:1.4}}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-p" onClick={doStart}>기질 탐색 시작 (980원)</button>
      <div style={{fontSize:10,color:"rgba(168,196,184,0.5)",textAlign:"center",margin:"10px 0 0",lineHeight:1.6}}>동양 철학 기반 성향 탐색용 · 의료적 진단 아님</div>
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
      <div className="ms">1회 분석 980원</div>
      <div style={{background:"var(--ink3)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center",border:"1px solid rgba(212,175,55,0.1)"}}>
        <div style={{fontSize:13,color:"var(--mist)",lineHeight:1.7}}>40문항 테스트 + 사주 기반<br/>16유형 기질 분석 리포트</div>
      </div>
      {loading?<div style={{display:"flex",gap:5,justifyContent:"center",padding:16}}><div className="dot"/><div className="dot"/><div className="dot"/></div>:
        <button className="btn btn-p" onClick={pay}>980원 결제하고 시작하기</button>}
      <button className="btn btn-g" onClick={onClose}>닫기</button>
    </div></div>
  );

  // ━━━ 사전질문 화면 ━━━
  if(screen==="preQ"){
    const step=preQ1===null?1:2;
    return(
      <div className="ov"><div className="md"><div className="hd"/>
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:20,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${step===1?50:100}%`,background:"var(--gold)",borderRadius:4,transition:"width .4s"}}/>
        </div>
        <div style={{fontSize:11,color:"var(--gold)",marginBottom:4,letterSpacing:1}}>{step}/2</div>
        <div style={{fontSize:12,color:"var(--mist)",marginBottom:16,lineHeight:1.6}}>
          잠깐, 결과를 더 정확하게 드릴게요!<br/>
          <span style={{fontSize:10,color:"#666"}}>💡 선택하면 맞춤 해석을 드려요 · 건너뛰기 가능</span>
        </div>
        {step===1&&<>
          <div style={{fontSize:16,fontWeight:700,marginBottom:16,fontFamily:"'Noto Serif KR',serif"}}>요즘 마음의 온도는? 🌡️</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PRE_Q1.map(opt=>(
              <button key={opt.label} onClick={()=>setPreQ1(opt.label)} style={{
                padding:"14px 16px",background:"var(--ink3)",border:"1.5px solid rgba(255,255,255,0.07)",
                borderRadius:14,fontSize:13,color:"var(--mist)",cursor:"pointer",textAlign:"left",
                display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"
              }}>
                <span style={{fontSize:18}}>{opt.emoji}</span>{opt.label}
              </button>
            ))}
          </div>
          <button className="btn btn-g" style={{marginTop:12,fontSize:12}} onClick={()=>setPreQ1("skip")}>건너뛰기</button>
        </>}
        {step===2&&<>
          <div style={{fontSize:16,fontWeight:700,marginBottom:16,fontFamily:"'Noto Serif KR',serif"}}>요즘 낮을 채우는 일은? ☀️</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PRE_Q2.map(opt=>(
              <button key={opt.label} onClick={()=>{setPreQ2(opt.label);setScreen("test");}} style={{
                padding:"14px 16px",background:"var(--ink3)",border:"1.5px solid rgba(255,255,255,0.07)",
                borderRadius:14,fontSize:13,color:"var(--mist)",cursor:"pointer",textAlign:"left",
                display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"
              }}>
                <span style={{fontSize:18}}>{opt.emoji}</span>{opt.label}
              </button>
            ))}
          </div>
          <button className="btn btn-g" style={{marginTop:12,fontSize:12}} onClick={()=>{setPreQ2("skip");setScreen("test");}}>건너뛰기</button>
        </>}
      </div></div>
    );
  }

  // ━━━ 테스트 화면 ━━━
  if(screen==="test"){
    const q=QUESTIONS[current];
    return(
      <div className="ov"><div className="md" style={{maxHeight:"100dvh",paddingBottom:20}}>
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
              return(<button key={idx} onClick={()=>handleAnswer(opt.code)} style={{
                padding:"18px 16px",background:isSel?"rgba(212,175,55,0.12)":"var(--ink3)",
                border:isSel?"1.5px solid var(--gold)":"1.5px solid rgba(255,255,255,0.07)",
                borderRadius:14,fontSize:14,color:isSel?"var(--gold)":"var(--mist)",
                cursor:"pointer",textAlign:"left",lineHeight:1.6,fontFamily:"inherit",
                transition:"all .2s",transform:isSel?"scale(0.98)":"scale(1)"
              }}>
                <span style={{fontSize:10,opacity:0.3,marginRight:8}}>{idx===0?"A":"B"}</span>{opt.label}
              </button>);
            })}
          </div>
          {current>0&&<button onClick={()=>setCurrent(c=>c-1)} className="btn btn-g" style={{marginTop:10,fontSize:12}}>← 이전 질문</button>}
          <button className="btn btn-g" style={{marginTop:6,fontSize:12}} onClick={onClose}>닫기</button>
        </div>
      </div></div>
    );
  }

  // ━━━ 결과 화면 ━━━
  if(screen==="result"){
    if(!sajuInfo||!qType){
      return(
        <div className="ov"><div className="md"><div className="hd"/>
          <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div className="mt">⚠️ 결과를 불러올 수 없어요</div>
          <div className="ms">{!sajuInfo?"사주 정보가 없습니다.":"테스트 결과가 없습니다."}</div>
          <button className="btn btn-p" style={{marginTop:12}} onClick={()=>{setCurrent(0);setAnswers(Array(40).fill(null));setQType("");setWaveType(null);setScreen("preQ");}}>처음부터 다시</button>
          <button className="btn btn-g" onClick={onClose}>닫기</button>
        </div></div>
      );
    }

    const sData=TYPES[sajuInfo.code]||TYPES["양천리강"];
    const qData=TYPES[qType]||TYPES["양천리강"];
    const isSame=sajuInfo.code===qType;
    const sChars=sajuInfo.code.split("");
    const qChars=qType.split("");
    const diffAxes=AXIS_ORDER.filter((_,i)=>sChars[i]!==qChars[i]);
    const advices=diffAxes.map(axis=>{const i=AXIS_ORDER.indexOf(axis);const key=`${sChars[i]}→${qChars[i]}`;return DIFF[axis]?.[key]?{axis,...DIFF[axis][key]}:null;}).filter(Boolean);
    const introPhrase=getIntroPhrase(sData,qData);

    // 싱크로율
    const syncRate=Math.round(((4-diffAxes.length)/4)*100);

    const TAB_LABELS=["🃏 인증서","🧬 타고난","🪞 살아온","⚡ 비교·보완","🌟 개운법"];

    return(
      <div className="ov"><div className="md"><div className="hd"/>
        {/* 닫기 */}
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div className="mt">🧬 {personName}님의 기질도</div>
        <div className="ms">타고난 기질 vs 살아온 기질 비교 분석</div>

        {/* ━━━ 탭 네비 ━━━ */}
        <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}>
          {TAB_LABELS.map((label,i)=>(
            <button key={i} onClick={()=>setResultTab(i)} style={{
              flexShrink:0,padding:"7px 10px",background:resultTab===i?"var(--gold)":"rgba(255,255,255,0.05)",
              border:"none",borderRadius:20,fontSize:10,fontWeight:700,
              color:resultTab===i?"#1A3C32":"var(--mist)",cursor:"pointer",whiteSpace:"nowrap"
            }}>{label}</button>
          ))}
        </div>

        {/* ━━━ 탭0: 인증서 카드 ━━━ */}
        {resultTab===0&&<>
          <div id="gijildo-capture" style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 10px 30px rgba(0,0,0,0.06)",marginBottom:12,color:"#333"}}>
            {/* 브랜딩 헤더 */}
            <div style={{padding:"14px 16px 10px",textAlign:"center",borderBottom:"1px solid #f0f0f0",background:"#fcfcfd"}}>
              <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,marginBottom:4}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
              <div style={{fontSize:15,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif"}}>{personName}님의 기질 분석</div>
              <div style={{fontSize:9,color:"#bbb",marginTop:2}}>{new Date().toLocaleDateString("ko-KR")}</div>
            </div>

            {/* 두 유형 카드 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"14px 16px"}}>
              {[{d:sData,c:sChars,label:"🌟 타고난 기질",sub:"사주 기반"},{d:qData,c:qChars,label:"🪞 살아온 기질",sub:"테스트 기반"}].map(({d,c,label,sub},ci)=>(
                <div key={ci} style={{background:`${d.color}10`,border:`1px solid ${d.color}25`,borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:d.color,fontWeight:700,marginBottom:6}}>{label}</div>
                  <img src={`/기질도-캐릭터/${d.name}.png`} alt={d.name} style={{width:60,height:60,objectFit:"contain",margin:"0 auto 6px",display:"block",borderRadius:8}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                  <div style={{fontSize:16,marginBottom:2}}>{d.emoji}</div>
                  <div style={{fontSize:14,fontWeight:900,color:"#1A3C32"}}>{d.name}형</div>
                  <div style={{fontSize:10,color:d.color,fontWeight:600,marginBottom:4}}>{d.subtitle}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:2,margin:"4px 0"}}>
                    {c.map((ch,i)=>(<span key={i} style={{width:18,height:18,border:`1px solid ${d.color}`,borderRadius:4,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:d.color}}>{ch}</span>))}
                  </div>
                  <div style={{fontSize:9,color:"#888"}}>{sub} · {d.mbti}</div>
                </div>
              ))}
            </div>

            {/* 종합 판정 */}
            <div style={{textAlign:"center",padding:"10px 16px",borderTop:"1px solid #f0f0f0",borderBottom:"1px solid #f0f0f0",background:"#fafafa"}}>
              <div style={{fontSize:22,marginBottom:2}}>{isSame?"✨":"⚡"}</div>
              <div style={{fontSize:13,fontWeight:900,color:isSame?"#059669":"#D4AF37"}}>
                {isSame?"타고난 대로 살고 있어요!":`${diffAxes.length}개 축에서 차이 · 싱크로율 ${syncRate}%`}
              </div>
            </div>

            {/* 4축 비교 */}
            <div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:8}}>⚖️ 4축 비교</div>
              {AXIS_ORDER.map((axis,i)=>{
                const sv=sChars[i],qv=qChars[i],same=sv===qv;
                return(<div key={axis} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span style={{fontSize:10,color:"#888",width:65,flexShrink:0}}>{AXIS_HANJA_SHORT[axis]}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${sData.color}18`,padding:"2px 8px",borderRadius:6}}>{sv}</span>
                  <span style={{fontSize:11,color:same?"#059669":"#D4AF37"}}>{same?"＝":"≠"}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${qData.color}18`,padding:"2px 8px",borderRadius:6}}>{qv}</span>
                  <span style={{fontSize:9,color:same?"#059669":"#D4AF37",marginLeft:"auto"}}>{same?"일치":"차이"}</span>
                </div>);
              })}
            </div>

            {/* 마음의 파동 — 인증서에 추가 */}
            {waveType&&<div style={{padding:"12px 16px",borderBottom:"1px solid #f0f0f0"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#9B8FD4",marginBottom:8}}>🌊 마음의 파동</div>
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
              <div style={{fontSize:10,color:"#888",lineHeight:1.5}}>
                {waveType.type==="A"?"잔잔하고 단단한 호수형. 감정의 흔들림이 적고 안정적으로 나아가는 힘이 있어요.":"물결치는 파도형. 감정의 진폭이 크고 섬세하게 주변을 감지하는 능력이 있어요."}
              </div>
            </div>}

            {/* 해시태그 + 브랜딩 */}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",fontSize:8,color:"#bbb"}}>
              <span>#{`천기기질분석`} #{`기질도`} #{`동양식16유형`} #{`${qData.name}형`} #{qData.mbti} #{(personName||"").replace(/\s/g,"")}</span>
              <span style={{fontWeight:600}}>🌐 천기.kr</span>
            </div>
          </div>

          {/* 캡처 + 공유 버튼 */}
          <button className="btn btn-g" onClick={()=>{
            const txt=`나의 기질도: ${qData.emoji} ${qData.name}형 (${qData.mbti}) — ${qData.subtitle}\n천기(天機) 오리지널 16유형 氣質圖\nhttps://chungi.kr`;
            if(typeof navigator!=='undefined'&&navigator.share){navigator.share({title:'나의 기질도',text:txt,url:'https://chungi.kr'}).catch(()=>{});}
            else{navigator.clipboard?.writeText(txt).then(()=>alert('결과가 복사됐어요! 친구에게 공유해보세요 🔗'));}
          }}>📸 결과 공유하기</button>
        </>}

        {/* ━━━ 탭1: 타고난 기질 (사주 기반) ━━━ */}
        {resultTab===1&&<div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333"}}>
          {/* 헤더 */}
          <div style={{padding:"16px 16px 12px",textAlign:"center",borderBottom:"1px solid #f0f0f0",background:"#fcfcfd"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,marginBottom:6}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:36,marginBottom:4}}>{sData.emoji}</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif"}}>{sData.name}형</div>
            <div style={{fontSize:11,color:sData.color,fontWeight:600,marginBottom:4}}>{sData.subtitle}</div>
            <div style={{fontSize:10,color:"#999"}}>{sajuInfo.code} ({sData.hanja}) · {sData.mbti}</div>
          </div>

          <div style={{padding:"16px 16px"}}>
            {/* 쪽집게 도입부 */}
            <div style={{background:`${sData.color}10`,borderLeft:`4px solid ${sData.color}`,borderRadius:"0 12px 12px 0",padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#444",lineHeight:1.85,fontStyle:"italic"}}>
                "{introPhrase} 타고나길 <strong>{sData.name}</strong>의 기운을 품고 오셨네요.<br/>
                {sData.desc_long}"
              </div>
            </div>

            {/* 강점 태그 */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
              {sData.strengths.map(s=>(<span key={s} style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${sData.color}15`,color:sData.color,border:`1px solid ${sData.color}30`}}>{s}</span>))}
            </div>

            {/* 5가지 분석 섹션 */}
            {[
              {icon:"📌",label:"타고난 성향",text:sData.desc,color:"#1a73e8",bg:"#e8f4fd"},
              {icon:"💰",label:"재물운 흐름",text:sData.money,color:"#D4AF37",bg:"#fdf8e8"},
              {icon:"❤️",label:"연애 성향",text:sData.love,color:"#e03131",bg:"#fff5f5"},
              {icon:"💼",label:"추천 직업",text:sData.jobs.join(" · "),color:"#059669",bg:"#e8fdf4"},
              {icon:"🌿",label:"건강 주의점",text:sData.health,color:"#2d6a4f",bg:"#d8f3dc"},
            ].map(sec=>(
              <div key={sec.label} style={{background:sec.bg,borderRadius:12,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${sec.color}`}}>
                <div style={{fontSize:10,fontWeight:700,color:sec.color,marginBottom:4}}>{sec.icon} {sec.label}</div>
                <div style={{fontSize:11,color:"#444",lineHeight:1.75}}>{sec.text}</div>
              </div>
            ))}

            {/* 주의할 점 */}
            <div style={{background:"#fff8dc",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid #ffe69c"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#b45309",marginBottom:4}}>⚠️ 주의할 점</div>
              <div style={{fontSize:11,color:"#444",lineHeight:1.75}}>{sData.weak}</div>
            </div>

            {/* 사주 기반 유명인 */}
            <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid #bbf7d0"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#059669",marginBottom:6}}>✦ 비슷한 사주의 유명인</div>
              <div style={{fontSize:11,color:"#444",lineHeight:1.7,marginBottom:6}}>{sData.celeb_saju}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {sData.celeb.split(",").map(p=>(<span key={p} style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:20,background:"#dcfce7",color:"#059669"}}>{p.trim()}</span>))}
              </div>
            </div>

            {/* 오행 레이더 */}
            <div style={{padding:"0",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:10}}>🌿 사주 오행 분포 · 일간: {sajuInfo.ilganName}</div>
              {(()=>{
                const order=["목","화","토","금","수"];
                const total=Object.values(sajuInfo.ohang).reduce((a,b)=>a+b,0)||1;
                const cx=110,cy=110,maxR=88;
                const angles=order.map((_,i)=>(-Math.PI/2)+(i*2*Math.PI/5));
                const ringPoints=(scale)=>angles.map(a=>`${cx+Math.cos(a)*maxR*scale},${cy+Math.sin(a)*maxR*scale}`).join(" ");
                const dataPoints=order.map((oh,i)=>{const pct=(sajuInfo.ohang[oh]/total);const r=maxR*Math.max(0.05,pct*5/2);return{x:cx+Math.cos(angles[i])*Math.min(r,maxR),y:cy+Math.sin(angles[i])*Math.min(r,maxR),pct:Math.round(pct*100)};});
                const maxPct=Math.max(...dataPoints.map(d=>d.pct));
                return(
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <svg width="220" height="220" viewBox="0 0 220 220" style={{flexShrink:0}}>
                      {[0.25,0.5,0.75,1].map(s=>(<polygon key={s} points={ringPoints(s)} fill="none" stroke="#e8e8e8" strokeWidth="1"/>))}
                      {angles.map((a,i)=>(<line key={i} x1={cx} y1={cy} x2={cx+Math.cos(a)*maxR} y2={cy+Math.sin(a)*maxR} stroke="#e8e8e8" strokeWidth="1"/>))}
                      <polygon points={dataPoints.map(d=>`${d.x},${d.y}`).join(" ")} fill="rgba(212,175,55,0.18)" stroke="#D4AF37" strokeWidth="2"/>
                      {dataPoints.map((d,i)=>(<circle key={i} cx={d.x} cy={d.y} r="4" fill={ohColors[order[i]]} stroke="#fff" strokeWidth="1.5"/>))}
                      {angles.map((a,i)=>{const lx=cx+Math.cos(a)*(maxR+18);const ly=cy+Math.sin(a)*(maxR+18);const isMax=dataPoints[i].pct===maxPct;return(<g key={i}><text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight={isMax?900:700} fill={ohColors[order[i]]}>{order[i]}</text><text x={lx} y={ly+14} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#999">{dataPoints[i].pct}%</text></g>);})}
                    </svg>
                    <div style={{flex:1}}>
                      {Object.entries(sajuInfo.ohang).map(([oh,score])=>{const pct=Math.round((score/total)*100);return(<div key={oh} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><span style={{fontSize:10,color:ohColors[oh],width:12,fontWeight:700}}>{oh}</span><div style={{flex:1,height:5,background:"#f0f0f0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:ohColors[oh],borderRadius:4}}/></div><span style={{fontSize:9,color:"#888",width:24,textAlign:"right"}}>{pct}%</span></div>);})}
                      <div style={{fontSize:9,color:"#aaa",marginTop:6,lineHeight:1.5}}>가장 강한 오행이 {personName}님의 핵심 기운이에요.</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>}

        {/* ━━━ 탭2: 살아온 기질 (테스트 기반) ━━━ */}
        {resultTab===2&&<div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333"}}>
          {/* 헤더 */}
          <div style={{padding:"16px 16px 12px",textAlign:"center",borderBottom:"1px solid #f0f0f0",background:"#fcfcfd"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,marginBottom:6}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:36,marginBottom:4}}>{qData.emoji}</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif"}}>{qData.name}형</div>
            <div style={{fontSize:11,color:qData.color,fontWeight:600,marginBottom:4}}>{qData.subtitle}</div>
            <div style={{fontSize:10,color:"#999"}}>{qType} ({qData.hanja}) · {qData.mbti}</div>
          </div>

          <div style={{padding:"16px 16px"}}>
            {/* 쪽집게 도입부 — 사전질문 반영 */}
            <div style={{background:`${qData.color}10`,borderLeft:`4px solid ${qData.color}`,borderRadius:"0 12px 12px 0",padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#444",lineHeight:1.85,fontStyle:"italic"}}>
                "{introPhrase} 살아오면서 <strong>{qData.name}</strong>처럼 세상을 마주해왔네요.<br/>
                {qData.desc_long}"
              </div>
            </div>

            {/* 강점 태그 */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
              {qData.strengths.map(s=>(<span key={s} style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:`${qData.color}15`,color:qData.color,border:`1px solid ${qData.color}30`}}>{s}</span>))}
            </div>

            {/* 5가지 분석 섹션 */}
            {[
              {icon:"📌",label:"살아온 성향",text:qData.desc,color:"#1a73e8",bg:"#e8f4fd"},
              {icon:"💰",label:"재물 다루는 방식",text:qData.money,color:"#D4AF37",bg:"#fdf8e8"},
              {icon:"❤️",label:"연애할 때 이런 사람",text:qData.love,color:"#e03131",bg:"#fff5f5"},
              {icon:"💼",label:"일하는 스타일",text:qData.jobs.join(" · "),color:"#059669",bg:"#e8fdf4"},
              {icon:"🌿",label:"건강·스트레스 패턴",text:qData.health,color:"#2d6a4f",bg:"#d8f3dc"},
            ].map(sec=>(
              <div key={sec.label} style={{background:sec.bg,borderRadius:12,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${sec.color}`}}>
                <div style={{fontSize:10,fontWeight:700,color:sec.color,marginBottom:4}}>{sec.icon} {sec.label}</div>
                <div style={{fontSize:11,color:"#444",lineHeight:1.75}}>{sec.text}</div>
              </div>
            ))}

            {/* 주의할 점 */}
            <div style={{background:"#fff8dc",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid #ffe69c"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#b45309",marginBottom:4}}>⚠️ 성장 포인트</div>
              <div style={{fontSize:11,color:"#444",lineHeight:1.75}}>{qData.weak}</div>
            </div>

            {/* 성격 기반 유명인 */}
            <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px 14px",marginBottom:10,border:"1px solid #bbf7d0"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#059669",marginBottom:6}}>✦ 비슷한 성격의 유명인</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {qData.celeb.split(",").map(p=>(<span key={p} style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:20,background:"#dcfce7",color:"#059669"}}>{p.trim()}</span>))}
              </div>
            </div>

            {/* 마음의 파동 */}
            {waveType&&<div style={{padding:"12px 14px",background:"#f8f4ff",borderRadius:12,marginBottom:10,border:"1px solid #e9d5ff"}}>
              <div style={{fontSize:11,fontWeight:800,color:"#7c3aed",marginBottom:8}}>🌊 마음의 파동</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{flex:1,background:waveType.type==="A"?"#e3f2fd":"#fafafa",border:waveType.type==="A"?"1px solid #90caf9":"1px solid #eee",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:16}}>🏔️</div>
                  <div style={{fontSize:11,fontWeight:700,color:waveType.type==="A"?"#1565c0":"#aaa"}}>A형 · 호수 {waveType.aPct}%</div>
                </div>
                <div style={{flex:1,background:waveType.type==="T"?"#f3e5f5":"#fafafa",border:waveType.type==="T"?"1px solid #ce93d8":"1px solid #eee",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:16}}>🌊</div>
                  <div style={{fontSize:11,fontWeight:700,color:waveType.type==="T"?"#7b1fa2":"#aaa"}}>T형 · 파도 {waveType.tPct}%</div>
                </div>
              </div>
              <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>
                {waveType.type==="A"?"잔잔하고 단단한 호수형. 감정의 흔들림이 적고 안정적으로 나아가는 힘이 있어요.":"물결치는 파도형. 감정의 진폭이 크고 섬세하게 주변을 감지하는 능력이 있어요."}
              </div>
            </div>}

            {/* 찰떡 + 상극 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:0}}>
              {TYPES[qData.match]&&<div style={{background:"#fff5f5",border:"1px solid #ffe0e6",borderRadius:12,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#c92a2a",marginBottom:4}}>💕 찰떡 궁합</div>
                <div style={{fontSize:20,marginBottom:4}}>{TYPES[qData.match].emoji}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1A3C32"}}>{TYPES[qData.match].name}형</div>
                <div style={{fontSize:9,color:"#888"}}>{TYPES[qData.match].subtitle}</div>
              </div>}
              {TYPES[qData.anti]&&<div style={{background:"#f8f9fa",border:"1px solid #eee",borderRadius:12,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:9,fontWeight:800,color:"#666",marginBottom:4}}>⚡ 상극 유형</div>
                <div style={{fontSize:20,marginBottom:4}}>{TYPES[qData.anti].emoji}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#1A3C32"}}>{TYPES[qData.anti].name}형</div>
                <div style={{fontSize:9,color:"#888"}}>{TYPES[qData.anti].subtitle}</div>
              </div>}
            </div>
          </div>
        </div>}

        {/* ━━━ 탭3: 두 기질 비교 ━━━ */}
        {resultTab===3&&<div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333"}}>
          <div style={{padding:"16px 16px 12px",textAlign:"center",borderBottom:"1px solid #f0f0f0",background:"#fcfcfd"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,marginBottom:6}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
            <div style={{fontSize:15,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif"}}>두 기질 비교 분석</div>
          </div>
          <div style={{padding:"16px"}}>
            {/* 싱크로율 */}
            <div style={{background:isSame?"#e8fdf4":"#fffbeb",border:`1px solid ${isSame?"#bbf7d0":"#fde68a"}`,borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:6}}>{isSame?"✨":"⚡"}</div>
              <div style={{fontSize:22,fontWeight:900,color:isSame?"#059669":"#D4AF37",marginBottom:4}}>싱크로율 {syncRate}%</div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.7}}>
                {isSame
                  ?"타고난 사주 기질대로 살고 있어요! 자연스러운 삶의 흐름을 유지하고 있는 분이에요."
                  :`타고난 ${sData.name}의 기운과 살아온 ${qData.name}의 방식 사이에 간극이 있어요.`}
              </div>
            </div>

            {/* 4축 비교 */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:10}}>⚖️ 4축 상세 비교</div>
              {AXIS_ORDER.map((axis,i)=>{
                const sv=sChars[i],qv=qChars[i],same=sv===qv;
                return(<div key={axis} style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,padding:"8px 10px",background:same?"#f0fdf4":"#fffbeb",borderRadius:10,border:`1px solid ${same?"#bbf7d0":"#fde68a"}`}}>
                  <span style={{fontSize:10,color:"#888",width:65,flexShrink:0}}>{AXIS_HANJA_SHORT[axis]}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${sData.color}18`,padding:"2px 8px",borderRadius:6}}>{sv}</span>
                  <span style={{fontSize:11,color:same?"#059669":"#D4AF37",fontWeight:700}}>{same?"＝":"≠"}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#1A3C32",background:`${qData.color}18`,padding:"2px 8px",borderRadius:6}}>{qv}</span>
                  <span style={{fontSize:9,color:same?"#059669":"#D4AF37",marginLeft:"auto",fontWeight:700}}>{same?"일치":"차이"}</span>
                </div>);
              })}
            </div>

            {/* 간극 스토리 */}
            {!isSame&&<div style={{background:"#f0f4ff",border:"1px solid #c7d2fe",borderRadius:14,padding:"14px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:"#4263eb",marginBottom:8}}>💡 왜 이런 간극이 생겼을까요?</div>
              <div style={{fontSize:12,color:"#444",lineHeight:1.85}}>
                <strong>{sData.name}({sData.mbti})</strong>으로 태어난 {personName}님,<br/>
                그런데 살아오면서 <strong>{qData.name}({qData.mbti})</strong>처럼 살고 있네요.<br/><br/>
                타고난 기질과 살아온 방식의 간극은 나쁜 게 아니에요.<br/>
                환경과 경험이 당신을 다듬어온 흔적이에요.<br/>
                이 간극을 이해하면 "<em>왜 나는 이럴까?</em>"의 답이 보여요.
              </div>
            </div>}

            {/* 보완 조언 */}
            {advices.length>0&&<div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:"#D4AF37",marginBottom:10}}>🔧 축별 보완 조언</div>
              {advices.map((adv,i)=>(
                <div key={i} style={{background:"#f8f9fa",borderRadius:12,padding:"12px",marginBottom:8,borderLeft:"4px solid #D4AF37"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#D4AF37",marginBottom:4}}>💡 {AXIS_HANJA_SHORT[adv.axis]} 보완</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#1A3C32",marginBottom:3}}>{adv.title}</div>
                  <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>{adv.msg}</div>
                </div>
              ))}
            </div>}

            {/* 두 기질의 시너지 */}
            <div style={{background:"linear-gradient(135deg,#e8fdf4,#f0f4ff)",border:"1px solid #bbf7d0",borderRadius:14,padding:"14px",marginBottom:0}}>
              <div style={{fontSize:11,fontWeight:800,color:"#059669",marginBottom:8}}>✨ 두 기질의 시너지</div>
              <div style={{fontSize:12,color:"#444",lineHeight:1.85}}>
                <strong>{sData.name}의 {sData.strengths[0]}</strong> +<br/>
                <strong>{qData.name}의 {qData.strengths[0]}</strong> =<br/>
                <span style={{color:"#059669",fontWeight:700}}>더 깊고 입체적인 당신만의 강점</span><br/><br/>
                <span style={{fontSize:11,color:"#666"}}>두 기질이 균형을 이룰 때, {personName}님만이 가질 수 있는 독특한 매력이 피어나요.</span>
              </div>
            </div>
          </div>
        </div>}

        {/* ━━━ 탭4: 개운법 & 광고퍼널 ━━━ */}
        {resultTab===4&&<div>
          {/* 개운 정보 */}
          <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",color:"#333",marginBottom:12}}>
            <div style={{padding:"14px 16px 10px",textAlign:"center",borderBottom:"1px solid #f0f0f0",background:"#fcfcfd"}}>
              <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,marginBottom:4}}>🔮 천기(天機) 오리지널 | 오행·음양으로 푸는 16가지 氣質圖</div>
              <div style={{fontSize:14,fontWeight:900,color:"#1A3C32"}}>✨ {personName}님의 개운 포인트</div>
            </div>
            <div style={{padding:"14px 16px"}}>
              {/* 행운 정보 — 타고난 기질 기반 */}
              {[
                {icon:"🔢",label:"행운의 숫자",value:sData.lucky_num,color:"#D4AF37"},
                {icon:"🎨",label:"행운의 색깔",value:sData.lucky_color,color:"#7c3aed"},
                {icon:"🧭",label:"행운의 방향",value:sData.lucky_dir,color:"#059669"},
                {icon:"🛡️",label:"수호 아이템",value:sData.lucky_item,color:"#e03131"},
              ].map(item=>(
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 12px",background:`${item.color}08`,borderRadius:10,border:`1px solid ${item.color}20`}}>
                  <span style={{fontSize:18}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:9,color:item.color,fontWeight:700,marginBottom:2}}>{item.label}</div>
                    <div style={{fontSize:12,fontWeight:700,color:"#333"}}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* 마무리 확언 */}
              <div style={{background:"linear-gradient(135deg,rgba(212,175,55,0.08),rgba(155,143,212,0.05))",borderRadius:12,padding:"14px",textAlign:"center",marginBottom:0,border:"1px solid rgba(212,175,55,0.2)"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#4263eb",lineHeight:1.8}}>
                  🔮 "{personName}님은 {sData.name}의 기운을 타고났어요.<br/>
                  {sData.strengths[0]}과 {qData.strengths[0]}을 함께 가진<br/>
                  당신만의 빛나는 길을 걸어가세요." ✨
                </div>
              </div>
            </div>
          </div>

          {/* 굿즈 추천 */}
          <div style={{marginBottom:10,padding:"14px",background:"linear-gradient(135deg,rgba(212,175,55,0.08),rgba(155,143,212,0.05))",borderRadius:14,border:"1px solid rgba(212,175,55,0.15)"}}>
            <div style={{fontSize:11,fontWeight:800,color:"var(--gold)",marginBottom:4}}>🛍️ {sData.name}형 맞춤 개운 굿즈</div>
            <div style={{fontSize:10,color:"var(--mist)",lineHeight:1.6,marginBottom:8}}>{sData.emoji} 행운의 아이템으로 기운을 끌어올려보세요</div>
            <button className="btn btn-g" style={{margin:0,fontSize:12,padding:"10px 14px"}} onClick={()=>{onClose?.();onGoShop?.();}}>🛍️ 굿즈샵 바로가기 →</button>
          </div>

          {/* 추가결제 퍼널 */}
          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:8}}>💡 더 알아볼까요?</div>

            {/* 뇌과학 — 연관 강조 */}
            <div style={{background:"linear-gradient(135deg,rgba(155,143,212,0.2),var(--ink3))",borderRadius:14,padding:"14px",border:"1px solid rgba(155,143,212,0.3)",marginBottom:8,cursor:"pointer"}} onClick={()=>onOpenService?.("psych","뇌과학 분석","🧠","4,800원")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:800,color:"#9B8FD4",marginBottom:4}}>🧠 뇌과학 분석</div>
                  <div style={{fontSize:10,color:"var(--mist)",lineHeight:1.6}}>{sData.name}+{qData.name} 이중 기질<br/>숨겨진 뇌 특성까지 분석해드려요</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:900,color:"var(--gold)"}}>4,800원</div>
                  <div style={{fontSize:9,color:"#9B8FD4",marginTop:2}}>바로 분석 →</div>
                </div>
              </div>
            </div>

            {/* 연애운·궁합 */}
            <div style={{background:"linear-gradient(135deg,rgba(244,143,177,0.2),var(--ink3))",borderRadius:14,padding:"14px",border:"1px solid rgba(244,143,177,0.3)",marginBottom:8,cursor:"pointer"}} onClick={()=>onOpenService?.("love_compat","연애운·궁합","❤️","980원")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:800,color:"#F48FB1",marginBottom:4}}>❤️ 연애운·궁합</div>
                  <div style={{fontSize:10,color:"var(--mist)",lineHeight:1.6}}>{qData.name}형과 가장 잘 맞는 인연은?<br/>사주로 보는 연애 궁합 분석</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:900,color:"var(--gold)"}}>980원</div>
                  <div style={{fontSize:9,color:"#F48FB1",marginTop:2}}>확인하기 →</div>
                </div>
              </div>
            </div>

            {/* 2세 예측 */}
            <div style={{background:"linear-gradient(135deg,rgba(165,214,167,0.2),var(--ink3))",borderRadius:14,padding:"14px",border:"1px solid rgba(165,214,167,0.3)",marginBottom:8,cursor:"pointer"}} onClick={()=>onOpenService?.("baby_face","2세 얼굴 & 운명","👶","1,980원")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:800,color:"#81C784",marginBottom:4}}>👶 2세 성격 예측</div>
                  <div style={{fontSize:10,color:"var(--mist)",lineHeight:1.6}}>{sData.name}+{qData.name} 부모라면<br/>아이는 어떤 기질일까요?</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:900,color:"var(--gold)"}}>1,980원</div>
                  <div style={{fontSize:9,color:"#81C784",marginTop:2}}>궁금해요 →</div>
                </div>
              </div>
            </div>
          </div>

          {/* 크로스셀 스크롤 */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:8}}>✨ 이것도 해볼래요?</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",msOverflowStyle:"none"}}>
              {[
                {ic:"🔢",name:"수비학",price:"980원",sid:"numerology"},
                {ic:"⏳",name:"전생 운세",price:"980원",sid:"past_life"},
                {ic:"📸",name:"관상짤",price:"380원",sid:"gwansang_zal"},
                {ic:"🪞",name:"내 관상보기",price:"980원",sid:"gwansang_full"},
                {ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"},
                {ic:"🔮",name:"12수호신",price:"무료",sid:"guardian"},
              ].map(cr=>(
                <div key={cr.name} style={{flexShrink:0,width:90,background:"var(--ink3)",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(255,255,255,0.06)",textAlign:"center",cursor:"pointer"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                  <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                  <div style={{fontSize:10,fontWeight:700,marginBottom:2}}>{cr.name}</div>
                  <div style={{fontSize:9,fontWeight:700,color:"var(--gold)"}}>{cr.price}</div>
                </div>
              ))}
            </div>
            <style>{`.hide-scrollbar::-webkit-scrollbar{display:none;}`}</style>
          </div>
        </div>}

        {/* 확인 버튼 */}
        <button className="btn btn-p" onClick={onClose}>확인 완료</button>

        {/* 결제 완료 팝업 */}
        {showPayDone&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:210,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onPayDone}>
          <div style={{background:"var(--ink2)",borderRadius:20,padding:"24px",textAlign:"center",width:"80%",maxWidth:320}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:48,marginBottom:12}}>✨</div>
            <div style={{fontSize:16,fontWeight:900,marginBottom:4}}>결제 완료!</div>
            <div style={{fontSize:12,color:"var(--mist)",marginBottom:16}}>기질도 분석을 시작합니다</div>
            <button className="btn btn-p" onClick={onPayDone}>시작하기 →</button>
          </div>
        </div>}
      </div></div>
    );
  }
  return null;
}
