'use client'

import { useAuth } from '@/components/auth/auth-context'
import { AuthGuard } from '@/components/auth/auth-guard'
import { PageTransition } from '@/components/animations/page-transition'
import { UserOrders } from '@/components/dashboard/user-orders'
import { Navbar } from '@/components/layout/navbar'

interface DashboardClientProps {
  orders: any[]
}

export function DashboardClient({ orders }: DashboardClientProps) {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <PageTransition>
        <div className="min-h-screen bg-black text-white" data-dashboard="true">
          {/* Navigation */}
          <Navbar />

          <div className="px-8 py-16">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8 font-grotesk">
                  Dashboard
                </h1>
                <div className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Welcome back, <span className="text-white font-medium">{user?.name}</span>. 
                  Track your sketch orders and manage your commissions.
                </div>
              </div>

              <UserOrders orders={orders} />
            </div>
          </div>
        </div>
      </PageTransition>
    </AuthGuard>
  )
}