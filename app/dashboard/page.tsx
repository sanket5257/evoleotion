import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageTransition } from '@/components/animations/page-transition'
import { UserOrders } from '@/components/dashboard/user-orders'

async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      frame: {
        select: { name: true }
      },
      offer: {
        select: { title: true }
      },
      images: {
        select: { id: true, imageUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect admin users to admin dashboard
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <PageTransition>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-width section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {session.user.name}!
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