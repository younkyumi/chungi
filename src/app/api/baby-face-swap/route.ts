import { NextRequest, NextResponse } from "next/server";

// 2세예측 face-swap (Replicate)
//
// 환경변수:
//   REPLICATE_API_TOKEN — 필수
//   REPLICATE_FACE_SWAP_VERSION — 모델 이름(owner/model) 또는 version hash
//     (조선초상화와 동일 env 재사용 — cdingram/face-swap 등)
//   REPLICATE_FACE_MIX_VERSION — 선택 (전용 face-mix 모델이 있다면 우선 사용)
//
// 동작 원리 (face-mix 전용 모델 없을 때 face-swap으로 시뮬레이션):
//   ratio = 엄마 비율 (0~100)
//   ratio>=50 (엄마 우세): 엄마 얼굴을 아빠 사진에 swap → 엄마 닮은 얼굴 결과
//   ratio<50  (아빠 우세): 아빠 얼굴을 엄마 사진에 swap → 아빠 닮은 얼굴 결과
//   * 진짜 baby simulation은 아니지만 alpha-blend 보다 훨씬 사실적인 합성 결과 제공
//
// 실패 시: { swap_url: null, error: ... } 반환 → 클라이언트가 alpha-blend 폴백

// 2단계 파이프라인 (age-regress×2 + face-swap) 대비 충분히 여유
export const maxDuration = 120;

// owner/model → latest version hash 자동 조회
async function resolveModelVersion(token: string, versionEnv: string): Promise<string | null> {
  if (/^[a-f0-9]{40,}$/i.test(versionEnv)) return versionEnv;
  if (versionEnv.includes("/")) {
    try {
      const res = await fetch(`https://api.replicate.com/v1/models/${versionEnv}`, {
        headers: { "Authorization": `Token ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.latest_version?.id || null;
    } catch { return null; }
  }
  return versionEnv;
}

// 모델별 input 키 매핑
function buildSwapInput(versionEnv: string, faceUrl: string, targetUrl: string): any {
  const lower = versionEnv.toLowerCase();
  if (lower.startsWith("cdingram/")) {
    return { swap_image: faceUrl, input_image: targetUrl };
  }
  if (lower.startsWith("lucataco/")) {
    return { source_image: faceUrl, target_image: targetUrl };
  }
  // omniedgeio/face-swap (기본)
  return { swap_image: faceUrl, target_image: targetUrl };
}

// face-mix 전용 모델용 input (있을 때만)
function buildMixInput(faceUrl1: string, faceUrl2: string, ratio: number): any {
  return { face1: faceUrl1, face2: faceUrl2, ratio: ratio / 100 };
}

// 어른→아기 변환 모델용 input (모델별 매핑)
// 권장 모델: yuval-alaluf/sam (target_age=2 → 아기)
function buildAgeRegressInput(versionEnv: string, imageUrl: string, targetAge = 2): any {
  const lower = versionEnv.toLowerCase();
  if (lower.includes("sam") || lower.startsWith("yuval-alaluf/")) {
    return { image: imageUrl, target_age: String(targetAge) };
  }
  if (lower.startsWith("arielreplicate/instructpix2pix")) {
    return { input_image: imageUrl, prompt: "transform this person into a cute baby (1~2 years old) with smooth skin and big round eyes, keep facial features", num_inference_steps: 30 };
  }
  // fofr/become-image 등 generic 입력
  return { image: imageUrl, target_age: targetAge };
}

// v362: 에러를 throw해서 상위에서 클라이언트에 전달
async function callReplicate(token: string, version: string, input: any): Promise<string> {
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { "Authorization": `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ version, input }),
  });
  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error("[baby-face-swap] create fail:", createRes.status, errText.substring(0,300));
    throw new Error(`Replicate create ${createRes.status}: ${errText.substring(0,200)}`);
  }
  const created = await createRes.json();
  const id = created.id;
  if (!id) throw new Error("Replicate: prediction id 없음");
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
      console.error("[baby-face-swap] failed:", status.error);
      throw new Error(`Replicate ${status.status}: ${String(status.error||"").substring(0,200)}`);
    }
  }
  throw new Error("Replicate: 폴링 타임아웃 (50초)");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageData1, imageData2, ratio = 50 } = body;
    // ratio: 0~100 (엄마 비율)

    if (!imageData1 || !imageData2) {
      return NextResponse.json({ swap_url: null, error: "두 부모 사진이 필요합니다" }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json({ swap_url: null, error: "REPLICATE_API_TOKEN 미설정 — alpha-blend 폴백" }, { status: 503 });
    }

    // 모델 우선순위:
    // 1) age-regress 2단계 파이프라인 (REPLICATE_AGE_REGRESS_VERSION) — 부모 어른→아기 변환 후 두 아기 face-swap (가장 자연스러움)
    // 2) face-mix 전용 모델 (REPLICATE_FACE_MIX_VERSION) — 한 번에 두 얼굴 블렌드
    // 3) face-swap (REPLICATE_FACE_SWAP_VERSION) — 어른 얼굴 swap 폴백
    const ageRegressVersion = process.env.REPLICATE_AGE_REGRESS_VERSION;
    const mixVersion = process.env.REPLICATE_FACE_MIX_VERSION;
    const swapVersion = process.env.REPLICATE_FACE_SWAP_VERSION;

    const url1 = imageData1.startsWith("data:") ? imageData1 : `data:image/jpeg;base64,${imageData1}`;
    const url2 = imageData2.startsWith("data:") ? imageData2 : `data:image/jpeg;base64,${imageData2}`;

    // 1) age-regress 2단계 파이프라인 (가장 자연스러운 결과)
    if (ageRegressVersion && swapVersion) {
      const ageV = await resolveModelVersion(token, ageRegressVersion);
      const swapV = await resolveModelVersion(token, swapVersion);
      if (ageV && swapV) {
        try {
          // 1단계: 두 부모를 동시에 아기로 변환 (병렬)
          const [babyUrl1, babyUrl2] = await Promise.all([
            callReplicate(token, ageV, buildAgeRegressInput(ageRegressVersion, url1, 2)),
            callReplicate(token, ageV, buildAgeRegressInput(ageRegressVersion, url2, 2)),
          ]);
          // 2단계: 두 아기 face-swap (ratio>=50 엄마 우세, 아빠 사진에 엄마얼굴 swap)
          const momDominant = ratio >= 50;
          const faceUrl = momDominant ? babyUrl1 : babyUrl2;
          const targetUrl = momDominant ? babyUrl2 : babyUrl1;
          const finalUrl = await callReplicate(token, swapV, buildSwapInput(swapVersion, faceUrl, targetUrl));
          return NextResponse.json({ swap_url: finalUrl, ratio, mode: "age-regress-pipeline", babyUrl1, babyUrl2 });
        } catch (e) {
          console.error("[baby-face-swap] age-regress pipeline failed, falling back:", e);
        }
      }
    }

    // 2) face-mix 전용 모델
    if (mixVersion) {
      const v = await resolveModelVersion(token, mixVersion);
      if (v) {
        try {
          const out = await callReplicate(token, v, buildMixInput(url1, url2, ratio));
          return NextResponse.json({ swap_url: out, ratio, mode: "face-mix" });
        } catch (e) {
          console.error("[baby-face-swap] face-mix failed, falling back to face-swap:", e);
        }
      }
    }

    // 3) face-swap 폴백 — 우세한 부모 얼굴을 비우세 부모 사진 위에 swap
    if (!swapVersion) {
      return NextResponse.json({
        swap_url: null,
        error: "REPLICATE_FACE_SWAP_VERSION 미설정",
      });
    }

    const swapV = await resolveModelVersion(token, swapVersion);
    if (!swapV) {
      return NextResponse.json({ swap_url: null, error: `face-swap 모델 버전 조회 실패 (${swapVersion})` });
    }

    // ratio>=50: 엄마 얼굴을 아빠 사진에 (엄마 닮은 결과)
    // ratio<50:  아빠 얼굴을 엄마 사진에 (아빠 닮은 결과)
    const momDominant = ratio >= 50;
    const faceUrl = momDominant ? url1 : url2;     // 우세 부모 얼굴
    const targetUrl = momDominant ? url2 : url1;   // 비우세 부모 사진(배경)

    try {
      const swapUrl = await callReplicate(token, swapV, buildSwapInput(swapVersion, faceUrl, targetUrl));
      return NextResponse.json({ swap_url: swapUrl, ratio, mode: "face-swap-fallback", momDominant });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Replicate 호출 실패";
      return NextResponse.json({
        swap_url: null,
        error: msg,
        debug: { swapVersion, resolvedSwapV: swapV },
      });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "face-swap 처리 오류";
    return NextResponse.json({ swap_url: null, error: msg }, { status: 500 });
  }
}
