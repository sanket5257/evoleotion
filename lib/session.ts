import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getUserByEmail } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role: string
  expiresAt: string
}

export async function createSession(user: { id: string; email: string; name?: string; role: string }) {
  try {
    // For now, we'll use a simplified approach
    // The actual Supabase Auth integration will be handled in the signin route
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

    // Get the current session from Supabase Auth
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    // Get user data from our users table using the existing utility
    const userData = await getUserByEmail(session.user.email!)
    
    if (!userData) {
      console.warn('User not found in users table:', session.user.email)
      return null
    }

    return {
      userId: userData.id,
      email: userData.email,
      name: userData.name || undefined,
      role: userData.role,
      expiresAt: new Date(session.expires_at! * 1000).toISOString(),
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

    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Failed to sign out:', error)
    }
  } catch (error) {
    console.error('Session deletion error:', error)
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  try {
    // For middleware, we'll use a simplified approach
    // This is a temporary implementation during the migration
    
    // Get the current session from Supabase Auth
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    // Get user data from our users table using the existing utility
    const userData = await getUserByEmail(session.user.email!)
    
    if (!userData) {
      console.warn('User not found in users table:', session.user.email)
      return null
    }

    return {
      userId: userData.id,
      email: userData.email,
      name: userData.name || undefined,
      role: userData.role,
      expiresAt: new Date(session.expires_at! * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Session request error:', error)
    return null
  }
}

// Helper function to update middleware response with Supabase cookies
export async function updateSupabaseResponse(request: NextRequest, response: NextResponse) {
  // For now, just return the response as-is
  // This will be enhanced in future iterations
  return response
}