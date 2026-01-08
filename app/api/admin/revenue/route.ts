import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    // Get the last 12 months of revenue data
    const { data: orders, error } = await supabaseServer
      .from('orders')
      .select('finalPrice, createdAt')
      .eq('paymentStatus', 'PAID')
      .gte('createdAt', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .order('createdAt', { ascending: true })

    if (error) {
      console.error('Error fetching revenue data:', error)
      return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
    }

    // Group orders by month and calculate revenue
    const monthlyRevenue = new Map<string, number>()
    
    // Initialize last 6 months with zero revenue
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      months.push({ key: monthKey, name: monthName })
      monthlyRevenue.set(monthKey, 0)
    }

    // Aggregate actual revenue data
    orders?.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const monthKey = orderDate.toISOString().slice(0, 7)
      const currentRevenue = monthlyRevenue.get(monthKey) || 0
      monthlyRevenue.set(monthKey, currentRevenue + (order.finalPrice || 0))
    })

    // Format data for the chart
    const revenueData = months.map(month => ({
      month: month.name,
      revenue: monthlyRevenue.get(month.key) || 0
    }))

    return NextResponse.json(revenueData)
  } catch (error) {
    console.error('Error in revenue API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}