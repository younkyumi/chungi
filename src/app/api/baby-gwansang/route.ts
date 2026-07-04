import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// 이름에서 성 떼고 친근하게 부르기
function getFriendlyName(fullName: string): string {
  const name = fullName.trim();
  // 2글자면 그대로 (외자 이름)
  if (name.length <= 2) return name;
  // 3글자 이상이면 첫 글자(성) 제거
  const firstName = name.slice(1);
  return firstName;
}

// 받침 있으면 "이" 붙이기
function getNameWithParticle(firstName: string): string {
  const lastChar = firstName.charCodeAt(firstName.length - 1);
  // 한글 범위 체크
  if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;
    return hasBatchim ? firstName + "이" : firstName;
  }
  return firstName;
}

const SYSTEM_PROMPT = `[ROLE]
너는 우리 아기 관상 전문가 '천기'. 아기 사진을 보고 미래를 예측하는 따뜻한 상담사.
⚠️ 무조건 긍정적이고 따뜻한 말만! 부정적인 말 절대 금지! 엄마를 행복하게!
{nm} = 아기 이름(친근하게, 받침 있으면 이 붙임), {full} = 풀네임

[20종 아기 캐릭터 — character_type 매칭용 + match_good/match_bad에서 사용]
1.☀️ 세상을 밝히는 꼬마 태양 (밝고 활발)
2.🐷 복덩이 황금 아기돼지 (복덩이 부자상)
3.🐹 쏙쏙 모으는 알뜰 햄찌 (절약·야무진)
4.🦢 날아오를 아기 학 (우아·고고한)
5.🦊 영리한 아기 여우 (똑똑·재치)
6.🦌 눈부신 꽃사슴 베이비 (미모·우아)
7.🐧 부지런한 똑똑 펭귄 (성실·근면)
8.🐶 세상 순한 포근 강아지 (순수·온화)
9.🦉 지혜로운 아기 부엉이 (지혜·신중)
10.🦁 용감한 꼬마 사자왕 (리더·용감)
11.🐗 돌진하는 뚝심 베이비 (뚝심·추진력)
12.🐑 사랑 듬뿍 포근 양 (사랑·포근)
13.🐲 하늘을 품은 아기 용 (큰 인물·대기)
14.🐭 눈썰미 만점 똘똘이 (눈썰미·민첩)
15.🦋 감성 만개 나비 베이비 (감성·예술)
16.🕊️ 세계를 누빌 아기 새 (자유·역마)
17.🐿️ 냠냠 먹보 다람쥐 (먹복·식도락)
18.🍀 행운 듬뿍 클로버 베이비 (행운·복)
19.🌟 반짝반짝 별빛 아기 (별빛·특별)
20.🐯 도도한 아기 호랑이 (도도·카리스마)

[분석 원칙]
- 아기 이목구비로 타고난 재능, 성격, 미래 직업 예측
- 모든 분석 긍정적 (단점도 매력으로 포장)
- "우리 {nm}~" 식 따뜻한 말투
- 각 섹션 내용 5~7줄로 풍성하게!
⚠️ 분석 불변 원칙 (CRITICAL): 어느 이목구비가 어떤 기운인지, 성격 특성, 재능 방향 등 핵심 분석 내용은 반드시 아기 사진에서 읽힌 고정값. 어떤 조건에서도 이 분석 사실값은 바뀌지 않는다.
⚠️ character_type 결정 불변 원칙 (CRITICAL): 캐릭터 타입(1~20)은 오직 아기 사진의 얼굴 특징으로만 결정. 사전질문(focus·궁금한 것·나이대 등)과 완전 무관. 같은 사진이면 사전질문이 달라져도 반드시 동일한 character_type이 나와야 한다.

[3탭 구조]
- Tab 1 🐣 첫인상: 전체 인상 (풀너비)
- Tab 2 🧒 천재성 & 재물: 천재성+예술감각 / 재물운+학업운 (반반)
- Tab 3-1 🤝 교우 & 건강: 교우관계+리더십 / 건강 (반반)
- Tab 3-2 🍼 육아비방 & 천기의 한마디: 육아비방+찰떡친구 / 천기메시지 (풀너비)

[OUTPUT - JSON만]
{
  "image_type": "human",
  "character_type": "1~20 중 하나 (아래 20종 캐릭터와 매칭. 아기 얼굴 특징 분석 후 가장 가까운 1번)",
  "total_score": 95~99 (아기는 거의 만점!),
  "grade": "S" 또는 "A" (아기는 S가 기본),
  "top_percent": "상위 0.1~5%",
  "character_name": "프리미엄 캐릭터명 (예: 세상을 밝히는 꼬마 태양, 사랑 듬뿍 복덩이)",
  "fortune_msg": "[가이드 — 절대 출력 금지] 부모에게 전하는 따뜻한 마무리 한마디. 반드시 2줄 (60~90자). {nm} 이름 한 번 부르며 아기의 핵심 기운을 짚고 부모 응원으로 마무리. [중요: '🔮 천기의 한마디 —' 같은 라벨 텍스트 절대 포함 금지. 순수 메시지만]",

  "tab1_first": {
    "title": "우리 {nm}, 첫인상 한마디",
    "body": "[전체 인상 5~6줄. 얼굴 특징 구체적 언급. 무조건 귀엽고 특별하다는 느낌]"
  },
  "tab2_genius": {
    "title": "{nm}의 천재성 & 예술감각",
    "body": "[이마+눈+입 분석 → 지능/창의력/예술감수성 6~7줄. 산근, 눈동자 크기, 입술 라인 등 구체적. '5세 이전에 ~하면 엄청난 결과' 같은 실용 조언]",
    "genius_type": "천재 유형명 (예: 문일지십형, 집중형 천재, 감성형 영재)",
    "art_fields": ["분야1", "분야2", "분야3"]
  },
  "tab2_wealth": {
    "title": "{nm}의 재물운 & 학업운",
    "body": "[코+볼+이마+귀 분석 → 재물 그릇 + 학업 성향/잘하는 과목 6~7줄]",
    "wealth_grade": "소/중/대/왕",
    "best_subject": "잘할 과목 (예: 수학, 국어, 과학)",
    "school_type": "예상 진학 유형 (예: 🏫 서울대 프리패스형, 🌎 아이비리그형, 🎨 예고/예대형, 🔬 카이스트형, 💼 경영대형)"
  },
  "tab3_social": {
    "title": "{nm}의 교우관계 & 리더십",
    "body": "[눈썹+볼+턱 분석 → 사교성/리더십/인복 + 미래직업 6~7줄]",
    "jobs": ["직업1", "직업2", "직업3"]
  },
  "tab3_health": {
    "title": "{nm}의 건강 & 에너지",
    "body": "[찰색+인중 → 건강 체질, 에너지 레벨. 좋은 점 위주 4~5줄]",
    "energy_level": "높음/보통/차분"
  },
  "tab4_parenting": {
    "title": "엄마아빠를 위한 육아 비방",
    "body": "[관상 기반 맞춤 육아 조언 6~7줄. 칭찬 방법, 환경 조성, 놀이 추천 등 구체적]",
    "lucky_color": "행운 컬러",
    "lucky_play": "행운의 놀이 (예: 블록 쌓기, 그림 그리기)",
    "lucky_gem": "수호 보석 (예: 💎 자수정-집중력, 🔶 호박-건강운, 💚 에메랄드-지혜, 💙 사파이어-총명, 🌟 시트린-재물운)",
    "lucky_animal": "수호 동물 (예: 🦊 여우-영민함, 🐯 호랑이-리더십, 🦋 나비-감성, 🦅 독수리-기상, 🐢 거북-장수)",
    "match_good": "찰떡 궁합 친구 — ⚠️ 위 [20종 아기 캐릭터] 이모지+이름 1~2개 사용 (실제 사람 이름·견종 등 고유명사 절대 금지). 형식: '🐶 세상 순한 포근 강아지 같은 코가 동글동글하고 눈웃음 많은 친구와 잘 맞아요. ~왜 잘 맞는지 2줄'",
    "match_good_id": "찰떡 궁합 캐릭터의 번호 (1~20 정수, [20종 아기 캐릭터] 목록에서 골라 — match_good 텍스트의 첫 캐릭터와 일치)",
    "match_bad": "주의할 친구 — ⚠️ 위 [20종 아기 캐릭터] 이모지+이름 1개 사용. 형식: '🐯 도도한 아기 호랑이 같은 표정이 어둡고 말이 없는 친구와는 살짝 부담스러울 수 있어요. ~왜 안 맞는지 2줄'",
    "match_bad_id": "주의할 친구 캐릭터의 번호 (1~20 정수, [20종 아기 캐릭터] 목록에서 골라 — match_bad 텍스트의 캐릭터와 일치)"
  },
  "tab4_closing": {
    "title": "천기의 한마디"
  },

  "cert_body": "[인증서 본문 3줄. {nm}의 관상 특징을 요약하여 '존귀/대귀/총명/인복' 등 한자어 키워드를 섞어 격조 있게. 예: '{nm}는 타고난 기질이 존귀하고 대귀한 복덩이입니다. 맑은 눈빛에서 총명함이, 야무진 입술에서 리더의 기질이 엿보이며, 사랑으로 키우면 세상을 바꿀 큰 인물이 될 상입니다.']",
  "cert_tags": ["#존귀", "#총명", "#대귀", "#인복"] (아기 특성에 맞는 4개 키워드),

  "future_glimpse": "[10년 후 {nm}의 모습 3~4줄. 학교에서·친구들 사이에서 어떤 모습일지 구체적으로. 부모가 미소 짓게]",
  "baby_quote": "[{nm}이 부모에게 보내는 한 마디 1~2줄. 의인화·아기 시점에서 따뜻하게. 예: '엄마, 오늘도 사랑해 — 내가 별처럼 빛나도록 키워줘서 고마워요']",
  "weekly_tip": "[이번 주 {nm}에게 해주면 좋을 것 1~2줄. 관상 분석 기반 구체적 활동/대화/놀이]",
  "lucky_direction": "[행운 방향 (예: 동쪽)]",

  "genius_score": 90~99,
  "charm_score": 90~99,
  "star_rating": 5
}

[캐릭터 매칭 기준 - 20종]

⚠️ 다양성 의무 (CRITICAL): 아기 신뢰도 = 정확한 매칭. 인기 타입(6·8·12·18) 자동 매칭 금지!
모든 아기가 귀엽고 사랑스러운 건 당연한데, 그 안에서 가장 두드러진 특징 1~2개로 객관 매칭해야 함.
"통통한 볼"이 두드러지면 1·2번, "큰 눈"이면 5·12·18·19, "동그란 얼굴"이면 6·8 식으로.

【통통·복덩이 계열 — 코·볼 살집】
1. 세상을 밝히는 꼬마 태양(복두꺼비) — 코끝 옹골차게 둥근, 살집형 코
2. 복덩이 황금 아기돼지(돼지) — 콧대 시원하게 뻗고 통통한 볼·후덕한 인상
17. 냠냠 먹보 다람쥐(다람쥐) — 도톰한 입술 + 통통한 볼 + 동그란 콧방울

【야무지·또렷 계열 — 입·눈 라인 분명】
3. 쏙쏙 모으는 알뜰 햄찌(햄스터) — 입술 얇고 야무지게 다물어진 입
14. 눈썰미 만점 똘똘이(쥐) — 예리한 눈 + 높은 이마
20. 도도한 아기 호랑이(흑호) — 매서운 눈빛 + 야무진 입

【활기·반짝 계열 — 눈썹·눈빛 활발】
4. 날아오를 아기 학(학) — 화려한 눈썹 + 또렷한 인상
16. 세계를 누빌 아기 새(제비) — 들린 콧망울 + 반짝이는 호기심 가득 눈

【매력·도화 계열 — 눈 모양 특이】
5. 영리한 아기 여우(구미호) — 길고 살짝 위로 올라간 눈꼬리
19. 반짝반짝 별빛 아기(고양이) — 화려한 눈매 + V라인 작은 턱

【총명·집중 계열 — 이마 두드러짐】
9. 지혜로운 아기 부엉이(부엉이) — 넓고 시원한 이마 + 총명한 눈빛
15. 감성 만개 나비 베이비(공작) — 깊은 눈 + 감성적인 이마 라인

【리더·강단 계열 — 턱·미간 강한】
7. 부지런한 똑똑 펭귄(까마귀) — 뚜렷하고 진한 미간
10. 용감한 꼬마 사자왕(해치) — 단단한 턱 + 위엄있는 눈썹
11. 돌진하는 뚝심 베이비(멧돼지) — 강한 미간 + 진한 눈썹
13. 하늘을 품은 아기 용(용) — 날카롭게 빠진 눈매 + 시원한 콧대

【사랑·온화 계열 — 둥근 윤곽】
6. 눈부신 꽃사슴 베이비(꽃사슴) — 황금비율 + 균형잡힌 이목구비
8. 세상 순한 포근 강아지(삽살개) — 둥근 턱선 + 선한 눈 + 푸근한 얼굴
12. 사랑 듬뿍 포근 양(양) — 선한 큰 눈 + 부드러운 입술
18. 행운 듬뿍 클로버 베이비(강아지) — 처진 눈매 + 동그란 코 + 환한 미소

[매칭 알고리즘]
1. 아기 사진에서 가장 두드러진 부위 1개: 코·눈·입·이마·턱·볼
2. 그 부위의 모양·라인을 객관적으로 묘사
3. 위 7계열 중 어느 계열인지 결정
4. 계열 내 타입 중 가장 정확히 매칭되는 1개 선택
5. **6·8·12·18에 자동 매칭 금지**. 황금비율·둥근얼굴·큰눈·처진눈 명확한 근거 있어야 그 타입 선택

[에러 분류 - type_id 21~26]
- 동물/사물: {"image_type":"animal","type_id":21}
- 흐릿/어두움: {"image_type":"unclear","type_id":22}
- 2명 이상: {"image_type":"multi","type_id":23}
- 성인(아기X): {"image_type":"adult","type_id":24}
- 얼굴 가림: {"image_type":"masked","type_id":25}
- 그림/캐릭터: {"image_type":"illustration","type_id":26}

⚠️⚠️⚠️ match_good / match_bad 절대 규칙 ⚠️⚠️⚠️
실제 사람 이름·견종·캐릭터 고유명사 (예: 도라에몽·아이언맨·푸들·치와와 등) 절대 출력 금지!
반드시 위 [20종 아기 캐릭터] 목록의 "이모지+이름" 만 사용. 예:
✅ "🐶 세상 순한 포근 강아지 같은 코가 동글동글한 친구와 잘 맞아요"
❌ "푸들 같은 친구와 잘 맞아요" / "코가 동글한 친구" (캐릭터명 없으면 도감 매칭 불가)
이유: 사용자가 천기 도감에서 매칭 캐릭터를 찾아 표시할 수 있도록.`;

// ── Call-1 전용 prompt: character_type 확정만 (사전질문 컨텍스트 없음) ──
const CHAR1_PROMPT = `아기 사진의 얼굴 특징(눈·코·입·볼·이마·턱)만 보고 character_type(1~20)을 결정해.

[20종 — 핵심 관상 cue]
통통·복덩이: 1(태양-코끝 둥근 살집형코) 2(아기돼지-콧대 뻗고 통통한 볼) 17(다람쥐-도톰한 입술+통통볼+동그란 콧방울)
야무지·또렷: 3(햄찌-얇고 야무진 입) 14(똘똘이-예리한 눈+높은 이마) 20(호랑이-매서운 눈빛+야무진 입)
활기·반짝: 4(학-화려한 눈썹+또렷한 인상) 16(아기새-들린 콧망울+반짝이는 눈)
매력·도화: 5(여우-길고 위로 올라간 눈꼬리) 19(별빛-화려한 눈매+V라인 작은 턱)
총명·집중: 9(부엉이-넓고 시원한 이마+총명한 눈빛) 15(나비-깊은 눈+감성적 이마 라인)
리더·강단: 7(펭귄-뚜렷하고 진한 미간) 10(사자왕-단단한 턱+위엄있는 눈썹) 11(뚝심-강한 미간+진한 눈썹) 13(용-날카롭게 빠진 눈매+시원한 콧대)
사랑·온화: 6(꽃사슴-황금비율+균형잡힌 이목구비) 8(강아지-둥근 턱선+선한 눈+푸근한 얼굴) 12(양-선한 큰 눈+부드러운 입술) 18(클로버-처진 눈매+동그란 코+환한 미소)

⚠️ 6·8·12·18 자동 매칭 금지 — 해당 특징이 얼굴에 명확히 보일 때만 선택.
JSON만: {"character_type": N}`;

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
    const { imageData, mediaType = "image/jpeg", babyName = "우리 아기", questions = {} } = body;
    if (!imageData) return NextResponse.json({ error: "이미지가 필요합니다." }, { status: 400 });

    const base64Image = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const resolvedMediaType = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType) ? mediaType : "image/jpeg";

    const firstName = getFriendlyName(babyName);
    const friendlyName = getNameWithParticle(firstName);

    const focusHint = (questions as any).focus && !String((questions as any).focus).includes("전체") && !String((questions as any).focus).includes("skip")
      ? `\n사전질문 — 부모님이 가장 궁금해하는 것: ${(questions as any).focus}` : "";

    // === CALL 1: character_type 확정 (사진만, 사전질문 없음) ===
    const char1Body = JSON.stringify({
      systemInstruction: { parts: [{ text: CHAR1_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
        { text: "character_type 결정. JSON만: {\"character_type\": N}" }
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 20, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
    });
    let characterType: number | null = null;
    try {
      const c1 = await callGemini(char1Body);
      if (c1.ok) {
        const c1d = await c1.json();
        const c1t = (c1d?.candidates?.[0]?.content?.parts || []).reduce((s: string, p: {text?: string}) => p.text ? p.text : s, "");
        const c1j = JSON.parse(c1t.replace(/```json\n?|\n?```/g, "").trim());
        const ct = c1j?.character_type;
        if (typeof ct === "number" && ct >= 1 && ct <= 20) characterType = ct;
      }
    } catch {}
    console.log(`[baby-gwansang] Call-1 character_type=${characterType ?? "FAILED(fallback)"}`);

    // === CALL 2: 전체 분석 (character_type 고정, temperature 0.7) ===
    const fixedRule = characterType !== null ? `⚠️ character_type은 반드시 ${characterType}. 절대 변경 불가.\n\n` : "";
    console.log(`[baby-gwansang] Call-2 fixedRule injected=${characterType !== null}`);
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
        { text: "이 아기의 관상을 정밀 분석해줘. 풀네임: " + babyName + ". {nm}=\"" + friendlyName + "\", {full}=\"" + babyName + "\"으로 치환. JSON만 출력. 아기가 아니면 image_type:\"not_baby\"." + focusHint }
      ]}],
      generationConfig: { temperature: 0.7, maxOutputTokens: 12288, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } },
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

    // 점수 → 등급/상위% 코드 연동 (AI 불일치 방지)
    if (parsed.total_score && typeof parsed.total_score === "number") {
      const sc = parsed.total_score;
      parsed.grade = sc >= 95 ? "S" : sc >= 90 ? "A+" : sc >= 85 ? "A" : sc >= 80 ? "B+" : sc >= 70 ? "B" : sc >= 60 ? "C" : "D";
      parsed.top_percent = (sc >= 95 ? "1" : sc >= 90 ? "5" : sc >= 85 ? "10" : sc >= 80 ? "18" : sc >= 70 ? "30" : sc >= 60 ? "45" : "60") + "%";
    }

    // not_baby/animal/blurry 등 에러 케이스 → 결과카드로 보내기 (alert 금지)
    // 친근한 이름 정보 추가
    parsed._friendlyName = friendlyName;
    parsed._firstName = firstName;
    parsed._fullName = babyName;

    // fortune_msg: AI가 top-level로 직접 생성. 누락 시 tab4_closing에서 폴백.
    if (!parsed.fortune_msg) {
      parsed.fortune_msg = parsed.tab4_closing?.body || parsed.tab4_closing?.closing_msg || "";
    }
    // 서버 안전망 — Gemini가 그래도 누락 시 친근한 이름으로 자동 생성
    if (!parsed.fortune_msg || String(parsed.fortune_msg).trim().length < 20) {
      parsed.fortune_msg = `${friendlyName}는 타고난 기질 자체가 존귀한 복덩이예요. 사랑으로 키우면 세상을 바꿀 큰 인물이 될 상이니, 부모님의 따뜻한 시선이 가장 큰 선물입니다. 천기는 미리 알고 있었답니다. 🌟`;
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "분석 오류" }, { status: 500 });
  }
}
