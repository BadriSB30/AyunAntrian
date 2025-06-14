import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // ✅ Hanya lanjut jika token (session) ada
        return !!token
      },
    },
  }
)

// 🔐 Middleware hanya aktif di route yang perlu login
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/antrian/:path*",
    "/laporan/:path*",
    // 🛑 Tidak termasuk "/", "/login", "/register"
  ],
}
