// 공유 카드 클라이언트 helper
// 결과 데이터를 서버에 저장하고 짧은 공유 URL을 받음

export type ShareCardData = {
  svc_id: string;
  svc_name?: string;
  user_name?: string;
  title?: string;
  description?: string;
  cover_image?: string;
  result_data: any;
};

export type ShareCardResult = {
  ok: boolean;
  url?: string;
  short_id?: string;
  fullUrl?: string;
  reason?: string;
};

export async function createShareCard(data: ShareCardData): Promise<ShareCardResult> {
  try {
    const r = await fetch("/api/share-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const j = await r.json();
    if (!r.ok || !j.short_id) return { ok: false, reason: j.error || "생성 실패" };
    const base = typeof window !== "undefined" ? window.location.origin : "https://chungi.kr";
    return { ok: true, url: j.url, short_id: j.short_id, fullUrl: `${base}${j.url}` };
  } catch (e: any) {
    return { ok: false, reason: e?.message || "네트워크 오류" };
  }
}

// 카카오톡으로 공유 카드 전송 (링크 포함) — SDK 로드 race condition 핸들링
export async function shareCardToKakao(data: ShareCardData): Promise<ShareCardResult> {
  const r = await createShareCard(data);
  if (!r.ok || !r.fullUrl) return r;

  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
  // SDK 최대 1.5초 대기 + init
  for (let i = 0; i < 15; i++) {
    const K = (typeof window !== "undefined" && (window as any).Kakao) || null;
    if (K) {
      if (!K.isInitialized() && jsKey) { try { K.init(jsKey); } catch {} }
      if (K.isInitialized()) break;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  try {
    const K = (window as any).Kakao;
    if (K?.isInitialized?.()) {
      K.Share.sendDefault({
        objectType: "feed",
        content: {
          title: data.title || `${data.user_name || "천기인"}님의 ${data.svc_name || "운세"} 결과`,
          description: data.description || "천기에서 운세를 분석한 결과를 확인하세요!",
          imageUrl: data.cover_image || "https://chungi.kr/icons/icon-512.png",
          link: { mobileWebUrl: r.fullUrl, webUrl: r.fullUrl },
        },
        buttons: [
          { title: "결과 보기", link: { mobileWebUrl: r.fullUrl, webUrl: r.fullUrl } },
          { title: "나도 천기 보기", link: { mobileWebUrl: "https://chungi.kr", webUrl: "https://chungi.kr" } },
        ],
      });
      return r;
    }
  } catch (e) { console.error("Kakao card share error:", e); }
  // Fallback
  try { await navigator.clipboard?.writeText(r.fullUrl); alert("카카오톡이 안 열려서 링크를 복사했어요! 카톡에 붙여넣어 주세요 🔗\n" + r.fullUrl); } catch {}
  return r;
}
