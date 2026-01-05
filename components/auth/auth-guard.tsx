'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/signin' 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
        return
      }
      setIsChecking(false)
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading while checking auth
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}