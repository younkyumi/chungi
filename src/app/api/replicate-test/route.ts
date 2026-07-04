import { NextRequest, NextResponse } from "next/server";

// 진단용: Replicate API 연결 상태 확인
// GET /api/replicate-test
// 환경변수 + 토큰 인증 + 모델 조회까지 점검

export const maxDuration = 30;

export async function GET(_req: NextRequest) {
  const token = process.env.REPLICATE_API_TOKEN;
  const swapVersion = process.env.REPLICATE_FACE_SWAP_VERSION;
  const mixVersion = process.env.REPLICATE_FACE_MIX_VERSION;

  const result: any = {
    env: {
      REPLICATE_API_TOKEN: token ? `set (${token.slice(0, 4)}...${token.slice(-4)}, len=${token.length})` : "❌ NOT SET",
      REPLICATE_FACE_SWAP_VERSION: swapVersion || "❌ NOT SET",
      REPLICATE_FACE_MIX_VERSION: mixVersion || "(optional, not set)",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "set" : "❌ NOT SET",
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "set" : "❌ NOT SET",
    },
    checks: {} as any,
  };

  if (!token) {
    result.checks.token = "❌ REPLICATE_API_TOKEN 없음";
    return NextResponse.json(result);
  }

  // 1) 토큰 인증 확인 — account 정보 조회
  try {
    const accRes = await fetch("https://api.replicate.com/v1/account", {
      headers: { "Authorization": `Token ${token}` },
    });
    if (accRes.ok) {
      const acc = await accRes.json();
      result.checks.tokenAuth = `✅ OK — ${acc.username || acc.name || "(no name)"}`;
    } else {
      const errText = await accRes.text();
      result.checks.tokenAuth = `❌ ${accRes.status}: ${errText.substring(0, 200)}`;
      return NextResponse.json(result);
    }
  } catch (e: unknown) {
    result.checks.tokenAuth = `❌ ${e instanceof Error ? e.message : "network error"}`;
    return NextResponse.json(result);
  }

  // 2) 모델 조회 (REPLICATE_FACE_SWAP_VERSION)
  if (swapVersion) {
    if (/^[a-f0-9]{40,}$/i.test(swapVersion)) {
      result.checks.swapModel = `(version hash 직접 입력 — ${swapVersion.slice(0, 8)}...)`;
    } else if (swapVersion.includes("/")) {
      try {
        const modelRes = await fetch(`https://api.replicate.com/v1/models/${swapVersion}`, {
          headers: { "Authorization": `Token ${token}` },
        });
        if (modelRes.ok) {
          const m = await modelRes.json();
          result.checks.swapModel = `✅ ${m.owner}/${m.name} — latest_version=${m.latest_version?.id?.slice(0, 12)}...`;
        } else {
          const errText = await modelRes.text();
          result.checks.swapModel = `❌ ${modelRes.status}: ${errText.substring(0, 200)}`;
        }
      } catch (e: unknown) {
        result.checks.swapModel = `❌ ${e instanceof Error ? e.message : "network error"}`;
      }
    } else {
      result.checks.swapModel = `⚠️ 형식 이상 (owner/model 또는 hash 필요): "${swapVersion}"`;
    }
  }

  // 3) 빌링 상태 — 짧은 더미 prediction 시도해서 402/billing 에러 캐치
  // (실제 호출은 비용 발생하므로 생략 — 빌링 미설정 시 나중에 실제 호출 때 확인됨)

  return NextResponse.json(result);
}
