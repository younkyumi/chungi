import { NextResponse } from "next/server";

// Gemini API 진단 — 환경변수 + 모델 호출 + 응답 상세
// /api/gemini-test 접속하면 Gemini API 상태 한눈에 확인

export const maxDuration = 30;

export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  const env = {
    GEMINI_API_KEY: key ? `set (len=${key.length}, prefix=${key.substring(0,8)}...)` : "❌ NOT SET",
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "set" : "❌ NOT SET",
  };

  if (!key) {
    return NextResponse.json({ env, error: "GEMINI_API_KEY 미설정" });
  }

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];
  const results: any = {};

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say 'OK' in one word." }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 10 },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(no text)";
        results[model] = { ok: true, status: res.status, text: text.substring(0, 50) };
      } else {
        const errBody = await res.text();
        results[model] = {
          ok: false,
          status: res.status,
          error: errBody.substring(0, 400),
        };
      }
    } catch (e: unknown) {
      results[model] = { ok: false, error: e instanceof Error ? e.message : "network" };
    }
  }

  return NextResponse.json({ env, models: results, timestamp: new Date().toISOString() });
}
