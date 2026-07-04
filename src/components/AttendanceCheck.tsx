"use client";

import { useState, useEffect, useCallback } from "react";

const STREAK_GOAL = 30;

export default function AttendanceCheck({ userId }: { userId: string }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [checkedDays, setCheckedDays] = useState<Set<number>>(new Set());
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const now = new Date();
      const res = await fetch(`/api/attendance?user_id=${userId}&year=${now.getFullYear()}&month=${now.getMonth()+1}`);
      const json = await res.json();
      if (res.ok) {
        setCurrentStreak(json.currentStreak || 0);
        setTotalPoints(json.totalPoints || 0);
        const days = new Set<number>((json.records || []).map((r: any) => new Date(r.checked_date).getDate()));
        setCheckedDays(days);
      }
    } catch {} finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckIn = async () => {
    setChecking(true); setMessage("");
    try {
      const res = await fetch("/api/attendance", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({user_id:userId}) });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage(`+${json.pointsEarned}P (연속 ${json.consecutiveDays}일)`);
        await fetchData();
      } else { setMessage(json.error || "실패"); }
    } catch { setMessage("오류"); } finally { setChecking(false); }
  };

  const streakPct = Math.min((currentStreak / STREAK_GOAL) * 100, 100);

  if (loading) return <div style={{textAlign:"center",padding:"20px 0",color:"#D4AF37",fontSize:11}}>불러오는 중...</div>;

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"12px",background:"#1a1a2e",borderRadius:12,color:"#f0e6d3"}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#D4AF37"}}>출석체크</div>
          <div style={{fontSize:9,color:"#a89b8c"}}>매일 출석하고 기운 받기</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:"#16213e",borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
            <div style={{fontSize:8,color:"#a89b8c"}}>기운</div>
            <div style={{fontSize:12,fontWeight:700,color:"#D4AF37"}}>{totalPoints}기운</div>
          </div>
          <div style={{background:"#16213e",borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
            <div style={{fontSize:8,color:"#a89b8c"}}>연속</div>
            <div style={{fontSize:12,fontWeight:700,color:"#D4AF37"}}>{currentStreak}일</div>
          </div>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#a89b8c",marginBottom:2}}>
          <span>30일 개근 도전</span>
          <span>{currentStreak}/{STREAK_GOAL}</span>
        </div>
        <div style={{height:4,background:"#16213e",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${streakPct}%`,height:"100%",background:"linear-gradient(90deg,#D4AF37,#d4a853)",borderRadius:2,transition:"width .5s"}}/>
        </div>
      </div>

      {/* 30칸 그리드 (10x3) */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:3,marginBottom:8}}>
        {Array.from({length:30},(_, i)=>{
          const day = i + 1;
          const checked = checkedDays.has(day);
          const today = new Date().getDate() === day;
          return (
            <div key={day} style={{
              textAlign:"center",
              padding:"3px 0",
              borderRadius:4,
              fontSize:9,
              fontWeight:checked?700:400,
              background:checked?"rgba(212,175,55,0.15)":today?"#16213e":"transparent",
              border:today&&!checked?"1px solid rgba(212,175,55,0.4)":"1px solid transparent",
              color:checked?"#D4AF37":"#a89b8c",
            }}>
              {day}
              {checked&&<div style={{width:3,height:3,borderRadius:"50%",background:"#D4AF37",margin:"1px auto 0"}}/>}
            </div>
          );
        })}
      </div>

      {/* 출석 버튼 */}
      <button onClick={handleCheckIn} disabled={checking}
        style={{width:"100%",padding:"8px",background:checking?"#555":"linear-gradient(135deg,#D4AF37,#d4a853)",color:"#1a1a2e",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:checking?"not-allowed":"pointer"}}>
        {checking?"처리 중...":"출석체크 ✨"}
      </button>

      {message&&<div style={{textAlign:"center",fontSize:10,padding:"4px",borderRadius:6,background:"#16213e",color:message.includes("실패")||message.includes("오류")?"#e87a7a":"#D4AF37",marginTop:4}}>{message}</div>}

      <div style={{fontSize:8,color:"#a89b8c",textAlign:"center",marginTop:6}}>🎁 30일 개근 → 부적 3종 세트 실물 발송!</div>
    </div>
  );
}
