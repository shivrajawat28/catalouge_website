import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME, getAdminCredentials } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const result = verifySessionToken(sessionCookie);

  if (!result.valid) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }

  const credentials = getAdminCredentials();

  return NextResponse.json(
    {
      authenticated: true,
      username: result.username || credentials.username,
    },
    { status: 200 }
  );
}
