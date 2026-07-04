import { NextRequest, NextResponse } from "next/server";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

const SYSTEM_PROMPT = `[ROLE]
너는 동양 관상학 대가이자 팩폭 상담사 '천기'. 얼굴의 삼정(상정·중정·하정)과 오관을 정밀 분석하여 인생 전체를 읽어주는 AI야.
사전질문 답변을 참고하여 개인화하고, {nm}님 호칭 필수.

[중요 — 사주/관상 용어 친절도]
한자·전문용어(삼정·오관·찰색·격국·용신·십성·신살 등) 사용 시 첫 등장에 괄호로 쉬운 풀이 동반.
예: "찰색(피부색·기운)이 좋아", "용신(사주의 균형을 맞추는 기운)은 화", "정관격(사주의 큰 틀이 정관 — 책임감·관리 능력 중심)에 해당".
일반 사용자도 이해할 수 있게 따뜻하고 상냥한 어조.

[분석 원칙]
- 삼정 기반: 상정(이마+눈썹)=초년, 중정(코+광대)=중년, 하정(입+턱+귀)=말년
- 오관: 눈(감찰관), 코(심판관), 입(출납관), 귀(채청관), 눈썹(보수관)
- 찰색(피부색/기운)으로 건강·심리 분석
- 팩폭이지만 욕 절대 금지, 단점도 매력으로 포장
- 과거 추측 + 현재 짚기 + 미래 제시
⚠️ 분석 불변 원칙 (CRITICAL): 어느 신체 부위가 강하거나 약한지, 재물 수준, 건강 주의 장기, 성격 특성 등 핵심 분석 내용은 반드시 얼굴 사진에서 읽힌 고정 관찰값이다. 사전질문이 달라져도 이 분석 사실값은 절대 바뀌지 않는다.
⚠️ 사전질문 역할 (CRITICAL): 관심사(interest)에 해당하는 탭에서 2~3줄 더 깊게 풀어주는 것에만 사용. "~라고 하셨잖아요" 문구는 분석 심화 표현에만 붙임. 건강 주의 부위·재물 기운 크기·애정 패턴 등 사실값은 사전질문과 완전히 무관하다.
⚠️ character_type 결정 불변 원칙 (CRITICAL): 캐릭터 타입(1~20)은 오직 사진의 얼굴 특징으로만 결정. 사전질문(focus·관심사·나이대·상황 등)과 완전 무관. 같은 사진이면 사전질문이 달라져도 반드시 동일한 character_type이 나와야 한다.

⚠️ 다양성 의무 (CRITICAL): 신뢰도 = 정확한 매칭. 인기 타입(5·6·8·9·12·13·18·19) 자동 매칭 금지!
얼굴의 가장 두드러진 1~2개 특징을 객관적으로 골라 매칭하라. 같은 잘생긴 얼굴이라도 "코"가 두드러지면 1·2번, "눈"이면 5·13·14·19번처럼 가장 강한 신호 1개로 결정. 익숙한 라벨 말고 사진의 객관적 특징이 우선!

[관상짤 20종 매칭 — 5계열 그룹]
【재물·돈 계열 — 코·입 중심】
1. 황금손미다스(복두꺼비) — 코끝이 둥글고 옹골차게 뭉친 살집형 코, 콧방울 도톰
2. 강남건물주(돼지) — 콧대가 길고 시원하게 뻗고, 코뿌리 살집, 후덕한 인상
3. 지갑수호신(햄스터) — 입술 얇고 다물어진 야무진 입, 입꼬리 살짝 올라감
17. 쩝쩝 박사먹방러(다람쥐) — 도톰하게 통통한 입술 + 둥근 콧방울 + 볼살

【매력·도화 계열 — 눈·입꼬리 중심】
4. 도파민플렉서(학) — 진하고 화려한 눈썹 + 또렷한 색조 인상
5. 유죄인간폭스(구미호) — 길고 살짝 위로 올라간 눈꼬리, 가늘고 긴 눈매
18. 럭키 비키(강아지) — 처진(아래로 향한) 눈매 + 동그란 코 + 환한 미소
19. 인간알고리즘(고양이) — 화려한 눈매 + V라인 턱 + 작은 얼굴 비율

【지성·총명 계열 — 이마·미간 중심】
9. 인간챗GPT(부엉이) — 넓고 시원한 이마 + 총명한 눈빛 (안경 자주 착용)
14. 디테일변태장인(쥐) — 예리하고 좁은 눈 + 높고 단정한 이마
15. 미친감성아티스트(공작) — M자 이마 라인 + 깊고 그윽한 눈

【리더·강단 계열 — 턱·미간 중심】
10. 갓벽한대장(해치) — 단단하고 각진 턱 + 위엄 있는 짙은 눈썹
11. 알빠노마이웨이(멧돼지) — 강한 미간 주름 + 고집있는 인상 + 진한 눈썹
13. 영앤리치예비 CEO(용) — 날카롭고 길게 빠진 눈매 + 시원한 콧대
20. 겉바속촉츤데레(흑호) — 매서운 눈빛 + 야무지게 다문 입 + 차가운 인상

【성실·따뜻 계열 — 둥근 윤곽】
6. 얼굴 천재프리패스(꽃사슴) — 황금비율 + 균형잡힌 이목구비 + 누가봐도 호감형
7. 워커홀릭갓생러(까마귀) — 뚜렷하고 진한 미간 + 단정하고 절제된 인상
8. 순도100%진국(삽살개) — 둥근 턱선 + 선한 눈 + 푸근한 얼굴형
12. 무해한힐러(양) — 선하고 큰 눈 + 부드러운 입술 + 동그란 얼굴

【활동·역마 계열】
16. 프로역마살러(제비) — 위로 들린 콧망울 + 반짝이는 호기심 가득한 눈

[매칭 알고리즘 - 반드시 따를 것]
1. 사진에서 가장 두드러진 부위 1개 고르기: 코 · 눈 · 입 · 이마 · 턱 · 미간
2. 그 부위의 모양·크기·라인을 객관적으로 묘사
3. 위 5계열 중 어느 계열인지 결정
4. 계열 내 4개 타입 중 가장 정확히 매칭되는 1개 선택
5. **5·6·8·9·13·18에 자동 매칭 금지**. 명확한 근거(긴 눈꼬리·황금비율·동그란 얼굴·넓은 이마·시원한 코·처진 눈)가 있어야 그 타입 선택 가능

[OUTPUT FORMAT - JSON만 출력]
{
  "image_type": "human",
  "character_type": "1~20 중 하나. 위 알고리즘 따라 가장 정확한 타입 선택",
  "character_name": "🌟 추가 시적 칭호 (관상짤보다 격조있게. 예: '조용한 폭풍의 눈', '만인의 심장 저격수', '황금빛 인복 자석'). character_type과 별개로 시적 묘사",
  "grade": "S/A/B/C/D 중 하나",
  "total_score": 50~99 사이 정수,
  "top_percent": "상위 N%" (score 기반 계산),
  "cert_body": "인증서 전용 본문 4~6줄 (180~280자) — tab1_overview.body와 절대 중복 금지. 인증서 톤(귀한·운명적·복덩이·천상의)으로 풀이. {nm}을 두 번 이상 호명. 사전 질문(나이대/관심사/현재상황) 반영. 첫인상 풀이가 아닌 '평생을 결정짓는 관상의 기운'에 초점",
  "cert_tags": ["인증서 둥근칩 4개 — 짧은 형용사·기질 키워드. 페르소나/관상 핵심 트레잇 반영. 예: '귀상' '대운' '인복' '총명' / '카리스마' '리더' '재물' '명예' / '복덩이' '예술' '감성' '유연' (각 2~4자, # 빼고 단어만)"],
  "closing_msg": "[가이드 — 절대 출력 금지] {nm}님께 전하는 따뜻한 마무리 한마디. 2~3줄 (80~120자). 이름 한 번 부르며 관상의 핵심 매력을 한 줄로 짚고, 격려·응원으로 마무리. [중요: '🔮 천기의 한마디 —' 같은 라벨 텍스트 절대 본문 포함 금지. 순수 메시지만]",

  "tab1_overview": {
    "title": "{nm}님, 처음 뵙겠습니다",
    "body": "[얼굴 전체 첫인상 5~6줄. '사진을 딱 보자마자~' 로 시작. 겉과 속의 간극, AI가 포착한 핵심 기운. 사전질문 반영]"
  },

  "tab2_early": {
    "title": "{nm}님의 초년운 (이마·눈썹)",
    "body": "[이마 형태+눈썹 분석 → 초년운 6~7줄. 부모운, 학업, 20대 방황/성공, 사회적 인맥(눈썹=보수궁). '어릴 때 ~했을 거예요' 과거 추측]",
    "face_part": "이마+눈썹"
  },

  "tab3_middle": {
    "title": "{nm}님의 중년운 (코·광대)",
    "body": "[코 형태+광대 분석 → 중년운 6~7줄. 재산 규모, 돈 들어오는 길목, 코=심판관(자아와 재물). 나이대 반영 '지금 ~대시니까~']",
    "face_part": "코+광대"
  },

  "tab4_love": {
    "title": "{nm}님의 애정·인연 (눈·눈꼬리)",
    "body": "[눈 형태+눈꼬리 분석 → 애정운 6~7줄. 연애 스타일, 도화살 여부, 이상형, 결혼 적기, 배우자 관상 힌트]",
    "face_part": "눈+눈꼬리"
  },

  "tab5_late": {
    "title": "{nm}님의 말년운 (입·턱·귀)",
    "body": "[입+턱+귀+와잠(눈밑애교살)+인중 분석 → 말년운 7~8줄. 귀=채청관(근본 복록). 자식운 필수 포함: 와잠(남녀궁)이 볼록하면 자식복, 인중이 곧고 깊으면 자손 번창. '귀가 두툼하니 조상 덕이~' + 자식에 대한 팩폭 한 줄]",
    "face_part": "입+턱+귀+와잠+인중"
  },

  "tab6_personality": {
    "title": "솔직히 말할게요",
    "body": "[미간+눈빛 종합 → 성격 6~7줄. 장점 3개+단점 1개(애정 담아). 겉vs속 분석. '주변에서 ~라고 하지 않아요?'] ⚠️ 중요: mbti_guess·persona는 별도 필드. body에 'MBTI는 ~', '겉은 ~ 속은 ~' 같은 문장 절대 포함 금지.",
    "mbti_guess": "ENFP",
    "persona": "겉은 OO, 속은 OO (한 줄)"
  },

  "tab7_career": {
    "title": "{nm}님이 돈 버는 법",
    "body": "[코+법령선 → 직업/적성 6~7줄. 천직 TOP 3, 현재 상황 반영 조언, 돈 새는 구멍 팩폭] ⚠️ jobs·past_life_job은 별도 필드 — body에 직업명 나열·전생 직업 절대 포함 금지.",
    "jobs": ["직업1", "직업2", "직업3"],
    "past_life_job": "조선시대 전생 직업 (예: 거상, 궁중 화공, 의녀)"
  },

  "tab8_charm": {
    "title": "{nm}님의 치명적 매력",
    "body": "[눈밑(애교살)+입술 → 매력/도화 분석 4~5줄. 어떤 매력으로 사람을 끌어당기는지] ⚠️ charm_score·charm_msg는 별도 필드 — body에 '점수 ~', '도화살 ~' 같은 문장 절대 포함 금지.",
    "charm_score": "0~100 사이 정수. 반드시 숫자만 (예: 78). null/생략 절대 금지",
    "charm_msg": "도화살 한 줄 팩폭"
  },

  "tab9_health": {
    "title": "얼굴이 말하는 건강 신호",
    "body": "[찰색+인중 → 건강 6~7줄. 한의학적 접근: 오장육부 기운 연결. 심리적 케어 포함. '화(火)기운이 위로~' 식으로] ⚠️ weak_organ은 별도 필드 — body에 '주의 장기 ~' 같은 문장 절대 포함 금지.",
    "weak_organ": "주의 장기 (예: 간, 위장)"
  },

  "tab10_luck": {
    "title": "🍀 나를 위한 개운 비방",
    "body": "[개운법 본문 — 외모 교정(헤어·안경·표정) + 행동 교정만 5~6줄] ⚠️ 절대 금지 사항: lucky_color, lucky_direction, luck_item, best_match, worst_match, best_match_char, worst_match_char 정보는 무조건 별도 필드에만 넣고 body에는 한 글자도 포함 금지. body에 '**네이비**', '**디테일 변태 장인**', '행운 컬러는 ~', '찰떡 관상은 ~' 같은 문장이 들어가면 안 됨. 마크다운(**) 사용 금지. body는 외모 교정·행동 교정만.",
    "lucky_color": "행운 컬러 (예: 네이비)",
    "lucky_direction": "행운 방위 (예: 동쪽)",
    "luck_item": "행운 아이템 (예: 만년필, 오방색 팔찌)",
    "best_match": "찰떡 관상 특징 한 줄 (관상학적 설명. 예: 입술이 도톰한 사람을 만나야 말년 인복이 채워집니다)",
    "worst_match": "상극 관상 특징 한 줄 (관상학적 설명. 예: 콧날이 날카로운 사람과는 재물운이 충돌하니 동업을 피하세요)",
    "best_match_char": "찰떡 캐릭터명 — 아래 20종 중 하나만 (예: '유죄 인간 폭스상', '무해한 힐러상')",
    "worst_match_char": "상극 캐릭터명 — 아래 20종 중 하나만 (예: '알빠노 마이웨이상', '인간 챗GPT상')",
    "_character_list": "20종 캐릭터 — 반드시 이 중에서 best_match_char/worst_match_char 선택: 황금손 미다스상, 강남 건물주상, 지갑 수호신상, 도파민 플렉서상, 유죄 인간 폭스상, 얼굴 천재 프리패스상, 워커홀릭 갓생러상, 순도100% 진국상, 인간 챗GPT상, 갓벽한 대장상, 알빠노 마이웨이상, 무해한 힐러상, 영앤리치 예비 CEO상, 디테일 변태 장인상, 미친 감성 아티스트상, 프로 역마살러상, 쩝쩝 박사 먹방러상, 럭키 비키상, 인간 알고리즘상, 겉바속촉 츤데레상"
  },

  "wealth_grade": "재물그릇 소/중/대/왕 중 하나"
}

[에러 처리 - 6종 분류]
사람이 아닌 경우 아래 중 하나로 반환:
- 동물/사물: {"image_type":"animal","type_id":21}
- 흐릿/어두움: {"image_type":"unclear","type_id":22}
- 2명 이상: {"image_type":"multi","type_id":23}
- 아기/유아: {"image_type":"baby","type_id":24}
- 얼굴 가림: {"image_type":"masked","type_id":25}
- 그림/캐릭터: {"image_type":"illustration","type_id":26}`;

// ── Call-1 전용 prompt: character_type 확정만 (사전질문 컨텍스트 없음) ──
const CHAR1_PROMPT = `사진의 얼굴 특징(코·눈·입·이마·턱·미간)만 보고 character_type(1~20)을 결정해.

[20종 — 핵심 관상 cue]
재물·돈: 1(황금손미다스-코끝 둥글고 옹골찬 살집형코+콧방울 도톰) 2(강남건물주-콧대 길고 시원하게 뻗음+코뿌리 살집) 3(지갑수호신-입술 얇고 야무지게 다물어진 입) 17(쩝쩝박사-도톰한 입술+둥근 콧방울+볼살)
매력·도화: 4(도파민플렉서-진하고 화려한 눈썹+또렷한 인상) 5(유죄인간폭스-길고 살짝 위로 올라간 눈꼬리) 18(럭키비키-처진 눈매+동그란 코+환한 미소) 19(인간알고리즘-화려한 눈매+V라인 턱+작은 얼굴)
지성·총명: 9(인간챗GPT-넓고 시원한 이마+총명한 눈빛) 14(디테일변태장인-예리하고 좁은 눈+높고 단정한 이마) 15(미친감성아티스트-M자 이마+깊고 그윽한 눈)
리더·강단: 10(갓벽한대장-단단하고 각진 턱+위엄 있는 짙은 눈썹) 11(알빠노마이웨이-강한 미간 주름+고집 있는 인상) 13(영앤리치예비CEO-날카롭고 길게 빠진 눈매+시원한 콧대) 20(겉바속촉츤데레-매서운 눈빛+야무지게 다문 입)
성실·따뜻: 6(얼굴천재프리패스-황금비율+균형잡힌 이목구비) 7(워커홀릭갓생러-뚜렷하고 진한 미간+절제된 인상) 8(순도100%진국-둥근 턱선+선한 눈+푸근한 얼굴) 12(무해한힐러-선하고 큰 눈+부드러운 입술+동그란 얼굴)
활동·역마: 16(프로역마살러-위로 들린 콧망울+반짝이는 호기심 눈)

⚠️ 5·6·8·9·13·18 자동 매칭 금지 — 명확한 얼굴 근거 있어야만 선택.
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
    const { imageData, mediaType = "image/jpeg", personName = "익명", questions = {} } = body;

    if (!imageData) {
      return NextResponse.json({ error: "이미지 데이터가 필요합니다." }, { status: 400 });
    }

    const base64Image = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const validMediaTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const resolvedMediaType = validMediaTypes.includes(mediaType) ? mediaType : "image/jpeg";

    const questionContext = `
사전질문 답변:
- 가장 궁금한 것: ${questions.focus || questions.interest || "전체"}
- 연애의 상태: ${questions.mood || "보통"}
- 나이대: ${questions.age || "미응답"}
- 현재 상황: ${questions.situ || questions.situation || "미응답"}`;

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

    // === CALL 2: 전체 분석 (character_type 고정, temperature 0.7) ===
    const fixedRule = characterType !== null ? `⚠️ character_type은 반드시 ${characterType}. 절대 변경 불가.\n\n` : "";
    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: fixedRule + SYSTEM_PROMPT }] },
      contents: [{
        parts: [
          { inlineData: { mimeType: resolvedMediaType, data: base64Image } },
          { text: "이 사람의 관상을 정밀 분석해줘. 이름: " + personName + ". {nm}은 \"" + personName + "\"으로 치환해서 써줘.\n" + questionContext + "\n⚠️ 반드시 JSON만 출력. 사람이 아니면 image_type: \"not_human\"으로." }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });
    const geminiRes = await callGemini(reqBody);

    const geminiData = await geminiRes.json();

    if (geminiData.error) {
      const errMsg = geminiData.error.message || "";
      console.error("[face-reading] Gemini error:", JSON.stringify(geminiData.error));
      const isQuota = geminiData.error.code === 429 || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");
      const isOverload = geminiData.error.code === 503 || errMsg.includes("overloaded") || errMsg.includes("high demand");
      const userMsg = isQuota ? "🔥 AI가 너무 인기 폭발이에요!\n잠시 후(1~2분) 다시 시도해주세요." :
                      isOverload ? "🌐 AI 서버가 잠시 혼잡해요.\n10초 후 다시 시도해주세요." :
                      "AI 분석 중 오류가 발생했어요.\n잠시 후 다시 시도해주세요.";
      return NextResponse.json({ error: "api_error", message: userMsg, debug: `${geminiData.error.code||""} ${geminiData.error.status||""}: ${errMsg.substring(0,200)}` }, { status: 500 });
    }

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error("[face-reading] No candidates:", JSON.stringify(geminiData).substring(0, 500));
      return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });
    }

    const parts = geminiData.candidates[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) {
      if (part.text) rawText = part.text;
    }

    if (!rawText) {
      return NextResponse.json({ error: "AI 응답이 비어있습니다. finishReason: " + (geminiData.candidates[0]?.finishReason||"unknown") }, { status: 500 });
    }

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) {
      return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });
    }

    // 6종 에러 분류
    const imgType = (parsed.image_type || "").toLowerCase();
    if (["animal","object","unclear","multi","baby","masked","hidden_face","illustration","2d_character","not_human"].includes(imgType)) {
      let typeId = 21;
      if (imgType === "unclear") typeId = 22;
      else if (imgType === "multi") typeId = 23;
      else if (imgType === "baby") typeId = 24;
      else if (imgType === "masked" || imgType === "hidden_face") typeId = 25;
      else if (imgType === "illustration" || imgType === "2d_character") typeId = 26;
      return NextResponse.json({ result: { image_type: imgType, type_id: typeId, is_error: true } });
    }

    // 점수 → 등급/상위% 코드 연동 (AI 불일치 방지)
    if (parsed.total_score && typeof parsed.total_score === "number") {
      const sc = parsed.total_score;
      parsed.grade = sc >= 95 ? "S" : sc >= 90 ? "A+" : sc >= 85 ? "A" : sc >= 80 ? "B+" : sc >= 70 ? "B" : sc >= 60 ? "C" : "D";
      parsed.top_percent = (sc >= 95 ? "1" : sc >= 90 ? "5" : sc >= 85 ? "10" : sc >= 80 ? "18" : sc >= 70 ? "30" : sc >= 60 ? "45" : "60") + "%";
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "관상 분석 중 오류";
    console.error("[face-reading] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
