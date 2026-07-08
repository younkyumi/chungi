import { NextRequest, NextResponse } from "next/server";

// AI 꿈/태몽 해석 — Gemini 풀 문장 종합 해석 (단일 키워드 lookup 한계 극복)
// POST /api/dream-ai  body: { dream: string, mode: "dream"|"taemong" }

export const maxDuration = 30;

// ━━━ v(2026-07-08): 안정화 — title/태명/요소/한끗차이 흔들림 fix ━━━
// 문제: title·womb_names·elements(emoji 포함)·similar_dreams(case 질문 자체)가 AI 자유생성이라
// 같은 입력을 여러 번 넣어도 매번 다르게 나옴. detail/trait 등 서술문은 다양해도 무방하지만
// 위 4개 필드는 "고정 후보 풀에서 결정"으로 전환. AI 응답과 무관하게 코드가 최종값을 덮어씀(완전 고정 보장).

// 문자열 경계 인식 매칭 — 단일음절 키워드(용/산/달/별/물/불/돈/집 등)가 다른 단어 일부로 오탐되는 걸
// 줄이기 위해 조사/공백/문장부호 경계에서만 매칭되도록 제한 (완벽한 NLP는 아니고 휴리스틱)
function boundaryRegex(words: string[]): RegExp {
  const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const alt = words.map(esc).join("|");
  return new RegExp(
    `(?:^|[\\s"'“‘(])(?:${alt})(?:이|가|을|를|은|는|에게|에서|처럼|같이|이랑|랑|와|과|[\\s"'”’).,!?~]|$)`,
    "u"
  );
}

// ── 태몽 카테고리 (18종, 우선순위 = 배열 순서) ──
const TAEMONG_CATS: { key: string; words: string[] }[] = [
  { key: "호랑이", words: ["호랑이", "범"] },
  { key: "용", words: ["용", "청룡", "황룡"] },
  { key: "뱀구렁이", words: ["뱀", "구렁이", "살모사", "이무기", "백사"] },
  { key: "돼지", words: ["돼지", "멧돼지"] },
  { key: "잉어", words: ["잉어", "물고기", "붕어", "메기", "금붕어"] },
  { key: "학", words: ["학", "두루미"] },
  { key: "곰", words: ["곰"] },
  { key: "독수리매", words: ["독수리", "매", "부엉이"] },
  { key: "꽃", words: ["꽃", "벚꽃", "매화", "모란", "국화"] },
  { key: "과일", words: ["복숭아", "사과", "포도", "과일", "석류"] },
  { key: "보석", words: ["보석", "진주", "다이아몬드", "옥"] },
  { key: "물바다", words: ["바다", "물", "강", "호수"] },
  { key: "산", words: ["산", "봉우리"] },
  { key: "태양", words: ["태양", "해"] },
  { key: "달", words: ["달", "초승달", "보름달"] },
  { key: "무지개", words: ["무지개"] },
  { key: "별", words: ["별", "별똥별", "유성"] },
  { key: "봉황", words: ["봉황"] },
];

function matchTaemongCategory(dream: string): string | null {
  for (const cat of TAEMONG_CATS) {
    if (boundaryRegex(cat.words).test(dream)) return cat.key;
  }
  return null;
}

const TAEMONG_TITLE_POOL: Record<string, string[]> = {
  호랑이: ["황금 호랑이 태몽", "산신령 호랑이 태몽", "용맹한 호랑이 태몽"],
  용: ["승천하는 용 태몽", "여의주 용 태몽", "황금빛 용 태몽"],
  뱀구렁이: ["큰 구렁이 태몽", "지혜로운 뱀 태몽", "황금빛 구렁이 태몽"],
  돼지: ["복덩이 돼지 태몽", "황금 돼지 태몽", "풍요의 돼지 태몽"],
  잉어: ["황금 잉어 태몽", "용문 오른 잉어 태몽", "은빛 물고기 태몽"],
  학: ["하늘을 나는 학 태몽", "고고한 학 태몽", "천년 학 태몽"],
  곰: ["든든한 곰 태몽", "백곰의 태몽", "웅혼한 곰 태몽"],
  독수리매: ["창공의 독수리 태몽", "비상하는 매 태몽", "왕의 독수리 태몽"],
  꽃: ["만개한 꽃 태몽", "화사한 벚꽃 태몽", "모란꽃 태몽"],
  과일: ["탐스러운 복숭아 태몽", "붉은 사과 태몽", "풍성한 과일 태몽"],
  보석: ["빛나는 진주 태몽", "영롱한 보석 태몽", "옥구슬 태몽"],
  물바다: ["푸른 바다 태몽", "넘실대는 물결 태몽", "깊은 바다 태몽"],
  산: ["웅장한 산 태몽", "명산의 정기 태몽", "우뚝 솟은 산 태몽"],
  태양: ["떠오르는 태양 태몽", "황금빛 태양 태몽", "붉은 해 태몽"],
  달: ["보름달 태몽", "은빛 달 태몽", "초승달 태몽"],
  무지개: ["일곱 빛깔 무지개 태몽", "하늘 다리 무지개 태몽", "오색 무지개 태몽"],
  별: ["반짝이는 별 태몽", "샛별 태몽", "별똥별 태몽"],
  봉황: ["상서로운 봉황 태몽", "오색 봉황 태몽", "봉황이 깃든 태몽"],
};
// 매칭 실패 시(파싱 실패 등 안전망) 사용할 신비로운 톤의 범용 title
const GENERIC_TAEMONG_TITLES = ["특별한 인연의 태몽", "하늘이 보낸 귀한 태몽", "신비로운 태몽의 손님"];

const TAEMONG_NAME_POOL: Record<string, { name: string; reason: string }[]> = {
  호랑이: [
    { name: "범이", reason: "용맹한 기운을 그대로 담았어요" },
    { name: "든든이", reason: "호랑이처럼 든든한 아이라는 뜻이에요" },
    { name: "다부", reason: "다부진 기운을 담았어요" },
  ],
  용: [
    { name: "용이", reason: "용의 기운을 그대로 담았어요" },
    { name: "여의", reason: "여의주처럼 귀한 아이라는 뜻이에요" },
    { name: "하늘이", reason: "하늘로 오르는 기운을 담았어요" },
  ],
  뱀구렁이: [
    { name: "슬기", reason: "뱀의 지혜로운 기운을 담았어요" },
    { name: "금비", reason: "황금 구렁이의 재물운을 담았어요" },
    { name: "유이", reason: "유연하고 지혜로운 아이라는 뜻이에요" },
  ],
  돼지: [
    { name: "복덩이", reason: "돼지꿈=재물복 상징을 그대로 담았어요" },
    { name: "풍이", reason: "풍요로운 기운을 담았어요" },
    { name: "통통이", reason: "넉넉하고 건강한 기운을 담았어요" },
  ],
  잉어: [
    { name: "잉이", reason: "잉어의 출세운을 담았어요" },
    { name: "은빈", reason: "은빛 물고기처럼 빛나는 아이라는 뜻이에요" },
    { name: "여울이", reason: "물살을 거슬러 오르는 기운을 담았어요" },
  ],
  학: [
    { name: "학이", reason: "고고하고 우아한 기운을 담았어요" },
    { name: "청학", reason: "맑고 귀한 기운을 담았어요" },
    { name: "나래", reason: "날개 펴고 나는 기운을 담았어요" },
  ],
  곰: [
    { name: "곰이", reason: "곰처럼 든든하고 강인한 기운을 담았어요" },
    { name: "웅이", reason: "웅혼한 기운(곰 熊)을 담았어요" },
    { name: "든든이", reason: "믿음직한 기운을 담았어요" },
  ],
  독수리매: [
    { name: "창이", reason: "창공을 가르는 기운을 담았어요" },
    { name: "비상이", reason: "높이 날아오르는 기운을 담았어요" },
    { name: "비랑", reason: "날렵하고 통찰력 있는 기운을 담았어요" },
  ],
  꽃: [
    { name: "꽃님", reason: "화사하고 사랑스러운 기운을 담았어요" },
    { name: "향이", reason: "은은한 향기 같은 기운을 담았어요" },
    { name: "봄이", reason: "만개하는 봄기운을 담았어요" },
  ],
  과일: [
    { name: "복숭이", reason: "장수·복을 상징하는 복숭아 기운을 담았어요" },
    { name: "탐스리", reason: "탐스럽고 건강한 기운을 담았어요" },
    { name: "알알이", reason: "알알이 영근 풍요로운 기운을 담았어요" },
  ],
  보석: [
    { name: "진주", reason: "귀하고 영롱한 기운을 그대로 담았어요" },
    { name: "보리", reason: "보석처럼 귀한 아이(보배)라는 뜻이에요" },
    { name: "옥이", reason: "맑고 귀한 옥구슬 기운을 담았어요" },
  ],
  물바다: [
    { name: "바다", reason: "넓고 깊은 기운을 그대로 담았어요" },
    { name: "물결이", reason: "유연하게 흐르는 기운을 담았어요" },
    { name: "다연", reason: "바다처럼 포용력 있는 기운을 담았어요" },
  ],
  산: [
    { name: "산이", reason: "우뚝하고 든든한 기운을 담았어요" },
    { name: "정기", reason: "산의 맑은 정기를 담았어요" },
    { name: "태산", reason: "흔들리지 않는 기운을 담았어요" },
  ],
  태양: [
    { name: "해님", reason: "밝고 따뜻한 기운을 그대로 담았어요" },
    { name: "양지", reason: "햇살 가득한 기운을 담았어요" },
    { name: "빛나", reason: "세상을 비추는 기운을 담았어요" },
  ],
  달: [
    { name: "달님", reason: "은은하고 신비로운 기운을 그대로 담았어요" },
    { name: "은아", reason: "은빛으로 빛나는 기운을 담았어요" },
    { name: "소망이", reason: "달에 비는 소망의 기운을 담았어요" },
  ],
  무지개: [
    { name: "무지", reason: "일곱 빛깔처럼 다채로운 기운을 담았어요" },
    { name: "오색이", reason: "다채로운 재능의 기운을 담았어요" },
    { name: "다리", reason: "하늘과 땅을 잇는 기운을 담았어요" },
  ],
  별: [
    { name: "별이", reason: "반짝이는 기운을 그대로 담았어요" },
    { name: "샛별", reason: "새벽을 여는 기운을 담았어요" },
    { name: "반짝이", reason: "빛나는 존재감을 담았어요" },
  ],
  봉황: [
    { name: "봉이", reason: "상서롭고 귀한 기운을 담았어요" },
    { name: "서이", reason: "상서로울 서(瑞)를 담았어요" },
    { name: "황이", reason: "봉황의 위엄 있는 기운을 담았어요" },
  ],
};
// 매칭 실패 시(파싱 실패 등 안전망) — 기존 폴백 유지
const GENERIC_TAEMONG_NAMES = [
  { name: "튼튼이", reason: "건강하게 자라라는 부모님 마음" },
  { name: "복덩이", reason: "복을 가득 안고 온 귀한 아이" },
  { name: "사랑이", reason: "사랑으로 기다린 우리 아기" },
];

// 한 끗 차이 태몽 — 슬롯: A(형제·변주) / B(대길몽) / C(약한 신호, 표현 다양화)
const TAEMONG_SCENARIOS: Record<string, { case: string; interpret: string }[]> = {
  호랑이: [
    { case: "호랑이가 새끼를 데리고 있었다면?", interpret: "🔄 형제운 신호! 여러 마리는 형제복이 두터워질 태몽이에요." },
    { case: "온몸이 황금빛이었다면?", interpret: "🌟 대길몽! 크게 될 인물을 예고하는 최고의 길몽이에요." },
    { case: "저 멀리서 지나가기만 했다면?", interpret: "🌤️ 또렷한 태몽이 아닐 수도 있지만, 좋은 기운이 스쳐간 건 분명해요." },
  ],
  용: [
    { case: "용이 여러 마리였다면?", interpret: "🔄 다둥이·형제운 신호일 수 있어요. 귀한 인연이 겹친다는 뜻이에요." },
    { case: "하늘로 승천하는 모습이었다면?", interpret: "🌟 대길몽! 큰 그릇으로 자라 이름을 알릴 강한 신호예요." },
    { case: "구름 사이로 잠깐 비쳤다면?", interpret: "🌤️ 스치는 태몽일 수도 있어요. 그래도 귀한 기운은 남아있어요." },
  ],
  뱀구렁이: [
    { case: "구렁이 여러 마리가 엉켜 있었다면?", interpret: "🔄 형제·인연 변주! 여러 마리는 여러 인연이 함께 온다는 신호예요." },
    { case: "황금빛으로 빛났다면?", interpret: "🌟 대길몽! 황금 구렁이는 재물운이 크게 트이는 신호예요." },
    { case: "잠깐 스쳐 지나갔다면?", interpret: "🌤️ 약한 신호일 수도 있지만, 지혜로운 기운은 여전히 남아있어요." },
  ],
  돼지: [
    { case: "돼지 여러 마리가 함께였다면?", interpret: "🔄 다둥이·형제복 신호! 여러 자녀의 복으로도 풀이돼요." },
    { case: "황금빛이거나 유난히 컸다면?", interpret: "🌟 대길몽! 평생 재물복이 마르지 않는다는 신호예요." },
    { case: "먼발치에서만 보였다면?", interpret: "🌤️ 또렷한 태몽은 아닐 수도 있지만, 복 기운은 여전히 함께해요." },
  ],
  잉어: [
    { case: "잉어가 여러 마리였다면?", interpret: "🔄 형제운 변주! 여러 자녀가 함께 잘 풀린다는 신호예요." },
    { case: "용문을 뛰어넘는 모습이었다면?", interpret: "🌟 대길몽! 등용문을 넘는 잉어는 큰 출세를 예고해요." },
    { case: "물속에 가만히 있기만 했다면?", interpret: "🌤️ 약한 신호일 수도 있어요. 그래도 성장의 기운은 품고 있어요." },
  ],
  학: [
    { case: "학이 여러 마리 함께 날았다면?", interpret: "🔄 형제운 변주! 무리 지은 학은 화목한 형제·자매운을 뜻해요." },
    { case: "눈부시게 흰빛으로 빛났다면?", interpret: "🌟 대길몽! 유난히 빛나는 학은 고고하고 귀한 인생을 예고해요." },
    { case: "잠시 머물다 홀연히 사라졌다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 우아한 기운은 남아있어요." },
  ],
  곰: [
    { case: "곰이 새끼와 함께였다면?", interpret: "🔄 형제운 신호! 새끼 곰이 함께라면 든든한 형제복으로 풀이돼요." },
    { case: "유난히 크고 위풍당당했다면?", interpret: "🌟 대길몽! 큰 곰은 강인하고 흔들림 없는 기운을 예고해요." },
    { case: "숲 저편에서 잠깐 스쳤다면?", interpret: "🌤️ 약한 신호일 수도 있어요. 그래도 든든한 기운은 남아있어요." },
  ],
  독수리매: [
    { case: "독수리가 여러 마리였다면?", interpret: "🔄 형제운 변주! 함께 나는 독수리는 서로를 이끄는 형제운을 뜻해요." },
    { case: "하늘 높이 솟구쳤다면?", interpret: "🌟 대길몽! 높이 솟는 독수리는 큰 이상을 이루는 신호예요." },
    { case: "하늘 저편으로 날아가버렸다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 통찰의 기운은 남아있어요." },
  ],
  꽃: [
    { case: "꽃이 만발한 꽃밭이었다면?", interpret: "🔄 형제운 변주! 여러 송이가 함께라면 화목한 형제복으로 풀이돼요." },
    { case: "유난히 화려하고 향기로웠다면?", interpret: "🌟 대길몽! 만개한 꽃은 아름답고 사랑받는 인생을 예고해요." },
    { case: "피기도 전에 시들어버렸다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 좋은 인연의 기운은 남아요." },
  ],
  과일: [
    { case: "과일이 주렁주렁 열려 있었다면?", interpret: "🔄 형제운 변주! 풍성히 열린 과일은 여러 자녀의 복으로도 풀이돼요." },
    { case: "유난히 탐스럽고 컸다면?", interpret: "🌟 대길몽! 탐스러운 과일은 큰 결실과 성취를 예고하는 신호예요." },
    { case: "손에 닿기 전에 떨어져버렸다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 풍요의 기운은 남아있어요." },
  ],
  보석: [
    { case: "보석이 여러 개였다면?", interpret: "🔄 형제운 변주! 여러 개의 보석은 여러 귀한 인연으로 풀이돼요." },
    { case: "유난히 크고 영롱했다면?", interpret: "🌟 대길몽! 크고 빛나는 보석은 귀하게 자랄 인생을 예고해요." },
    { case: "손에 쥐기 전에 사라졌다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 귀한 기운은 남아있어요." },
  ],
  물바다: [
    { case: "바다가 여러 갈래 물줄기였다면?", interpret: "🔄 형제운 변주! 여러 물줄기는 여러 인연이 모인다는 뜻이에요." },
    { case: "유난히 맑고 푸르렀다면?", interpret: "🌟 대길몽! 맑고 넓은 바다는 큰 포용력과 성취를 예고해요." },
    { case: "잠깐 발만 담그고 나왔다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 생명력의 기운은 남아요." },
  ],
  산: [
    { case: "산이 여러 봉우리였다면?", interpret: "🔄 형제운 변주! 여러 봉우리는 여러 인연이 함께한다는 뜻이에요." },
    { case: "유난히 웅장하고 맑았다면?", interpret: "🌟 대길몽! 웅장한 산은 흔들림 없는 큰 성취를 예고해요." },
    { case: "산 초입에서 발길을 돌렸다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 든든한 기운은 남아요." },
  ],
  태양: [
    { case: "태양이 두 개 이상이었다면?", interpret: "🔄 형제운 변주! 여러 개의 해는 여러 자녀의 밝은 미래를 뜻해요." },
    { case: "유난히 붉고 크게 떠올랐다면?", interpret: "🌟 대길몽! 크게 떠오르는 해는 밝은 성공과 명예를 예고해요." },
    { case: "동트기 전 살짝 비쳤다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 밝은 기운은 남아있어요." },
  ],
  달: [
    { case: "달이 두 개 이상이었다면?", interpret: "🔄 형제운 변주! 여러 개의 달은 여러 인연이 함께한다는 뜻이에요." },
    { case: "유난히 크고 은빛으로 빛났다면?", interpret: "🌟 대길몽! 크고 밝은 달은 신비롭고 귀한 기운을 예고해요." },
    { case: "구름에 가려 잠깐 보였다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 은은한 기운은 남아요." },
  ],
  무지개: [
    { case: "쌍무지개였다면?", interpret: "🔄 형제운 변주! 쌍무지개는 겹경사·형제복의 신호로도 풀이돼요." },
    { case: "유난히 선명하고 컸다면?", interpret: "🌟 대길몽! 선명한 무지개는 큰 행운과 좋은 소식을 예고해요." },
    { case: "눈 깜짝할 새 사라졌다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 행운의 기운은 남아요." },
  ],
  별: [
    { case: "별이 여러 개 쏟아졌다면?", interpret: "🔄 형제운 변주! 쏟아지는 별은 여러 재능·인연이 함께한다는 뜻이에요." },
    { case: "유난히 크고 밝게 빛났다면?", interpret: "🌟 대길몽! 크고 밝은 별은 빛나는 재능과 성취를 예고해요." },
    { case: "떴다가 금세 흐려졌다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 희망의 기운은 남아요." },
  ],
  봉황: [
    { case: "봉황이 짝을 이루고 있었다면?", interpret: "🔄 형제운 변주! 짝을 이룬 봉황은 화목한 형제·인연복을 뜻해요." },
    { case: "오색 빛깔로 화려했다면?", interpret: "🌟 대길몽! 오색 봉황은 귀하고 상서로운 큰 인물을 예고해요." },
    { case: "구름 속에서 언뜻 비쳤다면?", interpret: "🌤️ 스치는 신호일 수도 있어요. 그래도 상서로운 기운은 남아요." },
  ],
};

// ── 꿈해몽 카테고리 (14종) — 슬롯: A(대박몽) / B(경고몽) / C(변화몽) ──
const DREAM_CATS: { key: string; words: string[] }[] = [
  { key: "뱀", words: ["뱀", "구렁이", "살모사"] },
  { key: "돼지", words: ["돼지"] },
  { key: "용", words: ["용"] },
  { key: "이빨", words: ["이빨", "치아"] },
  { key: "물", words: ["물", "강", "비"] },
  { key: "불", words: ["불", "화재"] },
  { key: "하늘", words: ["하늘", "공중"] },
  { key: "죽음", words: ["죽음", "장례"] },
  { key: "돈", words: ["돈", "지갑", "현금"] },
  { key: "고양이", words: ["고양이"] },
  { key: "산", words: ["산"] },
  { key: "집", words: ["집"] },
  { key: "결혼", words: ["결혼", "웨딩"] },
  { key: "비행", words: ["비행기", "비행", "날다", "날았"] },
];

function matchDreamCategory(dream: string): string | null {
  for (const cat of DREAM_CATS) {
    if (boundaryRegex(cat.words).test(dream)) return cat.key;
  }
  return null;
}

const DREAM_SCENARIOS: Record<string, { case: string; interpret: string }[]> = {
  뱀: [
    { case: "물렸는데 안 아팠다면?", interpret: "🌟 대박몽! 아프지 않은 건 오히려 좋은 기운을 받아들인다는 신호예요." },
    { case: "물려서 아팠거나 도망쳤다면?", interpret: "⚠️ 경고몽! 결과가 나쁘게 끝나면 건강이나 인간관계를 조심하라는 신호." },
    { case: "내가 아닌 다른 사람이 물렸다면?", interpret: "🔄 변화몽! 남에게 일어난 일이면 관계의 방향을 다시 보라는 뜻이에요." },
  ],
  돼지: [
    { case: "돼지를 안거나 집으로 데려왔다면?", interpret: "🌟 대박몽! 돼지가 내게 왔다는 건 재물이 들어온다는 신호예요." },
    { case: "돼지가 도망가거나 사라졌다면?", interpret: "⚠️ 경고몽! 돼지가 떠나면 재물이 새어나갈 수 있으니 지출을 점검하세요." },
    { case: "돼지를 다른 사람이 데려갔다면?", interpret: "🔄 변화몽! 내 몫이 아니라 남의 몫이면 기회의 방향이 바뀔 신호예요." },
  ],
  용: [
    { case: "용을 타거나 직접 만졌다면?", interpret: "🌟 대박몽! 용과 직접 닿는 건 큰 기회가 내게 온다는 신호예요." },
    { case: "용이 나를 공격하거나 위협했다면?", interpret: "⚠️ 경고몽! 위협적인 용은 큰 부담이나 스트레스를 조심하라는 신호." },
    { case: "용이 나를 지나쳐 다른 곳으로 갔다면?", interpret: "🔄 변화몽! 기회가 다른 방향으로 흘러갈 수 있다는 뜻이에요." },
  ],
  이빨: [
    { case: "이가 빠졌는데 새 이가 났다면?", interpret: "🌟 대박몽! 새로 나는 이는 새로운 시작·좋은 변화의 신호예요." },
    { case: "이가 빠지고 피가 났다면?", interpret: "⚠️ 경고몽! 피가 나는 건 건강이나 가족 걱정을 조심하라는 신호예요." },
    { case: "다른 사람의 이가 빠지는 걸 봤다면?", interpret: "🔄 변화몽! 주변 사람의 변화·이별을 미리 알리는 신호일 수 있어요." },
  ],
  물: [
    { case: "맑은 물에서 헤엄쳤다면?", interpret: "🌟 대박몽! 맑은 물은 마음이 편안해지고 일이 술술 풀리는 신호예요." },
    { case: "흙탕물에 빠지거나 휩쓸렸다면?", interpret: "⚠️ 경고몽! 탁한 물은 건강이나 감정 문제를 조심하라는 신호예요." },
    { case: "물이 갑자기 빠지거나 말랐다면?", interpret: "🔄 변화몽! 상황이 급격히 바뀔 수 있다는 전환의 신호예요." },
  ],
  불: [
    { case: "불이 활활 타오르며 따뜻했다면?", interpret: "🌟 대박몽! 활활 타는 불은 열정과 재물운이 강해지는 신호예요." },
    { case: "불에 데거나 화재로 놀랐다면?", interpret: "⚠️ 경고몽! 다치는 불은 감정 소모나 갈등을 조심하라는 신호예요." },
    { case: "불이 갑자기 꺼졌다면?", interpret: "🔄 변화몽! 하던 일의 방향이나 관계가 바뀔 수 있다는 신호예요." },
  ],
  하늘: [
    { case: "하늘을 날거나 두둥실 떠올랐다면?", interpret: "🌟 대박몽! 하늘을 나는 건 자유롭고 큰 성취를 이루는 신호예요." },
    { case: "하늘에서 떨어지거나 추락했다면?", interpret: "⚠️ 경고몽! 추락은 자신감 저하나 실수를 조심하라는 신호예요." },
    { case: "하늘이 갑자기 어두워졌다면?", interpret: "🔄 변화몽! 예상치 못한 상황 변화가 다가온다는 신호예요." },
  ],
  죽음: [
    { case: "죽은 사람이 밝은 얼굴로 나타났다면?", interpret: "🌟 대박몽! 편안한 모습은 걱정이 사라지고 좋은 소식이 온다는 신호." },
    { case: "죽음이 두렵거나 슬프게 느껴졌다면?", interpret: "⚠️ 경고몽! 두려운 감정은 건강이나 스트레스를 점검하라는 신호." },
    { case: "죽었다가 다시 살아났다면?", interpret: "🔄 변화몽! 완전히 새로운 시작·전환점이 다가온다는 신호예요." },
  ],
  돈: [
    { case: "돈을 줍거나 선물로 받았다면?", interpret: "🌟 대박몽! 돈이 들어오는 꿈은 실제 재물운 상승의 직접적 신호예요." },
    { case: "돈을 잃어버리거나 도둑맞았다면?", interpret: "⚠️ 경고몽! 돈을 잃는 건 지출 관리나 사기를 조심하라는 신호예요." },
    { case: "돈을 다른 사람에게 줬다면?", interpret: "🔄 변화몽! 베푸는 마음이 다른 형태의 복으로 돌아올 신호예요." },
  ],
  고양이: [
    { case: "고양이가 다가와 애교를 부렸다면?", interpret: "🌟 대박몽! 다가오는 고양이는 좋은 인연이나 기회가 온다는 신호." },
    { case: "고양이가 할퀴거나 물었다면?", interpret: "⚠️ 경고몽! 공격하는 고양이는 가까운 사람과의 갈등을 조심하라는 신호." },
    { case: "고양이가 도망가버렸다면?", interpret: "🔄 변화몽! 놓치기 쉬운 기회이니 타이밍을 잘 살피라는 신호예요." },
  ],
  산: [
    { case: "산 정상에 올랐다면?", interpret: "🌟 대박몽! 정상에 오르는 건 목표를 이루는 성취의 신호예요." },
    { case: "산에서 길을 잃거나 굴러떨어졌다면?", interpret: "⚠️ 경고몽! 길을 잃는 건 방향성 고민이나 실수를 조심하라는 신호." },
    { case: "산을 멀리서 바라보기만 했다면?", interpret: "🔄 변화몽! 아직 시작 전이지만 큰 목표가 다가온다는 신호예요." },
  ],
  집: [
    { case: "새 집으로 이사하거나 집을 넓혔다면?", interpret: "🌟 대박몽! 넓어지는 집은 살림과 가족운이 커진다는 신호예요." },
    { case: "집이 무너지거나 불이 났다면?", interpret: "⚠️ 경고몽! 무너지는 집은 가정 내 갈등이나 건강을 조심하라는 신호." },
    { case: "낯선 집에 들어갔다면?", interpret: "🔄 변화몽! 새로운 환경이나 관계로의 전환이 다가온다는 신호예요." },
  ],
  결혼: [
    { case: "행복하게 결혼식을 올렸다면?", interpret: "🌟 대박몽! 행복한 결혼식은 실제 좋은 인연이나 성취의 신호예요." },
    { case: "결혼식에서 사고가 나거나 울었다면?", interpret: "⚠️ 경고몽! 불안한 결혼식은 관계 내 갈등을 조심하라는 신호예요." },
    { case: "결혼식에 다른 사람이 대신 있었다면?", interpret: "🔄 변화몽! 관계나 계획의 방향이 바뀔 수 있다는 신호예요." },
  ],
  비행: [
    { case: "비행기가 무사히 잘 날았다면?", interpret: "🌟 대박몽! 순항하는 비행기는 하는 일이 순조롭게 풀린다는 신호." },
    { case: "비행기가 흔들리거나 추락했다면?", interpret: "⚠️ 경고몽! 흔들리는 비행은 계획 차질이나 불안을 조심하라는 신호." },
    { case: "비행기를 놓치거나 못 탔다면?", interpret: "🔄 변화몽! 기회의 타이밍이 바뀔 수 있으니 유연하게 대처하라는 신호." },
  ],
};

// ── 요소 사전(태몽·꿈해몽 공통) — {emoji, meaning} 고정, 매칭 안 되면 기본값 ──
const ELEMENT_DICT: { key: string; emoji: string; meaning: string }[] = [
  { key: "호랑이", emoji: "🐯", meaning: "용맹함과 강한 추진력을 상징해요" },
  { key: "용", emoji: "🐉", meaning: "큰 그릇과 출세운을 상징해요" },
  { key: "뱀", emoji: "🐍", meaning: "지혜와 재물운을 상징해요" },
  { key: "구렁이", emoji: "🐍", meaning: "지혜와 재물운을 상징해요" },
  { key: "살모사", emoji: "🐍", meaning: "지혜와 재물운을 상징해요" },
  { key: "이무기", emoji: "🐍", meaning: "지혜와 재물운을 상징해요" },
  { key: "돼지", emoji: "🐷", meaning: "재물복과 풍요를 상징해요" },
  { key: "잉어", emoji: "🐟", meaning: "출세와 성장을 상징해요" },
  { key: "물고기", emoji: "🐟", meaning: "출세와 성장을 상징해요" },
  { key: "붕어", emoji: "🐟", meaning: "출세와 성장을 상징해요" },
  { key: "메기", emoji: "🐟", meaning: "출세와 성장을 상징해요" },
  { key: "학", emoji: "🦢", meaning: "고고함과 우아한 기품을 상징해요" },
  { key: "봉황", emoji: "🦚", meaning: "상서로움과 큰 그릇을 상징해요" },
  { key: "곰", emoji: "🐻", meaning: "든든함과 인내심을 상징해요" },
  { key: "독수리", emoji: "🦅", meaning: "높은 이상과 통찰력을 상징해요" },
  { key: "매", emoji: "🦅", meaning: "높은 이상과 통찰력을 상징해요" },
  { key: "소", emoji: "🐮", meaning: "근면함과 재물운을 상징해요" },
  { key: "고양이", emoji: "🐱", meaning: "영민함과 독립심을 상징해요" },
  { key: "거북", emoji: "🐢", meaning: "장수와 인내를 상징해요" },
  { key: "꽃", emoji: "🌸", meaning: "아름다움과 좋은 인연을 상징해요" },
  { key: "벚꽃", emoji: "🌸", meaning: "아름다움과 좋은 인연을 상징해요" },
  { key: "복숭아", emoji: "🍑", meaning: "풍요와 결실을 상징해요" },
  { key: "사과", emoji: "🍎", meaning: "풍요와 결실을 상징해요" },
  { key: "과일", emoji: "🍑", meaning: "풍요와 결실을 상징해요" },
  { key: "보석", emoji: "💎", meaning: "귀함과 재물을 상징해요" },
  { key: "진주", emoji: "💎", meaning: "귀함과 재물을 상징해요" },
  { key: "바다", emoji: "💧", meaning: "감정과 생명력을 상징해요" },
  { key: "물", emoji: "💧", meaning: "감정과 생명력을 상징해요" },
  { key: "산", emoji: "⛰️", meaning: "든든함과 큰 성취를 상징해요" },
  { key: "태양", emoji: "☀️", meaning: "밝은 미래와 명예를 상징해요" },
  { key: "해", emoji: "☀️", meaning: "밝은 미래와 명예를 상징해요" },
  { key: "달", emoji: "🌙", meaning: "직관과 은은한 기운을 상징해요" },
  { key: "무지개", emoji: "🌈", meaning: "행운과 좋은 소식을 상징해요" },
  { key: "별", emoji: "⭐", meaning: "빛나는 재능과 희망을 상징해요" },
  { key: "불", emoji: "🔥", meaning: "열정과 강한 에너지를 상징해요" },
  { key: "돈", emoji: "💰", meaning: "재물운의 직접적인 신호예요" },
  { key: "금전", emoji: "💰", meaning: "재물운의 직접적인 신호예요" },
  { key: "집", emoji: "🏠", meaning: "안정과 가정의 기운을 상징해요" },
  { key: "결혼", emoji: "💍", meaning: "새로운 인연과 좋은 관계를 상징해요" },
  { key: "비행", emoji: "🕊️", meaning: "자유와 높은 성취욕을 상징해요" },
  { key: "날다", emoji: "🕊️", meaning: "자유와 높은 성취욕을 상징해요" },
  { key: "추락", emoji: "📉", meaning: "불안한 마음의 반영이에요" },
  { key: "떨어짐", emoji: "📉", meaning: "불안한 마음의 반영이에요" },
  { key: "이빨", emoji: "🦷", meaning: "변화나 상실에 대한 신호예요" },
  { key: "치아", emoji: "🦷", meaning: "변화나 상실에 대한 신호예요" },
  { key: "죽음", emoji: "🕯️", meaning: "끝이 아닌 새로운 시작을 상징해요" },
  { key: "감싸임", emoji: "🤗", meaning: "보호받는 편안한 기운이에요" },
  { key: "포옹", emoji: "🤗", meaning: "보호받는 편안한 기운이에요" },
  { key: "평온", emoji: "😌", meaning: "마음의 안정을 상징해요" },
  { key: "두려움없음", emoji: "😌", meaning: "마음의 안정을 상징해요" },
];

function resolveElement(name: string): { emoji: string; meaning: string; matched: boolean } {
  const n = (name || "").trim();
  if (!n) return { emoji: "✨", meaning: "이 요소만의 특별한 기운이 있어요", matched: false };
  const found = ELEMENT_DICT.find((e) => n.includes(e.key) || e.key.includes(n));
  return found
    ? { emoji: found.emoji, meaning: found.meaning, matched: true }
    : { emoji: "✨", meaning: "이 요소만의 특별한 기운이 있어요", matched: false };
}

const DREAM_PROMPT = (dream: string) => `당신은 천기(天機) AI 해몽가입니다. 한국 전통 해몽서(주공해몽)와 현대 심리학 관점을 모두 갖춘 따뜻한 해석가예요.

다음 꿈을 정성껏 해석해주세요:
"${dream}"

규칙:
- 한국어로 답변
- 꿈에 등장하는 모든 요소를 종합 (단일 키워드 X)
- 전통 해몽 + 심리학 통찰 통합
- 사용자가 적은 꿈에 맞춰 모든 항목을 개인화. 일반론 X
- 응답은 반드시 아래 JSON 형식, 다른 텍스트 X

{
  "title": "이 꿈의 제목 (예: '큰 뱀과 결혼 꿈', 15자 이내)",
  "is_lucky": true 또는 false,
  "short": "한 줄 요약 해석 (50자 이내)",
  "detail": "상세 해석 — 등장 요소들을 종합해 250~350자로 풀이. 전통 해몽서 + 심리학적 의미 통합. 따뜻한 톤.",
  "similar_dreams": [
    { "case": "사용자 꿈과 한 끗 차이로 결과가 좋아진 상황 (예: '만약 무너진 건물에서 무사히 빠져나왔다면?'). 사용자 꿈에 등장한 요소만 사용하여 디테일 한 가지만 바꾸기. 30자 이내.", "interpret": "그 경우의 해석 — 길몽/대박몽/대운몽 등 좋은 타입 명시. 따뜻한 톤, 100자 이내." },
    { "case": "한 끗 차이로 경고가 강해진 상황 (예: '만약 내가 무너지는 건물에 깔렸다면?'). 30자 이내.", "interpret": "경고몽/흉몽 타입 명시 + 의미. 100자 이내." },
    { "case": "또 다른 방향의 변주 (예: '만약 무너진 건물이 내 집이었다면?'). 30자 이내.", "interpret": "변화몽/전환몽 등 다른 타입. 100자 이내." }
  ],
  "elements": [
    { "name": "꿈 속 요소명 (예: 뱀, 물, 꽃) — 감지만 하면 됨", "meaning": "이 요소의 의미 한 줄 (40자 이내, 참고용)" }
  ],
  "time_guide": {
    "morning": { "do": "아침 추천 행동 (40자 이내, 꿈 내용 반영)", "avoid": "아침 피할 일 (30자 이내)", "keyword": "키워드 1개" },
    "lunch": { "do": "점심 추천 행동 (40자 이내)", "avoid": "점심 피할 일 (30자 이내)", "keyword": "키워드 1개" },
    "afternoon": { "do": "오후 추천 행동 (40자 이내)", "avoid": "오후 피할 일 (30자 이내)", "keyword": "키워드 1개" },
    "evening": { "do": "저녁 추천 행동 (40자 이내)", "avoid": "저녁 피할 일 (30자 이내)", "keyword": "키워드 1개" }
  },
  "lucky": {
    "color": "행운 컬러 1개 (예: 황금색)",
    "number": "행운 숫자 1~99 정수",
    "direction": "행운 방향 (예: 동쪽)",
    "item": "행운 아이템 (예: 작은 거울)",
    "action": "오늘 꼭 해보면 좋을 행동 한 줄 (40자 이내)"
  },
  "advice": "오늘 활용 가이드 (80자 이내, 꿈에서 받은 핵심 메시지)"
}

elements는 2~4개. 사용자가 적은 꿈에 실제로 등장한 요소만 추출하세요. emoji는 코드에서 별도 고정 부여하니 name/meaning만 신경 쓰세요.

⚠️ similar_dreams 필드는 절대 빠뜨리지 마세요 (필수 2개). 사용자가 입력하지 않은 다른 상징(예: 물·불·동물 등)을 새로 도입하지 말고, 사용자 꿈의 디테일(주체·결과·장소·관계 등) 한 가지만 살짝 바꿔 해석이 어떻게 달라지는지 보여주세요. 이 섹션이 콘텐츠의 핵심 부가가치입니다.`;

const TAEMONG_PROMPT = (dream: string) => `당신은 천기(天機) AI 태몽 해석가입니다. 동양 태몽 전통과 현대 부모 심리학 모두에 정통한 해석가예요.

다음 태몽을 정밀 분석해주세요:
"${dream}"

규칙:
- 한국어로 답변
- 따뜻하고 부모님 마음에 와닿는 톤
- 응답은 반드시 아래 JSON 형식, 다른 텍스트 X

{
  "title": "태몽 제목 (예: '황금 호랑이 태몽', 15자 이내)",
  "is_lucky": true,
  "gender_hint": "아들" 또는 "딸" 또는 "미정",
  "confidence": 0~100 (신뢰도, 정수),
  "emoji": "태몽 핵심 이모지 1개 (예: 🐯)",
  "trait": "아이의 타고난 기질 (50자 이내)",
  "result": "태몽 해석 한 줄 (60자 이내)",
  "detail": "정밀 분석 — 전통 태몽 의미 + 아이의 기질·재능 + 사주에 미칠 영향 등 종합 200~300자. 따뜻한 톤.",
  "career_aptitude": "어울리는 미래 직업 1~2개 (30자 이내)",
  "name_tip": "이름 짓기 가이드 한 줄 (60자 이내)",
  "womb_names": [
    { "name": "태명(뱃속 별명, 2~4자, 부르기 쉽고 귀엽게, 예: 튼튼이·복덩이·햇살이)", "reason": "이 태명을 추천하는 이유 한 줄 — 태몽 요소 반영 (30자 이내)" }
  ],
  "elements": [
    { "name": "태몽 속 요소명 (예: 호랑이, 용, 과일, 물) — 감지만 하면 됨", "meaning": "이 요소가 아이에게 주는 의미 한 줄 (40자 이내, 참고용)" }
  ],
  "similar_dreams": [
    { "case": "키워드 하나로 성별이 바뀌는 경우 (예: '만약 호랑이가 새끼를 데리고 있었다면?'). 사용자 태몽 요소만 사용해 디테일 한 가지만 바꾸기. 30자 이내.", "interpret": "그 경우 성별·기질이 어떻게 달라지는지. 긍정적·따뜻한 톤. 100자 이내." },
    { "case": "키워드 하나로 더 길해지는 경우 (예: '만약 호랑이가 황금빛이었다면?'). 30자 이내.", "interpret": "더 길한 태몽 해석 — 대길몽/대박몽 등 좋은 타입 명시. 100자 이내." },
    { "case": "키워드 하나로 또렷한 태몽이 아닐 수도 있는 경우 (예: '만약 호랑이가 멀리 지나가기만 했다면?'). 30자 이내.", "interpret": "그 경우 일반 길몽일 수 있다는 중립적·따뜻한 안내. 100자 이내." }
  ]
}

elements는 2~4개. 사용자가 적은 태몽에 실제로 등장한 요소만 추출하세요. emoji는 코드에서 별도 고정 부여하니 name/meaning만 신경 쓰세요.
womb_names는 2~3개. 태몽 요소에서 따온 귀엽고 부르기 쉬운 태명으로, 긍정적인 의미만 담으세요.

⚠️ similar_dreams 필드는 절대 빠뜨리지 마세요 (필수 3개). 사용자가 입력하지 않은 다른 상징(예: 다른 동물·물체)을 새로 도입하지 말고, 사용자 태몽의 디테일(주체·결과·장소·관계 등) 한 가지만 살짝 바꿔 해석이 어떻게 달라지는지 보여주세요. ⚠️ 태몽은 축하 콘텐츠이므로 '점검몽·흉몽·경고·불안' 같은 부정 표현은 절대 쓰지 말고, 성별 변주·더 길해짐·일반 길몽 가능성처럼 긍정·중립으로만 풀어주세요. 이 섹션이 콘텐츠의 핵심 부가가치입니다.`;

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "GEMINI_API_KEY 미설정" }, { status: 500 });
  }

  const body = await req.json();
  const dream = (body.dream || "").trim();
  const mode = body.mode === "taemong" ? "taemong" : "dream";

  if (!dream) {
    return NextResponse.json({ error: "dream 텍스트 필요" }, { status: 400 });
  }
  if (dream.length > 1000) {
    return NextResponse.json({ error: "dream 1000자 이내" }, { status: 400 });
  }

  const prompt = mode === "taemong" ? TAEMONG_PROMPT(dream) : DREAM_PROMPT(dream);
  // v(2026-07-08): 사용자 입력에서 키워드 카테고리 감지 — title/태명/한끗차이 고정에 사용
  const taemongCat = mode === "taemong" ? matchTaemongCategory(dream) : null;
  const dreamCat = mode === "dream" ? matchDreamCategory(dream) : null;

  // v528: 다중 모델 fallback 체인 + retry — 결제 콘텐츠 안정성 강화
  // 모델 1개 실패 시 다음 모델로 자동 fallback (joseon-portrait 패턴 적용)
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
  let lastError = "unknown";
  let lastStatus = 0;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    // 각 모델당 retry 1회
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              responseMimeType: "application/json",
            },
          }),
        });
        if (!res.ok) {
          lastStatus = res.status;
          lastError = (await res.text()).slice(0, 300);
          // 503/429는 다음 모델/retry, 그 외는 현 모델 retry 1회 후 다음 모델
          if (attempt === 0 && (res.status === 503 || res.status === 429 || res.status >= 500)) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          break; // 다음 모델로
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let parsed: any = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 400));
            continue; // 파싱 실패도 retry
          }
          lastError = "JSON 파싱 실패";
          break;
        }
        parsed = parsed || {};

        // ── v(2026-07-08): 고정 필드 덮어쓰기 (title/태명/요소 emoji·meaning/한끗차이) ──
        if (mode === "taemong") {
          if (taemongCat && TAEMONG_TITLE_POOL[taemongCat]) {
            const pool = TAEMONG_TITLE_POOL[taemongCat];
            parsed.title = pool.includes(parsed.title) ? parsed.title : pool[0];
          } else if (!parsed.title) {
            parsed.title = GENERIC_TAEMONG_TITLES[0];
          }
          if (taemongCat && TAEMONG_NAME_POOL[taemongCat]) {
            parsed.womb_names = TAEMONG_NAME_POOL[taemongCat];
          } else if (!Array.isArray(parsed.womb_names) || parsed.womb_names.length === 0) {
            parsed.womb_names = GENERIC_TAEMONG_NAMES;
          }
          if (taemongCat && TAEMONG_SCENARIOS[taemongCat]) {
            parsed.similar_dreams = TAEMONG_SCENARIOS[taemongCat];
          }
        } else {
          if (dreamCat && DREAM_SCENARIOS[dreamCat]) {
            parsed.similar_dreams = DREAM_SCENARIOS[dreamCat];
          }
        }
        if (Array.isArray(parsed.elements)) {
          parsed.elements = parsed.elements.slice(0, 4).map((el: any) => {
            const r = resolveElement(el?.name || "");
            // 사전 매칭 시 emoji·meaning 둘 다 고정값 사용, 매칭 안 되면 AI meaning 유지
            return { name: el?.name || "", emoji: r.emoji, meaning: r.matched ? r.meaning : el?.meaning || r.meaning };
          });
        }

        // v738: similar_dreams 누락 시 자동 fallback / v752: 3개로 (좋은몽/경고몽/변화몽 균형)
        if (!Array.isArray(parsed?.similar_dreams) || parsed.similar_dreams.length < 3) {
          const isT = mode === "taemong";
          parsed.similar_dreams = isT
            ? [
                {
                  case: "만약 태몽 속 존재가 새끼·여럿을 데리고 있었다면?",
                  interpret: "🔄 성별·기질 변주! 같은 태몽도 존재가 새끼를 데리거나 여럿이면 성별 힌트나 형제운으로 해석이 달라져요.",
                },
                {
                  case: "만약 그 존재가 더 빛났다면?",
                  interpret: "🌟 대길몽! 금빛·광채 디테일이 더해지면 아이의 길운이 한층 강해져요. 부귀·재능이 평생 따라다닐 신호.",
                },
                {
                  case: "만약 그 존재가 멀리 지나가기만 했다면?",
                  interpret: "🌤️ 또렷한 태몽이 아닐 수도! 품에 안기거나 또렷이 다가오는 디테일이 있어야 분명한 태몽이에요. 그래도 좋은 기운이랍니다.",
                },
              ]
            : [
                {
                  case: "만약 꿈의 결과가 더 좋게 끝났다면?",
                  interpret: "🌟 대박몽! 같은 상황도 결과가 좋게 끝나면 길몽이 대박몽으로 격상돼요. 다가올 기회를 놓치지 마세요.",
                },
                {
                  case: "만약 꿈 속 결과가 정반대였다면?",
                  interpret: "⚠️ 경고몽! 같은 상황도 결과(이겼다/졌다, 얻었다/잃었다)만 달라지면 길몽 ↔ 흉몽으로 뒤집혀요. 결과의 방향성이 핵심.",
                },
                {
                  case: "만약 꿈 속 주체가 다른 사람이었다면?",
                  interpret: "🔄 변화몽! 같은 사건도 '내가 한 것' vs '누가 나에게 한 것'에 따라 의미가 정반대로 갈 수 있어요. 주체 위치 확인.",
                },
              ];
        }
        return NextResponse.json({ ok: true, mode, result: parsed, model, matchedCategory: taemongCat || dreamCat || null });
      } catch (e: unknown) {
        lastError = e instanceof Error ? e.message : "network";
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
      }
    }
  }

  // 모든 모델 + retry 실패 시
  return NextResponse.json({ error: `AI 분석 일시 불가`, lastStatus, detail: lastError }, { status: 503 });
}
