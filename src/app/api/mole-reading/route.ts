import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// v(2026-07-14): 2-call 구조로 전환 — 이전엔 단일 호출이라 점의 개수·위치·복점/흉점 판정까지
// 매번 자유생성이었음(같은 사진을 두 번 올리면 점 개수가 달라지거나 복점↔흉점이 뒤바뀌는 버그).
// Call-1(temp 0)이 위치·category만 고정 관측 → Call-2가 그 위 해석 텍스트만 채우는 구조로 분리.
// lucky_count/warning_count/total_count도 AI 자가보고 대신 locked moles 배열에서 코드로 직접 집계.

const MOLE_CALL1_PROMPT = `당신은 점상학(點相學) 전문가입니다. 사진에서 점(mole)의 위치만 정확하게 "관측"합니다.
해석·의미·풀이는 이 단계에서 절대 하지 않습니다 — 오직 있는 그대로의 위치·속성만 보고하세요.
좌표는 0~100 (퍼센트) 기준. 0은 왼쪽/위, 100은 오른쪽/아래.

[category 판별 기준]
- 복점/길점: 칠흑처럼 까맣고 윤기가 있으며 살짝 튀어나온 점 (생점生點)
- 주의점: 탁하고 붉은빛/잿빛이거나 찌그러지고 번진 점 (사점死點)
- 중립: 위 기준에 명확히 해당하지 않는 점

JSON만 응답:
{
  "moles": [
    { "id": 1, "x": 0~100, "y": 0~100, "size": "small/medium/large", "color": "#000",
      "label": "이마 중앙/눈꼬리 옆 등 위치 이름 (한 단어)", "category": "복점/길점/중립/주의점" }
  ]
}
점이 안 보이면 moles: [] 로 응답. 너무 작거나 점인지 불확실한 것은 제외.`;

const MOLE_CALL2_PROMPT = `당신은 동양 점상학(點相學) 전문가입니다. 아래에 이미 확정된 점 관측값(위치·category)이 주어집니다.
⚠️ 점의 개수·위치·category는 절대 변경하지 마세요 — 오직 그 점들에 대한 해석 텍스트만 작성합니다.

⚠️ 중요: 980원 정가 콘텐츠로 사주풀이 수준의 풍성한 분량을 유지하세요. 각 항목 빠짐없이 작성.

반드시 아래 JSON 형식으로 응답하세요:
{
  "moles": [
    {
      "id": 1,
      "meaning": "이 점의 의미 (한 줄)",
      "detail": "위치별 상세 풀이 3~4문장 — 재물·인연·건강·직업 중 어디에 영향",
      "fortune_period": "이 점이 가장 발현되는 나이대/시기",
      "advice": "이 점이 긍정적일 때 살리는 방법 2문장"
    }
  ],
  "zones": {
    "forehead": "이마 영역 종합 풀이 3~4문장 (초년·부모·상사운)",
    "eyes": "눈 주변 종합 풀이 3~4문장 (중년·배우자·연애운)",
    "nose": "코 주변 풀이 3~4문장 (재물·40대 운)",
    "mouth": "입 주변 풀이 3~4문장 (말년·자녀·식복)",
    "chin": "턱 주변 풀이 3~4문장 (노년·부하·복)"
  },
  "overall": {
    "title": "한 줄 요약",
    "summary": "전체 점상 종합 풀이 5~6문장",
    "personality": "점 배치로 본 타고난 성격·기질 4~5문장",
    "career_text": "직업·사업운 풀이 3~4문장",
    "love_text": "연애·결혼운 풀이 3~4문장",
    "money_text": "재물운 풀이 3~4문장",
    "health_text": "건강·체질 풀이 3~4문장",
    "turning_points": ["인생 전환점 1", "전환점 2"]
  },
  "advice": ["구체 조언 1", "조언 2", "조언 3", "조언 4", "조언 5"],
  "lucky_items": {
    "color": "행운의 색",
    "direction": "행운의 방향",
    "stone": "행운의 보석"
  }
}

긍정적이고 따뜻한 톤. 주의점도 부드럽게. 사주풀이 수준의 풍성한 분량 필수. 한국어 응답.`;

export const maxDuration = 60;

type LockedMole = { id: number; x: number; y: number; size: string; color: string; label: string; category: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, type = "face", mediaType = "image/jpeg" } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "이미지 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    const base64Image = imageData.includes(",")
      ? imageData.split(",")[1]
      : imageData;

    const validMediaTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ] as const;
    type MediaType = (typeof validMediaTypes)[number];
    const resolvedMediaType: MediaType = validMediaTypes.includes(
      mediaType as MediaType
    )
      ? (mediaType as MediaType)
      : "image/jpeg";

    const userPrompt =
      type === "eye"
        ? "이 사진의 눈가 점들을 찾아 위치를 관측해주세요."
        : "이 사진의 얼굴 점들을 찾아 위치를 관측해주세요.";

    const { parseGeminiJson } = await import("@/lib/gemini-parse");

    // === CALL 1: 점 위치·category 고정 관측 (temperature 0) ===
    const call1 = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      temperature: 0,
      system: MOLE_CALL1_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: resolvedMediaType, data: base64Image } },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });
    const call1Text = call1.content[0].type === "text" ? call1.content[0].text : "";
    const call1Parsed = parseGeminiJson(call1Text);
    const lockedMoles: LockedMole[] = Array.isArray(call1Parsed?.moles)
      ? call1Parsed.moles
          .filter((m: unknown) => m && typeof m === "object")
          .map((m: Record<string, unknown>, i: number) => ({
            id: typeof m.id === "number" ? m.id : i + 1,
            x: typeof m.x === "number" ? m.x : 50,
            y: typeof m.y === "number" ? m.y : 50,
            size: typeof m.size === "string" ? m.size : "small",
            color: typeof m.color === "string" ? m.color : "#000",
            label: typeof m.label === "string" ? m.label : "",
            category: typeof m.category === "string" ? m.category : "중립",
          }))
      : [];

    // 점이 하나도 관측되지 않으면 Call-2 없이 바로 빈 결과 반환 (비용 절감 + 정확도)
    if (lockedMoles.length === 0) {
      return NextResponse.json({
        result: {
          type,
          moles: [],
          zones: {},
          overall: { title: "또렷한 점이 보이지 않아요", summary: "사진에서 명확하게 판별 가능한 점을 찾지 못했어요. 더 밝고 선명한 사진으로 다시 시도해보세요.", lucky_count: 0, warning_count: 0, total_count: 0, turning_points: [] },
          advice: [],
          lucky_items: {},
        },
      });
    }

    // === CALL 2: 고정된 점 관측값 위에 해석 텍스트만 생성 ===
    const fixedRule = `⚠️ 점 관측값 고정 (절대 개수·위치·category 변경 금지, 아래 점들에 대해서만 해석 텍스트를 채울 것):\n${lockedMoles
      .map((m) => `- id ${m.id}: 위치=${m.label || `x${m.x},y${m.y}`}, category=${m.category}`)
      .join("\n")}\n\n`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: fixedRule + MOLE_CALL2_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: resolvedMediaType, data: base64Image } },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const parsed = parseGeminiJson(rawText);
    if (!parsed) {
      return NextResponse.json(
        {
          error: "분석 결과를 처리하는 중 오류가 발생했습니다.",
          debug: rawText.substring(0, 300),
        },
        { status: 500 }
      );
    }

    // 점 개수·위치·category는 Call-1 고정값으로 강제 override, 해석 텍스트만 Call-2 결과에서 병합
    const call2Moles: Record<number, Record<string, unknown>> = {};
    if (Array.isArray(parsed.moles)) {
      for (const m of parsed.moles) {
        if (m && typeof m === "object" && typeof (m as Record<string, unknown>).id === "number") {
          call2Moles[(m as Record<string, unknown>).id as number] = m as Record<string, unknown>;
        }
      }
    }
    parsed.moles = lockedMoles.map((lm) => {
      const c2 = call2Moles[lm.id] || {};
      return {
        id: lm.id,
        x: lm.x,
        y: lm.y,
        size: lm.size,
        color: lm.color,
        label: lm.label || c2.label || "",
        category: lm.category,
        meaning: typeof c2.meaning === "string" ? c2.meaning : "",
        detail: typeof c2.detail === "string" ? c2.detail : "",
        fortune_period: typeof c2.fortune_period === "string" ? c2.fortune_period : "",
        advice: typeof c2.advice === "string" ? c2.advice : "",
      };
    });

    // lucky_count/warning_count/total_count — AI 자가보고 대신 locked moles에서 코드로 직접 집계 (개수 불일치 fix)
    if (!parsed.overall || typeof parsed.overall !== "object") parsed.overall = {};
    (parsed.overall as Record<string, unknown>).total_count = lockedMoles.length;
    (parsed.overall as Record<string, unknown>).lucky_count = lockedMoles.filter(
      (m) => m.category === "복점" || m.category === "길점"
    ).length;
    (parsed.overall as Record<string, unknown>).warning_count = lockedMoles.filter(
      (m) => m.category === "주의점"
    ).length;

    parsed.type = type;

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "점 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
