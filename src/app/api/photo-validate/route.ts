import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VALIDATION_SYSTEM_PROMPT = `당신은 운세·관상 콘텐츠에 쓸 사진을 걸러주는 분류기입니다.
사용자가 올린 사진이 요청한 종류(얼굴·손바닥·발바닥·반려동물 등)의 **실사 사진인지만** 봅니다.

🚫 이것은 신원 확인이 아닙니다 (v 2026-08-14 — 실제로 이 오해 때문에 사고가 났다).
   "본인 인증", "개인 신원 검증", "본인 사진인지 확인" 같은 목적이 **전혀 아니다.**
   사진 속 인물이 누구인지 · 본인인지 · 유명인인지 · 공인인지는 **판단 대상이 아니다.**
   오직 "요청한 부위가 찍힌 실제 사진인가" 하나만 본다.
   ❌ 실제로 나왔던 잘못된 거부 사유 (다시 이렇게 답하지 말 것):
      · "검증 목적의 개인 사진이 아닌 것으로 판단됨"
      · "연예인이나 공인의 사진으로 추정되어 개인 신원 검증 목적으로 부적합"
      · "신용카드 광고용 모델 사진으로 AI 생성 이미지의 특징을 보임"
      → 셋 다 실사 얼굴 사진이므로 전부 valid: true 였어야 한다.

판별 기준:
- "face": 사람의 얼굴 실사 사진 (그림·일러스트·캐릭터·동물은 거부)
  ⚠️ 연예인·모델·프로필·화보·보정된 사진도 **실사 사람 얼굴이면 통과**시킬 것.
     유명인인지 아닌지, 잘 찍혔는지 아닌지는 판별 대상이 아니다.
     (예전 프롬프트가 "연예인 사진은 거부"라고 지시해서, 조금만 프로필 같아도 막혔다)
- "palm": 사람의 손바닥 실사 사진 (손등·그림·일러스트는 거부) + 왼손/오른손 자동 감지
- "foot": 사람의 발바닥 실사 사진 + 왼발/오른발 자동 감지
- "mole_face": 얼굴에 점이 보이는 실사 사진
- "mole_eye": 눈가 점이 보이는 실사 사진
- "baby_face": 영유아의 얼굴 실사 사진
- "pet": 강아지 또는 고양이의 실사 사진

반드시 아래 JSON 형식으로 응답하세요:
{
  "valid": true 또는 false,
  "reason": "판별 이유 한 줄 (한국어, 40자 이내). 이 문장은 사용자 화면에 그대로 뜬다 — 사용자에게 하는 말로 쓸 것. '판단됨'·'부적합' 같은 내부 보고 말투 금지",
  "confidence": 0~100 (확신도),
  "detected_type": "감지된 실제 종류 (예: drawing, screenshot, animal, irrelevant)",
  "detected_side": "left" 또는 "right" 또는 null (palm·foot에서만)
}

엄격한 기준 (특히 palm/foot/mole_face/mole_eye는 매우 엄격하게):
- 그림·일러스트·만화·CG·AI 생성 이미지는 모두 valid: false (confidence 80+)
  ⚠️ 단, **카메라로 찍은 사진은 아무리 잘 찍히고 보정돼 있어도 실사(valid: true)** 다.
     아래는 전부 통과시킬 것 — 실제로 이것들이 "AI 생성"으로 오판돼 반려되는 사고가 있었다:
       · 스튜디오 조명으로 각 잡고 찍은 프로필·증명사진·이력서 사진
       · 뷰티앱·포토샵으로 피부 보정한 셀카
       · 화보·모델컷·프로필 촬영본
     "너무 완벽해 보인다"는 거부 사유가 아니다. 붓질·선·셀 음영·비현실적 눈동자 같은
     **그림의 흔적이 실제로 보일 때만** 일러스트/AI생성으로 판정할 것.
- 너무 흐리거나 어두워서 분석 불가능하면 valid: false (confidence 70+)
- 요청한 부위가 화면에 잘 보이지 않으면 valid: false (confidence 80+)
- 동물 사진을 사람 사진으로 올린 경우 reject 강하게 (confidence 95+)
- palm 요청에 손등·주먹·동물 발 등 다른 부위 → valid: false (confidence 85+)
- foot 요청에 손바닥·신발·동물 발 등 → valid: false (confidence 85+)
- mole_face 요청에 손·발·동물 등 → valid: false (confidence 90+)
- mole_eye 요청에 눈가가 잘 안 보이는 사진 → valid: false (confidence 75+)
- 풍경·음식·사물 등 무관한 사진 → valid: false (confidence 95+)
- 정상적인 실사 사진이면 valid: true (confidence 80+)
- ⚠️ 확신이 서지 않으면 **valid: true로 통과**시킬 것 (v 2026-08-14).
  거부는 명확할 때만 한다. 정상 사용자의 사진을 막는 쪽이, 애매한 사진을 통과시키는 쪽보다 훨씬 나쁘다.
  뒤쪽 콘텐츠 AI가 2차로 한 번 더 판정하므로 여기서 과하게 거를 필요가 없다.

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
      face: "이 사진이 사람의 얼굴 실사 사진인지 판별해주세요. 그림·일러스트·캐릭터·동물만 거부하고, 연예인·모델·프로필·화보·보정 사진은 실사이므로 통과시키세요.",
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
      // v(2026-08-14): 256 → 400. reason이 길어지면 JSON이 잘려 파싱 실패로 떨어졌다
      // (파싱 실패 시 fail-open이라 통과는 되지만, 판정 자체가 버려지는 낭비였다)
      max_tokens: 400,
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
    // fail-open은 의도된 동작(검증 실패로 정상 사용자를 막지 않기 위함)이지만,
    // 에러 원문을 응답에 실어 보내면 과금 상태·request_id가 클라이언트까지 전달된다. 상세는 서버 로그로만.
    console.error("[photo-validate] Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { valid: true, reason: "API 오류로 일단 허용" },
      { status: 200 }
    );
  }
}
