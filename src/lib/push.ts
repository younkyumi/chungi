// Push Notification 클라이언트 helper
// 자정 자동 발송 알림 구독·해제 관리

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function isPushSupported(): Promise<boolean> {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

export async function getPushPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!(await isPushSupported())) return "unsupported";
  return Notification.permission;
}

// 구독 (브라우저 권한 요청 → endpoint 받기 → 서버 저장)
export async function subscribePush(userInfo?: { email?: string; name?: string }): Promise<{ ok: boolean; reason?: string }> {
  if (!(await isPushSupported())) return { ok: false, reason: "브라우저가 푸시를 지원하지 않아요" };
  if (!VAPID_PUBLIC_KEY) return { ok: false, reason: "VAPID 키 미설정 — 관리자에게 문의" };

  // 권한 요청
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return { ok: false, reason: "알림 권한이 거부됐어요" };

  // SW 등록 대기
  const reg = await navigator.serviceWorker.ready;

  // 기존 구독 있으면 재사용, 없으면 새로 구독
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
    });
  }

  // 서버에 endpoint+keys 저장
  const json = sub.toJSON();
  const r = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: json.keys,
      user_email: userInfo?.email,
      user_name: userInfo?.name,
    }),
  });
  if (!r.ok) return { ok: false, reason: "서버 등록 실패" };
  try { localStorage.setItem("chungi_push_subscribed", "true"); } catch {}
  return { ok: true };
}

// 구독 해제
export async function unsubscribePush(): Promise<{ ok: boolean }> {
  if (!(await isPushSupported())) return { ok: false };
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await fetch("/api/push/subscribe?endpoint=" + encodeURIComponent(sub.endpoint), { method: "DELETE" }).catch(() => {});
    await sub.unsubscribe();
  }
  try { localStorage.removeItem("chungi_push_subscribed"); } catch {}
  return { ok: true };
}

export function isPushSubscribedLocally(): boolean {
  try { return localStorage.getItem("chungi_push_subscribed") === "true"; } catch { return false; }
}
