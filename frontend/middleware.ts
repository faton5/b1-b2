import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Custom logic if needed
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // If trying to access dashboard, require TEACHER
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return token?.role === "TEACHER"
        }
        return true
      }
    }
  }
)

export const config = {
  matcher: ["/dashboard/:path*"],
}
