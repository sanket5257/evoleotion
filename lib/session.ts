import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  expiresAt: string
}

export async function encrypt(payload: SessionPayload) {
  try {
    return await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)
  } catch (error) {
    console.error('JWT encryption error:', error)
    throw new Error('Failed to create session')
  }
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch (error) {
    // Don't log JWT verification errors in production (they're expected for expired tokens)
    if (process.env.NODE_ENV === 'development') {
      console.warn('JWT verification failed:', error)
    }
    return null
  }
}

export async function createSession(user: { id: string; email: string; name?: string; role: string }) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const session = await encrypt({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: expiresAt.toISOString(),
    })

    const cookieStore = cookies()
    cookieStore.set('session', session, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  } catch (error) {
    console.error('Session creation error:', error)
    throw new Error('Failed to create session')
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    
    const payload = await decrypt(session)
    
    // Check if session is expired
    if (payload?.expiresAt) {
      const expiresAt = new Date(payload.expiresAt)
      if (expiresAt < new Date()) {
        // Session expired, delete it
        deleteSession()
        return null
      }
    }
    
    return payload
  } catch (error) {
    console.error('Session retrieval error:', error)
    return null
  }
}

export function deleteSession() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('session')
  } catch (error) {
    console.error('Session deletion error:', error)
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  try {
    const session = request.cookies.get('session')?.value
    if (!session) return null
    
    const payload = await decrypt(session)
    
    // Check if session is expired
    if (payload?.expiresAt) {
      const expiresAt = new Date(payload.expiresAt)
      if (expiresAt < new Date()) {
        return null
      }
    }
    
    return payload
  } catch (error) {
    console.error('Session request error:', error)
    return null
  }
}