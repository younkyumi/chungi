// Gemini JSON 응답 파싱 — 다양한 포맷 폴백 처리
// 1) ```json ... ``` 마크다운 코드 블록
// 2) {...} regex (lazy)
// 3) trailing comma 제거 후 재시도
// 4) single quote → double quote 변환 후 재시도
// 실패 시 null 반환 (호출자가 에러 처리)
export function parseGeminiJson(rawText: string): any | null {
  if (!rawText) return null;
  const candidates: string[] = [];

  // 1) 마크다운 코드 블록 안의 JSON
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) candidates.push(fenceMatch[1].trim());

  // 2) 첫 { 부터 마지막 } 까지 (greedy — 중첩 객체 모두 포함)
  const greedyMatch = rawText.match(/\{[\s\S]*\}/);
  if (greedyMatch) candidates.push(greedyMatch[0]);

  // 3) raw 그대로
  candidates.push(rawText.trim());

  for (const c of candidates) {
    // 직접 파싱
    try { return JSON.parse(c); } catch {}
    // trailing comma 제거 후
    try {
      const cleaned = c.replace(/,(\s*[}\]])/g, "$1");
      return JSON.parse(cleaned);
    } catch {}
    // single quote → double quote (간단한 케이스만)
    try {
      const dq = c.replace(/'([^']*)'(\s*:)/g, '"$1"$2').replace(/:\s*'([^']*)'/g, ': "$1"');
      return JSON.parse(dq);
    } catch {}
  }
  return null;
}
