# 터미널에서 뽑아야 할 파일 목록

> Fable 5에게 검수를 맡길 때, 어떤 파일을 뽑아서 줘야 하는지 검수 목적별로 정리한 가이드입니다.
> 터미널(Claude Code)에 복붙할 명령어까지 포함되어 있습니다.

---

## 방법 A: GitHub 통째로 주기 (가장 쉬움)

Fable 5가 GitHub 접근 가능하면 레포 주소만 주면 됩니다:
```
https://github.com/younkyumi/chungi
```
그러면 Fable 5가 직접 읽을 수 있으니 아래 과정 생략 가능.

---

## 방법 B: 검수 목적별 파일 선별 출력

GitHub 접근이 안 되거나, 특정 영역만 검수하고 싶을 때 아래 명령어를 터미널에 복붙하세요.

---

### 검수 A: 보안 취약점 — 터미널에 이렇게 요청

```
다음 파일들을 원문 그대로 (요약 없이) 출력해줘:

1. src/app/api/payment/verify/route.ts
2. src/app/api/orders/route.ts
3. src/app/api/cash/route.ts
4. src/app/api/coupons/route.ts
5. src/app/api/photo-validate/route.ts
6. src/app/api/admin/auth/route.ts
7. src/app/api/admin-users/route.ts
8. src/lib/gemini-parse.ts (있으면)
```

---

### 검수 B: AI 프롬프트 품질 — 터미널에 이렇게 요청

```
다음 파일들을 원문 그대로 (요약 없이) 출력해줘. SYSTEM_PROMPT, CHAR1_PROMPT, callGemini 함수, generationConfig 포함:

1. src/app/api/baby-gwansang/route.ts
2. src/app/api/face-reading-premium/route.ts
3. src/app/api/gwansang-compat/route.ts
4. src/app/api/parent-child-compat/route.ts
5. src/app/api/pet-gwansang/route.ts
6. src/app/api/gwansang-zal/route.ts
7. src/app/api/joseon-portrait/route.ts
8. src/app/api/dream-ai/route.ts
9. src/app/api/numerology/route.ts
10. src/app/api/tojeong/route.ts
11. src/app/api/zodiac/route.ts
12. src/app/api/star/route.ts
13. src/app/api/blood/route.ts
14. src/app/api/taemong/route.ts
15. src/lib/gemini-parse.ts (있으면)
```

---

### 검수 C: 결제 흐름 — 터미널에 이렇게 요청

```
다음 파일들을 원문 그대로 출력해줘:

1. src/app/api/payment/verify/route.ts
2. src/app/api/orders/route.ts
3. src/app/api/orders/[id]/route.ts
4. src/app/api/cash/route.ts
5. src/app/api/coupons/route.ts
6. src/app/api/coupons/use/route.ts
7. src/app/api/coupons/redeem/route.ts

그리고 page.tsx에서 다음 키워드 주변 코드(전후 50줄씩)를 출력해줘:
- "cashPayStep"
- "PayDone"
- "setTimeout" (결제 관련된 것만)
- "portone" 또는 "PortOne"
```

---

### 검수 D: UI/UX 일관성 — 터미널에 이렇게 요청

```
다음을 출력해줘:

1. src/components/ResultCard.tsx 원문 전체
2. src/app/globals.css 원문 전체

그리고 page.tsx에서 다음을 검색해줘:
- "ResultActions" 사용 위치 목록 (파일명:줄번호)
- "GoodsRecSection" 사용 위치 목록
- "laserScan" 사용 위치 목록
- "#D4AF37" 사용 위치 목록
- "linear-gradient" + "gold\|골드\|D4AF37" 주변 코드 (그라데이션 골드 사용 여부)
- 일본 이모지: "🏯\|⛩️\|🎎\|🎏\|🎐\|🗾" 사용 여부
```

---

### 검수 E: 성능·안정성 — 터미널에 이렇게 요청

```
다음을 검색해줘:

1. page.tsx에서 "localStorage" 사용 위치 전체 목록 (줄번호 포함)
2. sw.js 원문 전체 (public/sw.js)
3. src/app/api/ 하위 모든 route.ts에서 try-catch 없이 await를 사용하는 패턴 목록
4. page.tsx에서 "suppressHydrationWarning" 사용 위치

그리고 다음 파일 원문:
- src/app/layout.tsx
- next.config.js 또는 next.config.mjs
```

---

## 검수 의뢰 시 Fable 5에게 함께 줄 것

파일을 뽑은 뒤, **FABLE5_BRIEFING.md** 내용과 함께 줘야 합니다.

### Fable 5에게 전달할 메시지 템플릿

```
안녕하세요. 천기(天機)라는 한국 운세 웹앱의 코드 검수를 부탁드립니다.

아래 [브리핑 문서]를 먼저 읽고, 그 다음 [검수 파일]을 검토해주세요.

=== 브리핑 문서 ===
(FABLE5_BRIEFING.md 내용 붙여넣기)

=== 검수 파일 ===
(검수 A/B/C/D/E 중 해당 파일 붙여넣기)

=== 검수 요청 ===
FABLE5_BRIEFING.md의 [검수 X] 섹션 항목들을 점검해주세요.
발견된 문제는 다음 형식으로 알려주세요:
- 파일명:줄번호
- 문제 설명
- 심각도: 치명적 / 중요 / 낮음
- 수정 제안
```

---

## 전체 API 라우트 목록 (총 48개, 참고용)

```
src/app/api/
├── admin-users/route.ts          ← 관리자 사용자 관리
├── admin/auth/route.ts           ← 관리자 인증
├── analyze/route.ts              ← 범용 분석
├── attendance/route.ts           ← 출석 체크
├── baby-face-swap/route.ts       ← 2세예측 face-swap (Replicate)
├── baby-face/route.ts            ← 2세예측 메인 (Gemini)
├── baby-gwansang/route.ts        ← 아기관상 (2-call + BABY_FIXED)
├── blood/route.ts                ← 혈액형 운세
├── cash/route.ts                 ← 캐시(포인트) 관리
├── content-settings/route.ts     ← 관리자: 콘텐츠 공개/숨김
├── coupons/redeem/route.ts       ← 쿠폰 조회
├── coupons/route.ts              ← 쿠폰 관리
├── coupons/use/route.ts          ← 쿠폰 사용
├── dream-ai/route.ts             ← 꿈해몽 AI
├── dream/route.ts                ← 꿈해몽 (정적 DB)
├── face-reading-premium/route.ts ← 내관상보기 (2-call)
├── face-reading/route.ts         ← 관상짤 (단순 버전)
├── gemini-test/route.ts          ← Gemini 테스트 엔드포인트
├── gift-codes/route.ts           ← 기프트 코드
├── goods/route.ts                ← 굿즈/스토어
├── gwansang-compat/route.ts      ← 관상궁합 5모드 (2-call)
├── gwansang-zal/route.ts         ← 관상짤 AI
├── hanja-search/route.ts         ← 한자 검색 (이름풀이용)
├── history/route.ts              ← 기록 저장/조회
├── joseon-face-swap/route.ts     ← 조선초상화 face-swap (Replicate)
├── joseon-portrait/route.ts      ← 조선초상화 AI
├── mole-reading/route.ts         ← 얼굴점 (SVG 오버레이)
├── notification-signups/route.ts ← 알림 신청
├── numerology/route.ts           ← 수비학 AI
├── orders/[id]/route.ts          ← 주문 단건 조회
├── orders/route.ts               ← 주문 생성/목록
├── palm-reading/route.ts         ← 손금 (SVG 오버레이)
├── parent-child-compat/route.ts  ← 부모자식궁합 (2-call)
├── payment/verify/route.ts       ← PortOne 결제 검증 ⚠️
├── pet-gwansang/route.ts         ← 댕댕/냥냥상 (2-call)
├── photo-validate/route.ts       ← 사진 유효성 검사
├── push/cron/route.ts            ← 푸시알림 크론
├── push/send/route.ts            ← 푸시알림 전송
├── push/subscribe/route.ts       ← 푸시알림 구독
├── replicate-test/route.ts       ← Replicate 테스트
├── seasons/route.ts              ← 시즌 관리
├── share-card/route.ts           ← 카드 공유
├── share/route.ts                ← 공유 처리
├── special-items/route.ts        ← 특별 아이템
├── star/route.ts                 ← 별자리 운세
├── taemong/route.ts              ← 태몽해몽 AI
├── tojeong/route.ts              ← 토정비결 AI
└── zodiac/route.ts               ← 띠별운세 AI
```

---

*최종 업데이트: 2026-07-05*
