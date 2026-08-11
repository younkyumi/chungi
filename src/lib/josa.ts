/**
 * 한글 조사 자동 선택.
 *
 * 🚨 왜 필요한가 (2026-08-11 기질도 검수)
 * 문장에 들어갈 단어가 런타임에 정해지는 곳(기질도 strengths, 검색어 등)에서
 * 조사를 문장에 하드코딩할 수 없어 "배려을(를)" "배려이(가)" 같은 괄호 폴백이
 * 그대로 화면에 찍히거나, "배려과 전략적 사고을"처럼 틀린 조사가 나갔다.
 *
 * 마지막 글자의 받침 유무로 판별한다. 한글 음절이 아니면(영문·숫자·기호) 받침 없음으로 처리.
 *
 * @param word     조사를 붙일 단어
 * @param withJong 받침이 있을 때 붙일 조사 (을·과·이·은·으로)
 * @param noJong   받침이 없을 때 붙일 조사 (를·와·가·는·로)
 *
 * @example josa("배려","과","와")      // "배려와"
 * @example josa("감수성","을","를")    // "감수성을"
 * @example josa("전략적 사고","을","를") // "전략적 사고를"
 */
export function josa(word: string | null | undefined, withJong: string, noJong: string): string {
  const w = String(word ?? "").trim();
  if (!w) return w;
  const code = w.charCodeAt(w.length - 1);
  const hasJong = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return w + (hasJong ? withJong : noJong);
}

/**
 * 조사만 반환 (단어는 빼고).
 * 따옴표·괄호가 단어를 감싸서 단어와 조사를 붙여 쓸 수 없을 때 — 예: `'검색어'와 일치하는`
 * @example `'${q}'${josaOnly(q,"과","와")} 일치하는 기록이 없어요`
 */
export function josaOnly(word: string | null | undefined, withJong: string, noJong: string): string {
  const w = String(word ?? "").trim();
  if (!w) return noJong;
  const code = w.charCodeAt(w.length - 1);
  const hasJong = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return hasJong ? withJong : noJong;
}

/** 자주 쓰는 조합 단축형 — josa(w,"을","를") 처럼 매번 쌍을 적지 않아도 되게 */
export const eulReul = (w?: string | null) => josa(w, "을", "를");
export const iGa = (w?: string | null) => josa(w, "이", "가");
export const eunNeun = (w?: string | null) => josa(w, "은", "는");
export const gwaWa = (w?: string | null) => josa(w, "과", "와");
