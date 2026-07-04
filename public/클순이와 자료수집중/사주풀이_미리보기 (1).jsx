import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
var DEMO_NAME = "규미";

// ━━━ 결과 데이터 ━━━
var RESULT = {
  // 만세력 (실제 구현시 사주 계산 엔진에서)
  pillars: [
    {label:"시주",sky:"壬",earth:"子",skyK:"임",earthK:"자",color:"#4A90D9"},
    {label:"일주",sky:"乙",earth:"卯",skyK:"을",earthK:"묘",color:"#7A5C00",hl:true},
    {label:"월주",sky:"庚",earth:"申",skyK:"경",earthK:"신",color:"#7CB87B"},
    {label:"연주",sky:"戊",earth:"辰",skyK:"무",earthK:"진",color:"#C4922A"},
  ],
  sinsal: ["도화살 🌸","역마살 🐎","화개살 🎭","학당귀인 📚","태극귀인 ☯️","천을귀인 👑"],
  hap: ["갑기합→토 🌍","신자진삼합→수 🌊","신유반합","귀문관살","유자파"],
  hap_detail: {
    "갑기합→토 🌍": "천간합 중 갑목과 기토가 합을 이뤄 토 기운으로 변화해요. 이 합이 있는 사주는 협력과 조화 능력이 뛰어나고, 안정적인 관계를 잘 맺어요. 단, 갑목의 독립성이 기토에 의해 묶일 수 있어 지나친 의존 관계를 조심해야 해요.",
    "신자진삼합→수 🌊": "신금·자수·진토 세 지지가 삼합을 이뤄 강한 수(水) 기운을 만들어요. 이 삼합이 있으면 지혜와 직관력이 강해지고, 흐름을 읽는 능력이 탁월해요. 수 기운이 강해져 재물운과 지적 능력이 높아지는 길한 삼합이에요.",
    "신유반합": "신금과 유금이 반합을 이뤄 금 기운이 강해져요. 결단력과 의리가 강해지는 조합이에요. 금 기운이 과하면 지나친 완벽주의가 될 수 있어요.",
    "귀문관살": "귀문관살은 신비로운 기운을 가진 특수 살이에요. 영적 감수성이 예민하고 직관력이 강해요. 밤에 특히 감각이 살아나는 타입이고, 예술적·창의적 영역에서 특별한 능력을 발휘할 수 있어요.",
    "유자파": "지지 유금과 자수가 파(破)를 이뤄요. 파는 깨지고 흩어지는 기운이에요. 이 파살이 있으면 계획이 틀어지거나 관계에서 갑작스러운 변화가 생길 수 있어요. 특히 유금과 자수가 강하게 작용하는 시기(유년·자년)에 변수가 생기기 쉬워요.",
  },
  keywords: ["전문성","직관력","추진력"],
  ohaeng: "금(金)",
  yongsin: "수(水)",

  // ─── 일주론 (60갑자 상세) ───
  ilju: {
    title: "乙卯日柱 (을묘일주)",
    nabaum: "大溪水 (대계수) — 큰 계곡의 물",
    nabaum_desc: "기상이 당당하고 거침이 없으며 목표를 향해 매진하는 기질이에요. 굽이치는 계곡물처럼 어떤 장애물도 돌아서 결국 바다에 이르는 끈질긴 생명력을 가졌어요.",
    char: "을묘일주는 '꽃밭의 봄꽃'이에요. 부드럽고 아름다우나 뿌리가 단단하고, 바람에 흔들려도 꺾이지 않는 외유내강형이에요.",
    personality: "섬세하고 감수성이 풍부하며 예술적 감각이 뛰어나요. 겉으로는 유연하지만 속으로는 강한 의지와 뚜렷한 자기주관을 가지고 있어요. 처음엔 순해 보여도 한번 결심하면 끝까지 가는 타입이에요.",
    love: "연애에서 상대를 배려하고 헌신하는 성향이 강해요. 을묘 일주는 감성적인 연애를 좋아하고 로맨틱한 분위기에 약해요. 배우자 복이 있으나 지나친 희생이 독이 될 수 있어요.",
    money: "재물은 꾸준히 쌓이는 타입이에요. 한 방보다는 성실한 축적형이에요. 예술·교육·창작 분야에서 재물이 들어오는 경우가 많아요.",
    career: "창의적이고 감성이 필요한 분야에서 두각을 나타내요. 예술·디자인·교육·상담·기획 분야가 잘 맞아요.",
    caution: "지나친 감정 이입과 우유부단함을 주의해야 해요. 남의 부탁을 거절하지 못해 손해 보는 경우가 있어요.",
  },

  // ─── 지장간 분석 ───
  jijanggan: [
    {pillar:"시주 子", items:[{gan:"壬", type:"정기", meaning:"임수 — 지혜·유통·귀인"}]},
    {pillar:"일주 卯", items:[{gan:"甲", type:"여기", meaning:"갑목 — 창의·개척·시작"},{gan:"乙", type:"정기", meaning:"을목 — 부드러움·인내·예술"}]},
    {pillar:"월주 申", items:[{gan:"戊", type:"여기", meaning:"무토 — 안정·신뢰·포용"},{gan:"壬", type:"중기", meaning:"임수 — 지혜·흐름·귀인"},{gan:"庚", type:"정기", meaning:"경금 — 결단·의리·명예"}]},
    {pillar:"연주 辰", items:[{gan:"乙", type:"여기", meaning:"을목 — 부드러움·생명력"},{gan:"癸", type:"중기", meaning:"계수 — 직관·창의·감성"},{gan:"戊", type:"정기", meaning:"무토 — 안정·뿌리·기반"}]},
  ],

  // ─── 12운성 분석 ───
  unsung_12: {
    current_unsung: "쇠(衰)",
    current_desc: "쇠(衰)는 기운이 정점을 지나 안정화되는 단계예요. 새로운 일보다 현재를 다지고 내실을 쌓는 것이 유리한 시기예요. 큰 변화보다 꾸준한 관리가 이 시기의 핵심이에요.",
    pillars_unsung: [
      {pillar:"시주 子", unsung:"태(胎)", desc:"새로운 가능성과 아이디어가 움트는 기운이에요."},
      {pillar:"일주 卯", unsung:"건록(建祿)", desc:"일간의 힘이 가장 충만한 상태. 독립적이고 자수성가 기질이 강해요."},
      {pillar:"월주 申", unsung:"절(絶)", desc:"기운이 끊기는 단계. 변화와 단절이 있는 시기를 나타내요."},
      {pillar:"연주 辰", unsung:"관대(冠帶)", desc:"사회에 첫발을 내딛는 기운. 꿈과 포부가 넘쳐요."},
    ],
  },

  // ─── 성격·기질 ───
  personality: {
    title: "타고난 기질 — 차갑게 뜨거운 완벽주의자",
    text: [
      DEMO_NAME+"님, 이 사주 보는 순간 딱 느낌이 왔어요. 겉으로는 차분하고 절제된 모습이지만 내면에 엄청난 열정과 기준이 있어요. 남들이 '쟤 왜 저래' 할 만큼 완벽을 추구하는데, 그게 약점이 아니라 이 사주의 가장 큰 무기예요.",
      "을목 일간은 부드럽게 감기는 덩굴처럼 유연하게 환경에 적응하면서도 절대 포기하지 않는 끈질김이 있어요. 겉으로 순해 보여도 속은 강철이에요. 이 사주가 한번 목표를 잡으면 주변이 뭐라 해도 끝까지 가요.",
      "근데 문제가 하나 있어요. 이 강한 기준이 자기 자신한테도 향해요. 남들이 보기엔 잘 하고 있는데 스스로는 늘 부족하다고 느끼는 타입이에요. '나는 왜 이것밖에 못 하나' 하는 생각, 많이 하시죠? 그게 사주 기질이에요. 약점이 아니라 이 사람을 성장시키는 엔진이에요.",
      "또 하나 — 이 사주는 직관력이 굉장히 발달해 있어요. 첫 느낌이 거의 맞아요. 근데 그 직관을 믿지 못하고 논리로 검증하려다가 타이밍을 놓치는 경우가 많아요. "+DEMO_NAME+"님 직관, 더 믿어도 돼요."
    ]
  },

  // ─── 재물운 ───
  money: {
    score: 72,
    title: "재물운 — 노력형 부자, 타이밍이 전부",
    text: [
      DEMO_NAME+"님 사주에서 재물을 솔직하게 짚어드릴게요. 금 기운이 강한 사주라 재물 감각 자체는 타고났어요. 돈의 흐름을 읽는 눈이 있고, 절약 본능도 있어요. 근데 이 사주의 재물운은 한 방이 아니에요.",
      "들어오고 나가는 게 있어야 흐름이 생기는 구조예요. 한 곳에 너무 묶어두거나 지나치게 집착하면 오히려 재물이 막혀요. 적절히 쓰면서 순환시키는 게 이 사주 재물의 비결이에요.",
      "지금 현재 재물 흐름은 상승 중이에요. 급격히 큰돈이 들어오는 게 아니라 꾸준히 쌓여가는 방식이에요. 올해 하반기(7~10월)에 재물 기운이 가장 강하게 들어오는 시기예요. 이 시기에 중요한 재무적 결정을 내리면 좋아요.",
"올해는 새로운 수입 루트를 하나 더 만드는 게 좋아요. 본업 외에 전문성을 활용한 부업이나 소규모 투자를 시작해보세요. 지금이 씨앗 심는 타이밍이에요."
    ],
    advice: ["전문성 기반 수입 · 장기 적립 투자","부동산보다 동산 · 지식 자산","충동 구매·단기 투기 주의"],
    lucky: {num:"3, 8", color:"흰색·금색", dir:"서쪽·북서쪽", day:"경신일·금요일"}
  },

  // ─── 연애·결혼운 ───
  love: {
    score: 68,
    title: "연애·결혼운 — 도화살의 양날검",
    text: [
      DEMO_NAME+"님, 이 부분에서 진짜 솔직하게 말씀드릴게요. 사주에 도화살이 강하게 자리 잡고 있어서 자연스럽게 이성에게 매력적으로 보여요. 만나는 사람마다 호감을 갖게 되는 타입이에요. 근데 그게 독이 되기도 해요.",
      "인연이 자꾸 왔다 갔다 하는 패턴이 사주에 있어요. 깊어질 것 같다가 어느 순간 어긋나는 경험, 여러 번 하셨죠? 이게 "+DEMO_NAME+"님이 잘못한 게 아니에요. 사주 흐름이 그렇게 되어있어요.",
      "을목 일간은 감성이 풍부하고 배려심이 깊어요. 상대방을 너무 잘 챙기다 보니 자기 자신을 잃어버리는 경우가 생기기도 해요. 연애에서 '나'를 잃지 않는 것이 이 사주 연애운의 핵심이에요.",
"좋은 소식은, 용신 수 기운이 들어오는 해에 인연의 흐름이 바뀌어요. 지금처럼 자기 자신을 먼저 채우는 시기에 진짜 인연이 준비되고 있어요."
    ],
    match: {good:"금·수 일간", bad:"목 과다 사주", timing:"2026년 하반기~2027년"}
  },

  // ─── 직업·사업운 ───
  career: {
    score: 81,
    title: "직업·사업운 — 스페셜리스트의 사주",
    text: [
      DEMO_NAME+"님 사주에서 가장 빛나는 부분이에요. 금 기운이 강한 사주는 정밀함, 전문성, 완성도에서 남들을 압도해요. 한 분야를 깊이 파고드는 능력이 탁월해요. 제너럴리스트보다 스페셜리스트로 갈 때 이 사주가 빛을 발해요.",
      "조직 안에서 답답함을 느낀 적 있으시죠? 당연한 거예요. 이 사주는 틀 안에 가두면 능력이 반토막 나는 구조예요. 직장인이어도 자기만의 전문 영역, 자기 브랜드가 있어야 에너지가 살아요.",
      "사업을 한다면 혼자 뭔가를 만들어가는 방식이 맞아요. 크고 화려한 것보다 내 전문성이 녹아있는 깊이 있는 것이 훨씬 잘 맞아요. 지금 하는 일에서 '내가 가장 잘할 수 있는 것'을 찾아 그 분야의 전문가가 되세요.",
      "지금이 전문성을 더 깊게 쌓을 절호의 타이밍이에요."
    ],
    jobs: ["크리에이터·콘텐츠","컨설턴트·코치","기획·전략","의료·법률·회계 전문직"],
    notJobs: ["단순 반복 업무","과도한 대인 서비스","지나치게 팀 의존적인 업무"]
  },

  // ─── 건강운 ───
  health: {
    score: 68,
    title: "건강운 — 간·담·소화기를 챙겨야 하는 사주",
    text: [
      DEMO_NAME+"님, 건강 부분을 솔직하게 말씀드릴게요. 을목 일간은 간·담 계통에 특히 신경 써야 하는 체질이에요. 스트레스를 받으면 제일 먼저 소화 기능에 영향이 와요. '긴장하면 배가 아프다', '스트레스 받으면 밥맛이 없다' 경험 있으시죠? 전형적인 을목 체질이에요.",
      "눈도 주의 부위예요. 화면을 오래 보거나 정신적으로 무리하면 눈이 빨리 피로해지는 타입이에요. 규칙적인 눈 스트레칭이 이 사주에 특히 중요해요.",
      "좋은 소식은, 이 사주에 귀인이 건강을 지켜주는 기운이 있어요. 큰 병보다 잔병치레 타입이에요. 평소에 꾸준히 관리하면 건강 걱정은 크게 없어요.",
      "올해 주의 시기는 3~4월(환절기)과 7~8월(여름 더위)이에요. 이 시기에 면역력이 떨어지기 쉬워요. 특히 올해 하반기에 과로하지 않도록 조심하세요."
    ],
    care: ["규칙적 식사 시간 지키기","스트레스 해소법 하나 만들기","초록 채소 자주 섭취","과음·야식 자제","눈 스트레칭 하루 3회"],
    weak: ["간·담 계통 🫀","소화기·위장 🫁","눈·시력 👁️","신경계·두통 🧠"],
    caution: "환절기(3~4월, 9~10월) · 여름철 과로"
  },

  // ─── 신살 상세 ───
  sinsal_detail: {
    "도화살 🌸": "이성에게 자연스럽게 매력적으로 보이는 살이에요. 연예인 사주에 많아요. 사회적 매력이 강해서 대중을 상대하는 직업에도 유리해요. 단, 이성 문제가 복잡해질 수 있으니 신중하게 관계를 맺는 게 중요해요.",
    "역마살 🐎": "움직임이 많고 변화를 추구하는 살이에요. 한 곳에 정착하기보다 이동이 많고 활동적이에요. 해외 인연이나 원거리 활동에서 기회가 오는 경우가 많아요. 이 살이 발동하는 시기에 큰 변화가 생겨요.",
    "화개살 🎭": "예술적 감수성과 종교적·철학적 기질을 나타내는 살이에요. 창의적인 분야에서 빛을 발해요. 고독을 즐기는 경향이 있고, 자신만의 세계관이 강해요.",
    "학당귀인 📚": "학문과 교육에서 귀인의 도움을 받는 좋은 신살이에요. 공부하면 빛이 나고, 가르치는 일에서도 능력이 발휘돼요. 지식을 쌓을수록 인생이 풀려가는 사주예요.",
    "태극귀인 ☯️": "극적인 변화와 반전이 있는 삶을 살게 되는 귀인이에요. 바닥을 치면 반드시 올라가고, 절망적인 상황에서 반전이 생겨요. "+DEMO_NAME+"님 인생에 극적인 순간들이 있었다면 이 신살 때문이에요.",
    "천을귀인 👑": "사주 최고의 귀인살이에요. 어려울 때마다 귀인이 나타나 도와주는 강력한 길성이에요. 평생 주변에 좋은 사람이 따르고, 위기 상황에서 누군가 나타나 해결해주는 경험을 반복적으로 하게 돼요. 이 귀인을 가진 사람은 혼자 힘들어하지 말고 도움을 요청하는 용기를 가져야 해요."
  },

  // ─── 대운 흐름 ───
  daeun: [
    {age:"25~34세",sky:"甲",earth:"子",text:"목 기운 강한 시기. 새로운 시작과 도전의 에너지가 넘쳤던 대운이에요."},
    {age:"35~44세",sky:"乙",earth:"丑",text:"지금 흐르고 있는 대운. 안정 속에서 전문성을 쌓는 시기예요.",now:true},
    {age:"45~54세",sky:"丙",earth:"寅",text:"화 기운 강해짐. 사회적 활동과 명예가 절정에 달하는 황금기예요."},
    {age:"55~64세",sky:"丁",earth:"卯",text:"결실과 안정의 시기. 지금까지 쌓아온 것들이 빛을 발해요."},
  ],

  // ─── 개운법 ───
  gaeun: [
    "동쪽 방향 · 동북쪽으로 이사나 여행을 고려해보세요 — 을목의 기운을 살려주는 방향이에요",
    "흰색·금색 계열 지갑이나 소품 — 용신 금 기운을 보충해줘요",
    "물 가까운 곳에서의 활동 — 수 기운이 이 사주의 용신을 돕는 역할을 해요",
    "목요일과 금요일이 행운의 요일 — 중요한 결정은 이날 내려보세요",
    "3, 8, 12가 행운의 숫자 — 날짜 선택이나 번호 선택 시 활용해보세요",
    "새벽 시간대(01~05시)에 태어난 사주라 아침 루틴이 특히 중요해요 — 기상 후 물 한 잔이 하루 기운을 열어줘요"
  ]
};

var QUESTIONS = [
  {title:"사주에서 가장 궁금한 영역은?", icon:"☯️", multi:true, skippable:false,
   opts:["💰 재물·돈복·투자운","❤️ 연애·결혼·인연운","💼 직업·사업·출세운","📜 관운·공무원·시험운","🌿 건강·수명운","👶 자녀운","🌟 전체 흐름","🌈 전체 다 궁금해요!"]},
  {title:"지금 삶의 단계는?", icon:"🌱", multi:false, skippable:false,
   opts:["🌱 새로운 시작 앞에 있어","🔄 변화가 필요한 시기야","😊 안정적인 상태야","😰 진짜 힘들어, 당장 돌파구가 필요해","🌈 고비 넘기고 회복 중이야","🎯 중요한 결정을 앞두고 있어"]},
  {title:"지금 가장 간절한 것은? (선택)", icon:"🙏", multi:false, skippable:true,
   opts:["💸 돈이 들어오는 시기","❤️ 좋은 인연이 오는 시기","💼 이 일이 나와 맞는지","📜 합격·취업·관운","🌿 건강·수명","🏠 이사·계약 타이밍","🔮 내 사주의 강점과 약점"]},
];

var LOADING_MSGS = [
  "천간지지 배열 중... ☯️","용신 계산 중... 🔥","신살 분석 중... ⚡",
  "합충 관계 점검 중... 🌊","도깨비가 방망이 두드리는 중... 🪄",
  "용왕님이 재물 보따리 싸는 중... 💰","저승사자가 사주책 펼치는 중... 📖",
  "20만원짜리 점집보다 정확하게 분석 중... 💎"
];

var CROSS = [
  {emoji:"🌙",title:"월별 운세",desc:"이번 달 사주 흐름 정밀 분석",price:"첫회무료"},
  {emoji:"🔄",title:"대운 해설",desc:"10년 단위 인생의 큰 그림",price:"첫회무료"},
  {emoji:"❤️",title:"궁합 보기",desc:"사주로 보는 인연운과 궁합",price:"980원"},
  {emoji:"📅",title:"좋은 날 찾기",desc:"사주 기반 최적의 날짜 추천",price:"980원"},
];

function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function ScoreBar({score,color}){return(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{flex:1,height:8,background:"#F0EDE6",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:score+"%",background:color||"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99}}/></div><span style={{fontSize:13,fontWeight:700,color:"#7A5C00",flexShrink:0}}>{score}점</span></div>);}
function Tag({text,color}){return <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:color||"rgba(232,200,122,0.12)",border:"1px solid "+(color?"rgba(0,0,0,0.1)":"rgba(232,200,122,0.3)"),color:color?"#333":"#7A5C00",marginRight:6,marginBottom:6,display:"inline-block"}}>{text}</span>;}
function Section({title,children}){return(<div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}><p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>{title}</p>{children}</div>);}
function SectionTitle({emoji,text}){return <p style={{fontSize:14,fontWeight:800,color:"#111",margin:"0 0 12px"}}>{emoji} {text}</p>;}
function Para({text}){return <p style={{fontSize:13,color:"#222",lineHeight:2.05,margin:"0 0 12px",wordBreak:"keep-all"}}>{text}</p>;}
function InfoGrid({items}){return(
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
    {items.map(function(x,i){return(
      <div key={i} style={{background:"#F9F7F2",borderRadius:10,padding:"10px 12px"}}>
        <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[0]}</p>
        <p style={{fontSize:11,fontWeight:700,color:"#333",margin:0}}>{x[1]}</p>
      </div>
    );})}
  </div>
);}

export default function SajuPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [multiSel,setMultiSel]=useState([]);
  var [openSinsal,setOpenSinsal]=useState(null);
  var [openHap,setOpenHap]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var ivRef=useRef(null);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*3+1.5);setLoadPct(Math.floor(pct));
      if(Math.random()>0.85)setLoadMsgIdx(function(i){return(i+1)%LOADING_MSGS.length;});
      if(pct>=100){clearInterval(ivRef.current);setTimeout(function(){setStep("result");},500);}
    },180);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||"";
  var R=RESULT;

  // ── 설명 팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>☯️ 사주 풀이</h2><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>20만원짜리 점집보다 정확해서 소름!</p></div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(232,200,122,0.18)",color:G,border:"1px solid rgba(232,200,122,0.4)",fontWeight:700}}>풀코스</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>☯️ 사주팔자 — 천간지지 8글자 완전 분석</p>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {R.pillars.map(function(p){return(
              <div key={p.label} style={{flex:1,textAlign:"center",background:p.hl?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.04)",border:"1px solid "+(p.hl?"rgba(232,200,122,0.4)":"rgba(255,255,255,0.08)"),borderRadius:10,padding:"10px 4px"}}>
                <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"0 0 6px"}}>{p.label}</p>
                <p style={{fontSize:22,color:p.color,fontWeight:700,margin:"0 0 2px",lineHeight:1}}>{p.sky}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:"0 0 6px"}}>{p.skyK}</p>
                <div style={{width:1,height:12,background:"rgba(255,255,255,0.1)",margin:"0 auto 6px"}}/>
                <p style={{fontSize:22,color:p.color,fontWeight:700,margin:"0 0 2px",lineHeight:1}}>{p.earth}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0}}>{p.earthK}</p>
              </div>
            );})}
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.75,margin:0}}>결제 후 성격·재물·연애·직업·건강·개운법 전부 분석해드려요.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 사주 풀이에서 알 수 있는 것</p>
          {[["🧬","타고난 기질·성격","나도 몰랐던 진짜 내 모습"],["⚡","신살 상세 분석","도화살·역마살·귀인살 풀이"],["💰","재물·돈복","언제 어떻게 돈이 오는지"],["❤️","연애·결혼·인연운","좋은 인연 시기와 맞는 상대"],["💼","직업·사업·출세운","내 사주에 맞는 방향"],["🌿","건강 체질 분석","주의 부위와 맞춤 관리법"],["🔄","대운 흐름","10년 단위 인생의 큰 그림"],["✨","개운법","용신 기반 행운 정보"]].map(function(f,i){return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:18}}>{f[0]}</span></div>
              <div style={{paddingTop:2}}><p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>{f[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>{f[2]}</p></div>
            </div>
          );})}
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>만세력 + 신살 + 합충 + 성격·재물·연애·직업·건강 전부</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 인물 선택 ──
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>☯️ 누구의 사주를 볼까요?</h3>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>1990-04-07 · 양력 · 여 · 오시생</p></div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);setMultiSel([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사전질문 ──
  if(step==="questions"){
    var curQ=QUESTIONS[qStep]; var totalQ=QUESTIONS.length; var progress=(qStep/totalQ)*100;
    function selectOpt(opt){
      if(curQ.multi){setMultiSel(function(prev){return prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt);});}
      else{var na=answers.slice();na[qStep]=opt;setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("payment");},300);}}
    }
    function goNext(){var na=answers.slice();if(curQ.multi&&multiSel.length>0){na[qStep]=multiSel.join(", ");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);setMultiSel([]);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("payment");}}
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0)setQStep(qStep-1);else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.multi&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"6px 0 0"}}>💡 하나만 고를수록 더 깊게 · 여러 개 선택하면 전체 흐름을 볼 수 있어요</p>}
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {curQ.opts.map(function(opt){var isSel=curQ.multi?multiSel.includes(opt):answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"13px 10px",borderRadius:12,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {curQ.multi&&<GBtn onClick={goNext}>{multiSel.length>0?"선택 완료 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setMultiSel([]);if(qStep<QUESTIONS.length-1){setQStep(qStep+1);}else{setStep("payment");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 분석 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 결제 ──
  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3></div>
      <div style={{padding:"16px"}}>
        {/* 입력 내용 확인 카드 */}
        {answers.filter(function(a){return a&&a!=="";}).length>0&&(
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 10px"}}>✦ 입력하신 내용이 맞나요?</p>
            {answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:12,color:"rgba(255,255,255,0.75)",margin:"0 0 5px",lineHeight:1.6}}>{QUESTIONS[i].icon} {a.length>30?a.slice(0,30)+"...":a}</p>):null;})}
          </div>
        )}
        <div style={{background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"7px 14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>980원</span></div></div>
        {[["🟡","카카오페이",true],["🔵","토스페이",false],["💚","네이버페이",false],["💳","카드결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[2]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[2]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20}}>{x[0]}</span><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:0,flex:1}}>{x[1]}</p><div style={{width:18,height:18,borderRadius:"50%",border:x[2]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[2]?"#E8C87A":"transparent"}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 (980원) →</GBtn>
        <div style={{height:8}}/><GBtn onClick={function(){setStep("questions");setQStep(0);}} dim={true}>← 이전으로</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 로딩 ──
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        {/* 만세력 미리보기 */}
        <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:20}}>
          {R.pillars.map(function(p){return(
            <div key={p.label} style={{flex:1,textAlign:"center",background:p.hl?"rgba(232,200,122,0.12)":"rgba(255,255,255,0.04)",border:"1px solid "+(p.hl?"rgba(232,200,122,0.35)":"rgba(255,255,255,0.08)"),borderRadius:8,padding:"8px 3px"}}>
              <p style={{fontSize:7,color:"rgba(255,255,255,0.35)",margin:"0 0 4px"}}>{p.label}</p>
              <p style={{fontSize:18,color:p.color,fontWeight:700,margin:"0 0 2px",lineHeight:1}}>{p.sky}</p>
              <div style={{width:1,height:8,background:"rgba(255,255,255,0.1)",margin:"2px auto"}}/>
              <p style={{fontSize:18,color:p.color,fontWeight:700,margin:0,lineHeight:1}}>{p.earth}</p>
            </div>
          );})}
        </div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 사주팔자 분석 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{LOADING_MSGS[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  // ━━━━━━━━━━━━━━━ 결과 ━━━━━━━━━━━━━━━
  if(step==="result") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>✦ 천기 오리지널 · 사주팔자 완전 분석</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 ☯️ 사주 풀이</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>생년월일시 기반 정밀 분석 완료</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {/* ① 사전질문 요약 */}
        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ {DEMO_NAME}님 맞춤 분석</p>
          <p style={{fontSize:13,fontWeight:700,color:"#111",margin:"0 0 4px"}}>궁금한 것: {q1.split(",")[0]}</p>
          {q2&&<p style={{fontSize:11,color:"rgba(0,0,0,0.6)",margin:"2px 0"}}>🌱 지금 단계: {q2}</p>}
          {q3&&<p style={{fontSize:11,color:"rgba(0,0,0,0.55)",margin:"2px 0",fontStyle:"italic"}}>🙏 가장 간절한 것: {q3}</p>}
        </div>}

        {/* ② 만세력 + 신살 + 합충 */}
        <Section title="☯️ 사주팔자 · 만세력">
          {/* 4주 */}
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {R.pillars.map(function(p){return(
              <div key={p.label} style={{flex:1,textAlign:"center",background:p.hl?"rgba(232,200,122,0.08)":"#F9F7F2",border:"1px solid "+(p.hl?"rgba(232,200,122,0.5)":"rgba(0,0,0,0.06)"),borderRadius:10,padding:"10px 4px"}}>
                <p style={{fontSize:8,color:"rgba(0,0,0,0.4)",margin:"0 0 6px"}}>{p.label}</p>
                <p style={{fontSize:24,color:p.color,fontWeight:700,margin:"0 0 2px",lineHeight:1}}>{p.sky}</p>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:"0 0 8px"}}>{p.skyK}</p>
                <div style={{width:1,height:14,background:"rgba(0,0,0,0.1)",margin:"0 auto 8px"}}/>
                <p style={{fontSize:24,color:p.color,fontWeight:700,margin:"0 0 2px",lineHeight:1}}>{p.earth}</p>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.5)",margin:0}}>{p.earthK}</p>
              </div>
            );})}
          </div>
          {/* 오행·용신 */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[["⚡ 일간 오행",R.ohaeng],["🔥 용신",R.yongsin],["☯️ 격국","정관격"]].map(function(x){return(
              <div key={x[0]} style={{flex:1,background:"#F9F7F2",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[0]}</p>
                <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{x[1]}</p>
              </div>
            );})}
          </div>
          {/* 신살 — 탭 클릭시 상세 설명 */}
          <div style={{marginBottom:10}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 8px"}}>⚡ 주요 신살 (클릭하면 상세 설명)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {R.sinsal.map(function(s){return(
                <button key={s} onClick={function(){setOpenSinsal(openSinsal===s?null:s);}} style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:openSinsal===s?"rgba(232,200,122,0.2)":"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.35)",color:"#7A5C00",cursor:"pointer",fontFamily:"'Noto Serif KR',serif"}}>{s}</button>
              );})}
            </div>
            {openSinsal&&R.sinsal_detail[openSinsal]&&(
              <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px",marginTop:10,borderLeft:"3px solid rgba(232,200,122,0.5)"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 4px"}}>{openSinsal}</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0}}>{R.sinsal_detail[openSinsal]}</p>
              </div>
            )}
          </div>
          {/* 합충 — 클릭시 상세 설명 */}
          <div>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 8px"}}>🌊 합충 · 특수관계 (클릭하면 상세 설명)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {R.hap.map(function(h){return(
                <button key={h} onClick={function(){setOpenHap(openHap===h?null:h);}} style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:openHap===h?"rgba(74,144,217,0.2)":"rgba(74,144,217,0.08)",border:"1px solid rgba(74,144,217,0.35)",color:"#2A6DB5",cursor:"pointer",fontFamily:"'Noto Serif KR',serif"}}>{h}</button>
              );})}
            </div>
            {openHap&&R.hap_detail&&R.hap_detail[openHap]&&(
              <div style={{background:"rgba(74,144,217,0.06)",borderRadius:10,padding:"12px 14px",marginTop:10,borderLeft:"3px solid rgba(74,144,217,0.4)"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#2A6DB5",margin:"0 0 4px"}}>{openHap}</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.8,margin:0}}>{R.hap_detail[openHap]}</p>
              </div>
            )}
          </div>
        </Section>

        {/* ③ 핵심 키워드 + 성격 */}
        <Section title="🧬 타고난 기질 · 성격">
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {R.keywords.map(function(k){return(
              <div key={k} style={{flex:1,background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.3)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <p style={{fontSize:12,fontWeight:700,color:"#7A5C00",margin:0}}>{k}</p>
              </div>
            );})}
          </div>
          <SectionTitle emoji="💎" text={R.personality.title}/>
          {R.personality.text.map(function(t,i){return <Para key={i} text={t}/> ;})}

          {/* 일주론 상세 */}
          {R.ilju&&(
            <div style={{background:"rgba(232,200,122,0.05)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:12,padding:"14px",marginTop:12}}>
              <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,letterSpacing:2,margin:"0 0 10px"}}>✦ 60갑자 일주론 — {R.ilju.title}</p>
              <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 3px"}}>납음오행 · {R.ilju.nabaum}</p>
                <p style={{fontSize:11,color:"#333",lineHeight:1.7,margin:0}}>{R.ilju.nabaum_desc}</p>
              </div>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:"0 0 8px"}}><strong>기질:</strong> {R.ilju.char}</p>
              <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:"0 0 4px"}}><strong>주의:</strong> {R.ilju.caution}</p>
            </div>
          )}
        </Section>

        {/* 지장간 분석 */}
        <Section title="☯️ 지장간 (地藏干) 분석">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 12px"}}>지지 속에 숨겨진 천간이에요. 표면에 드러나지 않지만 실제로 사주를 움직이는 숨겨진 힘이에요.</p>
          {R.jijanggan&&R.jijanggan.map(function(j,i){return(
            <div key={i} style={{marginBottom:10,padding:"10px 12px",background:"rgba(0,0,0,0.02)",borderRadius:10,border:"1px solid rgba(0,0,0,0.05)"}}>
              <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 6px"}}>{j.pillar}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {j.items.map(function(item,k){return(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:item.type==="정기"?"rgba(232,200,122,0.12)":"rgba(116,185,255,0.08)",borderRadius:20,border:item.type==="정기"?"1px solid rgba(232,200,122,0.3)":"1px solid rgba(116,185,255,0.2)"}}>
                    <span style={{fontSize:14,fontWeight:700,color:item.type==="정기"?"#7A5C00":"#4A90D9"}}>{item.gan}</span>
                    <span style={{fontSize:9,color:"rgba(0,0,0,0.4)",padding:"1px 5px",background:"rgba(0,0,0,0.05)",borderRadius:8}}>{item.type}</span>
                    <span style={{fontSize:10,color:"#444"}}>{item.meaning}</span>
                  </div>
                );})}
              </div>
            </div>
          );})}
          <p style={{fontSize:10,color:"rgba(0,0,0,0.35)",lineHeight:1.65,margin:"4px 0 0"}}>정기(正氣) = 가장 강한 기운 · 중기 = 중간 기운 · 여기(餘氣) = 남은 기운</p>
        </Section>

        {/* 12운성 분석 */}
        <Section title="🌊 12운성 (十二運星) 분석">
          <p style={{fontSize:11,color:"rgba(0,0,0,0.5)",lineHeight:1.7,margin:"0 0 10px"}}>사주 각 기둥에서 일간의 기운이 어느 단계에 있는지를 보여줘요. 현재 대운의 12운성이 지금 삶의 흐름을 결정해요.</p>
          {R.unsung_12&&(
            <>
              <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <p style={{fontSize:11,fontWeight:700,color:"#7A5C00",margin:"0 0 4px"}}>⚡ 현재 대운 12운성 — {R.unsung_12.current_unsung}</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{R.unsung_12.current_desc}</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {R.unsung_12.pillars_unsung.map(function(u,i){return(
                  <div key={i} style={{padding:"10px 12px",background:"rgba(0,0,0,0.02)",borderRadius:10,border:"1px solid rgba(0,0,0,0.05)"}}>
                    <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 2px"}}>{u.pillar}</p>
                    <p style={{fontSize:13,fontWeight:700,color:"#7A5C00",margin:"0 0 3px"}}>{u.unsung}</p>
                    <p style={{fontSize:10,color:"#555",lineHeight:1.6,margin:0}}>{u.desc}</p>
                  </div>
                );})}
              </div>
            </>
          )}
        </Section>

        {/* ④ 재물운 */}
        <Section title="💰 재물운 · 돈복 분석">
          <SectionTitle emoji="💰" text={R.money.title}/>
          <ScoreBar score={R.money.score}/>
          {R.money.text.map(function(t,i){return <Para key={i} text={t}/> ;})}
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 8px"}}>💡 {DEMO_NAME}님 사주에 맞는 재물 방식</p>
            {R.money.advice.map(function(a,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 5px",paddingLeft:8,borderLeft:"2px solid rgba(232,200,122,0.5)"}}>{a}</p>;})}
          </div>
          <InfoGrid items={[["🔢 행운 숫자",R.money.lucky.num],["🎨 행운 색",R.money.lucky.color],["🧭 행운 방향",R.money.lucky.dir],["📅 행운 요일",R.money.lucky.day]]}/>
        </Section>

        {/* ⑤ 연애·결혼운 */}
        <Section title="❤️ 연애 · 결혼운">
          <SectionTitle emoji="💘" text={R.love.title}/>
          <ScoreBar score={R.love.score} color="linear-gradient(90deg,#FF7675,#C62828)"/>
          {R.love.text.map(function(t,i){return <Para key={i} text={t}/> ;})}
          <InfoGrid items={[["💚 잘 맞는 상대",R.love.match.good],["⚠️ 주의 상대",R.love.match.bad],["💘 인연 시기",R.love.match.timing],["🌸 도화살","이성에게 매력적으로 보여요"]]}/>
        </Section>

        {/* ⑥ 건강운 */}
        <Section title="🌿 건강운 · 체질 분석">
          <SectionTitle emoji="🌿" text={R.health.title}/>
          <ScoreBar score={R.health.score} color="linear-gradient(90deg,#7CB87B,#2E7D32)"/>
          {R.health.text.map(function(t,i){return <Para key={i} text={t}/> ;})}
          <div style={{marginBottom:12}}>
            <p style={{fontSize:10,color:"#C62828",fontWeight:700,margin:"0 0 8px"}}>⚠️ 주의 부위</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {R.health.weak.map(function(w){return <Tag key={w} text={w} color="rgba(255,80,80,0.08)"/>;})}
            </div>
          </div>
          <div style={{background:"rgba(124,184,123,0.06)",border:"1px solid rgba(124,184,123,0.25)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <p style={{fontSize:10,color:"#2E7D32",fontWeight:700,margin:"0 0 8px"}}>💡 체질 맞춤 건강 관리</p>
            {R.health.care.map(function(c,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 5px",paddingLeft:8,borderLeft:"2px solid rgba(124,184,123,0.4)"}}>{c}</p>;})}
          </div>
          <div style={{background:"#F9F7F2",borderRadius:10,padding:"10px 12px"}}>
            <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>특히 주의할 시기</p>
            <p style={{fontSize:11,fontWeight:700,color:"#333",margin:0}}>{R.health.caution}</p>
          </div>
        </Section>

        {/* ⑦ 직업·사업운 */}
        <Section title="💼 직업 · 사업운">
          <SectionTitle emoji="🎯" text={R.career.title}/>
          <ScoreBar score={R.career.score} color="linear-gradient(90deg,#7CB87B,#2E7D32)"/>
          {R.career.text.map(function(t,i){return <Para key={i} text={t}/> ;})}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"rgba(46,125,50,0.06)",border:"1px solid rgba(46,125,50,0.2)",borderRadius:10,padding:"12px"}}>
              <p style={{fontSize:10,color:"#2E7D32",fontWeight:700,margin:"0 0 8px"}}>✓ 잘 맞는 직업군</p>
              {R.career.jobs.map(function(j,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 5px",paddingLeft:8,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{j}</p>;})}
            </div>
            <div style={{background:"rgba(198,40,40,0.04)",border:"1px solid rgba(198,40,40,0.15)",borderRadius:10,padding:"12px"}}>
              <p style={{fontSize:10,color:"#C62828",fontWeight:700,margin:"0 0 8px"}}>✗ 피하면 좋을 것</p>
              {R.career.notJobs.map(function(j,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 5px",paddingLeft:8,borderLeft:"2px solid rgba(198,40,40,0.25)"}}>{j}</p>;})}
            </div>
          </div>
        </Section>

        {/* ⑧ 대운 흐름 */}
        <Section title="🔄 대운 흐름 — 10년 단위 인생의 큰 그림">
          <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",lineHeight:1.7,margin:"0 0 14px"}}>{DEMO_NAME}님 인생의 흐름을 10년 단위로 보면 이렇게 나와요. 지금 어떤 대운을 흐르고 있는지 알면 지금 이 시기가 어떤 시간인지 이해할 수 있어요.</p>
          {R.daeun.map(function(d){return(
            <div key={d.age} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,padding:"12px",background:d.now?"rgba(232,200,122,0.08)":"rgba(0,0,0,0.02)",border:d.now?"1px solid rgba(232,200,122,0.35)":"1px solid rgba(0,0,0,0.05)",borderRadius:12}}>
              <div style={{flexShrink:0,textAlign:"center"}}>
                <div style={{width:44,height:44,borderRadius:10,background:d.now?"rgba(232,200,122,0.2)":"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:3}}>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:14,color:d.now?"#7A5C00":"rgba(0,0,0,0.5)",fontWeight:700,margin:0,lineHeight:1}}>{d.sky}</p>
                    <p style={{fontSize:14,color:d.now?"#C4922A":"rgba(0,0,0,0.4)",fontWeight:700,margin:0,lineHeight:1}}>{d.earth}</p>
                  </div>
                </div>
                {d.now&&<span style={{fontSize:8,color:G,fontWeight:700}}>현재</span>}
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:11,fontWeight:700,color:d.now?"#7A5C00":"rgba(0,0,0,0.6)",margin:"0 0 4px"}}>{d.age}</p>
                <p style={{fontSize:11,color:"rgba(0,0,0,0.55)",lineHeight:1.65,margin:0}}>{d.text}</p>
              </div>
            </div>
          );})}
          <div style={{background:"rgba(232,200,122,0.06)",borderRadius:10,padding:"12px 14px"}}>
            <p style={{fontSize:11,color:"#333",lineHeight:1.8,margin:0}}>
              {DEMO_NAME}님은 지금 35~44세 을축 대운을 흐르고 있어요. 안정 속에서 전문성을 쌓는 시기예요. 이 대운에서 기반을 얼마나 단단히 하느냐가 다음 대운(45세~)의 황금기를 결정해요. 지금 이 시간이 투자 기간이에요.
            </p>
          </div>
        </Section>

        {/* ⑨ 개운법 */}
        <Section title="✨ 개운법 · 행운 정보">
          <SectionTitle emoji="🌟" text="용신 기반 맞춤 개운법"/>
          <p style={{fontSize:12,color:"rgba(0,0,0,0.55)",lineHeight:1.7,margin:"0 0 12px"}}>{DEMO_NAME}님의 용신은 수(水)예요. 수 기운을 보충하고 활성화하는 것이 운을 높이는 핵심이에요.</p>
          {R.gaeun.map(function(g,i){return(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,padding:"10px 12px",background:"rgba(232,200,122,0.04)",borderRadius:10,borderLeft:"3px solid rgba(232,200,122,0.4)"}}>
              <span style={{fontSize:16,flexShrink:0}}>✨</span>
              <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{g}</p>
            </div>
          );})}
        </Section>

        {/* ⑩ 마무리 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"22px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.85,margin:"0 0 8px",wordBreak:"keep-all"}}>
            💫 {DEMO_NAME}님의 사주는 뒤늦게 피는 꽃이에요.<br/>
            지금 이 시간이 {DEMO_NAME}님을 더 단단하게 만들고 있어요.<br/>
            <span style={{fontSize:13,fontWeight:600}}>당신은 세상을 정교하게 다듬는 가장 아름다운 조각칼입니다.</span>
          </p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 사주 분석의 메시지</p>
        </div>

        {/* ⑪ 크로스셀링 */}
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

        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>#천기사주 #사주풀이 #운명 #팔자</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:"white",padding:20}}>로딩 중...</div>;
}
