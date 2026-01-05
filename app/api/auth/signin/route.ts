import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '@/lib/supabase-server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

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

    // Create Supabase client for server-side operations
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.warn('Failed to set cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              console.warn('Failed to remove cookie:', error)
            }
          },
        },
      }
    )

    // Try to sign in with Supabase Auth using a consistent password approach
    // We'll use the user's email as both username and a consistent password pattern
    const authPassword = `auth_${user.id}_${user.email.split('@')[0]}`
    
    let authSuccess = false
    
    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: authPassword,
    })

    if (signInError) {
      // If sign in fails, try to create the user in Supabase Auth
      const { data: createUserData, error: createUserError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: authPassword,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role,
          user_id: user.id
        }
      })

      if (!createUserError) {
        // Now try to sign in again
        const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: authPassword,
        })
        
        if (!retrySignInError) {
          authSuccess = true
        }
      }
    } else {
      authSuccess = true
    }

    // Even if Supabase Auth fails, we can still proceed with our custom session
    // This provides a fallback mechanism during the migration
    if (!authSuccess) {
      console.warn('Supabase Auth failed for user:', user.email, 'proceeding with custom session')
    }

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