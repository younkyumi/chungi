/**
 * Gemini generationConfig 안전 빌더 + 응답 진단 로그
 *
 * 🚨 왜 만들었나 (2026-08-10 조선초상화 "뭘 올려도 심령" 사고)
 * Gemini 2.5는 thinking(사고) 토큰도 maxOutputTokens에 포함된다.
 * joseon-portrait가 maxOutputTokens:100 + thinkingBudget:512 였는데,
 * 모델이 사고 단계에서 출력 예산 100을 전부 태우고 finishReason=MAX_TOKENS로
 * 본문이 빈 채 잘림 → JSON 파싱 실패 → 폴백 에러카드(E2 심령)로 떨어졌음.
 * 사진 내용과 무관하게 100% 발생. HTTP 200이라 에러 로그·알림도 안 남아서 오래 안 걸림.
 *
 * 이 파일의 목적:
 *  ① assertGeminiModelChain / logGeminiModel — 폴백 체인에서 실제로 어느 모델을 탔는지 기록
 *  ② inspectGeminiResponse — AI가 빈 응답(백지)을 냈을 때 콘솔에 크게 남김
 *  ③ geminiGenConfig — maxOutputTokens가 thinkingBudget보다 충분히 크지 않으면 즉시 throw.
 *     라우트에서 **모듈 최상단 상수**로 호출하면 `next build` 단계에서 터져서
 *     잘못된 설정이 프로덕션에 배포되는 것 자체를 차단한다.
 *
 * 참고: [[feedback_gemini_thinking_budget]]
 */

/** 답안지(maxOutputTokens)는 연습장(thinkingBudget)의 최소 이 배수여야 함 */
export const THINKING_HEADROOM_RATIO = 2;

export type GeminiGenConfigOptions = {
  /** 어느 라우트인지 — 에러/로그 메시지에 찍힌다 (예: "joseon-portrait/classify") */
  label: string;
  maxOutputTokens: number;
  /** 생략하면 thinkingConfig 자체를 안 붙임. 분류·추출용 짧은 Call은 반드시 0. */
  thinkingBudget?: number;
  temperature?: number;
  responseMimeType?: string;
};

/**
 * ③ 설정 검증 — 잘못된 조합이면 즉시 throw.
 * 라우트 모듈 최상단에서 호출할 것 (핸들러 안에서 호출하면 런타임까지 안 걸린다).
 */
export function geminiGenConfig(o: GeminiGenConfigOptions) {
  const { label, maxOutputTokens, thinkingBudget, temperature, responseMimeType } = o;

  if (!Number.isFinite(maxOutputTokens) || maxOutputTokens <= 0) {
    throw new Error(`[gemini-config:${label}] maxOutputTokens가 유효하지 않습니다: ${maxOutputTokens}`);
  }

  if (thinkingBudget !== undefined && thinkingBudget > 0) {
    const required = thinkingBudget * THINKING_HEADROOM_RATIO;
    if (maxOutputTokens < required) {
      throw new Error(
        `[gemini-config:${label}] 위험한 토큰 설정입니다.\n` +
          `  maxOutputTokens=${maxOutputTokens}, thinkingBudget=${thinkingBudget}\n` +
          `  Gemini 2.5는 thinking 토큰도 maxOutputTokens에 포함되므로, 모델이 사고 단계에서\n` +
          `  출력 예산을 전부 소진하면 본문이 빈 채(finishReason=MAX_TOKENS) 반환됩니다.\n` +
          `  → maxOutputTokens를 ${required} 이상으로 올리거나, 짧은 분류·추출 Call이면 thinkingBudget: 0 으로 두세요.\n` +
          `  (2026-08-10 조선초상화 "뭘 올려도 심령" 사고와 동일한 설정입니다)`
      );
    }
  }

  return {
    ...(temperature !== undefined ? { temperature } : {}),
    maxOutputTokens,
    ...(responseMimeType ? { responseMimeType } : {}),
    ...(thinkingBudget !== undefined ? { thinkingConfig: { thinkingBudget } } : {}),
  };
}

/** ① 폴백 체인 로그 — 어느 모델로 성공했는지 (2.5가 죽어서 2.0으로 넘어간 걸 알 수 있게) */
export function logGeminiModel(label: string, model: string, modelIndex: number, attempt: number) {
  if (modelIndex === 0 && attempt === 0) return; // 1순위 모델 1트 성공 = 정상, 로그 생략
  console.warn(
    `[gemini:${label}] ⚠️ 1순위 모델이 아닌 경로로 응답 — model=${model} (체인 ${modelIndex + 1}번째, ${attempt + 1}트)`
  );
}

export type GeminiInspectResult = {
  ok: boolean;
  finishReason: string;
  rawText: string;
  /** 빈 응답 사유 추정 — 사용자에게 보여줄 게 아니라 로그/디버그용 */
  diagnosis: string | null;
};

/**
 * ② 빈 응답 경고 — AI가 백지를 냈을 때 콘솔에 크게 남기고, 원인을 진단해준다.
 * 호출부는 ok:false면 **절대 "사진이 이상하다"류 에러카드로 폴백하지 말고** 재시도 에러를 반환할 것.
 */
export function inspectGeminiResponse(label: string, geminiData: any, model?: string): GeminiInspectResult {
  const cand = geminiData?.candidates?.[0];
  const finishReason: string = cand?.finishReason || "EMPTY";
  const parts = cand?.content?.parts || [];
  let rawText = "";
  for (const p of parts) if (p?.text) rawText = p.text;

  if (rawText.trim()) {
    return { ok: true, finishReason, rawText, diagnosis: null };
  }

  const usage = geminiData?.usageMetadata || {};
  const thoughts = usage.thoughtsTokenCount;
  const total = usage.candidatesTokenCount ?? usage.totalTokenCount;

  let diagnosis = "원인 불명 — Gemini 응답에 텍스트 파트가 없음";
  if (finishReason === "MAX_TOKENS") {
    diagnosis =
      "maxOutputTokens 초과로 본문이 잘림. thinking 토큰이 출력 예산을 잡아먹었을 가능성이 큼 — " +
      "generationConfig의 maxOutputTokens / thinkingBudget 비율을 확인할 것";
  } else if (finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT") {
    diagnosis = "안전 필터에 걸려 응답이 차단됨";
  } else if (finishReason === "RECITATION") {
    diagnosis = "학습 데이터 인용(recitation) 차단";
  }

  console.error(
    `[gemini:${label}] 🚨 빈 응답(백지) — model=${model || "?"} finishReason=${finishReason} ` +
      `thoughtsTokens=${thoughts ?? "?"} outputTokens=${total ?? "?"}\n` +
      `  진단: ${diagnosis}\n` +
      `  ⚠️ 이 경우 사용자 탓 에러카드로 폴백하지 말 것 (시스템 오류를 "사진이 흐리다"로 오인시킴)`
  );

  return { ok: false, finishReason, rawText, diagnosis };
}
