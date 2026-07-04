import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: get user's cash balance
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data } = await supabase.from("user_cash").select("*").eq("user_id", userId).single();

  // Get transactions
  const { data: transactions } = await supabase.from("cash_transactions")
    .select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);

  return NextResponse.json({ cash: data || { balance: 0, total_charged: 0 }, transactions: transactions || [] });
}

// POST: charge cash or use cash
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, type, amount, description, service_id, gift_code } = body;

  // Get or create user cash record
  let { data: cash } = await supabase.from("user_cash").select("*").eq("user_id", user_id).single();

  if (!cash) {
    const { data: newCash } = await supabase.from("user_cash").insert({ user_id, balance: 0, total_charged: 0 }).select().single();
    cash = newCash;
  }

  let newBalance = cash.balance;

  if (type === "charge") {
    newBalance += amount;
    await supabase.from("user_cash").update({ balance: newBalance, total_charged: cash.total_charged + amount, updated_at: new Date().toISOString() }).eq("user_id", user_id);
  } else if (type === "use") {
    if (cash.balance < amount) return NextResponse.json({ error: "잔액이 부족합니다" }, { status: 400 });
    newBalance -= amount;
    await supabase.from("user_cash").update({ balance: newBalance, updated_at: new Date().toISOString() }).eq("user_id", user_id);
  } else if (type === "gift_receive") {
    newBalance += amount;
    await supabase.from("user_cash").update({ balance: newBalance, total_charged: cash.total_charged + amount, updated_at: new Date().toISOString() }).eq("user_id", user_id);
  }

  // Record transaction
  await supabase.from("cash_transactions").insert({
    user_id, type, amount, balance_after: newBalance, description, service_id, gift_code
  });

  return NextResponse.json({ balance: newBalance });
}
