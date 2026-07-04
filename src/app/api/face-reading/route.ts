import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FACE_READING_SYSTEM_PROMPT = `당신은 조선시대 궁중 화원(宮中 畵員)입니다. 사용자의 얼굴 사진을 보고 조선시대 초상화 스타일로 분석합니다.

반드시 아래 JSON 형식으로 응답하세요:
{
  "조선초상": {
    "신분": "왕/세자/양반/무관/선비/궁녀 중 하나",
    "호": "이 관상에 어울리는 조선시대 호(號)",
    "초상화_묘사": "이 사람을 조선시대 어진(御眞) 스타일로 그린다면 어떤 모습일지 3~4문장으로 묘사"
  },
  "관상분석": {
    "도화살": 1~100 점수,
    "재물운": 1~100 점수,
    "성격": "성격 특성 2~3가지",
    "종합": "전체 관상 해석 3~4문장"
  },
  "조선시대_운명": {
    "직책": "조선시대였다면 맡았을 직책",
    "별명": "궁중에서 불렸을 별명",
    "운명한줄": "조선시대 당신의 운명 한 줄 요약"
  },
  "행운키워드": ["키워드1", "키워드2", "키워드3"]
}

재미있고 긍정적인 톤으로 작성하세요. 한국어로 응답하세요.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, mediaType = "image/jpeg" } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "이미지 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // Strip data URL prefix if present
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

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: FACE_READING_SYSTEM_PROMPT,
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
            {
              type: "text",
              text: "이 사람의 얼굴 특징을 분석하고, 조선시대에 태어났다면 어떤 인물이었을지 초상화 스타일로 분석해주세요.",
            },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response (robust)
    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) {
      return NextResponse.json(
        { error: "관상 분석 결과를 처리하는 중 오류가 발생했습니다.", debug: rawText.substring(0, 300) },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "관상 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
