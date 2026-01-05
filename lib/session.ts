import { getUserByEmail } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  expiresAt: string
}

export async function createSession(user: { id: string; email: string; name?: string; role: string }) {
  try {
    // Session creation is now handled in the signin API route
    console.log('Session created for user:', user.email)
  } catch (error) {
    console.error('Session creation error:', error)
    throw new Error('Failed to create session')
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    // Ensure we're in a server context
    if (typeof window !== 'undefined') {
      throw new Error('getSession should only be called on the server')
    }

    // Get the session token from cookies
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session-token')?.value
    
    if (!sessionToken) {
      console.log('No session token found in cookies')
      return null
    }

    // Verify the JWT token
    let sessionPayload: any
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(sessionToken, secret)
      sessionPayload = payload
    } catch (jwtError) {
      console.error('Invalid session token:', jwtError)
      return null
    }

    if (!sessionPayload.email || !sessionPayload.userId) {
      console.error('Invalid session payload structure')
      return null
    }

    // Get fresh user data from database
    const userData = await getUserByEmail(sessionPayload.email)
    
    if (!userData) {
      console.warn('User not found in users table:', sessionPayload.email)
      return null
    }

    return {
      userId: userData.id,
      email: userData.email,
      name: userData.name || undefined,
      role: userData.role,
      expiresAt: new Date((sessionPayload.exp || 0) * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Session retrieval error:', error)
    return null
  }
}

export async function deleteSession() {
  try {
    // Ensure we're in a server context
    if (typeof window !== 'undefined') {
      console.warn('deleteSession should only be called on the server')
      return
    }

    // Clear the session cookie
    const cookieStore = cookies()
    cookieStore.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })
  } catch (error) {
    console.error('Session deletion error:', error)
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  try {
    // Get the session token from request cookies
    const sessionToken = request.cookies.get('session-token')?.value
    
    if (!sessionToken) {
      return null
    }

    // Verify the JWT token
    let sessionPayload: any
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(sessionToken, secret)
      sessionPayload = payload
    } catch (jwtError) {
      console.error('Invalid session token in middleware:', jwtError)
      return null
    }

    if (!sessionPayload.email || !sessionPayload.userId) {
      return null
    }

    // Get user data from database
    const userData = await getUserByEmail(sessionPayload.email)
    
    if (!userData) {
      return null
    }

    return {
      userId: userData.id,
      email: userData.email,
      name: userData.name || undefined,
      role: userData.role,
      expiresAt: new Date((sessionPayload.exp || 0) * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Session request error:', error)
    return null
  }
}

// Helper function to update middleware response with cookies
export async function updateSupabaseResponse(request: NextRequest, response: NextResponse) {
  // For JWT-based auth, we don't need to update Supabase cookies
  return response
}