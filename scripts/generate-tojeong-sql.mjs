// 토정비결 메모장 → INSERT SQL 변환기
// 입력: public/클순이와 자료수집중/콘텐츠의 정확도를 위한 자료.txt
// 출력: public/클순이와 자료수집중/tojeong_inserts.sql
// 형식: INSERT INTO tojeong_gwe (gwe_number, month, content) VALUES (...) ON CONFLICT DO NOTHING;

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "클순이와 자료수집중", "콘텐츠의 정확도를 위한 자료.txt");
const OUT = path.join(ROOT, "public", "클순이와 자료수집중", "tojeong_inserts.sql");

const text = fs.readFileSync(SRC, "utf8");
const lines = text.split(/\r?\n/);

// 패턴: | **숫자** | 컬1 | 컬2 | ... | 컬12 |
// 또는: | 숫자 | 컬1 | ... |  (강조 없음 케이스)
// 정확히 12개 컬럼 + 괘번호 = 13개 셀
const rowRegex = /^\|\s*\*?\*?\s*(\d{3})\s*\*?\*?\s*\|(.+)\|\s*$/;

const seen = new Map(); // gwe_number → [12 contents]
let totalRowsParsed = 0;
let skippedShort = 0;

for (const line of lines) {
  const m = line.match(rowRegex);
  if (!m) continue;
  const gwe = parseInt(m[1], 10);
  if (Number.isNaN(gwe)) continue;
  const cellsRaw = m[2].split("|").map(c => c.trim());
  // 마지막 빈 셀 제거
  while (cellsRaw.length > 0 && cellsRaw[cellsRaw.length - 1] === "") cellsRaw.pop();
  if (cellsRaw.length !== 12) {
    skippedShort++;
    continue;
  }
  // 빈 컨텐츠 체크
  const allEmpty = cellsRaw.every(c => !c);
  if (allEmpty) continue;
  totalRowsParsed++;
  // 중복 괘번호: 마지막 것이 우선 (덮어쓰기)
  seen.set(gwe, cellsRaw);
}

const sortedGwe = [...seen.keys()].sort((a, b) => a - b);

console.log(`총 파싱된 표 행: ${totalRowsParsed}`);
console.log(`고유 괘 수: ${sortedGwe.length}`);
console.log(`12개 컬럼 아닌 행 스킵: ${skippedShort}`);
console.log(`첫 5괘: ${sortedGwe.slice(0, 5).join(", ")}`);
console.log(`마지막 5괘: ${sortedGwe.slice(-5).join(", ")}`);

// SQL 생성
function escSql(s) {
  return s
    .replace(/'/g, "''")          // 작은따옴표 escape
    .replace(/\r?\n/g, " ")        // 줄바꿈 → 공백
    .replace(/\s+/g, " ")          // 다중공백 → 1공백
    .trim();
}

const header = `-- ============================================================
-- 토정비결 INSERT (자동 생성 — generate-tojeong-sql.mjs)
-- 원본: public/클순이와 자료수집중/콘텐츠의 정확도를 위한 자료.txt
-- 총 ${sortedGwe.length} 괘 × 12개월 = ${sortedGwe.length * 12} 행
-- 실행 전: chungi_db_full00.sql 의 tojeong_gwe 테이블이 이미 생성되어 있어야 함
-- ============================================================

`;

const valueRows = [];
for (const gwe of sortedGwe) {
  const cells = seen.get(gwe);
  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    const content = escSql(cells[i] || "");
    if (!content) continue; // 빈 셀 스킵
    valueRows.push(`(${gwe}, ${month}, '${content}')`);
  }
}

// 너무 큰 INSERT 한 줄은 부담스러우니 100행씩 나눠서 INSERT
const CHUNK = 100;
const sqlChunks = [];
for (let i = 0; i < valueRows.length; i += CHUNK) {
  const chunk = valueRows.slice(i, i + CHUNK);
  const stmt = `INSERT INTO tojeong_gwe (gwe_number, month, content) VALUES\n  ${chunk.join(",\n  ")}\nON CONFLICT (gwe_number, month) DO NOTHING;`;
  sqlChunks.push(stmt);
}

const out = header + sqlChunks.join("\n\n") + "\n";
fs.writeFileSync(OUT, out, "utf8");

console.log(`\n✅ ${OUT}`);
console.log(`총 INSERT 행: ${valueRows.length}`);
console.log(`SQL 파일 크기: ${(out.length / 1024).toFixed(1)}KB`);
