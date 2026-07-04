import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// viewport는 layout <head>에서 직접 작성 — 안드로이드(갤럭시)는 width=430 정적값을
// 자동 축소하지 않아 잘림이 발생. 디바이스 너비 기준으로 initial-scale을 동적 계산해야 함.

export const metadata: Metadata = {
  title: "천기 CHUNGI - 운세, 사주, 관상, 타로 | 무료운세",
  description:
    "AI 기반 운세·사주·관상·타로 서비스. 무료운세부터 프리미엄 분석까지.",
  keywords: [
    "운세",
    "사주",
    "관상",
    "타로",
    "무료운세",
    "오늘의운세",
    "사주팔자",
    "관상분석",
    "천기",
  ],
  openGraph: {
    title: "천기 CHUNGI - 운세, 사주, 관상, 타로 | 무료운세",
    description:
      "AI 기반 운세·사주·관상·타로 서비스. 무료운세부터 프리미엄 분석까지.",
    type: "website",
    url: "https://chungi.kr",
    locale: "ko_KR",
    siteName: "천기 CHUNGI",
    images: [
      { url: "https://chungi.kr/icons/icon-512.png", width: 512, height: 512, alt: "천기 CHUNGI" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "천기 CHUNGI - 운세, 사주, 관상, 타로 | 무료운세",
    description:
      "AI 기반 운세·사주·관상·타로 서비스. 무료운세부터 프리미엄 분석까지.",
    images: ["https://chungi.kr/icons/icon-512.png"],
  },
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning (v696): React error #418 차단 — 모바일 브라우저 익스텐션/번역기/
    // 다이나믹 viewport 스크립트가 DOM을 hydration 전에 만지면 텍스트 노드 mismatch 발생.
    // Page() 안 mount 가드(v678)와 함께 안전망. 본 콘텐츠 렌더링에는 영향 없음.
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 동적 viewport — 디바이스 너비 < 430이면 initial-scale을 비례 축소해서 잘림 방지.
            (안드로이드/갤럭시는 width=430 정적값을 자동 축소하지 않음. 핀치 줌은 그대로 동작.) */}
        <meta name="viewport" id="vp-meta" content="width=430, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=430;var w=document.documentElement.clientWidth||window.innerWidth||d;var s=Math.min(1,w/d);var m=document.getElementById('vp-meta')||document.querySelector('meta[name="viewport"]');if(m)m.setAttribute('content','width='+d+', initial-scale='+s+', viewport-fit=cover');})();`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A3C32" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700;900&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css" />
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" async />
        {/* Kakao SDK 자동 초기화 — SDK 로드되면 즉시 init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var key="${process.env.NEXT_PUBLIC_KAKAO_JS_KEY||""}";
              if(!key)return;
              var tries=0;
              var t=setInterval(function(){
                if(window.Kakao&&!window.Kakao.isInitialized()){
                  try{window.Kakao.init(key);clearInterval(t);}catch(e){}
                }else if(window.Kakao&&window.Kakao.isInitialized()){
                  clearInterval(t);
                }
                if(++tries>50)clearInterval(t);
              },200);
            })();`,
          }}
        />
        {/* v679: preload 제거 — 2세예측 모달 안 열면 미사용 경고 폭주. 모달 진입 시 onDemand 로드로 충분. */}
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
