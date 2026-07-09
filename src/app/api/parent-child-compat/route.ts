import { NextRequest, NextResponse } from "next/server";
import { lockedScore, gradeSAB, fillNameTokens, validateCompatResult } from "@/lib/compat-helpers";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// v(2026-07-08): 3인(자녀+엄마+아빠) 전제 → 실제 프론트(자녀+보호자 1명, photoIdx 1/2)에 맞춰 2인 구조로 재설계.
// 궁합 5종(gwansang-compat)과 동일 응답 스키마(score/grade/chemistry_name/person_a·b/stats/sections/one_liner)로 통일 —
// 프론트 결과 렌더링 컴포넌트를 그대로 재사용하기 위함.
const SYSTEM_PROMPT = `[ROLE]
너는 가족 관상 전문가 '천기'. 자녀와 보호자(부모·조부모·삼촌·이모·형제 등, 관계: {rel_label}) 두 분의 사진을 보고 '천륜(天倫)' 궁합을 판독해.
⚠️ 모든 텍스트 필드는 실제 이름을 그대로 써서 작성해라. {nm1}/{nm2} 같은 중괄호 템플릿 변수·placeholder는 절대 출력 금지 — 반드시 실제 이름 문자열 그 자체를 써라.
⚠️ 무조건 따뜻하고 긍정적으로! 가족 관계 회복과 양육 솔루션에 초점. 한 사람을 비방하지 말고 '관계'에 초점.
⚠️ type_name 결정 불변 원칙 (CRITICAL): person_a.type_name(자녀), person_b.type_name(보호자)은 오직 각자의 얼굴 특징으로만 결정. 이름·관계 정보와 완전 무관. 같은 사진이면 어떤 조건에서도 동일한 type_name이 나와야 한다.

[핵심 컨셉]
"하늘이 내린 축복(천륜) ↔ 전생의 숙제(카르마)" — 자식은 부모(보호자)의 거울이자 전생의 인연이 현생에서 만난 깊은 숙제. 닮은 점·양육 시너지·공부운/사회성에 초점.

[OUTPUT - JSON만]
{
  "score": 80~99 정수 (가족은 기본 높게),
  "grade": "S/A/B",
  "chemistry_name": "가족 케미 명 (예: 전생의 스승과 제자, 황금 나무와 햇살)",

  "person_a": {
    "type_name": "자녀 관상 유형 (예: 빛을 향해 자라는 꼬마 태양)",
    "analysis": "[자녀의 관상/잠재력 분석 4~5줄]"
  },
  "person_b": {
    "type_name": "보호자 관상 유형 (예: 뿌리 깊은 대지)",
    "analysis": "[보호자의 양육 스타일 + 자녀에게 미치는 영향 4~5줄]"
  },

  "stats": {
    "stat1": {"label": "소통 지수", "value": 0~100, "icon": "🗣️"},
    "stat2": {"label": "교육 시너지", "value": 0~100, "icon": "🎓"},
    "stat3": {"label": "가족 화합", "value": 0~100, "icon": "👨‍👩‍👧"}
  },

  "sections": {
    "main": {"title": "닮은 점 & 천륜 인연", "body": "[닮은 부위·기운 + 천륜 인연 서사 5~6줄. 예: 엄마의 눈매(총명함)를 닮고 아빠의 코(재물운)를 닮았어요 식 구체적 언급]"},
    "strength": {"title": "우리 가족 시너지", "body": "[함께 있을 때의 정서적 교감·학업/사회성 시너지 4~5줄]"},
    "risk": {"title": "주의할 점", "body": "[양육 시 주의할 갈등 포인트 3~4줄. 팩폭이지만 애정 담아]"},
    "advice": {"title": "양육 처방전", "body": "['OO이는 칭찬을 먹고 자라요' 식 구체적 양육 조언 4~5줄 + 자녀 고집을 다룰 팁]"}
  },

  "one_liner": "따뜻한 한 줄 메시지"
}

[에러] 아래 경우 분석 거부 → {"error":"face_not_found"}:
- 얼굴 인식 불가 (흐릿·어두움·측면 등) / 동물·사물·일러스트
- 스티커·이모지 오버레이·인스타/스냅챗 AR필터·손·마스크·선글라스 등으로 눈·코·입 중 하나라도 가려진 경우 (부분 가림 포함)
`;

// ── Call-1 전용 prompt: type_name 확정만 (이름·관계 컨텍스트 없음) ──
const CHAR1_PROMPT = `두 사람(자녀·보호자)의 얼굴 특징(코·눈·입·이마·턱)만 보고 각각의 관상 유형명을 결정해.
얼굴에서 가장 두드러진 특징 1개로 창의적이고 특색 있는 관상 유형명(8~15자) 결정.
⚠️ 이름·관계는 이 단계에서 완전 무시. 사진만 본다.
JSON만: {"type_a": "자녀 관상유형명", "type_b": "보호자 관상유형명"}`;

async function callGemini(body: string): Promise<Response> {
  const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
  let res: Response | null = null;
  outer: for (const model of MODELS) {
    const url = getGeminiUrl(model);
    for (let i = 0; i < 3; i++) {
      try {
        res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
        if (res.ok) break outer;
        const err = await res.clone().json().catch(() => null);
        const msg = (err?.error?.message || "") + " " + (err?.error?.status || "");
        const isOverload = res.status === 503 || res.status === 429 || /overload|high demand|UNAVAILABLE/i.test(msg);
        if (isOverload) {
          if (i < 2) await new Promise(r => setTimeout(r, 1500 * (i + 1)));
          continue;
        }
        break;
      } catch {
        if (i < 2) await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  return res!;
}

// v(2026-07-08): 사전질문 답변(rel/focus) → Call-2 프롬프트 주입 (궁합 5종과 동일 패턴)
function buildPreQRule(questions: Record<string, unknown>): string {
  const q = questions || {};
  const rel = typeof q.rel === "string" ? q.rel : "";
  const focus = Array.isArray(q.focus) ? (q.focus as string[]).filter((s) => typeof s === "string") : [];
  if (!rel && focus.length === 0) return "";
  const lines: string[] = [];
  if (rel) lines.push(`- 자녀와의 관계: "${rel}"`);
  if (focus.length > 0) lines.push(`- 가장 궁금한 것: ${focus.map((f) => `"${f}"`).join(", ")}`);
  const extra = focus.length > 0 ? `\n⚠️ "가장 궁금한 것"에 나온 항목들을 sections 본문 전반에 우선적으로 반영 — 무관한 일반론 위주로 쓰지 말 것.` : "";
  return `\n[사용자 사전질문 답변 — 반드시 반영]\n${lines.join("\n")}${extra}\n`;
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData1, imageData2, mediaType = "image/jpeg", name1 = "자녀", name2 = "보호자", relLabel = "보호자", questions = {} } = body;
    if (!imageData1 || !imageData2) return NextResponse.json({ error: "자녀와 보호자 두 분의 사진이 필요합니다." }, { status: 400 });

    const b64_1 = imageData1.includes(",") ? imageData1.split(",")[1] : imageData1;
    const b64_2 = imageData2.includes(",") ? imageData2.split(",")[1] : imageData2;
    const mType = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    // === CALL 1: type_name 확정 (사진만, 이름·관계 없음) ===
    const char1Body = JSON.stringify({
      systemInstruction: { parts: [{ text: CHAR1_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: "첫 번째=자녀, 두 번째=보호자. 관상 유형명 결정. JSON만: {\"type_a\": \"유형명\", \"type_b\": \"유형명\"}" }
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
    console.log(`[parent-child-compat] Call-1 type_a="${typeA ?? "FAILED"}" type_b="${typeB ?? "FAILED"}"`);

    // === CALL 2: 전체 가족 궁합 분석 (type_name + score/grade 고정, temperature 0.7) ===
    // v(2026-07-09): gwansang-compat과 동일 수정 — 점수 흔들림 fix, {nm1}/{nm2} 안전망, 반쪽짜리 응답 검증
    const lockedSc = (typeA && typeB) ? lockedScore([typeA, typeB, relLabel], 80, 99) : null;
    const lockedGr = lockedSc !== null ? gradeSAB(lockedSc) : null;
    const fixedRule = (typeA && typeB)
      ? `⚠️ person_a.type_name은 반드시 "${typeA}", person_b.type_name은 반드시 "${typeB}". 절대 변경 불가.\n⚠️ score는 반드시 ${lockedSc}, grade는 반드시 "${lockedGr}". 절대 변경 불가 (다른 필드는 이 값에 맞춰 자연스럽게 서술).\n\n`
      : "";
    const preQRule = buildPreQRule(questions);
    console.log(`[parent-child-compat] Call-2 fixedRule injected=${!!(typeA && typeB)} lockedScore=${lockedSc} preQ_ok=${!!preQRule}`);
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + preQRule + SYSTEM_PROMPT.replace(/\{rel_label\}/g, relLabel) }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: `첫 번째 사진은 자녀("${name1}"), 두 번째 사진은 보호자("${name2}", ${relLabel})입니다. 모든 텍스트 필드에서 반드시 이 실제 이름("${name1}", "${name2}")을 그대로 사용해서 작성해라 — {nm1}/{nm2} 같은 템플릿 변수는 절대 쓰지 말 것. JSON만 출력.` }
      ]}],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 512 } },
    });
    const geminiRes = await callGemini(reqBody);

    const geminiData = await geminiRes.json();
    if (geminiData.error) return NextResponse.json({ error: "AI 분석 중 오류: " + (geminiData.error.message || "").substring(0, 100) }, { status: 500 });

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) { if (part.text) rawText = part.text; }
    if (!rawText) return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    let parsed = parseGeminiJson(rawText);
    if (!parsed) return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });

    if (parsed.error === "face_not_found") return NextResponse.json({ error: "얼굴이 인식되지 않았어요. 자녀와 보호자의 정면 사진을 다시 올려주세요!" }, { status: 400 });

    if (lockedSc !== null) { parsed.score = lockedSc; parsed.grade = lockedGr; }
    parsed = fillNameTokens(parsed, { "{nm1}": name1, "{nm2}": name2 });

    const validationErr = validateCompatResult(parsed);
    if (validationErr) {
      console.log(`[parent-child-compat] validation failed: ${validationErr}`);
      return NextResponse.json({ error: "분석 응답이 불완전해요. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "가족 궁합 분석 오류" }, { status: 500 });
  }
}
