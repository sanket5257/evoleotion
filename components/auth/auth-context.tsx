'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

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
      
      console.log('Checking session with API')

      // Get user profile from our API (which now uses JWT tokens)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch('/api/auth/session', {
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'include' // Important: include cookies
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Session expired or invalid')
          setUser(null)
          return
        }
        throw new Error(`Session check failed: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Session API response:', data)
      
      if (data?.user) {
        setUser(data.user)
      } else {
        console.log('No user data in session response')
        setUser(null)
      }
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
  }, [mounted]) // Remove checkSession from dependencies to prevent infinite loop

  // Remove the duplicate auth state listener useEffect since we're using JWT-based auth

  const signIn = useCallback(async (email: string, password: string) => {
    if (!mounted) {
      return { success: false, error: 'Component not ready' }
    }

    try {
      setError(null)
      setLoading(true)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout
      
      console.log('Sending sign in request for:', email)
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'include' // Ensure cookies are sent with the request
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Sign in failed' }))
        const errorMessage = errorData.error || 'Sign in failed'
        console.error('Sign in failed:', errorMessage)
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      const data = await response.json()
      console.log('Sign in response:', data)
      
      if (data?.user) {
        // Update user state immediately with the response data
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || email.split('@')[0],
          role: data.user.role || 'USER'
        }
        
        console.log('Setting user state:', userData)
        setUser(userData)
        
        return { success: true }
      } else {
        const errorMessage = 'Invalid response format: missing user data'
        console.error(errorMessage)
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      let errorMessage = 'Network error'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Sign in timed out. Please try again.'
        } else {
          errorMessage = error.message || 'An unexpected error occurred'
        }
        console.error('Sign in error:', error)
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      if (mounted) {
        setLoading(false)
      }
    }
  }, [mounted])

  const signOut = useCallback(async () => {
    if (!mounted) return
    
    try {
      setError(null)
      
      // Call our API to clear server-side session
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      await fetch('/api/auth/signout', { 
        method: 'POST',
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'include'
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