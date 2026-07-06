# 천기(天機) 프로젝트 — Fable 5 검수 브리핑

> 이 문서는 천기 프로젝트를 처음 보는 Fable 5가 코드 검수를 수행하기 위한 완전한 컨텍스트입니다.
> 검수 요청 항목은 문서 하단 [검수 체크리스트]에 있습니다.

---

## 1. 프로젝트 한 줄 소개

**천기**는 한국어 운세·관상 올인원 웹앱 (모바일 최적화).
사용자가 이름·생년월일·사진을 입력하면 AI(Google Gemini)가 사주·관상·타로 등을 분석해 결과를 제공.
**56개 콘텐츠**, 유료 단가 4단계 (380/980/1980/4800원), 무료 콘텐츠 다수 포함.

- **배포**: 천기.kr (Vercel, GitHub younkyumi/chungi 자동 배포)
- **스택**: Next.js 14 App Router, TypeScript, Google Gemini API, PortOne 결제, Supabase DB

---

## 2. 56개 콘텐츠 전체 목록

### 사주/운세 (9종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 사주풀이 | saju | 980 |
| 월별운세 | monthly_unse | 980 |
| 연도별운세 | yearly_rich | 980 |
| 신년운세 | new_year | 1980 |
| 토정비결 | tojeong | 1980 |
| 대운해설 | daeun_rich | 980 |
| 띠별운세 | zodiac | 무료 |
| 별자리 | star | 무료 |
| 혈액형 | blood | 무료 |

### 오늘의 운세/타로 (9종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 오늘의운세 | today_unse | 무료 |
| 이달의운세 | monthly_unse_free | 무료 |
| 오늘의타로 | today_tarot | 무료 |
| YES/NO 타로 | yes_no_tarot | 무료 |
| 재물타로 | tarot_money | 980 |
| 연애타로 | tarot_love | 980 |
| 건강타로 | tarot_health | 980 |
| 진로타로 | tarot_career | 980 |
| 인생타로(켈틱) | tarot_life | 980 |

### 관상 (5종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 내관상보기 (프리미엄) | gwansang_full | 1980 |
| 관상짤 | gwansang_zal | 무료+380 |
| 우리아기관상 | baby_gwansang | 980 |
| 댕댕상/냥냥상 | pet_gwansang | 980 |
| 조선초상화 | joseon_portrait | 1980 |

### 궁합 (9종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 커플/베프/비즈/팬/악연 궁합 (5모드) | gwansang_compat | 1980 |
| 부모자식 궁합 | parent_child_compat | 1980 |
| 연애운·궁합 (사주 기반) | love_compat | 980 |
| 궁합연예인 | celeb_compat | 무료 (1일 1회) |
| 멍냥궁합 | pet_owner_compat | 980 |

### 이름 (3종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 이름풀이 | name_reading | 980 |
| 아기이름짓기 | baby_name | 1980 |
| 파동성명학 | pawdong | 4800 |

### 신체 분석 (4종, 일부 오픈 보류)
| 콘텐츠명 | svcId | 단가 | 상태 |
|---------|-------|------|------|
| 손금 | palmistry | 980 | ⚠️ 오픈 보류 |
| 발금 | footreading | 980 | ⚠️ 오픈 보류 |
| 얼굴점 | mole | 980 | ⚠️ 오픈 보류 |
| 눈점 | eye_mole | 980 | ⚠️ 오픈 보류 |

### 수비학/뇌과학 (2종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 수비학 | numerology | 980 |
| 뇌과학 | brain_traits | 980 |

### 기타 콘텐츠 (9종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 돌잡이 | doljabi | 980 |
| 기질도 | gijildo | 980 |
| 꿈해몽 | dream_ai | 무료+380 |
| 태몽해몽 | taemong | 380 |
| 전생운세 | past_life | 980 |
| 행운로또번호 | lucky_number | 무료 |
| AI배경화면 | lucky_wallpaper | 무료 |
| 좋은날 확인/찾기 | taegil/taegil_free | 무료/980 |
| 오늘의명언 | one_word | 무료 |

### 프리미엄 (2종)
| 콘텐츠명 | svcId | 단가 |
|---------|-------|------|
| 2세예측 | baby_face | 4800+980×4=8720 |
| 나의천기리포트 | chungi_report | 별도 |

---

## 3. 기술 아키텍처

### 파일 구조 (핵심)
```
src/
  app/
    page.tsx            ← 29,000줄. 56개 모달 전체 + 메인 UI
    api/
      baby-gwansang/route.ts   ← Gemini API 2-call 패턴 (관상 계열 공통)
      face-reading-premium/route.ts
      pet-gwansang/route.ts
      gwansang-compat/route.ts
      parent-child-compat/route.ts
      dream-ai/route.ts        ← 꿈/태몽 AI
      joseon-portrait/route.ts ← 조선초상화 AI
      numerology/route.ts      ← 수비학 AI
      baby-face/route.ts       ← 2세예측 (Replicate)
      payment/verify/route.ts  ← PortOne 결제 검증
      photo-validate/route.ts  ← 사진 유효성 검사
      ... (총 48개 route)
  components/
    ResultCard.tsx       ← 결과카드 공통 컴포넌트 (BrandLine, HashFooter)
    fortune-modals.tsx   ← 사주/운세 모달
    body-modals.tsx      ← 신체 분석 모달
    Gijildo.jsx          ← 기질도 전용
    BrainTraits.jsx      ← 뇌과학 전용
    SajuGlossaryFAB.tsx  ← 사주 용어 FAB
  lib/
    gemini-parse.ts      ← Gemini JSON 응답 파싱
```

### 모달 공통 흐름
```
intro(설명팝업) → pre-question(사전질문) → payment(결제) → loading → result(결과)
```
- 무료 콘텐츠는 payment 단계 없음
- `step` state로 관리: `"intro" | "preq" | "pay" | "loading" | "result"`
- 결과는 localStorage에 캐시 (무료: 1일 1회, 유료: 매번 결제)

### AI API 패턴 (사진 기반 관상 5종 공통)
```
CALL 1 (temp=0.1, thinkingBudget=0, maxOutputTokens=200)
  입력: 사진만 (이름·사전질문 컨텍스트 없음)
  출력: character_type 번호 + face_obs(얼굴 관찰값 객체)
    → character_type이 매번 달라지는 문제 해결

CALL 2 (temp=0.7, thinkingBudget=1024, maxOutputTokens=8192~12288)
  입력: 사진 + 사전질문 + system instruction에 Call-1 고정값 주입
    ⚠️ character_type은 반드시 N. 절대 변경 불가.
    ⚠️ 얼굴 관찰값 고정 (눈/코/입/이마/볼/전체인상)
  출력: 전체 분석 JSON
```

- 모델 폴백 체인: `gemini-2.5-flash → gemini-2.0-flash → gemini-2.5-flash-lite` (각 2회 retry)
- rate-limit/overload 시 1초 sleep 후 재시도
- serverless maxDuration = 60초 제한

### BABY_FIXED 테이블 (baby-gwansang 전용)
- `character_type` 1~20 → `total_score`, `match_good_id`, `match_good`, `match_bad_id`, `match_bad`, `jobs` 고정값
- AI 파싱 후 서버사이드에서 룩업 테이블 값으로 덮어씀 → 점수·찰떡·상극·직업 항상 동일

---

## 4. 결제 시스템

### 단가 구조
| 등급 | 금액 | 예시 콘텐츠 |
|-----|------|------------|
| 무료 | 0원 | 오늘의운세, 타로 일부 |
| 기본 | 380원 | 관상짤 유료, 꿈해몽 유료 |
| 표준 | 980원 | 사주, 대부분 유료 콘텐츠 |
| 프리미엄 | 1980원 | 신년운세, 내관상, 궁합 |
| 명품 | 4800원 | 파동성명학, 2세예측 |

### ⚠️ 현재 결제 상태: MOCK
```typescript
// 현재 코드 (mock)
await new Promise(r => setTimeout(r, 2000)); // 실제 결제 없음
```
**실 서비스 전 반드시 PortOne pre-auth/void 흐름으로 교체 필요**:
- 결제 선승인 → 분석 실행 → 성공 시 capture, 실패 시 void
- 현재 구조에서 분석 실패 시 사용자 돈이 빠질 수 있음

### PortOne 관련 파일
- `src/app/api/payment/verify/route.ts` — 결제 검증 API
- `src/app/api/orders/route.ts` — 주문 생성/조회
- `src/app/api/cash/route.ts` — 캐시(포인트) 관리

---

## 5. 디자인 시스템 핵심 규칙 (⚠️ 위반 시 컴플레인)

### 컬러
- **골드**: `#D4AF37` 단색 (그라데이션·효과 절대 금지)
- **에러/위험**: coral/red 계열
- **무료 강조**: jade/mint 계열

### 결과팝업 표준
- **내관상보기(gwansang_full)** 결과카드 패턴을 기준으로 모든 콘텐츠 복붙
- `ResultActions` 컴포넌트 (이미지 저장/공유/PDF)
- `GoodsRecSection` 컴포넌트 (연계 콘텐츠 추천 4박스 grid)
- 결과카드 하단 푸터 표준: `marginTop:14, paddingTop:10, paddingBottom:10`
- 카드 상단: `<BrandLine>` 컴포넌트 (10px 브랜딩)
- 카드 하단: `<HashFooter>` 컴포넌트 (해시태그)

### 사진 업로드 콘텐츠 공통 규칙
- 결과 진입 시 **laserScan 애니메이션** 필수 (2세예측만 예외)
- 에러 일러스트: 콘텐츠별 분리 (공용 이미지 X)
- 업로드 사진: 우측 정렬 금지, 잘림 없어야 함

### 관상짤 ↔ 내관상보기
- 항상 한 쌍으로 관리 (도감·에러·사진 공유)
- 한쪽 수정 시 반드시 다른 쪽도 점검

### 금지 이모지 (조선/운세 콘텐츠)
- 🏯⛩️🎎🎏🎐🗾 (일본 연상) 절대 금지
- 대체: 🏛️🪔🪷🌸 등 한국 뉘앙스

---

## 6. 데이터 파일 구조

```
public/
  gwansang-types.json      ← 관상 20종 타입 정의 (내관상/관상짤 공용)
  joseon_portrait_types.json ← 조선초상화 60종
  *.html                   ← 검수용 미리보기 HTML (배포되지 않음)
src/
  lib/
    gemini-parse.ts         ← Gemini 응답 파싱 유틸
    saju-gloss.ts           ← 사주 용어 사전
```

---

## 7. 알려진 펜딩/주의 항목

| 항목 | 상태 | 리스크 |
|-----|------|--------|
| PortOne 결제 연동 | Mock (setTimeout) | ⚠️ 실 서비스 불가 — 돈 빠짐 위험 |
| 손금/발금/얼굴점/눈점 | 오픈 보류 | 사진 카테고리 검증 X, 좌우 검증 X |
| 2세예측 Replicate 모델 | 환경변수 미등록 | 현재 face-swap fallback |
| 조선초상화 Replicate | 환경변수 미등록 | 현재 정적 이미지 |

---

## 8. 검수 체크리스트

아래 항목 중 검수를 요청할 영역을 골라서 해당 섹션을 Fable 5에 전달하세요.

---

### [검수 A] 보안 취약점 검토

**검수 대상 파일**: `src/app/api/` 전체 (48개 route.ts)

검토 포인트:
1. **API 키 노출 여부** — `GEMINI_API_KEY`, `PORTONE_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 번들에 노출되는지
2. **이미지 업로드 보안**
   - base64 이미지 크기 제한 없이 서버로 전달되는지 (OOM/DoS 위험)
   - `photo-validate/route.ts`가 항상 호출되는지, bypass 가능한지
3. **결제 bypass** — `payment/verify/route.ts` 없이 유료 결과를 직접 얻을 수 있는지
4. **어드민 인증** — `admin/auth/route.ts`가 실제 보호되는지, JWT 검증 방식
5. **SQL Injection / Prompt Injection** — Supabase 쿼리, Gemini 프롬프트에 사용자 입력이 직접 삽입되는지
6. **CORS / CSRF** — Next.js API Route의 origin 검증 여부

---

### [검수 B] AI 프롬프트 품질 검토

**검수 대상 파일**: Gemini를 호출하는 API route 파일들

```
src/app/api/baby-gwansang/route.ts
src/app/api/face-reading-premium/route.ts
src/app/api/gwansang-compat/route.ts
src/app/api/parent-child-compat/route.ts
src/app/api/pet-gwansang/route.ts
src/app/api/gwansang-zal/route.ts
src/app/api/joseon-portrait/route.ts
src/app/api/dream-ai/route.ts
src/app/api/numerology/route.ts
src/app/api/tojeong/route.ts
src/app/api/zodiac/route.ts
src/app/api/star/route.ts
src/app/api/blood/route.ts
src/app/api/taemong/route.ts
```

검토 포인트:
1. **사전질문 bleeding** — 사용자의 pre-question 선택지가 AI가 결정해야 할 값(character_type 등)에 영향을 미치는지
   - 올바른 구조: Call-1에서 사진만으로 type 확정 → Call-2에 고정값 주입
   - 잘못된 구조: 사전질문이 Call-1과 같은 컨텍스트에 있거나, type 확정 전에 주입
2. **온도 설정 적절성**
   - type/캐릭터 결정 콜: temp ≤ 0.1 (결정론적이어야 함)
   - 텍스트 생성 콜: temp 0.7 (다양한 표현)
3. **할루시네이션 방지 장치** — JSON만 출력하도록 강제하는 지시가 있는지, JSON 파싱 실패 처리
4. **서버리스 타임아웃** — 2-call 패턴에서 두 호출 합산이 60초 이내인지
5. **모델 폴백 체인** — gemini-2.5-flash → 2.0-flash → 2.5-flash-lite 순서가 맞는지, 모든 route에 적용됐는지
6. **BABY_FIXED 테이블** (baby-gwansang만) — 20개 character_type 모두 커버되는지, 누락된 번호 없는지

---

### [검수 C] 결제 흐름 검토

**검수 대상 파일**:
```
src/app/api/payment/verify/route.ts
src/app/api/orders/route.ts
src/app/api/orders/[id]/route.ts
src/app/api/cash/route.ts
src/app/api/coupons/route.ts
src/app/api/coupons/use/route.ts
src/app/api/coupons/redeem/route.ts
```
+ `src/app/page.tsx`의 결제 관련 섹션 (PayDone, cashPayStep 관련)

검토 포인트:
1. **Mock → 실 연동 준비도** — setTimeout mock이 얼마나 깊게 박혀있는지, PortOne 실 API 교체 시 변경 범위
2. **결제 중복 방지** — 동시 요청 시 같은 상품이 중복 결제되는지
3. **결제 후 분석 실패 처리** — 현재 구조에서 결제 완료 후 Gemini 분석 실패 시 환불 경로가 있는지
4. **캐시/쿠폰 시스템** — cash 차감이 서버에서 atomic하게 처리되는지, 클라이언트 위조 가능한지
5. **무료 콘텐츠 우회** — localStorage 캐시 1일 1회 제한이 클라이언트에만 있어서 서버에서 재확인 없는지

---

### [검수 D] UI/UX 일관성 검토

**검수 대상 파일**:
```
src/app/page.tsx (전체 — 56개 모달)
src/components/fortune-modals.tsx
src/components/body-modals.tsx
src/components/ResultCard.tsx
src/app/globals.css
```

검토 포인트:
1. **인트로 ↔ 결과 동기화** — 인트로 팝업에서 약속한 결과 섹션이 실제 결과에 있는지 (56개 전체)
2. **결과팝업 패턴 준수** — `ResultActions` + `GoodsRecSection` 4박스 grid 구조가 모든 유료 콘텐츠에 있는지
3. **결과카드 푸터 표준** — `marginTop:14, paddingTop:10, paddingBottom:10` 준수 여부
4. **골드 컬러 통일** — `#D4AF37` 단색이 아닌 그라데이션 골드가 남아있는지
5. **사진 업로드 콘텐츠** — laserScan 애니메이션 있는지, 에러 일러스트 있는지, 사진 우측정렬/잘림 없는지
6. **모달 step 흐름** — intro → preq → pay → loading → result 순서 준수 여부, 뒤로가기 버튼 동작
7. **일본 연상 이모지** — 🏯⛩️🎎🎏🎐🗾 사용 여부 (조선/운세 콘텐츠)

---

### [검수 E] 성능·안정성 검토

**검수 대상**: 전체 API route + 주요 컴포넌트

검토 포인트:
1. **메모리 누수** — 대형 base64 이미지를 서버 메모리에 오래 들고 있는 패턴
2. **에러 경계** — 각 API route에서 예외가 적절히 catch되는지, 사용자에게 500 raw error가 노출되는지
3. **localStorage 용량** — 대화화면 이미지·결과JSON을 localStorage에 저장 시 용량 초과 처리 있는지
4. **서비스 워커(sw.js)** — 캐시 버전이 커밋 버전과 동기화되는지, 오래된 캐시로 새 코드가 안 보이는 케이스
5. **Hydration mismatch** — localStorage를 SSR 단계에서 읽는 패턴이 있는지

---

## 9. 코드 스타일 참고

```typescript
// 결과카드 최소 구조 (내관상보기 패턴 기준)
<div id="xxx-capture">
  {/* PAGE 1 */}
  <div style={{background:'#fff', borderRadius:20, ...}}>
    <BrandLine>{svc.name}</BrandLine>
    {/* 결과 내용 */}
    <HashFooter hash="#태그1 #태그2" />
  </div>
  {/* ResultActions (이미지저장/공유/PDF) */}
  <ResultActions captureId="xxx-capture" svcId="xxx" />
  {/* GoodsRecSection (연계 콘텐츠 4박스) */}
  <GoodsRecSection svcId="xxx" result={parsed} />
</div>
```

---

*이 문서는 천기 프로젝트의 Claude Code 세션에서 자동 생성되었습니다.*
*최종 업데이트: 2026-07-05*
