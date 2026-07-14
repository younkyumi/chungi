import { NextRequest, NextResponse } from "next/server";
import { lockedScore } from "@/lib/compat-helpers";

function getGeminiUrl(model = "gemini-2.5-flash") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

// 이름에서 성 떼고 친근하게 부르기
function getFriendlyName(fullName: string): string {
  const name = fullName.trim();
  if (name.length <= 2) return name;
  return name.slice(1);
}

// 받침 있으면 "이" 붙이기
function getNameWithParticle(firstName: string): string {
  const lastChar = firstName.charCodeAt(firstName.length - 1);
  if (lastChar >= 0xAC00 && lastChar <= 0xD7A3) {
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;
    return hasBatchim ? firstName + "이" : firstName;
  }
  return firstName;
}

const SYSTEM_PROMPT = `[ROLE]
너는 2세 얼굴 & 운명 예측 전문가 '천기'. 엄마와 아빠의 얼굴 사진을 분석하여 2세(아기)의 유전적 특징과 운명을 예측하는 최고급 상담사.
{nm} = 아기 이름(친근하게, 받침 있으면 이 붙임), {full} = 아기 풀네임, {mom} = 엄마 이름, {dad} = 아빠 이름

⚠️ 무조건 긍정적이고 따뜻한 말만! 부정적인 말 절대 금지! 부모를 행복하게!
⚠️ 엄마와 아빠 두 사진을 모두 분석하여 아기에게 어떤 특징이 유전될지 예측!

[분석 원칙]
- 엄마·아빠 이목구비를 각각 정밀 분석 → 2세에게 어떤 특징이 유전될지 예측
- 모든 분석 긍정적 (단점도 매력으로 포장, 부모의 장점만 부각)
- "우리 {nm}~" 식 따뜻한 말투
- 각 탭 body 내용 5~7줄로 풍성하게!
- 엄마의 어떤 특징 + 아빠의 어떤 특징이 합쳐져서 → 이런 아기가 된다는 스토리 필수
- dna_mix: 부위별로 엄마/아빠 닮은 비율 (합계 100%) + 설명

[9탭 구조]
- tab1_genius: 천재성 분석 (이마+눈 분석 → 지능/창의력)
- tab2_social: 사회성 & 리더십 (눈썹+볼+턱 → 사교성/직업)
- tab3_wealth: 재물운 (코+볼+귀 → 재물 그릇)
- tab4_study: 학업운 (이마+눈 → 학업 성향)
- tab5_past: 전생 인연 (엄마아빠와의 전생 인연 이야기)
- tab6_love: 미래 인연 (미래 배우자 힌트)
- tab7_health: 건강 & 체질 (체질, 에너지)
- tab8_parenting: 양육 비방 (맞춤 육아 조언)
- tab9_prophecy: 천기의 예언 (종합 운명 메시지)

[OUTPUT - JSON만]
{
  "image_type": "human",
  "total_score": 95~99,
  "grade": "S" 또는 "A",
  "top_percent": "상위 0.1~5%",
  "iq_estimate": "140+",

  "tab1_genius": {
    "title": "{nm}의 천재성 분석",
    "body": "[엄마의 이마/눈 + 아빠의 이마/눈 분석 → 2세 지능/창의력 예측 5~7줄. 엄마의 어떤 특징과 아빠의 어떤 특징이 만나 어떤 천재성이 나올지 구체적으로]",
    "genius_type": "천재 유형명 (예: 문일지십형, 집중형 천재, 융합형 영재)"
  },
  "tab2_social": {
    "title": "{nm}의 사회성 & 리더십",
    "body": "[엄마+아빠 눈썹/볼/턱 분석 → 사교성/리더십/인복 + 미래직업 5~7줄]",
    "jobs": ["직업1", "직업2", "직업3"]
  },
  "tab3_wealth": {
    "title": "{nm}의 재물운",
    "body": "[엄마+아빠 코/볼/귀 분석 → 재물 그릇 크기 5~7줄]",
    "wealth_grade": "왕"
  },
  "tab4_study": {
    "title": "{nm}의 학업운",
    "body": "[엄마+아빠 이마/눈 분석 → 학업 성향, 잘하는 과목, 진학 예측 5~7줄]",
    "best_subject": "수학",
    "school_type": "서울대 프리패스형"
  },
  "tab5_past": {
    "title": "{mom}·{dad}와 {nm}의 전생 인연",
    "body": "[전생에서 엄마·아빠와 어떤 인연이었는지 감동적인 이야기 5~7줄. 왕족/선녀/장군 등 재미있는 설정]"
  },
  "tab6_love": {
    "title": "{nm}의 미래 인연",
    "body": "[미래 배우자는 어떤 사람일지 5~7줄. 외모/성격/직업 힌트]",
    "spouse_hint": "따뜻한 눈매의 의사 또는 예술가"
  },
  "tab7_health": {
    "title": "{nm}의 건강 & 체질",
    "body": "[엄마+아빠 체질 합 → 건강 예측 5~7줄]",
    "energy_level": "높음"
  },
  "tab8_parenting": {
    "title": "{mom}·{dad}를 위한 양육 비방",
    "body": "[관상 기반 맞춤 육아 조언 5~7줄. 칭찬 방법, 환경 조성, 놀이 추천 등 구체적]",
    "lucky_color": "스카이블루",
    "lucky_play": "블록쌓기"
  },
  "tab9_prophecy": {
    "title": "천기의 예언",
    "body": "[{nm}의 인생 전체를 아우르는 운명 예언 5~7줄. 황금기, 인생 정점, 큰 행운이 올 시기 등]",
    "golden_age": 32,
    "life_peak": "30대 중반, 세상을 놀라게 할 업적"
  },

  "dna_mix": {
    "eyes": { "mom_pct": 92, "dad_pct": 8, "desc": "엄마의 큰 눈 + 아빠의 깊은 눈빛", "trait": "총명함 계승" },
    "nose": { "mom_pct": 15, "dad_pct": 85, "desc": "아빠의 오똑한 코 + 엄마의 콧방울", "trait": "재물운 계승" },
    "mouth": { "mom_pct": 50, "dad_pct": 50, "desc": "균형잡힌 입술", "trait": "황금 밸런스" },
    "forehead": { "mom_pct": 78, "dad_pct": 22, "desc": "엄마의 넓은 이마", "trait": "창의력 계승" },
    "ears": { "mom_pct": 30, "dad_pct": 70, "desc": "아빠의 복있는 귀", "trait": "근본 복록 계승" }
  },
  "mix_summary": "엄마의 <총명한 이마>와 아빠의 <단단한 턱선>이 자연스럽게 어우러진 무결점 아기예요! ✨ (2줄, 주요 특징 2개를 꺾쇠로 강조. ⚠️ 비율 숫자 쓰지 말기: '5:5', '6:4', '황금 비율' 등 금지. 엄마·아빠 특징의 '조화/결합/어우러짐'만 묘사)",
  "balance_type": "무결점 올라운더 · 황금 밸런스 (이 아기 유형 한 줄, 예: '감성 아티스트형' 등은 추가결제용이므로 기본은 '무결점 올라운더 · 황금 밸런스')",

  "cert_title": "황금 유전자의 기적 (인증서 큰 타이틀 한 줄, 8~14자 이내, 시적이고 웅장하게. 예: '황금 유전자의 기적', '천상의 아이가 내렸도다', '명당의 기운 담은 아이')",
  "cert_subtitle": "이 세상에 단 하나뿐인 운명",
  "cert_body": "인증서 본문 3줄. {nm}의 유전자 특징을 요약. 엄마의 XX과 아빠의 XX이 만나 천상의 아이가 태어날 운명. 한자어 키워드 포함.",
  "cert_tags": ["#황금유전자", "#S등급", "#IQ145+", "#청출어람"],

  "variants": {
    "m90": {
      "balance_type": "감성 아티스트형 (엄마 90% 유형 이름, 예술/감성 계열)",
      "fate_body": "[엄마의 특징을 90% 극대화해서 물려받은 상. 감성/직관/예술 계열 천재 느낌. 5~6줄. 엄마의 어떤 특징이 구체적으로 강조되는지]",
      "changes": "👁️ 눈매: 50:50 → 엄마 97% ↑ (감성 극대화)\\n👃 코: 50:50 → 엄마 70% ↑ (섬세한 코로 변화)\\n🎨 이마: 50:50 → 엄마 95% ↑ (창의력 폭발)\\n👄 입/턱: 50:50 → 엄마 80% ↑ (말솜씨 계승)",
      "jobs": ["🎨 예술감독", "💆 심리 전문가", "⭐ 미디어 스타"],
      "timeline": "20대 초반에 예술계 데뷔, 30대에 자기 브랜드 론칭!",
      "prophecy": "엄마를 90% 닮은 {nm}는 감성으로 세상을 움직이는 사람이 될 거예요."
    },
    "m70": {
      "balance_type": "균형 감성형 (엄마 70% 유형)",
      "fate_body": "[엄마 70% 유형: 엄마 중심 밸런스. 5~6줄]",
      "changes": "👁️ 눈매: 50:50 → 엄마 82% ↑\\n👃 코: 50:50 → 엄마 60% ↑\\n🎨 이마: 50:50 → 엄마 80% ↑\\n👄 입/턱: 50:50 → 엄마 65% ↑",
      "jobs": ["📖 작가", "🎓 교육자", "🌿 상담사"],
      "timeline": "20대 후반에 분야 진입, 30대 중반에 안정적 커리어!",
      "prophecy": "엄마의 따뜻함에 아빠의 단단함이 스민 균형형 인재가 될 거예요."
    },
    "d70": {
      "balance_type": "리더형 (아빠 70% 유형)",
      "fate_body": "[아빠 70% 유형: 아빠 중심 밸런스, 리더십/결단 계열. 5~6줄]",
      "changes": "👁️ 눈매: 50:50 → 아빠 60% ↑\\n👃 코: 50:50 → 아빠 80% ↑\\n🎨 이마: 50:50 → 아빠 65% ↑\\n👄 입/턱: 50:50 → 아빠 75% ↑",
      "jobs": ["💼 CEO", "⚖️ 법조인", "🏛️ 공직자"],
      "timeline": "20대 후반에 조직 내 두각, 30대 후반에 리더 포지션!",
      "prophecy": "아빠의 강직함에 엄마의 통찰이 더해진 리더가 될 거예요."
    },
    "d90": {
      "balance_type": "카리스마형 (아빠 90% 유형)",
      "fate_body": "[아빠의 특징을 90% 극대화. 카리스마/야망/실행력 계열 천재. 5~6줄]",
      "changes": "👁️ 눈매: 50:50 → 아빠 70% ↑\\n👃 코: 50:50 → 아빠 95% ↑ (재물운 극대화)\\n🎨 이마: 50:50 → 아빠 85% ↑\\n👄 입/턱: 50:50 → 아빠 92% ↑ (리더십 극대화)",
      "jobs": ["🏆 사업가", "🎯 프로 운동선수", "🛡️ 장군·수장"],
      "timeline": "20대 초반에 큰 사건으로 이름 알림, 30대에 정점!",
      "prophecy": "아빠를 90% 닮은 {nm}는 시대를 이끄는 리더가 될 거예요."
    }
  },

  "prophecy_msg": "[가이드 — 절대 출력 금지] 두 사람에게 전하는 따뜻한 예언 한마디. 2~3줄 (80~120자). 미래 아기({nm})의 핵심 운명·축복을 한 줄로 짚고 두 사람을 응원하는 마무리. [중요: '🔮 천기의 한마디 —' 같은 라벨 텍스트 절대 포함 금지]"
}

[에러 분류 - type_id 21~26]
- 동물/사물: {"image_type":"animal","type_id":21}
- 흐릿/어두움: {"image_type":"unclear","type_id":22}
- 2명 이상(한 사진에): {"image_type":"multi","type_id":23}
- 얼굴 없음/가림 (스티커·이모지 오버레이·인스타/스냅챗 AR필터·손·마스크·선글라스 등으로 눈·코·입 중 하나라도 가려진 경우 — 부분 가림도 포함): {"image_type":"masked","type_id":25}
- 그림/캐릭터: {"image_type":"illustration","type_id":26}

⚠️ 사진 2장이 들어오면 각각 사람 1명인지 확인. 둘 다 사람이면 정상 분석 진행.
⚠️ 어느 한쪽이라도 사람이 아니면 해당 에러 type_id 반환.`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      imageData1,
      imageData2,
      mediaType1 = "image/jpeg",
      mediaType2 = "image/jpeg",
      babyName = "우리 아기",
      momName = "엄마",
      dadName = "아빠",
    } = body;

    if (!imageData1 || !imageData2)
      return NextResponse.json({ error: "엄마와 아빠 사진이 모두 필요합니다." }, { status: 400 });

    const base64Image1 = imageData1.includes(",") ? imageData1.split(",")[1] : imageData1;
    const base64Image2 = imageData2.includes(",") ? imageData2.split(",")[1] : imageData2;
    const resolvedType1 = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType1) ? mediaType1 : "image/jpeg";
    const resolvedType2 = ["image/jpeg","image/png","image/gif","image/webp"].includes(mediaType2) ? mediaType2 : "image/jpeg";

    const firstName = getFriendlyName(babyName);
    const friendlyName = getNameWithParticle(firstName);

    const reqBody = JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [
        { inlineData: { mimeType: resolvedType1, data: base64Image1 } },
        { inlineData: { mimeType: resolvedType2, data: base64Image2 } },
        { text: `첫 번째 사진은 엄마(${momName}), 두 번째 사진은 아빠(${dadName})입니다. 이 두 사람의 이목구비를 분석해서 2세(${babyName})의 얼굴 특징과 운명을 예측해줘. 풀네임: ${babyName}, 엄마: ${momName}, 아빠: ${dadName}. {nm}="${friendlyName}", {full}="${babyName}", {mom}="${momName}", {dad}="${dadName}"으로 치환. JSON만 출력. 사람이 아니면 에러 type_id 반환.` }
      ]}],
      generationConfig: { temperature: 0.8, maxOutputTokens: 16384, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } },
    });

    // v509: gemini-1.5-flash 제거 — v1beta endpoint에서 미지원 (404 발생).
    // 2.0 → 2.5 → Lite 순으로 시도 (2.0이 부하 가장 낮아 1순위)
    const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
    let geminiRes: Response | null = null;
    let lastError: any = null;
    outer: for (const model of MODELS) {
      const url = getGeminiUrl(model);
      for (let attempt = 0; attempt < 3; attempt++) {
        geminiRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: reqBody });
        if (geminiRes.ok) break outer;
        const errCheck = await geminiRes.clone().json().catch(() => null);
        lastError = errCheck?.error?.message || "";
        const isHighDemand = lastError.includes("high demand") || lastError.includes("overloaded") || geminiRes.status === 503;
        const isRateLimit = geminiRes.status === 429;
        if (isHighDemand || isRateLimit) {
          // 지수 백오프: 2s → 4s → 8s
          await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
          continue;
        }
        // 재시도 불가능한 에러면 다음 모델로
        break;
      }
      console.log(`[baby-face] ${model} exhausted, trying next model...`);
    }

    const geminiData = await geminiRes!.json();
    if (geminiData.error) {
      const msg = (geminiData.error.message || "").toLowerCase();
      const isOverload = msg.includes("high demand") || msg.includes("overloaded") || msg.includes("unavailable");
      const friendly = isOverload
        ? "지금 AI 서버 혼잡해요 😢 1~2분 후 다시 시도해주세요"
        : "AI 분석 중 오류: " + (geminiData.error.message || "").substring(0, 100);
      return NextResponse.json({ error: friendly }, { status: 503 });
    }

    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const part of parts) { if (part.text) rawText = part.text; }
    if (!rawText) return NextResponse.json({ error: "AI 응답 없음" }, { status: 500 });

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
    const parsed = parseGeminiJson(rawText);
    if (!parsed) return NextResponse.json({ error: "AI 응답 파싱 실패", debug: rawText.substring(0, 300) }, { status: 500 });

    // 에러 type 체크
    const imgType = (parsed.image_type || "").toLowerCase();
    if (["animal","object","unclear","multi","masked","illustration","not_human"].includes(imgType)) {
      return NextResponse.json({ result: parsed });
    }

    // 친근한 이름 정보 추가
    parsed._friendlyName = friendlyName;
    parsed._firstName = firstName;
    parsed._fullName = babyName;
    parsed._momName = momName;
    parsed._dadName = dadName;

    // v(2026-07-14): 계층1/2/3 고정 — 이전엔 FIXED 테이블이 전혀 없어 총점·등급·재물그릇·유전자비율·밸런스타입까지
    // 매 호출 자유생성이었음(4,800원 최고가 콘텐츠인데 감사에서 발견된 가장 불안정한 콘텐츠).
    // 부모 이름+사진 기반 결정론적 해시로 확정 — 같은 부모 사진이면 항상 같은 결과.
    const babySeed = [momName, dadName, base64Image1.slice(0, 40), base64Image2.slice(0, 40)];
    parsed.total_score = lockedScore([...babySeed, "score"], 95, 99);
    parsed.grade = parsed.total_score >= 97 ? "S" : "A";
    parsed.top_percent =
      parsed.total_score >= 99 ? "0.1" : parsed.total_score >= 98 ? "0.5" : parsed.total_score >= 97 ? "1" : "3";

    const WEALTH_GRADES = ["소", "중", "대", "왕"];
    if (!parsed.tab3_wealth || typeof parsed.tab3_wealth !== "object") parsed.tab3_wealth = {};
    parsed.tab3_wealth.wealth_grade = WEALTH_GRADES[lockedScore([...babySeed, "wealth"], 0, 3)];

    // school_type — 프롬프트에 이미 명시된 5종 후보 중 고정 선택 (자유생성 시 매번 다른 학교유형 출력되던 문제 fix)
    const SCHOOL_TYPES = ["🏫 서울대 프리패스형", "🌎 아이비리그형", "🎨 예고/예대형", "🔬 카이스트형", "💼 경영대형"];
    if (!parsed.tab4_study || typeof parsed.tab4_study !== "object") parsed.tab4_study = {};
    parsed.tab4_study.school_type = SCHOOL_TYPES[lockedScore([...babySeed, "school"], 0, 4)];

    // balance_type — 프롬프트 스펙상 기본값은 이미 고정 문구로 지정돼 있었는데 서버가 강제하지 않아 AI가 다르게 쓰던 문제 fix.
    // variants(m90/m70/d70/d90)도 프롬프트 예시 라벨을 그대로 고정.
    parsed.balance_type = "무결점 올라운더 · 황금 밸런스";
    if (parsed.variants && typeof parsed.variants === "object") {
      if (parsed.variants.m90) parsed.variants.m90.balance_type = "감성 아티스트형 (엄마 90% 유형)";
      if (parsed.variants.m70) parsed.variants.m70.balance_type = "균형 감성형 (엄마 70% 유형)";
      if (parsed.variants.d70) parsed.variants.d70.balance_type = "리더형 (아빠 70% 유형)";
      if (parsed.variants.d90) parsed.variants.d90.balance_type = "카리스마형 (아빠 90% 유형)";
    }

    // dna_mix — 부위별 엄마/아빠 비율 고정 (이전엔 재분석할 때마다 눈·코·입 비율이 완전히 달라지던 문제 fix)
    const DNA_PARTS = ["eyes", "nose", "mouth", "forehead", "ears"];
    if (parsed.dna_mix && typeof parsed.dna_mix === "object") {
      DNA_PARTS.forEach((part) => {
        if (!parsed.dna_mix[part] || typeof parsed.dna_mix[part] !== "object") return;
        const momPct = lockedScore([...babySeed, part], 20, 80);
        parsed.dna_mix[part].mom_pct = momPct;
        parsed.dna_mix[part].dad_pct = 100 - momPct;
      });
    }

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "분석 오류" }, { status: 500 });
  }
}
