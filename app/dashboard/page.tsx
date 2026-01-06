import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { supabaseServer } from '@/lib/supabase-server'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUserOrders(userId: string) {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      console.error('Database connection not available')
      return []
    }

    const { data: orders, error } = await supabaseServer
      .from('orders')
      .select(`
        *,
        offer:offers(title),
        images:order_images(id, imageUrl)
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      return []
    }

    return orders || []
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

  return <DashboardClient orders={orders} />
}