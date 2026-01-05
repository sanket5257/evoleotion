import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest, updateSupabaseResponse } from '@/lib/session'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await getSessionFromRequest(request)
    
    // If no session or not admin, redirect to signin
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Update response with Supabase cookies
  response = await updateSupabaseResponse(request, response)
  
  return response
}

export const config = {
  matcher: ['/admin/:path*']
}