# 🔮 천기 CHUNGI — 오픈 준비 체크리스트

## ✅ 완료
- [x] Next.js 프로젝트 세팅 + Vercel 배포
- [x] chungi.kr / 천기.kr 도메인 연결
- [x] Supabase DB 테이블 생성 (6개)
- [x] 구글 로그인 연동
- [x] 포트원 결제 연동 (테스트 모드)
- [x] SEO (메타태그, OG태그, sitemap, robots.txt)
- [x] 이용약관 / 개인정보처리방침 페이지
- [x] 푸터 사업자 정보
- [x] 관리자 페이지 (비번: chungi2026)
- [x] 굿즈샵 261개 상품 반영 + 옵션 선택 UI
- [x] 등급 시스템 (새싹→달빛→별→샛별→북극성→천기인)
- [x] 하루 1회 제한 (결과 저장 + 재열람 가능)
- [x] 무료 콘텐츠 비로그인 이용 가능
- [x] PWA 설정 (manifest + service worker + 아이콘)
- [x] 카카오/인스타/트위터/링크 공유 버튼
- [x] 출석체크 시스템
- [x] MyPage 모든 항목 클릭 가능 (10개 모달)
- [x] Google Analytics 컴포넌트 (측정 ID 입력 필요)

## ⏳ 오픈 전 필수
- [ ] **Claude API 키 발급** → console.anthropic.com
  - .env.local + Vercel 환경변수에 ANTHROPIC_API_KEY 추가
  - 사주/타로/꿈해몽/관상짤 실제 AI 응답 테스트
- [ ] **카카오 로그인 KOE205 해결**
  - 카카오 디벨로퍼스 → 카카오 로그인 → 동의항목 → 이메일 필수/선택 동의
  - Redirect URI: https://akiwsjznpcbpjvhbruky.supabase.co/auth/v1/callback
- [ ] **토스페이먼츠 실연동 키** → 심사 완료 후
  - 포트원 채널 MID/키 교체 (테스트→실연동)
- [ ] **결제 플로우 테스트** (980원 콘텐츠)
- [ ] **Google Analytics 측정 ID** → G-XXXXXXXXXX 입력
- [ ] **굿즈 DB Supabase 입력** → supabase/insert-goods.sql 실행

## 📋 오픈 전 권장
- [ ] PWA 아이콘 디자인 교체 (현재 로고2 임시 사용)
- [ ] OG 이미지 제작 (1200x630)
- [ ] 카카오 비즈니스 채널 개설 → 비즈메시지 토큰
- [ ] 관상짤 사진 업로드 → Claude Vision 테스트
- [ ] 모바일 iPhone/Android 최종 점검
- [ ] 관리자 페이지 → Supabase 실시간 연동 (현재 localStorage)

## 💰 비용 정리
| 항목 | 비용 | 상태 |
|---|---|---|
| Vercel 호스팅 | 무료 (Hobby) | ✅ |
| Supabase | 무료 (Free tier) | ✅ |
| chungi.kr 도메인 | 가비아 연간 | ✅ |
| 천기.kr 도메인 | 가비아 연간 | ✅ |
| 토스페이먼츠 PG | 가입비 22만 + 연관리비 11만 | ✅ 결제완료 |
| Claude API | 종량제 (Haiku 저렴) | ⏳ 키 발급 대기 |
| 카카오 로그인 | 무료 | ⏳ 설정 수정 |
| 구글 로그인 | 무료 | ✅ |

## 🔑 환경변수 현황 (.env.local)
| 변수 | 상태 |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ |
| NEXT_PUBLIC_KAKAO_CLIENT_ID | ✅ |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | ✅ |
| NEXT_PUBLIC_PORTONE_STORE_ID | ✅ |
| NEXT_PUBLIC_PORTONE_CHANNEL_KEY | ✅ |
| ANTHROPIC_API_KEY | ⏳ 미입력 |
| NEXT_PUBLIC_GA_ID | ⏳ 미입력 |
