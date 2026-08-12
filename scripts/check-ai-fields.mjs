// check-ai-fields.mjs — AI 응답을 다룰 때 반복해서 터진 3가지 사고를 빌드 단계에서 잡는다.
//
// 왜 만들었나 (2026-08-13):
//  ① 관상짤 결과에 프롬프트에 없는 "✦ 섹스:" 섹션이 생성돼 전체연령가 콘텐츠에 성적 서술이 노출됐다.
//     렌더가 AI 객체의 키를 전부 순회하고 모르는 키를 폴백 기호로 그리는 구조였다.
//     4회 중 1회만 나오는 확률적 버그라 라이브 검수로는 못 잡는다.
//  ② 수비학·2세얼굴이 AI 문장을 dangerouslySetInnerHTML로 그대로 넣고 있었다.
//     AI 응답엔 사용자가 등록한 이름이 섞여 나오므로 이름에 인라인 핸들러를 심으면 실행된다.
//  ③ persona·mbti_guess처럼 "프롬프트에는 있는데 서버가 주입하지 않는" 판정성 필드가
//     재분석마다 값이 바뀌었다. 눈으로는 한참 뒤에야 발견된다.
//
// 규칙은 전부 "구조"를 본다 — 값이 아니라 코드 모양을 검사하므로 확률적 버그도 걸린다.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
let fail = 0;   // R1·R2 — 빌드 차단
let warn = 0;   // R3 — 경고 (기존 미주입 필드 백로그가 남아 있어 아직 차단하지 않는다)
const bad = (file, line, rule, msg) => {
  if (rule === "R3") { console.warn(`  ⚠️ [${rule}] ${relative(ROOT, file)}:${line}\n     ${msg}`); warn++; return; }
  console.error(`  ❌ [${rule}] ${relative(ROOT, file)}:${line}\n     ${msg}`);
  fail++;
};

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(n)) out.push(p);
  }
  return out;
}
const files = walk(SRC);

// ─────────────────────────────────────────────────────────────
// R1. AI 결과 객체를 필터 없이 키 순회하지 말 것
//     Object.entries(X) / Object.keys(X) 에서 X가 AI 응답 계열이면 .filter( 가 붙어 있어야 한다.
// ─────────────────────────────────────────────────────────────
const AI_OBJ = /Object\.(?:entries|keys)\(\s*((?:r|res|result|resultType|parsed|data|viewItem)(?:\?\.)?\.[A-Za-z_$][\w$]*|(?:resultType|parsed|viewItem\.resultType))\s*(?:\|\|\s*\{\})?\s*\)/;
console.log("R1. AI 결과 객체 무필터 키 순회");
for (const f of files) {
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((ln, i) => {
    const m = ln.match(AI_OBJ);
    if (!m) return;
    // 같은 줄에 .filter( 가 있으면 화이트리스트를 건 것으로 본다.
    if (/\.filter\s*\(/.test(ln)) return;
    // AI가 아니라 코드가 만든 객체(점수 계산·사용자 입력 등)는 바로 윗줄이나 같은 줄에
    // `ai-safe: 사유` 주석을 달아 예외로 둔다. 사유를 쓰게 해서 "일단 통과"를 막는다.
    // 같은 JSX 블록 안이면 몇 줄 떨어져 있을 수 있으므로 위로 4줄까지 본다.
    if (/ai-safe:/.test(ln) || lines.slice(Math.max(0, i - 4), i).some((l) => /ai-safe:/.test(l))) return;
    bad(f, i + 1, "R1", `${m[0]} — AI가 키를 지어내면 그대로 화면에 나온다. .filter(([k])=>허용목록.includes(k)) 를 붙일 것.`);
  });
}

// ─────────────────────────────────────────────────────────────
// R2. AI 텍스트를 세정 없이 dangerouslySetInnerHTML 에 넣지 말 것
//     __html 값에 _safeHtml( 이 없고 AI 계열 변수를 쓰면 위반.
// ─────────────────────────────────────────────────────────────
console.log("R2. 무세정 dangerouslySetInnerHTML");
for (const f of files) {
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((ln, i) => {
    if (!/dangerouslySetInnerHTML/.test(ln)) return;
    if (/_safeHtml\s*\(/.test(ln)) return;              // 세정 완료
    const html = ln.split("__html")[1] || "";
    // AI 응답 계열 변수(r./result./parsed./data.)가 들어가면 위험. 하드코딩 문자열·css 변수는 통과.
    if (/\b(?:r|res|result|resultType|parsed|data)\s*(?:\?\.)?\.[A-Za-z_$]/.test(html))
      bad(f, i + 1, "R2", `AI 텍스트를 HTML로 주입한다. _safeHtml(...) 로 감쌀 것.`);
  });
}

// ─────────────────────────────────────────────────────────────
// R3. 프롬프트에만 있고 주입이 0건인 판정성 필드 (route)
//     프롬프트 JSON 스켈레톤의 "field": 중, 코드에서 parsed.field = 로 확정하지 않는 것을 찾는다.
//     서술형(본문)은 자유생성이 정상이므로 판정성 필드 이름만 본다.
// ─────────────────────────────────────────────────────────────
const VERDICT_FIELDS = [
  "mbti_guess", "persona", "cert_tags", "grade", "total_score", "charm_score",
  "iq_estimate", "wealth_grade", "best_subject", "art_fields", "strong_points",
  "weak_points", "type_name", "character_name", "school_type", "top_percent",
];
console.log("R3. 프롬프트에만 있고 주입 0건인 판정성 필드");
const apiDir = join(SRC, "app", "api");
for (const f of walk(apiDir)) {
  const src = readFileSync(f, "utf8");
  for (const field of VERDICT_FIELDS) {
    // 프롬프트 스켈레톤에 "field": 형태로 등장하는가
    const inPrompt = new RegExp(`"${field}"\\s*:`).test(src);
    if (!inPrompt) continue;
    // 코드가 확정하는가 — parsed.field = / parsed.x.field = / .field = FIXED[...]
    const injected = new RegExp(`(?:parsed|tw|r)(?:\\.[A-Za-z_$][\\w$]*)*\\.${field}\\s*=`).test(src);
    if (injected) continue;
    // 필드명은 판정성처럼 보여도 실제로는 서술형(시적 칭호 등)이라 자유생성이 의도인 경우가 있다.
    // 그런 필드는 프롬프트 줄이나 바로 윗줄에 `ai-free: 사유` 를 적어 예외로 둔다.
    // ai-safe와 같은 철학 — 사유를 쓰게 해서 "귀찮아서 통과"를 막는다.
    const srcLines = src.split(/\r?\n/);
    const idx = srcLines.findIndex((l) => new RegExp(`"${field}"\\s*:`).test(l));
    // 사유가 길어 주석이 여러 줄일 수 있으므로 위로 3줄까지 본다.
    const declared = /ai-free:/.test(srcLines[idx] || "")
      || srcLines.slice(Math.max(0, idx - 3), idx).some((l) => /ai-free:/.test(l));
    if (declared) continue;
    bad(f, idx + 1, "R3", `"${field}" 가 프롬프트에만 있고 서버가 확정하지 않는다 → 재분석마다 값이 바뀐다. 20종 고정표를 만들거나 프롬프트에서 필드를 뺄 것. (서술형이 의도면 \`ai-free: 사유\` 주석)`);
  }
}

if (warn) console.log(`\n⚠️ R3 경고 ${warn}건 — 기존 백로그. 다 정리되면 R3도 차단으로 승격할 것.`);
console.log(
  fail === 0
    ? "✅ AI 필드 검사 통과 — R1 무필터 키 순회 / R2 무세정 HTML 주입 (R3는 현재 경고)"
    : `\n❌ ${fail}건 위반 (빌드 중단)`
);
process.exit(fail === 0 ? 0 : 1);
