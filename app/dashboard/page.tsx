import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageTransition } from '@/components/animations/page-transition'
import { UserOrders } from '@/components/dashboard/user-orders'

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
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-width section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {session.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your orders and manage your account
              </p>
            </div>

            <UserOrders orders={orders} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}