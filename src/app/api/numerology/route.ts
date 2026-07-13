import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// 소울 넘버 계산 (생년월일 각 자리 합 → 한자리 or 마스터넘버 11/22/33)
function calcSoulNumber(year: number, month: number, day: number): number {
  const sum = (n: number): number => String(n).split("").reduce((a, c) => a + parseInt(c), 0);
  let total = sum(year) + sum(month) + sum(day);
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = sum(total);
  }
  return total;
}

// v(2026-07-09): 행운 숫자 — 서양 수비학 표준 공식(소울넘버 + 9씩 증가, 예: 8→8,17,26,35).
// AI가 이 패턴을 학습해 우연히 재현했을 뿐 코드 고정이 아니었음 → 순수 계산으로 서버에서 확정(계층2: 점수/등급).
function calcLuckyNumbers(soulNumber: number): number[] {
  return [0, 1, 2, 3].map((i) => soulNumber + i * 9);
}

// v(2026-07-09): 계층3(실용정보) 고정 테이블 — AI 자유생성이라 매번 흔들리던 필드들 확정.
// 방향은 후천팔괘(주방향=테마와 맞는 괘, 보조방향=정반대 괘 — 의도적 균형) 근거.
// 탄생목은 SOUL_STONES/PLANETS와 동일한 "정체성(계층1)" 성격 — 이름만 고정, 의미 서술은 AI가 이 이름 기반으로 작성.
// 동기화 "시간"은 정통 수비학에 실존하는 개념이 아니라 이 앱의 창작 리추얼 요소라 정밀 시각 대신
// 시간대·분위기 표현으로 설계(2026-07-10 사용자 결정) — "근거 없는 정밀함"을 피하고 창작 콘텐츠임을 그대로 인정.
const LUCKY_DIRECTIONS: Record<number, string> = {
  1: "남쪽(리·광명) · 북쪽(감·지혜)",
  2: "서남쪽(곤·포용) · 동북쪽(간·고요)",
  3: "서쪽(태·표현) · 동쪽(진·시작)",
  4: "동북쪽(간·기반) · 서남쪽(곤·수용)",
  5: "동남쪽(손·소통) · 서북쪽(건·확장)",
  6: "북쪽(감·치유) · 남쪽(리·온기)",
  7: "동북쪽(간·고독) · 서남쪽(곤·포용)",
  8: "서북쪽(건·리더십) · 동남쪽(손·번영)",
  9: "서남쪽(곤·포용) · 동북쪽(간·견고)",
  11: "남쪽(리·깨달음) · 북쪽(감·직관)",
  22: "동북쪽(간·구축) · 서남쪽(곤·확장)",
  33: "동남쪽(손·나눔) · 서북쪽(건·헌신)",
};

const LUCKY_TIME_MOODS: Record<number, string> = {
  1: "이른 아침, 태양이 떠오르는 순간",
  2: "달빛이 스며드는 고요한 밤",
  3: "영감이 샘솟는 오후의 햇살 아래",
  4: "만물이 깨어나는 새벽의 정적",
  5: "바람이 선선한 이른 저녁",
  6: "노을이 물드는 다정한 저녁",
  7: "모두가 잠든 깊은 밤",
  8: "하루를 지배하는 정오의 태양",
  9: "모든 걸 감싸는 황혼 무렵",
  11: "잠에서 막 깨어난 몽롱한 새벽",
  22: "하루를 설계하는 아침의 첫 순간",
  33: "혼자만의 고요한 명상 시간",
};

const SOUL_TREES: Record<number, string> = {
  1: "소나무", 2: "버드나무", 3: "벚나무", 4: "은행나무", 5: "자작나무",
  6: "매화나무", 7: "전나무", 8: "느티나무", 9: "참나무",
  11: "배롱나무", 22: "대나무", 33: "목련나무",
};

const SOUL_NAMES: Record<number, string> = {
  1: "세상을 개척하는 불꽃같은 도사",
  2: "조화를 엮어내는 달빛의 현자",
  3: "창조의 빛을 뿜는 예술가",
  4: "대지를 다지는 건축의 장인",
  5: "자유를 노래하는 바람의 여행자",
  6: "사랑을 퍼뜨리는 치유의 수호자",
  7: "우주의 비밀을 푸는 고독한 현자",
  8: "부와 권력을 다스리는 제왕",
  9: "인류를 품는 위대한 성자",
  11: "직관으로 세상을 깨우는 영매",
  22: "꿈을 현실로 빚는 마스터 빌더",
  33: "무한한 사랑을 나누는 영적 스승",
};

const SOUL_STONES: Record<number, string> = {
  1: "루비", 2: "문스톤", 3: "옐로우 사파이어", 4: "에메랄드", 5: "아쿠아마린",
  6: "로즈쿼츠", 7: "아메시스트", 8: "블루 사파이어", 9: "오팔",
  11: "셀레나이트", 22: "라피스라줄리", 33: "다이아몬드",
};

const SOUL_PLANETS: Record<number, string> = {
  1: "태양", 2: "달", 3: "목성", 4: "천왕성", 5: "수성", 6: "금성", 7: "해왕성", 8: "토성", 9: "화성",
  11: "달+태양", 22: "천왕성+토성", 33: "목성+금성",
};

const SYSTEM_PROMPT = `[ROLE]
너는 세계적 수비학 대가 '천기'. 소울 넘버를 바탕으로 영혼의 본질, 과거·현재·미래, 재물/애정/건강/사명을 통찰하는 AI.
사용자 이름 {nm}을 모든 섹션에 호칭으로 자연스럽게 사용. "~님" 붙임.

[말투 규칙]
- 신비롭고 웅장. 우주/영혼/주파수/파동 어휘 사용
- 팩폭 아닌 영감 주는 통찰. 희망적 결말
- 각 섹션 3~4문장 (약 80~120자)
- 중요 키워드는 "이 부분은 <b>키워드</b>" 식으로 강조표기 (HTML 아님, 그대로 문자열)

[OUTPUT - JSON만]
{
  "quote": "[가이드 — 절대 출력 금지. 본문 텍스트만 출력] {nm}님 이름을 자연스럽게 2~3번 부르며, (1) 현재 흔들리는 상황·잠재된 무게 간파 → (2) '하지만 당신의 영혼은' 식 반전 → (3) 소울넘버 N의 핵심 운명·우주가 부여한 사명·강점 묘사 → (4) 곧 맞이할 각성·전환의 약속으로 마무리. 시적·신비로운 톤. 6~8줄 (300~400자). 단락 사이 \\n\\n으로 줄바꿈 2번 (가독성). [중요: '🌌 영혼의 첫 인사 —' 같은 라벨 텍스트는 절대 본문에 포함하지 말 것. 순수 풀이 본문만 출력]",
  "trait": "영혼의 결 (4~5줄. 소울넘버의 태생적 특징, {nm}님이 왜 이 기질을 가졌는지 우주적 설명)",
  "personality": "심층 성격 분석 (4~5줄. 성격의 핵심, 타인에게 어떻게 보이는지)",
  "desire": "무의식 속 깊은 갈망 (4~5줄. 표면 아래 숨은 욕구, 완벽주의나 불안 해설)",
  "light": "빛의 에너지 Awakening (3~4줄. {nm}님의 영혼이 우주에서 맡은 긍정 역할)",
  "shadow": "그림자 에너지 Karma (3~4줄. 조심해야 할 어둠, 성장 과제)",
  "mission": "우주가 부여한 사명 Mission (3~4줄. {nm}님의 인생 궁극 사명)",
  "pastlife": "전생의 카르마 (3~4줄. 전생 직업/경험이 현생에 남긴 본능)",
  "youth": "인생 주기: 20~35세 젊음 (3~4줄. 이 시기의 과제와 의미)",
  "prime": "인생 주기: 35~55세 정점 (3~4줄. 최고의 발화와 성취)",
  "elder": "인생 주기: 55세 이후 석양 (3~4줄. 지혜로운 유산의 시기)",
  "wealth_flow": "영혼의 재물선과 금전운 (3~4줄. {nm}님에게 돈이 오는 경로)",
  "wealth_guide": "재물 증식의 비밀 가이드 (3~4줄. 구체적 실천 방법)",
  "attract_number": 3,
  "attract_label": "끌리는 영혼 한 줄 설명 (예: '창조적 인연')",
  "repel_number": 8,
  "repel_label": "상극의 파동 한 줄 설명 (예: '경쟁 관계 경계')",
  "soulmate_freq": "소울메이트를 끌어당기는 주파수 (3~4줄. 어떤 파트너가 와야 하는지, 끌어당기는 태도)",
  "tarot": "영혼의 타로 & 천재성 (3~4줄. 수호 타로 카드 + {nm}님 숨은 천재성)",
  "tree": "[가이드] 탄생목은 반드시 아래 '지정된 탄생목' 이름으로 시작해서 3~4줄로 의미를 서술할 것. 다른 나무 이름 절대 사용 금지.",
  "health": "건강과 활력 에너지 (3~4줄. 오행 관점 + 주의 장기)",
  "food": "영혼의 열기를 식히는 음식 (3~4줄. 추천/주의 음식)",
  "space": "행운의 공간 가이드 (3~4줄. 방위·실내 배치 팁)",
  "q1_current": "2026 상반기 결산 및 4월 주파수 (3~4줄. 현재 주파수 % 언급)",
  "months_h1": [
    {"m":"5월","rate":85,"label":"안개 속의 빛","guide":"한 줄 조언"},
    {"m":"6월","rate":40,"label":"잠시 멈춤","guide":"한 줄 조언"},
    {"m":"7월","rate":95,"label":"폭발적 확장","guide":"한 줄 조언"},
    {"m":"8월","rate":70,"label":"치유와 충전","guide":"한 줄 조언"}
  ],
  "months_h2": [
    {"m":"9월","rate":55,"label":"성장통","guide":"한 줄 조언"},
    {"m":"10월","rate":100,"label":"기적의 달","guide":"한 줄 조언"},
    {"m":"11월","rate":65,"label":"나눔의 미학","guide":"한 줄 조언"},
    {"m":"12월","rate":80,"label":"매듭과 시작","guide":"한 줄 조언"}
  ],
  "routine": "주파수 깨우는 루틴 (3~4줄. 아침 의식·소지품·운동)",
  "lucky_numbers": "행운 숫자 4개 배열 (예: [1,10,19,28])",
  "lucky_color_hex": "절대 행운 컬러 (#HEX 코드 + 한글명. 예: '#FF0000 (딥 루비 레드)')",
  "lucky_direction": "[가이드 — 이 필드는 서버가 고정값으로 덮어씀. 아무거나 출력해도 됨]",
  "lucky_time": "[가이드 — 이 필드는 서버가 고정값으로 덮어씀. 아무거나 출력해도 됨]",
  "closing": "[가이드 — 절대 출력 금지. 본문 텍스트만 출력] {nm}님께 전하는 따뜻한 마무리 한마디. 1~2줄 (50~80자). 이름 한 번 부르며 소울넘버 N의 핵심을 한 줄로 짚고, 격려·응원으로 마무리. [중요: '🔮 천기의 한마디 —' 같은 라벨 텍스트는 절대 본문에 포함하지 말 것. 순수 메시지 본문만]"
}`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personName = "익명", year, month, day, soulNumber: overrideNumber, focus } = body;

    if (!year || !month || !day) {
      return NextResponse.json({ error: "생년월일이 필요합니다." }, { status: 400 });
    }

    const soulNumber = overrideNumber || calcSoulNumber(parseInt(year), parseInt(month), parseInt(day));
    const soulName = SOUL_NAMES[soulNumber] || "우주의 신비";
    const soulStone = SOUL_STONES[soulNumber] || "크리스탈";
    const soulPlanet = SOUL_PLANETS[soulNumber] || "태양";
    const soulTree = SOUL_TREES[soulNumber] || "느티나무";

    const focusLine = focus && focus !== "skip" ? ` 사용자가 특히 "${focus}"에 가장 관심이 있어요. 해당 영역(wealth_flow/wealth_guide, soulmate_freq, mission 등 관련 필드)을 더 풍부하고 구체적으로 작성하고, 결과 전반에서도 이 관심사를 의식적으로 강조해줘.` : "";
    const userText = `이름: ${personName}님. 생년월일: ${year}년 ${month}월 ${day}일. 소울넘버: ${soulNumber}번 (${soulName}). 행운석: ${soulStone}, 수호성: ${soulPlanet}. 지정된 탄생목: "${soulTree}" (tree 필드는 반드시 이 이름으로 시작할 것, 다른 나무 절대 금지).${focusLine} 위 정보를 바탕으로 {nm}="${personName}"으로 치환하여 모든 섹션 생성. 수비학 전통에 입각해 ${soulNumber}번의 본질을 깊이 있게 풀어줘.`;

    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: userText }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });

    const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
    let geminiRes: Response | null = null;
    outer: for (const model of MODELS) {
      const url = getGeminiUrl(model);
      for (let attempt = 0; attempt < 3; attempt++) {
        geminiRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: reqBody });
        if (geminiRes.ok) break outer;
        const errCheck = await geminiRes.clone().json().catch(() => null);
        const errMsg = errCheck?.error?.message || "";
        const isHighDemand = errMsg.includes("high demand") || errMsg.includes("overloaded") || geminiRes.status === 503;
        const isRateLimit = geminiRes.status === 429;
        if (isHighDemand || isRateLimit) {
          await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
          continue;
        }
        break;
      }
    }

    const geminiData = await geminiRes!.json();
    if (geminiData.error) {
      return NextResponse.json({ error: "AI 분석 중 오류: " + (geminiData.error.message || "").substring(0, 100) }, { status: 500 });
    }

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const p of parts) { if (p.text) rawText = p.text; }
    if (!rawText) return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });

    parsed.soul_number = soulNumber;
    parsed.soul_name = soulName;
    parsed.soul_stone = soulStone;
    parsed.soul_planet = soulPlanet;
    // v(2026-07-09): 계층2(점수) — AI 자유생성 대신 소울넘버 기반 결정론적 계산으로 강제 확정
    parsed.lucky_numbers = calcLuckyNumbers(soulNumber);
    // v(2026-07-10): 계층3(실용정보) — 후천팔괘 기반 고정 방향 + 시간대·분위기 표현으로 강제 확정
    parsed.lucky_direction = LUCKY_DIRECTIONS[soulNumber] || parsed.lucky_direction;
    parsed.lucky_time = LUCKY_TIME_MOODS[soulNumber] || parsed.lucky_time;
    // tree(탄생목) 안전망 — 프롬프트로 지정된 이름을 안 지켰을 경우 강제로 이름 교체
    if (typeof parsed.tree === "string" && !parsed.tree.startsWith(soulTree)) {
      const rest = parsed.tree.replace(/^\S+\s*/, "");
      parsed.tree = `${soulTree} — ${rest}`;
    }

    // v770: Gemini 한국어 오타 교정 (확실한 것만 — 재귀로 전 텍스트 필드 적용)
    const _TYPO: Record<string, string> = { "베풘": "베푼" };
    const _fixTypos = (v: any): any => {
      if (typeof v === "string") { let s = v; for (const a in _TYPO) s = s.split(a).join(_TYPO[a]); return s; }
      if (Array.isArray(v)) return v.map(_fixTypos);
      if (v && typeof v === "object") { for (const k in v) v[k] = _fixTypos(v[k]); return v; }
      return v;
    };
    _fixTypos(parsed);

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "수비학 분석 중 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
