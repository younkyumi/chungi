"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Supabase 설정 (환경변수로 교체)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 콘텐츠 타입 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CONTENT_TYPES = {
  saju:     { label:"사주 풀이",   emoji:"🔮", desc:"운명의 뼈대",          weight:3, ohangKey:"ilgan_ohang" },
  gijildo:  { label:"기질도",      emoji:"☯️", desc:"타고난 성질",          weight:2, ohangKey:"dominant_ohang" },
  gwansang: { label:"관상보기",    emoji:"👁️", desc:"얼굴에 새겨진 운세",   weight:1, ohangKey:"face_ohang" },
  love:     { label:"연애운·궁합", emoji:"❤️", desc:"인연의 흐름",          weight:1, ohangKey:"love_ohang" },
  sonkeum:  { label:"손금·발금",   emoji:"✋", desc:"신체에 새겨진 운명",   weight:1, ohangKey:"body_ohang" },
  ireum:    { label:"이름 풀이",   emoji:"✍️", desc:"이름의 에너지",        weight:1, ohangKey:"name_ohang" },
};

const UNLOCK_COUNT = 3; // 수호신 잠금 해제 조건

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 기질도 코드 → 오행 변환
// 양천리강에서 인식축(천/지)이 오행 방향 결정
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function gijildoToOhang(code) {
  if (!code) return null;
  const chars = typeof code === "string" ? code.split("") : [];
  // 기운(양/음) → 오행 방향
  const 기운 = chars[0]; // 양/음
  const 인식 = chars[1]; // 천/지
  const 판단 = chars[2]; // 리/정
  const 생활 = chars[3]; // 강/유

  // 인식 축이 가장 오행과 직결
  if (인식 === "천") {
    return 기운 === "양" ? "화" : "목"; // 직관+양=화, 직관+음=목
  } else {
    return 기운 === "양" ? "토" : "금"; // 감각+양=토, 감각+음=금
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 핵심 함수: 멀티 콘텐츠 → 수호신 도출
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GUARDIAN_OHANG_MAP = {
  봉황: { 화:3, 목:2, 토:0, 금:0, 수:0 },
  용:   { 목:3, 수:2, 화:1, 토:0, 금:0 },
  백호: { 금:3, 토:1, 목:0, 화:0, 수:0 },
  현무: { 수:3, 금:2, 토:1, 목:0, 화:0 },
  기린: { 목:3, 토:2, 화:1, 금:0, 수:0 },
  주작: { 화:3, 목:1, 토:0, 금:0, 수:0 },
  청룡: { 목:3, 화:2, 수:1, 토:0, 금:0 },
  백학: { 목:2, 금:2, 토:1, 화:1, 수:0 },
  흑호: { 금:2, 수:2, 목:0, 화:0, 토:1 },
  금오: { 화:2, 금:2, 토:1, 목:0, 수:0 },
  옥토: { 수:2, 금:2, 목:1, 토:0, 화:0 },
  해태: { 토:3, 금:2, 수:1, 목:0, 화:0 },
};

// 별자리 → 오행
const STAR_OHANG = {
  양:"화", 사자:"화", 사수:"화",
  쌍둥이:"목", 천칭:"목", 물병:"목",
  게:"수", 전갈:"수", 물고기:"수",
  황소:"금", 처녀:"금", 염소:"금",
};

function getStarSign(month, day) {
  const ranges = [
    {name:"염소",m1:1,d1:1,m2:1,d2:19},{name:"물병",m1:1,d1:20,m2:2,d2:18},
    {name:"물고기",m1:2,d1:19,m2:3,d2:20},{name:"양",m1:3,d1:21,m2:4,d2:19},
    {name:"황소",m1:4,d1:20,m2:5,d2:20},{name:"쌍둥이",m1:5,d1:21,m2:6,d2:20},
    {name:"게",m1:6,d1:21,m2:7,d2:22},{name:"사자",m1:7,d1:23,m2:8,d2:22},
    {name:"처녀",m1:8,d1:23,m2:9,d2:22},{name:"천칭",m1:9,d1:23,m2:10,d2:22},
    {name:"전갈",m1:10,d1:23,m2:11,d2:21},{name:"사수",m1:11,d1:22,m2:12,d2:21},
    {name:"염소",m1:12,d1:22,m2:12,d2:31},
  ];
  for(const r of ranges){
    if((month===r.m1&&day>=r.d1)||(month===r.m2&&day<=r.d2)) return r.name;
  }
  return "염소";
}

export function getGuardianFromReport({ contents, birthMonth, birthDay }) {
  // 오행 총합 점수
  const totalOhang = { 목:0, 화:0, 토:0, 금:0, 수:0 };

  contents.forEach(c => {
    const typeInfo = CONTENT_TYPES[c.type];
    if (!typeInfo || !c.ohang) return;
    const w = typeInfo.weight;
    totalOhang[c.ohang] = (totalOhang[c.ohang] || 0) + w;
  });

  // 별자리 오행 추가
  if (birthMonth && birthDay) {
    const star = getStarSign(birthMonth, birthDay);
    const starOh = STAR_OHANG[star];
    if (starOh) totalOhang[starOh] += 2;
  }

  // 각 수호신과 오행 매칭 점수 계산
  const guardianScores = {};
  Object.entries(GUARDIAN_OHANG_MAP).forEach(([guardian, ohangAffinity]) => {
    let score = 0;
    Object.entries(totalOhang).forEach(([oh, userScore]) => {
      score += userScore * (ohangAffinity[oh] || 0);
    });
    guardianScores[guardian] = score;
  });

  // 최고 점수 수호신
  const sorted = Object.entries(guardianScores).sort((a,b) => b[1]-a[1]);
  return {
    guardian: sorted[0][0],
    scores: guardianScores,
    totalOhang,
    top3: sorted.slice(0,3).map(([name,score]) => ({name, score})),
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Supabase API 함수들
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 유저 콘텐츠 결과 저장 (각 콘텐츠 이용 후 호출)
export async function saveContentResult({ userId, contentType, ohang, detailJson }) {
  const { data, error } = await supabase
    .from("user_content_results")
    .upsert({
      user_id: userId,
      content_type: contentType,
      ohang_result: ohang,
      detail_json: detailJson,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,content_type" });

  if (error) throw error;
  return data;
}

// 유저의 전체 콘텐츠 결과 가져오기
export async function getUserContents(userId) {
  const { data, error } = await supabase
    .from("user_content_results")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

// 수호신 결과 저장/업데이트
export async function saveGuardianResult({ userId, guardianName, scoreJson, contentCount }) {
  const { data, error } = await supabase
    .from("user_guardian")
    .upsert({
      user_id: userId,
      guardian_name: guardianName,
      score_json: scoreJson,
      content_count: contentCount,
      unlocked_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) throw error;
  return data;
}

// 수호신 결과 가져오기
export async function getGuardianResult(userId) {
  const { data, error } = await supabase
    .from("user_guardian")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Supabase SQL (실행할 것)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SQL_SETUP = `
-- 유저 콘텐츠 결과 테이블
CREATE TABLE IF NOT EXISTS user_content_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('saju','gwansang','love','gijildo','sonkeum','ireum')),
  ohang_result TEXT CHECK (ohang_result IN ('목','화','토','금','수')),
  detail_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_type)
);

-- 수호신 결과 테이블
CREATE TABLE IF NOT EXISTS user_guardian (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  guardian_name TEXT NOT NULL,
  score_json JSONB DEFAULT '{}',
  content_count INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS 활성화
ALTER TABLE user_content_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_guardian ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 접근 가능
CREATE POLICY "users_own_content" ON user_content_results
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_guardian" ON user_guardian
  FOR ALL USING (auth.uid() = user_id);
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 천기 리포트 UI 컴포넌트
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GUARDIAN_DATA = {
  봉황:{ emoji:"🦅", color:"#FF6B35", subtitle:"불꽃을 품은 재생의 새" },
  용:  { emoji:"🐉", color:"#00BCD4", subtitle:"하늘과 땅을 잇는 신령" },
  백호:{ emoji:"🐯", color:"#E0E0E0", subtitle:"서쪽을 지키는 강인한 수호자" },
  현무:{ emoji:"🐢", color:"#7986CB", subtitle:"북쪽을 지키는 지혜의 신" },
  기린:{ emoji:"🦄", color:"#CE93D8", subtitle:"평화와 길함을 전하는 상서로운 짐승" },
  주작:{ emoji:"🦜", color:"#EF5350", subtitle:"남쪽 하늘을 물들이는 불새" },
  청룡:{ emoji:"🐲", color:"#29B6F6", subtitle:"동쪽 새벽을 깨우는 선도자" },
  백학:{ emoji:"🕊️", color:"#80CBC4", subtitle:"하늘과 땅을 오가는 현자" },
  흑호:{ emoji:"🖤", color:"#9C27B0", subtitle:"어둠 속에서 빛나는 신비로운 존재" },
  금오:{ emoji:"☀️", color:"#FFD600", subtitle:"태양을 등에 지고 나는 황금 까마귀" },
  옥토:{ emoji:"🐇", color:"#69F0AE", subtitle:"달빛 아래 불로초를 빚는 치유자" },
  해태:{ emoji:"🦁", color:"#D4AC0D", subtitle:"도성 중앙을 지키는 광화문의 신수" },
};

const G = "#E8C87A";

export default function 천기리포트({ userId, birthMonth, birthDay, onClose }) {
  const [contents, setContents] = useState([]);
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  async function loadData() {
    setLoading(true);
    try {
      // 콘텐츠 결과 불러오기
      const userContents = await getUserContents(userId);
      setContents(userContents);

      // 수호신 잠금 해제 조건 확인
      if (userContents.length >= UNLOCK_COUNT) {
        const result = getGuardianFromReport({
          contents: userContents.map(c => ({ type: c.content_type, ohang: c.ohang_result })),
          birthMonth, birthDay,
        });

        // 수호신 저장
        await saveGuardianResult({
          userId,
          guardianName: result.guardian,
          scoreJson: result.scores,
          contentCount: userContents.length,
        });

        setGuardian(result);
        setTimeout(() => setRevealed(true), 500);
      }
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  }

  const usedTypes = contents.map(c => c.content_type);
  const completedCount = usedTypes.length;
  const guardianData = guardian ? GUARDIAN_DATA[guardian.guardian] : null;

  const hexToRgb = hex => {
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };

  return (
    <div style={{
      background:"#0D2318", borderRadius:"24px 24px 0 0",
      padding:"28px 24px 48px", maxHeight:"92vh", overflowY:"auto",
      fontFamily:"'Noto Serif KR',serif", color:"#F0EAD6",
    }}>
      {/* 헤더 */}
      <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,margin:"0 auto 20px"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <span style={{fontSize:22}}>🔍</span>
        <h2 style={{fontSize:20,fontWeight:700,margin:0}}>나의 천기 리포트</h2>
      </div>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 24px",lineHeight:1.7}}>
        결제한 콘텐츠를 기반으로 자동 생성돼요.<br/>더 많이 이용할수록 리포트가 풍부해집니다!
      </p>

      {/* 분석 완성도 */}
      <div style={{background:"rgba(0,0,0,0.2)",borderRadius:16,padding:"18px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:14,fontWeight:600}}>분석 완성도</span>
          <span style={{fontSize:14,fontWeight:700,color:G}}>{completedCount}/6</span>
        </div>
        <div style={{height:6,background:"rgba(255,255,255,0.1)",borderRadius:99,marginBottom:16}}>
          <div style={{
            height:"100%",
            width:`${(completedCount/6)*100}%`,
            background:`linear-gradient(90deg,${G},#C4922A)`,
            borderRadius:99, transition:"width 0.8s ease",
            boxShadow:`0 0 8px rgba(232,200,122,0.4)`
          }}/>
        </div>

        {/* 콘텐츠 목록 */}
        {Object.entries(CONTENT_TYPES).map(([key, info]) => {
          const used = usedTypes.includes(key);
          const content = contents.find(c => c.content_type === key);
          return (
            <div key={key} style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"12px 0",
              borderBottom:"1px solid rgba(255,255,255,0.05)"
            }}>
              <span style={{fontSize:20,flexShrink:0,opacity:used?1:0.4}}>{info.emoji}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:used?600:400,color:used?"#F0EAD6":"#5a7a6a",margin:"0 0 2px"}}>{info.label}</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>{info.desc}</p>
              </div>
              {used ? (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {content?.ohang_result && (
                    <span style={{fontSize:10,color:G,background:"rgba(232,200,122,0.1)",padding:"2px 8px",borderRadius:10}}>{content.ohang_result}</span>
                  )}
                  <span style={{fontSize:11,color:"#5FC49E",fontWeight:600}}>완료</span>
                </div>
              ) : (
                <span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>미이용</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 수호신 섹션 */}
      <div style={{
        background: completedCount >= UNLOCK_COUNT
          ? `rgba(${guardianData ? hexToRgb(guardianData.color) : "232,200,122"},0.08)`
          : "rgba(0,0,0,0.2)",
        border: `1px solid ${completedCount >= UNLOCK_COUNT
          ? `rgba(${guardianData ? hexToRgb(guardianData.color) : "232,200,122"},0.3)`
          : "rgba(255,255,255,0.08)"}`,
        borderRadius:16, padding:"20px", marginBottom:16, textAlign:"center",
        transition:"all 0.5s"
      }}>
        {completedCount < UNLOCK_COUNT ? (
          <>
            <span style={{fontSize:28,display:"block",marginBottom:8,opacity:0.4}}>🔒</span>
            <p style={{fontSize:13,fontWeight:600,color:G,margin:"0 0 4px"}}>🐉 내 12수호신</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>
              {UNLOCK_COUNT - completedCount}개 더 이용하면 수호신이 나타납니다
            </p>
            {/* 진행 점 */}
            <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12}}>
              {Array(UNLOCK_COUNT).fill(0).map((_,i) => (
                <div key={i} style={{
                  width:8,height:8,borderRadius:"50%",
                  background:i<completedCount?G:"rgba(255,255,255,0.15)",
                  transition:"background 0.3s"
                }}/>
              ))}
            </div>
          </>
        ) : guardian && guardianData ? (
          <>
            <div style={{
              fontSize:56, marginBottom:8,
              filter:`drop-shadow(0 0 24px rgba(${hexToRgb(guardianData.color)},0.7))`,
              transform:revealed?"scale(1)":"scale(0.3)",
              opacity:revealed?1:0,
              transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)"
            }}>{guardianData.emoji}</div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:3,margin:"0 0 4px"}}>나의 수호신</p>
            <p style={{fontSize:22,fontWeight:700,color:"#F0EAD6",margin:"0 0 4px",
              transform:revealed?"translateY(0)":"translateY(10px)",
              opacity:revealed?1:0, transition:"all 0.5s ease 0.3s"
            }}>{guardian.guardian}</p>
            <p style={{fontSize:12,color:`rgba(${hexToRgb(guardianData.color)},0.9)`,margin:"0 0 12px",
              transform:revealed?"translateY(0)":"translateY(6px)",
              opacity:revealed?1:0, transition:"all 0.5s ease 0.4s"
            }}>{guardianData.subtitle}</p>

            {/* TOP3 */}
            {guardian.top3 && (
              <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",
                transform:revealed?"translateY(0)":"translateY(6px)",
                opacity:revealed?1:0, transition:"all 0.5s ease 0.5s"
              }}>
                {guardian.top3.map((g,i) => {
                  const gd = GUARDIAN_DATA[g.name];
                  return (
                    <span key={g.name} style={{
                      fontSize:11,
                      color:i===0?G:"#5a7a6a",
                      background:i===0?"rgba(232,200,122,0.1)":"rgba(255,255,255,0.05)",
                      padding:"3px 10px", borderRadius:10
                    }}>{i===0?"👑":i===1?"🥈":"🥉"} {g.name}</span>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",margin:0}}>분석 중...</p>
        )}
      </div>

      {/* 오행 분포 (이용한 콘텐츠 있을 때) */}
      {completedCount > 0 && (() => {
        const ohangTotals = { 목:0, 화:0, 토:0, 금:0, 수:0 };
        contents.forEach(c => {
          if(c.ohang_result) {
            const w = CONTENT_TYPES[c.content_type]?.weight || 1;
            ohangTotals[c.ohang_result] += w;
          }
        });
        const total = Object.values(ohangTotals).reduce((a,b)=>a+b,0);
        const ohColors = {목:"#81C784",화:"#FF7043",토:"#FFB74D",금:"#B0BEC5",수:"#4FC3F7"};
        return (
          <div style={{background:"rgba(0,0,0,0.2)",borderRadius:16,padding:"16px",marginBottom:16}}>
            <p style={{fontSize:11,color:G,letterSpacing:3,marginBottom:12}}>🌿 나의 오행 분포</p>
            {Object.entries(ohangTotals).map(([oh,score]) => {
              const pct = total > 0 ? Math.round((score/total)*100) : 0;
              return(
                <div key={oh} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:11,color:ohColors[oh],width:14,fontWeight:600}}>{oh}</span>
                  <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:99}}>
                    <div style={{height:"100%",width:`${pct}%`,background:ohColors[oh],borderRadius:99,boxShadow:`0 0 6px ${ohColors[oh]}50`}}/>
                  </div>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",width:26,textAlign:"right"}}>{pct}%</span>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* CTA */}
      <button
        onClick={completedCount < UNLOCK_COUNT ? onClose : undefined}
        style={{
          width:"100%", padding:"17px",
          background:completedCount >= UNLOCK_COUNT
            ? `linear-gradient(135deg,${G},#C4922A)`
            : "rgba(232,200,122,0.15)",
          border: completedCount >= UNLOCK_COUNT ? "none" : `1px solid rgba(232,200,122,0.3)`,
          borderRadius:14, fontSize:15, fontWeight:700,
          color: completedCount >= UNLOCK_COUNT ? "#0D0D14" : G,
          cursor:"pointer", letterSpacing:1, marginBottom:10
        }}>
        {completedCount >= UNLOCK_COUNT ? "수호신 상세 보기 →" : `먼저 콘텐츠를 이용해보세요`}
      </button>
      {completedCount < UNLOCK_COUNT && (
        <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",textAlign:"center",margin:"0 0 12px"}}>
          {6-completedCount}개 더 이용하면 완성 리포트가 돼요!
        </p>
      )}
      <button onClick={onClose} style={{width:"100%",padding:"15px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,fontSize:14,color:"rgba(255,255,255,0.4)",cursor:"pointer"}}>
        닫기
      </button>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 각 콘텐츠에서 호출하는 결과 저장 예시
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/*
사주 풀이 완료 후:
await saveContentResult({
  userId: user.id,
  contentType: "saju",
  ohang: "화",          // 일간 오행
  detailJson: {
    ilgan: "병",
    ilganOhang: "화",
    ohangScore: { 목:8, 화:12, 토:6, 금:4, 수:10 },
    type: "양천리강",
  }
});

기질도 완료 후:
await saveContentResult({
  userId: user.id,
  contentType: "gijildo",
  ohang: gijildoToOhang("양천리강"),  // → "화"
  detailJson: {
    code: "양천리강",
    name: "청룡형",
    hanja: "陽天理剛",
  }
});
*/
