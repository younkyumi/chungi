"use client";
import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 40개 특성 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TRAITS = {
  ADD:{ name:"과주의산만형", sub:"ADHD (Attention Deficit Hyperactivity Disorder)", emoji:"⚡", color:"#FFD93D", cat:"신경다양성",
    desc:"과집중 모드가 발동하면 누구도 못 막아요.",
    cheat:"무한 창의력 + 과집중 슈퍼파워", when:"좋아하는 일 앞에서 시간을 잊을 때", famous:"에디슨, 일론 머스크, BTS RM",
    fullDesc:"ADHD 성향은 단순한 집중력 결핍이 아니에요. 뇌의 도파민 회로가 일반인과 다르게 작동해서 흥미로운 자극에는 초집중(Hyperfocus)이 발동하고, 그 순간엔 세상 누구도 따라올 수 없는 몰입 상태가 됩니다. 에디슨은 학교에서 '바보'라는 말을 들었지만 전구를 발명했고, 리처드 브랜슨은 버진그룹을 만들었어요. 당신의 뇌가 '심심함을 못 견디는 것'은 새로운 자극을 끊임없이 찾는 탐험가의 본능입니다.",
    good:["DIV","HYP","ART"], bad:["PFT","HYO","DEP"],
    goods:"⚡ 집중력 팔찌 · 타이머 큐브 · 다이어리 세트" },
  HSP:{ name:"초감각예민형", sub:"HSP (Highly Sensitive Person)", emoji:"🌊", color:"#74B9FF", cat:"신경다양성",
    desc:"세상을 가장 깊이 느끼는 안테나를 가졌어요.",
    cheat:"공감 레이더 + 예술적 직관", when:"말 안 해도 상대 감정이 느껴질 때", famous:"고흐, 헤르만 헤세, 아이유",
    fullDesc:"HSP(Highly Sensitive Person)는 전체 인구의 약 15~20%가 가진 신경학적 특성이에요. 뇌의 감각 처리 시스템이 더 깊고 세밀하게 정보를 처리합니다. 다른 사람이 느끼지 못하는 미세한 감정 변화, 공간의 분위기, 예술 작품의 디테일까지 감지해요. 당신이 유독 영화나 음악에서 깊이 감동받는 이유가 바로 이 특성 때문이에요.",
    good:["EMP","OVE","ENV"], bad:["ENB","HYA","IMP"],
    goods:"🌊 노이즈캔슬링 이어폰 · 아로마 디퓨저 · 저널링 노트" },
  ASD:{ name:"자폐스펙트럼형", sub:"ASD (Autism Spectrum Disorder)", emoji:"🔮", color:"#A29BFE", cat:"신경다양성",
    desc:"패턴 인식과 전문성 집착의 천재.",
    cheat:"초전문성 + 패턴 해독 능력", when:"아무도 못 보는 규칙을 발견할 때", famous:"아인슈타인, 앨런 튜링, 빌 게이츠",
    fullDesc:"자폐 스펙트럼은 연속선상에 있는 다양한 신경 유형이에요. 스펙트럼 상의 많은 사람들은 특정 분야에서 놀라운 패턴 인식 능력과 집중력을 보여줍니다. 앨런 튜링은 에니그마 코드를 해독했고, 실리콘밸리 엔지니어의 상당수가 스펙트럼 상에 있어요.",
    good:["DEP","PTN","MTC"], bad:["EMP","ANA","ENB"],
    goods:"🔮 패턴 퍼즐 · 루틴 플래너 · 노이즈캔슬링" },
  DYS:{ name:"문자역독형", sub:"Dyslexia (난독증)", emoji:"🌀", color:"#FD79A8", cat:"신경다양성",
    desc:"3D 공간지각과 큰그림 사고의 천재.",
    cheat:"공간 인식 최강 + 창의적 문제해결", when:"남들이 못 보는 전체 그림이 보일 때", famous:"다빈치, 스티브 잡스, 키아누 리브스",
    fullDesc:"Dyslexia(난독증)를 가진 뇌는 텍스트를 순서대로 처리하는 좌뇌 경로 대신, 공간 인식과 전체 패턴을 보는 우뇌가 훨씬 발달해 있어요. 레오나르도 다빈치는 거울 글씨를 썼고, 스티브 잡스는 읽기에 어려움이 있었지만 제품 전체를 하나의 예술로 보는 눈이 있었어요. 이 특성을 가진 사람들은 복잡한 문제를 3D로 시각화하고, 남들이 보지 못하는 큰 그림을 한눈에 파악해요. 당신이 설명보다 그림이나 예시로 더 빨리 이해하는 이유가 바로 이 때문이에요.",
    good:["DIV","DRM","HIT"], bad:["DEP","MTC","PFT"],
    goods:"🌀 마인드맵 노트 · 3D 퍼즐 · 스케치북" },
  DYC:{ name:"수리역독형", sub:"Dyscalculia (난산증)", emoji:"🎨", color:"#FDCB6E", cat:"신경다양성",
    desc:"언어·감성 우뇌의 극강 발달.",
    cheat:"감성 지능 최강 + 언어적 창의력", when:"숫자보다 이야기로 세상을 이해할 때", famous:"셰익스피어, 아가사 크리스티",
    fullDesc:"Dyscalculia(난산증)는 수 처리에 어려움이 있지만 그 대신 언어와 감성 처리 능력이 폭발적으로 발달한 상태예요. 셰익스피어와 아가사 크리스티가 이 특성을 가졌다고 알려져 있어요. 숫자보다 이야기, 공식보다 감정의 흐름으로 세상을 이해하는 이 뇌는 스토리텔러와 예술가에게 최적화된 신경 구조예요. 당신이 숫자는 어렵지만 사람의 감정과 서사를 꿰뚫어 보는 능력이 탁월한 이유가 여기 있어요.",
    good:["DRM","EMP","DIV"], bad:["PTN","DEP","MTC"],
    goods:"🎨 컬러링북 · 감성 다이어리 · 손편지 세트" },
  TIC:{ name:"운동신호형", sub:"Tic Disorder / Tourette (틱장애)", emoji:"🎯", color:"#55EFC4", cat:"신경다양성",
    desc:"창의적 충동과 폭발적 집중력의 원천.",
    cheat:"에너지 방출 + 집중력 폭발", when:"몸이 먼저 반응하고 결과가 나올 때", famous:"모차르트, 빌리 아일리시",
    fullDesc:"Tic Disorder(틱장애)는 신경계의 과잉 에너지가 신체 반응으로 표출되는 특성이에요. 모차르트는 틱 증상이 있었고, 그 넘치는 에너지가 오히려 음악적 천재성의 원천이었어요. 이 에너지를 음악, 운동, 예술 같은 창의적 출구로 연결하면 엄청난 집중력과 퍼포먼스로 발현돼요. 신체와 뇌가 고도로 연결되어 있어서 몸으로 먼저 느끼고 반응하는 직관적 능력이 탁월해요.",
    good:["IMP","ENB","ART"], bad:["HYO","PFT","INT"],
    goods:"🎯 스트레스볼 · 피젯 링 · 리듬 악기" },
  SPD:{ name:"감각통합이형", sub:"Sensory Processing Disorder (감각통합이상)", emoji:"🌈", color:"#FF7675", cat:"신경다양성",
    desc:"섬세한 감각으로 세상을 고해상도로 읽어요.",
    cheat:"감각 고해상도 + 환경 적응 능력", when:"남들이 못 느끼는 미묘한 변화를 감지할 때", famous:"많은 예술가들",
    fullDesc:"Sensory Processing Disorder(감각처리장애)는 뇌가 감각 정보를 일반인보다 훨씬 세밀하게 처리하는 상태예요. 유명 셰프들이 재료의 신선도를 손끝으로 느끼고, 음악가들이 음의 미세한 차이를 포착하는 것도 이 특성 때문이에요. 이 예민함이 바로 당신을 최고의 감각 전문가로 만드는 능력이에요. 때로는 자극이 과부하가 되어 힘들 수 있지만, 이 예민함은 동시에 최고의 강점이에요.",
    good:["HSP","GST","TCT"], bad:["ENB","IMP","HYA"],
    goods:"🌈 감각 힐링 키트 · 촉감 쿠션 · 아로마 세트" },
  SYN:{ name:"공감각보유형", sub:"Synesthesia (공감각)", emoji:"🎵", color:"#6C5CE7", cat:"신경다양성",
    desc:"소리가 색으로 보이는 천재의 감각.",
    cheat:"멀티감각 연결 + 창의적 인식", when:"음악을 들을 때 색이나 형태가 느껴질 때", famous:"칸딘스키, 파렐 윌리엄스",
    fullDesc:"Synesthesia(공감각)는 하나의 감각이 다른 감각을 동시에 불러일으키는 희귀한 신경 특성이에요. 전체 인구의 단 4%만 가진 능력으로, 화가 칸딘스키는 색을 들을 수 있었고 그것이 추상화의 탄생으로 이어졌어요. 파렐 윌리엄스는 음악을 색으로 본다고 밝혔어요. 이 특성을 가진 사람들은 예술, 음악, 창의적 분야에서 남들이 접근하지 못하는 독특한 감각적 세계를 창조해요.",
    good:["APT","EIN","DIV"], bad:["DEP","HYO","MTC"],
    goods:"🎵 컬러 뮤직 노트 · 아트 테라피 세트" },
  HIT:{ name:"초직관형", sub:"HIT (Hyper Intuitive Thinking · 과직관)", emoji:"🔥", color:"#FF6B6B", cat:"사고패턴",
    desc:"데이터 없이 답을 먼저 아는 능력.",
    cheat:"초고속 패턴 매칭 + 미래 감지", when:"설명할 수 없지만 답을 알 때", famous:"스티브 잡스, 오프라 윈프리",
    fullDesc:"직관은 뇌가 과거의 수백만 가지 경험을 무의식적으로 처리해서 나오는 초고속 패턴 매칭이에요. 스티브 잡스는 '직관은 지식보다 강력하다'고 했어요. 당신의 '왠지 이렇게 될 것 같다'는 느낌은 틀린 것이 아니라 뇌가 이미 답을 알고 있다는 신호예요.",
    good:["PRE","PTN","EMP"], bad:["DEP","MTC","HYO"],
    goods:"🔥 직관 카드 덱 · 명상 쿠션 · 시그니처 향초" },
  OVT:{ name:"과잉사고형", sub:"Overthinking (과잉사고)", emoji:"🌀", color:"#74B9FF", cat:"사고패턴",
    desc:"머릿속 시나리오 플래너, 미래를 미리 살아요.",
    cheat:"리스크 감지 최강 + 완벽한 준비", when:"모든 경우의 수를 이미 계산했을 때", famous:"대부분의 천재들",
    fullDesc:"과잉사고는 뇌의 전전두엽이 과활성화된 상태예요. 이 뇌는 모든 가능한 결과를 시뮬레이션하면서 최악의 상황을 미리 방지하려 해요. 체스 그랜드마스터들은 평균 20~30수를 미리 계산하고, 뛰어난 전략가들은 모든 시나리오를 미리 그려본다는 공통점이 있어요. 당신의 '너무 많이 생각하는 것'이 사실은 타인보다 더 많은 미래를 살고 있는 거예요. 당신처럼 OVT가 높은 사람은 위기 상황에서 가장 먼저 해결책을 제시하는 사람이 돼요.",
    good:["MTC","DEP","PFT"], bad:["IMP","ART","HYP"],
    goods:"🌀 마인드맵 노트 · 브레인덤프 저널 · 타이머" },
  PFT:{ name:"완벽추구형", sub:"Perfectionism (완벽주의)", emoji:"💎", color:"#DFE6E9", cat:"사고패턴",
    desc:"세상에서 가장 높은 기준을 가진 사람.",
    cheat:"품질 보증 능력 + 높은 기준", when:"남들이 OK 해도 나만 더 나은 것을 볼 때", famous:"스티브 잡스, 봉준호",
    fullDesc:"Perfectionism(완벽주의)은 단순한 고집이 아니라, 뇌의 전두엽이 기준치를 높게 설정한 상태예요. 스티브 잡스는 모서리가 둥근 아이폰 설계에 수백 번을 반복했고, 봉준호는 기생충의 장면 하나를 위해 몇 달을 투자했어요. 남들이 충분하다고 할 때 아직 더 나은 가능성이 보이는 이 능력이 세상이 기억하는 최고의 결과물을 만들어요. 번아웃을 조심하면서 이 능력을 쓰는 게 핵심이에요.",
    good:["MTC","DEP","OVT"], bad:["IMP","ART","ADD"],
    goods:"💎 프리미엄 플래너 · 품질 체크리스트 북" },
  DRM:{ name:"몽상창조형", sub:"Daydreamer (몽상·백일몽)", emoji:"☁️", color:"#B2BEC3", cat:"사고패턴",
    desc:"현실에 없는 세계를 설계하는 창조자.",
    cheat:"무한 상상력 + 세계 창조 능력", when:"수업 중 딴생각이 실제 아이디어가 될 때", famous:"J.K. 롤링, 디즈니",
    fullDesc:"Daydreamer(몽상가) 특성은 뇌의 디폴트 모드 네트워크(DMN)가 활발히 작동하는 상태예요. 뇌과학 연구에 따르면 몽상 중에 가장 창의적인 아이디어 연결이 일어나요. J.K. 롤링은 기차 안에서 멍하니 있다가 해리포터 세계 전체를 떠올렸어요. 수업이나 회의 중 딴 생각을 한다면, 그건 집중력 부족이 아니라 뇌가 더 큰 그림을 그리고 있는 거예요. 멍하게 있는 시간을 허락할수록 더 큰 창의력이 나와요.",
    good:["DIV","ADD","HIT"], bad:["DEP","PFT","MTC"],
    goods:"☁️ 스케치북 · 아이디어 노트 · 꿈 일기장" },
  PTN:{ name:"패턴해독형", sub:"Pattern Recognition (패턴 인식)", emoji:"🧩", color:"#00B894", cat:"사고패턴",
    desc:"남들이 못 보는 규칙과 연결을 발견해요.",
    cheat:"숨겨진 법칙 발견 + 예측 능력", when:"데이터에서 아무도 못 본 패턴을 볼 때", famous:"닐스 보어, 셜록 스타일",
    fullDesc:"Pattern Recognition(패턴 인식)은 복잡한 데이터 속에서 숨겨진 규칙을 발견하는 능력이에요. 아이작 뉴턴은 사과가 떨어지는 현상에서 중력의 패턴을 발견했어요. 이 특성이 높은 사람들은 겉으로 관계없어 보이는 것들 사이에서 연결 고리를 찾아내고, 상황이 어떻게 흘러갈지 미리 예측하는 능력이 탁월해요. 데이터를 보면 다음 패턴이 보이는 사람이에요.",
    good:["ASD","DEP","HIT"], bad:["DRM","ART","EMP"],
    goods:"🧩 논리 퍼즐 세트 · 데이터 시각화 노트" },
  MTC:{ name:"초메타인지형", sub:"Meta Cognition (메타인지)", emoji:"🪞", color:"#FFEAA7", cat:"사고패턴",
    desc:"자기 뇌를 객관적으로 보는 드문 능력.",
    cheat:"자기 객관화 + 빠른 자기 수정", when:"내가 왜 이런 생각을 하는지 알 때", famous:"마르쿠스 아우렐리우스, 달라이 라마",
    fullDesc:"Meta Cognition(메타인지)은 자기 자신의 사고 과정을 관찰하고 조절하는 능력이에요. 하버드 심리학 연구에서 메타인지 능력이 높은 사람이 IQ보다 학습 성과와 문제 해결에서 더 뛰어나다는 게 밝혀졌어요. 마르쿠스 아우렐리우스는 황제이면서도 자신의 감정과 판단을 끊임없이 관찰하고 기록했어요. 내가 왜 이런 생각을 하지 라고 스스로에게 묻는 순간, 대부분의 사람은 하지 못하는 자기 교정이 일어나고 있는 거예요.",
    good:["OVT","DEP","PFT"], bad:["IMP","DRM","ART"],
    goods:"🪞 마음 챙김 저널 · 성찰 카드 · 명상 앱 구독" },
  DIV:{ name:"확산사고형", sub:"Divergent Thinking (확산적 사고)", emoji:"💥", color:"#FD79A8", cat:"사고패턴",
    desc:"하나에서 백을 떠올리는 아이디어 폭발.",
    cheat:"아이디어 무한 생성 + 창의적 연결", when:"브레인스토밍에서 혼자 아이디어가 넘칠 때", famous:"레오나르도 다빈치, 에디슨",
    fullDesc:"Divergent Thinking(확산적 사고)은 하나의 문제에서 여러 방향으로 사고를 뻗어나가는 능력이에요. NASA는 창의적 사고 능력을 측정할 때 이 능력을 핵심 지표로 사용해요. 레오나르도 다빈치는 노트 한 권에 날개, 물레방아, 인체 해부, 악기 설계를 동시에 그렸어요. 브레인스토밍에서 엉뚱한 아이디어를 낸다고 느낀다면, 사실은 아무도 생각 못한 연결을 하고 있는 거예요.",
    good:["ADD","DRM","HIT"], bad:["DEP","PFT","HYO"],
    goods:"💥 브레인스토밍 카드 · 포스트잇 세트 · 화이트보드" },
  DEP:{ name:"심층분석형", sub:"Deep Analysis (심층 분석)", emoji:"🔬", color:"#55EFC4", cat:"사고패턴",
    desc:"한 가지를 누구보다 깊이 파고드는 힘.",
    cheat:"전문성 극대화 + 깊이 있는 통찰", when:"하나를 파다 보면 세계가 열릴 때", famous:"찰스 다윈, 뉴턴",
    fullDesc:"Deep Analysis(심층 분석)는 표면을 넘어 본질을 파고드는 능력이에요. 말콤 글래드웰의 1만 시간 법칙을 실제로 구현하는 사람들이 바로 이 특성을 가진 사람들이에요. 찰스 다윈은 갈라파고스 섬의 핀치새를 수십 년 관찰해서 진화론을 만들었어요. 관심 있는 주제 앞에서 아직 더 알아야 해 라고 느낀다면, 그게 바로 이 능력이 작동하는 순간이에요.",
    good:["PTN","ASD","MTC"], bad:["ADD","IMP","ART"],
    goods:"🔬 전문서적 북클럽 · 딥워크 플래너" },
  DLT:{ name:"이중사고형", sub:"Dialectical Thinking (변증법적 사고)", emoji:"⚖️", color:"#A29BFE", cat:"사고패턴",
    desc:"반대 관점을 동시에 볼 수 있는 능력.",
    cheat:"중재 능력 최강 + 다면 이해", when:"양쪽 다 맞는 게 보여서 편을 못 들 때", famous:"링컨, 오바마",
    fullDesc:"Dialectical Thinking(변증법적 사고)는 서로 반대되는 두 관점을 동시에 유지하고 통합하는 능력이에요. 링컨은 노예제 폐지론자와 온건파 양쪽의 논리를 동시에 이해했기에 남북전쟁을 이끌 수 있었어요. 이 능력이 있는 사람들은 어떻게 두 진실을 통합할 수 있을까를 생각해요. 편을 못 드는 건 우유부단함이 아니라 두 진실을 동시에 볼 수 있는 드문 능력이에요.",
    good:["MTC","EMP","OVT"], bad:["IMP","ADD","HYP"],
    goods:"⚖️ 토론 카드 · 철학 에세이 북" },
  EMP:{ name:"공감과부하형", sub:"Empath (공감 과부하)", emoji:"💗", color:"#FF7675", cat:"감정공감",
    desc:"타인의 감정을 내 것처럼 느끼는 치유자.",
    cheat:"치유 능력 + 인간 이해 최강", when:"말 안 해도 상대가 무슨 감정인지 알 때", famous:"테레사 수녀, 오프라 윈프리",
    fullDesc:"공감 능력이 높은 뇌는 거울 뉴런(Mirror Neuron)이 과활성화된 상태예요. 타인의 고통이 실제로 느껴지고, 타인의 기쁨이 진짜처럼 경험됩니다. EMP가 높은 당신은 주변 사람들이 힘들 때 가장 먼저 알아채고 도움을 주는 사람이에요. 단, 경계 설정을 배우지 않으면 소진으로 이어질 수 있어요.",
    good:["HSP","OVE","TRS"], bad:["DEP","MTC","AVA"],
    goods:"💗 감정 회복 키트 · 배스 솔트 · 힐링 캔들" },
  RSD:{ name:"거절민감형", sub:"Rejection Sensitive Dysphoria (거절 민감)", emoji:"🫀", color:"#FD79A8", cat:"감정공감",
    desc:"관계에 누구보다 진심인 사람의 이면.",
    cheat:"관계 헌신 최강 + 깊은 감수성", when:"작은 말 한마디가 오래 마음에 남을 때", famous:"ADHD를 가진 많은 창의적 인물들",
    fullDesc:"Rejection Sensitive Dysphoria(거절 민감 불쾌감)는 ADHD와 함께 나타나는 경우가 많으며, 거절이나 비판에 강하게 반응하는 신경학적 특성이에요. 이 특성을 가진 사람들은 관계에서 누구보다 진심이고, 상대의 작은 변화도 섬세하게 감지해요. 작은 말 한마디가 마음에 오래 남는다면, 그건 그 관계에 그만큼 진심이라는 증거예요.",
    good:["ANA","EMP","HSP"], bad:["AVA","INT","HYO"],
    goods:"🫀 자기확언 카드 · 감정 일기 · 심리 에세이" },
  ANA:{ name:"불안애착형", sub:"Anxious Attachment (불안형 애착)", emoji:"🌙", color:"#6C5CE7", cat:"감정공감",
    desc:"깊고 헌신적인 사랑의 원천.",
    cheat:"깊은 사랑 능력 + 관계 집중력", when:"한 사람에게 온 우주가 될 때", famous:"많은 낭만주의 예술가들",
    fullDesc:"Anxious Attachment(불안형 애착)는 존 볼비의 애착 이론에서 정의된 관계 패턴이에요. 이 특성을 가진 사람들은 관계에서 매우 깊이 헌신하고, 상대방에게 온 우주가 될 수 있는 사랑의 능력을 가졌어요. 낭만주의 시대의 예술가 대부분이 이 특성을 가졌고, 그 깊은 감정이 불멸의 작품들을 탄생시켰어요.",
    good:["EMP","OVE","RSD"], bad:["AVA","INT","DEP"],
    goods:"🌙 애착 치유 책 · 감정 카드 · 달 오브제" },
  AVA:{ name:"회피애착형", sub:"Avoidant Attachment (회피형 애착)", emoji:"🏔️", color:"#B2BEC3", cat:"감정공감",
    desc:"완전한 자기충족과 독립성의 힘.",
    cheat:"완전한 독립성 + 자기충족 능력", when:"혼자서도 완전한 세계가 있을 때", famous:"많은 철학자·예술가들",
    fullDesc:"Avoidant Attachment(회피형 애착)는 혼자서도 완전한 내면 세계를 가진 사람들이에요. 친밀감에 불편함을 느끼지만, 대신 완전한 독립성과 자기충족 능력을 가지고 있어요. 많은 철학자, 수도자, 탐험가들이 이 특성을 가졌어요. 혼자만의 시간에서 가장 깊은 창조성이 나오고, 타인의 시선에 흔들리지 않는 확고한 자아가 강점이에요.",
    good:["INT","DEP","MTC"], bad:["ANA","EMP","RSD"],
    goods:"🏔️ 솔로 트래블 가이드 · 자기계발서 · 명상 앱" },
  EIN:{ name:"정서강도형", sub:"Emotional Intensity (정서 강도)", emoji:"🌋", color:"#FF6B6B", cat:"감정공감",
    desc:"감정의 진폭이 커서 삶을 더 강렬하게 살아요.",
    cheat:"강렬한 삶 경험 + 예술적 표현력", when:"기쁨도 슬픔도 남들보다 훨씬 강하게 느낄 때", famous:"프리다 칼로, 빈센트 반 고흐",
    fullDesc:"Emotional Intensity(정서 강도)는 뇌의 변연계가 일반인보다 훨씬 강하게 활성화되는 특성이에요. 빈센트 반 고흐는 밀밭 하나에서도 압도적인 감동을 느꼈고 그것이 그림으로 폭발했어요. 이 특성을 가진 사람들은 삶을 남들보다 10배 더 강하게 경험해요. 슬픔도 깊지만 기쁨도 폭발적이에요. 이 강도가 예술, 음악, 글쓰기로 표현될 때 세상을 움직이는 작품이 탄생해요.",
    good:["EMP","HSP","OVE"], bad:["MTC","HYO","AVA"],
    goods:"🌋 감정 표현 아트 키트 · 일기장 · 감성 플레이리스트" },
  OVE:{ name:"감정이입과다형", sub:"Over-Empathy (과잉 감정이입)", emoji:"🫧", color:"#74B9FF", cat:"감정공감",
    desc:"예술적 감수성의 극한 형태.",
    cheat:"최고의 예술적 감수성 + 치유력", when:"영화 속 인물의 감정이 실제처럼 느껴질 때", famous:"많은 작가·배우·음악가들",
    fullDesc:"Over-Empathy(과잉 감정이입)는 타인의 감정과 허구 속 캐릭터의 감정까지 실제처럼 경험하는 특성이에요. 최고의 배우들이 캐릭터에 완전히 몰입할 수 있는 이유가 바로 이 능력 때문이에요. 드라마 속 인물이 당하는 일에 실제로 눈물이 나고, 책 속 주인공과 함께 살고 있다는 느낌이 든다면 작가, 배우, 치료사의 재능을 가졌다는 신호예요.",
    good:["EMP","HSP","EIN"], bad:["DEP","MTC","PTN"],
    goods:"🫧 감성 독서 키트 · 무드 캔들 · 예술 영화 큐레이션" },
  BRN:{ name:"번아웃민감형", sub:"Burnout Syndrome (번아웃 증후군)", emoji:"🕯️", color:"#FDCB6E", cat:"감정공감",
    desc:"높은 기준과 헌신이 만든 훈장.",
    cheat:"높은 기준 증거 + 깊은 헌신력", when:"최선을 다한 후 텅 빈 느낌이 올 때", famous:"대부분의 고성취자들",
    fullDesc:"Burnout Syndrome(번아웃 증후군)은 높은 기준과 강한 헌신이 에너지 고갈로 이어지는 상태예요. 번아웃을 경험하는 사람들은 대부분 자기 일에 진심이고, 대충이라는 단어를 모르는 사람들이에요. 세계 최고의 CEO들, 올림픽 선수들도 번아웃을 경험해요. 번아웃은 실패가 아니라 당신이 한계까지 헌신했다는 훈장이에요.",
    good:["MTC","BSG","HSP"], bad:["HYP","ENB","IMP"],
    goods:"🕯️ 회복 에너지 키트 · 힐링 티 세트 · 휴식 플래너" },
  TRS:{ name:"트라우마민감형", sub:"Trauma Sensitivity (트라우마 민감성)", emoji:"🌿", color:"#00B894", cat:"감정공감",
    desc:"위기 감지 레이더와 깊은 공감의 원천.",
    cheat:"위기 감지 최강 + 공감 치유력", when:"과거 경험이 지금 나를 더 강하게 만들 때", famous:"많은 사회 활동가·치유사들",
    fullDesc:"Trauma Sensitivity(트라우마 민감성)는 과거의 힘든 경험이 현재의 감각과 반응에 영향을 주는 특성이에요. 칼 융은 상처받은 치유자 개념을 통해, 자신의 상처를 치유한 사람이 가장 깊은 공감으로 타인을 도울 수 있다고 했어요. 이 특성을 가진 사람들은 위험 신호를 남들보다 일찍 감지하고, 아픈 사람의 마음을 진짜로 이해하는 능력이 있어요.",
    good:["EMP","HSP","BRN"], bad:["IMP","HYA","ENB"],
    goods:"🌿 힐링 저널 · 자연 음향 스피커 · 식물 키우기 세트" },
  IMP:{ name:"충동실행형", sub:"Impulsivity (충동성)", emoji:"🚀", color:"#FF7675", cat:"에너지행동",
    desc:"생각보다 빠른 실행력의 원천.",
    cheat:"즉각 실행력 + 빠른 결정력", when:"남들이 고민할 때 이미 해버렸을 때", famous:"리처드 브랜슨, 유재석",
    fullDesc:"Impulsivity(충동성)는 단순한 자제력 부족이 아니라 즉각적인 실행력과 빠른 결단력의 신경학적 기반이에요. 리처드 브랜슨은 먼저 해보고 나중에 생각한다는 철학으로 버진그룹을 400개 회사로 키웠어요. 이 특성을 가진 사람들은 기회가 왔을 때 망설이지 않고 잡는 능력이 있어요. 충동을 방향성과 결합하면 최강의 실행력이 돼요.",
    good:["ADD","ART","ENB"], bad:["DEP","PFT","OVT"],
    goods:"🚀 액션 플래너 · 퀵 노트 · 타이머 큐브" },
  HYP:{ name:"경조증사이클형", sub:"Hypomanic Cycle (경조증 사이클)", emoji:"🌟", color:"#FFD93D", cat:"에너지행동",
    desc:"창의력이 폭발하는 고에너지 사이클.",
    cheat:"창의 폭발 사이클 + 에너지 최강", when:"며칠간 잠도 안 자고 뭔가를 만들 때", famous:"처칠, 반 고흐",
    fullDesc:"경조증 사이클은 창의력 폭발의 원천이에요. 위대한 예술가와 창업자들의 상당수가 이 사이클을 가졌어요.",
    good:["ADD","DIV","IMP"], bad:["PFT","DEP","OVT"],
    goods:"🌟 아이디어 캡처 노트 · 에너지 음료 · 창작 보드" },
  NIT:{ name:"야간각성형", sub:"Night Owl / Delayed Sleep Phase (야간형)", emoji:"🦉", color:"#6C5CE7", cat:"에너지행동",
    desc:"밤에 깨어나는 뇌, 올빼미의 진짜 능력.",
    cheat:"야간 창의력 폭발 + 집중력 극대화", when:"밤 11시부터 뇌가 켜지는 느낌일 때", famous:"프란츠 카프카, 마르셀 프루스트",
    fullDesc:"Night Owl(올빼미형)은 일주기 리듬이 일반인보다 늦게 설정된 신경학적 특성이에요. 프란츠 카프카는 낮에는 보험 회사 직원이었고, 밤에 변신 등 모든 걸작을 썼어요. 야간형 사람들은 밤에 창의적 사고와 집중력이 실제로 올라가는 신경 구조를 가지고 있어요. 세상의 아침형 시스템에 맞추느라 힘들었다면, 그건 당신이 틀린 게 아니라 다른 리듬으로 설계된 거예요.",
    good:["INT","DEP","HYP"], bad:["ENB","HYA","IMP"],
    goods:"🦉 야간 독서 조명 · 블루라이트 차단 안경 · 밤 작업 플레이리스트" },
  HYA:{ name:"과각성형", sub:"Hyperarousal (과각성)", emoji:"⚡", color:"#FFEAA7", cat:"에너지행동",
    desc:"위험 감지 레이더가 항상 켜진 상태.",
    cheat:"위기 감지 능력 + 빠른 반응", when:"무언가 잘못되기 전에 먼저 느낄 때", famous:"많은 특수부대원·응급의료진",
    fullDesc:"Hyperarousal(과각성)은 뇌의 편도체와 자율신경계가 높은 경계 상태로 유지되는 특성이에요. 특수부대원, 응급실 의사, 소방관들이 위험을 남들보다 먼저 감지하는 능력이 바로 이것이에요. 일상에서는 쉽게 긴장하고 작은 소리에도 깜짝 놀라는 것이 피곤하지만, 위기 상황에서 가장 침착하게 행동하는 사람이 바로 당신이에요.",
    good:["PRE","HIT","BSG"], bad:["HSP","HYO","INT"],
    goods:"⚡ 마그네슘 보충제 · 호흡 명상 앱 · 접지 매트" },
  HYO:{ name:"저각성형", sub:"Hypoarousal (저각성)", emoji:"🌊", color:"#74B9FF", cat:"에너지행동",
    desc:"깊은 침잠과 사색의 능력.",
    cheat:"깊은 사색력 + 평온한 집중", when:"폭풍 속에서도 고요함을 유지할 때", famous:"달라이 라마, 많은 철학자들",
    fullDesc:"Hypoarousal(저각성)은 자율신경계가 낮은 각성 상태를 유지하는 특성이에요. 달라이 라마와 많은 명상 수련자들이 이 상태를 의도적으로 훈련하는 이유가 있어요. 어떤 자극에도 흔들리지 않는 고요한 중심이 지혜와 통찰의 원천이 되기 때문이에요. 폭풍 속에서도 침착한 이 특성은 주변 사람들에게 안정감을 주는 존재가 돼요.",
    good:["INT","DEP","MTC"], bad:["HYA","ENB","IMP"],
    goods:"🌊 명상 쿠션 · 소리 치유 볼 · 자연 다큐 추천" },
  ART:{ name:"루틴파괴형", sub:"Anti-Routine / Novelty Seeking (루틴 거부형)", emoji:"🎪", color:"#FD79A8", cat:"에너지행동",
    desc:"변화와 즉흥에서 에너지를 얻는 자유인.",
    cheat:"즉흥 창의력 + 변화 적응 최강", when:"계획 없이 즉흥으로 최고의 결과가 나올 때", famous:"재즈 뮤지션들, 즉흥 배우들",
    fullDesc:"Anti-Routine(루틴 거부형)은 새로움을 추구하는 도파민 수용체가 발달한 특성이에요. 재즈 음악가들은 악보 없이 즉흥 연주로 최고의 음악을 만들고, 스타트업 창업자들은 정해진 경로 없이 새로운 시장을 개척해요. 이 특성을 가진 사람들은 반복되는 루틴에서 빠르게 에너지를 잃지만, 새로운 환경과 변화 앞에서 오히려 활기를 찾아요.",
    good:["IMP","ADD","DIV"], bad:["PFT","DEP","MTC"],
    goods:"🎪 여행 스팟 룰렛 · 즉흥 아이디어 카드 · 어드벤처 저널" },
  INT:{ name:"극내향형", sub:"Deep Introvert (극내향형)", emoji:"🌙", color:"#A29BFE", cat:"에너지행동",
    desc:"혼자서 완전한 세계를 가진 사람.",
    cheat:"깊은 내면 세계 + 자기충족 능력", when:"혼자만의 시간이 진짜 충전될 때", famous:"뉴턴, 카프카, 박효신",
    fullDesc:"Deep Introvert(극내향형)은 뇌가 내적 자극에서 에너지를 얻는 특성이에요. 아이작 뉴턴은 혼자 사과나무 아래 앉아 중력을 발견했고, 카프카는 완전한 고독 속에서 문학을 창조했어요. 내향성은 수줍음이 아니라 내면 세계가 외부 세계만큼 풍부한 신경 구조예요. 혼자 있을 때 가장 깊이 생각하고 가장 창의적인 아이디어가 나와요.",
    good:["DEP","NIT","MTC"], bad:["ENB","IMP","ART"],
    goods:"🌙 독서 큐레이션 · 나만의 공간 오브제 · 고급 이어폰" },
  ENB:{ name:"에너지폭발형", sub:"Energy Burst (에너지 폭발형)", emoji:"💥", color:"#FF6B6B", cat:"에너지행동",
    desc:"일단 불이 붙으면 멈출 수 없는 힘.",
    cheat:"폭발적 추진력 + 전염되는 에너지", when:"시작하면 주변까지 달아오를 때", famous:"제이홉, 유재석, 리처드 브랜슨",
    fullDesc:"Energy Burst(에너지 폭발형)은 도파민과 노르에피네프린이 폭발적으로 분비되는 특성이에요. BTS 제이홉이 무대에 오르면 관객 전체의 에너지가 바뀌는 건 이 능력 때문이에요. 이 특성을 가진 사람들은 방에 들어서는 순간 분위기를 바꾸는 존재감이 있어요. 번아웃을 예방하면서 에너지를 전략적으로 사용하는 것이 핵심이에요.",
    good:["IMP","HYP","ART"], bad:["INT","HYO","DEP"],
    goods:"💥 프리-워크아웃 · 운동 장비 · 에너지 트래커" },
  GST:{ name:"미각후각예민형", sub:"Gustatory & Olfactory Sensitivity (미각·후각 예민)", emoji:"🌸", color:"#55EFC4", cat:"감각신체",
    desc:"남이 못 느끼는 미묘한 차이를 감지해요.",
    cheat:"감각 고해상도 + 품질 감별 능력", when:"음식 맛에서 재료를 하나하나 느낄 때", famous:"유명 셰프들, 소믈리에들",
    fullDesc:"Gustatory Sensitivity(미각·후각 예민)는 미각과 후각을 처리하는 뇌 영역이 일반인보다 발달한 특성이에요. 미슐랭 셰프들은 재료를 보기만 해도 신선도를 감지하고, 조향사들은 수백 가지 향을 구별해요. 음식 한 입에서 재료들을 하나씩 구별하고, 특정 향기에서 오래된 기억이 선명하게 떠오른다면 이 특성이 강하게 작동하는 거예요.",
    good:["HSP","SPD","TCT"], bad:["ENB","IMP","HYA"],
    goods:"🌸 프리미엄 차 세트 · 향수 샘플 키트 · 미식 가이드북" },
  BSG:{ name:"신체신호형", sub:"Body Signal Awareness (신체 신호 감지)", emoji:"💫", color:"#FDCB6E", cat:"감각신체",
    desc:"몸의 경고를 가장 먼저 읽는 능력.",
    cheat:"신체 인식 최강 + 건강 감지 능력", when:"몸이 먼저 뭔가 잘못됐다고 알려줄 때", famous:"많은 운동선수·명상가들",
    fullDesc:"Body Signal Awareness(신체 신호 감지)는 몸이 보내는 미세한 신호를 의식적으로 인식하는 능력이에요. 올림픽 선수들이 훈련하는 핵심 능력 중 하나로, 근육의 미세한 긴장, 심박수의 변화까지 세밀하게 감지해요. 이 능력이 높은 사람들은 병이 심각해지기 전에 몸의 이상 신호를 먼저 느끼고, 자신에게 맞는 생활 패턴을 직관적으로 알아요.",
    good:["HSP","ENV","MTC"], bad:["IMP","ADD","ENB"],
    goods:"💫 스마트 워치 · 바디스캔 명상 가이드 · 건강 트래커" },
  TCT:{ name:"촉각예민형", sub:"Tactile Sensitivity (촉각 예민)", emoji:"🤲", color:"#DFE6E9", cat:"감각신체",
    desc:"질감과 온도로 세상을 읽는 섬세함.",
    cheat:"촉각 정보 최강 + 손끝 감각 능력", when:"소재 하나에서 수많은 정보가 느껴질 때", famous:"많은 조각가·도예가들",
    fullDesc:"Tactile Sensitivity(촉각 예민)는 피부의 감각 수용체가 미세한 자극도 민감하게 감지하는 특성이에요. 신경외과 의사들은 수술 중 손끝의 감각으로 조직의 상태를 판단하고, 도예가들은 흙의 수분 함량을 손으로 느껴요. 태그나 라벨이 불편하게 느껴지는 것이 동시에 당신을 최고의 손 기술 전문가로 만들어주는 능력이에요.",
    good:["GST","SPD","HSP"], bad:["ENB","IMP","HYA"],
    goods:"🤲 감각 테라피 세트 · 핸드크림 컬렉션 · 텍스처 예술 키트" },
  ENV:{ name:"환경민감형", sub:"Environmental Sensitivity (환경 민감형)", emoji:"🌿", color:"#00B894", cat:"감각신체",
    desc:"공간의 에너지를 감지하는 능력.",
    cheat:"공간 기운 감지 + 환경 최적화 능력", when:"어떤 공간에 들어가면 바로 기운이 느껴질 때", famous:"많은 인테리어 디자이너",
    fullDesc:"Environmental Sensitivity(환경 민감형)는 공간의 분위기, 온도, 빛, 소리, 사람들의 에너지를 종합적으로 감지하는 능력이에요. 좋은 인테리어 디자이너들이 공간에 들어서는 순간 무엇이 필요한지 직감하는 것이 이 능력이에요. 특정 장소에서 이유 없이 불편하거나 특정 공간에서 갑자기 평온해지는 경험이 있다면, 당신은 공간이 가진 에너지를 실제로 감지하고 있는 거예요.",
    good:["HSP","BSG","SPD"], bad:["ENB","IMP","HYA"],
    goods:"🌿 공간 정화 스프레이 · 미니 식물 · 풍수 인테리어 가이드" },
  EID:{ name:"사진기억형", sub:"Eidetic Memory (사진 기억력)", emoji:"📸", color:"#6C5CE7", cat:"특수능력",
    desc:"본 것을 사진처럼 저장하는 뇌.",
    cheat:"시각 정보 완벽 저장 + 회상 능력", when:"한 번 본 것이 사진처럼 기억날 때", famous:"니콜라 테슬라, 모차르트",
    fullDesc:"Eidetic Memory(사진 기억력)는 본 것을 사진처럼 시각 피질에 저장하는 희귀한 능력이에요. 니콜라 테슬라는 설계도를 한 번 보고 머릿속에서 3D로 구현했고, 모차르트는 오케스트라 곡을 한 번 듣고 악보 전체를 기억했어요. 한 번 본 얼굴, 읽은 페이지를 오랫동안 생생하게 떠올릴 수 있다면 이 특성이 강한 거예요.",
    good:["PTN","ASD","DEP"], bad:["DRM","ART","IMP"],
    goods:"📸 기억력 훈련 카드 · 비주얼 저널 · 마인드 맵 앱" },
  APT:{ name:"절대음감형", sub:"Absolute Pitch (절대음감)", emoji:"🎼", color:"#FFD93D", cat:"특수능력",
    desc:"소리의 주파수를 정확히 인식하는 능력.",
    cheat:"음악적 뇌 + 소리 패턴 인식", when:"음악을 들으면 음이름이 바로 들릴 때", famous:"모차르트, 머라이어 캐리",
    fullDesc:"Absolute Pitch(절대음감)는 기준음 없이 음의 높낮이를 정확히 인식하는 능력이에요. 전체 인구의 약 0.01%만 가진 극히 희귀한 능력으로, 모차르트는 3세에 이 능력을 보였어요. 절대음감이 있는 사람들은 음악을 들을 때 각 음의 이름이 자동으로 들리고, 악기가 정확하게 조율되었는지 즉시 알 수 있어요.",
    good:["SYN","DEP","PTN"], bad:["DRM","ART","IMP"],
    goods:"🎼 절대음감 훈련 앱 · 악기 · 음악 이론 교재" },
  PRE:{ name:"예지직관형", sub:"Pre-cognition Intuition (예지적 직관)", emoji:"🔮", color:"#A29BFE", cat:"특수능력",
    desc:"상황을 미리 읽는 선독 능력.",
    cheat:"상황 선독 능력 + 미래 시뮬레이션", when:"일이 터지기 전에 이미 알고 있을 때", famous:"많은 전략가·예언가들",
    fullDesc:"Pre-cognition Intuition(예지적 직관)은 의식적으로 분석하기 전에 결론이 먼저 오는 능력이에요. 뇌과학적으로는 무의식이 수백만 가지 패턴을 초고속으로 처리해 결과를 내보내는 것이에요. 체스 그랜드마스터들이 판세를 읽는 것, 군사 전략가들이 전투 전에 결과를 예감하는 것도 이 능력이에요. 훈련을 통해 언제 직관을 신뢰하고 언제 분석이 필요한지 구별하면 최강의 의사결정 도구가 돼요.",
    good:["HIT","PTN","MTC"], bad:["IMP","DRM","ART"],
    goods:"🔮 타로 카드 · 직관 훈련 저널 · 예측 시나리오 노트" },
};

const TRAIT_KEYS = Object.keys(TRAITS);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5가지 지수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const INDEX_MAP = {
  논리추론:{ icon:"🧩", color:"#74B9FF", code:"L.I", krFull:"논리적 추론", eng:"Logical Inference",    traits:["PTN","DEP","DLT","MTC","ASD"],
    def:"논리적으로 추론하고 분석하는 뇌의 기본 처리 능력이에요. 높을수록 체계적 사고와 문제 해결에 강해요." },
  패턴인식:{ icon:"🎯", color:"#FFD93D", code:"P.R", krFull:"패턴 인식", eng:"Pattern Recognition",   traits:["PTN","HIT","PRE","EID","ASD"],
    def:"숨겨진 규칙과 연결고리를 찾아내는 능력이에요. 높을수록 남들이 못 보는 패턴을 빠르게 발견해요." },
  처리속도:{ icon:"⚡", color:"#FF7675", code:"P.S", krFull:"처리 속도", eng:"Processing Speed",      traits:["ADD","IMP","ENB","HYA","HYP"],
    def:"정보를 얼마나 빠르게 처리하고 반응하는지의 지표예요. 높을수록 즉각적 실행과 빠른 판단이 특기예요." },
  창의지능:{ icon:"🌈", color:"#FD79A8", code:"C.I", krFull:"창의 지능", eng:"Creative Intelligence",  traits:["DIV","DRM","SYN","DYS","HIT"],
    def:"기존의 틀을 벗어나 새로운 아이디어를 만들어내는 능력이에요. 예술, 발명, 혁신의 원천이에요." },
  감성지능:{ icon:"💗", color:"#FF9AA2", code:"E.Q", krFull:"감성 지능", eng:"Emotional Quotient",    traits:["EMP","HSP","OVE","EIN","RSD"],
    def:"감정을 인식하고 공감하며 관계를 이끄는 능력이에요. 높을수록 인간 관계에서 깊이 있는 연결을 만들어요." },
};

function pctToIQ(pct) {
  const z = (pct - 50) / 15;
  return Math.max(60, Math.min(145, Math.round(100 + z * 15)));
}
function iqToLabel(iq) {
  if(iq >= 130) return { label:"상위 2%", color:"#FFD93D" };
  if(iq >= 120) return { label:"상위 9%", color:"#74B9FF" };
  if(iq >= 115) return { label:"상위 16%", color:"#55EFC4" };
  if(iq >= 110) return { label:"상위 25%", color:"#A29BFE" };
  if(iq >= 100) return { label:"평균 이상", color:"#B2BEC3" };
  return { label:"평균", color:"#B2BEC3" };
}
function calcIndex(pct) {
  const result = {};
  Object.entries(INDEX_MAP).forEach(([name, info]) => {
    const avg = info.traits.reduce((s,k) => s + (pct[k]||50), 0) / info.traits.length;
    result[name] = Math.round(avg);
  });
  return result;
}

const hexToRgb = hex => {
  try { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `${r},${g},${b}`; }
  catch { return "200,200,200"; }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 역채점 + 정규화 calcResults
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const REVERSE_MAP = { 6:{IMP:2,ART:2}, 16:{INT:2,AVA:2}, 47:{ART:2,ADD:1}, 40:{NIT:3}, 25:{EIN:3,HYP:2} };
const MAX_SCORES = {};
TRAIT_KEYS.forEach(k => { MAX_SCORES[k] = 0; });

const QUESTIONS = [
  {id:1,text:"좋아하는 일을 할 때 몇 시간이 순식간에 지나간 적이 있다",map:{ADD:3,HYP:2,ASD:2,DEP:1}},
  {id:2,text:"관심 없는 일은 집중이 너무 안 되고 딴생각이 많다",map:{ADD:3,DRM:2,OVT:1}},
  {id:3,text:"여러 일을 동시에 왔다갔다 하며 처리하는 게 편하다",map:{ADD:2,DIV:2,IMP:1}},
  {id:4,text:"마감 직전에 오히려 엄청난 집중력이 생긴다",map:{ADD:2,HYP:2,IMP:2}},
  {id:5,text:"한 가지 주제에 꽂히면 며칠을 그것만 생각한다",map:{ASD:3,DEP:3,ADD:1,HYP:1}},
  {id:6,text:"한번 집중하면 밥 먹는 것도 잊는다",map:{DEP:3,ASD:2,INT:2}},
  {id:7,text:"하고 싶은 것이 생기면 계획 없이 바로 시작해버린다",map:{IMP:3,ADD:2,ART:2}},
  {id:8,text:"생각이 멈추지 않아서 잠들기 어려울 때가 많다",map:{OVT:3,ADD:2,HYA:2}},
  {id:9,text:"한번 집중하면 주변 소리가 전혀 들리지 않는다",map:{ADD:2,ASD:2,DEP:2,HYP:1}},
  {id:10,text:"지루한 상황을 견디는 게 다른 사람들보다 힘들다",map:{ADD:3,IMP:2,HYA:1}},
  {id:11,text:"영화나 음악에서 다른 사람보다 더 강하게 감동받는다",map:{HSP:3,EIN:2,OVE:2,SYN:1}},
  {id:12,text:"큰 소리나 강한 빛이 있는 곳에서 불쾌하거나 피로해진다",map:{HSP:3,SPD:3,TCT:1}},
  {id:13,text:"음식 맛이나 냄새에서 다른 사람이 못 느끼는 차이를 느낀다",map:{GST:3,HSP:2,SPD:1}},
  {id:14,text:"옷 태그나 특정 소재가 피부에 닿으면 신경 쓰인다",map:{TCT:3,SPD:2,HSP:1}},
  {id:15,text:"음악을 들을 때 특정 음에서 색이나 형태가 느껴진다",map:{SYN:4,APT:2,HSP:1}},
  {id:16,text:"처음 들어간 공간에서 그곳의 분위기가 바로 느껴진다",map:{ENV:3,HSP:2,EMP:2,PRE:1}},
  {id:17,text:"사람 많은 곳을 다녀오면 에너지가 완전히 소진된다",map:{HSP:3,INT:3,EMP:2}},
  {id:18,text:"어떤 음악을 들으면 음이름이나 코드가 자동으로 들린다",map:{APT:4,SYN:1,ASD:1}},
  {id:19,text:"몸이 먼저 무언가 잘못됐다고 신호를 보낼 때가 있다",map:{BSG:3,HYA:2,HSP:1}},
  {id:20,text:"특정 소재나 질감은 절대 몸에 닿기 싫다",map:{TCT:3,SPD:2,HSP:1}},
  {id:21,text:"타인의 감정이 내 것처럼 느껴져서 힘들 때가 있다",map:{EMP:3,OVE:3,HSP:2,RSD:1}},
  {id:22,text:"누군가 힘들다고 하면 나도 같이 아픈 느낌이 든다",map:{EMP:3,OVE:2,HSP:1}},
  {id:23,text:"작은 거절이나 비판에도 마음이 많이 상한다",map:{RSD:4,ANA:2,HSP:1}},
  {id:24,text:"한 사람에게 감정이 쏠리면 그 사람이 전부가 되는 느낌이다",map:{ANA:3,RSD:2,EIN:2}},
  {id:25,text:"혼자 있는 게 더 편하고 관계가 에너지를 소진시킨다",map:{AVA:3,INT:3,HSP:1}},
  {id:26,text:"감정의 기복이 심하고 기쁠 때와 슬플 때 진폭이 크다",map:{EIN:3,HYP:2,ADD:1}},
  {id:27,text:"과거의 힘들었던 경험이 현재 행동에 영향을 미친다",map:{TRS:3,ANA:2,RSD:1}},
  {id:28,text:"최선을 다하고 나면 완전히 텅 빈 느낌이 든다",map:{BRN:3,HSP:1,EMP:1,PFT:1}},
  {id:29,text:"드라마에서 등장인물이 창피당하는 장면이 너무 힘들다",map:{OVE:3,EMP:2,HSP:1}},
  {id:30,text:"상대방의 표정에서 감정 변화를 금방 알아챈다",map:{EMP:3,HSP:2,PRE:2,PTN:1}},
  {id:31,text:"설명할 수 없지만 그냥 답이 맞다는 느낌이 올 때가 있다",map:{HIT:4,PRE:2,HSP:1}},
  {id:32,text:"아이디어가 하나 떠오르면 연달아 여러 개가 나온다",map:{DIV:3,ADD:2,DRM:2}},
  {id:33,text:"수업이나 회의 중 딴생각이 실제 아이디어로 연결된다",map:{DRM:3,ADD:2,DIV:2}},
  {id:34,text:"남들이 보지 못하는 패턴이나 규칙이 보일 때가 있다",map:{PTN:4,ASD:2,HIT:2}},
  {id:35,text:"내가 왜 이런 감정을 느끼는지 분석할 수 있다",map:{MTC:3,DEP:2,DLT:1}},
  {id:36,text:"모든 것이 완벽하지 않으면 만족하기 어렵다",map:{PFT:3,OVT:2,BRN:1}},
  {id:37,text:"한 가지 주제를 아무도 안 가는 깊이까지 파고든다",map:{DEP:3,ASD:2,PTN:1}},
  {id:38,text:"반대되는 두 의견이 모두 맞을 수 있다고 생각한다",map:{DLT:3,MTC:2,HIT:1}},
  {id:39,text:"사람들이 왜 그 선택을 했는지 패턴이 보인다",map:{PTN:3,EMP:2,HIT:2,PRE:1}},
  {id:40,text:"모든 가능성을 생각하다 결정을 못 내릴 때가 있다",map:{OVT:3,DIV:2,PFT:1}},
  {id:41,text:"밤 10시 이후에 갑자기 에너지가 올라오고 창의력이 폭발한다",map:{NIT:4,ADD:1,HYP:1}},
  {id:42,text:"며칠간 잠을 거의 안 자도 에너지가 넘치는 기간이 있다",map:{HYP:4,ADD:1}},
  {id:43,text:"무언가 잘못될 것 같은 느낌이 먼저 오는 경우가 있다",map:{HYA:3,PRE:3,HSP:1}},
  {id:44,text:"계획보다 즉흥으로 움직일 때 더 좋은 결과가 나온다",map:{ART:3,IMP:2,ADD:1}},
  {id:45,text:"혼자 있는 시간이 절대적으로 필요하고 그때 충전된다",map:{INT:4,HSP:1,AVA:1}},
  {id:46,text:"한번 흥미가 붙으면 주변을 다 달아오르게 만드는 에너지가 있다",map:{ENB:3,HYP:2,IMP:1}},
  {id:47,text:"위험하거나 도전적인 상황에서 오히려 침착해진다",map:{HYO:3,HYA:1,MTC:1}},
  {id:48,text:"루틴이나 반복적인 일상이 답답하고 변화가 필요하다",map:{ART:3,ADD:2,IMP:1}},
  {id:49,text:"불안하거나 스트레스 받으면 신체 증상이 온다",map:{BSG:3,HSP:2,TRS:1}},
  {id:50,text:"일을 시작하면 멈추기 힘들고 끝날 때까지 계속하고 싶다",map:{ENB:2,ADD:2,ASD:2,DEP:1}},
  {id:51,text:"한 번 본 장면이나 읽은 글이 사진처럼 기억날 때가 있다",map:{EID:4,ASD:1,PTN:1}},
  {id:52,text:"공간을 처음 봤을 때 전체 구조가 3D로 머릿속에 그려진다",map:{DYS:3,EID:2,ASD:1}},
  {id:53,text:"숫자나 계산보다 이야기나 비유로 이해하는 게 훨씬 빠르다",map:{DYC:3,DRM:2,DYS:1}},
  {id:54,text:"특정 상황에서 내 몸이 자동으로 반응하거나 움직인다",map:{TIC:3,IMP:2,ADD:1}},
  {id:55,text:"일이 터지기 전에 이미 그럴 것 같다는 느낌이 있었다",map:{PRE:4,HIT:2,HYA:1}},
  {id:56,text:"글자나 단어가 거꾸로 보이거나 순서가 헷갈릴 때가 있다",map:{DYS:4,DYC:1}},
  {id:57,text:"여러 사람의 의견을 들으면 모두 일리가 있어서 결론 내기 힘들다",map:{DLT:3,OVT:2,EMP:1}},
  {id:58,text:"특정 소리나 음악이 특정 색이나 모양으로 느껴진다",map:{SYN:5,APT:1}},
  {id:59,text:"나쁜 일을 겪은 후 오히려 더 강해지고 민감해진 부분이 있다",map:{TRS:3,EIN:2,MTC:1}},
  {id:60,text:"내 감정이나 생각이 남들과 다르다는 걸 어릴 때부터 알았다",map:{ASD:2,HSP:2,EIN:2,INT:1,ADD:1}},
];

QUESTIONS.forEach(q => {
  Object.entries(q.map).forEach(([k,v]) => { if(MAX_SCORES[k]!==undefined) MAX_SCORES[k]+=v; });
});

function calcResults(answers) {
  const scores = {};
  TRAIT_KEYS.forEach(k => { scores[k]=0; });
  answers.forEach((ans,i) => {
    if(ans===null) return;
    const q = QUESTIONS[i];
    Object.entries(q.map).forEach(([k,v]) => { if(scores[k]!==undefined) scores[k]+=v*ans; });
    if(REVERSE_MAP[i]) Object.entries(REVERSE_MAP[i]).forEach(([k,v]) => { if(scores[k]!==undefined) scores[k]-=v*ans; });
  });
  const rawPct = {};
  TRAIT_KEYS.forEach(k => { const max=MAX_SCORES[k]*4; rawPct[k]=max>0?(scores[k]/max)*100:0; });
  const values = Object.values(rawPct);
  const mean = values.reduce((a,b)=>a+b,0)/values.length;
  const stdDev = Math.sqrt(values.reduce((a,b)=>a+(b-mean)**2,0)/values.length);
  const pct = {};
  TRAIT_KEYS.forEach(k => { const z=stdDev>0?(rawPct[k]-mean)/stdDev:0; pct[k]=Math.max(5,Math.min(99,Math.round(50+z*15))); });
  return pct;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 뇌구조 SVG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function BrainSVG({ topTraits }) {
  const { useState: useS, useEffect: useE } = require !== undefined ? { useState: null, useEffect: null } : {};
  // 뇌 영역별 점 위치 (실제 뇌 이미지 기준 — 전두엽/두정엽/측두엽/후두엽/소뇌)
  const dotPositions = [
    { x:"28%", y:"22%" },
    { x:"62%", y:"18%" },
    { x:"75%", y:"42%" },
    { x:"58%", y:"65%" },
    { x:"32%", y:"60%" },
    { x:"48%", y:"38%" },
  ];
  const BRAIN_B64 = "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";
  return (
    <div style={{position:"relative",width:"100%",maxWidth:340,margin:"0 auto"}}>
      {/* 뇌 이미지 */}
      <img src={`data:image/jpeg;base64,${BRAIN_B64}`}
        style={{width:"100%",borderRadius:12,display:"block",opacity:0.85,filter:"brightness(1.1) saturate(1.2)"}}
        alt="뇌구조"/>
      {/* 번쩍번쩍 점 + 이니셜 */}
      {topTraits.slice(0,5).map((item, i) => {
        const t = TRAITS[item.code]; if(!t) return null;
        const pos = dotPositions[i];
        const size = Math.max(18, Math.min(36, Math.round((item.pct/100)*36)));
        return (
          <div key={item.code} style={{
            position:"absolute", left:pos.x, top:pos.y,
            transform:"translate(-50%,-50%)",
            animation:`blink${i} 1.${4+i}s ease-in-out infinite`,
            zIndex:2
          }}>
            {/* 번쩍 링 */}
            <div style={{
              position:"absolute", inset:-6,
              borderRadius:"50%",
              border:`2px solid ${t.color}`,
              opacity:0.6,
              animation:`ring${i} 1.${4+i}s ease-in-out infinite`
            }}/>
            {/* 점 */}
            <div style={{
              width:size, height:size, borderRadius:"50%",
              background:`radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), ${t.color})`,
              boxShadow:`0 0 ${size}px rgba(${t.color === "#FFD93D"?"255,217,61":t.color === "#74B9FF"?"116,185,255":t.color === "#FF7675"?"255,118,117":t.color === "#FD79A8"?"253,121,168":t.color === "#A29BFE"?"162,155,254":"85,239,196"},0.8), 0 0 ${size*2}px rgba(${t.color === "#FFD93D"?"255,217,61":t.color === "#74B9FF"?"116,185,255":t.color === "#FF7675"?"255,118,117":t.color === "#FD79A8"?"253,121,168":t.color === "#A29BFE"?"162,155,254":"85,239,196"},0.4)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative"
            }}>
              <span style={{fontSize:size*0.32,fontWeight:700,color:"#0A0A10",fontFamily:"sans-serif",letterSpacing:-0.5,lineHeight:1}}>{item.code.slice(0,3)}</span>
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes blink0{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes blink1{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes blink2{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes blink3{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes blink4{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes blink5{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:0.5;transform:translate(-50%,-50%) scale(0.85)}}
        @keyframes ring0{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
        @keyframes ring1{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
        @keyframes ring2{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
        @keyframes ring3{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
        @keyframes ring4{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
        @keyframes ring5{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.4);opacity:0}}
      `}</style>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 지수 미니바 (1화면용)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function IndexMini({ indices, onTap }) {
  return (
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {Object.entries(INDEX_MAP).map(([name,info]) => {
        const iq = pctToIQ(indices[name]||50);
        const rgb = hexToRgb(info.color);
        return (
          <div key={name} onClick={()=>onTap(name)} style={{flex:"1 1 calc(50% - 3px)",minWidth:140,background:`rgba(${rgb},0.07)`,border:`1px solid rgba(${rgb},0.2)`,borderRadius:10,padding:"7px 10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <span style={{fontSize:10}}>{info.icon} </span>
              <span style={{fontSize:10,color:info.color,fontWeight:700}}>{info.code}</span>
              {/* v702: 사용자 \"L.I (논리적 추론) 이렇게 1페이지에도 다 괄호로 뭔 뜻인지 적어줘\" */}
              <span style={{fontSize:8.5,color:"rgba(255,255,255,0.55)",marginLeft:4}}>({info.krFull})</span>
            </div>
            <span style={{fontSize:16,fontWeight:700,color:info.color}}>{iq}</span>
          </div>
        );
      })}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 지수 상세 모달
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function IndexModal({ name, indices, onClose }) {
  const info = INDEX_MAP[name];
  if(!info) return null;
  const iq = pctToIQ(indices[name]||50);
  const {label, color} = iqToLabel(iq);
  const rgb = hexToRgb(info.color);
  const barPct = Math.max(0, Math.min(100, ((iq-60)/85)*100));
  const avgPos = ((100-60)/85)*100;

  const personalAnalysis = iq >= 130
    ? `${info.code} ${iq} — 상위 2%에 해당해요! 이 지수가 이렇게 높다는 건 ${info.def.split(".")[0]}는 능력이 탁월하다는 뜻이에요. 주변에서 이 능력이 발휘될 때 놀라는 경우가 분명 있었을 거예요. 이 능력을 의식적으로 더 활용하면 독보적인 강점이 돼요.`
    : iq >= 120
    ? `${info.code} ${iq} — 상위 9%예요. 이 지수 덕분에 당신은 많은 사람들이 어려워하는 상황에서 자연스럽게 능력을 발휘하고 있을 거예요. 조금만 더 의식적으로 갈고닦으면 최상위권에 들 수 있어요.`
    : iq >= 110
    ? `${info.code} ${iq} — 평균보다 높아요. 이 능력이 일상에서 은근히 발휘되고 있을 거예요. 체계적으로 훈련하면 훨씬 강력한 무기가 될 수 있어요.`
    : iq >= 100
    ? `${info.code} ${iq} — 평균 수준이에요. 지금도 충분히 작동하고 있지만, 이 지수를 높이는 훈련을 하면 다른 강한 특성들과 시너지를 낼 수 있어요.`
    : `${info.code} ${iq} — 현재는 상대적으로 낮은 편이에요. 하지만 걱정 마세요 — 다른 지수들이 이를 충분히 보완하고 있을 가능성이 높아요. 이 영역을 발달시키면 전체적인 균형이 잡혀요.`;

  // 지수별 관련 특성
  const relatedTraits = info.traits.map(k => TRAITS[k]).filter(Boolean);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:430,background:"#F8F8F4",borderRadius:"24px 24px 0 0",padding:"28px 20px 48px",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:"rgba(0,0,0,0.15)",borderRadius:2,margin:"0 auto 20px"}}/>

        {/* 헤더 */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:6}}>{info.icon}</div>
          <div style={{fontSize:32,fontWeight:700,color:info.color,lineHeight:1}}>{info.code} <span style={{fontSize:38}}>{iq}</span></div>
          <div style={{fontSize:12,color:"rgba(0,0,0,0.5)",marginTop:6}}>{info.eng} · <span style={{color:color,fontWeight:600}}>{label}</span></div>
        </div>

        {/* 바그래프 */}
        <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <div style={{position:"relative",height:10,background:"rgba(0,0,0,0.1)",borderRadius:99,overflow:"visible",marginBottom:24}}>
            <div style={{position:"absolute",left:`${avgPos}%`,top:-5,width:2,height:20,background:"rgba(0,0,0,0.25)",borderRadius:1,zIndex:2}}/>
            <div style={{position:"absolute",left:`${avgPos}%`,top:18,transform:"translateX(-50%)",fontSize:8,color:"rgba(0,0,0,0.4)",whiteSpace:"nowrap"}}>avg 100</div>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barPct}%`,background:`linear-gradient(90deg,rgba(${rgb},0.4),${info.color})`,borderRadius:99,boxShadow:`0 0 8px rgba(${rgb},0.4)`}}/>
            <div style={{position:"absolute",top:"50%",left:`${barPct}%`,transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:"50%",background:info.color,border:"3px solid #fff",zIndex:3,boxShadow:`0 2px 8px rgba(${rgb},0.5)`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {[60,85,100,115,130,"145+"].map(n=>(
              <span key={n} style={{fontSize:8,color:n===100?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.3)",fontWeight:n===100?700:400}}>{n}</span>
            ))}
          </div>
        </div>

        {/* 정의 */}
        <div style={{background:`rgba(${rgb},0.08)`,border:`1px solid rgba(${rgb},0.2)`,borderRadius:12,padding:"14px",marginBottom:10}}>
          <p style={{fontSize:10,color:info.color,letterSpacing:2,marginBottom:6,fontWeight:700}}>📖 정의</p>
          <p style={{fontSize:13,color:"#222",lineHeight:1.8,margin:0}}>{info.def}</p>
        </div>

        {/* 개인 분석 */}
        <div style={{background:"rgba(255,180,0,0.08)",border:"1px solid rgba(180,130,0,0.2)",borderRadius:12,padding:"14px",marginBottom:10}}>
          <p style={{fontSize:10,color:"#9A7200",letterSpacing:2,marginBottom:6,fontWeight:700}}>✦ 나의 {info.code} 분석</p>
          <p style={{fontSize:13,color:"#333",lineHeight:1.8,margin:0}}>{personalAnalysis}</p>
        </div>

        {/* 이 지수를 구성하는 특성들 */}
        <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:12,padding:"14px",marginBottom:10}}>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",letterSpacing:2,marginBottom:10,fontWeight:700}}>🧩 이 지수를 구성하는 특성</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {relatedTraits.map(t => {
              const traitRgb = hexToRgb(t.color);
              return (
                <div key={t.sub} style={{display:"flex",alignItems:"center",gap:10,padding:"8px",background:`rgba(${traitRgb},0.06)`,borderRadius:10,border:`1px solid rgba(${traitRgb},0.15)`}}>
                  <span style={{fontSize:20,flexShrink:0}}>{t.emoji}</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,fontWeight:700,color:t.color}}>{Object.keys(TRAITS).find(k=>TRAITS[k]===t)} </span>
                    <span style={{fontSize:11,color:"rgba(0,0,0,0.5)"}}>{t.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 향상 팁 */}
        <div style={{background:"rgba(0,180,100,0.07)",border:"1px solid rgba(0,150,80,0.2)",borderRadius:12,padding:"14px",marginBottom:20}}>
          <p style={{fontSize:10,color:"#006644",letterSpacing:2,marginBottom:6,fontWeight:700}}>💡 {info.code} 향상 팁</p>
          <p style={{fontSize:13,color:"#222",lineHeight:1.8,margin:0}}>
            {name==="논리추론" && "논리 퍼즐, 체스, 수학적 사고 훈련이 L.I 지수를 높여요. 주장할 때 근거를 3가지 이상 대는 습관도 효과적이에요."}
            {name==="패턴인식" && "다양한 분야의 책을 읽고 공통점을 찾는 연습이 P.R 지수를 높여요. 바둑, 체스, 데이터 분석 연습도 좋아요."}
            {name==="처리속도" && "타이머를 이용한 집중 훈련(포모도로)과 규칙적인 운동이 P.S 지수를 높여요. 충분한 수면도 처리속도에 직접적인 영향을 줘요."}
            {name==="창의지능" && "새로운 환경에 자신을 노출시키고, 예술 감상, 일기 쓰기, 즉흥적인 활동들이 C.I 지수를 높여요. 멍 때리는 시간도 창의력을 키워요."}
            {name==="감성지능" && "감정 일기 쓰기, 공감 대화 연습, 다양한 사람들과의 교류가 E.Q 지수를 높여요. 명상과 감정 어휘를 늘리는 것도 효과적이에요."}
          </p>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"16px",background:"rgba(0,0,0,0.06)",border:"1px solid rgba(0,0,0,0.1)",borderRadius:14,fontSize:14,color:"rgba(0,0,0,0.5)",cursor:"pointer",fontWeight:600}}>닫기</button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 특성 카드 (접힘/펼침)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function TraitCard({ code, pct, isTop5, isUnlocked, onPurchase }) {
  const [open, setOpen] = useState(false);
  const t = TRAITS[code];
  if(!t) return null;
  const p = pct[code]||0;
  const rgb = hexToRgb(t.color);
  const canRead = isTop5 || isUnlocked;

  return (
    <div style={{background:isTop5?`rgba(${rgb},0.07)`:'#f8f8f8',border:`1px solid rgba(${rgb},${isTop5?0.35:0.2})`,borderRadius:16,overflow:"hidden",marginBottom:10,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
      {/* 접힌 상태 */}
      <div onClick={()=>setOpen(v=>!v)} style={{padding:"14px",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:isTop5?30:22}}>{t.emoji}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                {/* 코드명 크게 */}
                <div style={{fontSize:isTop5?20:15,fontWeight:700,color:t.color,lineHeight:1}}>{code}</div>
                {/* 특성명 + sub 작게 */}
                <div style={{fontSize:10,color:"rgba(0,0,0,0.55)",marginTop:1}}>{t.name}</div>
                <div style={{fontSize:8,color:"rgba(0,0,0,0.35)",marginTop:1,lineHeight:1.2}}>{t.sub}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {!canRead && <span style={{fontSize:9,opacity:0.4}}>🔒</span>}
                <span style={{fontSize:isTop5?22:16,fontWeight:700,color:t.color}}>{p}%</span>
              </div>
            </div>
          </div>
        </div>
        {/* 바 */}
        <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:99,marginBottom:6}}>
          <div style={{height:"100%",width:`${p}%`,background:`linear-gradient(90deg,rgba(${rgb},0.5),${t.color})`,borderRadius:99}}/>
        </div>
        {/* 치트키 항상 표시 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:"#9A7200"}}>⚡ {t.cheat}</span>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>{open?"▲":"▼"}</span>
        </div>
      </div>

      {/* 펼친 상태 */}
      {open && (
        <div style={{padding:"0 14px 14px",borderTop:`1px solid rgba(${rgb},0.12)`}}>
          {canRead ? (
            <>
              {/* 정의 + 개인 풀이 */}
              <div style={{background:`rgba(${rgb},0.06)`,borderRadius:12,padding:"12px",marginTop:10,marginBottom:8}}>
                <p style={{fontSize:10,color:t.color,letterSpacing:2,marginBottom:6}}>🧠 뇌과학적 정의</p>
                <p style={{fontSize:13,color:"#C8BC9A",lineHeight:1.8,margin:0}}>{t.fullDesc||t.desc}</p>
              </div>
              {/* 초능력 발동 */}
              <div style={{background:"rgba(0,180,100,0.06)",border:"1px solid rgba(0,180,100,0.18)",borderRadius:12,padding:"10px",marginBottom:12}}>
                <p style={{fontSize:9,color:"#55EFC4",letterSpacing:2,marginBottom:4}}>✨ 초능력 발동 순간</p>
                <p style={{fontSize:12,color:"#C8BC9A",lineHeight:1.7,margin:0}}>{t.when}</p>
              </div>
              {/* 유명인 */}
              <div style={{background:"rgba(200,80,120,0.06)",border:"1px solid rgba(200,80,120,0.18)",borderRadius:12,padding:"10px",marginBottom:12}}>
                <p style={{fontSize:9,color:"#FD79A8",letterSpacing:2,marginBottom:4}}>🌟 비슷한 유명인</p>
                <p style={{fontSize:12,color:"#C8BC9A",margin:0}}>{t.famous}</p>
              </div>
              {/* 찰떡/상극 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <div style={{background:"rgba(85,239,196,0.07)",border:"1px solid rgba(85,239,196,0.2)",borderRadius:12,padding:"10px"}}>
                  <p style={{fontSize:9,color:"#55EFC4",letterSpacing:1,marginBottom:6}}>💚 찰떡 특성</p>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    {(t.good||[]).map(c=>TRAITS[c]&&(
                      <span key={c} style={{fontSize:10,color:"#55EFC4"}}>{TRAITS[c].emoji} <b>{c}</b> {TRAITS[c].name}</span>
                    ))}
                  </div>
                </div>
                <div style={{background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:12,padding:"10px"}}>
                  <p style={{fontSize:9,color:"#FF6B6B",letterSpacing:1,marginBottom:6}}>🔴 상극 특성</p>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    {(t.bad||[]).map(c=>TRAITS[c]&&(
                      <span key={c} style={{fontSize:10,color:"#FF6B6B"}}>{TRAITS[c].emoji} <b>{c}</b> {TRAITS[c].name}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* 굿즈 */}
              <div style={{background:"rgba(200,160,60,0.07)",border:"1px solid rgba(180,130,0,0.22)",borderRadius:12,padding:"10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:9,color:"#E8C87A",letterSpacing:1,marginBottom:3}}>🛍️ 이런 거 지녀봐요</p>
                  <p style={{fontSize:11,color:"rgba(232,200,122,0.8)",margin:0}}>{t.goods||"개운 굿즈 보기"}</p>
                </div>
                <span style={{fontSize:12,color:"rgba(232,200,122,0.5)"}}>→</span>
              </div>
            </>
          ) : (
            <div style={{background:"rgba(255,180,0,0.06)",border:"1px solid rgba(180,130,0,0.2)",borderRadius:12,padding:"20px",marginTop:10,textAlign:"center"}}>
              <p style={{fontSize:24,margin:"0 0 6px"}}>🔒</p>
              <p style={{fontSize:13,fontWeight:600,color:"#B8860B",margin:"0 0 4px"}}>{code} 전체 분석</p>
              <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",lineHeight:1.6,margin:"0 0 12px"}}>
                뇌과학 정의 · 치트키 활용법<br/>찰떡/상극 특성 · 개운 굿즈
              </p>
              <button onClick={e=>{e.stopPropagation();onPurchase(code);}} style={{padding:"11px 24px",background:"#D4AF37",border:"none",borderRadius:10,fontSize:13,fontWeight:700,color:"#1A3C32",cursor:"pointer"}}>
                380원으로 전체 보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 메인
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ANSWER_LABELS = ["전혀 아니다","가끔 그렇다","보통이다","자주 그렇다","매우 그렇다"];

export default function 뇌특성검사({onClose,addHistory,selectedPerson,isLoggedIn,onLoginRequest,onRequestPerson,cart,setCart,onGoShop,onOpenService,preloadResult=null,forceIntro=false,helpers={}}={}) {
  // preloadResult 있으면 result로 바로 (기록소 재열람)
  // v645: results 객체 자체 우선 (정확한 %). 없으면 top5 코드로 폴백 재구성
  const _preResults=preloadResult?.results||(preloadResult?.top5?Object.fromEntries(preloadResult.top5.map((c,i)=>[c,80-i*5])):null);
  const _preIndices=preloadResult?.indices||null;
  // 흐름 v281: intro → (인물등록) → test → preQ(focus 1개) → pay → 결제 → loading → result (사용자 요청 — 매몰비용 극대화)
  const [screen, setScreen] = useState(preloadResult?"result":(forceIntro?"intro":(selectedPerson?"test":"intro")));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(60).fill(null));
  const [results, setResults] = useState(_preResults);
  const [indices, setIndices] = useState(_preIndices);
  const [unlockedCodes, setUnlockedCodes] = useState(new Set(preloadResult?.unlockedCodes||[]));
  const [showWeak, setShowWeak] = useState(false);
  const [showBrainCollection, setShowBrainCollection] = useState(false);
  const [indexModal, setIndexModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPayDone, setShowPayDone] = useState(false);
  const [preFocus, setPreFocus] = useState(null); // v262: 사전질문 focus 1개
  const [loadPct, setLoadPct] = useState(0);
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const historyDoneRef = useRef(false);

  const personName = selectedPerson?.name || "나";
  const progress = Math.round((current/QUESTIONS.length)*100);

  // intro → 인물 선택/테스트 라우팅 (v281)
  function startTest(){
    if(!isLoggedIn&&onLoginRequest){onLoginRequest();return;}
    if(!selectedPerson&&onRequestPerson){onRequestPerson({id:"psych",icon:"🧠",name:"뇌과학 분석",desc:"",price:"4,800원"});if(typeof onClose==="function")onClose();return;}
    setScreen("test"); // v281: 테스트 먼저, 그 다음 사전질문
  }
  function pay(){setLoading(true);setTimeout(()=>{setLoading(false);setShowPayDone(true);},1600);}
  function onPayDone(){setShowPayDone(false);setScreen("loading");} // 결제 후 분석중 → result

  function handleAnswer(val) {
    const na=[...answers]; na[current]=val; setAnswers(na);
    if(current+1>=QUESTIONS.length) {
      const r=calcResults(na); const idx=calcIndex(r);
      setResults(r); setIndices(idx);
      setScreen("preQ"); // v281: 테스트 끝 → 사전질문 (그 다음 결제)
    } else { setCurrent(c=>c+1); }
  }

  // v262: 분석중(loading) 화면 — 게이지 + history 1회 호출 + result 진입 (v264: 3.5초로 통일)
  useEffect(()=>{
    if(screen!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);let pct=0;
    const iv=setInterval(()=>{
      pct=Math.min(100,pct+Math.random()*1.4+0.8);setLoadPct(Math.floor(pct));
      if(Math.random()>0.7)setLoadMsgIdx(i=>(i+1)%4);
      if(pct>=100){
        clearInterval(iv);
        setTimeout(()=>{
          if(!historyDoneRef.current&&results){
            historyDoneRef.current=true;
            try{
              const sorted=TRAIT_KEYS.map(k=>({code:k,pct:results[k]})).sort((a,b)=>b.pct-a.pct);
              const top=sorted[0]; const topT=TRAITS[top.code];
              addHistory?.({icon:"🧠",name:"뇌과학 분석",svcId:"psych",person:personName,date:new Date().toLocaleDateString("ko-KR"),
                result:`${topT?.emoji||"🧠"} ${topT?.name||""} ${top.pct}%`,
                // v645: 기록소 재열람 시 완전 복원 — results(정확한 % 모두), indices, unlockedCodes 저장
                resultType:{top_code:top.code,top_name:topT?.name,top_pct:top.pct,top5:sorted.slice(0,5).map(t=>t.code),focus:preFocus,
                  results,indices,unlockedCodes:Array.from(unlockedCodes||[]),
                  _birth:selectedPerson?.birth,_time:selectedPerson?.time,
                  _testDate:new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})},
                ctx:{focus:preFocus}});
            }catch{}
          }
          setScreen("result");
        },300);
      }
    },80);
    return()=>clearInterval(iv);
  },[screen,results,personName,addHistory,preFocus]);

  function handlePurchase(code) {
    alert(`${TRAITS[code]?.name}(${code}) 전체 분석\n380원 결제로 이동합니다`);
    setUnlockedCodes(prev=>new Set([...prev,code]));
  }

  function restart() {
    setScreen("intro"); setCurrent(0); setAnswers(Array(60).fill(null));
    setResults(null); setIndices(null); setUnlockedCodes(new Set()); setShowWeak(false);
  }

  const DARK_GREEN = "transparent";
  // 글씨체: 다른 결과팝업과 동일한 sans-serif (Pretendard) — 제목·결과카드 헤더만 Noto Serif KR 유지
  const wrap={fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif",color:"#F0EAD6",maxWidth:430,margin:"0 auto",boxSizing:"border-box"};
  const wrapWhite={fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif",color:"#1a1a1a",maxWidth:430,margin:"0 auto",boxSizing:"border-box"};

  // ── INTRO ── v362: 뇌과학 키컬러 = #D4AF37 (다크 퍼플) — 기질도(블루)·수비학(레드)과 차별화
  // v596: 다른 화면(test/pay/loading)과 동일하게 .ov+.md 래퍼로 감싸 휘리릭 애니메이션 통일
  if(screen==="intro") return (
    <div className="ov"><div className="md"><div className="hd"/>
      <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
        <button onClick={()=>{if(typeof onClose==="function")onClose();}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      {/* v721: 큰 테두리 컨테이너 — 뇌과학 골드 통일 (v650이 sed로 시작색만 바꿔서 잔존했던 보라 rgba(85,65,120) → 골드 rgba(212,175,55)) */}
      <div style={{background:"rgba(0,0,0,0.2)",borderRadius:16,padding:"32px 20px",border:"2px solid rgba(212,175,55,0.55)",textAlign:"center",marginBottom:12}}>
      <div style={{fontSize:10,letterSpacing:6,color:"#D4AF37",marginBottom:14}}>BRAIN TRAITS LAB</div>
      <h1 style={{fontFamily:"'Noto Serif KR','Batang',serif",fontSize:48,fontWeight:900,margin:"0 0 18px",letterSpacing:2,textAlign:"center",color:"#D4AF37",lineHeight:1.3,textShadow:"0 0 18px rgba(212,175,55,0.55)"}}>뇌과학 분석</h1>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",letterSpacing:1,marginBottom:22,textAlign:"center",lineHeight:1.9}}>당신의 뇌는 고장난 게 아니라<br/>다르게 설계됐어요</p>

      {/* 미리보기 뇌구조 — 박스/글 제거, 이미지만 */}
      <div style={{width:"100%",marginBottom:14}}>
        <BrainSVG topTraits={[]}/>
      </div>

      {/* ✦ 60문항 / 40특성 / 전부결과 — 기질도 4축 그리드와 동일 무드 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
        {[{n:"60",l:"문항",sub:"자가 검사"},{n:"40",l:"특성",sub:"한 번에 측정"},{n:"전부",l:"결과",sub:"% 수치 공개"}].map(x=>(
          <div key={x.l} style={{background:"rgba(0,0,0,0.35)",border:"1px solid rgba(212,175,55,0.5)",borderRadius:12,padding:"14px 4px",textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#D4AF37",marginBottom:3,fontFamily:"'Noto Serif KR','Batang',serif",lineHeight:1.2}}>{x.n}</div>
            <div style={{fontSize:11,fontWeight:800,color:"var(--white)",marginBottom:2}}>{x.l}</div>
            <div style={{fontSize:9,color:"var(--mist)",lineHeight:1.4}}>{x.sub}</div>
          </div>
        ))}
      </div>

      {/* ✦ 측정하는 40가지 뇌 특성 — 기질도 6대 분석과 동일 무드 */}
      <div style={{textAlign:"left",marginBottom:14}}>
        {[
          {icon:"🧬",title:"신경다양성 8종",desc:"ADHD · HSP · 공감각 · 자폐스펙트럼 등"},
          {icon:"🌀",title:"사고패턴 9종",desc:"과잉사고 · 패턴해독 · 직관 등"},
          {icon:"❤️",title:"감정공감 9종",desc:"공감과부하 · 정서강도 등"},
          {icon:"⚡",title:"에너지·행동 8종",desc:"경조증 · 충동성 등"},
          {icon:"👁️",title:"감각·신체 4종",desc:"감각 예민도 등"},
          {icon:"✨",title:"특수능력 2+종",desc:"히든 트레잇 발견"},
        ].map(f=>(
          <div key={f.title} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
            <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{f.icon}</span>
            <div><div style={{fontSize:12,fontWeight:700,color:"#D4AF37"}}>{f.title}</div><div style={{fontSize:10,color:"var(--mist)",lineHeight:1.5}}>{f.desc}</div></div>
          </div>
        ))}
      </div>

      {/* ✦ 결과 안내 — 가독성 강화 */}
      <div style={{textAlign:"left",fontSize:11,color:"var(--mist)",lineHeight:1.85}}>
        <div style={{marginBottom:4}}>📊 결과는 <span style={{color:"var(--white)",fontWeight:700}}>% 수치</span>로 전부 공개</div>
        <div style={{marginBottom:4}}>🎯 강한 특성에는 <span style={{color:"#54A0FF",fontWeight:700}}>치트키</span>와 <span style={{color:"#55EFC4",fontWeight:700}}>초능력 발동 순간</span> 풀이</div>
        <div>🔓 상위 5개 풀이 포함 · 나머지 개당 <span style={{color:"var(--white)",fontWeight:700}}>380원</span></div>
      </div>

      </div>{/* 테두리 컨테이너 끝 */}

      {/* 인트로에서는 주의 박스 제거 — pay 화면으로 이동 */}
      <button className="btn" onClick={startTest} style={{background:"#D4AF37",color:"#1A3C32",boxShadow:"0 4px 16px rgba(212,175,55,0.3)",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>뇌 특성 검사로 분석하기 (4,800원) →</button>
      {/* 디스클레이머 — 결제버튼과 닫기버튼 사이 (기질도 동일 위치) */}
      <div style={{fontSize:10,color:"rgba(168,196,184,0.5)",textAlign:"center",margin:"10px 0 0",lineHeight:1.6}}>이 테스트는 성향 탐색용이며 의료적 진단이 아닙니다</div>
      <button className="btn btn-g" onClick={()=>{if(typeof onClose==="function")onClose();}} style={{marginTop:10,fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>닫기</button>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div></div>
  );

  // ── 결제 화면 (기질도 패턴) ──
  if(screen==="pay") return(
    <div className="ov"><div className="md"><div className="hd"/>
      <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
        <button onClick={()=>{if(typeof onClose==="function")onClose();}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>
      <div className="mt">🧠 뇌과학 분석</div>
      <div className="ms">1회 분석 4,800원 · 테스트 완료! 결제하면 즉시 결과 확인</div>
      <div style={{background:"var(--ink3)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center",border:"1px solid rgba(212,175,55,0.4)"}}>
        <div style={{fontSize:13,color:"var(--mist)",lineHeight:1.7}}>✓ 60문항 자가 검사 + 사전질문 완료<br/>= 40가지 뇌 특성 + 6대 지수 풀 리포트</div>
      </div>
      {/* 결제 수단 선택 — 다른 모달과 동일한 PayStepComp */}
      {helpers?.PayStepComp
        ?<helpers.PayStepComp price="4,800원" onPay={pay} onBack={()=>setScreen("preQ")} loading={loading} svcId="psych"/>
        :<>{loading?<div style={{display:"flex",gap:5,justifyContent:"center",padding:16}}><div className="dot"/><div className="dot"/><div className="dot"/></div>:
          <button className="btn" onClick={pay} style={{background:"#D4AF37",color:"#1A3C32",boxShadow:"0 4px 16px rgba(212,175,55,0.3)"}}>4,800원 결제하고 시작하기 →</button>}
        <button className="btn btn-g" onClick={()=>{if(typeof onClose==="function")onClose();}}>닫기</button></>}
      {/* 결제 완료 팝업 */}
      {showPayDone&&<div className="pay-done-ov">
        <div className="pay-done-md"><div className="hd"/>
          <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
            <button onClick={onPayDone} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {/* v652: 테스트 모드 시뮬레이션 명시 — 실제 PortOne 연동 시 원복 */}
          <div className="pdc-icon">🧪</div>
          <div className="pdc-title">테스트 모드 — 결제 시뮬레이션</div>
          <div className="pdc-sub">실제 결제는 진행되지 않았어요.<br/>{personName}님의 뇌 특성 결과를 확인해보세요!</div>
          <button className="btn btn-p" onClick={onPayDone} style={{marginTop:16}}>결과 보기 →</button>
        </div>
      </div>}
    </div></div>
  );

  // ── 사전질문 (v262: focus 1개) ──
  if(screen==="preQ") {
    const FOCUS_OPTS=[
      {e:"🧠",l:"인지·재능 강점"},
      {e:"💼",l:"일·커리어 적합성"},
      {e:"❤️",l:"연애·이성 관계"},
      {e:"👨‍👩‍👧",l:"가족·육아 (배우자·자녀·부모)"},
      {e:"🤝",l:"친구·동료·인간관계"},
      {e:"💰",l:"재물·돈에 대한 태도"},
      {e:"🌿",l:"스트레스·번아웃 회복법"},
      {e:"🌟",l:"전체 다 균형있게"},
    ];
    return(
      <div className="ov"><div className="md"><div className="hd"/>
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
          <button onClick={()=>{if(typeof onClose==="function")onClose();}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* v582: 사이트 표준 (내관상보기 패턴) — 상단 콘텐츠 제목 추가 */}
        <div className="mt">🧠 {personName}님의 뇌 분석</div>
        <div className="ms">1/1 · 더 정확한 분석을 위해</div>
        {/* v758: 사전질문 표준 매치 */}
        <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:99,marginBottom:14,overflow:"hidden"}}>
          <div style={{height:"100%",width:"100%",background:"var(--gold)",transition:"width .3s"}}/>
        </div>
        <div style={{fontSize:11,color:"var(--mist)",marginBottom:12,lineHeight:1.6,padding:"8px 11px",background:"rgba(212,175,55,0.06)",borderRadius:8,border:"1px solid rgba(212,175,55,0.12)"}}>💡 건너뛰기 가능 — 전체 균등 분석</div>
        <div style={{fontSize:13,fontWeight:600,color:"var(--white)",marginBottom:12,lineHeight:1.5}}>🧠 뇌 분석에서 가장 알고 싶은 건?</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {FOCUS_OPTS.map(opt=>{
            const sel=preFocus===opt.l;
            return <button key={opt.l} onClick={()=>setPreFocus(opt.l)} style={{padding:"14px 16px",background:sel?"rgba(212,175,55,0.12)":"var(--ink3)",border:sel?"1.5px solid #D4AF37":"1.5px solid rgba(255,255,255,0.07)",borderRadius:14,fontSize:13,color:sel?"#D4AF37":"var(--mist)",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
              <span style={{fontSize:18}}>{opt.e}</span>{opt.l}
            </button>;
          })}
        </div>
        {/* v298: 자동 진입 제거 — 다음 버튼으로 진행 */}
        {preFocus&&preFocus!=="skip"&&(
          <button className="btn btn-p" style={{marginTop:12}} onClick={()=>setScreen("pay")}>다음 →</button>
        )}
        {!preFocus&&(
          <button className="btn btn-g" style={{marginTop:12,fontSize:12}} onClick={()=>{setPreFocus("skip");setScreen("pay");}}>건너뛰기</button>
        )}
        {/* v590: 이전 = test 마지막 문항 (test → 사전질문 → 결제 흐름) */}
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <button onClick={()=>setScreen("test")} className="btn btn-g" style={{flex:1,marginTop:0,fontSize:12}}>← 이전</button>
          <button onClick={()=>{if(typeof onClose==="function")onClose();}} className="btn btn-g" style={{flex:1,marginTop:0}}>닫기</button>
        </div>
      </div></div>
    );
  }

  // ── 분석중 (v262) ──
  if(screen==="loading") {
    const msgs=["뇌 특성 매칭 중... 🧠","6대 지수 산출 중... 📊","강점/약점 분석... ✨","결과 정리 중... 🌟"];
    return(
      <div className="ov"><div className="md"><div className="hd"/>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:64,marginBottom:18,filter:"drop-shadow(0 6px 18px rgba(212,175,55,0.4))"}}>🧠</div>
          <div style={{fontSize:18,fontWeight:900,color:"#D4AF37",fontFamily:"'Noto Serif KR',serif",marginBottom:8}}>{personName}님의 뇌 분석 중</div>
          <div style={{fontSize:12,color:"var(--mist)",marginBottom:22,minHeight:18}}>{msgs[loadMsgIdx]||msgs[0]}</div>
          <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:6,marginBottom:8,overflow:"hidden",border:"1px solid rgba(212,175,55,0.2)"}}>
            <div style={{height:"100%",width:`${loadPct}%`,background:"#D4AF37",borderRadius:6,transition:"width 0.2s"}}/>
          </div>
          <div style={{fontSize:11,color:"#D4AF37",fontWeight:700}}>{loadPct}%</div>
          <div style={{fontSize:9,color:"rgba(168,196,184,0.5)",marginTop:12,textAlign:"center",letterSpacing:0.3}}>✨ 화면을 나가도 분석은 계속됩니다 · 결과는 기록소에 저장돼요</div>
        </div>
      </div></div>
    );
  }

  // ── 테스트 ──
  if(screen==="test") {
    const q=QUESTIONS[current];
    return (
      <div className="ov"><div className="md" style={{maxHeight:"100dvh",paddingBottom:20}}>
        {/* 결제 후 테스트 진행 화면 — ✕는 비상 탈출용으로 유지, 하단 닫기 버튼만 제거 */}
        <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-8,zIndex:5}}>
          <button onClick={()=>{if(typeof onClose==="function")onClose();}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"0 0 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:10,color:"#D4AF37",letterSpacing:2}}>🧠 뇌 특성 검사 · {personName}</span>
            <span style={{fontSize:11,color:"var(--mist)"}}>{current+1}/60</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#D4AF37",borderRadius:4,transition:"width .5s"}}/>
          </div>
        </div>
        <div style={{padding:"8px 0"}}>
          <div style={{fontSize:11,color:"var(--mist)",marginBottom:4}}>Q.{current+1}</div>
          <div style={{fontSize:17,lineHeight:1.75,fontWeight:600,marginBottom:20,fontFamily:"'Noto Serif KR',serif",color:"var(--white)"}}>{q.text}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {ANSWER_LABELS.map((label,idx)=>{
              const isSel=answers[current]===idx;
              return(
                <button key={idx} onClick={()=>handleAnswer(idx)} style={{padding:"18px 16px",background:isSel?"rgba(212,175,55,0.12)":"var(--ink3)",border:isSel?"1.5px solid #D4AF37":"1.5px solid rgba(255,255,255,0.07)",borderRadius:14,fontSize:14,color:isSel?"#D4AF37":"var(--mist)",cursor:"pointer",textAlign:"left",lineHeight:1.6,fontFamily:"inherit",transition:"all .2s",transform:isSel?"scale(0.98)":"scale(1)"}}>
                  {label}
                </button>
              );
            })}
          </div>
          {/* v596: 흐름이 인물 → 테스트 → 사전질문이므로 1번 문항 이전은 인물 변경 */}
          <button className="btn btn-g" style={{marginTop:14}} onClick={()=>{
            if(current>0){setCurrent(c=>c-1);return;}
            if(onRequestPerson){onRequestPerson({id:"psych",icon:"🧠",name:"뇌과학 분석",desc:"",price:"4,800원"});if(typeof onClose==="function")onClose();return;}
            setScreen("intro");
          }}>← 이전</button>
        </div>
      </div></div>
    );
  }

  // ── 결과 ──
  if(screen==="result"&&results&&indices) {
    const sorted=TRAIT_KEYS.map(k=>({code:k,pct:results[k]})).sort((a,b)=>b.pct-a.pct);
    const top5=sorted.slice(0,5);
    const top5codes=new Set(top5.map(t=>t.code));
    const strong=sorted.filter(t=>t.pct>=65&&!top5codes.has(t.code));
    const mid=sorted.filter(t=>t.pct>=45&&t.pct<65&&!top5codes.has(t.code));
    const weak=sorted.filter(t=>t.pct<45&&!top5codes.has(t.code));

    const topT=TRAITS[sorted[0].code];
    const topIdxEntry=Object.entries(indices).sort((a,b)=>b[1]-a[1])[0];
    const topIdxInfo=INDEX_MAP[topIdxEntry[0]];
    const topIQ=pctToIQ(topIdxEntry[1]);
    const topIQLabel = iqToLabel(topIQ).label;
    const secondT = TRAITS[sorted[1].code];
    const thirdT = TRAITS[sorted[2].code];
    const lowestIdxEntry = Object.entries(indices).sort((a,b)=>a[1]-b[1])[0];
    const lowestIdxInfo = INDEX_MAP[lowestIdxEntry[0]];
    const lowestIQ = pctToIQ(lowestIdxEntry[1]);
    const finalAnalysis = [
      `${topT.emoji} 당신의 뇌에서 가장 강하게 작동하는 특성은 ${topT.name}(${sorted[0].pct}%)이에요.`,
      `${topT.desc} 이 특성이 높다는 건 단순한 성향이 아니라 뇌의 신경 회로가 실제로 다르게 배선된 거예요.`,
      `두 번째로 두드러지는 ${secondT?.name||""}(${sorted[1].pct}%)와 세 번째 ${thirdT?.name||""}(${sorted[2].pct}%)가 함께 작동할 때, 당신은 ${topT.when} 순간들을 경험하고 있을 거예요.`,
      `5가지 지수 중 ${topIdxInfo.eng}(${topIdxInfo.code})가 ${topIQ}로 가장 높고(${topIQLabel}), ${lowestIdxInfo.eng}(${lowestIdxInfo.code})는 ${lowestIQ}로 상대적으로 낮은 편이에요. 이 차이가 바로 당신이 어떤 상황에서 번뜩이고 어떤 상황에서 소진되는지를 설명해줘요.`,
      `상위 5개 — ${top5.map(t=>t.code).join(" · ")} — 의 조합은 전 세계 인구 중 극소수만 가진 드문 패턴이에요. 이 조합을 가진 사람들은 대개 평범한 길을 걷지 않아요.`
    ].join(" ");

    // 전체 찰떡/상극 (top5 기준)
    const allGood=[...new Set(top5.flatMap(t=>(TRAITS[t.code]?.good||[])))].filter(c=>!top5codes.has(c));
    const allBad=[...new Set(top5.flatMap(t=>(TRAITS[t.code]?.bad||[])))].filter(c=>!top5codes.has(c));

    return (
      <div className="ov"><div className="md" style={{padding:"0",maxHeight:"92dvh",overflowY:"auto"}}>
        <div style={{position:"sticky",top:0,zIndex:5,display:"flex",justifyContent:"flex-end",padding:"10px 12px 0"}}>
          <button onClick={()=>{if(typeof onClose==="function")onClose();}} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      <div style={{...wrapWhite,padding:"24px 20px 80px"}}>

        {/* ═══ PAGE 1-5 통합 캡처 래퍼 ═══ */}
        <div id="psych-capture" style={{display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>

        {/* ══ PAGE 1: 리포트 카드 (메인 캡처) ══ */}
        <div style={{background:"#fff",border:"1px solid rgba(85,65,120,0.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <div style={{padding:"10px 16px 0"}}>
          {/* v358: 헤더 정리 — PAGE 라벨·"고장난 게 아니라" 부제 삭제 + 제목 personName 호명 */}
          <p style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0",lineHeight:1.5}}>🔮 천기(天機) 오리지널 | 뇌과학 40가지 특성 분석 리포트</p>
          <p style={{fontSize:18,fontWeight:900,color:"#1A3C32",textAlign:"center",marginBottom:8,fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>🧠 {personName}님의 특별한 뇌 특성</p>
          {/* v317: 검사 정보 — 생년월일 + 진행 날짜시각 */}
          <div style={{textAlign:"center",fontSize:10,color:"#888",fontWeight:600,marginBottom:14,lineHeight:1.6}}>
            {selectedPerson?.birth&&<div>👤 {personName} : {selectedPerson.birth}{selectedPerson?.time&&selectedPerson.time!=="모름"?` · ${selectedPerson.time}생`:"생"}{selectedPerson?.calendar?` · ${selectedPerson.calendar}`:""}{selectedPerson?.gender?` · ${selectedPerson.gender}`:""}</div>}
            <div style={{color:"#aaa"}}>🔍 {preloadResult?._testDate||new Date().toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})} 분석</div>
          </div>

          {/* ① 뇌구조 — 전체 너비 */}
          <div style={{marginBottom:14}}>
            <BrainSVG topTraits={sorted.slice(0,5)}/>
          </div>

          {/* ② 5가지 뇌지수 | 가장 높은 특성 5가지 (2열) */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {/* 좌: 뇌지수 */}
            <div>
              <p style={{fontSize:12,fontWeight:800,color:"#1A3C32",letterSpacing:1,marginBottom:4}}>✦ 5가지 뇌지수</p>
              <p style={{fontSize:9,color:"#444",marginBottom:8,lineHeight:1.7}}>평균 100 · 115 ↑ 상위 16% · 130 ↑ 상위 2%</p>
              {/* v662: 뇌지수 옆에 한글 풀이 (괄호) 추가 — L.I (논리적 추론) 등 */}
              {Object.entries(INDEX_MAP).map(([name,info])=>{
                const iq=pctToIQ(indices[name]||50);
                const rgb=hexToRgb(info.color);
                const barW=Math.max(8,Math.min(100,((iq-60)/85)*100));
                return(
                  <div key={name} onClick={()=>setIndexModal(name)} style={{marginBottom:8,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                      <span style={{fontSize:11,fontWeight:800,color:info.color}}>{info.code} <span style={{fontSize:9,color:"#666",fontWeight:600}}>({name})</span></span>
                      <span style={{fontSize:14,fontWeight:800,color:iq>=110?"#B8860B":"#1A3C32"}}>{iq}</span>
                    </div>
                    <div style={{height:6,background:"#eee",borderRadius:99}}>
                      <div style={{height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,rgba(${rgb},0.4),${info.color})`,borderRadius:99}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* 우: 가장 높은 특성 5가지 */}
            <div>
              <p style={{fontSize:12,fontWeight:800,color:"#1A3C32",letterSpacing:1,marginBottom:4}}>✦ 가장 높은 특성</p>
              <p style={{fontSize:9,color:"#444",marginBottom:8,lineHeight:1.7}}>상위 5개 · 나머지는 아래서 확인</p>
              {/* v662: 특성 코드 옆에 한글명 (괄호) 추가 — PFT (완벽추구형) 등 */}
              {top5.map(({code,pct:p})=>{
                const t=TRAITS[code]; if(!t) return null;
                const rgb=hexToRgb(t.color);
                return(
                  <div key={code} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                      <span style={{fontSize:11,fontWeight:800,color:t.color}}>{code} <span style={{fontSize:9,color:"#666",fontWeight:600}}>({(t.name||"").replace(/형$/,"")}형)</span></span>
                      <span style={{fontSize:14,fontWeight:800,color:"#1A3C32"}}>{p}%</span>
                    </div>
                    <div style={{height:6,background:"#eee",borderRadius:99}}>
                      <div style={{height:"100%",width:`${p}%`,background:`linear-gradient(90deg,rgba(${rgb},0.4),${t.color})`,borderRadius:99}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ③ 최종 분석 */}
          <div style={{background:"#f5f0fa",border:"1px solid rgba(85,65,120,0.35)",borderRadius:12,padding:"16px",marginBottom:12}}>
            <p style={{fontSize:11,color:"#D4AF37",letterSpacing:2,marginBottom:10,fontWeight:800}}>✦ 최종 분석</p>
            <p style={{fontSize:13,color:"#222",lineHeight:1.95,margin:0}}>{finalAnalysis}</p>
          </div>

          {/* ④ 찰떡 / 상극 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"#f0fdf4",border:"1px solid rgba(46,125,50,0.25)",borderRadius:12,padding:"12px"}}>
              <p style={{fontSize:10,fontWeight:800,color:"#2E7D32",letterSpacing:1,marginBottom:8}}>💚 최종 찰떡</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {allGood.slice(0,4).map(c=>TRAITS[c]&&(
                  <span key={c} style={{fontSize:11,color:"#1A3C32",fontWeight:600}}>{TRAITS[c].emoji} <b style={{color:"#2E7D32"}}>{c}</b> <span style={{fontSize:10,color:"#555"}}>{TRAITS[c].name}</span></span>
                ))}
              </div>
            </div>
            <div style={{background:"#fef5f5",border:"1px solid rgba(220,53,69,0.25)",borderRadius:12,padding:"12px"}}>
              <p style={{fontSize:10,fontWeight:800,color:"#C62828",letterSpacing:1,marginBottom:8}}>🔴 최종 상극</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {allBad.slice(0,4).map(c=>TRAITS[c]&&(
                  <span key={c} style={{fontSize:11,color:"#1A3C32",fontWeight:600}}>{TRAITS[c].emoji} <b style={{color:"#C62828"}}>{c}</b> <span style={{fontSize:10,color:"#555"}}>{TRAITS[c].name}</span></span>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 1 푸터 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,marginLeft:-16,marginRight:-16,marginBottom:0,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,gap:6,flexWrap:"wrap",borderTop:"1px solid #f0f0f0"}}>
            {/* v662: 해시태그 통일 — 모든 페이지 동일 + ~형 일관 */}
            <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
          </div>
        </div>

        {/* ══ PAGE 2: 지수 상세 바그래프 ══ */}
        <div style={{background:"#fff",border:"1px solid rgba(85,65,120,0.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",color:"#333"}}>
          <div style={{padding:"10px 16px 0"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 뇌과학 40가지 특성</div>
            <div style={{fontSize:11,color:"#D4AF37",letterSpacing:2,fontWeight:800,marginTop:6}}>PAGE 2 · 뇌 지수 상세 분석</div>
          </div>
          <p style={{fontSize:18,fontWeight:900,color:"#1A3C32",letterSpacing:1,marginBottom:12,fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35}}>📊 뇌 지수 상세 분석</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {Object.entries(INDEX_MAP).map(([name,info])=>{
              const iq=pctToIQ(indices[name]||50);
              const {label}=iqToLabel(iq);
              const rgb=hexToRgb(info.color);
              const barPct=Math.max(0,Math.min(100,((iq-60)/85)*100));
              const avgPos=((100-60)/85)*100;
              return (
                <div key={name} onClick={()=>setIndexModal(name)} style={{background:"#fff",border:`2px solid rgba(${rgb},0.35)`,borderRadius:14,padding:"14px 16px",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <span style={{fontSize:16}}>{info.icon}</span>
                        <span style={{fontSize:14,fontWeight:800,color:"#1A3C32"}}>{name}</span>
                        <span style={{fontSize:10,color:"#888"}}>{info.eng}</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:info.color,background:`rgba(${rgb},0.12)`,padding:"3px 10px",borderRadius:12,border:`1px solid rgba(${rgb},0.3)`}}>{info.code} · {label}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:28,fontWeight:900,color:info.color,lineHeight:1}}>{iq}</div>
                      <div style={{fontSize:9,color:"#888",marginTop:2}}>평균 100</div>
                    </div>
                  </div>
                  <div style={{position:"relative",height:10,background:"#eee",borderRadius:99,overflow:"visible"}}>
                    <div style={{position:"absolute",left:`${avgPos}%`,top:-4,width:2,height:18,background:"rgba(0,0,0,0.35)",borderRadius:1,zIndex:2}}/>
                    <div style={{position:"absolute",left:`${avgPos}%`,top:16,transform:"translateX(-50%)",fontSize:8,color:"#666",fontWeight:600}}>avg</div>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barPct}%`,background:`linear-gradient(90deg,rgba(${rgb},0.3),${info.color})`,borderRadius:99,boxShadow:`0 0 8px rgba(${rgb},0.4)`}}/>
                    <div style={{position:"absolute",top:"50%",left:`${barPct}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:info.color,border:"2px solid #fff",zIndex:3,boxShadow:`0 2px 6px rgba(${rgb},0.5)`}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:22}}>
                    {[60,85,100,115,130,"145+"].map(n=><span key={n} style={{fontSize:8,color:n===100?"#1A3C32":"#888",fontWeight:n===100?700:500}}>{n}</span>)}
                  </div>
                  <p style={{fontSize:10,color:"#888",margin:"8px 0 0",textAlign:"right",fontWeight:600}}>탭하면 상세 분석 →</p>
                </div>
              );
            })}
          </div>
          {/* PAGE 2 푸터 */}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,marginLeft:-16,marginRight:-16,marginBottom:0,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,gap:6,flexWrap:"wrap",borderTop:"1px solid #f0f0f0"}}>
            <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
          </div>
        </div>

        {/* ══ PAGE 3: 강한 특성 TOP 5 (화이트카드 통일) ══ */}
        <div style={{background:"#fff",border:"1px solid rgba(85,65,120,0.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",color:"#333"}}>
          <div style={{padding:"10px 16px 0"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 뇌과학 40가지 특성</div>
            <div style={{fontSize:11,color:"#D4AF37",letterSpacing:2,fontWeight:800,marginTop:6}}>PAGE 3 · 강한 특성 TOP 5</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
            <span style={{fontSize:16,color:"#1A3C32",fontWeight:900,letterSpacing:1,fontFamily:"'Noto Serif KR',serif"}}>🔓 강한 특성 TOP 5</span>
            <span style={{fontSize:10,color:"#444",fontWeight:600}}>풀이 포함</span>
          </div>
          {top5.map(({code})=>(
            <TraitCard key={code} code={code} pct={results} isTop5={true} isUnlocked={true} onPurchase={handlePurchase}/>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,marginLeft:-16,marginRight:-16,marginBottom:0,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,gap:6,flexWrap:"wrap",borderTop:"1px solid #f0f0f0"}}>
            <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
          </div>
        </div>

        {/* ══ PAGE 4: 강한 특성 + 있는 특성 (탭 → 추가 결제) ══ */}
        {(strong.length>0||mid.length>0)&&(
          <div style={{background:"#fff",border:"1px solid rgba(85,65,120,0.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",color:"#333"}}>
            <div style={{padding:"10px 16px 0"}}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 뇌과학 40가지 특성</div>
              <div style={{fontSize:11,color:"#D4AF37",letterSpacing:2,fontWeight:800,marginTop:6}}>PAGE 4 · 강한·있는 특성 (잠금)</div>
            </div>
            {strong.length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                  <span style={{fontSize:14,color:"#1A3C32",fontWeight:900,letterSpacing:1,fontFamily:"'Noto Serif KR',serif"}}>⚡ 강한 특성</span>
                  <span style={{fontSize:10,color:"#D4AF37",background:"rgba(85,65,120,0.12)",padding:"3px 9px",borderRadius:12,fontWeight:700,border:"1px solid rgba(85,65,120,0.3)"}}>탭 → 380원</span>
                </div>
                {strong.map(({code})=>(
                  <TraitCard key={code} code={code} pct={results} isTop5={false} isUnlocked={unlockedCodes.has(code)} onPurchase={handlePurchase}/>
                ))}
              </div>
            )}
            {mid.length>0&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                  <span style={{fontSize:14,color:"#1A3C32",fontWeight:900,letterSpacing:1,fontFamily:"'Noto Serif KR',serif"}}>🔶 있는 특성</span>
                  <span style={{fontSize:10,color:"#D4AF37",background:"rgba(85,65,120,0.12)",padding:"3px 9px",borderRadius:12,fontWeight:700,border:"1px solid rgba(85,65,120,0.3)"}}>탭 → 380원</span>
                </div>
                {mid.map(({code})=>(
                  <TraitCard key={code} code={code} pct={results} isTop5={false} isUnlocked={unlockedCodes.has(code)} onPurchase={handlePurchase}/>
                ))}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,marginLeft:-16,marginRight:-16,marginBottom:0,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,gap:6,flexWrap:"wrap",borderTop:"1px solid #f0f0f0"}}>
              <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
              <span style={{fontWeight:600}}>🌐 천기.kr</span>
            </div>
            </div>
          </div>
        )}

        {/* ══ PAGE 5: 약한 특성 (펼쳐진 박스 / 글자 진하게) ══ */}
        {weak.length>0&&(
          <div style={{background:"#fff",border:"1px solid rgba(85,65,120,0.3)",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",color:"#333"}}>
            <div style={{padding:"10px 16px 0"}}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 뇌과학 40가지 특성</div>
              <div style={{fontSize:11,color:"#D4AF37",letterSpacing:2,fontWeight:800,marginTop:6}}>PAGE 5 · 약한 특성 ({weak.length}개)</div>
            </div>
            <button onClick={()=>setShowWeak(v=>!v)} style={{width:"100%",padding:"12px",background:"#fff",border:"1.5px solid #D4AF37",borderRadius:12,fontSize:13,color:"#D4AF37",fontWeight:800,cursor:"pointer",marginBottom:showWeak?12:0,fontFamily:"inherit"}}>
              {showWeak?"▲ 약한 특성 접기":"▼ 약한 특성 펼쳐 보기 ("+weak.length+"개)"}
            </button>
            {showWeak&&weak.map(({code})=>(
              <TraitCard key={code} code={code} pct={results} isTop5={false} isUnlocked={unlockedCodes.has(code)} onPurchase={handlePurchase}/>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,marginLeft:-16,marginRight:-16,marginBottom:0,fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,gap:6,flexWrap:"wrap",borderTop:"1px solid #f0f0f0"}}>
              <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
              <span style={{fontWeight:600}}>🌐 천기.kr</span>
            </div>
            </div>
          </div>
        )}
        {/* ✦ 유명인 매칭 — 표준 CelebMatchSection (page.tsx에서 helpers로 전달) */}
        {(()=>{
          const PSYCH_CELEBS={
            "신경다양성":["일론 머스크","스티브 잡스","마이클 펠프스","아인슈타인","기안84","짐 캐리","톰 크루즈","빌리 아일리시","헨리 포드","벤자민 프랭클린"],
            "사고패턴":["봉준호","크리스토퍼 놀란","김태리","유재석","마크 저커버그","베네딕트 컴버배치","칸예 웨스트","백종원","남궁민","무라카미 하루키"],
            "감정공감":["오프라 윈프리","한지민","아이유","앤 해서웨이","성시경","이금희","유재석","박보검","김희애","다이애나비"],
            "에너지행동":["지드래곤","이효리","덱스","BTS 정국","싸이","로버트 다우니 Jr.","노홍철","이영지","박재범","김연경"],
            "감각신체":["성시경","백종원","장항준","이영자","김준현","조 말론","코코 샤넬","장미희","김숙","최현석"],
            "특수능력":["찰리 푸스","헨리","조용필","페이커","장영실","레오나르도 다빈치","김시습","폰 노이만","스티븐 호킹","마리 퀴리"],
          };
          const topCat=topT?.cat;
          const list=topCat?PSYCH_CELEBS[topCat]:null;
          if(!list||!helpers?.CelebMatchSection)return null;
          const _matched=helpers?.pickCelebs?helpers.pickCelebs(list,{birth:selectedPerson?.birth||preloadResult?._birth,gender:selectedPerson?.gender==="여"?"F":selectedPerson?.gender==="남"?"M":undefined,n:10}):list;
          return <helpers.CelebMatchSection label={`닮은 [${topCat}] 카테고리 유명인 10명`} celebs={_matched} prefix="🧠"/>;
        })()}

        {/* ═══ 인증서 카드 (결과의 마지막 카드) ═══ */}
        <div style={{background:"#ffffff",borderRadius:20,overflow:"hidden",border:"1px solid rgba(155,143,212,0.3)",marginBottom:12}}>
          <div style={{padding:"10px 16px 10px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,paddingBottom:10,marginBottom:14,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16,borderBottom:"1px solid #f0f0f0"}}>🔮 천기(天機) 오리지널 | 천재성 인증서</div>
            <div style={{fontSize:18,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",lineHeight:1.35,marginBottom:6}}>🧠 천재성 인증서</div>
            <div style={{fontSize:10,color:"#888",lineHeight:1.6}}>{personName}님 평생 단 하나뿐인 뇌 인증서예요!<br/>📋 기록소에서 인증서를 모아보세요!</div>
          </div>
          <div style={{padding:"0 16px 16px"}}>
            <div style={{background:"linear-gradient(135deg,#1A3C32,#2d5f4d 50%,#1A3C32)",border:"3px double #C0C0C8",borderRadius:18,padding:"32px 20px 28px",textAlign:"center",position:"relative",boxShadow:"0 10px 30px rgba(192,192,200,0.25)",overflow:"hidden"}}>
              <div style={{position:"absolute",top:14,left:14,fontSize:16,color:"#C0C0C8",opacity:0.6}}>❀</div>
              <div style={{position:"absolute",top:14,right:14,fontSize:16,color:"#C0C0C8",opacity:0.6}}>❀</div>
              <div style={{position:"absolute",bottom:14,left:14,fontSize:16,color:"#C0C0C8",opacity:0.6}}>❀</div>
              <div style={{position:"absolute",bottom:14,right:14,fontSize:16,color:"#C0C0C8",opacity:0.6}}>❀</div>
              <div style={{fontSize:10,letterSpacing:4,color:"#C0C0C8",fontWeight:700,marginBottom:6}}>CHUNGI ORIGINALS</div>
              <div style={{fontSize:9,color:"#C0C0C8",fontStyle:"italic",marginBottom:24}}>— Brain Science Certificate —</div>
              {/* 큰 뇌 일러스트 */}
              <div style={{position:"relative",width:"100%",maxWidth:280,aspectRatio:"1/1",margin:"0 auto 26px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:280,background:"radial-gradient(circle,rgba(155,143,212,0.4),transparent 60%)",borderRadius:"50%"}}/>
                <div style={{position:"relative",fontSize:160,filter:"drop-shadow(0 6px 16px rgba(192,192,200,0.5))"}}>🧠</div>
              </div>
              <div style={{fontSize:9,color:"#C0C0C8",letterSpacing:2,marginBottom:14,fontWeight:600}}>— THIS BRAIN IS —</div>
              <div style={{fontFamily:"'Noto Serif KR','Batang','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',serif",fontSize:22,fontWeight:900,color:"#E8E8EC",lineHeight:1.35,letterSpacing:-0.5,textShadow:"0 2px 8px rgba(192,192,200,0.4)",marginBottom:32,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {/* v649: "완벽추구형형" 오타 fix — name 끝의 "형" 제거 후 일관되게 "형" 붙임 */}
                "{(topT?.name||"천재").replace(/형$/,"")}형 두뇌"
              </div>
              <div style={{fontSize:12,color:"#E8E8EC",lineHeight:2,textAlign:"center",padding:"0 12px",marginBottom:30,wordBreak:"keep-all",opacity:0.9}}>
                {personName}님의 뇌는 천기가 인증한 [{topT?.cat||"특수"}] 카테고리의 귀한 두뇌예요. {(topT?.name||"천재").replace(/형$/,"")}형 특성이 두드러지는 이 명민한 뇌는 어디서든 빛을 발하며, 평생의 직관·통찰·창의력으로 자신만의 길을 개척해나갈 운명입니다.
              </div>
              <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:30}}>
                {top5.slice(0,4).map(t=>(
                  <span key={t.code} style={{fontSize:10,fontWeight:800,color:"#C0C0C8",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(192,192,200,0.3)",padding:"4px 8px",borderRadius:20,whiteSpace:"nowrap",flexShrink:0}}>#{t.name||t.code}</span>
                ))}
              </div>
              {/* 도장 */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:14}}>
                <div style={{height:1,flex:1,maxWidth:80,background:"#C0C0C8",opacity:0.4}}/>
                <div style={{width:42,height:42,border:"2px solid #c92a2a",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:"#fff5f5",transform:"rotate(-4deg)",boxShadow:"0 2px 6px rgba(201,42,42,0.15)"}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:6,color:"#c92a2a",fontWeight:700,lineHeight:1}}>天機</div><div style={{fontSize:10,fontWeight:900,color:"#c92a2a",lineHeight:1,marginTop:2}}>認證</div></div>
                </div>
                <div style={{height:1,flex:1,maxWidth:80,background:"#C0C0C8",opacity:0.4}}/>
              </div>
              <div style={{fontSize:9,color:"#C0C0C8",opacity:0.85,fontStyle:"italic",fontWeight:600,marginTop:6}}>{personName} · 天機 ORIGINAL · No. {new Date().getFullYear()}-N{String(Math.floor(Math.random()*9000)+1000)}</div>
              <div style={{fontSize:8,color:"#C0C0C8",opacity:0.6,fontStyle:"italic",marginTop:4}}>— 천기 (天機) 봉인 · 천기.kr —</div>
            </div>
          </div>
          {/* 인증서 푸터 해시태그 */}
          <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,display:"flex",justifyContent:"space-between",padding:"10px 16px 10px",marginTop:14,borderTop:"1px solid #f0f0f0"}}>
            <span>#천기뇌과학 #종합검사 #{personName} {top5.map(t=>{const tt=TRAITS[t.code];return tt?`#${(tt.name||"").replace(/형$/,"")}형`:`#${t.code}`;}).join(" ")}</span>
            <span style={{fontWeight:600}}>🌐 천기.kr</span>
          </div>
        </div>
        </div>{/* ═══ psych-capture 닫기 (PAGE 1-5 + 유명인 통합 끝) ═══ */}

        {/* 📚 뇌과학 6 카테고리 도감 — 결과 카드 바로 아래 (표준 순서: 결과 → 도감) */}
        <button onClick={()=>setShowBrainCollection(true)} style={{width:"100%",padding:"14px",marginBottom:10,background:"linear-gradient(135deg,#fef9e7,#fff8db)",color:"#6b21a8",border:"2px solid rgba(155,143,212,0.4)",borderRadius:14,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
          📚 뇌과학 6대 카테고리 전체 도감
        </button>

        {/* 📚 뇌과학 도감 모달 (버튼은 위쪽 결과 카드 바로 아래에 위치) */}
        {showBrainCollection&&(()=>{
          const BRAIN_CATS=[
            {id:1,name:"신경다양성",emoji:"🌈",desc:"ADHD·HSP·자폐·난독 등 (8 트레잇)"},
            {id:2,name:"사고패턴",emoji:"🧩",desc:"직관·과잉사고·완벽주의·메타인지 등 (9 트레잇)"},
            {id:3,name:"감정공감",emoji:"💗",desc:"공감·거절민감·애착·정서강도 등 (9 트레잇)"},
            {id:4,name:"에너지행동",emoji:"⚡",desc:"충동·경조증·야간형·과각성 등 (8 트레잇)"},
            {id:5,name:"감각신체",emoji:"🌿",desc:"미각·후각·촉각·환경 (4 트레잇)"},
            {id:6,name:"특수능력",emoji:"👁️",desc:"사진기억·절대음감·예지직관 (3+ 트레잇)"},
          ];
          const myCat=topT?.cat;
          return (
            <div className="ov" onClick={()=>setShowBrainCollection(false)}>
              <div className="md" style={{maxHeight:"92vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
                <div className="hd"/>
                <div style={{position:"sticky",top:0,display:"flex",justifyContent:"flex-end",marginBottom:-20,zIndex:5}}>
                  <button onClick={()=>setShowBrainCollection(false)} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"none",color:"var(--mist)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
                <div style={{background:"#FDFCF8",borderRadius:18,padding:"18px 16px 20px",marginBottom:14,boxShadow:"0 8px 28px rgba(0,0,0,0.3)",border:"2px solid rgba(85,65,120,0.4)",color:"#333"}}>
                <div style={{fontSize:9,color:"#aaa",fontWeight:600,letterSpacing:0.3,textAlign:"center",marginBottom:10}}>🔮 천기(天機) 오리지널 | 뇌과학 카테고리 도감</div>
                <div style={{textAlign:"center",fontSize:54,marginBottom:6}}>🧠</div>
                <div style={{textAlign:"center",fontSize:22,fontWeight:900,color:"#1A1A1A",fontFamily:"'Noto Serif KR','Batang',serif",marginBottom:4}}>뇌과학 6대 카테고리</div>
                <div style={{textAlign:"center",fontSize:12,color:"#D4AF37",marginBottom:14,fontWeight:600}}>40 트레잇이 6개의 큰 흐름으로 연결돼요</div>
                {BRAIN_CATS.map(c=>{
                  const isMe=c.name===myCat;
                  return (
                    <div key={c.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px",marginBottom:12,background:isMe?"rgba(85,65,120,0.12)":"#F9F7F2",border:isMe?"2px solid #D4AF37":"1px solid transparent",borderRadius:10}}>
                      <div style={{width:60,height:60,borderRadius:"50%",overflow:"hidden",background:"#fff",border:`1px solid ${isMe?"#D4AF37":"rgba(0,0,0,0.06)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <img src={`/16gijildo+12guardians-cards-2D/16gijildo+12guardians-2D (${c.id}).png`} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={(e)=>{e.currentTarget.style.display="none";}}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#111"}}>{c.emoji} {c.name}형 {isMe&&<span style={{color:"#D4AF37",fontSize:10,fontWeight:900,marginLeft:4}}>✦ 내 카테고리</span>}</div>
                        <div style={{fontSize:10,color:"#666",marginTop:3,lineHeight:1.5}}>{c.desc}</div>
                      </div>
                    </div>
                  );
                })}
                </div>
                <button className="btn btn-p" onClick={()=>setShowBrainCollection(false)}>확인</button>
              </div>
            </div>
          );
        })()}

        {/* 1. 광고배너 (연계 콘텐츠) — 내관상보기 패턴 그대로 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
          {[
            {ic:"🔯",q:"동양식 16유형은?",name:"기질도 →",bc:"rgba(95,196,158,0.3)",sid:"gijildo"},
            {ic:"☯️",q:"내 사주 풀코스는?",name:"사주 풀이 →",bc:"rgba(212,175,55,0.3)",sid:"saju"},
            {ic:"🪞",q:"내 관상은?",name:"내 관상보기 →",bc:"rgba(255,107,107,0.3)",sid:"gwansang_full"},
            {ic:"❤️",q:"가장 잘 맞는 인연은?",name:"연애운·궁합 →",bc:"rgba(244,143,177,0.3)",sid:"love"},
          ].map(ad=>(
            <div key={ad.name} style={{background:"#ffffff",borderRadius:12,padding:"12px 8px",border:`2px solid ${ad.bc}`,textAlign:"center",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(ad.sid,ad.name.replace(" →",""),ad.ic,"")}>
              <div style={{fontSize:22,marginBottom:4,fontFamily:"'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"}}>{ad.ic}</div>
              <div style={{fontSize:12,fontWeight:900,color:"#0a1f1a",marginBottom:3}}>{ad.q}</div>
              <div style={{fontSize:9,fontWeight:600,color:"#666"}}>{ad.name}</div>
            </div>
          ))}
        </div>
        {/* 2. 공유 (ResultActions) — 내관상보기 동일 컴포넌트 */}
        {helpers?.ResultActions&&<helpers.ResultActions isLoggedIn={isLoggedIn} onLoginRequest={onLoginRequest||(()=>{})} onShare={()=>{}} captureId="psych-capture"/>}
        {/* 3. 이것도 해볼래요 — 내관상보기 동일 카드 */}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mist)",marginBottom:6}}>✨ 이것도 해볼래요?</div>
          <div className="goods-cat-scroll drag-scroll" style={{display:"flex",gap:8,paddingBottom:4,padding:"0 0 4px"}}>
            {[
              {ic:"⏳",name:"전생 운세",price:"980원",sid:"past_life"},
              {ic:"🔢",name:"수비학",price:"980원",sid:"numerology"},
              {ic:"📸",name:"관상짤",price:"380원",sid:"gwansang_zal"},
              {ic:"🃏",name:"오늘의 타로",price:"무료",sid:"today_tarot"},
              {ic:"🔮",name:"천기 리포트",price:"무료",sid:"synthesis"},
              {ic:"👶",name:"2세 예측",price:"4,800원",sid:"baby_face"},
            ].map(cr=>(
              <div key={cr.name} style={{flexShrink:0,width:100,background:"#ffffff",borderRadius:12,padding:"10px 8px",border:"1px solid rgba(212,175,55,0.4)",textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}} onClick={()=>onOpenService?.(cr.sid,cr.name,cr.ic,cr.price)}>
                <div style={{fontSize:22,marginBottom:4}}>{cr.ic}</div>
                <div style={{fontSize:11,fontWeight:900,marginBottom:2,color:"#0a1f1a"}}>{cr.name}</div>
                <div style={{fontSize:9,fontWeight:700,color:"#D4AF37"}}>{cr.price}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 4. 굿즈 (GoodsRecSection) — 내관상보기 동일 컴포넌트 */}
        {helpers?.GoodsRecSection&&<helpers.GoodsRecSection svcId="psych" ctx={{}} cart={cart} setCart={setCart} onGoShop={()=>{if(typeof onClose==="function")onClose();if(typeof onGoShop==="function")onGoShop();}} title="뇌 특성 맞춤 개운 굿즈" sub={`${topT?.emoji||"🧠"} ${topT?.name||"강한 특성"} 기운을 끌어올리는 아이템`}/>}
        <button className="btn btn-p" onClick={()=>{if(typeof onClose==="function")onClose();}}>확인 완료</button>
        <button className="btn btn-g" disabled style={{opacity:0.55,cursor:"not-allowed"}}>🛠️ 굿즈샵 준비중</button>
        <p style={{fontSize:10,color:"#aaa",textAlign:"center",marginTop:12}}>성향 탐색용 · 의료적 진단 아님</p>

        {indexModal&&<IndexModal name={indexModal} indices={indices} onClose={()=>setIndexModal(null)}/>}
        <style>{`::-webkit-scrollbar{display:none}`}</style>
      </div>
      </div></div>
    );
  }
  return null;
}
