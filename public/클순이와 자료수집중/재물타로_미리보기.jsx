import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
const DEMO_NAME = "규미";

// ━━━ 78장 카드 전체 ━━━
const CARDS=[
  {id:0,display:"바보",name:"봇짐 멘 유랑 선비",keyword:"새로운 시작, 모험",good:true,money:"예상치 못한 방향에서 수입이 생길 수 있어요. 지금 무모해 보이는 도전이 오히려 재물을 열어줄 수 있어요."},
  {id:1,display:"마법사",name:"도사 전우치",keyword:"의지력, 창조",good:true,money:"지금 가진 능력과 자원을 최대한 활용하면 충분히 해낼 수 있어요. 이미 필요한 것은 다 갖추고 있어요."},
  {id:2,display:"여사제",name:"국무 대무당",keyword:"직관, 잠재력",good:true,money:"지금 당장은 보이지 않지만 좋은 기회가 숨어있어요. 직관을 믿고 조금 더 기다려보세요."},
  {id:3,display:"여황제",name:"모후 중전마마",keyword:"풍요, 자연",good:true,money:"풍요의 기운이 강해요. 지금 씨앗을 심으면 수확이 풍성할 거예요. 투자나 사업 확장에 좋은 신호예요."},
  {id:4,display:"황제",name:"곤룡포를 입은 왕",keyword:"권위, 안정",good:true,money:"재물의 기반이 튼튼해지는 시기예요. 장기적이고 안정적인 재무 계획을 세우기 좋아요."},
  {id:5,display:"교황",name:"대제학 큰 스승",keyword:"전통, 안내",good:true,money:"검증된 방법과 전통적인 투자 방식이 지금 가장 안전해요. 신뢰할 수 있는 전문가의 조언을 구해보세요."},
  {id:6,display:"연인",name:"견우와 직녀",keyword:"선택, 조화",good:true,money:"중요한 재무적 선택의 순간이 왔어요. 두 가지 옵션 중 하나를 골라야 할 때, 마음이 끌리는 쪽이 맞아요."},
  {id:7,display:"전차",name:"거북선 위 장군",keyword:"승리, 전진",good:true,money:"지금 적극적으로 나아갈 때예요. 망설임은 금물이에요. 추진력 있게 행동하면 재물이 따라와요."},
  {id:8,display:"힘",name:"해태를 길들이는 여인",keyword:"용기, 인내",good:true,money:"포기하지 않는 것이 재물을 여는 열쇠예요. 지금 힘들어도 버티면 반드시 결실이 있어요."},
  {id:9,display:"은둔자",name:"산속의 고승",keyword:"내면탐구, 지혜",good:true,money:"지금은 조용히 내실을 다질 시기예요. 화려한 투자보다 저축과 절약이 지금 가장 현명한 선택이에요."},
  {id:10,display:"운명의 수레바퀴",name:"사방신과 윤도",keyword:"변화, 순환",good:true,money:"재물의 흐름이 바뀌는 전환점이에요. 곧 좋은 변화가 찾아올 거예요. 준비하고 있으세요."},
  {id:11,display:"정의",name:"암행어사 판관",keyword:"균형, 인과",good:true,money:"공정한 보상이 돌아오는 시기예요. 그동안 열심히 한 것들에 대한 정당한 대가를 받게 될 거예요."},
  {id:12,display:"매달린 사람",name:"유배된 유학자",keyword:"희생, 새 관점",good:false,money:"지금은 억지로 움직이는 것보다 기다리는 것이 나아요. 잠시 멈추고 다른 각도에서 재물 흐름을 봐보세요."},
  {id:13,display:"죽음",name:"저승사자",keyword:"변환, 해방",good:false,money:"기존의 재무 방식이 끝나고 새로운 방식이 시작되는 시기예요. 묵은 것을 정리해야 새로운 재물이 들어와요."},
  {id:14,display:"절제",name:"물을 나누는 선녀",keyword:"조화, 균형",good:true,money:"수입과 지출의 균형이 재물의 핵심이에요. 과하지도 부족하지도 않게 조율하는 것이 지금 가장 중요해요."},
  {id:15,display:"악마",name:"도깨비",keyword:"속박, 욕망",good:false,money:"충동 구매, 도박성 투자, 탐욕이 재물을 갉아먹고 있어요. 감정적 소비 패턴을 당장 점검해야 해요."},
  {id:16,display:"탑",name:"벼락 맞는 경회루",keyword:"변화, 해방",good:false,money:"예상치 못한 큰 지출이나 재무적 충격이 올 수 있어요. 비상금을 마련하고 리스크를 최소화하세요."},
  {id:17,display:"별",name:"칠성신",keyword:"희망, 치유",good:true,money:"어두웠던 재물 상황에 희망이 보이기 시작해요. 포기하지 않으면 반드시 빛이 들어올 거예요."},
  {id:18,display:"달",name:"달토끼와 월궁",keyword:"환상, 불안",good:false,money:"지금 보이는 것이 전부가 아닐 수 있어요. 달콤한 재물 제안에는 숨겨진 함정이 있을 수 있어요. 신중하게요."},
  {id:19,display:"태양",name:"해님과 동자",keyword:"성공, 활력",good:true,money:"재물운이 최고조에 달해있어요. 지금이 적극적으로 행동할 최적의 타이밍이에요. 자신감을 가지세요."},
  {id:20,display:"심판",name:"나팔 부는 신선",keyword:"부활, 전환점",good:true,money:"재물과 관련된 중요한 결정을 내려야 할 때예요. 오래 미뤄온 재무 계획을 지금 실행에 옮기세요."},
  {id:21,display:"세계",name:"천하도 속 무희",keyword:"완성, 성취",good:true,money:"재물 목표가 완성되는 시기예요. 오랫동안 노력해온 것들이 결실을 맺을 준비가 되어있어요."},
  ...Array.from({length:56},(_,i)=>{
    var suits=["붓","청자","환도","엽전"];
    var suit=suits[Math.floor(i/14)];
    var num=(i%14)+2;
    var good=i%3!==0;
    var moneyMsg=good
      ?"이 카드가 나온 자리에서 "+suit+"의 기운이 재물 흐름을 돕고 있어요. 지금 하고 있는 방향이 맞아요."
      :"이 카드가 나온 자리에서 잠시 점검이 필요해요. 무리하게 밀어붙이기보다 한 발짝 물러서서 보세요.";
    return {id:22+i,display:suit+" "+num,name:suit+" "+num,keyword:"신비로운 기운",good:good,money:moneyMsg};
  })
];

// ━━━ 카드 위치 × 재정상황 × 정역방향 풍성한 해석 ━━━
const POS_RICH = {
  pos0: { // 현재 재물 상태
    good: {
      "🔥 빠듯하지만 어떻게든 버티고 있어":
        DEMO_NAME+"님, 솔직히 말할게요. 빠듯하게 버티고 있는 지금 이 상황, 이 카드가 인정해주고 있어요. "+
        "겉으로는 여전히 힘들어 보여도 재물의 흐름이 이미 바뀌기 시작했다는 신호예요. "+
        "지금 느끼는 불안과 걱정, 이해해요. 근데 카드는 지금이 바닥이 아니라고 말하고 있어요. "+
        "이미 반등의 에너지가 쌓이고 있어요. 3~6주 안에 예상치 못한 수입 루트가 열릴 수 있어요. "+
        "지금까지 포기하지 않고 버텨온 것, 그 인내가 헛되지 않았어요. 버티는 것 자체가 실력이에요.",
      "😰 진짜 힘들어, 당장 돌파구가 필요해":
        DEMO_NAME+"님, 정말 많이 힘드시죠. 그 감정 충분히 이해해요. "+
        "근데요, 이 카드가 이 자리에 나온 건 아주 중요한 신호예요. "+
        "가장 힘든 시기에 빛이 보이기 시작한다는 패턴, 들어보셨죠? 지금이 딱 그 순간이에요. "+
        "카드가 보여주는 건 지금 이 바닥이 전환점이라는 거예요. 바닥을 찍으면 올라가는 일만 남아요. "+
        "당장 이번 주에 할 수 있는 가장 작은 재무 행동 하나를 실행해보세요. 그게 흐름을 바꾸는 시작이 돼요.",
      "😊 나쁘진 않은데 더 잘 하고 싶어":
        DEMO_NAME+"님, 지금 기반이 어느 정도 갖춰져 있는 상태에서 이 카드가 나왔다는 건 정말 좋은 신호예요. "+
        "현재 재물 상태 자리에 긍정적인 기운이 나왔다는 건 지금 출발점이 나쁘지 않다는 뜻이에요. "+
        "이 안정 위에 무언가를 더 쌓을 최적의 타이밍이에요. "+
        "너무 신중하게 기다리기보다 지금 바로 다음 단계를 시작해보세요. 기회는 준비된 사람에게 찾아와요.",
      "💪 잘 되고 있어, 다음 단계가 궁금해":
        DEMO_NAME+"님, 잘 하고 계세요! 이 카드가 현재 자리에 나온 건 지금의 좋은 흐름이 실제로 존재한다는 확인이에요. "+
        "카드가 현실을 보여주고 있는 거예요. 지금 레벨업할 타이밍이에요. "+
        "더 큰 그림을 그릴 때가 됐어요. 지금 잘 되는 이 에너지를 다음 단계로 연결하는 구체적인 계획을 세워보세요.",
      "🎉 곧 큰돈이 들어올 것 같은 기대감!":
        DEMO_NAME+"님, 그 기대감, 틀리지 않았어요. 카드도 같은 말을 하고 있어요. "+
        "그 직관을 믿으세요. 재물의 기운이 "+DEMO_NAME+"님 방향으로 향하고 있어요. "+
        "단, 들어오는 돈을 어떻게 쓸지 지금 미리 계획해두는 게 중요해요. "+
        "좋은 기운이 왔을 때 현명하게 쓸 준비가 되어있어야 다음 단계로 나아갈 수 있어요.",
    },
    bad: {
      "🔥 빠듯하지만 어떻게든 버티고 있어":
        DEMO_NAME+"님, 카드가 지금 재물 기운이 정체되어 있다고 솔직하게 말해요. "+
        "수입보다 지출이 많거나, 재물이 손에 들어오지 않는 느낌이 드시죠? 그 느낌 맞아요. "+
        "근데 이걸 알고 대비하는 사람은 달라요. 지금 당장 해야 할 것은 딱 하나, 지출 구조를 점검하는 거예요. "+
        "고정 지출 중 줄일 수 있는 것, 무의식적으로 새고 있는 돈을 이번 주 안에 확인해보세요. "+
        "위기를 기회로 바꾸는 사람은 이 힘든 시기에 기반을 다져요. "+DEMO_NAME+"님도 할 수 있어요.",
      "😰 진짜 힘들어, 당장 돌파구가 필요해":
        DEMO_NAME+"님, 카드가 지금 상황을 정직하게 보여주고 있어요. 힘든 거 맞아요. "+
        "하지만 이 카드가 경고를 보내는 건 빠져나갈 방법을 찾으라는 신호이기도 해요. "+
        "지금 당장 급한 불을 끄는 것이 먼저예요. 작은 것이라도 실행하세요. "+
        "당장 오늘, 통장 잔고를 확인하고 나가는 돈 중 하나를 줄여보세요. 그 작은 행동이 흐름을 바꿔요.",
      "😊 나쁘진 않은데 더 잘 하고 싶어":
        DEMO_NAME+"님, 지금 상황이 나쁘진 않지만 카드가 방심하지 말라고 경고해요. "+
        "지금의 안정이 영원하지 않을 수 있어요. 비상금과 지출 관리를 지금 시작해두세요. "+
        "좋을 때 준비하는 사람이 나중에 위기를 버텨낼 수 있어요.",
      "💪 잘 되고 있어, 다음 단계가 궁금해":
        DEMO_NAME+"님, 잘 되고 있는 건 맞는데 카드가 지금 한 발 멈추라고 말하고 있어요. "+
        "너무 빠르게 확장하면 기반이 흔들릴 수 있어요. 지금은 속도보다 안정이 먼저예요. "+
        "충분히 기반을 다진 후에 더 크게 나아가면 훨씬 오래 갈 수 있어요.",
      "🎉 곧 큰돈이 들어올 것 같은 기대감!":
        DEMO_NAME+"님, 기대감은 좋지만 카드가 주의를 당부하고 있어요. "+
        "기대만으로는 돈이 들어오지 않아요. 실질적인 행동이 필요해요. "+
        "그 돈이 들어오기 전에 재무 계획을 먼저 세워두세요. 기대가 현실이 되려면 준비가 있어야 해요.",
    },
  },
  pos1: { // 장애물
    good: {
      default:
        DEMO_NAME+"님, 장애물 자리에 좋은 카드가 나왔다는 건 중요한 의미가 있어요. "+
        "지금 "+DEMO_NAME+"님이 재물의 장애물이라고 생각하는 것의 실체를 들여다보면 "+
        "생각보다 훨씬 작은 문제임을 알게 될 거예요. "+
        "카드가 말하는 건 '"+DEMO_NAME+"님은 이미 그 장벽을 넘을 힘이 있다'는 거예요. "+
        "외부의 장애물이 아니라 내면의 두려움이나 망설임이 더 큰 장벽일 수 있어요. "+
        "지금 망설이고 있는 재무적 결정이 있다면 이번 주 안에 실행해보세요. "+
        "이미 답은 정해져 있어요. 용기만 필요한 거예요.",
    },
    bad: {
      default:
        DEMO_NAME+"님, 장애물 자리에 주의 신호가 나왔어요. 재물 앞에 실질적인 장애물이 존재해요. "+
        "'나는 항상 돈이 부족해', '나는 부자가 될 운이 없어' 같은 생각이 은연중에 재물의 흐름을 막고 있을 수 있어요. "+
        "또는 해결되지 않은 구체적인 재무 문제가 있을 수 있어요. "+
        "채무, 세금, 미납금, 혹은 다른 사람과의 금전적 갈등 같은 것들은 해결하지 않을수록 더 큰 장벽이 돼요. "+
        "지금 당장 직면해야 할 재무 문제를 하나씩 꺼내서 처리해나가세요. "+
        "장애물을 외면하면 재물의 흐름이 계속 막혀있을 수밖에 없어요.",
    },
  },
  pos2: { // 숨겨진 기회
    good: {
      default:
        DEMO_NAME+"님, 지금 시야에 들어오지 않는 곳에 황금 같은 기회가 숨어있어요. "+
        "최근에 스쳐 지나간 제안, 무심코 받은 연락, 오래된 지인의 소식을 다시 살펴보세요. "+
        "그 안에 재물의 씨앗이 있을 수 있어요. "+
        "특히 "+DEMO_NAME+"님의 기존 능력이나 경험을 활용한 부업이나 수익화 아이디어에 주목해보세요. "+
        "완전히 새로운 분야보다 이미 잘하는 것에서 기회를 찾는 게 지금은 훨씬 더 효과적이에요. "+
        "카드가 말하는 기회는 멀리 있는 게 아니에요. "+DEMO_NAME+"님 주변에 이미 있어요.",
    },
    bad: {
      default:
        DEMO_NAME+"님, 기회가 보이더라도 지금은 신중하게 판단해야 할 때예요. "+
        "달콤해 보이는 제안일수록 뒤에 함정이 있을 수 있어요. "+
        "특히 빠른 수익을 약속하는 투자, 지인을 통한 사업 제안, 보증이나 연대 서명 요청은 "+
        "이번에는 거절하는 것이 맞아요. "+
        "진짜 기회는 서두르지 않아도 도망가지 않아요. "+
        "지금 당장 큰 수익보다 안전하게 가진 것을 지키는 게 더 현명한 선택이에요.",
    },
  },
  pos3: { // 단기 전망
    good: {
      "🔥 빠듯하지만 어떻게든 버티고 있어":
        "앞으로 한 달 안에 재물 흐름에 눈에 띄는 변화가 생길 가능성이 높아요. "+
        "예상보다 빠르게 수입이 들어오거나, 예상치 못한 곳에서 절약이 될 수 있어요. "+
        "작은 것이라도 놓치지 말고 붙잡으세요. 이 시기에 들어오는 돈의 20% 이상은 반드시 저축하겠다는 규칙을 오늘부터 세워보세요. "+
        "이 한 달이 앞으로의 재물 흐름을 바꾸는 중요한 시간이 될 거예요.",
      "😰 진짜 힘들어, 당장 돌파구가 필요해":
        "한 달 안에 작은 숨통이 트일 수 있어요. 당장 큰돈은 아니더라도, 막혔던 부분이 조금씩 풀리기 시작할 거예요. "+
        "그 흐름을 잘 붙잡아야 해요. 작은 변화를 무시하지 마세요. "+
        "이 시기에 들어오는 작은 수입 하나하나가 나중에 큰 흐름을 만들어요.",
      "😊 나쁘진 않은데 더 잘 하고 싶어":
        "이번 달 안에 좋은 기회가 하나 이상 생길 거예요. 작아 보여도 무시하지 마세요. "+
        "그 작은 기회가 큰 흐름의 시작일 수 있어요. "+
        "평소보다 주변 이야기에 귀 기울이고, 새로운 제안에 열린 마음으로 접근해보세요.",
      "💪 잘 되고 있어, 다음 단계가 궁금해":
        "지금 잘 되는 흐름이 앞으로 한 달 더 이어질 거예요. "+
        "이 시기에 다음 단계 준비를 해두세요. 좋은 흐름일 때 준비한 것들이 나중에 더 큰 결실을 맺어요.",
      "🎉 곧 큰돈이 들어올 것 같은 기대감!":
        "그 기대감이 현실이 될 가능성이 높아요. 이번 달 안에 좋은 소식이 올 수 있어요. "+
        "그 돈이 들어왔을 때 어떻게 쓸지 지금 미리 계획해두는 게 중요해요.",
    },
    bad: {
      default:
        "앞으로 한 달 정도는 재물 상황이 크게 나아지기 어려울 수 있어요. "+
        "하지만 작은 성공을 만드는 것에 집중하세요. "+
        "아무리 작은 금액이라도 저축을 시작하거나, 한 가지 불필요한 지출을 끊는 것만으로도 "+
        "재물 기운이 서서히 돌아오기 시작해요. "+
        "큰 변화를 기대하지 말고 작은 규율을 지키는 데 집중하세요. "+
        "이 시기를 버티는 사람이 다음 상승장을 탈 수 있어요.",
    },
  },
  pos4: { // 최종 조언
    good: {
      default:
        DEMO_NAME+"님, 카드 배열 전체를 종합한 최종 메시지는 명확해요. 지금이 바로 그 타이밍이에요. "+
        "오랫동안 고민만 해왔던 투자, 사업, 부업, 저축 계획이 있다면 이번 달 안에 첫 발을 내딛어야 해요. "+
        "완벽한 준비를 기다리다가는 이 좋은 기운이 지나갈 수 있어요. "+
        "가장 작은 단위로 시작하세요. 10만원이든 한 시간이든, 오늘 실행하는 것이 아무리 큰 계획보다 가치있어요. "+
        "카드는 분명히 말하고 있어요. 지금 움직이는 사람이 재물을 잡아요.",
    },
    bad: {
      default:
        DEMO_NAME+"님, 카드가 전하는 최종 메시지는 지금 당장의 수익보다 기반을 다지라는 거예요. "+
        "빠른 돈을 좇다가 가진 것마저 잃는 실수를 이 카드가 경고하고 있어요. "+
        "지금 있는 자리에서 한 단계씩, 검증된 방법으로 나아가세요. "+
        "6개월 후를 바라보고 오늘을 계획하세요. "+
        "당장의 불편함을 참고 기반을 다지는 사람이 결국 더 큰 재물을 얻어요. "+
        "지금 이 시기가 "+DEMO_NAME+"님을 더 단단하게 만들고 있어요.",
    },
  },
};

// ━━━ 재정상황별 종합 해석 ━━━
const SYN = {
  "🔥 빠듯하지만 어떻게든 버티고 있어": {
    good: DEMO_NAME+"님, 5장의 카드가 종합적으로 긍정적인 흐름을 보여주고 있어요. "+
      "빠듯하게 버티고 있는 지금, 그 인내가 헛되지 않아요. "+
      "카드가 말하는 건 지금 이 힘든 시기가 더 큰 도약을 위한 준비 기간이라는 거예요. "+
      "3개월 안에 의미 있는 변화가 찾아올 거예요. "+
      "지금 이 흐름을 타려면 오늘부터 단 하나의 재무 규칙이라도 만들고 지켜보세요. "+
      "예를 들어 '매달 5만원은 무조건 저축한다', '충동 구매 전 24시간 기다린다' 같은 거요. "+
      "작은 규칙 하나가 재물의 흐름을 바꾸는 시작이 돼요.",
    bad: DEMO_NAME+"님, 카드가 지금 신중함을 강하게 요구하고 있어요. "+
      "힘든 건 알아요. 근데 지금 무리한 확장이나 빠른 해결책을 찾으려 하면 더 힘들어질 수 있어요. "+
      "지금은 버티는 것 자체가 실력이에요. "+
      "지출 구조를 점검하고, 작은 규율 하나를 지키는 것부터 시작해보세요. "+
      "이 시기를 버티고 나면 더 단단해진 재무 기반이 "+DEMO_NAME+"님을 기다리고 있을 거예요.",
  },
  "😰 진짜 힘들어, 당장 돌파구가 필요해": {
    good: DEMO_NAME+"님, 정말 많이 힘드시죠. 근데 오늘 뽑힌 5장이 희망적인 신호를 보내고 있어요. "+
      "지금 이 바닥이 전환점이에요. 바닥을 찍으면 올라가는 일만 남아요. "+
      "당장 큰 변화가 아니어도 좋아요. 이번 주에 할 수 있는 가장 작은 재무 행동 하나를 실행해보세요. "+
      "그 작은 행동이 흐름을 바꾸는 시작이 돼요. "+DEMO_NAME+"님은 이 아픔보다 훨씬 강한 사람이에요.",
    bad: DEMO_NAME+"님, 카드가 솔직하게 말하고 있어요. 지금 당장 큰 해결책은 없어요. "+
      "하지만 이걸 알고 준비하는 사람은 달라요. "+
      "지금 당장 가장 급한 재무 문제 하나만 집중해서 해결해보세요. "+
      "동시에 여러 개를 해결하려 하면 다 놓쳐요. 하나씩, 천천히, 그리고 확실하게.",
  },
  "😊 나쁘진 않은데 더 잘 하고 싶어": {
    good: DEMO_NAME+"님, 좋아요. 지금 안정된 기반에서 더 올라갈 수 있는 타이밍이에요. "+
      "카드가 지금 레벨업의 기운을 보여주고 있어요. "+
      "너무 신중하게 기다리지 마세요. 지금이 바로 다음 단계를 시작할 때예요. "+
      "지금 하고 있는 것보다 한 단계 더 나아가는 구체적인 계획을 이번 주 안에 세워보세요.",
    bad: DEMO_NAME+"님, 지금 상황이 나쁘진 않지만 카드가 방심하지 말라고 경고해요. "+
      "좋은 때일수록 비상금을 쌓고 지출을 관리하는 게 중요해요. "+
      "지금의 안정이 영원하지 않을 수 있어요. 미리 준비하는 사람이 나중에 웃어요.",
  },
  "💪 잘 되고 있어, 다음 단계가 궁금해": {
    good: DEMO_NAME+"님, 잘 하고 계세요! 카드도 확인해주고 있어요. "+
      "지금 더 큰 그림을 그릴 타이밍이에요. 이 좋은 흐름을 유지하면서 다음 단계를 준비하세요. "+
      "지금 레벨업하기에 가장 좋은 시기예요. 망설임은 이 기운을 소모시켜요.",
    bad: DEMO_NAME+"님, 잘 되고 있는 건 맞는데 카드가 한 발 멈추라고 말하고 있어요. "+
      "너무 빠르게 확장하면 기반이 흔들릴 수 있어요. "+
      "지금은 속도보다 안정이 먼저예요. 기반이 탄탄할수록 더 높이 올라갈 수 있어요.",
  },
  "🎉 곧 큰돈이 들어올 것 같은 기대감!": {
    good: DEMO_NAME+"님, 그 기대감 틀리지 않았어요! 카드도 같은 말을 하고 있어요. "+
      "그 돈이 들어왔을 때 어떻게 쓸지 지금 미리 계획해두는 게 중요해요. "+
      "들어오는 돈을 어떻게 관리하느냐에 따라 다음 단계가 완전히 달라지니까요.",
    bad: DEMO_NAME+"님, 기대감은 좋지만 카드가 조금 신중하게 접근하라고 말해요. "+
      "기대만으로는 안 되고 실질적인 행동이 필요해요. "+
      "그 돈이 들어오기 전에 재무 계획을 먼저 세워두세요.",
  },
};

// ━━━ 마무리 확언 ━━━
const AFFIRMATION = {
  "🔥 빠듯하지만 어떻게든 버티고 있어": {good:"💫 "+DEMO_NAME+"님, 버티는 것 자체가 이미 실력이에요. 이 시기가 지나면 더 단단해져 있을 거예요.", bad:"💫 "+DEMO_NAME+"님, 지금 이 힘든 시간이 "+DEMO_NAME+"님을 더 강하게 만들고 있어요. 포기하지 마세요."},
  "😰 진짜 힘들어, 당장 돌파구가 필요해": {good:"💫 "+DEMO_NAME+"님, 바닥을 찍으면 올라가는 일만 남아요. "+DEMO_NAME+"님은 이 아픔보다 훨씬 강한 사람이에요.", bad:"💫 "+DEMO_NAME+"님, 작은 행동 하나가 큰 변화의 시작이에요. 오늘 딱 하나만 실행해보세요."},
  "😊 나쁘진 않은데 더 잘 하고 싶어": {good:"💫 "+DEMO_NAME+"님은 이미 좋은 기반 위에 서 있어요. 이제 더 높이 올라갈 일만 남았어요.", bad:"💫 "+DEMO_NAME+"님, 좋을 때 준비하는 사람이 진짜 부자가 돼요."},
  "💪 잘 되고 있어, 다음 단계가 궁금해": {good:"💫 "+DEMO_NAME+"님, 지금 잘 하고 있어요. 이 흐름 믿고 더 크게 나아가세요!", bad:"💫 "+DEMO_NAME+"님, 기반이 탄탄할수록 더 높이 올라갈 수 있어요."},
  "🎉 곧 큰돈이 들어올 것 같은 기대감!": {good:"💫 "+DEMO_NAME+"님의 그 직관이 맞아요. 준비된 사람에게 기회가 찾아와요!", bad:"💫 "+DEMO_NAME+"님, 기대감을 행동으로 뒷받침하면 반드시 이루어져요."},
};

// ━━━ 투자 OK/NG ━━━
const INVEST = {
  good: {ok:["이미 검증된 방식의 소규모 시작","본업 역량 활용한 부업·수익화","장기 적립식 저축·투자","주변 인맥을 활용한 기회 탐색"],ng:["지인 소개 투자·보증","단기 고수익 보장 상품","전 재산 단일 집중 투자"]},
  bad:  {ok:["고정 지출 점검 및 절감","비상금 3개월치 목표 저축","소액이라도 꾸준한 적립","기존 채무 하나씩 해결"],ng:["새로운 투자 시작","빠른 수익 노리는 단기 투자","지인 사업 참여·보증","감정적 소비·충동 구매"]},
};

// ━━━ 행운 정보 ━━━
function getLucky(seed){
  var r=(function(s){var n=(s>>>0)||1;return function(){n=(n*1664525+1013904223)>>>0;return n/0x100000000;}})(seed);
  return {
    num:["3","8","17","26","44","7","12"][Math.floor(r()*7)],
    color:["금색 💛","진녹색 🌿","하늘색 🩵","붉은 주황 🧡"][Math.floor(r()*4)],
    dir:["동쪽·남동쪽","남쪽","북동쪽"][Math.floor(r()*3)],
    item:["노란 지갑","동전 저금통","식물 한 화분","금색 소품","통장 정리"][Math.floor(r()*5)],
    day:["매주 목요일","매월 3일","매월 8일","매주 화요일"][Math.floor(r()*4)],
    avoid:["매주 월요일","매월 13일 전후","보름달 다음날"][Math.floor(r()*3)],
  };
}

// ━━━ 크로스셀링 ━━━
const CROSS=[
  {emoji:"🔮",title:"사주 풀이",desc:"사주로 보는 진짜 재물운의 흐름",price:"980원"},
  {emoji:"✋",title:"손금 보기",desc:"손에 새겨진 재물선·성공선 분석",price:"380원"},
  {emoji:"🔢",title:"수비학",desc:"재물을 부르는 행운 숫자 분석",price:"980원"},
  {emoji:"📅",title:"좋은 날 찾기",desc:"큰 지출·계약·투자의 최적 날짜",price:"980원"},
];

const CFG={
  cardCount:5, price:980,
  subtitle:"✦ 천기 오리지널 · 돈이 오는 날이 보입니다",
  hashtags:"#천기타로 #재물타로 #돈들어오는날 #부자타로",
  positions:["현재 재물 상태","장애물·방해 요소","숨겨진 기회","단기 전망 (1개월)","최종 조언·행동 지침"],
  loading:["금고 자물쇠 따는 중... 🔐","재물신 호출 중... 💸","돈이 오는 방향 추적 중... 🧭","지갑 기운 스캔 중... 👛","ATM 기운 분석 중... 💳"],
  questions:[
    {title:"지금 재물 고민의 핵심은?",icon:"💰",
     opts:["💸 돈이 언제 들어올지 모르겠어","📈 투자·사업 방향을 모르겠어","💳 지출이 너무 많아 통장이 텅텅","🏠 부동산·큰 지출 결정이 있어","🎉 곧 큰돈이 들어올 것 같은 기대감!","💭 기타 (직접 입력)"],
     freeInput:false,skippable:false,placeholder:""},
    {title:"지금 재정 상황을 솔직히 말하면?",icon:"📊",
     opts:["🔥 빠듯하지만 어떻게든 버티고 있어","😰 진짜 힘들어, 당장 돌파구가 필요해","😊 나쁘진 않은데 더 잘 하고 싶어","💪 잘 되고 있어, 다음 단계가 궁금해","💭 기타 (직접 입력)"],
     freeInput:false,skippable:false,placeholder:""},
    {title:"구체적인 고민이 있다면 알려주세요",icon:"✏️",
     opts:[],freeInput:true,skippable:true,
     placeholder:"예: 이번 달 대출 이자가 걱정돼요 / 주식 타이밍인지 모르겠어요 / 부업을 시작해야 할까요"},
  ],
};

function rng(seed){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/0x100000000;};}
function GBtn({children,onClick,dim}){return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;}
function CardBack({size}){var s=size||44;return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:4,border:"1.5px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:s*0.22,filter:"brightness(0.35)"}}>🃏</span></div>;}
function CardFront({card,isReversed,size}){var s=size||90;return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:s*0.08,border:"2px solid rgba(232,200,122,0.5)",overflow:"hidden",position:"relative",transform:isReversed?"rotate(180deg)":"none",boxShadow:"0 0 20px rgba(232,200,122,0.2)",flexShrink:0}}><img src={"/tarot/joseon/"+card.id+".png"} alt={card.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={function(e){e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/><div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:4,position:"absolute",inset:0}}><span style={{fontSize:s*0.25,marginBottom:2}}>🃏</span><p style={{fontSize:Math.max(7,s*0.09),color:G,fontWeight:700,textAlign:"center",margin:0,lineHeight:1.2}}>{card.display}</p></div>{isReversed&&<div style={{position:"absolute",top:3,right:3,fontSize:7,background:"rgba(255,80,80,0.85)",color:"#fff",padding:"1px 4px",borderRadius:4,transform:"rotate(180deg)"}}>역</div>}</div>;}

export default function TaroPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState([]);
  var [freeText,setFreeText]=useState("");
  // 78장 중 5장 선택
  var [selectedCards,setSelectedCards]=useState([]);
  var [cards,setCards]=useState([]);
  var [openCard,setOpenCard]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var ivRef=useRef(null);
  var c=CFG;
  var needed=c.cardCount;

  // 셔플된 78장 순서 (한 번만 생성)
  var shuffledRef=useRef(null);
  if(!shuffledRef.current){
    var arr=CARDS.slice();
    for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}
    shuffledRef.current=arr;
  }
  var deck=shuffledRef.current;

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*4+2);setLoadPct(Math.floor(pct));
      if(Math.random()>0.9)setLoadMsgIdx(function(i){return(i+1)%c.loading.length;});
      if(pct>=100){
        clearInterval(ivRef.current);
        // 선택된 카드 인덱스로 실제 카드 매핑
        var drawn=selectedCards.map(function(idx,i){
          var card=deck[idx];
          var rev=Math.random()>0.62;
          return {card:card,isReversed:rev,pos:c.positions[i],isGood:card.good&&!rev};
        });
        setCards(drawn);
        setTimeout(function(){setStep("result");},500);
      }
    },160);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var goodCount=cards.filter(function(x){return x.isGood;}).length;
  var isGood=goodCount>=3;
  var q1=answers[0]||""; var q2=answers[1]||""; var q3=answers[2]||"";
  var synData=q2&&SYN[q2]?(isGood?SYN[q2].good:SYN[q2].bad):
    (isGood?DEMO_NAME+"님, 5장의 카드가 전반적으로 긍정적인 재물 흐름을 보여주고 있어요. 3개월 안에 의미 있는 변화가 찾아올 거예요.":
            DEMO_NAME+"님, 카드가 지금 신중함을 요구하고 있어요. 내실을 다지는 것이 먼저예요.");
  var affirmData=q2&&AFFIRMATION[q2]?(isGood?AFFIRMATION[q2].good:AFFIRMATION[q2].bad):"💫 "+DEMO_NAME+"님은 재물을 끌어당길 힘이 있는 사람이에요.";
  var investData=isGood?INVEST.good:INVEST.bad;
  var lucky=getLucky(Date.now());

  // ── 설명 팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>💰 재물 타로</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>5장의 카드가 돈의 흐름, 투자 타이밍, 숨겨진 기회를 낱낱이 밝혀드려요</p>
          </div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(255,80,80,0.18)",color:"#FF7675",border:"1px solid #FF767544",fontWeight:700,flexShrink:0,marginLeft:8}}>인기</span>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:DG,borderRadius:16,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 10px"}}>🃏 조선 타로 78장 풀덱</p>
          <div style={{position:"relative",marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(13,1fr)",gap:3,filter:"blur(1.5px)",opacity:0.5,pointerEvents:"none"}}>
              {CARDS.map(function(card,i){return(
                <div key={i} style={{width:"100%",aspectRatio:"2/3",background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:3,border:"1px solid rgba(232,200,122,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:7,filter:"brightness(0.3)"}}>🃏</span>
                </div>
              );})}
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(13,35,24,0.6)",borderRadius:6}}>
              <span style={{fontSize:24,marginBottom:6}}>🃏</span>
              <p style={{fontSize:12,color:G,fontWeight:700,margin:"0 0 3px",textAlign:"center"}}>시작하면 78장이 펼쳐져요</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0,textAlign:"center"}}>그 중 5장을 직관으로 직접 선택해요</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:1,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>🎴 5장 직접 선택</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>78장 중 직접 고르기</p>
            </div>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:2,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>💰 5장 스프레드 리딩</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>정방향 / 역방향 전부 해석</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 이 타로에서 알 수 있는 것</p>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>💰</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>현재 재물 상태</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 내 재물 기운이 오르는지 내리는지</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🚧</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>장애물 파악</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>돈이 안 들어오게 막고 있는 진짜 원인</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🔍</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>숨겨진 기회</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 놓치고 있는 수입 루트 발견</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>📈</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>단기 전망</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>앞으로 한 달 재물 흐름 예측</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>✅</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>지금 행동 조언</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>오늘 당장 실행해야 할 구체적 행동</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🍀</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>행운 정보</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>행운 숫자·색·방향·아이템·날짜</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 카드 배열 (5장)</p>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>1</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>현재 재물 상태</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>2</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>장애물·방해 요소</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>3</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>숨겨진 기회</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>4</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>단기 전망 (1개월)</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>5</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>최종 조언·행동 지침</span>
          </div>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>5장 풀 리딩 + 재정 상황별 맞춤 분석 + 투자 OK/NG</p>
        </div>
        <GBtn onClick={function(){setStep("who");}}>시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 누구? ──
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>💰 누구의 재물 타로를 볼까요?</h3>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>2028-04-07 · 양력 · 여</p></div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사전질문 ──
  if(step==="questions"){
    var curQ=c.questions[qStep];var totalQ=c.questions.length;var progress=(qStep/totalQ)*100;
    function selectOpt(opt){var na=answers.slice();na[qStep]=opt;setAnswers(na);if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);},300);}else{setTimeout(function(){setStep("spread");},300);}}
    function goNext(){var na=answers.slice();if(curQ.freeInput&&freeText){na[qStep]=freeText;setFreeText("");}else if(!na[qStep]){na[qStep]="";}setAnswers(na);if(qStep<totalQ-1){setQStep(qStep+1);}else{setStep("spread");}}
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
        </div>
        <div style={{padding:"16px"}}>
          {curQ.opts.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>{curQ.opts.map(function(opt){var isSel=answers[qStep]===opt;return <button key={opt} onClick={function(){selectOpt(opt);}} style={{padding:"14px 10px",borderRadius:13,cursor:"pointer",fontSize:12,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;})}</div>}
          {curQ.freeInput&&<div style={{marginBottom:14}}><textarea value={freeText} onChange={function(e){setFreeText(e.target.value);}} placeholder={curQ.placeholder} rows={3} style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#F0EAD6",fontFamily:"'Noto Serif KR',serif",resize:"none",boxSizing:"border-box",outline:"none",lineHeight:1.7}}/></div>}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(curQ.freeInput||curQ.skippable)&&<GBtn onClick={goNext}>{freeText?"이걸로 분석하기 →":"다음 →"}</GBtn>}
            {curQ.skippable&&<button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);if(qStep<c.questions.length-1){setQStep(qStep+1);}else{setStep("spread");}}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰고 바로 카드 선택 →</button>}
          </div>
        </div>
        <style>{"::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 78장 카드 선택 ── 한 번 선택하면 확정 (취소 불가)
  if(step==="spread"){
    var done=selectedCards.length>=needed;
    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:100}}>
        <div style={{background:DG,padding:"18px 16px 14px",position:"sticky",top:0,zIndex:10}}>
          <h3 style={{fontSize:16,fontWeight:700,color:G,margin:"0 0 3px"}}>✨ 마음이 끌리는 카드를 {needed}장 고르세요</h3>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"0 0 10px"}}>⚠️ 한 번 고른 카드는 바꿀 수 없어요 · {selectedCards.length}/{needed}장 선택됨</p>
          {/* 선택 진행 바 */}
          <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:(selectedCards.length/needed*100)+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.3s"}}/>
          </div>
        </div>

        {/* 선택된 카드 - 세로로 크게 공개 */}
        {selectedCards.length>0&&(
          <div style={{padding:"14px 14px 0"}}>
            <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:2,margin:"0 0 10px"}}>✦ 선택된 카드</p>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none"}}>
              {selectedCards.map(function(idx,i){
                var card=deck[idx];
                var isRev=Math.random()>0.62;
                return(
                  <div key={i} style={{flexShrink:0,textAlign:"center"}}>
                    <div style={{
                      width:80,height:124,
                      background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",
                      borderRadius:8,
                      border:"2px solid #E8C87A",
                      display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",
                      boxShadow:"0 0 20px rgba(232,200,122,0.3)",
                      position:"relative",
                      animation:"cardReveal 0.4s ease-out"
                    }}>
                      <span style={{fontSize:28,marginBottom:4}}>🃏</span>
                      <p style={{fontSize:8,color:G,fontWeight:700,textAlign:"center",margin:0,padding:"0 4px",lineHeight:1.3}}>{card.display}</p>
                      <div style={{position:"absolute",top:4,left:4,width:16,height:16,borderRadius:"50%",background:"#E8C87A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:9,color:"#0D0D14",fontWeight:900}}>{i+1}</span>
                      </div>
                    </div>
                    <p style={{fontSize:8,color:"rgba(255,255,255,0.4)",margin:"5px 0 0",maxWidth:80}}>{c.positions[i]||""}</p>
                  </div>
                );
              })}
              {/* 빈 슬롯 */}
              {Array.from({length:needed-selectedCards.length},function(_,i){return(
                <div key={"empty"+i} style={{flexShrink:0,width:80,height:124,borderRadius:8,border:"1px dashed rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:20,color:"rgba(255,255,255,0.15)"}}>+</span>
                </div>
              );})}
            </div>
          </div>
        )}

        <div style={{padding:"8px 10px 0"}}>
          {q1&&<p style={{fontSize:10,color:G,marginBottom:10,background:"rgba(232,200,122,0.08)",padding:"7px 12px",borderRadius:20,display:"inline-block"}}>✦ {q1}</p>}
          <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",margin:"0 0 10px"}}>아래 {deck.length}장 중에서 끌리는 카드를 골라주세요</p>
          {/* 78장 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:20}}>
            {deck.map(function(card,idx){
              var selPos=selectedCards.indexOf(idx);
              var isSel=selPos!==-1;
              var isFull=selectedCards.length>=needed&&!isSel;
              return(
                <div key={idx}
                  onClick={function(){
                    // 한 번 선택하면 취소 불가 / 아직 안 뽑은 카드만 선택 가능
                    if(!isSel&&!isFull){
                      setSelectedCards(function(prev){return prev.concat(idx);});
                    }
                  }}
                  style={{
                    position:"relative",
                    cursor:isFull||isSel?"default":"pointer",
                    opacity:isFull?0.25:isSel?1:1,
                    transition:"transform 0.15s",
                    transform:isSel?"scale(0.9)":"none",
                    filter:isSel?"brightness(0.4)":"none"
                  }}>
                  <CardBack size={44}/>
                  {isSel&&(
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",borderRadius:4}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#E8C87A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:10,color:"#0D0D14",fontWeight:900}}>{selPos+1}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"12px 16px",background:"rgba(17,24,39,0.97)",borderTop:"1px solid rgba(255,255,255,0.08)",backdropFilter:"blur(10px)"}}>
          {done
            ?<GBtn onClick={function(){setStep("payment");}}>✨ {needed}장 선택 완료 → 결제하기</GBtn>
            :<div style={{textAlign:"center"}}><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 8px"}}>카드를 {needed-selectedCards.length}장 더 고르면 결제로 넘어가요</p><div style={{height:4,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:(selectedCards.length/needed*100)+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.3s"}}/></div></div>
          }
        </div>
        <style>{"@keyframes cardReveal{from{opacity:0;transform:scale(0.8) rotateY(90deg)}to{opacity:1;transform:scale(1) rotateY(0)}}::-webkit-scrollbar{display:none}"}</style>
      </div>
    );
  }

  // ── 결제 ──
  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}><h3 style={{fontSize:18,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>결제하기</h3><p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>안전하게 처리됩니다</p></div>
      <div style={{padding:"16px"}}>
        {/* 선택한 카드 요약 */}
        <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 선택하신 카드 {needed}장</p>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {selectedCards.map(function(idx,i){var card=deck[idx];return <span key={i} style={{fontSize:10,color:"rgba(255,255,255,0.65)",background:"rgba(255,255,255,0.07)",padding:"3px 8px",borderRadius:10}}>카드 {i+1}</span>;})}
          </div>
        </div>
        {answers.filter(function(a){return a&&a!=="";}).length>0&&<div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}><p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>{answers.map(function(a,i){return a&&a!==""?(<p key={i} style={{fontSize:11,color:"rgba(255,255,255,0.65)",margin:"0 0 4px"}}>{c.questions[i].icon} {a}</p>):null;})}</div>}
        <div style={{background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"7px 14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
        {[["🎟️","쿠폰 (0장)","눌러서 쿠폰 목록 보기"],["📋","이용권 (0장)","눌러서 이용권 목록 보기"]].map(function(x){return(<div key={x[1]} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}><div><p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.65)",margin:"0 0 1px"}}>{x[0]} {x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.3)",margin:0}}>{x[2]}</p></div><span style={{color:"rgba(255,255,255,0.3)"}}>▾</span></div>);})}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>상품 가격</span><span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{c.price.toLocaleString()}원</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>{c.price.toLocaleString()}원</span></div></div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 10px",letterSpacing:1}}>= 결제 수단</p>
        {[["🟡","카카오페이","원터치 간편결제",true],["🔵","토스페이","간편결제",false],["💚","네이버페이","포인트 적립",false],["💳","카드결제","신용/체크카드",false],["📱","핸드폰 결제","통신사 결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[3]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[3]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20,flexShrink:0}}>{x[0]}</span><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>{x[2]}</p></div><div style={{width:18,height:18,borderRadius:"50%",border:x[3]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[3]?"#E8C87A":"transparent",flexShrink:0}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 ({c.price.toLocaleString()}원) →</GBtn><div style={{height:8}}/><GBtn onClick={function(){setStep("spread");}} dim={true}>← 카드 다시 선택</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 로딩 ──
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>💰 재물 타로</p>
        {q1&&<p style={{fontSize:11,color:G,margin:"0 0 4px",background:"rgba(232,200,122,0.08)",padding:"5px 12px",borderRadius:20}}>✦ {q1}</p>}
        {q2&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 20px"}}>{q2}</p>}
        <div style={{fontSize:50,marginBottom:14}}>🔮</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>{DEMO_NAME}님의 재물 기운 읽는 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{c.loading[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  // ━━━ 결과 ━━━
  if(step==="result"&&cards.length>0) return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>{c.subtitle}</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 💰 재물 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>카드를 탭하면 상세 해석이 펼쳐져요</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {/* ① 사전질문 요약 */}
        {q1&&<div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 6px"}}>✦ 재물 상황 분석</p>
          <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 3px"}}>{DEMO_NAME}님, 💰 "{q1}"</p>
          {q2&&<p style={{fontSize:12,color:"rgba(0,0,0,0.6)",margin:"3px 0 0"}}>📊 {q2}</p>}
          {q3&&<p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:"3px 0 0",fontStyle:"italic"}}>✏️ "{q3}"</p>}
          <p style={{fontSize:11,color:"rgba(0,0,0,0.4)",margin:"8px 0 0"}}>이 상황에 맞춰 5장을 정밀하게 분석해드릴게요.</p>
        </div>}

        {/* ② 5장 카드 배열 (3+2) */}
        <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🃏 직접 고른 5장 · 탭하면 상세 해석</p>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}>
            {cards.slice(0,3).map(function(cd,i){return(
              <div key={i} onClick={function(){setOpenCard(openCard===i?null:i);}} style={{textAlign:"center",cursor:"pointer",flex:1}}>
                <div style={{border:openCard===i?"2px solid #E8C87A":"2px solid transparent",borderRadius:9,padding:2,transition:"0.2s"}}><CardFront card={cd.card} isReversed={cd.isReversed} size={85}/></div>
                <p style={{fontSize:8,color:"rgba(0,0,0,0.4)",margin:"5px 0 1px"}}>{cd.pos}</p>
                <p style={{fontSize:9,fontWeight:700,color:cd.isGood?"#2E7D32":"#C62828"}}>{cd.card.display}</p>
              </div>
            );})}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:8}}>
            {cards.slice(3,5).map(function(cd,i){return(
              <div key={i+3} onClick={function(){setOpenCard(openCard===i+3?null:i+3);}} style={{textAlign:"center",cursor:"pointer",flex:1,maxWidth:110}}>
                <div style={{border:openCard===i+3?"2px solid #E8C87A":"2px solid transparent",borderRadius:9,padding:2,transition:"0.2s"}}><CardFront card={cd.card} isReversed={cd.isReversed} size={85}/></div>
                <p style={{fontSize:8,color:"rgba(0,0,0,0.4)",margin:"5px 0 1px"}}>{cd.pos}</p>
                <p style={{fontSize:9,fontWeight:700,color:cd.isGood?"#2E7D32":"#C62828"}}>{cd.card.display}</p>
              </div>
            );})}
          </div>
        </div>

        {/* ③ 카드 상세 해석 - 탭시 펼쳐짐 */}
        {openCard!==null&&cards[openCard]&&(function(){
          var cd=cards[openCard];
          var posKey="pos"+openCard;
          var posData=POS_RICH[posKey];
          var msg="";
          if(posData){
            var pool=posData[cd.isGood?"good":"bad"];
            if(pool) msg=pool[q2]||pool["default"]||"";
          }
          if(!msg) msg=cd.isGood
            ?DEMO_NAME+"님, 이 자리에 좋은 기운이 나왔어요. 재물 흐름이 긍정적으로 향하고 있어요. 이 에너지를 믿고 앞으로 나아가세요."
            :DEMO_NAME+"님, 이 자리에서 잠시 점검 신호가 나왔어요. 무리하게 밀어붙이기보다 상황을 냉정하게 살펴보세요.";
          return(
            <div style={{background:"#fff",border:cd.isGood?"2px solid rgba(46,125,50,0.25)":"2px solid rgba(198,40,40,0.2)",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <CardFront card={cd.card} isReversed={cd.isReversed} size={82}/>
                <div style={{flex:1,paddingTop:4}}>
                  <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 5px"}}>✦ {cd.pos}</p>
                  <p style={{fontSize:15,fontWeight:800,color:"#111",margin:"0 0 2px"}}>{cd.card.display}{cd.isReversed?" (역방향)":""}</p>
                  <p style={{fontSize:10,color:"rgba(0,0,0,0.4)",margin:"0 0 8px"}}>{cd.card.name}</p>
                  <div style={{background:"#F5F5F0",borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                    <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 2px"}}>카드 키워드</p>
                    <p style={{fontSize:11,color:"#7A5C00",fontWeight:600,margin:0}}>{cd.card.keyword}</p>
                  </div>
                  <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:cd.isGood?"rgba(46,125,50,0.1)":"rgba(198,40,40,0.08)",color:cd.isGood?"#2E7D32":"#C62828",border:cd.isGood?"1px solid rgba(46,125,50,0.25)":"1px solid rgba(198,40,40,0.2)",fontWeight:700}}>{cd.isGood?"✦ 길한 기운":"⚠️ 주의 기운"}</span>
                </div>
              </div>
              {/* 재물 관련 카드 의미 */}
              <div style={{background:"rgba(255,248,220,0.5)",borderRadius:10,padding:"10px 12px",marginBottom:12}}>
                <p style={{fontSize:9,color:"#7A5C00",fontWeight:700,margin:"0 0 4px"}}>💰 재물 타로에서 이 카드는</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{cd.card.money}</p>
              </div>
              {/* 소제목 구조 상세 해석 */}
              {q2&&<div style={{background:"rgba(255,248,220,0.6)",borderRadius:8,padding:"4px 10px",marginBottom:10,display:"inline-block"}}><span style={{fontSize:10,color:"#7A5C00",fontWeight:700}}>📊 {q2} 맞춤 해석</span></div>}
              <p style={{fontSize:13,color:"#222",lineHeight:2.1,margin:"0 0 14px",wordBreak:"keep-all"}}>{msg}</p>
              {/* 이 카드가 현재 위치에서 주는 조언 */}
              <div style={{background:"#F9F7F2",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <p style={{fontSize:10,color:"#7A5C00",fontWeight:700,margin:"0 0 6px"}}>🎯 {cd.pos}에서 이 카드의 조언</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>
                  {cd.isGood
                    ?"지금 이 자리에서 긍정적인 에너지가 흐르고 있어요. 이 자리는 "+DEMO_NAME+"님의 재물 여정에서 중요한 위치예요. 카드가 보내는 신호를 믿고, 오늘 이 에너지를 실제 행동으로 연결해보세요. 작은 실행 하나가 이 흐름을 이어가게 해줘요."
                    :"이 자리에서 주의 신호가 켜졌어요. 하지만 경고는 위기가 아니라 기회예요. 지금 이 부분을 미리 알았다는 것 자체가 "+DEMO_NAME+"님에게 큰 강점이에요. 알고 대비하면 충분히 막을 수 있어요."
                  }
                </p>
              </div>
              {/* q3 자유입력 연동 */}
              {q3&&<div style={{background:cd.isGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.05)",borderRadius:10,padding:"12px 14px",borderLeft:cd.isGood?"3px solid rgba(46,125,50,0.4)":"3px solid rgba(198,40,40,0.3)",marginBottom:12}}>
                <p style={{fontSize:10,color:"rgba(0,0,0,0.45)",fontWeight:700,margin:"0 0 6px"}}>✏️ "{q3}"에 대한 이 카드의 답</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{cd.isGood?"이 카드는 "+DEMO_NAME+"님이 고민하시는 상황에서도 긍정적인 방향을 가리키고 있어요. 지금 그 걱정보다 앞으로 나아가는 것에 에너지를 쓰세요. 방향은 맞아요.":"이 카드는 "+DEMO_NAME+"님의 고민이 가볍지 않다는 걸 보여주고 있어요. 더 신중한 판단이 필요하고, 가능하면 전문가나 신뢰할 수 있는 사람과 상의해보세요."}</p>
              </div>}
              {/* 오늘 당장 해야 할 행동 */}
              <div style={{background:cd.isGood?"rgba(46,125,50,0.06)":"rgba(198,40,40,0.04)",borderRadius:10,padding:"12px 14px",border:cd.isGood?"1px solid rgba(46,125,50,0.15)":"1px solid rgba(198,40,40,0.12)"}}>
                <p style={{fontSize:10,color:cd.isGood?"#2E7D32":"#C62828",fontWeight:700,margin:"0 0 6px"}}>⚡ 오늘 당장 해야 할 행동</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{cd.isGood?"이 카드의 기운을 살려주는 행동: 오늘 하루 재물과 관련된 작은 긍정적 행동 하나를 실행해보세요. 지갑을 정리하거나, 가계부를 펼치거나, 저축 앱을 확인하는 것처럼 작은 것이어도 좋아요.":"이 카드의 경고를 무시하지 않는 행동: 오늘 하루 재물 관련 큰 결정은 보류하세요. 대신 현재 재무 상태를 점검하고, 리스크를 줄일 수 있는 방법을 하나 찾아보세요."}</p>
              </div>
            </div>
          );
        })()}

        {/* ④ 종합 해석 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>✦ 종합 해석</p>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:24}}>{isGood?"☀️":"🌙"}</span>
            <div><p style={{fontSize:15,fontWeight:800,color:isGood?"#2E7D32":"#C62828",margin:"0 0 2px"}}>{isGood?"재물 기운이 올라오고 있어요":"지금은 지키는 게 먼저예요"}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.45)",margin:0}}>{goodCount}장 길 · {c.cardCount-goodCount}장 주의</p></div>
            <span style={{fontSize:22,marginLeft:"auto"}}>{goodCount>=4?"💯":goodCount===3?"✨":goodCount===2?"⚠️":"🌧️"}</span>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2.0,margin:0,wordBreak:"keep-all"}}>{synData}</p>
        </div>

        {/* ⑤ 투자 OK / NG */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>💼 지금 해도 되는 것 / 하지 말아야 할 것</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#2E7D32",margin:"0 0 8px"}}>✓ 지금 해도 돼요</p>
              {investData.ok.map(function(a,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 7px",lineHeight:1.65,paddingLeft:8,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{a}</p>;})}
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 8px"}}>✗ 지금은 안 돼요</p>
              {investData.ng.map(function(a,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 7px",lineHeight:1.65,paddingLeft:8,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>{a}</p>;})}
            </div>
          </div>
        </div>

        {/* ⑥ 재물 행운 정보 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>🍀 {DEMO_NAME}님의 재물 행운 정보</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["🔢","행운 숫자",lucky.num],["🎨","행운 컬러",lucky.color],["🧭","행운 방향",lucky.dir],["🎁","행운 아이템",lucky.item],["📅","행운 날",lucky.day],["⚠️","피할 날",lucky.avoid]].map(function(x){return(
              <div key={x[1]} style={{background:"#F9F7F2",borderRadius:12,padding:"12px",textAlign:"center"}}>
                <p style={{fontSize:18,margin:"0 0 4px"}}>{x[0]}</p>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[1]}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#333",margin:0}}>{x[2]}</p>
              </div>
            );})}
          </div>
        </div>

        {/* ⑦ 마무리 확언 */}
        <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
          <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.75,margin:"0 0 8px",wordBreak:"keep-all"}}>{affirmData}</p>
          <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 카드의 메시지</p>
        </div>

        {/* ⑧ 크로스셀링 */}
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

        {/* 해시태그 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",marginBottom:12}}>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",margin:0}}>{c.hashtags}</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:0,fontWeight:600}}>🌐 천기.kr</p>
        </div>
        <GBtn onClick={function(){setStep("info");}}>확인 완료</GBtn>
      </div>
      <style>{"@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{display:none}"}</style>
    </div>
  );
  return <div style={{color:"white",padding:20}}>로딩 중...</div>;
}
