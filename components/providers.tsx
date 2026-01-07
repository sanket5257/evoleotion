'use client'

import { AuthProvider } from '@/components/auth/auth-context'
import { LenisProvider } from '@/components/providers/lenis-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LenisProvider>
        {children}
      </LenisProvider>
    </AuthProvider>
  )
}