// 한자 CSV → corpus JSON 변환 스크립트
// 입력 1: hanja-raw.csv (rycont/hanja-grade-dataset, 5978자, 획수 있음)
// 입력 2: hanja-naver.csv (rutopio/Korean-Name-Hanja-Charset, 8095자, 획수 없음 - 뜻만)
// 출력: public/hanja-corpus.json (merge, 약 8,632자)
import fs from "fs";
import path from "path";

const SRC = "hanja-raw.csv";
const SRC2 = "hanja-naver.csv";
const SRC3 = "hanja-gov.csv";
const OUT = "public/hanja-corpus.json";

// 음령오행 (한글 자음별 → 오행)
function ohaengFromSound(sound) {
  if (!sound) return "토";
  const ch = sound.charAt(0);
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return "토";
  const cho = Math.floor(code / 588);
  // 0:ㄱ 1:ㄲ 2:ㄴ 3:ㄷ 4:ㄸ 5:ㄹ 6:ㅁ 7:ㅂ 8:ㅃ 9:ㅅ 10:ㅆ 11:ㅇ 12:ㅈ 13:ㅉ 14:ㅊ 15:ㅋ 16:ㅌ 17:ㅍ 18:ㅎ
  if ([0,1,15].includes(cho)) return "목";       // ㄱㅋ
  if ([2,3,4,5,16].includes(cho)) return "화";    // ㄴㄷㄹㅌ
  if ([6,7,8,17].includes(cho)) return "수";      // ㅁㅂㅍ
  if ([9,10,12,13,14].includes(cho)) return "금"; // ㅅㅈㅊ
  if ([11,18].includes(cho)) return "토";         // ㅇㅎ
  return "토";
}

// 간단 CSV 파서 (쉼표 + 따옴표 처리)
function parseCSV(text) {
  const rows = [];
  const lines = text.split("\n");
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.trim()) continue;
    const cells = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; continue; }
      if (c === "," && !inQ) { cells.push(cur); cur = ""; continue; }
      cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  return rows;
}

// meaning [[['집'], ['가']]] 같은 이중 배열에서 첫 뜻 추출
function extractMeaning(raw) {
  if (!raw) return "";
  // [[['집'], ['가']]] → 집
  const m = raw.match(/\[\[?\['([^']+)'/);
  return m ? m[1] : "";
}

const csv = fs.readFileSync(SRC, "utf8");
const rows = parseCSV(csv);
const header = rows.shift();
const idxSound = header.indexOf("main_sound");
const idxHanja = header.indexOf("hanja");
const idxMean = header.indexOf("meaning");
const idxStr = header.indexOf("total_strokes");

const seen = new Set();
const out = [];

// === 1차: 한국어문회 (획수 있음) ===
for (const r of rows) {
  if (!r[idxHanja] || !r[idxSound]) continue;
  const c = r[idxHanja].trim();
  if (seen.has(c)) continue;
  seen.add(c);
  const y = r[idxSound].trim();
  const m = extractMeaning(r[idxMean]);
  const s = parseInt(r[idxStr]) || 0;
  if (!s) continue;
  const oh = ohaengFromSound(y);
  out.push({ c, y, m, s, oh });
}
const fromGrade = out.length;
console.log(`📊 1차 (한국어문회 획수있음): ${fromGrade}자`);

// === 2차: 네이버 (대법원 인명용) — 획수 없는 한자도 검색용으로 추가 ===
const csv2 = fs.readFileSync(SRC2, "utf8");
const rows2 = parseCSV(csv2);
const header2 = rows2.shift();
const nIdxSound = header2.indexOf("hangul");
const nIdxHanja = header2.indexOf("hanja");
const nIdxMean = header2.indexOf("meaning");

let added = 0;
for (const r of rows2) {
  if (!r[nIdxHanja] || !r[nIdxSound]) continue;
  const c = r[nIdxHanja].trim();
  if (seen.has(c)) continue;
  seen.add(c);
  const y = r[nIdxSound].trim();
  // meaning 형식: "옳을 가" → "옳을"
  let m = (r[nIdxMean] || "").trim();
  m = m.replace(/\s+[가-힣]+$/, "").trim() || m; // 끝의 음 제거
  const oh = ohaengFromSound(y);
  out.push({ c, y, m, s: 0, oh }); // s:0 = 획수 미상 (검색에서만 활용)
  added++;
}
console.log(`📊 2차 (네이버 인명용 획수없음): +${added}자`);

// === 3차: 대법원 (gov) — 뜻도 없는 인명용 한자 (unicode 코드 → 한자 변환) ===
const csv3 = fs.readFileSync(SRC3, "utf8");
const rows3 = parseCSV(csv3);
const header3 = rows3.shift();
const gIdxSound = header3.indexOf("hangul");
const gIdxUnicode = header3.indexOf("unicode");

let added3 = 0;
for (const r of rows3) {
  if (!r[gIdxSound] || !r[gIdxUnicode]) continue;
  const code = r[gIdxUnicode].trim();
  if (!code) continue;
  // unicode 코드포인트 → 한자 변환
  let c;
  try { c = String.fromCodePoint(parseInt(code, 16)); } catch { continue; }
  if (!c || seen.has(c)) continue;
  seen.add(c);
  const y = r[gIdxSound].trim();
  const oh = ohaengFromSound(y);
  out.push({ c, y, m: "", s: 0, oh }); // 뜻 없음 + 획수 미상
  added3++;
}
console.log(`📊 3차 (대법원 인명용 뜻없음): +${added3}자`);

// 획수별로 정렬 (s:0은 마지막)
out.sort((a, b) => {
  if (a.s === 0 && b.s !== 0) return 1;
  if (a.s !== 0 && b.s === 0) return -1;
  return a.s - b.s || a.y.localeCompare(b.y);
});

fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`✅ 총 ${out.length}자 → ${OUT} (${(fs.statSync(OUT).size/1024).toFixed(1)}KB)`);

// 획수별 통계
const byStroke = {};
for (const it of out) byStroke[it.s] = (byStroke[it.s] || 0) + 1;
console.log("획수별:", Object.entries(byStroke).map(([k,v]) => `${k}획:${v}`).slice(0,12).join(" "));
console.log(`획수 미상(0): ${byStroke[0] || 0}자`);
