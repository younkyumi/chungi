import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VALIDATION_SYSTEM_PROMPT = `당신은 사진 검증 전문가입니다. 사용자가 업로드한 사진이 요청한 종류의 실제 사진인지 판별합니다.

판별 기준:
- "face": 사람의 얼굴 실사 사진 (그림·일러스트·캐릭터·동물·연예인 사진은 거부)
- "palm": 사람의 손바닥 실사 사진 (손등·그림·일러스트는 거부) + 왼손/오른손 자동 감지
- "foot": 사람의 발바닥 실사 사진 + 왼발/오른발 자동 감지
- "mole_face": 얼굴에 점이 보이는 실사 사진
- "mole_eye": 눈가 점이 보이는 실사 사진
- "baby_face": 영유아의 얼굴 실사 사진
- "pet": 강아지 또는 고양이의 실사 사진

반드시 아래 JSON 형식으로 응답하세요:
{
  "valid": true 또는 false,
  "reason": "판별 이유 한 줄 (한국어)",
  "confidence": 0~100 (확신도),
  "detected_type": "감지된 실제 종류 (예: drawing, screenshot, animal, irrelevant)",
  "detected_side": "left" 또는 "right" 또는 null (palm·foot에서만)
}

엄격한 기준 (특히 palm/foot/mole_face/mole_eye는 매우 엄격하게):
- 그림·일러스트·만화·CG·AI 생성 이미지는 모두 valid: false (confidence 80+)
- 너무 흐리거나 어두워서 분석 불가능하면 valid: false (confidence 70+)
- 요청한 부위가 화면에 잘 보이지 않으면 valid: false (confidence 80+)
- 동물 사진을 사람 사진으로 올린 경우 reject 강하게 (confidence 95+)
- palm 요청에 손등·주먹·동물 발 등 다른 부위 → valid: false (confidence 85+)
- foot 요청에 손바닥·신발·동물 발 등 → valid: false (confidence 85+)
- mole_face 요청에 손·발·동물 등 → valid: false (confidence 90+)
- mole_eye 요청에 눈가가 잘 안 보이는 사진 → valid: false (confidence 75+)
- 풍경·음식·사물 등 무관한 사진 → valid: false (confidence 95+)
- 정상적인 실사 사진이면 valid: true (confidence 80+)

좌우 판별 (palm·foot 전용):
- palm: 엄지손가락이 오른쪽에 있으면 "left" (왼손바닥), 왼쪽에 있으면 "right" (오른손바닥)
- foot: 엄지발가락이 오른쪽에 있으면 "left" (왼발), 왼쪽에 있으면 "right" (오른발)
- 좌우 판별 어려우면 detected_side는 null`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, type, mediaType = "image/jpeg" } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "이미지 데이터가 필요합니다." },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { error: "검증할 사진 종류(type)가 필요합니다." },
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

    const { expectedSide } = body; // "left" 또는 "right" — palm/foot에서만
    const TYPE_PROMPTS: Record<string, string> = {
      face: "이 사진이 사람의 얼굴 실사 사진인지 판별해주세요. 그림·일러스트·캐릭터는 거부.",
      palm: `이 사진이 사람의 손바닥 실사 사진인지 판별해주세요. 손등·그림·동물 발은 거부. ${expectedSide?`사용자는 "${expectedSide==="left"?"왼손":"오른손"}"을 올렸다고 주장합니다 — detected_side로 실제 어느 손인지 답하세요.`:"왼손/오른손도 detected_side로 답하세요."}`,
      foot: `이 사진이 사람의 발바닥 실사 사진인지 판별해주세요. ${expectedSide?`사용자는 "${expectedSide==="left"?"왼발":"오른발"}"을 올렸다고 주장합니다 — detected_side로 실제 어느 발인지 답하세요.`:"왼발/오른발도 detected_side로 답하세요."}`,
      mole_face: "이 사진이 얼굴 점이 보이는 실사 사진인지 판별해주세요.",
      mole_eye: "이 사진이 눈가 점이 보이는 실사 사진인지 판별해주세요.",
      baby_face: "이 사진이 영유아 얼굴 실사 사진인지 판별해주세요. 성인은 거부.",
      pet: "이 사진이 강아지 또는 고양이 실사 사진인지 판별해주세요.",
    };
    const userPrompt = TYPE_PROMPTS[type] || `이 사진이 ${type} 실사 사진인지 판별해주세요.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: VALIDATION_SYSTEM_PROMPT,
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
      return NextResponse.json({
        valid: true,
        reason: "검증 결과 파싱 실패 — 일단 허용",
        confidence: 50,
        detected_type: "unknown",
      });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "사진 검증 중 오류가 발생했습니다.";
    return NextResponse.json(
      { valid: true, reason: "API 오류로 일단 허용", error: errorMessage },
      { status: 200 }
    );
  }
}
