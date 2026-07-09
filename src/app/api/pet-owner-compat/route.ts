import { NextRequest, NextResponse } from "next/server";
import { lockedScore, gradeSABC, fillNameTokens, validateCompatResult } from "@/lib/compat-helpers";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// v(2026-07-09): 궁합 7번 — 집사(사람)+반려동물(강아지/고양이) 궁합.
// 궁합 5종/parent-child-compat과 동일 응답 스키마(score/grade/chemistry_name/person_a·b/stats/sections/one_liner)로 통일 —
// 프론트 결과 렌더링 컴포넌트를 그대로 재사용하기 위함.
function getSystemPrompt(species: "dog" | "cat") {
  const callsign = species === "dog" ? "강아지" : "고양이";
  return `[ROLE]
너는 반려동물 인연 전문가 '천기'. 집사(사람)와 ${callsign}의 사진을 보고 '천연(天緣) 궁합'을 판독해.
⚠️ 모든 텍스트 필드는 실제 이름을 그대로 써서 작성해라. {nm1}/{nm2} 같은 중괄호 템플릿 변수·placeholder는 절대 출력 금지 — 반드시 실제 이름 문자열 그 자체를 써라.
⚠️ 무조건 따뜻하고 긍정적으로! 두 존재의 교감·인연에 초점. 절대 비방 X.
⚠️ type_name 결정 불변 원칙 (CRITICAL): person_a.type_name(집사), person_b.type_name(${callsign})은 오직 각자의 얼굴 특징으로만 결정. 이름·기간 정보와 완전 무관. 같은 사진이면 어떤 조건에서도 동일한 type_name이 나와야 한다.

[핵심 컨셉]
"천연(天緣) 가족" — 반려동물은 우연이 아니라 전생부터 이어진 영혼의 인연이 작은 몸으로 다시 찾아온 것. 교감·행운·케어 시너지에 초점.

[OUTPUT - JSON만]
{
  "score": 60~99 정수,
  "grade": "S/A/B/C",
  "chemistry_name": "천연 케미명 (예: 전생의 수호자, 영혼의 동반자)",

  "person_a": {
    "type_name": "집사 관상 유형 (예: 따뜻한 보살핌의 큰 나무상)",
    "analysis": "[집사의 관상/${callsign}에게 주는 영향 4~5줄]"
  },
  "person_b": {
    "type_name": "${callsign} 관상 유형 (예: 애교 가득 해맑은 인상)",
    "analysis": "[${callsign}의 인상/본성/집사와의 교감 방식 4~5줄]"
  },

  "stats": {
    "stat1": {"label": "교감 지수", "value": 0~100, "icon": "💞"},
    "stat2": {"label": "성격 합", "value": 0~100, "icon": "🐾"},
    "stat3": {"label": "행운 시너지", "value": 0~100, "icon": "🌟"}
  },

  "sections": {
    "main": {"title": "전생부터 이어진 인연", "body": "[핵심 인연 서사 5~6줄. 예: 집사의 눈빛과 ${callsign}가 특별히 따르는 이유를 연결지어 구체적으로]"},
    "strength": {"title": "우리 둘의 교감 포인트", "body": "[교감·시너지 4~5줄]"},
    "risk": {"title": "케어 시 주의할 점", "body": "[돌봄 시 주의 포인트 3~4줄. 팩폭이지만 애정 담아]"},
    "advice": {"title": "공동 개운법", "body": "[함께 하면 좋은 개운 습관 4~5줄]"}
  },

  "one_liner": "따뜻한 한 줄 메시지"
}

[에러] 아래 경우 분석 거부 → {"error":"person_not_found"} 또는 {"error":"pet_not_found"}:
- 사진1(집사)에 사람 얼굴이 없거나(동물·사물·일러스트) 눈·코·입이 가려진 경우 → person_not_found
- 사진2(${callsign})가 ${species === "dog" ? "고양이·기타 동물·사람·그림" : "강아지·기타 동물·사람·그림"}이거나, 여러 마리이거나, 흐릿하거나, 눈이 가려진 경우 → pet_not_found
`;
}

// ── Call-1 전용 prompt: 유효성 검증 + type_name 확정 (기간·이름 컨텍스트 없음) ──
function getChar1Prompt(species: "dog" | "cat") {
  const callsign = species === "dog" ? "강아지" : "고양이";
  return `사진1은 집사(사람), 사진2는 ${callsign}이어야 해.
각 사진의 유효성을 먼저 판단하고, 유효하면 얼굴 특징(눈·코·입·이마·턱 또는 눈매·코·입·털·표정)만 보고 관상 유형명을 결정해.
얼굴에서 가장 두드러진 특징 1개로 창의적이고 특색 있는 유형명(8~15자) 결정.
⚠️ 이름·기간은 이 단계에서 완전 무시. 사진만 본다.

JSON만:
{
  "valid_person": true|false (사진1에 사람 얼굴이 정면/¾각도로 명확히 보이면 true),
  "valid_pet": true|false (사진2에 ${callsign} 1마리의 얼굴이 명확히 보이면 true, 다른 동물·사람·그림·여러마리·가려짐이면 false),
  "type_a": "집사 관상유형명 (valid_person false면 빈 문자열)",
  "type_b": "${callsign} 관상유형명 (valid_pet false면 빈 문자열)"
}`;
}

// v(2026-07-09): 사전질문 답변(duration) → Call-2 프롬프트 주입
function buildPreQRule(questions: Record<string, unknown>): string {
  const q = questions || {};
  const duration = typeof q.duration === "string" ? q.duration : (typeof q.period === "string" ? q.period : "");
  if (!duration) return "";
  return `\n[사용자 사전질문 답변 — 반드시 반영]\n- 함께한 기간: "${duration}"\n⚠️ 함께한 기간을 sections.main 또는 sections.strength 본문에서 자연스럽게 언급할 것 (예: 오래된 사이면 "그 세월만큼 깊어진", 짧으면 "이제 막 시작된 인연이지만" 식).\n`;
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
    const { imageData1, imageData2, mediaType = "image/jpeg", name1 = "나", name2 = "반려동물", species = "dog", questions = {} } = body;
    if (!imageData1 || !imageData2) return NextResponse.json({ error: "집사와 반려동물 두 분의 사진이 필요합니다." }, { status: 400 });
    const resolvedSpecies: "dog" | "cat" = species === "cat" ? "cat" : "dog";
    const callsign = resolvedSpecies === "dog" ? "강아지" : "고양이";

    const b64_1 = imageData1.includes(",") ? imageData1.split(",")[1] : imageData1;
    const b64_2 = imageData2.includes(",") ? imageData2.split(",")[1] : imageData2;
    const mType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    // === CALL 1: 유효성 검증 + type_name 확정 (사진만, 이름·기간 없음) ===
    const char1Body = JSON.stringify({
      systemInstruction: { parts: [{ text: getChar1Prompt(resolvedSpecies) }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: `첫 번째=집사(사람), 두 번째=${callsign}. 유효성 판단 + 관상 유형명 결정. JSON만 출력.` }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 120, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
    });
    let validPerson: boolean | null = null;
    let validPet: boolean | null = null;
    let typeA: string | null = null;
    let typeB: string | null = null;
    try {
      const c1 = await callGemini(char1Body);
      if (c1.ok) {
        const c1d = await c1.json();
        const c1t = (c1d?.candidates?.[0]?.content?.parts || []).reduce((s: string, p: {text?: string}) => p.text ? p.text : s, "");
        const c1j = JSON.parse(c1t.replace(/```json\n?|\n?```/g, "").trim());
        validPerson = c1j?.valid_person === true;
        validPet = c1j?.valid_pet === true;
        if (c1j?.type_a && typeof c1j.type_a === "string") typeA = c1j.type_a;
        if (c1j?.type_b && typeof c1j.type_b === "string") typeB = c1j.type_b;
      }
    } catch {}
    console.log(`[pet-owner-compat] Call-1 valid_person=${validPerson} valid_pet=${validPet} type_a="${typeA ?? "FAILED"}" type_b="${typeB ?? "FAILED"}"`);

    // Call-1이 명확히 유효성 실패를 감지했으면 Call-2 없이 바로 에러 반환 (비용 절감 + 정확도)
    if (validPerson === false) {
      return NextResponse.json({ error: "집사님의 얼굴이 잘 보이지 않아요. 정면 사진으로 다시 올려주세요!" }, { status: 400 });
    }
    if (validPet === false) {
      return NextResponse.json({ error: `${callsign} 사진을 다시 확인해주세요. 다른 동물이거나, 여러 마리이거나, 얼굴이 가려진 것 같아요!` }, { status: 400 });
    }

    // === CALL 2: 전체 궁합 분석 (type_name + score/grade 고정, temperature 0.7) ===
    // v(2026-07-09): gwansang-compat 라이브 테스트에서 발견된 버그(점수 흔들림/{nm1}{nm2} 미치환/반쪽짜리 응답) 동일 구조라 선제 수정
    const lockedSc = (typeA && typeB) ? lockedScore([typeA, typeB, resolvedSpecies], 60, 96) : null;
    const lockedGr = lockedSc !== null ? gradeSABC(lockedSc) : null;
    const fixedRule = (typeA && typeB)
      ? `⚠️ person_a.type_name은 반드시 "${typeA}", person_b.type_name은 반드시 "${typeB}". 절대 변경 불가.\n⚠️ score는 반드시 ${lockedSc}, grade는 반드시 "${lockedGr}". 절대 변경 불가 (다른 필드는 이 값에 맞춰 자연스럽게 서술).\n\n`
      : "";
    const preQRule = buildPreQRule(questions);
    console.log(`[pet-owner-compat] Call-2 fixedRule injected=${!!(typeA && typeB)} lockedScore=${lockedSc} preQ_ok=${!!preQRule}`);
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + preQRule + getSystemPrompt(resolvedSpecies) }] },
      contents: [{ parts: [
        { inlineData: { mimeType: mType, data: b64_1 } },
        { inlineData: { mimeType: mType, data: b64_2 } },
        { text: `첫 번째 사진은 집사("${name1}"), 두 번째 사진은 ${callsign}("${name2}")입니다. 모든 텍스트 필드에서 반드시 이 실제 이름("${name1}", "${name2}")을 그대로 사용해서 작성해라 — {nm1}/{nm2} 같은 템플릿 변수는 절대 쓰지 말 것. JSON만 출력.` }
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

    if (parsed.error === "person_not_found") return NextResponse.json({ error: "집사님의 얼굴이 잘 보이지 않아요. 정면 사진으로 다시 올려주세요!" }, { status: 400 });
    if (parsed.error === "pet_not_found") return NextResponse.json({ error: `${callsign} 사진을 다시 확인해주세요. 다른 동물이거나, 여러 마리이거나, 얼굴이 가려진 것 같아요!` }, { status: 400 });

    if (lockedSc !== null) { parsed.score = lockedSc; parsed.grade = lockedGr; }
    parsed = fillNameTokens(parsed, { "{nm1}": name1, "{nm2}": name2 });

    const validationErr = validateCompatResult(parsed);
    if (validationErr) {
      console.log(`[pet-owner-compat] validation failed: ${validationErr}`);
      return NextResponse.json({ error: "분석 응답이 불완전해요. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "반려동물 궁합 분석 오류" }, { status: 500 });
  }
}
