import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

// ━━━ 25종 전생 유형 데이터 (오행별 5종) ━━━
var PAST_LIFE_TYPES = [
  // 木 (나무) - 창의/성장/독립
  {id:1,ohaeng:"木",ohaeng_color:"#7CB87B",emoji:"📜",name:"선비형",item:"지혜의 붓",
   badge:"木 · 지식의 기운",hashtag:"#갓생러 지식인",
   good_match:"도인형",rival:"상인형",
   identity:"새벽 4시에 혼자 책 펴고 촛불 다 태워먹는 조선판 갓생러. 남들 잘 때 지식 쌓고, 그 지식으로 세상 바꾸려다 현실에 치인 낭만 지식인.",
   trace:"그래서 지금도 배우는 거 엄청 좋아하고, 남들한테 설명할 때 도파민 터짐. 책 한 권 잡으면 밤새 읽는 거 전생에서 온 거임.",
   message:"지식 쌓는 건 전생에 다 했음. 이번 생은 그 지식을 써먹을 시간이에요. 혼자 알고 있지 말고 나누세요.",
   talent:["언어·글쓰기 능력","깊이 있는 학습력","논리적 분석력"],
   goods_tag:"지식"},
  {id:2,ohaeng:"木",ohaeng_color:"#7CB87B",emoji:"🎭",name:"예인형",item:"달빛 브로치",
   badge:"木 · 예술의 기운",hashtag:"#조선판 아이돌 센터",
   good_match:"무녀형",rival:"왕족형",
   identity:"조선 팔도 무대 위에서 빛나던 원조 아이돌. 노래 한 소절에 관객 울리고, 춤 한 동작에 양반들 지갑 열게 하던 타고난 엔터테이너.",
   trace:"그래서 지금도 무대나 카메라 앞에서 자연스럽고, 주목받을 때 에너지가 솟구침. 끼가 넘치는 게 전생 팔자임.",
   message:"전생에 남 즐겁게 해주느라 정작 내 행복은 뒷전이었어요. 이번 생엔 나 자신도 즐기면서 빛나세요.",
   talent:["타고난 무대 감각","감성적 표현력","사람을 끌어당기는 매력"],
   goods_tag:"예술"},
  {id:3,ohaeng:"木",ohaeng_color:"#7CB87B",emoji:"🌱",name:"농부형",item:"오행 씨앗 키링",
   badge:"木 · 인내의 기운",hashtag:"#조선판 존버 투자자",
   good_match:"도인형",rival:"상인형",
   identity:"눈이 오나 비가 오나 묵묵히 씨 뿌려서 결국 가을에 만석꾼 된 조선판 장기투자자. 남들 꼼수 쓸 때 혼자 정석으로 해서 결국 이기는 타입.",
   trace:"그래서 지금도 벼락치기보다 꾸준히 하는 걸 잘하고, 포기를 모름. 한 우물 파서 결국 승리하는 독기가 전생에서 온 거임.",
   message:"씨앗 뿌리고 밭 가는 건 전생에 다 했음. 이번 생은 이미 수확의 계절이니 맘껏 거두고 플렉스하세요.",
   talent:["놀라운 인내심","장기적 안목","포기 모르는 끈기"],
   goods_tag:"기운회복"},
  {id:4,ohaeng:"木",ohaeng_color:"#7CB87B",emoji:"⛓️",name:"혁명가형",item:"끊어진 족쇄",
   badge:"木 · 저항의 기운",hashtag:"#조선판 스파르타쿠스",
   good_match:"무사형",rival:"왕족형",
   identity:"불의 앞에서 무릎 꿇느니 죽겠다 했던 조선판 혁명가. 윗사람한테 직언하다 귀양 가도 굽히지 않던 타고난 반골.",
   trace:"그래서 지금도 부당한 거 보면 못 참고, 하지 말라면 더 하고 싶어짐. 권위에 도전하는 게 DNA에 새겨진 거임.",
   message:"전생에 싸우다 지쳤을 텐데, 이번 생엔 더 영리하게 싸우세요. 힘으로 안 되면 전략으로.",
   talent:["불굴의 의지","정의감","변화를 만드는 용기"],
   goods_tag:"도전"},
  {id:5,ohaeng:"木",ohaeng_color:"#7CB87B",emoji:"🎨",name:"화원형",item:"도화지의 꿈",
   badge:"木 · 창작의 기운",hashtag:"#조선판 천재 아티스트",
   good_match:"무녀형",rival:"선비형",
   identity:"왕의 어진을 그리던 도화서 최고의 화원. 붓 한 번 휘두르면 세상이 멈추는 천재 아티스트. 보이지 않는 것까지 담아내던 감성 충만 창작자.",
   trace:"그래서 지금도 색깔 감각이 남다르고, 뭔가를 만들 때 완전히 몰입함. 미적 감각이 유달리 발달한 게 전생 화원의 흔적.",
   message:"전생의 그림은 왕 한 명을 위한 거였지만, 이번 생은 세상 모두를 위해 그리세요.",
   talent:["탁월한 미적 감각","창작 몰입력","독창적 시각"],
   goods_tag:"예술"},
  // 火 (불) - 열정/카리스마/리더십
  {id:6,ohaeng:"火",ohaeng_color:"#E8532A",emoji:"⚔️",name:"무사형",item:"용기의 검",
   badge:"火 · 열정의 기운",hashtag:"#불도저 낭만 검객",
   good_match:"농부형",rival:"선비형",
   identity:"앞만 보고 달리다 벽을 만나도 돌아가지 않고 박살내는 낭만 검객. 생각보다 몸이 먼저 움직이고, 나중에 왜 그랬나 생각하는 열정 과잉형.",
   trace:"그래서 지금도 결정이 빠르고, 뒤돌아보지 않는 추진력이 있음. 대신 가끔 돌다리를 두드리는 대신 그냥 건너뜀.",
   message:"칼은 충분히 예리해요. 이제 언제 쓸지 타이밍을 배우세요.",
   talent:["폭발적인 추진력","빠른 결단력","열정적 에너지"],
   goods_tag:"도전"},
  {id:7,ohaeng:"火",ohaeng_color:"#E8532A",emoji:"🪖",name:"장군형",item:"철갑 팔찌",
   badge:"火 · 리더십의 기운",hashtag:"#조선판 캡틴 아메리카",
   good_match:"무사형",rival:"왕족형",
   identity:"팀원 멱살 잡고 캐리하는 조선판 캡틴. 내가 힘들어도 부하들 먼저 챙기고, 지면 내 탓 이기면 팀 공이라는 리더 중의 리더.",
   trace:"그래서 지금도 그룹 안에서 자연스럽게 리더 역할을 맡게 되고, 남이 힘들면 내 일처럼 나섬.",
   message:"전생에 병사들 챙기느라 정작 장군 본인은 제일 나중에 밥 먹었잖아요. 이번 생은 나도 좀 챙기세요.",
   talent:["타고난 리더십","강한 책임감","팀을 이끄는 카리스마"],
   goods_tag:"리더십"},
  {id:8,ohaeng:"火",ohaeng_color:"#E8532A",emoji:"👑",name:"야망캐형",item:"숨겨진 옥새",
   badge:"火 · 야망의 기운",hashtag:"#수양대군 재질",
   good_match:"장군형",rival:"혁명가형",
   identity:"권력을 향해 직진하던 조선판 야망가. 목표를 위해서라면 10년도 기다리는 인내심과, 기회가 오면 단번에 잡는 결단력을 동시에 가진 무서운 타입.",
   trace:"그래서 지금도 목표 의식이 남다르고, 한번 마음먹으면 무서울 정도로 몰입함. 승부욕이 유달리 강한 게 전생 야망의 흔적.",
   message:"야망은 좋은데 방향이 중요해요. 권력보다 영향력, 지배보다 리드하는 방향으로 가면 더 멀리 가요.",
   talent:["강렬한 목표 의식","치밀한 전략적 사고","끝까지 해내는 집념"],
   goods_tag:"성공"},
  {id:9,ohaeng:"火",ohaeng_color:"#E8532A",emoji:"🕵️",name:"암행어사형",item:"숨겨진 마패",
   badge:"火 · 정의의 기운",hashtag:"#조선판 다크히어로",
   good_match:"선비형",rival:"왕족형",
   identity:"신분 숨기고 팩트로 세상 바꾸던 조선판 다크히어로. 암행하면서 탐관오리 혼내주고 민초 편들던, 시스템 안에서 싸우는 현실주의 정의파.",
   trace:"그래서 지금도 불의를 못 보고 지나치며, 팩트로 상황을 정리하는 능력이 있음. 눈치가 빠른 것도 암행 때 생긴 본능.",
   message:"전생에 혼자 다 해결하려다 지쳤을 거예요. 이번 생엔 동료를 만들어 함께 싸우세요.",
   talent:["뛰어난 관찰력","팩트 기반 판단력","불의를 못 참는 정의감"],
   goods_tag:"정의"},
  {id:10,ohaeng:"火",ohaeng_color:"#E8532A",emoji:"🐯",name:"포수형",item:"호랑이 가죽",
   badge:"火 · 담대함의 기운",hashtag:"#조선판 헌터",
   good_match:"무사형",rival:"도인형",
   identity:"호랑이도 잡는 담대함으로 조선 팔도를 누비던 포수. 겁 없이 최강의 상대에 달려드는 무모함이 아니라, 충분히 준비하고 단번에 제압하는 노련한 사냥꾼.",
   trace:"그래서 지금도 남들이 겁내는 도전에 오히려 흥미를 느끼고, 위기 상황에서 오히려 평정심이 생김.",
   message:"호랑이 잡는 건 충분히 했어요. 이번 생엔 더 큰 사냥감, 내 꿈을 잡으세요.",
   talent:["담대한 배짱","위기 속 냉정함","도전을 즐기는 본능"],
   goods_tag:"도전"},
  // 土 (흙) - 안정/포용/신뢰
  {id:11,ohaeng:"土",ohaeng_color:"#C4922A",emoji:"🏰",name:"왕족형",item:"골드 크라운",
   badge:"土 · 품격의 기운",hashtag:"#조선 제일 셀럽",
   good_match:"상궁형",rival:"혁명가형",
   identity:"태어날 때부터 VIP였던 조선판 셀럽. 걷는 것도 앉는 것도 다 폼이 나고, 타고난 품격으로 자연스럽게 주변을 장악하는 존재감 끝판왕.",
   trace:"그래서 지금도 어딜 가나 자연스럽게 주목받고, 싸구려를 못 참으며, 뭐든 최고를 원함.",
   message:"전생엔 태어난 것만으로 특별했지만, 이번 생엔 내가 만든 것으로 특별해지세요.",
   talent:["타고난 존재감","심미안과 품격","자연스러운 카리스마"],
   goods_tag:"럭셔리"},
  {id:12,ohaeng:"土",ohaeng_color:"#C4922A",emoji:"🍶",name:"객주형",item:"주막 VIP 패스",
   badge:"土 · 연결의 기운",hashtag:"#조선의 살아있는 위키",
   good_match:"농부형",rival:"암행어사형",
   identity:"어딜 가나 인싸 허브였던 조선의 정보 브로커. 상인도 양반도 기생도 다 알고, 누가 뭘 필요한지 척 보면 아는 조선판 살아있는 네트워크.",
   trace:"그래서 지금도 사람 사귀는 게 자연스럽고, 어딜 가나 아는 사람이 생기며, 정보력이 남다름.",
   message:"전생에 모든 사람을 연결해줬는데 정작 본인은 고독했을 거예요. 이번 생엔 진짜 내 편을 만드세요.",
   talent:["탁월한 사교 능력","정보 수집력","사람을 연결하는 능력"],
   goods_tag:"소통"},
  {id:13,ohaeng:"土",ohaeng_color:"#C4922A",emoji:"🎋",name:"한량형",item:"비단 주머니",
   badge:"土 · 여유의 기운",hashtag:"#조선 최고 폼생폼사",
   good_match:"객주형",rival:"농부형",
   identity:"풍류를 즐기며 조선 최고의 품격을 자랑하던 한량. 일하기 싫어서 노는 게 아니라, 인생의 진짜 즐거움을 아는 여유만만형 철학자.",
   trace:"그래서 지금도 바쁘게 사는 것보다 여유 있게 사는 걸 추구하고, 억지로 하는 건 못 버팀.",
   message:"전생에 풍류 즐기다 세월 보냈는데, 이번 생엔 즐기면서도 뭔가 남기세요.",
   talent:["삶을 즐기는 지혜","미적 감수성","여유로운 마음"],
   goods_tag:"힐링"},
  {id:14,ohaeng:"土",ohaeng_color:"#C4922A",emoji:"🏯",name:"상궁형",item:"궁궐 열쇠",
   badge:"土 · 실세의 기운",hashtag:"#비선 실세 사교계 여왕",
   good_match:"왕족형",rival:"암행어사형",
   identity:"겉으로는 조용히 내조하는 척하면서 뒤에서 판을 다 짜던 궁궐의 진짜 실세. 왕도 모르는 걸 상궁은 다 알고, 인사권도 사실상 상궁 손에서 나왔던.",
   trace:"그래서 지금도 직접 나서진 않지만 뒤에서 판을 조종하는 능력이 탁월함. 눈치가 빠르고, 분위기 읽는 능력이 천재적.",
   message:"이제 뒤에서 조종하는 거 그만하고 앞에 서도 돼요. 실력은 이미 충분히 검증됐어요.",
   talent:["탁월한 눈치와 센스","전략적 사고","뒤에서 판 짜는 능력"],
   goods_tag:"소통"},
  {id:15,ohaeng:"土",ohaeng_color:"#C4922A",emoji:"🍜",name:"주모형",item:"따뜻한 국밥",
   badge:"土 · 포용의 기운",hashtag:"#조선판 국민 힐러",
   good_match:"객주형",rival:"무사형",
   identity:"주막에서 밥 한 그릇으로 지친 나그네 다 살려내던 조선판 국민 힐러. 따뜻한 국물처럼 모든 사람을 품어주던 어머니의 마음을 가진 포용의 화신.",
   trace:"그래서 지금도 힘든 사람 보면 그냥 못 지나치고, 주변 사람들한테 의지가 많이 됨. 공감 능력이 남다름.",
   message:"남 다 챙기다 정작 본인은 지쳤을 거예요. 이번 생엔 나도 한 그릇 챙겨먹으세요.",
   talent:["깊은 공감 능력","포용력","사람을 치유하는 따뜻함"],
   goods_tag:"힐링"},
  // 金 (금) - 의리/결단/전문성
  {id:16,ohaeng:"金",ohaeng_color:"#888",emoji:"💰",name:"상인형",item:"황금 동전",
   badge:"金 · 재물의 기운",hashtag:"#네고왕 거상",
   good_match:"상궁형",rival:"농부형",
   identity:"말빨 하나로 조선 상권을 씹어먹던 거상. 뭐든 사고팔 줄 알고, 물건 값이 얼마가 됐든 무조건 이득 보고 나오는 협상의 달인.",
   trace:"그래서 지금도 경제 감각이 남다르고, 어떤 상황에서도 이득을 찾아내는 본능이 있음.",
   message:"이번 생엔 돈만 버는 거 넘어서서 그 돈으로 의미 있는 걸 만드세요. 진짜 거상은 시대를 바꾸는 사람이에요.",
   talent:["남다른 경제 감각","협상 능력","기회를 찾는 눈"],
   goods_tag:"재물"},
  {id:17,ohaeng:"金",ohaeng_color:"#888",emoji:"🗡️",name:"호위무사형",item:"흑룡 검",
   badge:"金 · 의리의 기운",hashtag:"#묵직한 인간 쉴드",
   good_match:"장군형",rival:"상인형",
   identity:"한번 주군으로 모시면 죽어도 지키는 조선판 충성도 9999 호위무사. 말수는 적지만 행동으로 모든 걸 보여주는 묵직한 인간 방패.",
   trace:"그래서 지금도 한번 믿으면 끝까지 믿고, 배신이라는 단어가 사전에 없음.",
   message:"지키는 것도 중요하지만, 이번 생엔 내 자신도 지킬 줄 아는 무사가 되세요.",
   talent:["변치 않는 의리","강한 보호 본능","신뢰를 주는 묵직함"],
   goods_tag:"의리"},
  {id:18,ohaeng:"金",ohaeng_color:"#888",emoji:"🔨",name:"장인형",item:"황동 부적 펜던트",
   badge:"金 · 완벽의 기운",hashtag:"#조선의 디테일 변태",
   good_match:"선비형",rival:"한량형",
   identity:"1mm 오차도 못 참는 완벽주의 장인. 도자기 한 점을 만들어도 100번 넘게 다시 하고, 칼 한 자루를 만들어도 3년을 갈고 닦던 완성도 집착형.",
   trace:"그래서 지금도 대충이라는 단어를 못 쓰고, 하면 제대로 하는 성격이 탑재됨.",
   message:"완벽한 작품 만드는 건 전생에 다 했으니, 이번 생엔 완성하는 속도도 늘려보세요. 80%도 충분히 훌륭해요.",
   talent:["극강의 완벽주의","세밀한 집중력","퀄리티에 대한 집착"],
   goods_tag:"장인정신"},
  {id:19,ohaeng:"金",ohaeng_color:"#888",emoji:"🎓",name:"훈장형",item:"1타 강사의 붓",
   badge:"金 · 교육의 기운",hashtag:"#조선판 1타 강사",
   good_match:"선비형",rival:"예인형",
   identity:"설명할 때 도파민 터지는 조선판 1타 강사. 어려운 걸 쉽게 설명하는 능력이 천재적이고, 제자들이 이해했을 때 오는 희열이 최고의 보상.",
   trace:"그래서 지금도 가르치는 게 자연스럽고, 남이 모르면 설명해주고 싶어짐.",
   message:"이번 생엔 더 많은 사람에게, 더 다양한 방식으로 가르치세요. 오프라인 너머 세상이 기다리고 있어요.",
   talent:["탁월한 설명 능력","지식 나눔의 기쁨","가르치는 데서 오는 에너지"],
   goods_tag:"지식"},
  {id:20,ohaeng:"金",ohaeng_color:"#888",emoji:"⚖️",name:"사헌부형",item:"냉철한 마패",
   badge:"金 · 원칙의 기운",hashtag:"#조선판 감사원장",
   good_match:"암행어사형",rival:"한량형",
   identity:"부정부패 절대 못 참는 원칙주의자. 윗사람 눈치 봐도 잘못된 건 잘못됐다 팩폭하는 냉철한 규칙 수호자.",
   trace:"그래서 지금도 룰 깨는 거 못 보고, 원칙 없는 사람과 일하면 스트레스받음.",
   message:"원칙도 중요하지만 가끔은 유연성도 필요해요. 흑백 너머 회색지대에서도 기회가 있어요.",
   talent:["확고한 원칙 의식","냉철한 판단력","공정함에 대한 집착"],
   goods_tag:"정의"},
  // 水 (물) - 지혜/직관/신비
  {id:21,ohaeng:"水",ohaeng_color:"#4A90D9",emoji:"🪷",name:"승려형",item:"연꽃 인센스",
   badge:"水 · 깨달음의 기운",hashtag:"#번뇌왕 명상러",
   good_match:"도인형",rival:"상인형",
   identity:"속세 끊으려다 밥이 맛있어서 실패한 조선 최고의 번뇌왕. 깨달음을 추구하면서도 세속의 즐거움을 완전히 버리지 못하는 인간적인 수행자.",
   trace:"그래서 지금도 철학적 사고를 즐기고, 혼자만의 시간이 필수이며, 의미 없는 일엔 에너지를 못 씀.",
   message:"깨달음은 이미 충분해요. 이번 생엔 그 깨달음을 세상과 나누며 함께 성장하세요.",
   talent:["깊은 철학적 사고","내면의 풍요로움","본질을 꿰뚫는 통찰력"],
   goods_tag:"명상"},
  {id:22,ohaeng:"水",ohaeng_color:"#4A90D9",emoji:"🌙",name:"무녀형",item:"문스톤 목걸이",
   badge:"水 · 직관의 기운",hashtag:"#원조 타로마스터",
   good_match:"상인형",rival:"왕족형",
   identity:"조선 제일의 촉. 남들 고민은 기가 막히게 꿰뚫어 보면서 정작 내 앞가림은 못해서 맨날 밤비 맞으며 울던 원조 타로마스터.",
   trace:"그래서 지금도 근거 없는 쎄한 직감이 무조건 맞고, 친구들이 너한테만 오면 속마음 줄줄 부는 거임.",
   message:"남 걱정은 그만! 내 인생 떡상시키는 데 촉을 쓰세요.",
   talent:["타고난 직관력","사람 마음 읽는 능력","신비로운 감지 능력"],
   goods_tag:"직관"},
  {id:23,ohaeng:"水",ohaeng_color:"#4A90D9",emoji:"🔮",name:"도인형",item:"수정 명상 볼",
   badge:"水 · 천재의 기운",hashtag:"#조선판 일론 머스크",
   good_match:"선비형",rival:"포수형",
   identity:"시대를 500년 앞서간 천재 은둔자. 홀로 산속에서 우주의 원리를 깨우치고, 세상이 이해 못 하는 것들을 이미 알고 있던 고독한 선구자.",
   trace:"그래서 지금도 남들이 이해 못 하는 생각을 하고, 트렌드보다 10년은 앞서가는 아이디어가 있음.",
   message:"세상이 아직 당신 수준을 못 따라가는 거예요. 세상이 이해할 수 있는 언어로 번역해서 말해주세요.",
   talent:["시대를 앞서가는 통찰","깊은 사색 능력","독창적 세계관"],
   goods_tag:"명상"},
  {id:24,ohaeng:"水",ohaeng_color:"#4A90D9",emoji:"⭐",name:"신관형",item:"칠성 수정 팔찌",
   badge:"水 · 신비의 기운",hashtag:"#조선판 메가 인플루언서",
   good_match:"무녀형",rival:"상궁형",
   identity:"묘한 카리스마로 사람을 끌어당기던 조선의 신관. 말 한마디에 수백 명이 모이고, 나타나는 것만으로도 분위기를 장악하던 타고난 신비 카리스마.",
   trace:"그래서 지금도 별로 한 게 없는데 사람들이 따르고, 자연스럽게 팔로워가 생기는 게 전생 신관의 기운.",
   message:"카리스마는 타고났으니, 이번 생엔 그 영향력을 선한 곳에 쓰세요.",
   talent:["신비로운 카리스마","사람을 끌어당기는 자력","타고난 영향력"],
   goods_tag:"신비"},
  {id:25,ohaeng:"水",ohaeng_color:"#4A90D9",emoji:"✨",name:"역술가형",item:"천기의 붓",
   badge:"水 · 운명의 기운",hashtag:"#조선판 천기인",
   good_match:"도인형",rival:"상인형",
   identity:"별과 사주로 운명을 읽던 조선의 역술가. 왕도 찾아와 물어보는 신비로운 운명 해독자. 과거와 미래를 동시에 보는 통찰의 소유자.",
   trace:"그래서 지금도 처음 만난 사람의 본질을 빨리 파악함. 운명이나 인연에 대한 감각이 특별히 발달한 게 전생 역술가의 흔적.",
   message:"전생에 남의 운명은 다 봐줬으니, 이번 생엔 당신 자신의 운명을 가장 먼저 펼쳐보세요.",
   talent:["운명을 읽는 직관","시간을 초월한 통찰","신비로운 감지 능력"],
   goods_tag:"신비"},
];

// 데모: 을(乙)일간 → 木 → 이름 3음절 % 5 = 2번 → index 2 → 농부형
var DEMO_TYPE = PAST_LIFE_TYPES[2];
var DEMO_ILGAN = "乙";

var QUESTIONS = [
  {title:"전생에서 가장 궁금한 건?", icon:"⏳", multi:true, skippable:false,
   opts:["👑 신분·직업","🌍 나라·시대","❤️ 현생 인연과의 관계","🔮 현생 운명에 미치는 영향","💪 전생에서 가져온 재능","💰 재물·업보","🌟 전체 다 궁금해요!"]},
  {title:"요즘 이상하게 끌리는 게 있나요?", icon:"🤔", multi:false, skippable:true,
   opts:["🏯 특정 시대나 나라","🌿 자연·동물·식물","🎨 예술 분야","🗡️ 역사·전쟁","⛩️ 종교·철학","🌊 물·바다","🎵 음악·소리","🔮 딱히 없어요"]},
];

var CROSS = [
  {emoji:"☯️",title:"사주 풀이",desc:"전생 기운이 사주에 어떻게 반영됐는지",price:"980원"},
  {emoji:"🌟",title:"기질도",desc:"전생 기질이 현생에 이어지는 방식",price:"무료"},
  {emoji:"👁️",title:"관상 보기",desc:"얼굴에 새겨진 전생의 흔적",price:"380원"},
  {emoji:"🛍️",title:"굿즈샵",desc:"전생의 소울 아이템 실제로 갖기",price:"→"},
];

var LOADING_MSGS = [
  "전생 기록 탐색 중... ⏳","사주에서 전생 흔적 찾는 중... 🔮",
  "업보와 인연 계산 중... ☯️","전생 신분 특정 중... 👑",
  "500년 전 기억 복원 중... 🌟","팩폭 준비 중... 😈"
];

function GBtn({children,onClick,dim}){
  return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>
    {children}
  </button>;
}

export default function PastLifePage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var ivRef=useRef(null);
  var pl=DEMO_TYPE;

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*3+1.5);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},500);}
    },180);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||"";

  // ─── 설명팝업 ───
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>⏳ 전생 운세</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>난 왕이었을까 노비였을까? 리얼 전생</p></div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(255,80,80,0.18)",color:"#FF7675",border:"1px solid #FF767544",fontWeight:700}}>팩폭</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>⏳ 오행으로 결정되는 25종 전생 유형</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
            {[["🌿","木","5종"],["🔴","火","5종"],["🟡","土","5종"],["⚪","金","5종"],["🌊","水","5종"]].map(function(x){return(
              <div key={x[1]} style={{textAlign:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 4px"}}>
                <p style={{fontSize:16,margin:"0 0 4px"}}>{x[0]}</p>
                <p style={{fontSize:13,color:G,fontWeight:700,margin:"0 0 2px"}}>{x[1]}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>{x[2]}</p>
              </div>
            );})}
          </div>
          <div style={{background:"rgba(255,80,80,0.08)",border:"1px solid rgba(255,80,80,0.2)",borderRadius:10,padding:"10px 14px"}}>
            <p style={{fontSize:11,color:"#FF7675",fontWeight:700,margin:"0 0 3px"}}>😈 팩폭 주의</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>사주 일간 오행으로 25종 중 1종을 결정해요. 천기는 사탕발림 없이 전생을 그대로 알려드려요.</p>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 전생 운세에서 알 수 있는 것</p>
          {[["⏳","25종 중 내 전생 정체","사주 일간 오행으로 결정되는 전생 직업·신분"],["🎨","전생 전용 일러스트","내 전생 모습을 담은 조선시대 일러스트"],["💪","전생에서 가져온 재능 3가지","지금 내가 잘하는 것의 전생 기원"],["❤️","전생 찰떡 동료 & 라이벌","전생에서 함께한 인연과 맞선 상대"],["🔮","3단계 서사","전생 정체성 → 현생 흔적 → 전생의 메시지"],["🛍️","소울 아이템","전생부터 이어진 나만의 행운 아이템"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>25종 전생 + 일러스트 + 소울아이템 + 찰떡·라이벌</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>내 전생 확인하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ─── 인물선택 ───
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>⏳ 누구의 전생을 볼까요?</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>생년월일 일간으로 오행을 분석해 전생 유형을 결정해요</p>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여 · 일간 乙(을목)</p>
          </div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ─── 사전질문 ───
  if(step==="questions"){
    var curQ=QUESTIONS[qStep]; var totalQ=QUESTIONS.length; var progress=(qStep/totalQ)*100;
    function selectOpt(opt){if(curQ.multi){setMultiSel(function(prev){return prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt);});}else{var na=answers.slice();na[qStep]=opt;setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("payment");},300);}}}
    function goNext(){var na=answers.slice();if(curQ.multi&&multiSel.length>0){na[qStep]=multiSel.join(", ");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("payment");}}
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 전생 분석 정확도를 높이기 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 궁금한 것 여러 개 선택 가능해요</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 확인 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ─── 결제 ───
  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>
          {answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.7)",margin:"0 0 4px"}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}
        </div>}
        <div style={{background:"rgba(255,80,80,0.08)",border:"1px solid rgba(255,80,80,0.25)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:12,color:"#FF7675",fontWeight:700,margin:"0 0 4px"}}>😈 팩폭 주의</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>전생이 생각보다 평범하거나 충격적일 수 있어요. 각오하고 결제하세요.</p>
        </div>
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>상품 가격</span><span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>980원</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>980원</span></div>
        </div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>내 전생 확인하기 (980원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ─── 로딩 ───
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>⏳</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 전생 기록 탐색 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{LOADING_MSGS[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  // ─── 결과 ───
  return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>

      {/* 영매 인트로 — 다크그린 배경 */}
      <div style={{background:DG,padding:"24px 18px 18px",textAlign:"center"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>✦ 천기(天機) 전생운세</p>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.85)",lineHeight:1.85,margin:"0 0 8px",fontStyle:"italic",wordBreak:"keep-all"}}>
          "{DEMO_NAME}님의 사주에 흐르는 이 기운을 보니...<br/>
          500년 전 당신은 <strong style={{color:G}}>{pl.name.replace("형","")}이었군요.</strong>"
        </p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0}}>일간 {DEMO_ILGAN} → {pl.ohaeng} 오행 → {pl.name} (25종 중 #{pl.id})</p>
      </div>

      {/* 오행 배지 */}
      <div style={{textAlign:"center",padding:"16px 0 4px"}}>
        <span style={{display:"inline-block",background:"rgba(232,200,122,0.12)",border:"1px solid rgba(232,200,122,0.4)",color:G,padding:"8px 22px",borderRadius:50,fontSize:15,fontWeight:700,letterSpacing:1}}>
          {pl.ohaeng==="木"?"🌿":pl.ohaeng==="火"?"🔴":pl.ohaeng==="土"?"🟡":pl.ohaeng==="金"?"⚪":"🌊"} {pl.badge}
        </span>
      </div>

      <div style={{padding:"12px 14px 0"}}>

        {/* ━ 결과 카드 (한지 느낌) ━ */}
        <div style={{background:"#FDFCF8",borderRadius:24,padding:"26px 20px",marginBottom:14,boxShadow:"0 12px 40px rgba(0,0,0,0.45)",border:"2px solid rgba(201,167,78,0.35)"}}>

          {/* 전생 정체 헤더 */}
          <div style={{textAlign:"center",marginBottom:20}}>
            <p style={{fontSize:44,margin:"0 0 6px"}}>{pl.emoji}</p>
            <p style={{fontSize:21,fontWeight:900,color:"#1A1A1A",margin:"0 0 4px"}}>{pl.name} · {pl.item}</p>
            <p style={{fontSize:13,color:"#C4922A",fontWeight:700}}>{pl.hashtag}</p>
          </div>

          {/* 일러스트 영역 */}
          <div style={{width:"100%",aspectRatio:"1/1",background:"linear-gradient(135deg,#F0EBE0,#E5DDD0)",borderRadius:18,marginBottom:22,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1px solid rgba(0,0,0,0.07)",position:"relative",overflow:"hidden"}}>
            <p style={{fontSize:88,margin:"0 0 10px",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.1))"}}>{pl.emoji}</p>
            <p style={{fontSize:12,color:"rgba(0,0,0,0.4)",margin:0,fontWeight:600}}>일러스트 준비 중 🎨</p>
            <p style={{fontSize:10,color:"rgba(0,0,0,0.28)",margin:"4px 0 0"}}>곧 {pl.name} 전용 일러스트가 추가돼요</p>
            <div style={{position:"absolute",top:12,right:12,background:"rgba(201,167,78,0.15)",border:"1px solid rgba(201,167,78,0.4)",borderRadius:8,padding:"4px 8px"}}>
              <p style={{fontSize:9,color:"#C4922A",fontWeight:700,margin:0}}>#{pl.id} / 25종</p>
            </div>
          </div>

          {/* 3단계 서사 */}
          <div style={{borderBottom:"1px dashed rgba(0,0,0,0.12)",paddingBottom:18,marginBottom:18}}>
            <p style={{fontSize:11,color:"#C4922A",fontWeight:700,letterSpacing:1,margin:"0 0 8px"}}>[1] 전생의 정체성</p>
            <p style={{fontSize:14,color:"#333",lineHeight:1.9,margin:0,wordBreak:"keep-all"}}>{pl.identity}</p>
          </div>
          <div style={{borderBottom:"1px dashed rgba(0,0,0,0.12)",paddingBottom:18,marginBottom:18}}>
            <p style={{fontSize:11,color:"#C4922A",fontWeight:700,letterSpacing:1,margin:"0 0 8px"}}>[2] 내 몸에 남은 전생의 흔적</p>
            <p style={{fontSize:14,color:"#333",lineHeight:1.9,margin:"0 0 12px",wordBreak:"keep-all"}}>{pl.trace}</p>
            <div style={{background:"rgba(201,167,78,0.08)",borderRadius:10,padding:"10px 12px"}}>
              <p style={{fontSize:10,color:"#C4922A",fontWeight:700,margin:"0 0 6px"}}>✦ 전생에서 가져온 재능 3가지</p>
              {pl.talent.map(function(t,i){return <p key={i} style={{fontSize:12,color:"#555",margin:"0 0 4px",paddingLeft:10,borderLeft:"2px solid rgba(201,167,78,0.5)"}}>{t}</p>;})}
            </div>
          </div>
          <div>
            <p style={{fontSize:11,color:"#C4922A",fontWeight:700,letterSpacing:1,margin:"0 0 8px"}}>[3] 전생이 보내는 현생의 메시지</p>
            <p style={{fontSize:14,color:"#333",lineHeight:1.9,margin:0,wordBreak:"keep-all"}}>{pl.message}</p>
          </div>
        </div>

        {/* 전생 찰떡 · 라이벌 */}
        {(function(){
          var goodT=PAST_LIFE_TYPES.find(function(t){return t.name===pl.good_match;});
          var rivalT=PAST_LIFE_TYPES.find(function(t){return t.name===pl.rival;});
          return(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:16,padding:"16px",textAlign:"center"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:"0 0 8px",letterSpacing:1}}>💖 전생 찰떡 동료</p>
                <p style={{fontSize:28,margin:"0 0 4px"}}>{goodT?goodT.emoji:"🔮"}</p>
                <p style={{fontSize:14,fontWeight:700,color:G,margin:0}}>{pl.good_match}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"4px 0 0"}}>전생에 당신을 도운 동료</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,118,117,0.25)",borderRadius:16,padding:"16px",textAlign:"center"}}>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:"0 0 8px",letterSpacing:1}}>⚡ 전생 라이벌</p>
                <p style={{fontSize:28,margin:"0 0 4px"}}>{rivalT?rivalT.emoji:"⚔️"}</p>
                <p style={{fontSize:14,fontWeight:700,color:"#FF7675",margin:0}}>{pl.rival}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"4px 0 0"}}>전생에 맞섰던 라이벌</p>
              </div>
            </div>
          );
        })()}

        {/* 소울 아이템 CTA */}
        <div style={{background:"linear-gradient(135deg,#C9A74E,#AA7B30)",borderRadius:16,padding:"18px 20px",marginBottom:14,cursor:"pointer",textAlign:"center"}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",margin:"0 0 4px"}}>✦ 전생부터 당신의 영혼과 함께한 소울 아이템</p>
          <p style={{fontSize:18,fontWeight:900,color:"#fff",margin:"0 0 8px"}}>{pl.item}</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.75)",margin:0}}>굿즈샵에서 실제로 만나기 →</p>
        </div>

        {/* 현생 업보 연결 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>🔮 전생이 현생에 연결된 것들</p>
          {[{title:"💰 재물 업보",text:"전생에 가진 것에 집착하는 패턴이 이번 생 재물 흐름에 영향을 줘요. "+pl.name+"은 재물을 어떻게 다루느냐에 따라 이번 생 재물운이 크게 달라져요."},
            {title:"❤️ 인연 업보",text:"전생에서 깊은 인연을 맺었던 사람들이 이번 생에 다시 나타나요. 처음 만났는데 오래 알던 것 같은 사람이 있다면, 그 인연을 주목하세요."},
            {title:"🌿 건강 체질",text:"전생에서 "+pl.name.replace("형","")+"로 살면서 생긴 신체 패턴이 이번 생에도 이어지고 있어요. 전생의 생활 방식에서 온 취약한 부위가 있어요."},
          ].map(function(r,i){return(
            <div key={i} style={{marginBottom:i<2?14:0}}>
              <p style={{fontSize:12,fontWeight:700,color:"#111",margin:"0 0 6px"}}>{r.title}</p>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0,paddingLeft:12,borderLeft:"3px solid rgba(232,200,122,0.35)"}}>{r.text}</p>
            </div>
          );})}
        </div>

        {/* 이번 생의 숙제 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>📋 이번 생의 숙제 — 왜 이 세상에 왔는가</p>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:"0 0 12px",wordBreak:"keep-all"}}>
            {DEMO_NAME}님이 이번 생에 태어난 이유가 있어요. 전생에서 완성하지 못한 것들을 이번 생에 마무리하러 온 거예요. 전생의 재능인 <strong>{pl.talent[0]}</strong>을 이번에는 더 많은 사람에게 닿게 하는 것이 이번 생의 숙제예요.
          </p>
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 8px"}}>🌟 이번 생을 잘 살기 위한 3가지</p>
            {["전생에서 가져온 재능을 혼자 쌓지 않고 나누기","업보를 풀기 위해 나보다 약한 사람 한 명 도와주기","전생에서 못 이룬 꿈 하나 이번 생에서 완성하기"].map(function(t,i){return(
              <p key={i} style={{fontSize:12,color:"#333",lineHeight:1.75,margin:"0 0 6px",paddingLeft:10,borderLeft:"2px solid rgba(232,200,122,0.5)"}}>{t}</p>
            );})}
          </div>
        </div>

        {/* 25종 전생 유형 맵 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>✦ 25종 전생 유형 — 내 전생은?</p>
          {[{o:"木",color:"#7CB87B",types:["선비형","예인형","농부형","혁명가형","화원형"]},
            {o:"火",color:"#E8532A",types:["무사형","장군형","야망캐형","암행어사형","포수형"]},
            {o:"土",color:"#C4922A",types:["왕족형","객주형","한량형","상궁형","주모형"]},
            {o:"金",color:"#888",types:["상인형","호위무사형","장인형","훈장형","사헌부형"]},
            {o:"水",color:"#4A90D9",types:["승려형","무녀형","도인형","신관형","역술가형"]},
          ].map(function(row){
            var isMyOhaeng=row.o===pl.ohaeng;
            return(
              <div key={row.o} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 10px",background:isMyOhaeng?"rgba(232,200,122,0.07)":"rgba(0,0,0,0.02)",borderRadius:10,border:isMyOhaeng?"1px solid rgba(232,200,122,0.3)":"1px solid transparent"}}>
                <div style={{width:26,height:26,borderRadius:8,background:row.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <p style={{fontSize:11,color:"#fff",fontWeight:700,margin:0}}>{row.o}</p>
                </div>
                <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:4}}>
                  {row.types.map(function(t){
                    var isMe=t===pl.name;
                    return <span key={t} style={{fontSize:9,padding:"2px 6px",borderRadius:6,background:isMe?"#E8C87A":"rgba(0,0,0,0.05)",color:isMe?"#0D0D14":"rgba(0,0,0,0.5)",fontWeight:isMe?700:400}}>{t}{isMe?" ←":""}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:14,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님은 우연히 이 세상에 온 게 아니에요.<br/>
            전생의 {pl.talent[0]}을 이 세상에 꽃피우러 온 사람이에요.
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 전생 운세의 메시지</p>
        </div>

        {/* 공유용 해시태그 */}
        <div style={{textAlign:"center",marginBottom:14,padding:"10px",background:"rgba(255,255,255,0.03)",borderRadius:12}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 6px"}}>공유하기 #천기전생 #{pl.name} #{pl.badge}</p>
          <p style={{fontSize:10,color:G,fontWeight:600,margin:0}}>🌐 천기.kr</p>
        </div>

        {/* 크로스셀링 */}
        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {CROSS.map(function(cs){return(
              <div key={cs.title} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 10px",cursor:"pointer"}}>
                <p style={{fontSize:18,margin:"0 0 5px"}}>{cs.emoji}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{cs.title}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 6px",lineHeight:1.4}}>{cs.desc}</p>
                <span style={{fontSize:10,color:G,fontWeight:700}}>{cs.price} →</span>
              </div>
            );})}
          </div>
        </div>

        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
}
