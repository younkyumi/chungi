# 천기 CHUNGI 배포 체크리스트

론칭 전 최종 점검용 통합 문서. 순서대로 진행하세요.

---

## 1️⃣ Supabase SQL — 한 번에 실행

Supabase Dashboard → SQL Editor 에서 아래 전체 실행.

```sql
-- ═══════════════════════════════════════════════════════════════
-- 천기 CHUNGI 신규 테이블 4종 (2026.04 추가분)
-- ═══════════════════════════════════════════════════════════════

-- ① 사용자 쿠폰함 (개인 소유 쿠폰)
create table if not exists user_coupons (
  id bigserial primary key,
  user_id text not null,
  code text not null,
  name text not null,
  discount_amount int not null,
  min_price int default 0,
  target_service text default 'all',
  is_used boolean default false,
  used_at timestamptz,
  used_order_id text,
  used_amount int,
  expires_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists user_coupons_user_idx on user_coupons(user_id, created_at desc);
create index if not exists user_coupons_user_unused_idx on user_coupons(user_id, is_used);

-- ② 쿠폰 코드 마스터 (관리자가 발급하는 코드 풀)
create table if not exists coupon_codes (
  code text primary key,
  name text not null,
  discount_amount int not null,
  min_price int default 0,
  target_service text default 'all',
  max_uses int,               -- null이면 무제한
  once_per_user boolean default true,
  expires_at timestamptz,      -- 코드 자체 만료일
  user_expires_days int,       -- 사용자에게 발급 후 유효기간(일)
  created_at timestamptz default now()
);

-- 기본 쿠폰 코드 3개 (원하면 수정/삭제)
insert into coupon_codes (code, name, discount_amount, min_price, target_service, once_per_user, user_expires_days)
values
  ('WELCOME',  '🎉 가입 환영 1,000원 쿠폰',   1000, 1980, 'all', true, 30),
  ('FREELOOK', '🎁 관상짤 무료 쿠폰',         380,  380,  'gwansang_zal', true, 7),
  ('OPEN500',  '🎊 오픈 기념 500원 쿠폰',     500,  980,  'all', true, 14)
on conflict (code) do nothing;

-- ③ 사용자 이용 기록 (기록소 컬렉션 영구 저장)
create table if not exists user_history (
  id bigserial primary key,
  user_id text not null,
  icon text,
  name text not null,
  svc_id text,
  person text,
  person2 text,
  person3 text,
  date text,
  result text,
  result_type jsonb,
  ctx jsonb,
  created_at timestamptz default now()
);
create index if not exists user_history_user_idx on user_history(user_id, created_at desc);

-- ④ 공유 카드 (바이럴 링크 /share/[id])
create table if not exists shared_cards (
  id bigserial primary key,
  short_id text unique not null,
  svc_id text not null,
  svc_name text,
  user_name text,
  result_data jsonb,
  cover_image text,
  title text,
  description text,
  view_count int default 0,
  created_at timestamptz default now(),
  expires_at timestamptz
);
create index if not exists shared_cards_short_idx on shared_cards(short_id);

-- ⑤ Push Notification 구독자 (매일 자정 알림)
create table if not exists push_subscriptions (
  id bigserial primary key,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  user_email text,
  user_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists push_subscriptions_endpoint_idx on push_subscriptions(endpoint);

-- ⑥ 공유 뱃지 (이미 있지만 확인용)
create table if not exists share_badges (
  id bigserial primary key,
  user_id text not null,
  service_id text not null,
  badge_type text default 'kakao',
  shared_at timestamptz default now()
);
create index if not exists share_badges_user_idx on share_badges(user_id, shared_at desc);
```

---

## 2️⃣ Vercel 환경변수 추가

**Vercel Project Settings → Environment Variables** 에서 아래 추가.

### 필수 (기존에 있을 것)
```
NEXT_PUBLIC_SUPABASE_URL=<supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
NEXT_PUBLIC_KAKAO_JS_KEY=<카카오 JS 키>
```

### 신규 — Push Notification
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BOwozTecnZhBBTSK139L0ECTCBD2IoMpWwBdZ_aXIEDpRkbhhvEpI4Gr7AGmGHmO3nQ7YEG2eoWNIC_cceFQGRk
VAPID_PUBLIC_KEY=BOwozTecnZhBBTSK139L0ECTCBD2IoMpWwBdZ_aXIEDpRkbhhvEpI4Gr7AGmGHmO3nQ7YEG2eoWNIC_cceFQGRk
VAPID_PRIVATE_KEY=hfjAyhoW6ygYyR0R8MyaqMs8xMpm7v5RQGESiH4dXqI
VAPID_CONTACT_EMAIL=jihyeqoo@gmail.com
CRON_SECRET=<openssl rand -hex 32 로 생성한 랜덤 문자열>
```

### 선택 — AI 기능
```
ANTHROPIC_API_KEY=<관상·사주 AI 분석용>
REPLICATE_API_TOKEN=<2세예측 face-swap용>
REPLICATE_FACE_MIX_VERSION=<face-mix 모델 버전 해시>
```

---

## 3️⃣ Vercel 플랜

- **Vercel Pro 이상 필요** — `vercel.json`의 cron (매일 자정 푸시 발송) 사용
- 만약 Hobby 플랜이면 cron 비활성화 → 외부 cron 서비스 (cron-job.org 등) 사용

---

## 4️⃣ 배포 후 테스트 체크리스트

### 🔐 인증
- [ ] 카카오 로그인 → `localStorage.chungi_user_id` 에 UUID 저장되는지
- [ ] 구글 로그인 → 동일 확인

### 💳 결제 (PortOne은 오픈 직전 연동 예정)
- [ ] mock 결제 흐름: 쿠폰 선택 → 결제 → 쿠폰 used 처리 확인 (Supabase `user_coupons.is_used=true`)
- [ ] `WELCOME` 코드 입력 → 쿠폰 발급
- [ ] 캐시·이용권 흐름

### 📋 기록소
- [ ] 로그인 후 콘텐츠 이용 → `user_history` 테이블에 row 추가
- [ ] 로그아웃 후 재로그인 → 기록이 복구되는지
- [ ] 다른 기기 로그인 → 동일 기록 조회

### 🔔 푸시 알림
- [ ] (구독 UI 통합 후) 알림 권한 허용 → `push_subscriptions` 에 endpoint 저장
- [ ] 수동 테스트: `curl -X POST /api/push/send ...`
- [ ] 다음 날 자정 자동 발송 확인

### 🔗 공유 카드
- [ ] `shareCardToKakao({svc_id:"baby_face", user_name:"홍길동", result_data:{...}})` 호출
- [ ] 받은 URL `/share/xxxxxx` 접속 → 결과 카드 렌더링
- [ ] 카카오톡 대화방에 링크 전송 → Open Graph 미리보기 (이미지·제목·설명)

### 🌅 자동 갱신
- [ ] 자정 지나면 수호 기운·오늘의 운세·로또 번호 모두 새 값
- [ ] 30일 개근 챌린지 일일 카운트

---

## 5️⃣ 최종 SQL 관리 쿼리 (운영 중 사용)

### 푸시 알림 가입자 수
```sql
select count(*) from push_subscriptions;
```

### 오늘 발급된 쿠폰
```sql
select name, code, discount_amount, created_at
from user_coupons
where created_at::date = current_date
order by created_at desc;
```

### 공유 카드 조회수 TOP 10
```sql
select short_id, svc_name, user_name, view_count, created_at
from shared_cards
order by view_count desc
limit 10;
```

### 인기 콘텐츠 (최근 30일)
```sql
select svc_id, count(*) as uses
from user_history
where created_at > now() - interval '30 days'
group by svc_id
order by uses desc;
```

### 만료된 공유 카드 정리 (크론)
```sql
delete from shared_cards where expires_at < now();
```

---

## 🔍 이슈 발생 시 확인 포인트

| 증상 | 확인 |
|---|---|
| 쿠폰 등록 안 됨 | `coupon_codes` 테이블에 코드 있는지 |
| 기록소 빈칸 | `localStorage.chungi_user_id` 값 있는지, `user_history` 테이블 권한 |
| 공유 링크 404 | `shared_cards.expires_at` 지났는지 |
| 푸시 안 옴 | VAPID 환경변수 · `push_subscriptions` 테이블 확인, Vercel cron 로그 |
| 자정 갱신 안 됨 | 페이지 새로고침 (polling 1분마다 체크) |

---

**🚀 모두 통과하면 론칭 준비 완료!**
