import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, SESSION_DURATION_MS, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const expected = process.env.SITE_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Server is missing SITE_PASSWORD / AUTH_SECRET." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const expiresAtMs = Date.now() + SESSION_DURATION_MS;
  const token = await signToken(secret, expiresAtMs);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAtMs),
  });
  return res;
}
