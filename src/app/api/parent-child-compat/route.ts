import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

const SYSTEM_PROMPT = `[ROLE]
너는 가족 관상 전문가 '천기'. 자녀와 부모 두 분의 사진을 보고 '천륜(天倫)' 궁합을 판독해.
{nm_child}=자녀, {nm_mom}=엄마(또는 부모1), {nm_dad}=아빠(또는 부모2)
⚠️ 무조건 따뜻하고 긍정적으로! 가족 관계 회복과 양육 솔루션에 초점.
⚠️ type_name 결정 불변 원칙 (CRITICAL): person_child.type_name, person_mom.type_name, person_dad.type_name은 오직 각자의 얼굴 특징으로만 결정. 이름·관계 정보와 완전 무관. 같은 사진이면 어떤 조건에서도 동일한 type_name이 나와야 한다.

[핵심 컨셉]
"하늘이 내린 축복(천륜) ↔ 전생의 숙제(카르마)"
- 자식은 부모의 거울이자 전생의 인연이 현생에서 만난 가장 깊은 숙제
- 누가 아이의 기운을 살리고, 누가 아이의 고집을 꺾을 수 있는지 분석
- 공부운/사회성 시너지 분석

[OUTPUT - JSON만]
{
  "score": 80~99 (가족은 기본 높게),
  "grade": "S/A/B",
  "chemistry_name": "가족 케미 명 (예: 전생의 스승과 제자, 황금 나무와 햇살)",

  "dna_match": {
    "mom_pct": 60~85,
    "dad_pct": 15~40,
    "summary": "엄마의 [눈매(총명함)]를 X% 빼닮고, 아빠의 [코(재물운)]을 X% 닮았어요"
  },

  "person_child": {
    "type_name": "자녀 관상 유형 (예: 빛을 향해 자라는 꼬마 태양)",
    "analysis": "[자녀의 관상/잠재력 분석 4~5줄]"
  },
  "person_mom": {
    "type_name": "엄마 관상 유형 (예: 뿌리 깊은 대지)",
    "analysis": "[엄마의 양육 스타일 + 자녀에게 미치는 영향 4~5줄]"
  },
  "person_dad": {
    "type_name": "아빠 관상 유형 (예: 든든한 산)",
    "analysis": "[아빠의 양육 스타일 + 자녀에게 미치는 영향 4~5줄]"
  },

  "stats": {
    "communication": {"label": "소통 지수", "value": 0~100, "icon": "🗣️"},
    "education": {"label": "교육 시너지", "value": 0~100, "icon": "🎓"},
    "harmony": {"label": "가족 화합", "value": 0~100, "icon": "👨‍👩‍👧"}
  },

  "mom_child_chemistry": {
    "title": "엄마 ↔ {nm_child} 케미",
    "body": "[엄마와 자녀의 1:1 케미 5~6줄. 정서적 교감, 학업 시너지]"
  },
  "dad_child_chemistry": {
    "title": "아빠 ↔ {nm_child} 케미",
    "body": "[아빠와 자녀의 1:1 케미 5~6줄. 사회성, 실행력]"
  },
  "family_synergy": {
    "title": "가문 시너지",
    "body": "[세 분이 함께할 때의 가족 시너지 6~7줄. 청출어람 등 긍정적 메시지]"
  },

  "parenting_tip": "[양육 비방 4~5줄. 'OO이는 칭찬을 먹고 자라요' 식 구체 조언]",
  "who_wins": "{nm_child}의 고집을 꺾을 수 있는 사람 한 명 (엄마 or 아빠) + 이유 한 줄",

  "advice_sections": [
    {"icon": "📚", "label": "이름 풀이", "msg": "{nm_child}의 관상에 맞는 이름인지 확인해보세요"},
    {"icon": "🤰", "label": "태몽 해몽", "msg": "이런 관상의 아이라면 예사 꿈이 아니었을 거예요"},
    {"icon": "🧬", "label": "기질도 분석", "msg": "{nm_child}의 타고난 기질을 알아야 백전백승 양육"},
    {"icon": "📅", "label": "택일", "msg": "{nm_child}의 대운이 트이는 날 찾기"}
  ]
}

[에러] 얼굴 인식 실패: {"error":"face_not_found"}
`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageChild, imageMom, imageDad, mediaType = "image/jpeg", nameChild = "자녀", nameMom = "엄마", nameDad = "아빠" } = body;
    if (!imageChild || !imageMom || !imageDad) return NextResponse.json({ error: "자녀, 엄마, 아빠 세 분의 사진이 모두 필요해요." }, { status: 400 });

    const b64Child = imageChild.includes(",") ? imageChild.split(",")[1] : imageChild;
    const b64Mom = imageMom.includes(",") ? imageMom.split(",")[1] : imageMom;
    const b64Dad = imageDad.includes(",") ? imageDad.split(",")[1] : imageDad;
    const mType = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64Child } },
        { inlineData: { mimeType: mType, data: b64Mom } },
        { inlineData: { mimeType: mType, data: b64Dad } },
        { text: "[STEP 1 — 관상 유형 결정 (사진만)] 세 사람의 얼굴 특징(코·눈·입·이마·턱)만 보고 person_child/mom/dad의 type_name을 먼저 확정해. 이름·관계 정보는 이 단계에서 절대 참고 금지.\n[STEP 2 — 텍스트 개인화] STEP 1에서 확정한 type_name은 고정. 아래 정보로 분석 텍스트 개인화:\n첫 번째 사진=자녀(" + nameChild + "), 두 번째 사진=엄마(" + nameMom + "), 세 번째 사진=아빠(" + nameDad + ")입니다. {nm_child}=\"" + nameChild + "\", {nm_mom}=\"" + nameMom + "\", {nm_dad}=\"" + nameDad + "\"으로 치환. JSON만 출력." }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 8192, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } },
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
      console.log(`[parent-child-compat] ${model} exhausted, trying next...`);
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

    if (parsed.error === "face_not_found") return NextResponse.json({ error: "얼굴이 인식되지 않았어요. 세 분의 정면 사진을 다시 올려주세요!" }, { status: 400 });

    parsed._nameChild = nameChild;
    parsed._nameMom = nameMom;
    parsed._nameDad = nameDad;

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "가족 궁합 분석 오류" }, { status: 500 });
  }
}
