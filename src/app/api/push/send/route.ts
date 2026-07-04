import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// VAPID 설정 (환경변수에서 로드)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:" + (process.env.VAPID_CONTACT_EMAIL || "noreply@chungi.kr"),
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// POST: 모든 구독자에게 알림 발송 (cron 또는 admin 호출)
// body: { title, body, url, tag, secret }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, body: msg, url, tag, secret } = body;

  // 보안: cron secret 검증 (CRON_SECRET 환경변수)
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: "VAPID 키 미설정 — 환경변수 추가 필요" }, { status: 500 });
  }

  // 모든 구독자 조회
  const { data: subs, error } = await supabase.from("push_subscriptions").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const payload = JSON.stringify({
    title: title || "천기 CHUNGI",
    body: msg || "오늘의 운세가 도착했어요! 🔮",
    url: url || "/",
    tag: tag || "chungi-daily",
  });

  let sent = 0, failed = 0;
  const expired: string[] = [];

  await Promise.all(
    (subs || []).map(async (s: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        sent++;
      } catch (e: any) {
        failed++;
        // 410(GONE)/404(NOT FOUND) → 만료된 구독 제거
        if (e?.statusCode === 410 || e?.statusCode === 404) expired.push(s.endpoint);
      }
    })
  );

  // 만료 구독 정리
  if (expired.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", expired);
  }

  return NextResponse.json({ success: true, sent, failed, expired: expired.length });
}

// GET: 발송 통계 (admin용)
export async function GET() {
  const { count, error } = await supabase
    .from("push_subscriptions")
    .select("*", { count: "exact", head: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscribers: count || 0 });
}
