import { createClient } from "@supabase/supabase-js";
import { checkBadgeMilestone } from "@/lib/kakao-message";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user_id, service_id, badge_type } = await request.json();

    if (!user_id || !service_id) {
      return NextResponse.json(
        { error: "user_id와 service_id는 필수입니다." },
        { status: 400 }
      );
    }

    // Record the share event
    const { error: insertError } = await supabase
      .from("share_badges")
      .insert({
        user_id,
        service_id,
        badge_type: badge_type || "kakao",
        shared_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("[Share API] Insert error:", insertError);
      return NextResponse.json(
        { error: "공유 기록 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    // Get the current total share count for this user
    const { count, error: countError } = await supabase
      .from("share_badges")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    if (countError) {
      console.error("[Share API] Count error:", countError);
      return NextResponse.json(
        { error: "공유 횟수 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    const shareCount = count ?? 0;

    // Check if a badge milestone was reached
    const milestone = await checkBadgeMilestone(shareCount);

    return NextResponse.json({
      success: true,
      shareCount,
      milestone: milestone
        ? {
            count: milestone.count,
            reward: milestone.reward,
            message: milestone.message,
          }
        : null,
    });
  } catch (error) {
    console.error("[Share API] Unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
