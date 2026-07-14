import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// v(2026-07-14): 2-call 구조로 전환 — 이전엔 단일 호출이라 선의 점수·특수 마크 위치·발가락 형태까지
// 매번 자유생성이었음(같은 사진을 두 번 올리면 재물선 점수가 89→95→72로 바뀌는 등). Call-1(temp 0)이
// 점수·마크 위치·발가락 형태를 고정 관측 → Call-2가 그 위에 해석 텍스트만 채우는 구조로 분리.
// career/love/money/health_score도 AI 자가보고 대신 대응되는 선의 Call-1 점수에서 코드로 직접 도출.

const PALM_LINES: Record<"palm" | "foot", { name: string; color: string }[]> = {
  palm: [
    { name: "감정선", color: "#FF6B6B" },
    { name: "재물선", color: "#FDCB6E" },
    { name: "생명선", color: "#4CAF50" },
    { name: "두뇌선", color: "#74B9FF" },
    { name: "태양선", color: "#A29BFE" },
    { name: "운명선", color: "#E8C87A" },
  ],
  foot: [
    { name: "감정선", color: "#FF6B6B" },
    { name: "재물선", color: "#FDCB6E" },
    { name: "생명선", color: "#4CAF50" },
    { name: "운명선", color: "#E8C87A" },
  ],
};

// 발 형태 5종 — 인구비율·특징까지 이미 정해진 사실이라 AI 호출 없이 완전 고정 (types_compare)
const TOE_SHAPES = [
  { type: "이집트형", desc: "엄지가 가장 긺", personality: "로맨틱·다정다감", ratio: "60%" },
  { type: "그리스형", desc: "검지가 엄지보다 긺", personality: "리더십·창의력", ratio: "20%" },
  { type: "로마형", desc: "발가락 길이 비슷", personality: "외향·사교·현실적", ratio: "10%" },
  { type: "게르만형", desc: "엄지만 크고 나머지 일자", personality: "뚝심·실용주의", ratio: "6%" },
  { type: "켈트형", desc: "검지 길고 나머지 들쭉", personality: "호기심·자유로움", ratio: "4%" },
];

const MOLE_JUDGE_STATIC = {
  lucky: "복점 판별 기준: 칠흑처럼 까맣고 윤기·살짝 튀어나옴·털이 난 생점(生點)",
  unlucky: "흉점 판별 기준: 탁하고 붉은빛/잿빛·찌그러지거나 번진 사점(死點)",
};

function buildCall1Prompt(isFoot: boolean) {
  const lines = isFoot ? PALM_LINES.foot : PALM_LINES.palm;
  return `당신은 동양 수상학(手相學)/족상학(足相學) 전문가입니다. 사진에서 선의 점수와 특수 표시(마크)만 "관측"합니다.
해석 텍스트는 이 단계에서 절대 작성하지 않습니다 — 오직 점수·위치 등 관측값만 보고하세요.
좌표는 0~100 (퍼센트) 기준. 0은 왼쪽/위, 100은 오른쪽/아래.

[분석 대상 선 — 반드시 이 ${lines.length}개 전부 포함, 순서·이름 그대로]
${lines.map((l) => `- ${l.name}`).join("\n")}
${
  isFoot
    ? `\n[발가락 형태 — 반드시 아래 5종 중 하나를 정확히 그대로 선택]\n${TOE_SHAPES.map((t) => `- ${t.type}: ${t.desc}`).join("\n")}\n`
    : ""
}
JSON만:
{
  "lines": [{"name":"선 이름 (위 목록 그대로)","score":1~100,"interpretation":"선의 모양·길이·진하기 한 줄 요약"}],
  "marks": [{"name":"섬/별/십자/끊김/삼지창/M자손금/복점 등 특수표시","type":"섬|별|십자|끊김|삼지창|M자|기타","x":0~100,"y":0~100,"icon":"⭐ 등 이모지"}]${
    isFoot ? `,\n  "toe_shape_type": "위 5종 목록에 있는 이름 그대로"` : ""
  }
}
특수 마크가 안 보이면 marks: [] 로 응답.`;
}

function buildCall2Prompt(partLabel: string, isFoot: boolean) {
  return `[ROLE]
당신은 동양 수상학(手相學) / 족상학(足相學) 전문가입니다. 아래에 이미 확정된 선 점수·마크 위치·관측값이 주어집니다.
⚠️ 선의 점수·마크 위치는 절대 변경하지 마세요 — 오직 해석 텍스트만 작성합니다.

⚠️ 중요: 980원 정가 콘텐츠로 사주풀이 수준의 풍성한 분량을 유지하세요. 각 항목 빠짐없이 작성.

[필수 — 한자/전문용어 친절도]
사주·수상학 용어(생명선·감정선·재물선·운명선·삼지창·M자손금 등) 사용 시 첫 등장에 괄호로 쉬운 풀이 동반.
예: "M자손금(엄지·검지 사이 명확한 M 모양 — 재물 천재형)", "운명선(손바닥 중앙 세로선 — 인생의 큰 흐름)".
일반 사용자도 이해할 수 있게 따뜻하고 상냥한 어조.

반드시 아래 JSON 형식으로 응답하세요:
{
  "lines": [
    {
      "name": "선 이름 (고정 관측값과 동일하게)",
      "path": "SVG path 문법 (M이동 Q곡선 L직선, 좌표 100x100 박스 기준. 예: 'M55,28 Q60,42 58,55')",
      "strength": "이 선이 보여주는 강점 2~3문장 (구체적인 재능/기운)",
      "challenge": "주의할 점 2~3문장 (취약 시기/상황)",
      "advice": "이 기운을 살리는 행동 2~3문장",
      "timing": "이 기운이 가장 강해지는 나이대"
    }
  ],
  "marks": [
    { "name": "고정 관측값의 마크 이름과 동일하게", "meaning": "의미 한 줄", "detail": "위치별 운명 풀이 2~3문장 (길흉 판별 포함)" }
  ],
  "overall": {
    "title": "한 줄 요약",
    "summary": "전체 종합 풀이 5~6문장 — 인생 큰 흐름·핵심 메시지",
    "personality": "타고난 성격·기질 4~5문장",
    "career_text": "직업·사업운 4~5문장 (어울리는 직군)",
    "love_text": "연애·결혼운 4~5문장",
    "money_text": "재물·금전운 4~5문장 (재물 형성 패턴)",
    "health_text": "건강·체질 4~5문장 (주의 부위)",
    "longevity": "장수·말년운 3~4문장",
    "turning_points": ["전환점 시기 1", "전환점 2"],
    "marriage_timing": "인연·결혼 타이밍 (예: 27~29세·33~35세)"${
      isFoot ? "" : `,\n    "hand_difference": "왼손·오른손 차이 설명: '왼손은 선천운, 오른손은 후천운...' 식으로 3~4문장"`
    }
  },
  "advice": ["구체 조언 1", "조언 2", "조언 3", "조언 4", "조언 5"],
  "gaeun": ["실천 개운법 1 (구체적 행동)", "2", "3", "4"],
  "lucky_items": { "color": "행운의 색", "direction": "행운의 방향", "number": "행운의 숫자", "stone": "행운의 보석/원석" }${
    isFoot
      ? `,
  "toes": [
    {"name":"엄지 (목성구)","reading":"3~4문장 엄지 형태·길이·굵기 기반 성격/기질"},
    {"name":"검지 (화성구)","reading":"검지 기반 풀이"},
    {"name":"중지 (토성구)","reading":"중지 기반 풀이"},
    {"name":"약지 (태양구)","reading":"약지 기반 풀이"},
    {"name":"새끼 (수성구)","reading":"새끼 기반 풀이"}
  ],
  "reflexology": {
    "desc": "발바닥 반사구 개념 소개 2~3문장",
    "zones": [
      {"area":"엄지발가락","organ":"머리·뇌·스트레스","status":"사진에서 관찰되는 특징 기반 건강 신호 2문장"},
      {"area":"발볼 (발가락 아래)","organ":"심장·폐","status":"상태 풀이"},
      {"area":"발바닥 중앙 아치","organ":"소화기·위장","status":"상태 풀이"},
      {"area":"발뒤꿈치","organ":"생식기·골반","status":"상태 풀이"}
    ]
  },
  "pressure_points": [
    {"zone":"엄지발가락 아래 (목성구)","meaning":"의미 1문장","yours":"관찰된 상태 한줄"},
    {"zone":"발바닥 중앙 오목 부분","meaning":"의미","yours":"상태"},
    {"zone":"발뒤꿈치","meaning":"의미","yours":"상태"}
  ]`
      : ""
  }
}

path는 SVG path 문법. M(이동) Q(곡선) L(직선). 좌표 100x100 박스 기준.
긍정적·따뜻한 톤. 약점/주의점도 솔직하게. 사주풀이 수준의 분량 필수. 한국어 응답.
이 사진은 ${partLabel}입니다.`;
}

export const maxDuration = 60;

// 대표 선 점수를 해당 영역 score로 직접 매핑 — AI 자가보고 대신 코드로 도출 (임의 재-질문 없이 명확한 대응 관계)
function deriveAreaScores(lines: { name: string; score: number }[]) {
  const find = (n: string) => lines.find((l) => l.name === n)?.score ?? 60;
  return {
    money_score: find("재물선"),
    love_score: find("감정선"),
    health_score: find("생명선"),
    career_score: find("운명선"),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, type = "palm_right", mediaType = "image/jpeg" } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "이미지 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    const base64Image = imageData.includes(",")
      ? imageData.split(",")[1]
      : imageData;

    const validMediaTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ] as const;
    type MediaType = (typeof validMediaTypes)[number];
    const resolvedMediaType: MediaType = validMediaTypes.includes(
      mediaType as MediaType
    )
      ? (mediaType as MediaType)
      : "image/jpeg";

    const TYPE_LABELS: Record<string, string> = {
      palm_left: "왼쪽 손바닥",
      palm_right: "오른쪽 손바닥",
      foot_left: "왼쪽 발바닥",
      foot_right: "오른쪽 발바닥",
    };
    const partLabel = TYPE_LABELS[type] || "손바닥";
    const isFoot = type === "foot_left" || type === "foot_right";
    const lineSet = isFoot ? PALM_LINES.foot : PALM_LINES.palm;

    const { parseGeminiJson } = await import("@/lib/gemini-parse");

    // === CALL 1: 선 점수·마크·발가락형태 고정 관측 (temperature 0) ===
    const call1 = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      temperature: 0,
      system: buildCall1Prompt(isFoot),
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: resolvedMediaType, data: base64Image } },
            { type: "text", text: `이 ${partLabel} 사진의 선 점수와 특수 마크를 관측해주세요.` },
          ],
        },
      ],
    });
    const call1Text = call1.content[0].type === "text" ? call1.content[0].text : "";
    const call1Parsed = parseGeminiJson(call1Text);

    const lockedLines = lineSet.map((l, i) => {
      const found = Array.isArray(call1Parsed?.lines)
        ? call1Parsed.lines.find((x: Record<string, unknown>) => x?.name === l.name)
        : null;
      const score = found && typeof found.score === "number" ? Math.min(100, Math.max(1, Math.round(found.score))) : 60 + i;
      const interpretation = found && typeof found.interpretation === "string" ? found.interpretation : "";
      return { name: l.name, color: l.color, score, interpretation };
    });
    const lockedMarks = Array.isArray(call1Parsed?.marks)
      ? call1Parsed.marks
          .filter((m: unknown) => m && typeof m === "object")
          .map((m: Record<string, unknown>) => ({
            name: typeof m.name === "string" ? m.name : "특수 표시",
            type: typeof m.type === "string" ? m.type : "기타",
            x: typeof m.x === "number" ? m.x : 50,
            y: typeof m.y === "number" ? m.y : 50,
            icon: typeof m.icon === "string" ? m.icon : "✨",
          }))
      : [];
    const lockedToeType =
      isFoot && typeof call1Parsed?.toe_shape_type === "string" && TOE_SHAPES.some((t) => t.type === call1Parsed.toe_shape_type)
        ? call1Parsed.toe_shape_type
        : TOE_SHAPES[0].type;

    // === CALL 2: 고정된 관측값 위에 해석 텍스트만 생성 ===
    const linesFixedRule = `⚠️ 선 점수 고정 (절대 변경 금지, 아래 값 그대로 두고 해석만 작성):\n${lockedLines
      .map((l) => `- ${l.name}: score=${l.score} (${l.interpretation || "관측 결과 없음"})`)
      .join("\n")}\n`;
    const marksFixedRule =
      lockedMarks.length > 0
        ? `\n⚠️ 마크 위치 고정 (절대 개수·위치 변경 금지, 아래 마크들에 대해서만 해석 작성):\n${lockedMarks
            .map((m) => `- ${m.name}(${m.type})`)
            .join("\n")}\n`
        : `\n마크(특수표시)는 관측되지 않았으므로 marks는 빈 배열로 응답.\n`;
    const toeFixedRule = isFoot ? `\n⚠️ 발가락 형태는 반드시 "${lockedToeType}"으로 고정. 절대 변경 불가.\n` : "";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: linesFixedRule + marksFixedRule + toeFixedRule + "\n" + buildCall2Prompt(partLabel, isFoot),
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: resolvedMediaType, data: base64Image } },
            { type: "text", text: `이 ${partLabel} 사진을 분석해주세요.` },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const parsed = parseGeminiJson(rawText);
    if (!parsed) {
      return NextResponse.json(
        {
          error: "분석 결과를 처리하는 중 오류가 발생했습니다.",
          debug: rawText.substring(0, 300),
        },
        { status: 500 }
      );
    }

    // 선 점수/마크 위치 — Call-1 고정값으로 강제 override, 해석 텍스트만 Call-2 결과에서 병합
    const c2LinesByName: Record<string, Record<string, unknown>> = {};
    if (Array.isArray(parsed.lines)) {
      for (const l of parsed.lines) {
        if (l && typeof l === "object" && typeof (l as Record<string, unknown>).name === "string") {
          c2LinesByName[(l as Record<string, unknown>).name as string] = l as Record<string, unknown>;
        }
      }
    }
    parsed.lines = lockedLines.map((ll) => {
      const c2 = c2LinesByName[ll.name] || {};
      return {
        name: ll.name,
        color: ll.color,
        score: ll.score,
        path: typeof c2.path === "string" && c2.path.trim() ? c2.path : "M20,50 Q50,45 80,50",
        interpretation: ll.interpretation,
        strength: typeof c2.strength === "string" ? c2.strength : "",
        challenge: typeof c2.challenge === "string" ? c2.challenge : "",
        advice: typeof c2.advice === "string" ? c2.advice : "",
        timing: typeof c2.timing === "string" ? c2.timing : "",
      };
    });

    const c2MarksByName: Record<string, Record<string, unknown>> = {};
    if (Array.isArray(parsed.marks)) {
      for (const m of parsed.marks) {
        if (m && typeof m === "object" && typeof (m as Record<string, unknown>).name === "string") {
          c2MarksByName[(m as Record<string, unknown>).name as string] = m as Record<string, unknown>;
        }
      }
    }
    parsed.marks = lockedMarks.map((lm) => {
      const c2 = c2MarksByName[lm.name] || {};
      return {
        name: lm.name,
        type: lm.type,
        x: lm.x,
        y: lm.y,
        icon: lm.icon,
        meaning: typeof c2.meaning === "string" ? c2.meaning : "",
        detail: typeof c2.detail === "string" ? c2.detail : "",
      };
    });

    parsed.mole_judge = MOLE_JUDGE_STATIC;

    // career/love/money/health_score — AI 자가보고 대신 대응 선의 Call-1 점수에서 코드로 직접 도출
    if (!parsed.overall || typeof parsed.overall !== "object") parsed.overall = {};
    const derived = deriveAreaScores(lockedLines);
    Object.assign(parsed.overall as Record<string, unknown>, derived);

    if (isFoot) {
      parsed.toe_shape = {
        type: lockedToeType,
        desc: TOE_SHAPES.find((t) => t.type === lockedToeType)?.desc || "",
        ratio: TOE_SHAPES.find((t) => t.type === lockedToeType)?.ratio || "",
        personality: TOE_SHAPES.find((t) => t.type === lockedToeType)?.personality || "",
        types_compare: TOE_SHAPES,
      };
    }

    parsed.type = type;

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "손금 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
