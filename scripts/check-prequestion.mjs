/**
 * 사전질문(preQ) UI 안전장치 검사 — 빌드 전에 자동 실행 (package.json prebuild)
 *
 * 🚨 왜 필요한가 (2026-08-11 기질도·수비학 라이브 검수)
 * 사전질문 UI가 공용 PreQuestionFlow 말고도 자체 구현이 9개 더 있는데,
 * 새로 만들 때마다 같은 실수가 반복됐다. 특히 치명적이었던 조합:
 *
 *     {!preFocus && (건너뛰기 버튼)}
 *     {preFocus && preFocus!=="skip" && (다음 버튼)}
 *
 * 건너뛰기를 누르면 preFocus="skip"이 되는데, 이 값은 첫 조건도 둘째 조건도 통과하지 못한다.
 * 그래서 결제창에서 '이전'으로 돌아오면 **건너뛰기와 다음이 동시에 사라져 갇힌다.**
 * 기질도가 정확히 이 상태였고, 옵션 재클릭 해제도 없어서 되돌릴 방법이 아예 없었다.
 *
 * 이 스크립트는 UI 코드를 고치지 않고 패턴만 검사한다(회귀 위험 없음).
 * 앞으로 추가되는 사전질문 UI도 자동으로 커버된다.
 *
 * 통과 기준 4가지
 *   R1 건너뛰기 버튼을 "선택이 없을 때만" 렌더하지 말 것 (상시 노출)
 *   R2 옵션 클릭이 단방향이면 안 됨 — 재클릭 해제 가능해야 함
 *   R3 단일 선택 자동 진입 금지 (v298 표준: 고른 뒤 '다음' 클릭)
 *   R4 조사 괄호 폴백("이(가)" 등)을 화면 문구에 쓰지 말 것 — src/lib/josa.ts 사용
 */
import fs from "node:fs";
import path from "node:path";

const TARGETS = [
  "src/app/page.tsx",
  "src/components/body-modals.tsx",
  "src/components/fortune-modals.tsx",
  "src/components/tests/Gijildo.jsx",
  "src/components/tests/BrainTraits.jsx",
];

const violations = [];

/** 파일 안에서 offset이 몇 번째 줄인지 */
function lineOf(src, idx) {
  return src.slice(0, idx).split("\n").length;
}

/** 검사 제외 — 주석 줄은 규칙 설명에 패턴이 들어가므로 건너뛴다 */
function isComment(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*");
}

function check(file) {
  const abs = path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) return;
  const src = fs.readFileSync(abs, "utf8");
  const lines = src.split("\n");

  // ── R1: 건너뛰기 버튼이 "선택 없음" 조건 안에 들어 있는가
  // 건너뛰기 등장 지점에서 앞으로 200자만 되짚어, 그 안에 여는 조건이 부정형이면 위반.
  for (const m of src.matchAll(/건너뛰기/g)) {
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1] ?? "")) continue;
    const before = src.slice(Math.max(0, m.index - 200), m.index);
    // 이 버튼을 감싸는 가장 가까운 조건식
    const guard = before.match(/\{\s*(![A-Za-z0-9_.?[\]]+|[A-Za-z0-9_.?[\]]+\.length\s*===\s*0)\s*&&\s*\(?[^{}]*$/);
    if (guard) {
      violations.push({
        rule: "R1",
        file,
        line: ln,
        msg: `건너뛰기 버튼이 "${guard[1].trim()}" 조건 안에 있음 — 선택하면 버튼이 사라져 되돌릴 수 없습니다.`,
        fix: `조건을 없애고 항상 렌더하세요. 누르면 답을 지우고 넘어가도록 하고, 선택이 있을 땐 라벨을 '건너뛰기 (선택 취소)'로 바꾸세요.`,
      });
    }
  }

  // ── R2: 옵션 onClick이 단방향 대입인가 (재클릭 해제 불가)
  //   위반:  onClick={()=>setPreFocus(opt.l)}
  //   정상:  onClick={()=>setPreFocus(preFocus===opt.l?"":opt.l)}  /  onClick={()=>handlePick(opt)}
  for (const m of src.matchAll(/onClick=\{\(\)\s*=>\s*set([A-Za-z0-9_]+)\(\s*(opt|option|o)\.[A-Za-z0-9_]+\s*\)\s*\}/g)) {
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1] ?? "")) continue;
    violations.push({
      rule: "R2",
      file,
      line: ln,
      msg: `옵션 클릭이 단방향입니다 — set${m[1]}(${m[2]}.…) 만 있고 해제 분기가 없습니다.`,
      fix: `set${m[1]}(현재값===${m[2]}.l ? "" : ${m[2]}.l) 처럼 재클릭 해제를 넣으세요.`,
    });
  }

  // ── R3: 단일 선택 자동 진입 (고르자마자 다음 화면)
  for (const m of src.matchAll(/setAnswer\([^;]*\)\s*;\s*setTimeout\(|setTimeout\(\s*onNext/g)) {
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1] ?? "")) continue;
    violations.push({
      rule: "R3",
      file,
      line: ln,
      msg: `단일 선택이 자동으로 다음 화면으로 넘어갑니다 (v298 표준 위반).`,
      fix: `자동 진입을 빼고 '다음' 버튼을 노출하세요. 잘못 눌렀을 때 바꿀 틈이 없습니다.`,
    });
  }

  // ── R4: 조사 괄호 폴백
  for (const m of src.matchAll(/[가-힣]\s*\((?:가|를|는|와|과|을|이|은)\)/g)) {
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1] ?? "")) continue;
    violations.push({
      rule: "R4",
      file,
      line: ln,
      msg: `조사 괄호 폴백 "${m[0].trim()}" 이 화면 문구에 있습니다.`,
      fix: `src/lib/josa.ts 의 josa() / josaOnly() 로 받침에 맞는 조사를 고르세요.`,
    });
  }
}

for (const f of TARGETS) check(f);

const RULE_NAMES = {
  R1: "건너뛰기 상시 노출",
  R2: "옵션 재클릭 해제",
  R3: "자동 진입 금지",
  R4: "조사 자동 선택",
};

if (violations.length) {
  console.error("\n❌ 사전질문 검사 실패 — " + violations.length + "건\n");
  for (const v of violations) {
    console.error(`  [${v.rule} ${RULE_NAMES[v.rule]}] ${v.file}:${v.line}`);
    console.error(`     ${v.msg}`);
    console.error(`     → ${v.fix}\n`);
  }
  console.error("자세한 배경은 scripts/check-prequestion.mjs 상단 주석을 보세요.\n");
  process.exit(1);
}

console.log("✅ 사전질문 검사 통과 — 검사 파일 " + TARGETS.length + "개, 규칙 4종 (R1 건너뛰기 상시 노출 / R2 재클릭 해제 / R3 자동 진입 금지 / R4 조사 자동 선택)");
