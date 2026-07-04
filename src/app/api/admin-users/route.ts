import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ users: [], error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ users: [], error: "Supabase config missing" });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 100 });

    if (error) {
      return NextResponse.json({ users: [], error: error.message });
    }

    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email || "",
      name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "익명",
      avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      provider: u.app_metadata?.provider || "unknown",
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at,
    }));

    return NextResponse.json({ users });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ users: [], error: msg });
  }
}
