// Kakao SDK를 사용한 공유 기능
// Layout에서 Kakao SDK 스크립트를 로드해야 함

declare global {
  interface Window {
    Kakao: any;
  }
}

export function initKakao() {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (key) window.Kakao.init(key);
  }
}

export function shareToKakao({ title, description, imageUrl, link }: {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
}) {
  if (typeof window === 'undefined' || !window.Kakao) return;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl: imageUrl || 'https://chungi.kr/og-image.png',
      link: { mobileWebUrl: link, webUrl: link },
    },
    buttons: [
      { title: '나도 운세 보기', link: { mobileWebUrl: link, webUrl: link } },
    ],
  });
}
