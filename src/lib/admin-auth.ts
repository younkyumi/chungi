import { NextRequest } from "next/server";

export function isAdmin(request: NextRequest): boolean {
  const adminKey = request.headers.get("x-admin-key");
  const secret = process.env.ADMIN_SECRET;
  if (!adminKey || !secret) return false;
  return adminKey === secret;
}
