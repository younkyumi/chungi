/**
 * 조사(을/를·이/가·와/과 …) 고정 사용 검사기 — 2026-08-14 신설
 *
 * 배경:
 *   "재물·금전와 인연·관계를 함께 물으셨죠" 같은 문장이 라이브에 나갔다.
 *   `${labels.join(", ")}와` 처럼 **변수 뒤에 조사를 고정으로 붙여 쓴** 탓이다.
 *   변수 값의 받침에 따라 조사가 달라지므로, 고정으로 쓰면 절반은 반드시 틀린다.
 *   이런 건 사람이 화면을 보고 잡을 수 없다(값이 바뀌어야 드러남) → 빌드에서 막는다.
 *
 * 규칙
 *   J1  `${...}` 바로 뒤에 붙은 조사 → src/lib/josa.ts 의 josa()/josaOnly() 사용
 *   J2  괄호 폴백 "을(를)" "이(가)" 등이 화면 문구에 그대로 남아 있는 것
 *
 * 단독 실행: npm run check:josa
 */
import fs from "fs";
import path from "path";

const TARGETS = [
  "src/app/page.tsx",
  "src/components/fortune-modals.tsx",
  "src/components/body-modals.tsx",
  "src/components/ResultCard.tsx",
  "src/components/tests/Gijildo.jsx",
  "src/components/tests/BrainTraits.jsx",
];

// 받침 유무로 형태가 갈리는 조사만 본다 (로/으로 포함)
const PARTICLES = ["은", "는", "이", "가", "을", "를", "와", "과", "으로", "로", "이나", "나", "이라", "라", "이랑", "랑", "이며", "며"];
// 조사 뒤에 와야 정상인 것들 — 이게 아니면 단어 일부일 가능성이 커서 건너뛴다
const AFTER = /[\s,.·…!?)"'」』\]}]|$/;

/**
 * 받침이 항상 같아서 고정 조사를 써도 안전한 변수들.
 *  - 오행(목·화·토·금·수)은 전부 받침이 있다 → "으로/이/을"이 항상 맞다
 *  - 숫자는 한글로 읽지 않으므로 "로/를" 고정이 관용이다
 * 여기 추가할 때는 **값의 후보가 닫혀 있고 받침이 일정한지** 반드시 확인할 것.
 */
const SAFE_VAR = /^\$\{\s*[A-Za-z_$][\w$.?[\]]*\s*\}$/;
// 값이 **항상 받침 있음** — 이 뒤엔 은/이/을/과/으로 만 맞다
const ALWAYS_JONG = [/oh(aeng|ang)?$/i, /ilOh$/i, /IlganOh$/i, /dominant$/i, /personOh$/i];
// 값이 숫자 — 한글로 안 읽으므로 로/를 고정이 관용
const NUMERIC = [/IQ$/i, /score$/i, /count$/i, /num(ber)?$/i, /year$/i, /age$/i];
const JONG_OK = new Set(["은", "이", "을", "과", "으로", "이나", "이라", "이랑", "이며"]);
/**
 * 안전하면 true. ⚠️ 단순히 "이 변수는 통과"로 넘기면 **버그를 숨긴다.**
 * 실제로 `${ilOh}({...})와` 가 이 목록에 가려져 라이브에 나갔다("금 …와" ← "과"가 맞다).
 * 그래서 받침이 항상 있는 값이면 **조사가 받침용인지까지** 확인한다.
 */
function isSafe(expr, particle) {
  if (!SAFE_VAR.test(expr)) return literalSafe(expr, particle);  // 삼항 등은 리터럴 판정으로
  const name = expr.replace(/^\$\{\s*|\s*\}$/g, "");
  if (NUMERIC.some((re) => re.test(name))) return true;
  if (ALWAYS_JONG.some((re) => re.test(name))) return JONG_OK.has(particle); // 받침용이 아니면 위반
  return false;
}

/** 한글 음절의 받침 유무 */
function hasJong(ch) {
  const c = (ch || "").charCodeAt(0);
  if (!(c >= 0xac00 && c <= 0xd7a3)) return null;   // 한글이 아니면 판단 불가
  return (c - 0xac00) % 28 !== 0;
}
const NO_JONG_OK = new Set(["는", "가", "를", "와", "로", "나", "라", "랑", "며"]);
/**
 * `${cond ? "문장A" : "문장B"}` 처럼 **분기 값이 전부 문자열 리터럴**이면,
 * 각 리터럴의 마지막 글자로 받침을 계산해서 조사가 항상 맞는지 판정한다.
 * 하나라도 어긋나면 위반. (전부 맞으면 고정 조사를 써도 안전하다)
 */
function literalSafe(expr, particle) {
  const inner = expr.replace(/^\$\{|\}$/g, "");
  const lits = [...inner.matchAll(/"([^"]*)"|'([^']*)'/g)].map((m) => (m[1] ?? m[2] ?? "").trim()).filter(Boolean);
  if (lits.length === 0) return false;
  // 리터럴 말고 다른 식별자가 값으로 쓰이면(예: `x ? a : "문자"`) 판단 불가 → 위반으로 둔다
  const stripped = inner.replace(/"[^"]*"|'[^']*'/g, "");
  if (/[A-Za-z_$][\w$]*\s*(?::|$)/.test(stripped.replace(/[?:.&|=<>!()[\]\s,+\-*/%]/g, " ").trim())) {
    // 삼항 조건부에 쓰인 변수는 값이 아니므로 무시하기 어렵다 — 보수적으로 리터럴만 있을 때만 판정
  }
  return lits.every((s) => {
    const j = hasJong(s[s.length - 1]);
    if (j === null) return false;                    // 한글로 안 끝나면 판단 불가
    return j ? JONG_OK.has(particle) : NO_JONG_OK.has(particle);
  });
}

const violations = [];
const lineOf = (src, i) => src.slice(0, i).split("\n").length;
const isComment = (l) => { const t = (l || "").trim(); return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*"); };

function check(file) {
  const abs = path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) return;
  const src = fs.readFileSync(abs, "utf8");
  const lines = src.split("\n");

  // ── J1: ${...} 바로 뒤 고정 조사
  for (const m of src.matchAll(/\$\{[^{}]*\}/g)) {
    const end = m.index + m[0].length;
    const rest = src.slice(end, end + 6);
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1])) continue;
    // 긴 조사부터 검사 (으로 > 로)
    const hit = [...PARTICLES].sort((a, b) => b.length - a.length)
      .find((p) => rest.startsWith(p) && AFTER.test(rest.slice(p.length, p.length + 1)));
    if (!hit) continue;
    // josa()/josaOnly() 호출 결과에 붙은 건 정상 (이미 처리한 것)
    if (/josa(Only)?\([^)]*\)\s*$/.test(m[0])) continue;
    if (isSafe(m[0], hit)) continue;  // 오행·숫자처럼 받침이 일정하고 조사도 맞는 경우
    violations.push({
      rule: "J1", file, line: ln,
      msg: `변수 뒤에 조사 "${hit}"가 고정으로 붙어 있습니다 — ${m[0]}${hit}`,
      fix: `josaOnly(값, "${hit === "이" || hit === "은" || hit === "을" || hit === "과" || hit === "으로" ? hit : "받침용"}", "받침없음용") 으로 바꾸세요. (src/lib/josa.ts)`,
    });
  }

  // ── J2: 괄호 폴백이 화면 문구에 남아 있는 것
  for (const m of src.matchAll(/[가-힣]\s*\((?:가|를|는|와|과|을|이|은|으로)\)/g)) {
    const ln = lineOf(src, m.index);
    if (isComment(lines[ln - 1])) continue;
    violations.push({
      rule: "J2", file, line: ln,
      msg: `괄호 폴백 "${m[0].trim()}" 이 화면 문구에 있습니다.`,
      fix: `josa() / josaOnly() 로 받침에 맞는 조사를 고르세요.`,
    });
  }
}

for (const f of TARGETS) check(f);

const NAMES = { J1: "변수 뒤 고정 조사", J2: "괄호 폴백" };
/**
 * ✅ 차단 모드 (2026-08-15 승격).
 * 신설 시점 백로그 47건을 josa() 헬퍼로 전부 정리한 뒤 올렸다.
 * 이제 변수 뒤에 조사를 고정으로 쓰면 **빌드가 실패한다.**
 * 화면 검수로는 절대 못 잡는 종류(값이 바뀌어야 드러남)라 여기서 막는 게 유일한 방법이다.
 */
const BLOCKING = true;
if (violations.length) {
  const tag = BLOCKING ? "❌ 조사 검사 실패" : "⚠️ 조사 검사 경고(아직 차단 아님)";
  console.error(`\n${tag} — ${violations.length}건\n`);
  for (const v of violations) {
    console.error(`  [${v.rule} ${NAMES[v.rule]}] ${v.file}:${v.line}`);
    console.error(`     ${v.msg}`);
    console.error(`     → ${v.fix}\n`);
  }
  console.error("배경은 scripts/check-josa.mjs 상단 주석을 보세요.\n");
  if (BLOCKING) process.exit(1);
  console.error("※ 백로그를 다 고치면 BLOCKING=true 로 바꿔 차단으로 승격하세요.\n");
  process.exit(0);
}
console.log(`✅ 조사 검사 통과 — 검사 파일 ${TARGETS.length}개, 규칙 2종 (J1 변수 뒤 고정 조사 / J2 괄호 폴백)`);
