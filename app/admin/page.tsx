import { supabaseServer } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { RevenueChart } from '@/components/admin/revenue-chart'
import { DashboardRefresh } from '@/components/admin/dashboard-refresh'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDashboardData() {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      console.error('Database connection not available')
      return {
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        activeOffers: 0,
        totalUsers: 0,
        recentOrders: []
      }
    }

    // Get total orders count
    const { count: totalOrders } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get pending orders count
    const { count: pendingOrders } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // Get total revenue from paid orders
    const { data: revenueData } = await supabaseServer
      .from('orders')
      .select('finalPrice')
      .eq('paymentStatus', 'PAID')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.finalPrice || 0), 0) || 0

    // Get active offers count
    const { count: activeOffers } = await supabaseServer
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('isActive', true)

    // Get total users count
    const { count: totalUsers } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get recent orders
    const { data: recentOrders } = await supabaseServer
      .from('orders')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('createdAt', { ascending: false })
      .limit(5)

    return {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalRevenue,
      activeOffers: activeOffers || 0,
      totalUsers: totalUsers || 0,
      recentOrders: recentOrders || []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      activeOffers: 0,
      totalUsers: 0,
      recentOrders: []
    }
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your sketch store performance
          </p>
        </div>
        <DashboardRefresh />
      </div>

      <DashboardStats
        totalOrders={data.totalOrders}
        pendingOrders={data.pendingOrders}
        totalRevenue={data.totalRevenue}
        activeOffers={data.activeOffers}
        totalUsers={data.totalUsers}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  )
}