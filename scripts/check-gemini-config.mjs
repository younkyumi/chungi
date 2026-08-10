/**
 * ③ Gemini 토큰 설정 전수 검사 — 빌드 전에 자동 실행 (package.json prebuild)
 *
 * 🚨 왜 필요한가 (2026-08-10 조선초상화 "뭘 올려도 심령" 사고)
 * Gemini 2.5는 thinking(사고) 토큰도 maxOutputTokens에 포함된다.
 * joseon-portrait가 maxOutputTokens:100 + thinkingBudget:512 였는데,
 * 실측 결과 모델이 사고에 94토큰을 태우고 finishReason=MAX_TOKENS로 본문이 잘려
 * **프롬프트와 무관하게 100%** 빈 응답 → 파싱 실패 → 에러카드(E2 심령)로 떨어졌음.
 * HTTP 200이라 Vercel 에러 알림도 안 떠서 오래 안 걸렸다.
 *
 * 이 스크립트는 src/app/api 전체를 훑어서 위험한 조합을 찾고, 있으면 빌드를 실패시킨다.
 * 라우트 코드를 건드리지 않으므로 회귀 위험이 없고, 앞으로 추가되는 라우트도 자동으로 커버된다.
 */
import fs from "node:fs";
import path from "node:path";

/** 답안지(maxOutputTokens)는 연습장(thinkingBudget)의 최소 이 배수여야 함 */
const HEADROOM_RATIO = 2;
const API_DIR = path.join(process.cwd(), "src", "app", "api");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".ts") || e.name.endsWith(".tsx") || e.name.endsWith(".mjs") || e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

/**
 * generationConfig 블록을 찾아 maxOutputTokens / thinkingBudget 쌍을 추출.
 * 중괄호 균형으로 블록 끝을 잡는다 (한 줄이든 여러 줄이든 대응).
 */
function extractConfigs(src) {
  const found = [];
  // 두 가지 형태를 모두 잡는다:
  //   generationConfig: { ... }        — 라우트에 직접 쓴 인라인 리터럴
  //   geminiGenConfig({ ... })         — src/lib/gemini-config.ts 헬퍼 경유
  const re = /(?:generationConfig\s*:\s*\{|geminiGenConfig\s*\(\s*\{)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    const block = src.slice(m.index, i);
    const line = src.slice(0, m.index).split(/\r?\n/).length;
    const maxM = block.match(/maxOutputTokens\s*:\s*(\d+)/);
    const thinkM = block.match(/thinkingBudget\s*:\s*(\d+)/);
    found.push({
      line,
      maxOutputTokens: maxM ? parseInt(maxM[1], 10) : null,
      thinkingBudget: thinkM ? parseInt(thinkM[1], 10) : null,
      hasSpread: /\.\.\./.test(block), // 변수 전개면 정적 검사 불가
    });
  }
  return found;
}

const problems = [];
const skipped = [];
let checked = 0;

for (const file of walk(API_DIR)) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes("generationConfig")) continue;
  const rel = path.relative(process.cwd(), file);
  for (const cfg of extractConfigs(src)) {
    if (cfg.maxOutputTokens === null) {
      if (!cfg.hasSpread) skipped.push(`${rel}:${cfg.line} — maxOutputTokens를 정적으로 못 읽음`);
      continue;
    }
    checked++;
    // thinkingBudget이 없으면(설정 안 함) 모델 기본 사고가 켜질 수 있음 → 작은 출력 예산이면 경고
    if (cfg.thinkingBudget === null) {
      if (cfg.maxOutputTokens < 1024) {
        problems.push(
          `${rel}:${cfg.line}\n` +
            `    maxOutputTokens=${cfg.maxOutputTokens}, thinkingConfig 없음\n` +
            `    → 모델 기본 사고가 켜지면 출력 예산을 잡아먹어 빈 응답이 날 수 있습니다.\n` +
            `      짧은 분류·추출 Call이면 thinkingBudget: 0 을 명시하세요.`
        );
      }
      continue;
    }
    if (cfg.thinkingBudget > 0 && cfg.maxOutputTokens < cfg.thinkingBudget * HEADROOM_RATIO) {
      problems.push(
        `${rel}:${cfg.line}\n` +
          `    maxOutputTokens=${cfg.maxOutputTokens}, thinkingBudget=${cfg.thinkingBudget}\n` +
          `    → 사고 토큰이 출력 예산을 잡아먹어 본문이 빈 채 잘립니다 (finishReason=MAX_TOKENS).\n` +
          `      maxOutputTokens를 ${cfg.thinkingBudget * HEADROOM_RATIO} 이상으로 올리거나 thinkingBudget: 0 으로 두세요.`
      );
    }
  }
}

if (skipped.length) {
  console.warn("⚠️  [check-gemini-config] 정적 검사 불가 (수동 확인 필요):");
  for (const s of skipped) console.warn("   - " + s);
}

if (problems.length) {
  console.error("\n❌ [check-gemini-config] 위험한 Gemini 토큰 설정 " + problems.length + "건 발견 — 빌드를 중단합니다.\n");
  for (const p of problems) console.error("  • " + p + "\n");
  console.error("  참고: 2026-08-10 조선초상화 '뭘 올려도 심령' 사고와 같은 유형입니다.\n");
  process.exit(1);
}

console.log(`✅ [check-gemini-config] generationConfig ${checked}건 검사 통과 (maxOutputTokens ≥ thinkingBudget × ${HEADROOM_RATIO})`);
