// 오행(목화토금수) 기반 행운 아이템 고정 테이블 — 관상류 콘텐츠 계층3(실용정보) 흔들림 fix용 공유 유틸.
// v(2026-07-14): 내관상보기/우리아기관상/댕댕상·냥냥상 감사에서 발견된 "타입(character_type)은 이미 고정했는데
// lucky_color/lucky_direction/lucky_time/lucky_item 등은 안 잠겨서 재분석할 때마다 바뀌던" 패턴 공통 수정.
// 색상 톤은 앱 전역에서 이미 쓰는 오행 색상 체계(새싹그린/불꽃레드/황토골드/실버화이트/딥네이비)와 동일하게 맞춤.

export type Ohang = "목" | "화" | "토" | "금" | "수";
export const OHANG_LIST: Ohang[] = ["목", "화", "토", "금", "수"];

export const OHANG_LUCKY: Record<
  Ohang,
  { color: string; direction: string; time: string; item: string; gem: string; animal: string }
> = {
  목: { color: "그린 계열 (새싹 그린)", direction: "동쪽", time: "새벽 3~5시(인시)", item: "식물 화분·우드 액세서리", gem: "💚 에메랄드 - 지혜", animal: "🦊 여우 - 영민함" },
  화: { color: "레드 계열 (불꽃 레드)", direction: "남쪽", time: "오전 11시~오후 1시(오시)", item: "레드 캔들·립스틱", gem: "💎 자수정 - 집중력", animal: "🐯 호랑이 - 리더십" },
  토: { color: "골드 계열 (황토 골드)", direction: "중앙", time: "오후 1~3시(미시)", item: "골드 액세서리·세라믹 컵", gem: "🔶 호박 - 건강운", animal: "🐢 거북 - 장수" },
  금: { color: "화이트 계열 (실버 화이트)", direction: "서쪽", time: "오후 5~7시(유시)", item: "실버 시계·메탈 펜", gem: "🌟 시트린 - 재물운", animal: "🦅 독수리 - 기상" },
  수: { color: "네이비 계열 (딥 네이비)", direction: "북쪽", time: "밤 11시~새벽 1시(자시)", item: "만년필·블루 노트", gem: "💙 사파이어 - 총명", animal: "🦋 나비 - 감성" },
};

// character_type(1~20 등)을 5개 오행 중 하나로 결정론적 매핑 — 같은 타입이면 항상 같은 오행
export function ohangForType(characterType: number): Ohang {
  return OHANG_LIST[((characterType - 1) % 5 + 5) % 5];
}
