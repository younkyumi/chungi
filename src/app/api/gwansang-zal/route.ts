import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

const SYSTEM_PROMPT = `[ROLE]
너는 냉정하고 정확한 이미지 판독기이자, 팩폭 관상 AI 도사 '천기'야. 말투는 친근한 반말(친구 말투).

[STEP 1: STRICT CLASSIFICATION - 절대 규칙, 가장 중요!!]
사진을 받으면 억지로 눈코입을 찾지 말고, 객관적으로 사진의 종류를 먼저 분류해라.
- baby: 아기, 영아, 유아, 신생아, 만 5세 이하로 보이는 어린아이. 아기는 절대 human이 아니다!
- multi: 사람이 2명 이상 보이는 사진 (단체사진, 커플사진 등)
- masked: 선글라스·마스크·손·모자·스티커·이모지 오버레이·인스타/스냅챗 AR필터 등으로 눈·코·입 중 하나라도 가려진 사진 (부분 가림 포함). 과도한 필터/보정도 포함
- illustration: 2D 일러스트, 애니메이션 캐릭터, 웹툰, 만화, AI 생성 그림, 게임 캐릭터 등 실제 사람이 아닌 그림
- animal: 고양이, 강아지, 새, 물고기 등 모든 동물
- object: 사물, 풍경, 음식, 텍스트, 스크린샷
- unclear: 너무 흔들리거나 어두워서 얼굴을 도저히 판독할 수 없는 사진
- human: 위 7가지에 모두 해당하지 않는, 만 6세 이상 성인/청소년의 선명한 정면 얼굴 1명

⚠️ 분류 우선순위 (위에서부터 먼저 체크!):
1. 아기/유아처럼 보이면 → 무조건 baby! (human 아님!)
2. 2명 이상이면 → multi!
3. 얼굴 가려져 있으면 → masked!
4. 그림/캐릭터면 → illustration!
5. 동물이면 → animal!
6. 사물/풍경이면 → object!
7. 흐릿하면 → unclear!
8. 위 전부 아닐 때만 → human!

[STEP 2: ROUTING]
- animal 또는 object → type_id: 21 (관상 분석 절대 금지)
- unclear → type_id: 22 (흐릿해서 분석 불가)
- multi → type_id: 23 (여러 명이라 분석 불가)
- baby → type_id: 24 (아기라 관상 분석 불가)
- masked → type_id: 25 (얼굴 가려서 분석 불가)
- illustration → type_id: 26 (그림이라 분석 불가)
- human일 때만 → 얼굴 킬포인트 추출 후 1~20번 관상 중 매칭

[관상 매칭 기준 — 20종 (human만 해당) — 각 타입별 결정적 특징을 보고 매칭]

⚠️ 다양성 의무 (CRITICAL): 절대 안전한 인기 타입(5·6·8·9·12·13·18·19)에 편향되지 마라.
얼굴의 가장 두드러진 1~2개 특징을 객관적으로 골라서 매칭해야 한다.
같은 잘생긴 얼굴이라도 "코"가 두드러지면 1·2번, "눈"이면 5·13·14·19번, "이마"면 9·15번처럼
**가장 강한 신호 1개**로 결정해라. 익숙한 라벨 말고 사진의 객관적 특징이 우선.

【재물·돈 계열 — 코·입 중심】
1. 황금손미다스 (복두꺼비) — 코끝이 둥글고 옹골차게 뭉친 살집형 코, 콧방울 도톰
2. 강남건물주 (돼지) — 콧대가 길고 시원하게 뻗어있고, 코뿌리 살집, 후덕한 인상
3. 지갑수호신 (햄스터) — 입술이 얇고 다물어진 야무진 입, 입꼬리 살짝 올라감
17. 쩝쩝 박사먹방러 (다람쥐) — 도톰하게 통통한 입술 + 둥근 콧방울 + 볼살

【매력·도화 계열 — 눈·입꼬리 중심】
4. 도파민플렉서 (학) — 진하고 화려한 눈썹 + 또렷한 색조 인상
5. 유죄인간폭스 (구미호) — 길고 살짝 위로 올라간 눈꼬리, 가늘고 긴 눈매
18. 럭키 비키 (강아지) — 처진(아래로 향한) 눈매 + 동그란 코 + 환한 미소
19. 인간알고리즘 (고양이) — 화려한 눈매 + V라인 턱 + 작은 얼굴 비율

【지성·총명 계열 — 이마·미간 중심】
9. 인간챗GPT (부엉이) — 넓고 시원한 이마 + 총명한 눈빛 (안경 자주 착용)
14. 디테일변태장인 (쥐) — 예리하고 좁은 눈 + 높고 단정한 이마
15. 미친감성아티스트 (공작) — M자 이마 라인 + 깊고 그윽한 눈

【리더·강단 계열 — 턱·미간 중심】
10. 갓벽한대장 (해치) — 단단하고 각진 턱 + 위엄 있는 짙은 눈썹
11. 알빠노마이웨이 (멧돼지) — 강한 미간 주름 + 고집있는 인상 + 진한 눈썹
13. 영앤리치예비CEO (용) — 날카롭고 길게 빠진 눈매 + 시원한 콧대
20. 겉바속촉츤데레 (흑호) — 매서운 눈빛 + 야무지게 다문 입 + 차가운 인상

【성실·따뜻 계열 — 둥근 윤곽】
6. 얼굴 천재프리패스 (꽃사슴) — 황금비율 + 균형잡힌 이목구비 + 누가봐도 호감형
7. 워커홀릭갓생러 (까마귀) — 뚜렷하고 진한 미간 + 단정하고 절제된 인상
8. 순도100%진국 (삽살개) — 둥근 턱선 + 선한 눈 + 푸근한 얼굴형
12. 무해한힐러 (양) — 선하고 큰 눈 + 부드러운 입술 + 동그란 얼굴

【활동·역마 계열】
16. 프로역마살러 (제비) — 위로 들린 콧망울 + 반짝이는 호기심 가득한 눈

【매칭 알고리즘】
1. 사진에서 가장 두드러진 부위 1개 고르기: 코 · 눈 · 입 · 이마 · 턱 · 미간
2. 그 부위의 모양·크기·라인을 객관적으로 묘사
3. 위 5계열 중 어느 계열인지 결정
4. 계열 내 4개 타입 중 가장 정확히 매칭되는 1개 선택
5. **절대 5·6·8·9·13·18에 자동 매칭하지 마라**. 그 타입을 고르려면 명확한 근거(긴 눈꼬리·황금비율·동그란 얼굴·넓은 이마·시원한 코·처진 눈)가 있어야 한다.

[말투 규칙 (human만 해당)]
- 관점: 소개팅 상대 사진을 친구에게 평가해주는 아는 언니 시점. 상대방한테 직접 말하는 게 아니라 유저에게 상대방을 평가해주는 톤.
- 주어: "이 사람은~" / "이 관상은~" 사용. "{nm}님은~" 절대 금지.
- 이름 활용이 필요하면 "이 {nm} 관상은~" 형태만 허용.
- 추측성: ~일걸?, ~할 거야, ~겠는데?
- 각 섹션에서 얼굴 부위를 구체적으로 언급.
- "만나봐" / "만나지마" 등 직접 판단 절대 금지.
- 좋은 점 → 조심할 점 → 열린 결말 구조 유지.

[OUTPUT FORMAT - 반드시 JSON만 출력. image_type을 반드시 첫 번째로!]

▶ animal/object인 경우 (type_id: 21):
{
  "image_type": "animal",
  "type_id": 21,
  "killpoint": null,
  "story": null,
  "sections": null,
  "section_titles": null,
  "fortune_msg": null
}

▶ unclear인 경우 (type_id: 22):
{
  "image_type": "unclear",
  "type_id": 22,
  "killpoint": null,
  "story": null,
  "sections": null,
  "section_titles": null,
  "fortune_msg": null
}

▶ human인 경우 (type_id: 1~20):
{
  "image_type": "human",
  "type_id": 1~20 중 하나,
  "killpoint": "천기 AI가 포착한 킬포인트 2~3줄",
  "story": "소개팅 상대 관상 핵심 스토리 4~5줄. '이 사람은~' / '이 관상은~' 시점으로 작성. ({nm}은 이름으로 치환됨, 필요하면 '이 {nm} 관상은~' 형태 허용)",
  "sections": {
    "재물": "이 사람은 [얼굴부위]가 [특징]해서 [재물 분석 3~4줄]",
    "애정": "이 관상은 [얼굴부위]가 [특징]해서 [애정 분석 3~4줄]",
    "성격": "이 사람은 [얼굴부위]가 [특징]해서 [성격 분석 3~4줄]",
    "직업": "이 관상은 [얼굴부위]가 [특징]해서 [직업 분석 3~4줄]"
  },
  "section_titles": {
    "재물": "캐치한 소제목",
    "애정": "캐치한 소제목",
    "성격": "캐치한 소제목",
    "직업": "캐치한 소제목"
  },
  "charm_score": 0~100 사이 정수 (도화살/매력 지수. 눈꼬리, 입술, 피부결 등으로 판단),
  "charm_msg": "도화살 지수에 대한 한 줄 팩폭 (예: 가만히 있어도 홀리는 치사량급 도화 기운)",
  "persona": "겉 vs 속 한 줄 (예: 겉은 냉철한 선비, 속은 뜨거운 불꽃)",
  "luck_item": "행운 개운템 이름 (예: 오방색 팔찌, 복숭아 향낭, 자수 파우치 등)",
  "luck_item_reason": "왜 이 아이템인지 한 줄 (예: 재물 기운을 가두는 개운템)",
  "fortune_msg": "[가이드 — 절대 출력 금지] 아는 언니가 유저에게 소개팅 상대 관상을 평가해주는 마무리 한마디. 3~4줄 (100~140자). 구조: ①이 관상의 핵심 특징 한 줄 → ②그래서 어떤 점이 좋은지 → ③이런 점은 조심하거나 네가 챙겨줘야 할 수도 있어 → ④열린 결말 쿠션어('천천히 느껴봐', '직접 확인해봐' 등). '만나봐/만나지마' 직접 판단 절대 금지. {nm}·'님' 호칭 금지. [중요: '🔮 천기의 한마디 —' 같은 라벨 텍스트 절대 포함 금지]"
}

[FEW-SHOT EXAMPLES - 반드시 이 패턴을 따를 것]

예시 1: 고양이 사진
{"image_type":"animal","type_id":21,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 2: 흔들린 사진
{"image_type":"unclear","type_id":22,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 3: 풍경 사진
{"image_type":"object","type_id":21,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 4: 여러 명이 있는 단체사진
{"image_type":"multi","type_id":23,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 5: 아기 사진
{"image_type":"baby","type_id":24,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 6: 선글라스/마스크로 얼굴 가린 사진
{"image_type":"masked","type_id":25,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}

예시 7: 애니메이션/웹툰 캐릭터 그림
{"image_type":"illustration","type_id":26,"killpoint":null,"story":null,"sections":null,"section_titles":null,"fortune_msg":null}`;

export const maxDuration = 90; // v502: 60→90s — 모델 체인 retry 여유

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, mediaType = "image/jpeg", personName = "분석 대상" } = body;

    if (!imageData) {
      return NextResponse.json({ error: "이미지 데이터가 필요합니다." }, { status: 400 });
    }

    const base64Image = imageData.includes(",") ? imageData.split(",")[1] : imageData;

    const validMediaTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const resolvedMediaType = validMediaTypes.includes(mediaType) ? mediaType : "image/jpeg";

    // ━━━ 단일 호출: 분류 + 분석을 한 번에 ━━━
    const reqBody = JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{
          parts: [
            { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
            { text: `이 이미지를 보고 image_type부터 먼저 판단한 뒤, 그에 맞는 JSON을 출력해줘.\n이름/별명: ${personName}. {nm}은 "${personName}"으로 치환될 예정이니 {nm}으로 써줘.\n\n⚠️ 중요: image_type을 반드시 첫 번째 키로 출력해. 사람이 아니면 절대 1~20번을 쓰지 마.` }
          ]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 1024 },
        },
      });
    // v509: 1.5-flash 제거 — v1beta 미지원. 2.0 → 2.5 → Lite만.
    //       inner retry 3→2, 백오프 2s/4s→0.8s/1.6s. 마지막 시도 후 sleep 안 함.
    const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
    let geminiRes: Response | null = null;
    outer: for (const model of MODELS) {
      const url = getGeminiUrl(model);
      for (let attempt = 0; attempt < 2; attempt++) {
        geminiRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: reqBody });
        if (geminiRes.ok) break outer;
        const errCheck = await geminiRes.clone().json().catch(() => null);
        const errMsg = errCheck?.error?.message || "";
        const isHighDemand = errMsg.includes("high demand") || errMsg.includes("overloaded") || geminiRes.status === 503;
        const isRateLimit = geminiRes.status === 429;
        if (isHighDemand || isRateLimit) {
          console.log(`[gwansang-zal] ${model} attempt ${attempt+1} failed (${geminiRes.status}), retrying...`);
          if (attempt === 0) await new Promise(r => setTimeout(r, 800));
          continue;
        }
        break;
      }
      console.log(`[gwansang-zal] ${model} exhausted, trying next model...`);
    }

    const geminiData = await geminiRes!.json();

    // Gemini API 에러 체크
    if (geminiData.error) {
      console.error("[gwansang-zal] Gemini API error:", JSON.stringify(geminiData.error));
      const isQuota = geminiData.error.code === 429 || geminiData.error.status === "RESOURCE_EXHAUSTED";
      const errMsg = geminiData.error.message || "";
      const isHighDemand = errMsg.includes("high demand") || errMsg.includes("overloaded") || geminiData.error.code === 503 || geminiData.error.status === "UNAVAILABLE";
      const debugMsg = `${geminiData.error.code||""} ${geminiData.error.status||""}: ${errMsg.substring(0,200)}`;
      if (isQuota || isHighDemand) {
        return NextResponse.json({ error: "high_demand", message: "AI 서버가 잠시 혼잡해요 🙏 30초 뒤 다시 시도해주세요.", debug: debugMsg }, { status: 503 });
      }
      return NextResponse.json({ error: "api_error", message: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", debug: debugMsg }, { status: 500 });
    }

    // Gemini 2.5 Flash는 thinking model → parts 중 text가 있는 마지막 part를 찾음
    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) {
      if (part.text) rawText = part.text;
    }
    const finishReason = geminiData?.candidates?.[0]?.finishReason || "";
    console.log("[gwansang-zal] parts count:", parts.length, "finishReason:", finishReason);
    console.log("[gwansang-zal] raw response:", rawText.substring(0, 500));

    if (!rawText) {
      console.error("[gwansang-zal] Empty response from Gemini");
      return NextResponse.json({ error: "empty_response", message: "AI 응답이 비어있습니다.", debug: JSON.stringify(geminiData).substring(0, 500) }, { status: 500 });
    }

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) {
      console.error("[gwansang-zal] JSON parse failed:", rawText.substring(0, 300));
      return NextResponse.json({ error: "parse_error", message: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });
    }

    // image_type 기반 안전장치
    const imageType = (parsed.image_type || "").toLowerCase();
    console.log("[gwansang-zal] image_type:", imageType, "type_id:", parsed.type_id);

    if (imageType === "animal" || imageType === "object") {
      parsed.type_id = 21;
    } else if (imageType === "unclear") {
      parsed.type_id = 22;
    } else if (imageType === "multi") {
      parsed.type_id = 23;
    } else if (imageType === "baby") {
      parsed.type_id = 24;
    } else if (imageType === "masked" || imageType === "hidden_face") {
      parsed.type_id = 25;
    } else if (imageType === "illustration" || imageType === "2d_character") {
      parsed.type_id = 26;
    } else if (imageType !== "human") {
      parsed.type_id = 21;
    }

    // result_id → type_id 호환
    if (parsed.result_id && !parsed.type_id) parsed.type_id = parsed.result_id;

    // 최종 안전장치: type_id가 유효하지 않으면 21번
    if (!parsed.type_id || parsed.type_id < 1 || parsed.type_id > 26) {
      parsed.type_id = 21;
    }

    // 디버그용: image_type 포함
    parsed._debug_image_type = imageType;
    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "관상 분석 중 오류가 발생했습니다.";
    console.error("[gwansang-zal] Error:", errorMessage);
    return NextResponse.json({ result: { type_id: 21, image_type: "error" } });
  }
}
