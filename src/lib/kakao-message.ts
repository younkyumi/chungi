/**
 * Kakao Biz Message utility for share badge milestones
 * Channel ID: chungi
 */

export interface BadgeMilestone {
  count: number;
  reward: "coupon" | "digital_bujeok" | "address_request";
  message: string;
}

const BADGE_MILESTONES: BadgeMilestone[] = [
  {
    count: 1,
    reward: "coupon",
    message: "🎉 첫 공유 달성! 500원 할인 쿠폰이 도착했어요.",
  },
  {
    count: 5,
    reward: "digital_bujeok",
    message: "🧿 5회 공유 달성! 디지털 부적을 선물로 드려요.",
  },
  {
    count: 10,
    reward: "address_request",
    message:
      "🎁 10회 공유 달성! 특별 선물을 보내드릴게요. 배송지를 입력해주세요.",
  },
  {
    count: 20,
    reward: "address_request",
    message:
      "✨ 20회 공유 달성! 프리미엄 선물을 보내드릴게요. 배송지를 입력해주세요.",
  },
];

const KAKAO_CHANNEL_ID = "chungi";

/**
 * Check if the given share count matches a badge milestone.
 * Returns the milestone definition if matched, or null otherwise.
 */
export async function checkBadgeMilestone(
  shareCount: number
): Promise<BadgeMilestone | null> {
  const milestone = BADGE_MILESTONES.find((m) => m.count === shareCount);
  return milestone ?? null;
}

/**
 * Send a Kakao biz message to a user.
 *
 * TODO: Integrate with actual Kakao Biz Message API.
 * - Obtain biz channel token from Kakao Developers console.
 * - Replace the placeholder fetch call with the real API endpoint.
 * - Handle token refresh and error retry logic.
 */
export async function sendKakaoMessage(
  userId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Replace with actual Kakao Biz Message API call
    // The real implementation will use:
    //   POST https://kapi.kakao.com/v1/api/talk/friends/message/default/send
    //   Authorization: Bearer {BIZ_CHANNEL_TOKEN}
    //   Content-Type: application/x-www-form-urlencoded
    //
    // const KAKAO_BIZ_TOKEN = process.env.KAKAO_BIZ_TOKEN;
    //
    // const response = await fetch(
    //   "https://kapi.kakao.com/v1/api/talk/friends/message/default/send",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${KAKAO_BIZ_TOKEN}`,
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       receiver_uuids: JSON.stringify([userId]),
    //       template_object: JSON.stringify({
    //         object_type: "text",
    //         text: message,
    //         link: { web_url: "https://chungi.kr", mobile_web_url: "https://chungi.kr" },
    //         button_title: "자세히 보기",
    //       }),
    //     }),
    //   }
    // );

    console.log(
      `[Kakao Biz] Channel: ${KAKAO_CHANNEL_ID} | To: ${userId} | Message: ${message}`
    );

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[Kakao Biz] Failed to send message: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Check milestone and send the corresponding Kakao biz message if applicable.
 * Returns the milestone that was triggered, or null if no milestone was reached.
 */
export async function handleShareMilestone(
  userId: string,
  shareCount: number
): Promise<BadgeMilestone | null> {
  const milestone = await checkBadgeMilestone(shareCount);

  if (milestone) {
    await sendKakaoMessage(userId, milestone.message);
  }

  return milestone;
}
