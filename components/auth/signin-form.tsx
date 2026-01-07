'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/auth-context'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()
  const { signIn, user, loading: authLoading } = useAuth()
  const hasRedirected = useRef(false)

  // Handle redirection when user is authenticated
  useEffect(() => {
    console.log('useEffect triggered:', { user, authLoading, hasRedirected: hasRedirected.current })
    
    if (user && !authLoading && !hasRedirected.current) {
      console.log('User is authenticated, determining redirect path')
      hasRedirected.current = true
      setRedirecting(true)
      
      // Determine redirect path based on user role
      const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard'
      console.log('Redirecting to:', redirectPath)
      
      // Use setTimeout to ensure the redirect happens after the current render cycle
      setTimeout(() => {
        router.push(redirectPath)
      }, 100)
    }
  }, [user, authLoading, router])

  // Show loading screen during redirect
  if (redirecting) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span>Redirecting...</span>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || authLoading || hasRedirected.current) return

    setLoading(true)
    setError('')

    try {
      console.log('Attempting sign in with:', email)
      const result = await signIn(email, password)
      console.log('Sign in result:', result)

      if (!result.success) {
        setError(result.error || 'Sign in failed')
        setLoading(false)
        return
      }
      
      // Success - set loading to false so the button updates
      setLoading(false)
      console.log('Sign in successful, waiting for user state update')
      
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={loading || authLoading}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading || authLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          disabled={loading || authLoading}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || authLoading}
        loading={loading || authLoading}
      >
        {loading || authLoading ? (
          <span>Signing in...</span>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            <span>Sign In</span>
          </>
        )}
      </Button>

      {error && (
        <div className="text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </form>
  )
}