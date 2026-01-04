import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageTransition } from '@/components/animations/page-transition'
import { UserOrders } from '@/components/dashboard/user-orders'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUserOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        offer: {
          select: { title: true }
        },
        images: {
          select: { id: true, imageUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect admin users to admin dashboard
  if (session.role === 'ADMIN') {
    redirect('/admin')
  }

  const orders = await getUserOrders(session.userId)

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
                Dashboard
              </h1>
              <div className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Welcome back, <span className="text-white font-medium">{session.name}</span>. 
                Track your sketch orders and manage your commissions.
              </div>
            </div>

            <UserOrders orders={orders} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}