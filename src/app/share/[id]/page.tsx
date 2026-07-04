import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getCard(id: string) {
  const { data } = await supabase.from("shared_cards").select("*").eq("short_id", id).maybeSingle();
  return data;
}

// Open Graph 메타 (카카오톡·트위터 링크 미리보기용)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return { title: "천기 CHUNGI" };

  const title = card.title || `${card.user_name || "천기인"}님의 ${card.svc_name || "운세"} 결과`;
  const desc = card.description || `천기에서 ${card.svc_name || "운세"}를 분석한 결과를 확인하세요!`;
  const img = card.cover_image || "https://chungi.kr/icons/icon-512.png";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      url: `https://chungi.kr/share/${id}`,
      locale: "ko_KR",
      siteName: "천기 CHUNGI",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title, description: desc, images: [img],
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) {
    return (
      <div style={{minHeight:"100dvh",background:"#1A3C32",color:"#F4F1E1",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Pretendard','Noto Serif KR',sans-serif",padding:"20px"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:60,marginBottom:16}}>🔮</div>
          <h1 style={{fontSize:20,fontWeight:900,marginBottom:8,color:"#D4AF37"}}>카드를 찾을 수 없어요</h1>
          <p style={{fontSize:13,color:"#A8C4B8",marginBottom:24}}>만료되었거나 존재하지 않는 공유 링크예요.</p>
          <Link href="/" style={{display:"inline-block",padding:"12px 24px",background:"#D4AF37",color:"#1A3C32",borderRadius:12,fontWeight:800,textDecoration:"none"}}>천기 홈으로 →</Link>
        </div>
      </div>
    );
  }

  const rd = card.result_data || {};
  const emoji = rd.emoji || rd.icon || "✨";
  const name = rd.name || rd.persona || rd.headline || card.svc_name;
  const subtitle = rd.meaning || rd.subtitle || rd.desc || "";

  return (
    <div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#1A3C32 0%,#234F42 100%)",color:"#F4F1E1",fontFamily:"'Pretendard','Noto Serif KR',sans-serif",padding:"40px 16px"}}>
      <div style={{maxWidth:420,margin:"0 auto"}}>
        {/* 헤더 */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:"#D4AF37",letterSpacing:3,fontWeight:700,marginBottom:4}}>🔮 CHUNGI · 天機</div>
          <div style={{fontSize:13,color:"#A8C4B8"}}>{card.user_name||"천기인"}님이 공유한 결과</div>
        </div>

        {/* 결과 카드 */}
        <div style={{background:"#fff",color:"#333",borderRadius:22,overflow:"hidden",boxShadow:"0 10px 40px rgba(0,0,0,0.3)",marginBottom:16}}>
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid #f3f4f6",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#aaa",letterSpacing:1}}>🔮 천기(天機) 오리지널 | {card.svc_name}</div>
          </div>
          <div style={{padding:"32px 16px 24px",textAlign:"center"}}>
            <div style={{fontSize:72,marginBottom:12,lineHeight:1}}>{emoji}</div>
            <h1 style={{fontSize:22,fontWeight:900,color:"#1A3C32",fontFamily:"'Noto Serif KR','Batang',serif",marginBottom:8}}>{name}</h1>
            {subtitle&&<p style={{fontSize:13,color:"#666",lineHeight:1.7}}>{subtitle}</p>}
          </div>
          {rd.headline&&(
            <div style={{padding:"0 16px 20px"}}>
              <div style={{background:"#1A3C32",borderRadius:12,padding:"14px",color:"#fff",borderLeft:"4px solid #D4AF37"}}>
                <div style={{fontSize:9,color:"#D4AF37",fontWeight:700,marginBottom:4,letterSpacing:1}}>BREAKING NEWS · 2050</div>
                <div style={{fontSize:13,fontWeight:700,lineHeight:1.7}}>"{rd.headline}"</div>
              </div>
            </div>
          )}
          <div style={{padding:"10px 16px 16px",textAlign:"center",borderTop:"1px solid #f3f4f6"}}>
            <div style={{fontSize:10,color:"#888",marginBottom:4}}>조회 {(card.view_count||0)+1}회</div>
            <div style={{fontSize:10,color:"#374151",fontWeight:600}}>🌐 천기.kr</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{background:"rgba(212,175,55,0.12)",border:"1px solid rgba(212,175,55,0.3)",borderRadius:14,padding:"20px",textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,color:"#D4AF37",marginBottom:6}}>✨ 나도 내 운세 보러가기</div>
          <div style={{fontSize:11,color:"#A8C4B8",marginBottom:14,lineHeight:1.6}}>사주·관상·타로·이름 풀이까지<br/>AI 운세 서비스 천기 CHUNGI</div>
          <Link href="/" style={{display:"inline-block",padding:"12px 28px",background:"#D4AF37",color:"#1A3C32",borderRadius:12,fontWeight:900,textDecoration:"none",fontSize:14}}>천기에서 내 운세 보기 →</Link>
        </div>

        {/* 푸터 */}
        <div style={{textAlign:"center",fontSize:10,color:"#A8C4B8",opacity:0.6,marginTop:24}}>
          © 천기 CHUNGI · chungi.kr
        </div>
      </div>
    </div>
  );
}
