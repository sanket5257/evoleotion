import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  expiresAt: string // Changed from Date to string for JWT compatibility
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload as any) // Cast to any to satisfy JWT library
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload // Safe cast through unknown
  } catch (error) {
    return null
  }
}

export async function createSession(user: { id: string; email: string; name?: string; role: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: expiresAt.toISOString(), // Convert Date to string
  })

  cookies().set('session', session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = cookies().get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export function deleteSession() {
  cookies().delete('session')
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const session = request.cookies.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}