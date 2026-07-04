# Push Notification 셋업 가이드

매일 자정(KST 00:00) 자동으로 모든 구독자에게 운세 알림을 발송합니다.

## 1. 환경변수 추가 (Vercel Project Settings → Environment Variables)

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BOwozTecnZhBBTSK139L0ECTCBD2IoMpWwBdZ_aXIEDpRkbhhvEpI4Gr7AGmGHmO3nQ7YEG2eoWNIC_cceFQGRk
VAPID_PUBLIC_KEY=BOwozTecnZhBBTSK139L0ECTCBD2IoMpWwBdZ_aXIEDpRkbhhvEpI4Gr7AGmGHmO3nQ7YEG2eoWNIC_cceFQGRk
VAPID_PRIVATE_KEY=hfjAyhoW6ygYyR0R8MyaqMs8xMpm7v5RQGESiH4dXqI
VAPID_CONTACT_EMAIL=jihyeqoo@gmail.com
CRON_SECRET=<랜덤_문자열_32자_이상>
```

> ⚠️ VAPID 키는 한 번 생성하면 변경하지 마세요 (변경 시 모든 구독자 재구독 필요).
> CRON_SECRET은 외부 호출 차단용 — `openssl rand -hex 32` 등으로 생성.

## 2. Supabase 테이블 생성 (SQL Editor에서 실행)

```sql
create table if not exists push_subscriptions (
  id bigserial primary key,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  user_email text,
  user_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists push_subscriptions_endpoint_idx on push_subscriptions(endpoint);
```

## 3. Vercel Cron 자동 설정

`vercel.json` 이미 설정 완료:
```json
{ "crons": [{ "path": "/api/push/cron", "schedule": "0 15 * * *" }] }
```
- UTC 15:00 = KST 00:00 (한국 자정)
- Vercel 배포 시 자동 등록 (Vercel Pro 플랜 이상 필요)

## 4. 클라이언트 구독 UI 통합

`src/lib/push.ts`의 helper 사용:
```tsx
import { subscribePush, unsubscribePush, getPushPermission } from "@/lib/push";

// 알림 받기 버튼
<button onClick={async () => {
  const r = await subscribePush({ email: userData?.email, name: userData?.name });
  if (r.ok) alert("매일 자정 운세 알림이 발송됩니다!");
  else alert(r.reason);
}}>🔔 매일 운세 알림 받기</button>
```

## 5. 수동 발송 테스트

```bash
curl -X POST https://chungi.kr/api/push/send \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트","body":"수동 발송 확인","secret":"<CRON_SECRET>"}'
```

## 6. 발송 통계

```bash
curl https://chungi.kr/api/push/send
# → { subscribers: N }
```

## 일일 메시지 풀 (7종 회전)

`src/app/api/push/cron/route.ts`의 `DAILY_MESSAGES` 배열에서 수정 가능.
날짜(day % 7) 기반으로 매일 다른 메시지 발송.
