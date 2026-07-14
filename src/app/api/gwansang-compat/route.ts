import { NextRequest, NextResponse } from "next/server";
import { lockedScore, gradeSABC, fillNameTokens, validateCompatResult, GWANSANG_20, pickFromList } from "@/lib/compat-helpers";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

const SYSTEM_PROMPT = `[ROLE]
너는 관상 궁합 전문가 '천기'. 두 사람의 얼굴을 분석하여 궁합을 판독해.
⚠️ 모든 텍스트 필드는 실제 이름을 그대로 써서 작성해라. {nm1}/{nm2} 같은 중괄호 템플릿 변수·placeholder는 절대 출력 금지 — 반드시 실제 이름 문자열 그 자체를 써라.
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

[에러] 아래 경우 분석 거부 → {"error":"face_not_found"}:
- 얼굴 2개 이상 / 얼굴 없음 / 동물·사물·일러스트
- 스티커·이모지 오버레이·인스타/스냅챗 AR필터·손·마스크·선글라스 등으로 눈·코·입 중 하나라도 가려진 경우 (부분 가림 포함)
- 흐릿·어두움으로 얼굴 인식 불가
`;

// ── Call-1 전용 prompt: type_name 확정만 (모드 컨텍스트 없음) ──
// v(2026-07-14): 자유 작명 → 닫힌 20종 후보 중 선택으로 전환 (같은 사진이 매번 다른 이름을 받던 흔들림 버그 fix)
const CHAR1_PROMPT = `두 사람의 얼굴 특징(코·눈·입·이마·턱)만 보고, 각각 아래 20종 관상 유형 중 가장 가까운 것을 하나씩 고르시오.
⚠️ 반드시 아래 목록에 있는 이름을 토씨 하나 틀리지 않고 그대로 출력할 것. 새로운 이름 창작 절대 금지.
[20종 목록]
${GWANSANG_20.map((n, i) => `${i + 1}. ${n}`).join("\n")}
⚠️ 이름·관계·모드는 이 단계에서 완전 무시. 사진만 본다.
JSON만: {"type_a": "목록에 있는 이름 그대로", "type_b": "목록에 있는 이름 그대로"}`;

// v(2026-07-08): 사전질문 답변 → Call-2 프롬프트 주입 (5종 궁합: rel/focus/pain/type)
function buildPreQRule(questions: Record<string, unknown>, mode: string): string {
  const q = questions || {};
  const rel = typeof q.rel === "string" ? q.rel : "";
  const focus = Array.isArray(q.focus) ? (q.focus as string[]).filter((s) => typeof s === "string") : [];
  const pain = typeof q.pain === "string" ? q.pain : "";
  const type = typeof q.type === "string" ? q.type : "";
  if (!rel && focus.length === 0 && !pain && !type) return "";

  const lines: string[] = [];
  if (rel) lines.push(`- 관계: "${rel}"`);
  if (type) lines.push(`- 최애 종류: "${type}"`);
  if (focus.length > 0) lines.push(`- 가장 궁금한 것: ${focus.map((f) => `"${f}"`).join(", ")}`);
  if (pain) lines.push(`- 힘든 점: "${pain}"`);

  let extra = "";
  if (mode === "enemy" && pain) {
    extra = `\n⚠️ 특히 "힘든 점"(${pain})은 sections.main 또는 sections.risk 본문에서 명시적으로 다뤄라 — 사용자가 말한 구체적 어려움을 콕 짚어 언급할 것 (일반론으로 얼버무리지 말 것).`;
  }
  if (focus.length > 0) {
    extra += `\n⚠️ "가장 궁금한 것"에 나온 항목들을 sections 본문 전반에 우선적으로 반영 — 사용자가 고른 항목과 무관한 일반론 위주로 쓰지 말 것.`;
  }

  return `\n[사용자 사전질문 답변 — 반드시 반영]\n${lines.join("\n")}${extra}\n`;
}

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

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData1, imageData2, mediaType = "image/jpeg", name1 = "A", name2 = "B", mode = "couple", questions = {} } = body;
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
    // v(2026-07-14): 20종 목록 밖 이름이거나 Call-1 실패 시 사진 데이터 기반 결정론적 폴백 선택 (랜덤 아님)
    typeA = pickFromList(typeA, GWANSANG_20, b64_1.slice(0, 40));
    typeB = pickFromList(typeB, GWANSANG_20, b64_2.slice(0, 40));
    console.log(`[gwansang-compat] Call-1 type_a="${typeA ?? "FAILED"}" type_b="${typeB ?? "FAILED"}"`);

    // === CALL 2: 전체 궁합 분석 (type_name + score/grade 고정, temperature 0.7) ===
    // v(2026-07-09): 라이브 테스트에서 발견된 점수 흔들림(같은 사진 88/91/72) 버그 수정 —
    // Call-1에서 확정된 type_a/type_b(+mode)로 score/grade를 결정적 해시로 고정. Call-2 자유생성 흔들림 원인 제거.
    const lockedSc = (typeA && typeB) ? lockedScore([typeA, typeB, mode]) : null;
    const lockedGr = lockedSc !== null ? gradeSABC(lockedSc) : null;
    const fixedRule = (typeA && typeB)
      ? `⚠️ person_a.type_name은 반드시 "${typeA}", person_b.type_name은 반드시 "${typeB}". 절대 변경 불가.\n⚠️ score는 반드시 ${lockedSc}, grade는 반드시 "${lockedGr}". 절대 변경 불가 (다른 필드는 이 값에 맞춰 자연스럽게 서술).\n\n`
      : "";
    const preQRule = buildPreQRule(questions, mode);
    console.log(`[gwansang-compat] Call-2 fixedRule injected=${!!(typeA && typeB)} lockedScore=${lockedSc} preQ_ok=${!!preQRule}`);
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + preQRule + SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: `첫 번째 사진(person_a)은 "${name1}", 두 번째 사진(person_b)은 "${name2}"입니다. 모드: ${mode} (${modeLabel}). 모든 텍스트 필드에서 반드시 이 실제 이름("${name1}", "${name2}")을 그대로 사용해서 작성해라 — {nm1}/{nm2} 같은 템플릿 변수는 절대 쓰지 말 것. JSON만 출력.` }
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

    if (parsed.error === "face_not_found") return NextResponse.json({ error: "얼굴이 인식되지 않았어요. 두 사람의 정면 사진을 다시 올려주세요!" }, { status: 400 });

    // 점수/등급 하드 고정 (Call-2가 지시 무시해도 강제 override)
    if (lockedSc !== null) { parsed.score = lockedSc; parsed.grade = lockedGr; }
    // {nm1}/{nm2} 템플릿 변수 잔존 시 실제 이름으로 강제 치환 (안전망)
    parsed = fillNameTokens(parsed, { "{nm1}": name1, "{nm2}": name2 });

    // 반쪽짜리 응답(문법은 JSON이지만 핵심 필드 누락) 방지 — 빈 값 그대로 노출되던 버그 fix
    const validationErr = validateCompatResult(parsed);
    if (validationErr) {
      console.log(`[gwansang-compat] validation failed: ${validationErr}`);
      return NextResponse.json({ error: "분석 응답이 불완전해요. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "궁합 분석 오류" }, { status: 500 });
  }
}
