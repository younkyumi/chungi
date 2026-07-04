import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CHUNGI-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST: create gift code (admin only — 캐시 차감 로직 추후 추가)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sender_id, amount } = await request.json();
  const code = generateCode();
  const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const { data, error } = await supabase.from("gift_codes").insert({
    code, amount, sender_id, status: "active", expires_at
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ code: data.code, amount, expires_at });
}

// PATCH: redeem gift code
export async function PATCH(request: NextRequest) {
  const { code, receiver_id } = await request.json();

  const { data: gift } = await supabase.from("gift_codes")
    .select("*").eq("code", code).eq("status", "active").single();

  if (!gift) return NextResponse.json({ error: "유효하지 않은 코드입니다" }, { status: 400 });
  if (new Date(gift.expires_at) < new Date()) return NextResponse.json({ error: "만료된 코드입니다" }, { status: 400 });

  // Mark as used
  await supabase.from("gift_codes").update({ receiver_id, status: "used" }).eq("id", gift.id);

  // Add cash to receiver
  let { data: cash } = await supabase.from("user_cash").select("*").eq("user_id", receiver_id).single();
  if (!cash) {
    await supabase.from("user_cash").insert({ user_id: receiver_id, balance: gift.amount, total_charged: gift.amount });
  } else {
    await supabase.from("user_cash").update({ balance: cash.balance + gift.amount, total_charged: cash.total_charged + gift.amount }).eq("user_id", receiver_id);
  }

  // Record transaction
  await supabase.from("cash_transactions").insert({
    user_id: receiver_id, type: "gift_receive", amount: gift.amount, balance_after: (cash?.balance || 0) + gift.amount, description: `선물 코드 ${code} 사용`, gift_code: code
  });

  return NextResponse.json({ success: true, amount: gift.amount });
}

// GET: list gift codes (admin only)
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase.from("gift_codes").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ codes: data || [] });
}
