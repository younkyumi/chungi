import { useState, useEffect, useRef } from "react";
const G = "#E8C87A", DG = "#0D2318";
// ━━━ 데모용 이름 (실제 구현시 인물등록에서 가져옴) ━━━
const DEMO_NAME = "규미";

// ━━━ 카드 위치 × 연애상태 × 정역방향 해석 ━━━
// 말투: 친한 언니·오빠 톤, 이름 호칭, 약점→강점 전환
const DETAIL = {
  pos0: {
    good: {
      "💕 연애 중 (1년 미만)": "아직 1년이 채 안 됐지만 카드는 지금 이 사람이 규미님을 매우 특별하게 여기고 있다고 말해요. 처음의 설렘이 조금씩 깊은 감정으로 변해가는 시기예요. 상대방은 지금 규미님에게 더 솔직해지고 싶지만 아직 용기를 못 내고 있을 수 있어요. 작은 관심과 진심 어린 표현 하나가 이 관계를 한 단계 끌어올릴 거예요.",
      "💑 연애 중 (1년 이상)": "함께한 시간이 쌓인 만큼 상대방의 마음 안에 규미님은 단순한 연인이 아닌 삶의 일부가 되어있어요. 카드가 보여주는 건 겉으로 표현이 줄었어도 속으로는 규미님을 더 소중히 여기고 있다는 거예요. 최근 일상에 치여 표현이 부족했다면, 먼저 작은 것이라도 챙겨주면 관계가 다시 활기를 찾을 거예요.",
      "🌱 썸 타는 중": "상대방의 마음속에 규미님이 자리 잡기 시작했어요. '그냥 좋은 사람'에서 '특별한 사람'으로 분류가 바뀌고 있는 중이에요. 카드는 상대가 먼저 다가오고 싶지만 거절당할까 봐 두려워하고 있다고 말해요. 지금 규미님이 조금만 더 친근하게, 부담 없이 접근하면 상대방은 기다렸다는 듯이 반응할 거예요.",
      "💔 솔로": "지금 누군가가 규미님을 의식하고 있어요. 카드는 이미 규미님 주변에 마음을 품고 있는 사람이 있다고 말해요. 평소보다 연락이 잦아진 사람, 자꾸 눈이 마주치는 사람, 사소한 것을 챙겨주는 사람이 있다면 그냥 지나치지 마세요. 새로운 인연의 기운이 규미님 주변을 둘러싸고 있어요.",
      "💍 결혼 고려 중": "파트너의 마음 안에 규미님과의 미래를 진지하게 그리는 생각이 싹트고 있어요. 말로 꺼내지 않았을 뿐이지 내면적으로는 '이 사람이라면 괜찮다'는 확신이 커지고 있어요. 카드는 지금이 그 이야기를 자연스럽게 꺼낼 수 있는 타이밍이 다가오고 있다고 말해요.",
      "💒 결혼 중": "배우자의 마음 안에 규미님에 대한 깊은 신뢰와 애정이 여전히 살아있어요. 일상에 치여 표현이 줄었을 뿐, 카드는 그 사람이 규미님을 삶의 가장 중요한 사람으로 여기고 있다는 걸 보여줘요. 오늘 작은 것이라도 먼저 표현해보세요.",
      "😢 이별 직후": "헤어진 그 사람의 마음 안에 아직 규미님이 남아있어요. 카드는 그 사람도 지금 혼란스럽고 그리워하고 있을 수 있다고 말해요. 완전히 정리된 게 아니에요. 하지만 지금 당장 연락하는 건 역효과예요. 조금 더 시간을 두고 자신을 먼저 챙기세요.",
    },
    bad: {
      "💕 연애 중 (1년 미만)": "아직 1년이 안 됐는데 벌써 상대방의 마음이 흔들리는 기운이 느껴지나요? 카드는 상대방이 지금 이 관계에 대해 의문을 품기 시작했을 수 있다고 말해요. 아직 완전히 식은 건 아니지만 방치하면 더 멀어질 수 있어요. 지금 당장 진솔한 대화가 필요해요. 뭐가 불편한지, 어떻게 하면 더 잘 맞을 수 있는지 함께 이야기해보세요.",
      "💑 연애 중 (1년 이상)": "오랜 시간을 함께했지만 카드는 지금 상대방이 관계에 대한 피로감이나 권태를 느끼고 있을 수 있다고 말해요. 규미님도 뭔가 달라진 것 같다는 느낌이 드셨을 거예요. 이건 사랑이 식은 게 아닐 수 있어요. 너무 익숙해져서 서로를 당연하게 여기게 된 것일 수 있어요. 오랜만에 처음 만났을 때처럼 설레는 시간을 만들어보세요.",
      "🌱 썸 타는 중": "상대방의 마음이 아직 규미님에게 완전히 열리지 않았어요. 호감은 있지만 선뜻 다가오지 못하게 하는 무언가가 있어요. 과거의 상처, 다른 감정, 혹은 지금 상황이 복잡한 것일 수 있어요. 지금은 더 강하게 밀어붙이기보다 편안하고 부담 없는 분위기를 만드는 게 훨씬 효과적이에요.",
      "💔 솔로": "아직 규미님 주변에 명확한 인연의 기운이 도달하지 않았어요. 지금은 새로운 관계를 시작하기보다 자신을 더 사랑하고 채우는 시간이 필요해요. 억지로 찾으려 하면 오히려 멀어져요. 규미님 자신이 빛나는 사람이 되면 인연은 자연스럽게 찾아와요.",
      "💍 결혼 고려 중": "파트너의 마음속에 결혼에 대한 두려움이나 망설임이 자리잡고 있을 수 있어요. 준비가 되지 않았다는 느낌이 강하게 작용하고 있어요. 이런 상태에서 결정을 재촉하면 역효과가 날 수 있어요. 서로의 두려움이 무엇인지 솔직하게 이야기하는 시간이 필요해요.",
      "💒 결혼 중": "배우자의 마음속에 지금 피로감이나 표현하지 못한 불만이 쌓여있을 수 있어요. 표면적으로는 평온해 보여도 내면에 해소되지 않은 감정들이 있어요. 방치하면 더 큰 균열이 생겨요. 오늘 먼저 다가가 이야기를 나눠보세요.",
      "😢 이별 직후": "지금 그 사람의 마음은 규미님에게서 멀어지는 방향으로 향하고 있어요. 지금 강하게 붙잡으려 하면 더 멀어질 수 있어요. 이 순간은 자신을 먼저 치유하는 데 집중하세요. 진짜 인연이라면 시간이 지난 후 다시 만나게 될 거예요.",
    },
  },
  pos1: {
    good: {
      "💕 연애 중 (1년 미만)": "초기 연애의 설레는 에너지가 두 사람 사이에 아직 충분히 흐르고 있어요. 서로를 알아가는 과정에서 좋은 기운이 교류되고 있고, 이 흐름이 더 깊어질 방향으로 나아가고 있어요. 지금 이 시기에 함께 새로운 경험을 많이 쌓을수록 유대감이 단단해져요.",
      "💑 연애 중 (1년 이상)": "오랜 시간을 함께한 두 사람 사이에 깊고 안정적인 에너지가 흐르고 있어요. 겉으로 보이는 것보다 훨씬 더 튼튼한 기반이 이 관계를 지탱하고 있어요. 이 안정 위에 새로운 설렘을 더하면 관계가 한 단계 더 성장할 수 있어요.",
      "🌱 썸 타는 중": "두 사람 사이의 에너지가 활발하게 교류되고 있어요. 만날 때마다 조금씩 더 가까워지는 느낌, 맞죠? 카드는 이 흐름이 자연스럽게 더 깊어질 거라고 말해요. 지금 필요한 건 큰 고백이 아니라 작은 솔직함이에요.",
      "💔 솔로": "인연이 규미님 삶에 들어올 흐름이 서서히 만들어지고 있어요. 평소와 다르게 새로운 만남의 기회가 생기거나 관계의 흐름이 변하고 있다면 그 신호를 주목하세요.",
      "💍 결혼 고려 중": "두 사람이 함께 같은 방향을 바라보는 흐름이에요. 사소한 의견 차이는 있어도 큰 그림에서 방향이 맞아가고 있어요. 이 흐름을 믿고 솔직한 대화를 나눠보세요.",
      "💒 결혼 중": "부부 사이에 안정적이고 건강한 에너지가 흐르고 있어요. 매일이 비슷해 보여도 이 안정 자체가 두 사람의 관계가 건강하다는 증거예요. 함께 새로운 경험을 만들어가면 더 풍요로워질 거예요.",
      "😢 이별 직후": "시간이 지나면서 이 관계의 흐름이 달라질 가능성이 있어요. 지금은 끝처럼 느껴지지만 카드는 완전한 끝이 아닐 수 있다고 말해요. 지금은 자신의 삶에 집중하는 것이 오히려 더 빠른 길이에요.",
    },
    bad: {
      "💕 연애 중 (1년 미만)": "아직 초반인데 벌써 소통의 단절이 생기고 있어요. 서로 솔직하게 하고 싶은 말을 하지 못하고 조심하다 보니 오해가 쌓이는 상황이에요. 지금 이 시기에 솔직함을 연습하지 않으면 나중에 더 큰 벽이 될 수 있어요. 작은 것부터 솔직하게 이야기해보세요.",
      "💑 연애 중 (1년 이상)": "오랫동안 함께하면서 서로에게 너무 익숙해진 나머지 소통이 줄어들었어요. 말하지 않아도 알 거라는 생각이 오히려 오해를 키우고 있을 수 있어요. 이미 안다고 생각하는 것도 다시 확인하고 표현하는 것이 지금 이 관계에 가장 필요한 거예요.",
      "🌱 썸 타는 중": "두 사람의 관계가 어느 방향으로도 나아가지 못하고 정체된 상태예요. 이 상태가 계속되면 자연스럽게 멀어질 수 있어요. 용기를 내서 먼저 솔직한 감정을 표현해보세요.",
      "💔 솔로": "지금은 인연의 흐름이 막혀있는 시기예요. 외부를 향하는 에너지를 잠시 내면으로 돌려보세요. 나 자신을 더 사랑하게 될 때 흐름이 바뀌어요.",
      "💍 결혼 고려 중": "두 사람이 결혼을 바라보는 시각에 차이가 있어요. 이 간극을 솔직하게 이야기하지 않으면 불필요한 상처가 생길 수 있어요.",
      "💒 결혼 중": "부부 사이에 풀리지 않은 갈등이 쌓여가고 있어요. 지금 대화가 필요해요. 사소한 불만이 쌓이면 나중에 더 큰 균열이 생겨요.",
      "😢 이별 직후": "두 사람의 관계가 완전히 다른 방향으로 향하고 있어요. 억지로 되돌리려 할수록 더 상처받을 수 있어요. 지금은 이 흐름을 받아들이고 회복에 집중하세요.",
    },
  },
  pos2: {
    good: {
      "💕 연애 중 (1년 미만)": "앞으로 3개월 안에 이 관계에서 중요한 전환점이 생길 거예요. 카드는 두 사람의 관계가 더 깊은 단계로 자연스럽게 발전할 에너지를 보여주고 있어요. 그 순간이 왔을 때 두려워하지 말고 솔직하게 마음을 표현하세요. 타이밍을 놓치지 마세요.",
      "💑 연애 중 (1년 이상)": "오랜 연애를 함께해온 두 사람에게 새로운 국면이 찾아올 거예요. 카드는 이 관계가 다음 단계로 나아갈 준비가 되어있다고 말해요. 함께 미래를 이야기하고 공통의 목표를 세워보세요. 관계가 새로운 활력을 얻을 거예요.",
      "🌱 썸 타는 중": "이 감정이 헛되지 않아요. 카드는 앞으로 두 사람의 관계가 썸을 넘어 본격적인 연애로 이어질 에너지를 보여주고 있어요. 너무 계산하지 말고 감정에 솔직해지세요. 설렘을 그대로 표현해도 괜찮아요.",
      "💔 솔로": "가까운 미래에 좋은 인연이 찾아올 가능성이 높아요. 새로운 환경에 자신을 노출시키고 평소에 안 하던 것들을 시도해보세요. 인연은 예상치 못한 곳에서 와요.",
      "💍 결혼 고려 중": "결혼으로 이어질 가능성이 충분히 있어요. 완벽한 타이밍을 기다리기보다 서로의 마음을 확인하는 시간을 먼저 가져보세요. 카드는 그 대화가 긍정적인 결과를 가져올 거라고 말해요.",
      "💒 결혼 중": "두 사람의 관계가 앞으로 더 성숙하고 풍요로워질 거예요. 지금의 작은 어려움이 오히려 두 사람을 더 단단하게 만드는 과정이에요. 함께 극복한 경험이 쌓일수록 관계는 더 깊어져요.",
      "😢 이별 직후": "지금은 아프지만 이 이별이 규미님을 더 성장시키는 과정이에요. 상처를 충분히 치유한 후 만나는 다음 인연은 훨씬 더 건강하고 성숙한 관계가 될 거예요.",
    },
    bad: {
      "💕 연애 중 (1년 미만)": "지금 이대로라면 이 초반의 좋은 감정이 흐려질 수 있어요. 카드는 두 사람이 서로 다른 방향으로 멀어지는 흐름을 보여주고 있어요. 지금 당장 진솔한 대화를 통해 서로가 원하는 것을 확인하세요. 초반에 단단하게 기반을 다지는 것이 중요해요.",
      "💑 연애 중 (1년 이상)": "이대로라면 두 사람의 관계가 점점 더 멀어질 수 있어요. 오랜 시간이 쌓였기에 포기하기는 아깝지만, 지금 바꾸지 않으면 더 힘들어질 수 있어요. 함께 무엇이 문제인지 직면하고 해결책을 찾아보세요.",
      "🌱 썸 타는 중": "지금 이 관계가 발전하기 어려운 에너지가 있어요. 타이밍이 맞지 않거나 상황이 복잡할 수 있어요. 억지로 밀어붙이기보다 다른 가능성도 열어두는 것이 현명해요.",
      "💔 솔로": "당분간은 연애보다 자기 자신에게 집중해야 할 시기예요. 지금 준비되지 않은 상태로 시작하면 오히려 상처받을 수 있어요. 나를 더 사랑하고 채우는 시간으로 삼으세요.",
      "💍 결혼 고려 중": "지금 당장 결혼을 진행하기에는 해결해야 할 문제들이 있어요. 서두르지 말고 서로를 더 깊이 이해하는 과정이 먼저예요.",
      "💒 결혼 중": "앞으로 관계에서 도전적인 시기가 올 수 있어요. 혼자 감당하려 하지 말고 배우자와 함께 해결해나가는 자세가 중요해요.",
      "😢 이별 직후": "재회의 가능성이 지금 당장은 낮아 보여요. 이 관계를 되돌리려는 시도보다 앞으로 나아가는 것이 규미님에게 더 이로워요. 이 이별이 더 좋은 것들을 위한 공간을 만들어줄 거예요.",
    },
  },
};

// Q2 궁금한것 × Q3 상황 교차 추가 해석
const Q2_DETAIL = {
  "💘 그 사람 나를 좋아할까": {
    good: "카드가 말하는 건 분명해요. 그 사람, 규미님을 좋아해요. 표현이 서툴거나 상황이 여의치 않아서 직접적으로 드러내지 못하고 있을 뿐이에요. 카드의 에너지를 믿고 먼저 다가가보세요.",
    bad: "아직 그 사람의 마음이 규미님을 향해 완전히 열리지 않은 상태예요. 하지만 이것이 영원한 건 아니에요. 지금은 좋은 인상을 쌓아가는 시간이 필요해요.",
  },
  "❤️ 우리 잘 될까": {
    good: "카드가 보여주는 두 사람의 미래는 밝아요. 지금 느끼는 불안은 기우예요. 이 관계, 충분히 잘 될 수 있어요. 믿음을 가지고 나아가세요.",
    bad: "지금 이대로라면 쉽지 않을 수 있어요. 하지만 두 사람이 함께 노력한다면 달라질 수 있어요. 카드는 포기보다 솔직한 대화를 먼저 권하고 있어요.",
  },
  "💍 결혼까지 갈 수 있을까": {
    good: "카드가 결혼의 가능성을 보여주고 있어요. 두 사람 사이에 그만한 감정과 기반이 있어요. 완벽한 타이밍을 기다리기보다 서로의 마음을 먼저 확인해보세요.",
    bad: "지금 당장 결혼이라는 결과를 보기는 어려울 수 있어요. 아직 해결해야 할 것들이 남아있어요. 서두르지 말고 기반을 다지는 것이 먼저예요.",
  },
  "💔 헤어진 사람과 재회할까": {
    good: "재회의 가능성이 있어요. 상대방의 마음에 아직 규미님이 남아있고, 시간이 지나면서 다시 가까워질 흐름이 보여요. 단, 억지로 연락하기보다 자연스러운 흐름을 따르세요.",
    bad: "지금 당장 재회는 어려워 보여요. 그 사람의 마음이 다른 방향으로 향하고 있어요. 지금은 자신을 먼저 치유하고 더 좋은 인연을 기다리는 것이 현명해요.",
  },
  "🆕 새로운 인연이 올까": {
    good: "가까운 미래에 새로운 인연이 찾아올 가능성이 높아요. 자신을 더 드러내고 새로운 환경에 적극적으로 참여해보세요. 인연은 준비된 사람에게 찾아와요.",
    bad: "당분간은 새로운 인연보다 자신을 채우는 시간이 필요해요. 조급하게 찾으면 맞지 않는 인연을 만날 수 있어요. 때를 기다리세요.",
  },
  "💬 지금 연락해도 될까": {
    good: "카드가 연락해도 좋다고 말하고 있어요. 상대방도 규미님의 연락을 기다리고 있을 수 있어요. 너무 고민하지 말고 가볍게 먼저 연락해보세요.",
    bad: "지금 당장 연락하는 건 역효과일 수 있어요. 상대방이 아직 준비되지 않았거나 거리를 두고 싶은 상황일 수 있어요. 조금 더 기다렸다가 자연스러운 계기를 만들어보세요.",
  },
  "🌟 전체 다 궁금해요!": {
    good: "3장의 카드가 전체적으로 긍정적인 에너지를 보내고 있어요. 지금 이 관계는 생각보다 훨씬 좋은 방향으로 흘러가고 있어요. 규미님이 느끼는 설렘과 기대가 헛되지 않아요.",
    bad: "3장의 카드가 지금 조심해야 할 신호를 보내고 있어요. 모든 것이 한꺼번에 잘 되기를 바라기보다 가장 중요한 것 하나에 집중해보세요.",
  },
};

// Q3 상황별 추가 코멘트
const Q3_CONTEXT = {
  "💑 사귄 지 1년 미만": "아직 서로를 알아가는 시기예요. 이 시기의 솔직함이 관계의 기반을 만들어요.",
  "💍 사귄 지 1년 이상": "오랜 시간이 증명한 관계예요. 권태보다는 성장에 집중할 시기예요.",
  "💬 요즘 연락이 뜸해졌어": "연락이 줄어든 건 마음이 식은 게 아닐 수 있어요. 상대방의 상황을 먼저 확인해보세요.",
  "🔥 최근에 싸웠어": "싸움은 관계를 더 깊게 만드는 과정이 될 수 있어요. 화해의 타이밍이 중요해요.",
  "😶 감정 표현을 잘 안 해": "표현이 없다고 마음이 없는 건 아니에요. 그 사람만의 방식으로 규미님을 아끼고 있어요.",
  "🌊 장거리 연애 중": "거리가 마음을 막지는 않아요. 카드는 이 거리가 두 사람을 더 단단하게 만들고 있다고 말해요.",
  "💕 뭔가 잘 될 것 같은 좋은 느낌이야!": "그 직관, 맞아요. 카드도 같은 말을 하고 있어요. 그 설렘을 믿어보세요.",
  "🌸 요즘 더 잘해줘서 기대가 돼": "상대방이 더 잘해주는 건 마음이 커지고 있다는 신호예요. 이 흐름을 잘 이어가세요.",
};

// 연애 상태별 종합 해석
const SYN_BY_STATUS = {
  "💕 연애 중 (1년 미만)": {
    good: "오늘 뽑힌 3장의 카드를 종합하면, 초반의 설렘이 진짜 감정으로 뿌리내리고 있는 좋은 시기예요. 카드 전체가 긍정적인 에너지를 보여주고 있어요. 지금 이 관계는 앞으로 더 깊어질 방향으로 흘러가고 있어요. 가장 중요한 건 지금 이 감정을 솔직하게 표현하는 거예요. 초반에 솔직함을 쌓아두면 나중에 어떤 어려움도 함께 헤쳐나갈 수 있어요.",
    bad: "카드가 지금 관계에서 중요한 경고 신호를 보내고 있어요. 아직 초반인데 소통의 단절이 생기고 있다면 지금 바로잡지 않으면 나중에 더 힘들어져요. 서로 솔직하게 원하는 것을 이야기하는 시간을 가져보세요. 이 시기에 쌓는 솔직함이 관계의 기반이 돼요.",
  },
  "💑 연애 중 (1년 이상)": {
    good: "오랜 시간을 함께해온 두 사람, 카드는 지금 이 관계가 겉보기보다 훨씬 견고하다고 말해요. 익숙함 속에서도 서로를 소중히 여기는 마음이 살아있어요. 지금 이 관계를 더 발전시킬 절호의 타이밍이에요. 함께 새로운 목표나 계획을 세워보세요. 공통의 미래를 그리는 것이 관계를 한 단계 끌어올릴 거예요.",
    bad: "오랜 시간이 쌓인 만큼 쉽게 포기하면 안 되는 관계예요. 카드는 지금 두 사람 사이에 풀지 못한 감정들이 쌓여가고 있다고 경고해요. 오래된 관계일수록 '말하지 않아도 알겠지'라는 생각이 오해를 키워요. 지금 당장 솔직한 대화의 시간을 만들어보세요.",
  },
  "🌱 썸 타는 중": {
    good: "설레고 불안한 이 감정, 충분히 이해해요. 그런데 오늘 뽑힌 3장의 카드가 아주 좋은 소식을 전하고 있어요. 상대방의 마음 자리에서 규미님을 향한 관심의 기운이 분명히 보이고, 관계의 흐름도 자연스럽게 가까워지는 방향이에요. 지금 너무 계산하지 말 것. 진심 어린 관심이 상대방의 마음을 열게 할 거예요.",
    bad: "지금 이 썸의 흐름이 조금 불안정해요. 섣불리 고백하거나 관계를 정의하려 하면 오히려 부담을 줄 수 있어요. 지금은 자연스럽고 편안한 분위기를 만드는 것에 집중하고, 상대방이 스스로 마음을 열 수 있는 시간을 주세요.",
  },
  "💔 솔로": {
    good: "혼자인 지금도 충분히 완전한 사람이에요. 카드는 규미님이 조만간 좋은 인연을 만날 준비가 되어가고 있다고 말해요. 누군가가 규미님을 향해 마음이 열리고 있음을 카드가 보여주고 있어요. 자신감 있게 자신을 표현하세요.",
    bad: "지금 당장 새로운 인연보다 자신을 더 채우는 시간이 필요해요. 억지로 찾으려 하면 맞지 않는 인연을 만날 수 있어요. 규미님이 빛나는 사람이 되면 좋은 인연은 자연스럽게 찾아와요.",
  },
  "💍 결혼 고려 중": {
    good: "결혼을 고민하는 지금, 카드가 좋은 신호를 보내고 있어요. 상대방도 규미님과의 미래를 진지하게 생각하고 있어요. 완벽한 타이밍은 없어요. 지금 서로의 마음을 확인하는 대화를 나눠보세요.",
    bad: "결혼을 향한 여정에서 아직 해결해야 할 것들이 남아있어요. 서두르기보다 서로의 두려움과 고민을 먼저 충분히 이야기하는 과정이 필요해요. 그 과정이 오히려 더 단단한 기반을 만들어줄 거예요.",
  },
  "💒 결혼 중": {
    good: "카드가 두 사람의 관계에서 따뜻하고 안정적인 에너지를 보여주고 있어요. 매일의 일상이 때로는 무감각하게 느껴질 수 있지만, 그 안정 자체가 건강한 관계의 증거예요. 오늘 파트너에게 작은 것이라도 감사와 애정을 표현해보세요.",
    bad: "부부 관계에서 해결되지 않은 감정이 쌓여가고 있어요. 바쁘다는 이유로, 또는 분위기를 만들까 봐 피해온 대화가 있다면 지금 꺼내야 해요. 문제를 함께 해결할 때 관계는 더 깊어져요.",
  },
  "😢 이별 직후": {
    good: "지금 많이 아프죠. 그 감정은 당연한 거예요. 카드는 이 이별이 규미님 인생에서 더 좋은 것을 위한 공간을 만들고 있다고 말해요. 충분히 슬퍼하고, 충분히 쉬세요. 그리고 다시 일어설 때 당신은 훨씬 더 단단해져 있을 거예요.",
    bad: "이별의 상처가 아직 깊게 남아있어요. 재회를 위한 행동보다 자신을 치유하는 것이 먼저예요. 신뢰할 수 있는 사람과 이야기를 나누거나, 오래 미뤄온 것들을 시작해보세요.",
  },
};

// 마무리 확언 (연애상태 × 카드 기운별)
const AFFIRMATION = {
  "🌱 썸 타는 중": {good:"💫 "+DEMO_NAME+"님은 설레는 감정을 느낄 자격이 충분한 사람이에요. 그 마음 그대로 표현해도 괜찮아요.", bad:"💫 "+DEMO_NAME+"님, 지금 이 기다림도 "+DEMO_NAME+"님을 더 성숙하게 만들고 있어요. 좋은 인연은 반드시 와요."},
  "💕 연애 중 (1년 미만)": {good:"💫 "+DEMO_NAME+"님, 이 설렘을 오래 간직하세요. 솔직한 마음이 이 관계를 더 단단하게 만들 거예요.", bad:"💫 "+DEMO_NAME+"님, 솔직함은 용기예요. 그 용기가 이 관계를 살릴 수 있어요."},
  "💑 연애 중 (1년 이상)": {good:"💫 "+DEMO_NAME+"님, 함께한 시간만큼 서로가 소중한 사람이에요. 그 마음 오늘 꼭 표현해보세요.", bad:"💫 "+DEMO_NAME+"님, 솔직한 대화 한 번이 이 관계에 큰 변화를 만들 수 있어요."},
  "💔 솔로": {good:"💫 "+DEMO_NAME+"님은 충분히 사랑받을 자격이 있는 사람이에요. 그 빛을 숨기지 마세요.", bad:"💫 "+DEMO_NAME+"님을 가장 사랑해야 할 사람은 "+DEMO_NAME+"님 자신이에요. 먼저 나를 사랑하세요."},
  "💍 결혼 고려 중": {good:"💫 "+DEMO_NAME+"님, 용기 있는 한 마디가 두 사람의 미래를 열 수 있어요. 지금이에요.", bad:"💫 "+DEMO_NAME+"님, 탄탄한 기반 위에서 시작하는 사랑이 더 오래가요. 천천히, 그리고 확실하게."},
  "💒 결혼 중": {good:"💫 "+DEMO_NAME+"님, 매일의 일상이 사랑이에요. 오늘 파트너에게 고맙다고 말해보세요.", bad:"💫 "+DEMO_NAME+"님, 먼저 다가가는 것이 진짜 용기예요. "+DEMO_NAME+"님이 이 관계를 지킬 수 있어요."},
  "😢 이별 직후": {good:"💫 "+DEMO_NAME+"님은 이 아픔보다 훨씬 강한 사람이에요. 더 좋은 인연이 반드시 찾아와요.", bad:"💫 "+DEMO_NAME+"님, 지금의 아픔이 "+DEMO_NAME+"님을 더 단단하게 만들고 있어요. 괜찮아요."},
};

// 크로스셀링 배너
const CROSS_SELL = [
  {emoji:"🔮", title:"사주 궁합 보기", desc:"두 사람의 사주로 더 깊은 인연 분석", price:"980원"},
  {emoji:"👁️", title:"커플 관상 궁합", desc:"얼굴에 새겨진 두 사람의 운명적 인연", price:"980원"},
  {emoji:"🌟", title:"전생 인연 풀이", desc:"전생에서부터 이어진 인연일까요?", price:"980원"},
  {emoji:"📅", title:"좋은 날 찾기", desc:"두 사람에게 가장 좋은 날을 찾아드려요", price:"980원"},
];

// 타이밍 조언
const TIMING = {
  "💕 연애 중 (1년 미만)": {good:"앞으로 2~4주 내에 중요한 전환점이 올 수 있어요. 그 순간을 놓치지 마세요.", bad:"지금 당장보다 한 달 후가 대화하기 더 좋은 시기예요. 너무 미루지는 마세요."},
  "💑 연애 중 (1년 이상)": {good:"지금이 다음 단계로 나아갈 타이밍이에요. 함께 미래를 이야기해보세요.", bad:"지금 당장의 결정보다 서로 충분히 이야기하는 시간이 먼저예요."},
  "🌱 썸 타는 중": {good:"이번 달 안에 관계를 발전시킬 기회가 생길 거예요. 주말이나 특별한 날을 활용해보세요.", bad:"2~3주 더 자연스럽게 관계를 쌓고 나서 표현하세요."},
  "💔 솔로": {good:"앞으로 1~3개월 안에 새로운 만남의 기회가 생길 수 있어요. 새로운 환경에 적극적으로 참여해보세요.", bad:"지금은 만남보다 자기계발에 집중하세요. 준비됐을 때 인연이 찾아와요."},
  "💍 결혼 고려 중": {good:"결혼 이야기를 꺼내기 좋은 타이밍이 가까워지고 있어요. 편안한 상황에서 자연스럽게 꺼내보세요.", bad:"아직은 서두르지 말고 6개월 정도 더 관계를 다지는 시간을 가져보세요."},
  "💒 결혼 중": {good:"지금 파트너와 함께하는 시간을 늘려보세요. 작은 여행이나 새로운 경험을 함께하면 좋아요.", bad:"이번 주 안에 파트너와 솔직한 대화 시간을 만들어보세요."},
  "😢 이별 직후": {good:"3개월 정도 자신을 충분히 치유한 후에 새로운 만남을 시작해보세요.", bad:"재회를 원한다면 최소 2~3개월은 거리를 두고 서로에게 공간을 주세요."},
};

// 해야할것/하지말아야할것 (연애상태별)
const ACTIONS = {
  "💕 연애 중 (1년 미만)": {
    good: {do:["설렘을 그대로 솔직하게 표현하기","함께 새로운 경험 많이 쌓기","상대방의 일상에 진심으로 관심 갖기"], dont:["비교하거나 의심하기","SNS 반응 체크로 스스로 불안 만들기","완벽한 모습만 보이려 애쓰기"]},
    bad: {do:["지금 느끼는 불편함 솔직하게 이야기하기","상대방의 속도 존중하기","작은 것부터 함께 해결해나가기"], dont:["감정적으로 폭발하기","억지로 빠른 결론 내리기","혼자 참고 쌓아두기"]},
  },
  "💑 연애 중 (1년 이상)": {
    good: {do:["처음 만났을 때처럼 표현하기","함께하는 새로운 루틴 만들기","상대방의 변화에 관심 갖기"], dont:["말 안 해도 알겠지 방심하기","비교하며 과거를 들먹이기","권태를 외면하고 방치하기"]},
    bad: {do:["오래된 오해 하나씩 풀기","각자의 공간과 시간 존중하기","관계의 목적과 방향 다시 확인하기"], dont:["감정 쌓아두다 한꺼번에 폭발하기","포기하듯 무관심해지기","상대방을 변화시키려 강요하기"]},
  },
  "🌱 썸 타는 중": {
    good: {do:["진심 어린 관심 표현하기","자연스러운 만남의 기회 만들기","상대방이 편안함을 느낄 수 있게 하기"], dont:["밀당하며 감정 숨기기","SNS로만 존재감 드러내기","고백 타이밍 재다가 기회 놓치기"]},
    bad: {do:["자연스러운 분위기 유지하기","상대방에게 공간 주기","자기 자신을 더 매력적으로 가꾸기"], dont:["집착하거나 압박 주기","술자리나 감정적 순간에 고백하기","결과에 집착해 관계를 망치기"]},
  },
  "💔 솔로": {
    good: {do:["자신감 있게 자신을 드러내기","새로운 모임이나 환경에 참여하기","자신의 매력을 발견하고 개발하기"], dont:["억지로 빠르게 연애 시작하려 하기","전 연인과 비교하기","완벽한 사람만 찾으려 하기"]},
    bad: {do:["자신을 먼저 충분히 사랑하기","취미나 자기계발에 집중하기","주변 좋은 인연에 열린 마음 갖기"], dont:["연애에 지나치게 집착하기","외로움에 아무나 붙잡기","자신을 너무 낮추기"]},
  },
  "💍 결혼 고려 중": {
    good: {do:["결혼에 대한 솔직한 대화 시작하기","공통의 미래 그림 그리기","서로의 가족과 친해지기"], dont:["완벽한 타이밍만 기다리기","혼자 결정하고 통보하기","현실적인 문제를 외면하기"]},
    bad: {do:["서로의 두려움과 걱정 솔직하게 나누기","결혼 전 중요한 이슈들 하나씩 해결하기","전문적인 커플 상담 고려하기"], dont:["강요하거나 최후통첩하기","중요한 문제를 '나중에' 미루기","감정적으로 결혼을 결정하거나 취소하기"]},
  },
  "💒 결혼 중": {
    good: {do:["일상 속 작은 감사 표현하기","둘만의 특별한 시간 만들기","서로의 개인 시간 존중하기"], dont:["당연하게 여기기","불만을 쌓아두기","비교하며 서운함 키우기"]},
    bad: {do:["쌓인 감정 솔직하게 표현하기","상대방의 입장에서 먼저 생각하기","필요하다면 커플 상담 받기"], dont:["혼자 해결하려 하기","참다가 폭발하기","제3자에게 먼저 털어놓기"]},
  },
  "😢 이별 직후": {
    good: {do:["충분히 슬퍼하고 감정 소화하기","자신을 돌보는 루틴 만들기","신뢰할 수 있는 사람과 이야기 나누기"], dont:["술로 감정 달래기","재회 시도하기","SNS로 상대 근황 체크하기"]},
    bad: {do:["자신의 감정을 있는 그대로 인정하기","새로운 목표나 관심사 찾기","전문가의 도움 받기"], dont:["억지로 빨리 괜찮아지려 하기","보복심으로 행동하기","자신을 탓하며 자존감 낮추기"]},
  },
};


// ━━━ 카드별 단독 의미 + 3장 조합 + 날카로운 심리 묘사 ━━━
const CARD_MEANING = {
  pos0_solo: {
    good: "이 카드가 '상대방의 현재 마음' 자리에 정방향으로 나왔다는 건 단순히 좋다는 게 아니에요. 지금 이 순간 그 사람의 에너지가 규미님을 향해 열려있다는 뜻이에요. 타로에서 이 자리에 이 기운이 나오는 경우는 생각보다 드물어요.",
    bad: "이 카드가 이 자리에 역방향으로 나왔다는 건 상대방의 마음이 지금 닫혀있거나 혼란스러운 상태라는 신호예요. 감정이 없는 게 아니라 정리가 안 된 거예요. 이 차이가 중요해요.",
  },
  pos1_solo: {
    good: "관계의 흐름 자리에서 이 기운이 나왔어요. 두 사람 사이의 에너지가 같은 방향으로 흐르고 있다는 뜻이에요. 강물이 자연스럽게 바다로 향하듯, 이 관계도 자연스러운 방향을 찾아가고 있어요.",
    bad: "관계의 흐름이 막혀있어요. 두 사람의 에너지가 서로 다른 방향으로 향하고 있어요. 이건 감정이 없다는 게 아니라 타이밍이 어긋나고 있다는 신호예요.",
  },
  pos2_solo: {
    good: "앞으로의 전망 자리에서 좋은 기운이 나왔어요. 카드가 미래에 대해 이렇게 명확한 긍정 신호를 보내는 경우는 흔하지 않아요. 지금 규미님이 느끼는 가능성, 틀리지 않았어요.",
    bad: "앞으로의 전망 자리에서 경고 신호가 나왔어요. 지금 이대로라면 원하는 결과가 오기 어려울 수 있어요. 하지만 카드는 현재 상태를 보여주는 거예요. 지금 행동이 바뀌면 결과도 바뀌어요.",
  },
};

// 3장 조합 해석
const COMBO = {
  "ggg": {text:"3장 모두 좋은 기운이에요. 타로에서 이런 배열은 드물어요. 상대방의 마음, 관계의 흐름, 앞으로의 전망이 모두 같은 방향을 가리키고 있어요.", pct:89, label:"매우 좋음 💚"},
  "ggb": {text:"앞으로의 흐름에서 약간의 주의가 필요해요. 지금 감정과 관계는 좋지만, 마지막 카드가 '지금 이대로만 가면 안 된다'고 말하고 있어요. 무언가 하나를 바꿔야 해요.", pct:71, label:"좋음 (주의 필요) 🟡"},
  "gbg": {text:"흥미로운 배열이에요. 상대방 마음은 열려있고 최종 전망도 좋지만, 지금 관계의 흐름이 막혀있어요. 잠재력은 충분하지만 지금 당장 뭔가를 뚫어야 해요.", pct:65, label:"가능성 있음 🟡"},
  "bgg": {text:"지금 당장은 상대방 마음이 닫혀있지만, 관계의 흐름과 미래 전망은 좋아요. 시간이 지나면 좋아질 수 있는 배열이에요.", pct:62, label:"시간 필요 🔵"},
  "bbg": {text:"지금 당장은 어렵지만 마지막 카드가 희망을 보여주고 있어요. 이 어려움이 영원하지 않다고 카드는 말하고 있어요.", pct:44, label:"인내 필요 🔵"},
  "bgb": {text:"관계의 흐름만 좋고 나머지가 막혀있어요. 두 사람 사이의 연결고리는 있지만, 양쪽 다 용기가 필요한 상황이에요.", pct:38, label:"용기 필요 🟠"},
  "gbb": {text:"상대방 마음만 열려있는 상태예요. 관계의 흐름과 전망이 막혀있어요. 지금 당장 큰 기대보다 작은 변화부터 시작하는 게 중요해요.", pct:35, label:"신중하게 🟠"},
  "bbb": {text:"카드 전체가 경고 신호를 보내고 있어요. 지금 상황을 직시해야 할 때예요. 하지만 카드는 현재를 보여줄 뿐, 미래를 결정하는 건 규미님이에요.", pct:18, label:"전면 재검토 🔴"},
};

// 날카로운 심리 묘사 (연애상태별, 랜덤 1개)
const SHARP = {
  "🌱 썸 타는 중": {
    good: ["그 사람, 규미님이 보낸 마지막 메시지를 여러 번 읽었을 거예요. 답장을 쓰다가 지웠을 가능성이 높아요. '이렇게 보내면 어떻게 생각할까'를 계속 고민하고 있어요.",
           "지금 그 사람 머릿속: '나도 먼저 연락하고 싶은데... 부담스럽게 생각하면 어쩌지.' 규미님을 밀어내는 게 아니라 조심스러운 거예요.",
           "이 사람, 친구들한테 규미님 이야기 한 번쯤 꺼낸 적 있을 거예요. '별로라고' 하면서 사실 많이 신경 쓰고 있어요."],
    bad:  ["그 사람이 관심이 없는 게 아니에요. 지금 다른 감정이나 상황이 마음을 닫게 만들고 있어요. 규미님 때문이 아니에요.",
           "지금 밀어붙이면 역효과예요. 연락 빈도를 줄이는 게 오히려 규미님을 더 생각하게 만들어요."],
  },
  "💕 연애 중 (1년 미만)": {
    good: ["요즘 표현이 줄었다고 느끼셨나요? 감정이 깊어질수록 말이 줄어드는 사람이 있어요. 가벼운 감정일 때 오히려 말이 많았을 거예요.",
           "이 사람이 규미님한테 화가 나거나 실망한 게 아니에요. 지금 이 관계를 어떻게 가져가야 할지 진지하게 생각하고 있어요. 좋은 신호예요."],
    bad:  ["최근에 뭔가 어색해졌다면, 그게 기분 탓이 아닐 수 있어요. 지금 두 사람 사이에 말하지 않은 것들이 쌓여있어요.",
           "지금 이 관계에서 규미님이 더 많이 노력하고 있다는 느낌 드시나요? 카드도 그걸 보여주고 있어요. 균형이 필요해요."],
  },
  "💑 연애 중 (1년 이상)": {
    good: ["오래된 연인들의 가장 큰 함정은 '말하지 않아도 알겠지'예요. 이 사람, 규미님이 먼저 표현해주길 기다리고 있어요.",
           "권태라고 느끼셨나요? 카드는 그게 '더 깊어지기 위한 조용한 시기'라고 말해요. 이 시기를 잘 넘기면 더 단단해져요."],
    bad:  ["서로 바쁘다는 핑계로 미뤄온 대화가 있죠? 그 대화가 이미 너무 오래 미뤄졌다고 카드는 말하고 있어요.",
           "이 사람, 지금 혼자 많은 생각을 하고 있어요. 그 생각들이 규미님과 공유되지 않으면 둘 사이의 거리가 벌어져요."],
  },
  "💍 결혼 고려 중": {
    good: ["결혼을 망설이게 만드는 건 감정이 아니라 두려움이에요. 카드는 두 사람의 감정은 충분하다고 말해요. 이제 용기의 문제예요.",
           "이 사람도 규미님과 같은 고민을 하고 있어요. 먼저 꺼내는 사람이 용기 있는 사람이에요."],
    bad:  ["결혼 전에 꼭 확인해야 할 것들이 있어요. 감정만으로 결정하지 말라고 카드가 경고하고 있어요.",
           "두 사람이 결혼이라는 단어를 꺼내지 않는 이유가 있어요. 그 이유를 먼저 마주해야 해요."],
  },
  "💒 결혼 중": {
    good: ["결혼 후 일상이 너무 익숙해져서 감사함을 잊게 될 때가 있어요. 파트너가 그 일상 속에서 규미님을 얼마나 의지하는지를 카드가 보여주고 있어요.",
           "부부 사이에도 설레는 순간이 필요해요. 지금이 그 설렘을 다시 만들 최적의 시기예요."],
    bad:  ["말하지 않은 서운함이 쌓여있어요. 둘 다 알고 있지만 꺼내기가 무서운 거죠. 더 미루면 안 돼요.",
           "지금 두 사람 중 한 명이 관계에서 외로움을 느끼고 있어요. 그 외로움이 해소되지 않으면 균열이 생겨요."],
  },
  "💔 솔로": {
    good: ["규미님이 생각하는 것보다 규미님의 매력을 알아보는 사람이 주변에 있어요. 아직 표현하지 못하고 있을 뿐이에요.",
           "인연은 찾으러 나갈 때가 아니라 자신에게 집중할 때 찾아와요. 지금 하고 있는 것들이 맞는 방향이에요."],
    bad:  ["지금 연애가 잘 안 되는 건 규미님에게 문제가 있어서가 아니에요. 타이밍의 문제예요. 지금은 준비해야 할 시기예요.",
           "최근에 다가왔다가 멀어진 사람이 있나요? 그게 우연이 아닐 수 있다고 카드는 말해요."],
  },
  "😢 이별 직후": {
    good: ["지금 이 아픔, 충분히 느끼세요. 억지로 괜찮은 척하지 않아도 돼요. 이 과정을 충분히 통과해야 다음이 온다고 카드는 말해요.",
           "그 사람 생각이 나는 건 당연해요. 카드가 보여주는 건 그 생각이 조금씩 옅어질 거라는 거예요."],
    bad:  ["재회를 원한다면 지금 연락하는 건 최악의 선택이에요. 거리를 두는 것이 오히려 재회 가능성을 높여요.",
           "지금 당장 새로운 만남으로 빈자리를 채우려 하면 더 상처받아요. 자신을 치유하는 것이 먼저예요."],
  },
};

// Q3 상황별 날카로운 한 마디
const SHARP_Q3 = {
  "💑 사귄 지 1년 미만": "아직 1년이 안 됐지만 카드는 이 관계의 깊이를 보고 있어요. 시간이 아니라 감정의 깊이가 중요해요.",
  "💍 사귄 지 1년 이상": "1년이 넘었다는 건 서로의 민낯을 봤다는 뜻이에요. 그럼에도 함께하고 있다면, 그게 이미 답이에요.",
  "💬 요즘 연락이 뜸해졌어": "연락이 줄어든 건 마음이 식어서가 아닐 수 있어요. 바빠서, 자신 없어서, 뭔가 고민이 있어서일 가능성이 더 높아요.",
  "🔥 최근에 싸웠어": "싸운 직후 카드를 뽑았군요. 카드가 말하는 건 이 싸움이 관계를 끝내는 게 아니라 더 단단하게 만드는 계기가 될 수 있다는 거예요. 먼저 화해하려는 노력이 필요해요.",
  "😶 감정 표현을 잘 안 해": "표현하지 않는 사람은 감정이 없는 게 아니에요. 너무 커서 어떻게 표현해야 할지 모르는 경우가 많아요. 그 침묵이 무관심이라고 단정 짓지 마세요.",
  "🌊 장거리 연애 중": "거리는 마음을 시험해요. 카드가 보여주는 건 그 시험을 두 사람이 어떻게 통과하고 있는지예요.",
  "💕 뭔가 잘 될 것 같은 좋은 느낌이야!": "그 직감, 맞아요. 카드도 같은 말을 하고 있어요. 좋은 예감은 대부분 틀리지 않아요.",
  "🌸 요즘 더 잘해줘서 기대가 돼": "상대방이 더 잘해주기 시작했다면 이유가 있어요. 그 변화가 진심에서 나온 것이라고 카드는 말해요.",
};

// 카드 이름별 연애 맞춤 해석
const CARD_LOVE = {
  "바보":        {good:"새로운 시작의 에너지예요. 두려움 없이 먼저 다가가도 좋다는 신호예요.", bad:"준비 없이 뛰어들면 상처받을 수 있어요. 조금 더 신중하게 접근하세요."},
  "마법사":      {good:"규미님의 행동이 결과를 만들어요. 지금 적극적으로 움직여야 할 때예요.", bad:"말과 행동이 다른 상황이 있어요. 진심을 일치시켜야 해요."},
  "여사제":      {good:"직감을 믿으세요. 지금 느끼는 그 감정, 틀리지 않았어요.", bad:"뭔가 숨겨진 게 있어요. 표면만 보지 말고 더 깊이 살펴보세요."},
  "여황제":      {good:"풍요로운 감정이 흘러요. 이 관계에서 사랑받을 준비가 되어있어요.", bad:"의존이 너무 강해질 수 있어요. 자신만의 중심을 잃지 마세요."},
  "황제":        {good:"안정적이고 믿을 수 있는 기운이에요. 이 관계의 기반이 탄탄해요.", bad:"너무 통제하려 하거나 완고한 태도가 관계를 막고 있어요."},
  "교황":        {good:"진지하고 깊은 감정이에요. 이 관계는 가볍지 않아요.", bad:"사회적 시선이나 주변 의견이 두 사람 사이를 막고 있어요."},
  "연인":        {good:"선택의 시간이에요. 마음이 정해졌다면 지금 표현하세요. 이보다 좋은 타이밍은 없어요.", bad:"갈림길에 서 있어요. 한쪽을 선택하지 않으면 둘 다 잃을 수 있어요."},
  "전차":        {good:"앞으로 나아가야 할 때예요. 망설임은 기회를 놓치게 해요.", bad:"너무 강하게 밀어붙이면 오히려 상대가 도망가요."},
  "힘":          {good:"부드럽게 이끄는 힘이 있어요. 강요하지 않고도 상대방의 마음을 얻을 수 있어요.", bad:"인내심이 바닥나고 있어요. 조금만 더 버티면 결과가 달라져요."},
  "은둔자":      {good:"혼자만의 시간이 이 관계에 도움이 돼요. 내면을 들여다볼 시간이 필요해요.", bad:"너무 혼자서 생각하면 오해가 쌓여요. 대화가 필요해요."},
  "운명의 수레바퀴":{good:"흐름이 바뀌고 있어요. 지금까지 잘 안 됐다면 이제 달라질 거예요.", bad:"외부 상황이 관계를 흔들고 있어요. 두 사람이 함께 버텨야 해요."},
  "정의":        {good:"균형 잡힌 관계예요. 서로가 서로에게 공정해요.", bad:"관계가 한쪽으로 기울어 있어요. 균형을 되찾아야 해요."},
  "매달린 사람": {good:"기다림이 보상받는 시간이에요. 잠시 멈추는 것이 더 나아가기 위한 준비예요.", bad:"억지로 바꾸려 하지 마세요. 자연스러운 흐름에 맡기는 게 현명해요."},
  "죽음":        {good:"끝이 아니라 새로운 시작이에요. 지금 변화는 더 좋은 것을 위한 과정이에요.", bad:"무언가를 놓아줘야 해요. 붙잡고 있는 것이 새로운 가능성을 막고 있어요."},
  "절제":        {good:"균형과 조화가 이 관계의 핵심이에요. 서두르지 않을 때 가장 좋은 결과가 와요.", bad:"극단적인 감정이 관계를 흔들고 있어요. 중심을 잡으세요."},
  "악마":        {good:"강한 끌림이 있어요. 이 감정은 진짜예요. 의존이 되지 않도록만 주의하세요.", bad:"집착이나 두려움이 관계를 묶고 있어요. 놓아줘야 할 것이 있어요."},
  "탑":          {good:"갑작스러운 변화가 막힌 것을 뚫어주는 계기가 될 거예요.", bad:"예상치 못한 변화가 와요. 충격이 있겠지만 이것도 지나가요."},
  "별":          {good:"희망의 카드예요. 지금 힘들어도 좋은 것이 오고 있어요.", bad:"희망을 잃지 마세요. 지금 어두워 보여도 별빛은 항상 거기 있어요."},
  "달":          {good:"감정이 복잡하고 알 수 없어 보이지만, 그 안에 진심이 있어요.", bad:"환상과 현실을 구분해야 해요. 보이는 것이 전부가 아닐 수 있어요."},
  "태양":        {good:"가장 좋은 카드 중 하나예요. 기쁨과 성공의 에너지가 이 관계에 흐르고 있어요.", bad:"너무 낙관적으로만 보면 현실적인 문제를 놓칠 수 있어요."},
  "심판":        {good:"새로운 국면이 시작돼요. 중요한 전환점이 이 관계에 찾아와요.", bad:"과거에 대한 반성이 필요해요. 같은 실수를 반복하지 않으려면 먼저 돌아봐야 해요."},
  "세계":        {good:"완성의 에너지예요. 이 관계가 원하는 방향으로 결실을 맺을 준비가 되어있어요.", bad:"뭔가 마무리되지 않은 것이 있어요. 완성해야 다음으로 나아갈 수 있어요."},
};


// 행운 정보
function getLucky(seed){
  var r=(function(s){var n=(s>>>0)||1;return function(){n=(n*1664525+1013904223)>>>0;return n/0x100000000;}})(seed);
  var nums=[2,3,4,6,7,8,9,11,12,14,17,19,21,22];
  var colors=["장밋빛 핑크","부드러운 라벤더","따뜻한 코랄","골든 옐로","로즈골드","크림 화이트","피치 오렌지"];
  var days=["화요일","금요일","토요일"];
  var items=["장미 한 송이","연분홍 립스틱","핸드크림","좋아하는 향수","빨간 머리핀","달 모양 귀걸이","진주 귀걸이"];
  var times=["오후 2시~4시","저녁 7시~9시","오전 10시~12시","오후 8시~10시"];
  return {
    num:nums[Math.floor(r()*nums.length)],
    color:colors[Math.floor(r()*colors.length)],
    day:days[Math.floor(r()*days.length)],
    item:items[Math.floor(r()*items.length)],
    time:times[Math.floor(r()*times.length)],
  };
}

const CFG = {
  emoji:"💘", name:"연애 타로", badge:null,
  cardCount:3, price:980,
  desc:"3장 — 그 사람의 진짜 속마음은?",
  subtitle:"✦ 천기 오리지널 · 그 사람 마음 200% 해독",
  hashtags:"#천기타로 #연애타로 #그사람마음 #200%적중",
  intro:"3장의 카드로 상대방의 진짜 감정, 두 사람의 관계 흐름, 앞으로의 가능성까지 낱낱이 읽어드려요. 연애 상태별 맞춤 해석으로 딱 규미님의 상황을 짚어드려요.",
  features:["💕 연애 상태별 정밀 맞춤 해석","🔮 가장 궁금한 것에 집중한 심층 분석","❤️‍🔥 두 사람 관계 흐름 & 에너지","⏰ 연락/고백 최적 타이밍 조언","✅ 지금 해야 할 것 & 하지 말아야 할 것","🍀 연애 행운 아이템 & 행운 날"],
  positions:["상대방의 현재 마음","우리 관계의 흐름","앞으로의 전망"],
  loading:["월하노인 전화 연결 중... ☎️","붉은 실 연결 상태 확인 중... 🧶","두 사람의 기운 교차 분석 중... 💫","인연의 실 강도 측정 중... ❤️","상대방 마음 스캔 중... 🔍"],
  questions:[
    {
      title:"지금 연애 상태는?",
      icon:"💕",
      multi:false,
      opts:["🌱 썸 타는 중","💕 연애 중 (1년 미만)","💑 연애 중 (1년 이상)","💍 결혼 고려 중","💒 결혼 중","💔 솔로","😢 이별 직후 (3개월 미만)","💭 기타 (직접 입력)"],
      freeInput:false, skippable:false, placeholder:"",
    },
    {
      title:"지금 가장 궁금한 건?",
      icon:"🔮",
      multi:true,
      guide:"💡 하나만 고를수록 더 깊고 정밀하게 분석해드려요. 여러 개 선택하면 전체 흐름을 폭넓게 볼 수 있어요.",
      opts:["💘 그 사람 나를 좋아할까","❤️ 우리 잘 될까","💍 결혼까지 갈 수 있을까","💔 헤어진 사람과 재회할까","🆕 새로운 인연이 올까","💬 지금 연락해도 될까","🌟 전체 다 궁금해요!","💭 기타 (직접 입력)"],
      freeInput:false, skippable:false, placeholder:"",
    },
    {
      title:"그 사람 상황을 알려주세요",
      icon:"✏️",
      multi:false,
      opts:["💑 사귄 지 1년 미만","💍 사귄 지 1년 이상","💬 요즘 연락이 뜸해졌어","🔥 최근에 싸웠어","😶 감정 표현을 잘 안 해","🌊 장거리 연애 중","💕 뭔가 잘 될 것 같은 좋은 느낌이야!","🌸 요즘 더 잘해줘서 기대가 돼","💭 기타 (직접 입력)"],
      freeInput:false, skippable:true, placeholder:"",
    },
  ],
};

const CARDS=[
  {id:0,suit:"major",name:"봇짐 멘 유랑 선비",en:"The Fool",display:"바보",keyword:"새로운 시작, 모험, 순수함",good:true},
  {id:1,suit:"major",name:"도사 전우치",en:"The Magician",display:"마법사",keyword:"의지력, 창조, 집중",good:true},
  {id:2,suit:"major",name:"국무 대무당",en:"The High Priestess",display:"여사제",keyword:"직관, 신비, 잠재력",good:true},
  {id:3,suit:"major",name:"모후 중전마마",en:"The Empress",display:"여황제",keyword:"풍요, 창조성, 자연",good:true},
  {id:4,suit:"major",name:"곤룡포를 입은 왕",en:"The Emperor",display:"황제",keyword:"권위, 안정, 리더십",good:true},
  {id:5,suit:"major",name:"대제학 큰 스승",en:"The Hierophant",display:"교황",keyword:"전통, 신념, 안내",good:true},
  {id:6,suit:"major",name:"견우와 직녀",en:"The Lovers",display:"연인",keyword:"사랑, 선택, 조화",good:true},
  {id:7,suit:"major",name:"거북선 위 장군",en:"The Chariot",display:"전차",keyword:"승리, 의지, 전진",good:true},
  {id:8,suit:"major",name:"해태를 길들이는 여인",en:"Strength",display:"힘",keyword:"용기, 인내, 자제력",good:true},
  {id:9,suit:"major",name:"산속의 고승",en:"The Hermit",display:"은둔자",keyword:"내면탐구, 고독, 지혜",good:true},
  {id:10,suit:"major",name:"사방신과 윤도",en:"Wheel of Fortune",display:"운명의 수레바퀴",keyword:"변화, 운명, 순환",good:true},
  {id:11,suit:"major",name:"암행어사 판관",en:"Justice",display:"정의",keyword:"균형, 진실, 인과",good:true},
  {id:12,suit:"major",name:"유배된 유학자",en:"The Hanged Man",display:"매달린 사람",keyword:"희생, 새 관점, 대기",good:false},
  {id:13,suit:"major",name:"저승사자",en:"Death",display:"죽음",keyword:"변환, 끝과 시작, 해방",good:false},
  {id:14,suit:"major",name:"물을 나누는 선녀",en:"Temperance",display:"절제",keyword:"조화, 균형, 인내",good:true},
  {id:15,suit:"major",name:"도깨비",en:"The Devil",display:"악마",keyword:"속박, 욕망, 물질주의",good:false},
  {id:16,suit:"major",name:"벼락 맞는 경회루",en:"The Tower",display:"탑",keyword:"갑작스런 변화, 해방",good:false},
  {id:17,suit:"major",name:"칠성신",en:"The Star",display:"별",keyword:"희망, 영감, 치유",good:true},
  {id:18,suit:"major",name:"달토끼와 월궁",en:"The Moon",display:"달",keyword:"환상, 불안, 무의식",good:false},
  {id:19,suit:"major",name:"해님과 동자",en:"The Sun",display:"태양",keyword:"성공, 기쁨, 활력",good:true},
  {id:20,suit:"major",name:"나팔 부는 신선",en:"Judgement",display:"심판",keyword:"부활, 반성, 전환점",good:true},
  {id:21,suit:"major",name:"천하도 속 무희",en:"The World",display:"세계",keyword:"완성, 통합, 성취",good:true},
  ...Array.from({length:56},(_,i)=>({id:22+i,suit:["붓","청자","환도","엽전"][Math.floor(i/14)],name:["붓","청자","환도","엽전"][Math.floor(i/14)]+" "+((i%14)+2),en:"Card "+(22+i),display:["붓","청자","환도","엽전"][Math.floor(i/14)]+" "+((i%14)+2),keyword:"신비로운 기운이 흐릅니다",good:i%3!==0}))
];

function rng(seed){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/0x100000000;};}
function GBtn({children,onClick,dim}){
  return <button onClick={onClick} style={{width:"100%",padding:"15px",border:"none",borderRadius:13,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"'Noto Serif KR',serif",background:dim?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#E8C87A,#C4922A)",color:dim?"rgba(255,255,255,0.5)":"#0D0D14"}}>{children}</button>;
}
function CardBack({size}){var s=size||72;return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:s*0.08,border:"1.5px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:s*0.25,filter:"brightness(0.35)"}}>🃏</span></div>;}
function CardFront({card,isReversed,size}){
  var s=size||100;
  return <div style={{width:s,height:s*1.55,background:"linear-gradient(135deg,#1a2a4a,#0d1a2e)",borderRadius:s*0.08,border:"2px solid rgba(232,200,122,0.5)",overflow:"hidden",position:"relative",transform:isReversed?"rotate(180deg)":"none",boxShadow:"0 0 20px rgba(232,200,122,0.2)"}}>
    <img src={"/tarot/joseon/"+card.id+".png"} alt={card.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={function(e){e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
    <div style={{display:"none",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",padding:8,position:"absolute",inset:0}}><span style={{fontSize:s*0.28,marginBottom:4}}>🃏</span><p style={{fontSize:s*0.1,color:G,fontWeight:700,textAlign:"center",margin:0}}>{card.display}</p></div>
    {isReversed&&<div style={{position:"absolute",top:4,right:4,fontSize:8,background:"rgba(255,80,80,0.85)",color:"#fff",padding:"1px 5px",borderRadius:5,transform:"rotate(180deg)"}}>역방향</div>}
  </div>;
}

export default function TaroPage(){
  var [step,setStep]=useState("info");
  var [qStep,setQStep]=useState(0);
  var [answers,setAnswers]=useState(["","",""]);
  var [multiSel,setMultiSel]=useState([]);
  var [freeText,setFreeText]=useState("");
  var [activeIdx,setActiveIdx]=useState(null);
  var [cards,setCards]=useState([]);
  var [openCard,setOpenCard]=useState(null);
  var [loadPct,setLoadPct]=useState(0);
  var [loadMsgIdx,setLoadMsgIdx]=useState(0);
  var [selectedCards,setSelectedCards]=useState([]);
  var needed=3;
  var shuffledRef=useRef(null);
  if(!shuffledRef.current){var arr=CARDS.slice();for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp;}shuffledRef.current=arr;}
  var deck=shuffledRef.current;
  var ivRef=useRef(null); var timerRef=useRef(null);
  var c=CFG;

  useEffect(function(){
    return function(){if(timerRef.current)clearTimeout(timerRef.current);};
  },[step]);

  useEffect(function(){
    if(step!=="loading")return;
    setLoadPct(0);setLoadMsgIdx(0);var pct=0;
    ivRef.current=setInterval(function(){
      pct=Math.min(100,pct+Math.random()*4+2);
      setLoadPct(Math.floor(pct));
      if(Math.random()>0.9)setLoadMsgIdx(function(i){return(i+1)%c.loading.length;});
      if(pct>=100){
        clearInterval(ivRef.current);
        var drawn=selectedCards.map(function(idx,i){var card=deck[idx];var rev=Math.random()>0.62;return {card:card,isReversed:rev,pos:c.positions[i],isGood:card.good&&!rev};});
        setCards(drawn);
        setTimeout(function(){setStep("result");},500);
      }
    },160);
    return function(){clearInterval(ivRef.current);};
  },[step]);

  var goodCount=cards.filter(function(x){return x.isGood;}).length;
  var isGood=goodCount>=2;
  var q1=answers[0]||""; // 연애 상태
  var q2=answers[1]||""; // 가장 궁금한 것
  var q3=answers[2]||""; // 상황
  var lucky=getLucky(Date.now());
  var posDetails=[DETAIL.pos0,DETAIL.pos1,DETAIL.pos2];
  var synData=q1&&SYN_BY_STATUS[q1]?(isGood?SYN_BY_STATUS[q1].good:SYN_BY_STATUS[q1].bad):(isGood?"카드가 전반적으로 좋은 기운을 보여주고 있어요.":"카드가 신중함을 요청해요.");
  var timingData=q1&&TIMING[q1]?(isGood?TIMING[q1].good:TIMING[q1].bad):"타이밍을 잘 살펴보세요.";
  var actionData=q1&&ACTIONS[q1]?(isGood?ACTIONS[q1].good:ACTIONS[q1].bad):(isGood?ACTIONS["🌱 썸 타는 중"].good:ACTIONS["🌱 썸 타는 중"].bad);
  var q2Detail=q2&&Q2_DETAIL[q2]?(isGood?Q2_DETAIL[q2].good:Q2_DETAIL[q2].bad):"";
  var q3Context=q3&&Q3_CONTEXT[q3]?Q3_CONTEXT[q3]:"";

  // ── 설명 팝업 ──
  if(step==="info") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"20px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>💘 연애 타로</h2>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6}}>3장의 카드로 그 사람 마음, 우리 관계, 앞으로의 흐름을 읽어드려요</p>
          </div>
          <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(116,185,255,0.18)",color:"#74B9FF",border:"1px solid #74B9FF44",fontWeight:700,flexShrink:0,marginLeft:8}}>BEST</span>
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
              <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",margin:0,textAlign:"center"}}>그 중 3장을 직관으로 직접 선택해요</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:1,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>🎴 3장 직접 선택</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>78장 중 직접 고르기</p>
            </div>
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:8,padding:"8px 10px",flex:2,textAlign:"center"}}>
              <p style={{fontSize:11,color:G,fontWeight:700,margin:"0 0 2px"}}>💘 3장 러브 리딩</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",margin:0}}>정방향 / 역방향 전부 해석</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 14px"}}>✦ 이 타로에서 알 수 있는 것</p>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>💘</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>상대방 마음 읽기</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 그 사람이 나를 어떻게 생각하는지</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🌊</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>관계 흐름 분석</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>두 사람 사이의 에너지가 어디로 향하는지</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🔮</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>앞으로의 전망</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>이 관계가 어떻게 발전할지</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>⏰</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>타이밍 조언</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>언제 행동해야 하는지 구체적 시기</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>✅</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>해야 할 것 / 하지 말 것</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>지금 당장 실행·금지 행동</p>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:18}}>🍀</span>
            </div>
            <div style={{paddingTop:2}}>
              <p style={{fontSize:12,fontWeight:700,color:"#F0EAD6",margin:"0 0 2px"}}>연애 행운 정보</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.5}}>행운 컬러·숫자·아이템·날짜</p>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",marginBottom:12}}>
          <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 12px"}}>✦ 카드 배열 (3장)</p>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>1</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>상대방의 현재 마음</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>2</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>우리 관계의 흐름</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"rgba(232,200,122,0.15)",border:"1px solid rgba(232,200,122,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:G,fontWeight:700}}>3</span>
            </div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>앞으로의 전망</span>
          </div>
        </div>
        <div style={{background:"rgba(232,200,122,0.08)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
          <p style={{fontSize:28,fontWeight:900,color:G,margin:"0 0 4px"}}>980원</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",margin:0}}>3장 풀 리딩 + 연애 상태별 맞춤 분석 + 타이밍 조언</p>
        </div>
        <GBtn onClick={function(){setStep("questions");}}>시작하기 →</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 누구? ──
  if(step==="who") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <button onClick={function(){setStep("info");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:8,display:"block"}}>← 돌아가기</button>
        <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{c.emoji} 누구의 {c.name}을(를) 볼까요?</h3>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>등록된 인물을 선택하거나 새로 추가하세요</p>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers(["","",""]);setMultiSel([]);}} style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:10,textAlign:"left"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(232,200,122,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
          <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 2px"}}>윤규미 <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.12)",padding:"1px 7px",borderRadius:10}}>본인</span></p><p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>2028-04-07 · 양력 · 여</p></div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:18}}>›</span>
        </button>
        <button onClick={function(){setStep("questions");setQStep(0);setAnswers(["","",""]);setMultiSel([]);}} style={{width:"100%",background:"transparent",border:"1px dashed rgba(232,200,122,0.28)",borderRadius:13,padding:"14px",cursor:"pointer",fontSize:13,color:G,fontFamily:"inherit",marginBottom:10}}>+ 새 인물 추가하고 시작</button>
        <GBtn onClick={function(){setStep("info");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 사전질문 ──
  if(step==="questions"){
    var curQ=c.questions[qStep];
    var totalQ=c.questions.length;
    var progress=(qStep/totalQ)*100;

    function selectSingle(opt){
      // 기타 선택 시 자유입력 모드
      if(opt==="💭 기타 (직접 입력)"){
        var na=answers.slice(); na[qStep]="💭기타"; setAnswers(na);
        return;
      }
      var na=answers.slice(); na[qStep]=opt; setAnswers(na);
      if(qStep<totalQ-1){setTimeout(function(){setQStep(qStep+1);setMultiSel([]);},300);}
      else{setTimeout(function(){setStep("spread");},300);}
    }

    function toggleMulti(opt){
      if(opt==="💭 기타 (직접 입력)") return;
      setMultiSel(function(prev){
        if(opt==="🌟 전체 다 궁금해요!") return ["🌟 전체 다 궁금해요!"];
        var next=prev.includes(opt)?prev.filter(function(x){return x!==opt;}):prev.concat(opt).filter(function(x){return x!=="🌟 전체 다 궁금해요!";});
        return next;
      });
    }

    function confirmMulti(){
      var val=multiSel.join(", ")||"건너뜀";
      var na=answers.slice(); na[qStep]=val; setAnswers(na);
      if(qStep<totalQ-1){setQStep(qStep+1);setMultiSel([]);}
      else{setStep("shuffle");}
    }

    function skipQ(){
      var na=answers.slice(); na[qStep]=""; setAnswers(na);
      if(qStep<totalQ-1){setQStep(qStep+1);setMultiSel([]);}
      else{setStep("shuffle");}
    }

    var isEtcMode=answers[qStep]==="💭기타";

    return(
      <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:60}}>
        <div style={{background:DG,padding:"18px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={function(){if(qStep>0){setQStep(qStep-1);setMultiSel([]);}else setStep("who");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",padding:0,fontFamily:"inherit"}}>←</button>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.4s"}}/></div>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{qStep+1}/{totalQ}</span>
          </div>
          <p style={{fontSize:11,color:G,letterSpacing:1,margin:"0 0 5px"}}>{curQ.icon} 더 정확한 분석을 위해</p>
          <h3 style={{fontSize:17,fontWeight:700,color:"#F0EAD6",margin:0,lineHeight:1.4}}>{curQ.title}</h3>
          {curQ.guide&&<p style={{fontSize:10,color:"rgba(255,255,255,0.45)",margin:"8px 0 0",lineHeight:1.6}}>{curQ.guide}</p>}
        </div>
        <div style={{padding:"16px"}}>
          {/* 기타 직접입력 모드 */}
          {isEtcMode?(
            <div style={{marginBottom:14}}>
              <textarea value={freeText} onChange={function(e){setFreeText(e.target.value);}} placeholder="직접 입력해주세요" rows={3}
                style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"12px 14px",fontSize:13,color:"#F0EAD6",fontFamily:"'Noto Serif KR',serif",resize:"none",boxSizing:"border-box",outline:"none",lineHeight:1.7}}/>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                <GBtn onClick={function(){var na=answers.slice();na[qStep]=freeText||"기타";setAnswers(na);setFreeText("");if(qStep<totalQ-1){setQStep(qStep+1);setMultiSel([]);}else setStep("shuffle");}}>이걸로 분석하기 →</GBtn>
                <button onClick={function(){var na=answers.slice();na[qStep]="";setAnswers(na);setFreeText("");if(qStep<totalQ-1){setQStep(qStep+1);}else setStep("shuffle");}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif"}}>건너뛰기</button>
              </div>
            </div>
          ):(
            <>
              {/* 단일선택 */}
              {!curQ.multi&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  {curQ.opts.map(function(opt){
                    var isSel=answers[qStep]===opt;
                    return <button key={opt} onClick={function(){selectSingle(opt);}} style={{padding:"13px 10px",borderRadius:13,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;
                  })}
                </div>
              )}
              {/* 복수선택 */}
              {curQ.multi&&(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                    {curQ.opts.map(function(opt){
                      var isSel=opt!=="💭 기타 (직접 입력)"&&multiSel.includes(opt);
                      if(opt==="💭 기타 (직접 입력)") return <button key={opt} onClick={function(){var na=answers.slice();na[qStep]="💭기타";setAnswers(na);}} style={{padding:"13px 10px",borderRadius:13,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:"rgba(255,255,255,0.05)",outline:"2px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5}}>{opt}</button>;
                      return <button key={opt} onClick={function(){toggleMulti(opt);}} style={{padding:"13px 10px",borderRadius:13,cursor:"pointer",fontSize:11,fontFamily:"'Noto Serif KR',serif",textAlign:"center",border:"none",background:isSel?"rgba(232,200,122,0.15)":"rgba(255,255,255,0.05)",outline:isSel?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.08)",color:isSel?"#E8C87A":"rgba(255,255,255,0.65)",transition:"0.15s",lineHeight:1.5,position:"relative"}}>{isSel&&<span style={{position:"absolute",top:6,right:8,fontSize:10}}>✓</span>}{opt}</button>;
                    })}
                  </div>
                  {multiSel.length>0&&<GBtn onClick={confirmMulti}>{multiSel.length}개 선택 완료 →</GBtn>}
                </>
              )}
              {/* 건너뛰기 */}
              {curQ.skippable&&(
                <button onClick={skipQ} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.4)",fontFamily:"'Noto Serif KR',serif",marginTop:8}}>
                  건너뛰고 바로 분석 →
                </button>
              )}
            </>
          )}
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
        {answers.filter(function(a){return a&&a!==""&&a!=="💭기타";}).length>0&&(
          <div style={{background:"rgba(232,200,122,0.07)",border:"1px solid rgba(232,200,122,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12}}>
            <p style={{fontSize:9,color:G,letterSpacing:2,margin:"0 0 8px"}}>✦ 입력하신 내용</p>
            {answers.map(function(a,i){return a&&a!==""&&a!=="💭기타"?(<p key={i} style={{fontSize:11,color:"rgba(255,255,255,0.65)",margin:"0 0 4px"}}>{c.questions[i].icon} {a}</p>):null;})}
          </div>
        )}
        <div style={{background:"rgba(232,200,122,0.1)",border:"1px solid rgba(232,200,122,0.25)",borderRadius:13,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 2px"}}>💰 보유 캐시</p><p style={{fontSize:18,fontWeight:700,color:G,margin:0}}>2,000원</p></div><button style={{padding:"7px 14px",background:"linear-gradient(135deg,#E8C87A,#C4922A)",border:"none",borderRadius:20,fontSize:12,fontWeight:700,color:"#0D0D14",cursor:"pointer"}}>캐시 사용</button></div>
        {[["🎟️","쿠폰 (0장)","눌러서 쿠폰 목록 보기"],["📋","이용권 (0장)","눌러서 이용권 목록 보기"]].map(function(x){return(<div key={x[1]} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}><div><p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.65)",margin:"0 0 1px"}}>{x[0]} {x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.3)",margin:0}}>{x[2]}</p></div><span style={{color:"rgba(255,255,255,0.3)"}}>▾</span></div>);})}
        <div style={{padding:"12px 0",borderTop:"1px solid rgba(255,255,255,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>상품 가격</span><span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{c.price.toLocaleString()}원</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"#F0EAD6"}}>결제 금액</span><span style={{fontSize:16,fontWeight:700,color:G}}>{c.price.toLocaleString()}원</span></div></div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:"0 0 10px",letterSpacing:1}}>= 결제 수단</p>
        {[["🟡","카카오페이","원터치 간편결제",true],["🔵","토스페이","간편결제",false],["💚","네이버페이","포인트 적립",false],["💳","카드결제","신용/체크카드",false],["📱","핸드폰 결제","통신사 결제",false]].map(function(x){return(<div key={x[1]} style={{background:x[3]?"rgba(232,200,122,0.07)":"rgba(255,255,255,0.03)",border:x[3]?"1px solid rgba(232,200,122,0.28)":"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:20,flexShrink:0}}>{x[0]}</span><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:"#F0EAD6",margin:"0 0 1px"}}>{x[1]}</p><p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>{x[2]}</p></div><div style={{width:18,height:18,borderRadius:"50%",border:x[3]?"2px solid #E8C87A":"2px solid rgba(255,255,255,0.22)",background:x[3]?"#E8C87A":"transparent",flexShrink:0}}/></div>);})}
        <div style={{height:12}}/><GBtn onClick={function(){setStep("loading");}}>분석하기 ({c.price.toLocaleString()}원) →</GBtn><div style={{height:8}}/><GBtn onClick={function(){setStep("spread");}} dim={true}>취소</GBtn>
      </div>
      <style>{"::-webkit-scrollbar{display:none}"}</style>
    </div>
  );

  // ── 로딩 ──
  if(step==="loading") return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:360,background:DG,borderRadius:20,padding:"32px 24px",textAlign:"center"}}>
        <p style={{fontSize:16,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px"}}>💘 연애 타로</p>
        {q1&&<p style={{fontSize:11,color:G,margin:"0 0 4px",background:"rgba(232,200,122,0.08)",padding:"5px 12px",borderRadius:20}}>✦ {q1}</p>}
        {q2&&<p style={{fontSize:10,color:"rgba(255,255,255,0.4)",margin:"0 0 20px"}}>"{q2}"</p>}
        <div style={{fontSize:50,marginBottom:14}}>🔮</div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 14px"}}>그 사람 마음 읽는 중...</p>
        <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:7}}><div style={{height:"100%",width:loadPct+"%",background:"linear-gradient(90deg,#E8C87A,#C4922A)",borderRadius:99,transition:"width 0.18s"}}/></div>
        <p style={{fontSize:14,color:G,fontWeight:700,margin:"0 0 10px"}}>{loadPct}%</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",minHeight:20,margin:"0 0 14px"}}>{c.loading[loadMsgIdx]}</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>화면을 나가도 분석은 계속됩니다</p>
      </div>
    </div>
  );

  // ── 결과 ──
  if(step==="result"&&cards.length>0) return(
    <div style={{minHeight:"100vh",background:"#111827",fontFamily:"'Noto Serif KR',serif",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      <div style={{background:DG,padding:"18px 16px"}}>
        <p style={{fontSize:9,color:G,letterSpacing:3,margin:"0 0 4px"}}>{c.subtitle}</p>
        <h2 style={{fontSize:19,fontWeight:700,color:"#F0EAD6",margin:"0 0 3px"}}>{DEMO_NAME}님의 💘 연애 타로</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0}}>카드를 탭하면 상세 해석이 펼쳐져요</p>
      </div>
      <div style={{padding:"14px 14px 0"}}>

        {/* ① 사전질문 요약 */}
        {q1&&(
          <div style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:12,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",borderLeft:"4px solid #E8C87A"}}>
            <p style={{fontSize:9,color:"#7A5C00",letterSpacing:2,margin:"0 0 8px"}}>✦ 오늘의 상황 분석</p>
            <p style={{fontSize:14,fontWeight:700,color:"#111",margin:"0 0 4px"}}>{q1} 상태이시군요</p>
            {q2&&q2!==""&&<p style={{fontSize:12,color:"rgba(0,0,0,0.6)",margin:"0 0 3px"}}>🔮 "{q2}"이(가) 가장 궁금하시군요</p>}
            {q3&&q3!==""&&<p style={{fontSize:12,color:"rgba(0,0,0,0.55)",margin:"0 0 3px"}}>💬 {q3}</p>}
            {q3Context&&<p style={{fontSize:11,color:"#7A5C00",margin:"6px 0 0",fontStyle:"italic",background:"rgba(232,200,122,0.08)",padding:"6px 10px",borderRadius:8}}>{q3Context}</p>}
          </div>
        )}

        {/* ② 카드 배열 3장 */}
        <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>🃏 뽑힌 카드 · 탭하면 상세 해석</p>
          <div style={{display:"flex",justifyContent:"center",gap:12}}>
            {cards.map(function(cd,i){return(
              <div key={i} onClick={function(){setOpenCard(openCard===i?null:i);}} style={{textAlign:"center",cursor:"pointer",flex:1,maxWidth:115}}>
                <div style={{border:openCard===i?"2.5px solid #E8C87A":"2.5px solid transparent",borderRadius:10,padding:2,transition:"0.2s"}}><CardFront card={cd.card} isReversed={cd.isReversed} size={95}/></div>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"6px 0 2px"}}>{cd.pos}</p>
                <p style={{fontSize:10,fontWeight:700,color:cd.isGood?"#2E7D32":"#C62828"}}>{cd.card.display}</p>
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
            :DEMO_NAME+"님, 이 자리에서 잠시 점검 신호가 나왔어요. 감정적으로 행동하기보다 차분하게 상황을 점검해보세요.";
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
                <p style={{fontSize:9,color:"#7A5C00",fontWeight:700,margin:"0 0 4px"}}>💰 연애 타로에서 이 카드는</p>
                <p style={{fontSize:12,color:"#333",lineHeight:1.75,margin:0}}>{cd.card.love||cd.card.keyword}</p>
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
                <p style={{fontSize:12,color:"#333",lineHeight:1.85,margin:0}}>{cd.isGood?"오늘 그 사람에게 가벼운 안부 메시지 하나 보내보세요. 거창하지 않아도 돼요. 작은 관심 표현이 관계를 앞으로 나아가게 해줄 거예요.":"오늘은 충동적인 연락이나 감정적 행동은 자제하세요. 자신을 위한 시간을 가지며 마음을 정리해보세요."}</p>
              </div>
            </div>
          );
        })()}

        {/* ④ 종합 해석 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>✦ 종합 해석</p>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:24}}>{isGood?"☀️":"🌙"}</span>
            <div><p style={{fontSize:15,fontWeight:800,color:isGood?"#2E7D32":"#C62828",margin:"0 0 2px"}}>{isGood?"전반적으로 좋은 기운":"주의가 필요한 기운"}</p><p style={{fontSize:11,color:"rgba(0,0,0,0.45)",margin:0}}>{goodCount}장 길 · {c.cardCount-goodCount}장 주의</p></div>
            <span style={{fontSize:22,marginLeft:"auto"}}>{goodCount===3?"💯":goodCount===2?"✨":goodCount===1?"⚠️":"🌧️"}</span>
          </div>
          <p style={{fontSize:13,color:"#222",lineHeight:2,margin:"0 0 12px",wordBreak:"keep-all"}}>{synData}</p>
          {/* Q2 메인 궁금증 답변 */}
          {q2&&q2Detail&&!(q2==="🌟 전체 다 궁금해요!")&&(
            <div style={{background:"rgba(232,200,122,0.08)",borderRadius:10,padding:"12px 14px",borderLeft:"3px solid #E8C87A"}}>
              <p style={{fontSize:10,color:"#7A5C00",margin:"0 0 5px",fontWeight:700}}>🔮 "{q2}"에 대한 카드의 답</p>
              <p style={{fontSize:13,color:"#333",lineHeight:1.85,margin:0,fontWeight:600}}>{q2Detail}</p>
            </div>
          )}
        </div>

        {/* ⑤ 타이밍 조언 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 12px"}}>⏰ 타이밍 조언</p>
          <p style={{fontSize:13,color:"#222",lineHeight:1.9,margin:0,wordBreak:"keep-all"}}>{timingData}</p>
        </div>

        {/* ⑥ 해야할것/하지말아야할것 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>✅ 지금 규미님에게 필요한 것</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#2E7D32",margin:"0 0 8px"}}>✓ 지금 해야 할 것</p>
              {actionData.do.map(function(a,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 7px",lineHeight:1.65,paddingLeft:8,borderLeft:"2px solid rgba(46,125,50,0.3)"}}>{a}</p>;})}
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#C62828",margin:"0 0 8px"}}>✗ 하지 말아야 할 것</p>
              {actionData.dont.map(function(a,i){return <p key={i} style={{fontSize:11,color:"#333",margin:"0 0 7px",lineHeight:1.65,paddingLeft:8,borderLeft:"2px solid rgba(198,40,40,0.3)"}}>{a}</p>;})}
            </div>
          </div>
        </div>

        {/* ⑦ 연애 행운 아이템 */}
        <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <p style={{fontSize:9,color:"#7A5C00",letterSpacing:3,margin:"0 0 14px"}}>🍀 오늘의 연애 행운</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["🎨","행운 컬러",lucky.color],["🔢","행운 숫자",String(lucky.num)],["📅","행운 날",lucky.day],["🎁","행운 아이템",lucky.item],["⏰","좋은 시간",lucky.time]].map(function(x){return(
              <div key={x[1]} style={{background:"#F9F7F2",borderRadius:12,padding:"12px",textAlign:"center"}}>
                <p style={{fontSize:18,margin:"0 0 4px"}}>{x[0]}</p>
                <p style={{fontSize:9,color:"rgba(0,0,0,0.4)",margin:"0 0 3px"}}>{x[1]}</p>
                <p style={{fontSize:12,fontWeight:700,color:"#333",margin:0}}>{x[2]}</p>
              </div>
            );})}
          </div>
        </div>

        {/* ⑧ 마무리 확언 */}
        {q1&&AFFIRMATION[q1]&&(
          <div style={{background:"linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.06))",border:"1px solid rgba(232,200,122,0.3)",borderRadius:16,padding:"20px 18px",marginBottom:12,textAlign:"center"}}>
            <p style={{fontSize:15,color:"#7A5C00",fontWeight:800,lineHeight:1.75,margin:"0 0 8px",wordBreak:"keep-all"}}>{isGood?AFFIRMATION[q1].good:AFFIRMATION[q1].bad}</p>
            <p style={{fontSize:10,color:"rgba(0,0,0,0.3)",margin:0}}>✦ 천기 카드의 메시지</p>
          </div>
        )}

        {/* ⑨ 크로스셀링 배너 */}
        <div style={{marginBottom:12}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 10px"}}>✦ 이런 콘텐츠도 있어요</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {CROSS_SELL.map(function(cs){return(
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
