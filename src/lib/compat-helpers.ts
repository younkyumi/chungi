// 궁합 7종(gwansang-compat/parent-child-compat/pet-owner-compat) 공통 안정화 유틸
// v(2026-07-09): 라이브 테스트에서 발견된 3대 치명 버그(점수 흔들림/변수 미치환/파싱 실패 시 빈 값 노출) 공통 수정
// v(2026-07-14): type_name 흔들림 fix — 이전엔 Call-1이 매번 새 이름을 "창작"해서 같은 사진도 재분석하면
// 다른 유형명이 나왔음(예: "해맑은 사슴상" → "조화로운 미인상"). 기존에 이미 있던 관상짤/아기관상/댕댕냥냥
// 20종 캐릭터 목록을 재사용해 "닫힌 후보 중 선택"으로 전환 — 새 이름은 임의로 만들지 않음([[feedback_no_arbitrary_naming]]).

// 관상짤(gwansang-zal) / 내관상보기(face-reading-premium)와 동일한 성인용 20종
export const GWANSANG_20 = [
  "황금손 미다스상", "강남 건물주상", "지갑 수호신상", "도파민 플렉서상", "유죄 인간 폭스상",
  "얼굴 천재 프리패스상", "워커홀릭 갓생러상", "순도100% 진국상", "인간 챗GPT상", "갓벽한 대장상",
  "알빠노 마이웨이상", "무해한 힐러상", "영앤리치 예비 CEO상", "디테일 변태 장인상", "미친 감성 아티스트상",
  "프로 역마살러상", "쩝쩝 박사 먹방러상", "럭키 비키상", "인간 알고리즘상", "겉바속촉 츤데레상",
];

// 우리아기관상(baby-gwansang)과 동일한 아동용 20종
export const BABY_GWANSANG_20 = [
  "세상을 밝히는 꼬마 태양", "복덩이 황금 아기돼지", "쏙쏙 모으는 알뜰 햄찌", "날아오를 아기 학", "영리한 아기 여우",
  "눈부신 꽃사슴 베이비", "부지런한 똑똑 펭귄", "세상 순한 포근 강아지", "지혜로운 아기 부엉이", "용감한 꼬마 사자왕",
  "돌진하는 뚝심 베이비", "사랑 듬뿍 포근 양", "하늘을 품은 아기 용", "눈썰미 만점 똘똘이", "감성 만개 나비 베이비",
  "세계를 누빌 아기 새", "냠냠 먹보 다람쥐", "행운 듬뿍 클로버 베이비", "반짝반짝 별빛 아기", "도도한 아기 호랑이",
];

// 댕댕상/냥냥상(pet-gwansang)과 동일한 반려동물용 20종 (강아지·고양이 공용, 원본도 종 무관 관상 기반 매칭)
export const PET_GWANSANG_20 = [
  "돈복 부자상", "럭셔리 금수저상", "야무진 알뜰상", "감성 아티스트상", "홀리는 매혹가상",
  "비주얼 갓상", "갓생러 워커홀릭상", "세상 순한 천사상", "한 방에 마스터 천재상", "카리스마 대장상",
  "마이웨이 야성상", "옆에 있어 주는 힐러상", "도도한 보스상", "디테일 변태 장인상", "비오는 날 감성상",
  "어디든 달려가는 모험상", "쩝쩝 박사 먹방상", "만나면 행운 오는 럭키상", "패턴 분석왕상", "안 좋아하는 척 츤데레상",
];

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

// Call-1이 지시받은 닫힌 후보 목록(list) 중에서 실제로 골랐는지 검증하고, 목록 밖 이름을 냈거나
// 응답이 아예 없으면 이미지 데이터 기반 결정론적 해시로 안전하게 폴백 선택 (랜덤 아님 — 같은 사진이면 항상 같은 폴백).
export function pickFromList(raw: string | null | undefined, list: string[], fallbackSeed: string): string {
  if (raw && list.includes(raw)) return raw;
  return list[lockedScore([fallbackSeed], 0, list.length - 1)];
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
