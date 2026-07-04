const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/';

// 관상짤 결과카드 (22장)
export function getGwansangCardUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}gwansang-cards/gwansang_${String(id).padStart(2,'0')}.jpg`;
}

// 조선 초상화 템플릿 (22장)
export function getJoseonTemplateUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}joseon-templates/joseon_${String(id).padStart(2,'0')}.jpg`;
}

// 전생 운세 결과카드 (22장)
export function getPastLifeImageUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}past-life-images/past_life_${String(id).padStart(2,'0')}.jpg`;
}

// 타로 카드 (78장)
export function getTarotCardUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}tarot-cards/tarot_${String(id).padStart(2,'0')}.jpg`;
}

// 12수호신 (12장)
export function getGuardianUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}guardians/guardian_${String(id).padStart(2,'0')}.jpg`;
}

// 기질도 캐릭터 (16장)
export function getGijildoUrl(id: number): string {
  return `${SUPABASE_STORAGE_URL}gijildo-characters/gijildo_${String(id).padStart(2,'0')}.jpg`;
}

// 천기 리포트 배경
export function getReportBgUrl(): string {
  return `${SUPABASE_STORAGE_URL}report-bg/report_bg.jpg`;
}

// 2세 얼굴 결과 이미지
export function getBabyFaceResultUrl(filename: string): string {
  return `${SUPABASE_STORAGE_URL}baby-face-results/${filename}`;
}

// 유저 업로드
export function getUserUploadUrl(filename: string): string {
  return `${SUPABASE_STORAGE_URL}user-uploads/${filename}`;
}
