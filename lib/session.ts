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

// Get the correct domain for cookies in production
function getCookieDomain() {
  if (process.env.NODE_ENV !== 'production') {
    return undefined // Let browser handle localhost
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return undefined // Let Vercel handle the domain
  }
  
  // For custom domains
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN
  }
  
  return undefined
}

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
    // Ensure we're in a server context
    if (typeof window !== 'undefined') {
      throw new Error('createSession should only be called on the server')
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const session = await encrypt({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: expiresAt.toISOString(),
    })

    const cookieStore = cookies()
    
    // Simplified cookie configuration that works better with Vercel
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      expires: expiresAt,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    }
    
    // Only add domain if explicitly configured
    const domain = getCookieDomain()
    if (domain) {
      (cookieOptions as any).domain = domain
    }
    
    cookieStore.set('session', session, cookieOptions)
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

    const cookieStore = cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    
    const payload = await decrypt(session)
    
    // Check if session is expired
    if (payload?.expiresAt) {
      const expiresAt = new Date(payload.expiresAt)
      const now = new Date()
      
      if (expiresAt < now) {
        // Session expired, delete it
        try {
          deleteSession()
        } catch (deleteError) {
          console.warn('Failed to delete expired session:', deleteError)
        }
        return null
      }
      
      // Refresh session if it's close to expiring (within 1 day)
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      if (expiresAt < oneDayFromNow) {
        try {
          // Refresh the session
          await createSession({
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            role: payload.role
          })
        } catch (refreshError) {
          console.warn('Failed to refresh session:', refreshError)
          // Continue with existing session
        }
      }
    }
    
    return payload
  } catch (error) {
    console.error('Session retrieval error:', error)
    // Clear invalid session
    try {
      deleteSession()
    } catch (deleteError) {
      console.warn('Failed to delete invalid session:', deleteError)
    }
    return null
  }
}

export function deleteSession() {
  try {
    // Ensure we're in a server context
    if (typeof window !== 'undefined') {
      console.warn('deleteSession should only be called on the server')
      return
    }

    const cookieStore = cookies()
    
    // Simplified deletion that works better with Vercel
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0, // Immediately expire
    }
    
    // Only add domain if explicitly configured
    const domain = getCookieDomain()
    if (domain) {
      (cookieOptions as any).domain = domain
    }
    
    cookieStore.set('session', '', cookieOptions)
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