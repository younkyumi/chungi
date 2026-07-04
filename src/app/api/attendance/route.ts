// Run in Supabase SQL Editor:
// CREATE TABLE IF NOT EXISTS attendance (
//   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   checked_date DATE NOT NULL,
//   points_earned INT DEFAULT 10,
//   consecutive_days INT DEFAULT 1,
//   created_at TIMESTAMPTZ DEFAULT now(),
//   UNIQUE(user_id, checked_date)
// );

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const POINTS_PER_DAY = 10;
const STREAK_REWARD_DAYS = 30;

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id는 필수입니다." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if already checked in today
    const { data: existing, error: checkError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user_id)
      .eq("checked_date", today)
      .maybeSingle();

    if (checkError) {
      console.error("[Attendance] Check error:", checkError);
      return NextResponse.json(
        { error: "출석 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "이미 오늘 출석체크를 완료했습니다.", alreadyChecked: true },
        { status: 409 }
      );
    }

    // Get yesterday's record to calculate consecutive days
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: yesterdayRecord } = await supabase
      .from("attendance")
      .select("consecutive_days")
      .eq("user_id", user_id)
      .eq("checked_date", yesterdayStr)
      .maybeSingle();

    const consecutiveDays = yesterdayRecord
      ? yesterdayRecord.consecutive_days + 1
      : 1;

    // Insert today's attendance
    const { data: inserted, error: insertError } = await supabase
      .from("attendance")
      .insert({
        user_id,
        checked_date: today,
        points_earned: POINTS_PER_DAY,
        consecutive_days: consecutiveDays,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Attendance] Insert error:", insertError);
      return NextResponse.json(
        { error: "출석체크 기록 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // Check if user hit the 30-day streak reward
    const streakReward = consecutiveDays >= STREAK_REWARD_DAYS;

    // Calculate total points
    const { data: pointsData } = await supabase
      .from("attendance")
      .select("points_earned")
      .eq("user_id", user_id);

    const totalPoints =
      pointsData?.reduce((sum, r) => sum + (r.points_earned || 0), 0) ?? 0;

    return NextResponse.json({
      success: true,
      checkedDate: today,
      pointsEarned: POINTS_PER_DAY,
      consecutiveDays,
      totalPoints,
      streakReward,
      streakRewardMessage: streakReward
        ? "🎊 30일 연속 출석 달성! 부적 3종 세트를 선물로 드려요!"
        : null,
    });
  } catch (error) {
    console.error("[Attendance] Unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id는 필수입니다." },
        { status: 400 }
      );
    }

    // Default to current month
    const now = new Date();
    const targetYear = year ? parseInt(year) : now.getFullYear();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;

    const startDate = `${targetYear}-${String(targetMonth).padStart(2, "0")}-01`;
    const endDate =
      targetMonth === 12
        ? `${targetYear + 1}-01-01`
        : `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-01`;

    // Fetch attendance records for the month
    const { data: records, error: recordsError } = await supabase
      .from("attendance")
      .select("checked_date, points_earned, consecutive_days")
      .eq("user_id", user_id)
      .gte("checked_date", startDate)
      .lt("checked_date", endDate)
      .order("checked_date", { ascending: true });

    if (recordsError) {
      console.error("[Attendance] Fetch error:", recordsError);
      return NextResponse.json(
        { error: "출석 기록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // Get total points
    const { data: pointsData } = await supabase
      .from("attendance")
      .select("points_earned")
      .eq("user_id", user_id);

    const totalPoints =
      pointsData?.reduce((sum, r) => sum + (r.points_earned || 0), 0) ?? 0;

    // Get current consecutive days (from the latest record)
    const { data: latestRecord } = await supabase
      .from("attendance")
      .select("consecutive_days, checked_date")
      .eq("user_id", user_id)
      .order("checked_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentStreak = latestRecord?.consecutive_days ?? 0;

    return NextResponse.json({
      year: targetYear,
      month: targetMonth,
      records: records ?? [],
      totalPoints,
      currentStreak,
    });
  } catch (error) {
    console.error("[Attendance] Unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
