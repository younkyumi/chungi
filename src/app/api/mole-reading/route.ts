import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MOLE_SYSTEM_PROMPT = `당신은 동양 점상학(點相學) 전문가입니다. 사용자의 얼굴 사진을 보고 점의 위치와 의미를 분석합니다.

⚠️ 중요: 980원 정가 콘텐츠로 사주풀이 수준의 풍성한 분량을 유지하세요. 각 항목 빠짐없이 작성.

좌표는 0~100 (퍼센트) 기준으로 표기합니다. 0은 왼쪽/위, 100은 오른쪽/아래.

반드시 아래 JSON 형식으로 응답하세요:
{
  "type": "face/eye",
  "moles": [
    {
      "id": 1,
      "x": 0~100,
      "y": 0~100,
      "size": "small/medium/large",
      "color": "#000",
      "label": "이마 중앙/눈 옆 등 위치 이름",
      "category": "복점/길점/중립/주의점",
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
    "lucky_count": 좋은 점 개수,
    "warning_count": 주의 점 개수,
    "total_count": 분석된 점 총 개수,
    "turning_points": ["인생 전환점 1", "전환점 2"]
  },
  "advice": ["구체 조언 1", "조언 2", "조언 3", "조언 4", "조언 5"],
  "lucky_items": {
    "color": "행운의 색",
    "direction": "행운의 방향",
    "stone": "행운의 보석"
  }
}

긍정적이고 따뜻한 톤. 주의점도 부드럽게. 사주풀이 수준의 풍성한 분량 필수. 한국어 응답.
점이 많이 안 보이면 보이는 것만 분석. 너무 작거나 점인지 불확실한 것은 제외.`;

export const maxDuration = 60;

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
        ? "이 사진의 눈가 점들을 찾아 위치와 의미를 분석해주세요."
        : "이 사진의 얼굴 점들을 찾아 위치와 의미를 분석해주세요.";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: MOLE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: resolvedMediaType,
                data: base64Image,
              },
            },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
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

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "점 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
