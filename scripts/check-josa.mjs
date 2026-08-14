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
const SAFE_NAMES = [
  /oh(aeng|ang)?$/i, /ilOh$/i, /IlganOh$/i, /dominant$/i, /personOh$/i, /ohInfo/i,  // 오행
  /IQ$/i, /score$/i, /count$/i, /num(ber)?$/i, /year$/i, /age$/i,                    // 숫자
];
function isSafe(expr) {
  if (!SAFE_VAR.test(expr)) return false;                       // 삼항·함수호출 등 복합식은 안전 판단 불가
  const name = expr.replace(/^\$\{\s*|\s*\}$/g, "");
  return SAFE_NAMES.some((re) => re.test(name));
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
    if (isSafe(m[0])) continue;  // 오행·숫자처럼 받침이 일정한 값
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
 * ⚠️ 지금은 **경고 모드**다 (exit 0).
 * 신설 시점에 이미 52건이 쌓여 있어서 바로 차단하면 빌드가 멈춘다.
 * check-prequestion.mjs의 R3가 그랬듯이, 백로그를 다 정리한 뒤
 * 아래 process.exit(1)의 주석을 풀어 **차단으로 승격**할 것.
 */
const BLOCKING = false;
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
