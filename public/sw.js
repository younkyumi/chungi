const CACHE_NAME = 'chungi-v839';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// ⚠️ v819 fix — 예전 코드는 `fetch(...).catch(() => caches.match(...))` 였음.
// caches.match()는 캐시에 없으면 undefined를 반환하는데 respondWith()는 Response만 받는다
// → "TypeError: Failed to convert value to 'Response'" + 브라우저에 하드 네트워크 에러 전달.
// 게다가 이 SW는 cache.put을 한 번도 하지 않아 캐시가 항상 비어 있어서, 네트워크가 한 번만
// 실패해도 무조건 이 경로를 타 흰 화면이 떴음. (신호 약한 모바일에서 특히)
self.addEventListener('fetch', event => {
  // GET만 가로챈다. POST(/api/*)는 브라우저 기본 동작에 맡겨야 재시도·에러 처리가 정상 동작함
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      // 캐시에도 없으면 undefined 대신 반드시 Response를 돌려준다
      return new Response('오프라인이거나 네트워크가 불안정해요. 연결을 확인하고 새로고침해주세요.', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    })
  );
});

// 🔔 Push 알림 (Web Push 표준) — 매일 자정 오늘 운세 등
self.addEventListener('push', event => {
  let data = { title: '천기 CHUNGI', body: '오늘의 운세가 도착했어요!', url: '/' };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch {}
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag || 'chungi-daily',
      data: { url: data.url || '/' },
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const c of clientList) {
        if (c.url.includes(self.location.origin) && 'focus' in c) {
          c.navigate(url);
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
