import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Debug logging for Vercel
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware Debug:', {
        pathname: req.nextUrl.pathname,
        hasToken: !!token,
        userRole: token?.role,
        isAdmin,
        isAdminRoute
      })
    }

    // Allow access to admin routes only for admin users
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        
        // For admin routes, require admin role
        if (isAdminRoute) {
          return token?.role === 'ADMIN'
        }
        
        // For all other routes, allow access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
}