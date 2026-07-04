import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:" + (process.env.VAPID_CONTACT_EMAIL || "noreply@chungi.kr"),
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// 일일 메시지 풀 (날짜 기반 회전)
const DAILY_MESSAGES = [
  { title: "🌅 오늘의 운세 도착!", body: "당신의 하루를 미리 봐드릴게요. 오늘은 어떤 기운일까요?" },
  { title: "🃏 오늘의 타로 한 장", body: "우주가 보낸 메시지를 카드 한 장에 담았어요." },
  { title: "🎰 오늘의 행운 번호", body: "사주 오행에 맞춘 행운 번호 6자리가 도착했어요." },
  { title: "✦ 오늘의 수호 기운", body: "수호색·방향·시간 — 오늘 행운이 흐르는 길을 알려드려요." },
  { title: "🌙 어젯밤 꿈, 해몽해드릴까요?", body: "꿈에 본 그것, 어떤 의미인지 천기가 풀어드려요." },
  { title: "🐯 띠별 오늘 운세", body: "내 띠의 오늘 흐름이 궁금하다면 들어와 보세요." },
  { title: "📅 이번 주 길흉 흐름", body: "이번 주 가장 좋은 날과 조심해야 할 날을 알려드려요." },
];

// Vercel cron이 호출 (자동) — KST 00:00 = UTC 15:00
// 외부에서도 호출 가능 (CRON_SECRET 검증)
export async function GET(request: NextRequest) {
  // Vercel cron은 자동 인증, 외부 호출은 secret 검증
  const auth = request.headers.get("authorization");
  const isVercelCron = auth === `Bearer ${process.env.CRON_SECRET}`;
  if (!isVercelCron && process.env.CRON_SECRET) {
    // Vercel cron 자동 헤더 (CRON_SECRET가 환경변수에 있을 때만 검증)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: "VAPID 키 미설정" }, { status: 500 });
  }

  // 오늘 날짜 기반 메시지 선택
  const day = new Date().getDate();
  const msg = DAILY_MESSAGES[day % DAILY_MESSAGES.length];
  const payload = JSON.stringify({
    title: msg.title,
    body: msg.body,
    url: "/",
    tag: "chungi-daily",
  });

  const { data: subs, error } = await supabase.from("push_subscriptions").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
        if (e?.statusCode === 410 || e?.statusCode === 404) expired.push(s.endpoint);
      }
    })
  );

  if (expired.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", expired);
  }

  return NextResponse.json({
    success: true, sent, failed, expired: expired.length,
    title: msg.title, time: new Date().toISOString(),
  });
}
