import { NextRequest, NextResponse } from "next/server";

// v365: 단일 모델 → 다중 모델 fallback 체인 (overload 503 대응)
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
function getGeminiUrl(model: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// 조선초상화 분류 + 60종 매칭 (관대한 분류 — 얼굴 보이면 무조건 human)
// 60종 페르소나는 v3 JSON (남30·여30) — 성별 고려 필수
const CLASSIFY_PROMPT = `[ROLE]
너는 조선시대 페르소나 매칭 전문가야. 얼굴이 조금이라도 보이는 사진은 무조건 human으로 분류해.
의심스러우면 무조건 human. 너무 엄격하면 안 돼.

[Step 1: 분류 - 우선순위 순]
- baby: 만 3세 이하 명확한 아기 (5세 이상 의심되면 human)
- multi: 명확히 얼굴 2개 이상 강조됨 (배경 인물 무시, 1명만 또렷하면 human)
- masked: 얼굴 70% 이상 가림 (선글라스만/마스크만은 human)
- illustration: 명확한 그림/2D 캐릭터/만화
- animal: 명확한 동물 (사람 얼굴 없음)
- object: 사물/풍경 (사람 얼굴 없음)
- unclear: 매우 어둡거나 흐려서 얼굴 식별 완전 불가
- human: 위 분류에 명확히 해당하지 않으면 모두 human

[Step 2: human이면 성별·나이대·인상으로 조선 60종 페르소나 매칭]
성별을 먼저 판별 (男/女) → 적합한 ID 선택.

⚠️ 다양성 의무 (CRITICAL): 신뢰도 = 정확한 매칭. 인기 페르소나(1.대군 / 11.신사임당 / 13.꽃선비 / 47.김만덕 / 5.옹주 / 25.장군) 자동 매칭 금지!
얼굴 특징(이목구비·살집·눈빛·인상)을 객관적으로 분석하고, 가장 두드러진 1~2개 특징으로 매칭. 60종 골고루 사용해야 진짜 운명을 풀어줄 수 있음.

🔵 남자 (男, 28종) — 인상별 매칭 가이드:
[권력·고귀] 1.대군(귀티) 3.왕세자(섬세귀공자) 7.영의정(노련 카리스마)
[학문·문예] 10.집현전학자(지적안경) 13.꽃선비(부드러운 선비) 22.관상감천문학자(고요한 학자)
[자유·풍류] 14.한량(여유 멋쟁이) 15.풍류예인남(예술가형)
[관료·실무] 16.암행어사(날카로운 정의감) 17.내의원의관(차분 지적) 18.포도청포교(다부진) 20.역관(말끔한 외국 트인)
[예술·기예] 21.도화서화원(섬세한 손) 23.산학자(꼼꼼) 44.남자명창(목소리 풍채)
[무인·강건] 25.장군(위엄) 27.호위무사(과묵 강인) 28.포수(거친) 29.의병(단단한 의지)
[종교·영성] 35.내시(부드러운) 36.승려(평온) 39.박수무당(신비) 40.도사(초연)
[서민·생활] 34.숙수(푸근) 43.시장광대(친근) 46.거상(부유) 48.보부상(활동) 50.객주(능란) 51.농부(소박) 53.어부(거친 햇볕) 55.옹기장인(투박) 56.대장장이(굵은 손) 59.주막알바생(친화)

🌸 여자 (女, 32종) — 인상별 매칭 가이드:
[권력·왕실] 2.대비(연륜 위엄) 4.왕세자빈(차가운 우아) 5.옹주(귀티 어림) 6.평강공주(강단)
[양반·교양] 8.정경부인(품격) 11.신사임당(정숙 학문) 12.허난설헌(시인 우수)
[관능·매력] 19.기녀(짙은 매력) 41.일패명기(고급 예인) 42.사당패녀(예능) 45.여자명창(소리꾼)
[전문·기술] 24.선녀의녀(차분 의술) 26.여검객(기개) 30.지밀상궁(엄격) 31.수방상궁(정확) 32.수라간상궁(능숙) 33.침선비(섬세)
[종교·영성] 37.비구니(평온) 38.무녀(신비)
[부유·상인] 47.김만덕(부유 자수성가) 49.매분구(친화 상인) 58.주막주모(푸근 능란)
[서민·노동] 52.농부의처(억척) 54.잠녀(강인) 57.직조녀(차분) 60.찬모(소박)

[매칭 알고리즘]
1. 사진의 얼굴 부위 중 가장 두드러진 1~2개 특징 객관 묘사 (눈매·코·입·턱·얼굴형·인상)
2. 인상이 어느 그룹(권력·학문·자유·관료·예술·무인·종교·서민)에 가까운지 결정
3. 그룹 내에서 정확히 매칭되는 1개 선택
4. **인기 라벨(1·5·11·13·25·47)에 자동 매칭 금지**. 명확한 근거(얼굴에서 그 특징이 보일 때만) 있어야 그 페르소나 선택

[안경 판정] glasses: 도수/투명 안경(eyeglasses)을 썼으면 true, 안 썼으면 false. (선글라스는 false — masked 쪽)
→ 합성 시 안경테가 어색하게 딸려가서, true면 합성 전 안경 제거 전처리를 함.

[OUTPUT - JSON만, 다른 텍스트 금지]
{"image_type":"human/animal/unclear/multi/baby/masked/illustration","gender":"男/女","type_id":1~60,"glasses":true/false}
human이 아니면 type_id는 다음 에러 ID 사용:
- animal/object → "E1"
- unclear → "E2"
- multi → "E3"
- baby → "E4"
- masked → "E5"
- illustration → "E6"`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, mediaType = "image/jpeg" } = body;

    if (!imageData) {
      return NextResponse.json({ error: "이미지 데이터가 필요합니다." }, { status: 400 });
    }

    const base64Image = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const validMediaTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const resolvedMediaType = validMediaTypes.includes(mediaType) ? mediaType : "image/jpeg";

    // Step 1: Gemini로 분류 + 매칭 (v365: 다중 모델 fallback + overload retry 강화)
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: CLASSIFY_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
        { text: "이 사진을 분류하고, human이면 60종 중 매칭해. JSON만 출력." }
      ]}],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 100,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 512 },
      },
    });

    // 모델 체인 순회 — 각 모델당 최대 2회 retry, 503/overload면 다음 모델로
    let geminiRes: Response | null = null;
    let lastErrMsg = "";
    outer: for (const model of GEMINI_MODELS) {
      const GEMINI_URL = getGeminiUrl(model);
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          geminiRes = await fetch(GEMINI_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: reqBody });
          if (geminiRes.ok) break outer;
          const errCheck = await geminiRes.clone().json().catch(() => null);
          lastErrMsg = errCheck?.error?.message || `HTTP ${geminiRes.status}`;
          // 503 / overloaded / high demand → retry then next model
          const isOverload = geminiRes.status === 503 || /overload|high demand|UNAVAILABLE/i.test(lastErrMsg);
          if (isOverload) {
            if (attempt === 0) await new Promise(r => setTimeout(r, 1500));
            continue;
          }
          // 다른 에러 (4xx 등) → 다음 모델 시도
          break;
        } catch (e) {
          lastErrMsg = e instanceof Error ? e.message : "network";
          if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      return NextResponse.json({
        error: `AI 서버가 일시적으로 혼잡해요. 잠시 후 다시 시도해주세요. (${lastErrMsg.substring(0,120)})`,
      }, { status: 503 });
    }

    const geminiData = await geminiRes.json();
    if (geminiData.error) {
      return NextResponse.json({ error: "AI 분석 중 오류: " + (geminiData.error.message || "").substring(0, 100) }, { status: 500 });
    }

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) { if (part.text) rawText = part.text; }

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    let parsed = rawText ? parseGeminiJson(rawText) : null;
    // 빈 응답 또는 파싱 실패 시 — raw에서 숫자 추출 시도, 실패 시 E2(불분명) 에러카드
    if (!parsed) {
      const finishReason = geminiData?.candidates?.[0]?.finishReason || "EMPTY";
      console.warn("[joseon-portrait] parse fail (finishReason:", finishReason, ") raw:", rawText.substring(0, 200));
      const numMatch = rawText.match(/"type_id"\s*:\s*(\d+)/);
      const fallbackId = numMatch ? parseInt(numMatch[1]) : null;
      if (fallbackId && fallbackId >= 1 && fallbackId <= 60) {
        parsed = { image_type: "human", gender: rawText.includes("男") ? "男" : "女", type_id: fallbackId };
      } else {
        parsed = { image_type: "unclear", type_id: "E2" };
      }
    }

    // image_type 우선 — 에러 케이스는 E1~E6 강제
    const imgType = (parsed.image_type || "").toLowerCase();
    if (imgType === "animal" || imgType === "object") parsed.type_id = "E1";
    else if (imgType === "unclear") parsed.type_id = "E2";
    else if (imgType === "multi") parsed.type_id = "E3";
    else if (imgType === "baby") parsed.type_id = "E4";
    else if (imgType === "masked" || imgType === "hidden_face") parsed.type_id = "E5";
    else if (imgType === "illustration" || imgType === "2d_character") parsed.type_id = "E6";
    else if (imgType !== "human") parsed.type_id = "E1";

    // type_id 검증 — 숫자 1~60 또는 E1~E6 (string)
    let typeId: number | string = parsed.type_id;
    const isErrorId = typeof typeId === "string" && /^E[1-6]$/.test(typeId);
    if (!isErrorId) {
      const numId = parseInt(typeId as string);
      if (isNaN(numId) || numId < 1 || numId > 60) {
        // 잘못된 ID → E2(불분명) 에러카드 (랜덤 할당 금지)
        typeId = "E2";
      } else {
        typeId = numId;
      }
    }
    const isError = isErrorId;

    // Step 2: Face Swap (정상 사진만, Replicate API)
    let swappedImageUrl: string | null = null;
    let templateUrl: string | null = null;
    let swapError: string | null = null;
    let swapDebug: any = null;
    if (!isError) {
      try {
        const swapRes = await fetch(`${request.nextUrl.origin}/api/joseon-face-swap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userImage: imageData, templateId: typeId, removeGlasses: !!parsed.glasses }),
        });
        if (swapRes.ok) {
          const swapData = await swapRes.json();
          swappedImageUrl = swapData.swap_url || null;
          templateUrl = swapData.template_url || null;
          swapError = swapData.error || null;
          swapDebug = swapData.debug || null;
        } else {
          swapError = `face-swap HTTP ${swapRes.status}`;
        }
      } catch (e) {
        console.error("[joseon-portrait] face-swap call failed:", e);
        swapError = e instanceof Error ? e.message : "face-swap 네트워크 오류";
      }
    }

    return NextResponse.json({
      result: {
        type_id: typeId,
        image_type: imgType,
        gender: parsed.gender || null,
        is_error: isError,
        swapped_image: swappedImageUrl,
        template_url: templateUrl,
        swap_error: swapError,
        swap_debug: swapDebug,
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "조선 초상화 분석 중 오류";
    console.error("[joseon-portrait] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
