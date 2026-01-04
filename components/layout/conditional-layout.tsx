'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current path is admin or auth related
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAuthRoute = pathname?.startsWith('/auth')
  
  // For admin routes, render children without header/footer
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  // For auth routes, render with minimal layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    )
  }
  
  // For regular routes, render with global footer
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
      <Footer />
    </div>
  )
}