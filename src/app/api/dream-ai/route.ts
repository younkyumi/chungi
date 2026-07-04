import { NextRequest, NextResponse } from "next/server";

// AI 꿈/태몽 해석 — Gemini 풀 문장 종합 해석 (단일 키워드 lookup 한계 극복)
// POST /api/dream-ai  body: { dream: string, mode: "dream"|"taemong" }

export const maxDuration = 30;

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
    { "emoji": "꿈 요소 이모지 1개", "name": "꿈 속 요소명 (예: 뱀, 물, 꽃)", "meaning": "이 요소의 의미 한 줄 (40자 이내)" }
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

elements는 2~4개. 사용자가 적은 꿈에 실제로 등장한 요소만 추출하세요.

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
    { "emoji": "태몽 요소 이모지 1개", "name": "태몽 속 요소명 (예: 호랑이, 용, 과일, 물)", "meaning": "이 요소가 아이에게 주는 의미 한 줄 (40자 이내)" }
  ],
  "similar_dreams": [
    { "case": "키워드 하나로 성별이 바뀌는 경우 (예: '만약 호랑이가 새끼를 데리고 있었다면?'). 사용자 태몽 요소만 사용해 디테일 한 가지만 바꾸기. 30자 이내.", "interpret": "그 경우 성별·기질이 어떻게 달라지는지. 긍정적·따뜻한 톤. 100자 이내." },
    { "case": "키워드 하나로 더 길해지는 경우 (예: '만약 호랑이가 황금빛이었다면?'). 30자 이내.", "interpret": "더 길한 태몽 해석 — 대길몽/대박몽 등 좋은 타입 명시. 100자 이내." },
    { "case": "키워드 하나로 또렷한 태몽이 아닐 수도 있는 경우 (예: '만약 호랑이가 멀리 지나가기만 했다면?'). 30자 이내.", "interpret": "그 경우 일반 길몽일 수 있다는 중립적·따뜻한 안내. 100자 이내." }
  ]
}

elements는 2~4개. 사용자가 적은 태몽에 실제로 등장한 요소만 추출하세요.
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
        // v738: similar_dreams 누락 시 자동 fallback / v752: 3개로 (좋은몽/경고몽/변화몽 균형)
        if (!Array.isArray(parsed?.similar_dreams) || parsed.similar_dreams.length < 3) {
          parsed = parsed || {};
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
        return NextResponse.json({ ok: true, mode, result: parsed, model });
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
