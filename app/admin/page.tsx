import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { RevenueChart } from '@/components/admin/revenue-chart'

async function getDashboardData() {
  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    activeOffers,
    recentOrders
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { finalPrice: true },
      where: { paymentStatus: 'PAID' }
    }),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    })
  ])

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.finalPrice || 0,
    activeOffers,
    recentOrders
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your portrait studio performance
        </p>
      </div>

      <DashboardStats
        totalOrders={data.totalOrders}
        pendingOrders={data.pendingOrders}
        totalRevenue={data.totalRevenue}
        activeOffers={data.activeOffers}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  )
}