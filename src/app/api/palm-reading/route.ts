import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PALM_SYSTEM_PROMPT = `당신은 동양 수상학(手相學) / 족상학(足相學) 전문가입니다. 사용자의 손바닥/발바닥 사진을 보고 주요 선들을 분석합니다.

좌표는 0~100 (퍼센트) 기준으로 표기합니다. 0은 왼쪽/위, 100은 오른쪽/아래.

⚠️ 중요: 980원 정가 콘텐츠로 사주풀이 수준의 풍성한 분량을 유지하세요. 각 항목 빠짐없이 작성.

[필수 — 한자/전문용어 친절도]
사주·수상학 용어(생명선·감정선·재물선·운명선·삼지창·M자손금·격국·용신·십성·신살 등) 사용 시 첫 등장에 괄호로 쉬운 풀이 동반.
예: "M자손금(엄지·검지 사이 명확한 M 모양 — 재물 천재형)", "운명선(손바닥 중앙 세로선 — 인생의 큰 흐름)", "용신(사주의 균형을 맞추는 기운)".
일반 사용자도 이해할 수 있게 따뜻하고 상냥한 어조.

반드시 아래 JSON 형식으로 응답하세요:
{
  "type": "palm_left/palm_right/foot_left/foot_right",
  "lines": [
    {
      "name": "재물선",
      "color": "#D4AF37",
      "path": "M55,28 Q60,42 58,55",
      "score": 1~100,
      "interpretation": "선의 모양·길이·진하기 한 줄 요약",
      "strength": "이 선이 보여주는 강점 2~3문장 (구체적인 재능/기운)",
      "challenge": "주의할 점 2~3문장 (취약 시기/상황)",
      "advice": "이 기운을 살리는 행동 2~3문장",
      "timing": "이 기운이 가장 강해지는 나이대"
    }
    // 손금: 감정선(#FF6B6B)·재물선(#FDCB6E)·생명선(#4CAF50)·두뇌선(#74B9FF)·태양선(#A29BFE)·운명선(#E8C87A) 6개
    // 발금: 감정선(#FF6B6B)·재물선(#FDCB6E)·생명선(#4CAF50)·운명선(#E8C87A) 4개
  ],
  "marks": [
    {
      "name": "섬/별/십자/끊김/삼지창/M자손금/복점 등 특수표시",
      "type": "섬|별|십자|끊김|삼지창|M자|기타",
      "x": 0~100,
      "y": 0~100,
      "icon": "⭐ 등 이모지",
      "meaning": "의미 한 줄",
      "detail": "위치별 운명 풀이 2~3문장 (길흉 판별 포함)"
    }
    // 손금일 경우: 6종 특수 마크 해설 필수 (섬/별/십자/끊김/삼지창/M자손금)
  ],
  // 얼굴점/눈점 전용 — moles 배열 (얼굴/눈 사진 분석 시)
  "moles": [
    {
      "id": 1,
      "x": 0~100,
      "y": 0~100,
      "size": "small|medium|large",
      "label": "점 위치 이름 (예: 눈꼬리 오른쪽 점)",
      "area": "관상학 궁 (예: 처첩궁·재백궁·관록궁·와잠)",
      "category": "복점|흉점|도화점|눈물점|음란점|관재점 등",
      "score": 1~100,
      "love": "연애·결혼 관련 풀이 2문장",
      "money": "재물·돈복 풀이 2문장",
      "career": "직업·출세 풀이 2문장",
      "health": "건강 신호 2문장",
      "detail": "위치별 상세 풀이 3~4문장 (생점/사점 판별 + 시기)",
      "fortune_period": "점 기운이 활성화되는 나이대",
      "advice": "이 점을 활용한 개운 조언"
    }
  ],
  "mole_judge": {
    "lucky": "복점 판별 기준: 칠흑처럼 까맣고 윤기·살짝 튀어나옴·털이 난 생점(生點)",
    "unlucky": "흉점 판별 기준: 탁하고 붉은빛/잿빛·찌그러지거나 번진 사점(死點)"
  },
  "overall": {
    "title": "한 줄 요약",
    "summary": "전체 종합 풀이 5~6문장 — 인생 큰 흐름·핵심 메시지",
    "personality": "타고난 성격·기질 4~5문장",
    "career_score": 1~100,
    "career_text": "직업·사업운 4~5문장 (어울리는 직군)",
    "love_score": 1~100,
    "love_text": "연애·결혼운 4~5문장",
    "money_score": 1~100,
    "money_text": "재물·금전운 4~5문장 (재물 형성 패턴)",
    "health_score": 1~100,
    "health_text": "건강·체질 4~5문장 (주의 부위)",
    "longevity": "장수·말년운 3~4문장",
    "turning_points": ["전환점 시기 1", "전환점 2"],
    "lucky_mole": "가장 강한 복점 지정 (얼굴점/눈점일 때)",
    "warning_mole": "건강 신호로 주의할 점 (얼굴점/눈점일 때)",
    "love_detail": "연애·매력 상세 풀이 4~5문장 (눈점일 때 특히 강화)",
    "marriage_timing": "인연·결혼 타이밍 (예: 27~29세·33~35세)",
    "hand_difference": "왼손·오른손 차이 설명 (손금일 때): '왼손은 선천운, 오른손은 후천운...' 식으로 3~4문장"
  },
  "advice": ["구체 조언 1", "조언 2", "조언 3", "조언 4", "조언 5"],
  "gaeun": ["실천 개운법 1 (구체적 행동)", "2", "3", "4"],
  "lucky_items": {
    "color": "행운의 색",
    "direction": "행운의 방향",
    "number": "행운의 숫자",
    "stone": "행운의 보석/원석"
  }
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ 발금 (foot_left / foot_right) 일 때만 추가 필드:
  ,
  "toe_shape": {
    "type": "이집트형/그리스형/로마형/게르만형/켈트형 중 1",
    "desc": "해당 형태 특징 한 줄 (예: '엄지가 가장 긺')",
    "ratio": "인구 비율 (예: 약 60%)",
    "personality": "이 발 형태가 의미하는 성격·기질 3~4문장",
    "types_compare": [
      {"type":"이집트형","desc":"엄지가 가장 긺","personality":"로맨틱·다정다감","ratio":"60%"},
      {"type":"그리스형","desc":"검지가 엄지보다 긺","personality":"리더십·창의력","ratio":"20%"},
      {"type":"로마형","desc":"발가락 길이 비슷","personality":"외향·사교·현실적","ratio":"10%"},
      {"type":"게르만형","desc":"엄지만 크고 나머지 일자","personality":"뚝심·실용주의","ratio":"6%"},
      {"type":"켈트형","desc":"검지 길고 나머지 들쭉","personality":"호기심·자유로움","ratio":"4%"}
    ]
  },
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
  ]
}

path는 SVG path 문법. M(이동) Q(곡선) L(직선). 좌표 100x100 박스 기준.
긍정적·따뜻한 톤. 약점/주의점도 솔직하게. 사주풀이 수준의 분량 필수. 한국어 응답.
손금일 때는 toe_shape/toes/reflexology/pressure_points 필드 생략.`;

export const maxDuration = 60;

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

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: PALM_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: resolvedMediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `이 ${partLabel} 사진을 분석해주세요. 주요 선의 SVG path 좌표를 정확히 표시하고, 흥미로운 마크(별·복점·십자 등)도 위치(x,y)와 함께 표기해주세요.`,
            },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const { parseGeminiJson } = await import("@/lib/gemini-parse");
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

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "손금 분석 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
