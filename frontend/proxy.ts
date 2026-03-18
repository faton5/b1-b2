import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

<<<<<<< HEAD:frontend/proxy.ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("session_token")?.value

  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

=======
export function middleware(_: NextRequest) {
>>>>>>> cc6be1454d84cdf06275bf323b202f622c4bb7fe:frontend/middleware.ts
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|apple-icon|.*\\.png$|.*\\.svg$).*)"],
}