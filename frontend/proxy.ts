import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import sql from "@/lib/db"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("session_token")?.value

  if (token && (pathname === "/login" || pathname === "/signup")) {
    const rows = await sql`
      SELECT id
      FROM sessions
      WHERE token = ${token} AND expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `

    if (rows.length > 0) {
      return NextResponse.redirect(new URL("/modules", request.url))
    }

    const response = NextResponse.next()
    response.cookies.delete("session_token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|apple-icon|.*\\.png$|.*\\.svg$).*)"],
}
