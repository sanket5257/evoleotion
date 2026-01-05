'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before making requests
  useEffect(() => {
    setMounted(true)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const checkSession = useCallback(async () => {
    if (!mounted) return
    
    try {
      setError(null)
      
      // First check Supabase session
      if (!supabase) {
        console.error('Supabase client not configured')
        setUser(null)
        return
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Supabase session error:', sessionError)
        setUser(null)
        return
      }

      if (!session) {
        setUser(null)
        return
      }

      // Get user profile from our API
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch('/api/auth/session', {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, sign out
          if (supabase) {
            await supabase.auth.signOut()
          }
          setUser(null)
          return
        }
        throw new Error(`Session check failed: ${response.status}`)
      }
      
      const data = await response.json()
      setUser(data?.user || null)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Session check timed out')
        } else {
          setError('Failed to check session')
        }
        console.error('Session check error:', error.message)
      } else {
        setError('Unknown session error')
        console.error('Session check error:', error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [mounted])

  const refreshSession = useCallback(async () => {
    await checkSession()
  }, [checkSession])

  useEffect(() => {
    if (mounted) {
      checkSession()
    }
  }, [mounted, checkSession])

  // Listen for auth state changes
  useEffect(() => {
    if (!mounted || !supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session) {
          // User signed in, refresh session
          await checkSession()
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          setUser(null)
          setError(null)
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Token refreshed, update session
          await checkSession()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [mounted, checkSession])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!mounted) {
      return { success: false, error: 'Component not ready' }
    }

    try {
      setError(null)
      setLoading(true)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
        cache: 'no-store'
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Sign in failed' }))
        return { success: false, error: errorData.error || 'Sign in failed' }
      }

      const data = await response.json()
      
      if (data?.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: 'Invalid response format' }
      }
    } catch (error) {
      let errorMessage = 'Network error'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Sign in timed out'
        } else {
          errorMessage = error.message || 'Sign in failed'
        }
      }
      
      setError(errorMessage)
      console.error('Sign in error:', error)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [mounted])

  const signOut = useCallback(async () => {
    if (!mounted) return
    
    try {
      setError(null)
      
      // Sign out from Supabase
      if (supabase) {
        await supabase.auth.signOut()
      }
      
      // Also call our API to clear server-side session
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      await fetch('/api/auth/signout', { 
        method: 'POST',
        signal: controller.signal,
        cache: 'no-store'
      })
      
      clearTimeout(timeoutId)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      // Still clear user on sign out error to prevent stuck state
      setUser(null)
    }
  }, [mounted])

  // Always provide the context, even if not mounted
  const contextValue = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
    refreshSession
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}