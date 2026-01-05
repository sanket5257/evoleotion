import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email, password } = body

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password with timeout
    const isPasswordValid = await Promise.race([
      bcrypt.compare(password, user.password),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Password verification timeout')), 5000)
      )
    ]) as boolean

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Password verified for user:', user.email)

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('JWT_SECRET is configured, length:', process.env.JWT_SECRET.length)

    // Create a JWT session token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    
    const sessionToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    console.log('Created session token for user:', user.email, 'Token length:', sessionToken.length)

    // Set the session cookie
    const cookieStore = cookies()
    
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      }
      
      console.log('Setting cookie with options:', cookieOptions)
      cookieStore.set('session-token', sessionToken, cookieOptions)
      
      // Verify the cookie was set
      const setCookie = cookieStore.get('session-token')
      console.log('Cookie verification - set successfully:', !!setCookie?.value)
      
      console.log('Session cookie set for user:', user.email)
    } catch (cookieError) {
      console.error('Failed to set session cookie:', cookieError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    console.log('Sign in successful for user:', user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
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
    console.error('Sign in error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        )
      }
      if (error.message.includes('Database')) {
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}