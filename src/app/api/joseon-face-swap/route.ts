import { NextRequest, NextResponse } from "next/server";

// 조선초상화 face-swap — 사용자 얼굴을 60종 템플릿에 합성
//
// 환경변수:
//   REPLICATE_API_TOKEN — 필수
//   REPLICATE_FACE_SWAP_VERSION — 모델 이름(owner/model) 또는 version hash
//     추천 모델 (이름만 넣으면 latest version 자동 조회):
//       - "cdingram/face-swap"        (기본 face-swap, 빠름)
//       - "omniedgeio/face-swap"      (안정적, 한국 얼굴 호환 양호)
//       - "lucataco/faceswap"         (빠른 속도, 가벼움)
//     또는 hash 직접 입력: "abc123..."
//   PUBLIC_BASE_URL — 템플릿 이미지 절대 URL용 (예: "https://chungi.kr"). 미설정 시 req.nextUrl.origin
//
//   [안경 제거 전처리 — 선택] 안경 쓴 사진은 face-swap이 안경테 일부만 합성해 어색해짐.
//   REPLICATE_GLASSES_REMOVE_VERSION — 안경 제거 모델(owner/model 또는 hash). 설정 시 합성 전 1단계 전처리.
//     (예: 도수안경 제거용 img2img / 인페인트 모델. 사용자가 직접 선택해 등록)
//   REPLICATE_GLASSES_REMOVE_INPUT_KEY — 그 모델의 이미지 input 키 (기본 "image", 모델 따라 "input_image" 등)
//   REPLICATE_GLASSES_REMOVE_PROMPT — (선택) 인페인트 모델용 프롬프트 (예: "face without eyeglasses, clear eyes")
//   → Gemini 분류가 glasses=true 판정한 사진에만 실행. 미설정/실패 시 원본 그대로 (graceful, 안경 유지)
//
// 미설정 시: { swap_url: null, notice: "..." } 반환 → 클라이언트가 원본 템플릿 그대로 표시 (graceful)

export const maxDuration = 60;

// owner/model 형태 → Replicate API에서 latest version hash 자동 조회
async function resolveModelVersion(token: string, versionEnv: string): Promise<string | null> {
  // 이미 hash 형태(40자리 hex)면 그대로 반환
  if (/^[a-f0-9]{40,}$/i.test(versionEnv)) return versionEnv;
  // owner/model 형태면 latest version fetch
  if (versionEnv.includes("/")) {
    try {
      const res = await fetch(`https://api.replicate.com/v1/models/${versionEnv}`, {
        headers: { "Authorization": `Token ${token}` },
      });
      if (!res.ok) {
        console.error("[joseon-face-swap] model fetch fail:", res.status, await res.text().then(t=>t.substring(0,200)));
        return null;
      }
      const data = await res.json();
      return data.latest_version?.id || null;
    } catch (e) {
      console.error("[joseon-face-swap] resolveVersion error:", e);
      return null;
    }
  }
  return versionEnv;
}

// 모델별 input 키 매핑 — Replicate 모델마다 input 스키마가 달라서
function buildSwapInput(versionEnv: string, userImgUrl: string, templateUrl: string): any {
  const lower = versionEnv.toLowerCase();
  // cdingram/face-swap: swap_image (얼굴) + input_image (배경)
  if (lower.startsWith("cdingram/")) {
    return { swap_image: userImgUrl, input_image: templateUrl };
  }
  // lucataco/faceswap: source_image + target_image
  if (lower.startsWith("lucataco/")) {
    return { source_image: userImgUrl, target_image: templateUrl };
  }
  // omniedgeio/face-swap (기본): swap_image + target_image
  return { swap_image: userImgUrl, target_image: templateUrl };
}

// 안경 제거 전처리 모델 input — 모델마다 키가 달라서 env로 키/프롬프트 설정 가능
function buildDeglassInput(imgUrl: string): any {
  const key = process.env.REPLICATE_GLASSES_REMOVE_INPUT_KEY || "image";
  const input: any = { [key]: imgUrl };
  const prompt = process.env.REPLICATE_GLASSES_REMOVE_PROMPT;
  if (prompt) input.prompt = prompt;
  return input;
}

// 합성 전 안경 제거 (1단계 전처리). 미설정/실패 시 null → 원본 그대로 사용 (graceful)
async function tryRemoveGlasses(token: string, imgUrl: string): Promise<string | null> {
  const versionEnv = process.env.REPLICATE_GLASSES_REMOVE_VERSION;
  if (!versionEnv) return null; // 모델 미설정 → 안경 제거 스킵
  try {
    const version = await resolveModelVersion(token, versionEnv);
    if (!version) return null;
    const deglassed = await callReplicate(token, version, buildDeglassInput(imgUrl));
    return deglassed || null;
  } catch (e) {
    console.error("[joseon-face-swap] 안경 제거 실패 — 원본으로 진행:", e instanceof Error ? e.message : e);
    return null;
  }
}

// v362: 에러 메시지를 throw해서 상위에서 클라이언트에 전달 가능하도록
async function callReplicate(token: string, version: string, input: any): Promise<string> {
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, input }),
  });
  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error("[joseon-face-swap] create fail:", createRes.status, errText.substring(0, 300));
    throw new Error(`Replicate create ${createRes.status}: ${errText.substring(0, 200)}`);
  }
  const created = await createRes.json();
  const id = created.id;
  if (!id) throw new Error("Replicate: prediction id 없음");

  // 폴링 (최대 50초)
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Token ${token}` },
    });
    if (!statusRes.ok) continue;
    const status = await statusRes.json();
    if (status.status === "succeeded") {
      const out = status.output;
      if (typeof out === "string") return out;
      if (Array.isArray(out) && out.length > 0) return String(out[0]);
      throw new Error("Replicate: succeeded but no output");
    }
    if (status.status === "failed" || status.status === "canceled") {
      console.error("[joseon-face-swap] failed:", status.error);
      throw new Error(`Replicate ${status.status}: ${String(status.error||"").substring(0,200)}`);
    }
  }
  throw new Error("Replicate: 폴링 타임아웃 (50초)");
}

// 조선 페르소나 id (1~60 또는 "E1"~"E6") → 템플릿 이미지 경로
function joseonTemplateUrl(id: number | string, baseUrl: string): string | null {
  if (typeof id === "string" && /^E[1-6]$/.test(id)) {
    // 에러 케이스는 face-swap 안 함 (도깨비/심령/꼬마/자객/목판화 등)
    return null;
  }
  const n = typeof id === "number" ? id : parseInt(String(id));
  if (isNaN(n) || n < 1 || n > 60) return null;
  // 파일명: joseon (1).png ~ joseon (60).png
  // URL encoding: 공백 → %20, () 그대로
  return `${baseUrl}/joseon-portraits/joseon%20(${n}).png`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userImage, templateId, removeGlasses } = body;
    // userImage: base64 또는 data URL (사용자 얼굴 사진)
    // templateId: 1~60 (정상 페르소나) 또는 "E1"~"E6" (에러 — face-swap 스킵)

    if (!userImage) {
      return NextResponse.json({ swap_url: null, error: "사용자 얼굴 사진이 필요합니다" }, { status: 400 });
    }

    if (templateId == null) {
      return NextResponse.json({ swap_url: null, error: "templateId가 필요합니다" }, { status: 400 });
    }

    // 에러 케이스 → face-swap 안 함, 원본 템플릿만 반환
    if (typeof templateId === "string" && /^E[1-6]$/.test(templateId)) {
      return NextResponse.json({
        swap_url: null,
        template_url: null,
        is_error_case: true,
        notice: "에러 페르소나는 face-swap 스킵",
      });
    }

    const baseUrl = process.env.PUBLIC_BASE_URL || req.nextUrl.origin;
    const templateUrl = joseonTemplateUrl(templateId, baseUrl);
    if (!templateUrl) {
      return NextResponse.json({ swap_url: null, error: "유효하지 않은 templateId" }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      // 토큰 없음 — 원본 템플릿 그대로 사용 (graceful degradation)
      return NextResponse.json({
        swap_url: null,
        template_url: templateUrl,
        notice: "REPLICATE_API_TOKEN 미설정 — 원본 템플릿 표시",
      });
    }

    const versionEnv = process.env.REPLICATE_FACE_SWAP_VERSION;
    if (!versionEnv) {
      // 모델 버전 없음 — 원본 템플릿 그대로
      return NextResponse.json({
        swap_url: null,
        template_url: templateUrl,
        notice: "REPLICATE_FACE_SWAP_VERSION 미설정 — 원본 템플릿 표시",
      });
    }

    // owner/model 형태면 latest version 자동 조회
    const version = await resolveModelVersion(token, versionEnv);
    if (!version) {
      return NextResponse.json({
        swap_url: null,
        template_url: templateUrl,
        error: `모델 버전 조회 실패 (${versionEnv}) — 원본 템플릿 표시`,
      });
    }

    // base64 → data URL
    const userImgUrl = userImage.startsWith("data:") ? userImage : `data:image/jpeg;base64,${userImage}`;
    // 안경 사진이면 합성 전 안경 제거 전처리 (REPLICATE_GLASSES_REMOVE_VERSION 설정 시). 실패해도 원본으로 진행
    let swapSourceUrl = userImgUrl;
    if (removeGlasses) {
      const deglassed = await tryRemoveGlasses(token, userImgUrl);
      if (deglassed) swapSourceUrl = deglassed;
    }
    // 모델별 input 키 자동 매핑
    const input = buildSwapInput(versionEnv, swapSourceUrl, templateUrl);
    try {
      const swapUrl = await callReplicate(token, version, input);
      return NextResponse.json({
        swap_url: swapUrl,
        template_url: templateUrl,
        template_id: templateId,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Replicate 호출 실패";
      console.error("[joseon-face-swap] replicate error:", msg);
      return NextResponse.json({
        swap_url: null,
        template_url: templateUrl,
        error: msg,
        debug: { versionEnv, resolvedVersion: version },
      });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "face-swap 처리 오류";
    console.error("[joseon-face-swap] error:", msg);
    return NextResponse.json({ swap_url: null, error: msg }, { status: 500 });
  }
}
