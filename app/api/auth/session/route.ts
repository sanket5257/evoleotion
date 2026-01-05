import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  iat: number
  exp: number
}

export async function GET(request: NextRequest) {
  try {
    console.log('Session API called')
    
    // Get the session token from cookies
    const cookieStore = cookies()
    
    // Debug: List all cookies
    const allCookies = cookieStore.getAll()
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
    
    const sessionToken = cookieStore.get('session-token')?.value
    
    if (!sessionToken) {
      console.log('No session token found in cookies')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('Session token found, length:', sessionToken.length)

    // Verify the JWT token using jose
    let sessionPayload: any
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(sessionToken, secret)
      sessionPayload = payload
      console.log('JWT payload:', { 
        userId: payload.userId, 
        email: payload.email, 
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat
      })
    } catch (jwtError) {
      console.error('Invalid session token:', jwtError)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    if (!sessionPayload.email || !sessionPayload.userId) {
      console.error('Invalid session payload structure:', sessionPayload)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('Valid session found for:', sessionPayload.email)

    // Get fresh user data from database to ensure it's up to date
    const userData = await getUserByEmail(sessionPayload.email)
    
    if (!userData) {
      console.warn('User not found in database:', sessionPayload.email)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('Returning user data for:', userData.email)

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { user: null, error: 'Session check failed' }, 
      { status: 500 }
    )
  }
}