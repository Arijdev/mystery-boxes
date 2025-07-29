// // /middleware.ts

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // Define routes that require auth
// const protectedRoutes = ['/', '/profile', '/settings']

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get('token')?.value

//   const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

//   // If user tries to access protected route without token
//   if (isProtected && !token) {
//     return NextResponse.redirect(new URL('/auth/signin', request.url))
//   }
//     // If user tries to access auth routes while logged in
//   if ((pathname === '/auth/signin' || pathname === '/auth/signup') && token) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   return NextResponse.next()

// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/profile', '/settings','/cart/:path*', '/checkout/:path*', 'myaccount/orders/:path*', '/auth/:path*'],
// }
