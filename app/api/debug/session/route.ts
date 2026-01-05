import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Only allow in development or with special debug header
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment) {
      return NextResponse.json({ error: 'Debug endpoint not available in production' }, { status: 403 })
    }

    const session = await getSession()
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    const debugInfo = {
      hasSession: !!session,
      sessionData: session ? {
        userId: session.userId,
        email: session.email,
        role: session.role,
        expiresAt: session.expiresAt,
        isExpired: session.expiresAt ? new Date(session.expiresAt) < new Date() : false
      } : null,
      hasCookie: !!sessionCookie,
      cookieValue: sessionCookie ? sessionCookie.value.substring(0, 20) + '...' : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET?.length || 0,
        vercelUrl: process.env.VERCEL_URL || 'not set'
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Session debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}