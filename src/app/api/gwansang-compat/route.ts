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
⚠️ type_name 결정 불변 원칙 (CRITICAL): person_a.type_name, person_b.type_name은 오직 각자의 얼굴 특징으로만 결정. 모드(couple/bff/business 등)와 완전 무관. 같은 사진이면 모드가 달라져도 동일한 type_name이 나와야 한다.

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

// ── Call-1 전용 prompt: type_name 확정만 (모드 컨텍스트 없음) ──
const CHAR1_PROMPT = `두 사람의 얼굴 특징(코·눈·입·이마·턱)만 보고 각각의 관상 유형명을 결정해.
얼굴에서 가장 두드러진 특징 1개로 창의적이고 특색 있는 관상 유형명(8~15자) 결정.
⚠️ 이름·관계·모드는 이 단계에서 완전 무시. 사진만 본다.
JSON만: {"type_a": "관상유형명", "type_b": "관상유형명"}`;

async function callGemini(body: string): Promise<Response> {
  const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
  let res: Response | null = null;
  for (const model of MODELS) {
    const url = getGeminiUrl(model);
    for (let i = 0; i < 2; i++) {
      res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      if (res.ok) return res;
      const err = await res.clone().json().catch(() => null);
      const msg = err?.error?.message || "";
      if (msg.includes("high demand") || msg.includes("overloaded") || res.status === 503 || res.status === 429) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      break;
    }
  }
  return res!;
}

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

    // === CALL 1: type_name 확정 (사진만, 모드 없음) ===
    const char1Body = JSON.stringify({
      systemInstruction: { parts: [{ text: CHAR1_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: "두 사람의 관상 유형명 결정. JSON만: {\"type_a\": \"유형명\", \"type_b\": \"유형명\"}" }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 60, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
    });
    let typeA: string | null = null;
    let typeB: string | null = null;
    try {
      const c1 = await callGemini(char1Body);
      if (c1.ok) {
        const c1d = await c1.json();
        const c1t = (c1d?.candidates?.[0]?.content?.parts || []).reduce((s: string, p: {text?: string}) => p.text ? p.text : s, "");
        const c1j = JSON.parse(c1t.replace(/```json\n?|\n?```/g, "").trim());
        if (c1j?.type_a && typeof c1j.type_a === "string") typeA = c1j.type_a;
        if (c1j?.type_b && typeof c1j.type_b === "string") typeB = c1j.type_b;
      }
    } catch {}

    // === CALL 2: 전체 궁합 분석 (type_name 고정, temperature 0.7) ===
    const fixedRule = (typeA && typeB) ? `⚠️ person_a.type_name은 반드시 "${typeA}", person_b.type_name은 반드시 "${typeB}". 절대 변경 불가.\n\n` : "";
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: "첫 번째 사진은 " + name1 + ", 두 번째 사진은 " + name2 + "입니다. 모드: " + mode + " (" + modeLabel + "). {nm1}=\"" + name1 + "\", {nm2}=\"" + name2 + "\"으로 치환. JSON만 출력." }
      ]}],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 512 } },
    });
    const geminiRes = await callGemini(reqBody);

    const geminiData = await geminiRes.json();
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
