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

    const result = await signIn(email, password)

    if (result.success) {
      // Redirect to admin panel
      window.location.href = '/admin'
    } else {
      setError(result.error || 'Sign in failed')
    }

    setLoading(false)
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
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? 'Signing in...' : 'Sign In'}</span>
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

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
          <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Test Admin Credentials:
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            Email: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">admin@test.com</code>
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            Password: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">admin123</code>
          </p>
        </div>
      </div>
    </form>
  )
}