import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|beige-icon.png|images/).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET;
  const valid = secret ? await verifyToken(secret, token) : false;

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
