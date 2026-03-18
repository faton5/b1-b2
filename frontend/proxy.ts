import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(_: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|apple-icon|.*\\.png$|.*\\.svg$).*)"],
}