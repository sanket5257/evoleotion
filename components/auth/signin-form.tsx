'use client'

import { useState } from 'react'
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
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting sign in with:', email)
      const result = await signIn(email, password)
      console.log('Sign in result:', result)

      if (result.success) {
        console.log('Sign in successful, redirecting...')
        // Redirect to dashboard first to test
        router.push('/dashboard')
      } else {
        console.log('Sign in failed:', result.error)
        setError(result.error || 'Sign in failed')
        setLoading(false)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred')
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
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full flex items-center justify-center space-x-2"
        disabled={loading}
        loading={loading}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Sign In</span>
          </>
        )}
      </Button>

      {error && (
        <div className="text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <a
          href="/auth/signup"
          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Sign up here
        </a>
      </div>

      
    </form>
  )
}