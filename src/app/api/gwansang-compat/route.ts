import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

const SYSTEM_PROMPT = `[ROLE]
너는 관상 궁합 전문가 '천기'. 두 사람의 얼굴을 분석하여 궁합을 판독해.
{nm1}님, {nm2}님 호칭 사용.
⚠️ 모든 분석은 재미용. 한 사람을 비방하지 말고 두 사람의 '관계'에 초점을 맞춰라.

[모드]
- couple: 커플/연인 궁합 (애정 중심)
- bff: 베프/친구 궁합 (우정 중심)
- business: 비즈니스 궁합 (재물/사업 중심)
- fan: 최애·팬심 궁합 (덕질/운명적 연결)
- enemy: 악연·상극 궁합 (전생 인연/상극 분석. 비방 X, 두 사람의 '에너지 차이' 위주)

[OUTPUT - JSON만]
{
  "mode": "couple/bff/business/fan/enemy",
  "score": 50~99 정수,
  "grade": "S/A/B/C",
  "chemistry_name": "궁합 캐릭터명 (예: 전생의 연인, 현생의 껌딱지)",

  "person_a": {
    "type_name": "관상 유형명 (예: 사랑에 올인하는 사슴 눈망울 상)",
    "analysis": "[A의 관상 분석 4~5줄]"
  },
  "person_b": {
    "type_name": "관상 유형명",
    "analysis": "[B의 관상 분석 4~5줄]"
  },

  "stats": {
    "stat1": {"label": "스탯명", "value": 0~100, "icon": "이모지"},
    "stat2": {"label": "스탯명", "value": 0~100, "icon": "이모지"},
    "stat3": {"label": "스탯명", "value": 0~100, "icon": "이모지"}
  },

  "sections": {
    "main": {"title": "핵심 궁합", "body": "[메인 궁합 분석 5~6줄]"},
    "strength": {"title": "최고의 시너지", "body": "[강점 4~5줄]"},
    "risk": {"title": "주의할 점", "body": "[약점/리스크 3~4줄. 팩폭이지만 애정 담아]"},
    "advice": {"title": "천기의 조언", "body": "[따뜻한 조언 3~4줄]"}
  },

  "one_liner": "한 줄 팩폭 (유머러스하게)"
}

[모드별 stats 가이드]
- couple: 애정온도🔥/열정지수💕/신뢰지수🤝
- bff: 싱크로율🎯/장난지수😆/의리지수🛡️
- business: 수익시너지💰/신뢰지수🤝/실행력합⚡
- fan: 팬심농도💜/운명연결🌟/성덕지수👑
- enemy: 에너지충돌⚡/전생인연🔮/극복가능성🌈 (비방 금지, 두 사람 모두 좋게 표현)

[에너 모드 추가 원칙]
- 한 사람을 "나쁜 사람"으로 단정 X
- "두 사람의 에너지가 다른 방향" 식으로 표현
- 관계 개선 가능성/조언 강조
- 결과를 직장 내 갑질/스토킹에 활용 못하도록 톤 조절

[에러] 얼굴 인식 실패: {"error":"face_not_found"}
`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData1, imageData2, mediaType = "image/jpeg", name1 = "A", name2 = "B", mode = "couple" } = body;
    if (!imageData1 || !imageData2) return NextResponse.json({ error: "두 사람의 사진이 필요합니다." }, { status: 400 });

    const b64_1 = imageData1.includes(",") ? imageData1.split(",")[1] : imageData1;
    const b64_2 = imageData2.includes(",") ? imageData2.split(",")[1] : imageData2;
    const mType = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    const modeLabel = mode === "business" ? "비즈니스 사업 궁합" : mode === "bff" ? "베프 우정 궁합" : mode === "fan" ? "최애·팬심 궁합" : mode === "enemy" ? "악연·상극 궁합" : "커플 애정 궁합";
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: "첫 번째 사진은 " + name1 + ", 두 번째 사진은 " + name2 + "입니다. 모드: " + mode + " (" + modeLabel + "). {nm1}=\"" + name1 + "\", {nm2}=\"" + name2 + "\"으로 치환. JSON만 출력." }
      ]}],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 512 } },
    });

    // 다중 모델 폴백 — 한 모델 high demand/quota 시 다음 모델 시도
    const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
    let geminiRes: Response | null = null;
    outer: for (const model of MODELS) {
      const url = getGeminiUrl(model);
      for (let attempt = 0; attempt < 3; attempt++) {
        geminiRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: reqBody });
        if (geminiRes.ok) break outer;
        const errCheck = await geminiRes.clone().json().catch(() => null);
        const msg = errCheck?.error?.message || "";
        const retry = msg.includes("high demand") || msg.includes("overloaded") || geminiRes.status === 503 || geminiRes.status === 429;
        if (retry) {
          await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
          continue;
        }
        break;
      }
      console.log(`[gwansang-compat] ${model} exhausted, trying next...`);
    }

    const geminiData = await geminiRes!.json();
    if (geminiData.error) return NextResponse.json({ error: "AI 분석 중 오류: " + (geminiData.error.message || "").substring(0, 100) }, { status: 500 });

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) { if (part.text) rawText = part.text; }
    if (!rawText) return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });

    if (parsed.error === "face_not_found") return NextResponse.json({ error: "얼굴이 인식되지 않았어요. 두 사람의 정면 사진을 다시 올려주세요!" }, { status: 400 });

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "궁합 분석 오류" }, { status: 500 });
  }
}
