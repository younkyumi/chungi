// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 천기 사주 단일 엔진 (Single Source of Truth)
// ─────────────────────────────────────────────────────────────────────
// 토대: lunar-typescript (절기·입춘 정확. 입춘 기준 연주 / 절입 기준 월주 / JDN 일주)
// 천기 레이어: 억부용신(강약 판정) · 신살(표 기반) · 한글 라벨
//
// ⚠️ 용신 = 억부법(抑扶) 단일 기준으로 통일 (학파마다 다르므로 하나만 밀고 정직 라벨).
// 해석 텍스트(성격/재물/연애 등)는 이 엔진에 넣지 않는다 — 구조화된 명리 데이터만 반환.
// 모든 사주 소비 콘텐츠(56개)는 이 computeSaju() 하나만 호출하도록 통합한다.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Solar } from "lunar-typescript";

// ─── 한자 → 한글 매핑 ───
const GAN_KR: Record<string, string> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계" };
const ZHI_KR: Record<string, string> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
const GAN_OH: Record<string, OhHang> = { 甲: "목", 乙: "목", 丙: "화", 丁: "화", 戊: "토", 己: "토", 庚: "금", 辛: "금", 壬: "수", 癸: "수" };
const ZHI_OH: Record<string, OhHang> = { 寅: "목", 卯: "목", 巳: "화", 午: "화", 辰: "토", 戌: "토", 丑: "토", 未: "토", 申: "금", 酉: "금", 子: "수", 亥: "수" };
const GAN_YANG: Record<string, boolean> = { 甲: true, 乙: false, 丙: true, 丁: false, 戊: true, 己: false, 庚: true, 辛: false, 壬: true, 癸: false };
const SS_KR: Record<string, string> = { 比肩: "비견", 劫财: "겁재", 劫財: "겁재", 食神: "식신", 伤官: "상관", 傷官: "상관", 偏财: "편재", 偏財: "편재", 正财: "정재", 正財: "정재", 偏官: "편관", 正官: "정관", 偏印: "편인", 正印: "정인" };

export type OhHang = "목" | "화" | "토" | "금" | "수";

// 십신 → 일간 부조(아군: 비겁·인성) vs 설기(식상·재·관) 분류 → 억부 강약 판정용
const SIPSIN_BUJO = new Set(["比肩", "劫财", "劫財", "偏印", "正印"]); // 일간을 돕는 세력
// 나머지(식신·상관·편재·정재·편관·정관) = 설기/극 세력

// ─── 신살 표 (일간/지지 삼합 기준) ───
const CHEONEUL: Record<string, string[]> = { 甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"], 乙: ["子", "申"], 己: ["子", "申"], 丙: ["亥", "酉"], 丁: ["亥", "酉"], 辛: ["寅", "午"], 壬: ["巳", "卯"], 癸: ["巳", "卯"] };
const MUNCHANG: Record<string, string> = { 甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申", 己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯" };
const YANGIN: Record<string, string> = { 甲: "卯", 丙: "午", 戊: "午", 庚: "酉", 壬: "子" }; // 양간만
// 삼합국 기준 (일지 앵커): 도화/역마/화개
const SAMHAP: Record<string, { do: string; yeokma: string; hwagae: string }> = {
  寅: { do: "卯", yeokma: "申", hwagae: "戌" }, 午: { do: "卯", yeokma: "申", hwagae: "戌" }, 戌: { do: "卯", yeokma: "申", hwagae: "戌" },
  申: { do: "酉", yeokma: "寅", hwagae: "辰" }, 子: { do: "酉", yeokma: "寅", hwagae: "辰" }, 辰: { do: "酉", yeokma: "寅", hwagae: "辰" },
  巳: { do: "午", yeokma: "亥", hwagae: "丑" }, 酉: { do: "午", yeokma: "亥", hwagae: "丑" }, 丑: { do: "午", yeokma: "亥", hwagae: "丑" },
  亥: { do: "子", yeokma: "巳", hwagae: "未" }, 卯: { do: "子", yeokma: "巳", hwagae: "未" }, 未: { do: "子", yeokma: "巳", hwagae: "未" },
};

export interface SajuPillar {
  ganHj: string; ganKr: string; // 천간 한자/한글
  zhiHj: string; zhiKr: string; // 지지 한자/한글
  ganOh: OhHang; zhiOh: OhHang; // 오행
  sipsin: string;               // 천간 십신 (한글, 일간 제외)
  jijangSipsin: string[];       // 지장간 십신
}
export interface DaeunStep { ganzhi: string; ganzhiKr: string; startAge: number; }
export interface SajuResult {
  pillars: { year: SajuPillar; month: SajuPillar; day: SajuPillar; hour: SajuPillar | null };
  ilgan: string; ilganHj: string; ilganOh: OhHang; ilganYang: boolean;
  ohang: Record<OhHang, number>;     // 오행 분포 (지장간 포함 가중)
  gangyak: "신강" | "신약" | "중화";   // 일간 강약
  gangyakScore: number;              // 부조-설기 점수 (양수=강)
  yongsin: OhHang;                   // 억부용신 (천기 기준)
  yongsinReason: string;
  gyeokguk: string;                  // 격국 (월지 본기 십신 기반)
  sinsal: string[];                  // 신살 (표 기반 실제 계산)
  daeun: { forward: boolean; startAge: number; steps: DaeunStep[] };
  lunar: { year: number; month: number; day: number; isLeap: boolean; text: string };
  meta: { method: "억부"; engine: "lunar-typescript"; solarTime: boolean };
}

// 한자 → 인덱스 (레거시 어댑터용: 천간 0=甲..9=癸, 지지 0=子..11=亥)
const GAN_IDX: Record<string, number> = { 甲: 0, 乙: 1, 丙: 2, 丁: 3, 戊: 4, 己: 5, 庚: 6, 辛: 7, 壬: 8, 癸: 9 };
const ZHI_IDX: Record<string, number> = { 子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5, 午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11 };

/**
 * 레거시 어댑터 — 구 `_getSaju()`와 동일한 숫자 인덱스 반환 모양.
 * 내부만 정확한 엔진(절기·입춘)으로 교체. 다운스트림 56개 소비처는 수정 불필요.
 * 반환: { year:{cg,jj}, month:{cg,jj}, day:{cg,jj}, hour:{cg,jj}|null, ilgan }
 */
export function legacyPillars(year: number, month: number, day: number, hour?: number | null) {
  const solar = Solar.fromYmdHms(year, month, day, hour ?? 12, 0, 0);
  const ec = solar.getLunar().getEightChar();
  const P = (g: string, z: string) => ({ cg: GAN_IDX[g], jj: ZHI_IDX[z] });
  return {
    year: P(ec.getYearGan(), ec.getYearZhi()),
    month: P(ec.getMonthGan(), ec.getMonthZhi()),
    day: P(ec.getDayGan(), ec.getDayZhi()),
    hour: hour != null ? P(ec.getTimeGan(), ec.getTimeZhi()) : null,
    ilgan: GAN_IDX[ec.getDayGan()],
  };
}

const OH_GEN: Record<OhHang, OhHang> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" }; // 생
const OH_GEN_REV: Record<OhHang, OhHang> = { 화: "목", 토: "화", 금: "토", 수: "금", 목: "수" }; // 나를 생하는 것(인성)
const OH_KE: Record<OhHang, OhHang> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" }; // 내가 극(재)

function parseBirth(birth: string): [number, number, number] {
  const p = (birth || "").replace(/[^0-9]/g, "-").split("-").filter(Boolean).map(Number);
  return [p[0] || 1990, p[1] || 1, p[2] || 1];
}
function parseHour(timeStr?: string | null): number | null {
  if (!timeStr || timeStr === "모름") return null;
  const h = parseInt(String(timeStr), 10);
  return isNaN(h) ? null : h;
}

/**
 * 천기 사주 단일 엔진. 생년월일(+시) → 정밀 만세력 + 억부용신 + 신살 + 대운.
 * @param birth "YYYY-MM-DD" (양력)
 * @param timeStr "14" 또는 "모름" (24시간 단위 시작시 또는 미상)
 * @param gender 1=남, 0=여 (대운 순역 판정용). 미지정 시 대운 생략 가능하나 기본 남.
 */
export function computeSaju(birth: string, timeStr?: string | null, gender: 0 | 1 = 1): SajuResult {
  const [y, m, d] = parseBirth(birth);
  const hour = parseHour(timeStr);
  const solar = Solar.fromYmdHms(y, m, d, hour ?? 12, 0, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const ilganHj = ec.getDayGan();
  const ilganOh = GAN_OH[ilganHj];
  const ilganYang = GAN_YANG[ilganHj];

  const mk = (ganHj: string, zhiHj: string, ssGan: string, ssZhi: string[]): SajuPillar => ({
    ganHj, ganKr: GAN_KR[ganHj], zhiHj, zhiKr: ZHI_KR[zhiHj],
    ganOh: GAN_OH[ganHj], zhiOh: ZHI_OH[zhiHj],
    sipsin: SS_KR[ssGan] || "", jijangSipsin: (ssZhi || []).map((s) => SS_KR[s] || ""),
  });
  const yearP = mk(ec.getYearGan(), ec.getYearZhi(), ec.getYearShiShenGan(), ec.getYearShiShenZhi());
  const monthP = mk(ec.getMonthGan(), ec.getMonthZhi(), ec.getMonthShiShenGan(), ec.getMonthShiShenZhi());
  const dayP = mk(ec.getDayGan(), ec.getDayZhi(), "일간", ec.getDayShiShenZhi());
  const hourP = hour != null ? mk(ec.getTimeGan(), ec.getTimeZhi(), ec.getTimeShiShenGan(), ec.getTimeShiShenZhi()) : null;

  // ─── 오행 분포 (천간×2, 지지 본기×3 ; 지장간은 십신으로 반영) ───
  const ohang: Record<OhHang, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const pillarsArr = [yearP, monthP, dayP, ...(hourP ? [hourP] : [])];
  pillarsArr.forEach((p) => { ohang[p.ganOh] += 2; ohang[p.zhiOh] += 3; });

  // ─── 억부 강약: 부조(비겁·인성) vs 설기(식상·재·관). 월지 가중 ↑ ───
  // 라이브러리 십신(원문 한자) 기준으로 판정 (일간 제외 천간 + 지지 본기 십신)
  const ssRawGan = [ec.getYearShiShenGan(), ec.getMonthShiShenGan(), ...(hour != null ? [ec.getTimeShiShenGan()] : [])];
  const ssRawZhi: [string[], number][] = [
    [ec.getYearShiShenZhi(), 1], [ec.getMonthShiShenZhi(), 3], [ec.getDayShiShenZhi(), 2],
    ...(hour != null ? ([[ec.getTimeShiShenZhi(), 1]] as [string[], number][]) : []),
  ];
  let score = 0; // 양수 = 신강
  ssRawGan.forEach((s) => { score += SIPSIN_BUJO.has(s) ? 1 : -1; });
  ssRawZhi.forEach(([arr, w]) => { const main = arr[0]; if (main) score += (SIPSIN_BUJO.has(main) ? 1 : -1) * w; });
  // 일간 자체는 통근(비겁)이므로 약한 가산
  score += 1;
  const gangyak: SajuResult["gangyak"] = score >= 2 ? "신강" : score <= -2 ? "신약" : "중화";

  // ─── 억부용신 (천기 기준) ───
  // 신강 → 설기(식상=일간이 생) 우선, 차선 극(재). 신약 → 생조(인성=나를 생) 우선, 차선 비겁(동일 오행).
  let yongsin: OhHang; let yongsinReason: string;
  if (gangyak === "신약") {
    yongsin = OH_GEN_REV[ilganOh];
    yongsinReason = `일간(${ilganOh})이 약해(신약) 기운을 보태주는 인성 오행 '${yongsin}'을 용신으로 삼아요.`;
  } else if (gangyak === "신강") {
    yongsin = OH_GEN[ilganOh];
    yongsinReason = `일간(${ilganOh})이 강해(신강) 기운을 풀어주는 식상 오행 '${yongsin}'을 용신으로 삼아요.`;
  } else {
    // 중화 → 사주에 가장 부족한 오행으로 균형
    yongsin = (Object.entries(ohang).sort((a, b) => a[1] - b[1])[0][0]) as OhHang;
    yongsinReason = `일간이 균형(중화)에 가까워 가장 부족한 오행 '${yongsin}'으로 균형을 잡아요.`;
  }

  // ─── 격국 (월지 본기 십신) ───
  const monthZhiMain = monthP.jijangSipsin[0] || monthP.sipsin || "";
  const gyeokMap: Record<string, string> = { 비견: "건록격", 겁재: "양인격", 식신: "식신격", 상관: "상관격", 편재: "편재격", 정재: "정재격", 편관: "편관격", 정관: "정관격", 편인: "편인격", 정인: "정인격" };
  const gyeokguk = gyeokMap[monthZhiMain] || "정관격";

  // ─── 신살 (표 기반) ───
  const allZhi = pillarsArr.map((p) => p.zhiHj);
  const dayZhi = ec.getDayZhi();
  const sinsal: string[] = [];
  if (allZhi.some((z) => CHEONEUL[ilganHj]?.includes(z))) sinsal.push("천을귀인 👑");
  if (MUNCHANG[ilganHj] && allZhi.includes(MUNCHANG[ilganHj])) sinsal.push("문창귀인 ✍️");
  if (YANGIN[ilganHj] && allZhi.includes(YANGIN[ilganHj])) sinsal.push("양인살 ⚔️");
  const sh = SAMHAP[dayZhi];
  if (sh) {
    if (allZhi.includes(sh.do)) sinsal.push("도화살 🌸");
    if (allZhi.includes(sh.yeokma)) sinsal.push("역마살 🐎");
    if (allZhi.includes(sh.hwagae)) sinsal.push("화개살 🎭");
  }

  // ─── 대운 ───
  const yun = ec.getYun(gender);
  const daeunSteps: DaeunStep[] = yun.getDaYun().slice(1, 9).map((dd: any) => {
    const gz = dd.getGanZhi();
    return { ganzhi: gz, ganzhiKr: (GAN_KR[gz[0]] || gz[0]) + (ZHI_KR[gz[1]] || gz[1]), startAge: dd.getStartAge() };
  });

  return {
    pillars: { year: yearP, month: monthP, day: dayP, hour: hourP },
    ilgan: GAN_KR[ilganHj], ilganHj, ilganOh, ilganYang,
    ohang, gangyak, gangyakScore: score, yongsin, yongsinReason, gyeokguk, sinsal,
    daeun: { forward: yun.isForward ? yun.isForward() : true, startAge: yun.getStartYear ? yun.getStartYear() : 0, steps: daeunSteps },
    lunar: { year: lunar.getYear(), month: lunar.getMonth(), day: lunar.getDay(), isLeap: lunar.getMonth() < 0, text: `음력 ${Math.abs(lunar.getMonth())}월 ${lunar.getDay()}일` },
    meta: { method: "억부", engine: "lunar-typescript", solarTime: false },
  };
}
