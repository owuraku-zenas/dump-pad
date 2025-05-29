import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: Request) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const isLoggedIn = !!token
  const isAuthRoute = request.url.includes("/auth")

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Optionally, configure which routes to run middleware on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 