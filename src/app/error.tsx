"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 콘솔에 에러 출력 (디버깅용)
    console.error("[App Error]", error);
  }, [error]);

  function clearAndReload() {
    try {
      // 손상된 데이터 가능성 → 정리 후 새로고침
      ["chungi_history"].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
    } catch {}
    reset();
  }

  return (
    <div style={{
      minHeight:"100dvh",background:"#1A3C32",color:"#F4F1E1",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:"20px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"
    }}>
      <div style={{maxWidth:380,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:14}}>🌫️</div>
        <div style={{fontFamily:"'Noto Serif KR','Batang',serif",fontSize:20,fontWeight:900,color:"#D4AF37",marginBottom:8}}>
          잠시 기운이 흐트러졌어요
        </div>
        <div style={{fontSize:13,color:"#A8C4B8",lineHeight:1.7,marginBottom:20}}>
          페이지에 일시적인 오류가 생겼어요.<br/>
          다시 시도하거나 캐시를 정리하면 해결돼요.
        </div>
        {error?.message && (
          <div style={{fontSize:10,color:"#888",background:"rgba(0,0,0,0.3)",padding:"8px 12px",borderRadius:8,marginBottom:16,wordBreak:"break-all",lineHeight:1.5}}>
            {error.message.slice(0,200)}
          </div>
        )}
        <button onClick={reset} style={{
          width:"100%",padding:14,marginBottom:10,
          background:"linear-gradient(135deg,#D4AF37,#B8942E)",color:"#1A3C32",
          border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer",
          fontFamily:"inherit",boxShadow:"0 4px 16px rgba(212,175,55,0.3)"
        }}>다시 시도</button>
        <button onClick={clearAndReload} style={{
          width:"100%",padding:12,
          background:"transparent",color:"#A8C4B8",
          border:"1px solid rgba(168,196,184,0.3)",borderRadius:14,fontSize:12,fontWeight:600,cursor:"pointer",
          fontFamily:"inherit"
        }}>📋 기록소 캐시 초기화 후 재시도</button>
      </div>
    </div>
  );
}
