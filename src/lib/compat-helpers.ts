// 궁합 7종(gwansang-compat/parent-child-compat/pet-owner-compat) 공통 안정화 유틸
// v(2026-07-09): 라이브 테스트에서 발견된 3대 치명 버그(점수 흔들림/변수 미치환/파싱 실패 시 빈 값 노출) 공통 수정

// 문자열 시드 → 결정적 해시 (같은 seed면 항상 같은 값)
function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Call-1에서 확정된 type_a/type_b(+선택적 salt)로 점수를 고정 — Call-2 자유생성(temperature 0.7) 흔들림 원인 제거
export function lockedScore(seedParts: string[], min = 60, max = 96): number {
  const seed = seedParts.filter(Boolean).join("|");
  if (!seed) return min;
  return min + (hashSeed(seed) % (max - min + 1));
}

export function gradeSABC(score: number): string {
  return score >= 90 ? "S" : score >= 80 ? "A" : score >= 65 ? "B" : "C";
}

// 가족 궁합은 기본 높게(80~99, C 없음) — parent-child-compat 전용 스케일
export function gradeSAB(score: number): string {
  return score >= 92 ? "S" : score >= 85 ? "A" : "B";
}

// Gemini가 {nm1}/{nm2}/{nm} 같은 템플릿 토큰을 실제 이름으로 치환 못하고 그대로 남기는 경우의 안전망.
// 모든 string 필드를 재귀적으로 순회해 남은 토큰을 강제 치환.
export function fillNameTokens<T>(value: T, tokenMap: Record<string, string>): T {
  if (typeof value === "string") {
    let out: string = value;
    for (const [token, name] of Object.entries(tokenMap)) {
      if (!name) continue;
      out = out.split(token).join(name);
    }
    return out as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => fillNameTokens(v, tokenMap)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = fillNameTokens(v, tokenMap);
    }
    return out as unknown as T;
  }
  return value;
}

// Call-2 응답이 문법적으로는 유효한 JSON이어도 핵심 필드가 비어있으면(반쪽짜리 응답)
// 그대로 렌더링하지 않고 에러로 처리하기 위한 검증. 문제 있으면 에러 메시지 문자열, 없으면 null 반환.
export function validateCompatResult(parsed: Record<string, unknown> | null | undefined): string | null {
  if (!parsed) return "AI 응답이 비어있습니다.";
  if (typeof parsed.score !== "number" || Number.isNaN(parsed.score)) return "score 필드 누락/오류";
  if (typeof parsed.chemistry_name !== "string" || !parsed.chemistry_name.trim()) return "chemistry_name 필드 누락";
  const pa = parsed.person_a as Record<string, unknown> | undefined;
  const pb = parsed.person_b as Record<string, unknown> | undefined;
  if (!pa || typeof pa.type_name !== "string" || !pa.type_name.trim()) return "person_a.type_name 필드 누락";
  if (!pb || typeof pb.type_name !== "string" || !pb.type_name.trim()) return "person_b.type_name 필드 누락";
  const sections = parsed.sections as Record<string, { body?: unknown }> | undefined;
  if (!sections || typeof sections.main?.body !== "string" || !sections.main.body.trim()) return "sections.main 필드 누락";
  return null;
}
