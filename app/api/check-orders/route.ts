import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Count orders
    const { count, error } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get recent orders
    const { data: recentOrders, error: ordersError } = await supabaseServer
      .from('orders')
      .select('id, orderNumber, customerName, createdAt')
      .order('createdAt', { ascending: false })
      .limit(5)
    
    return NextResponse.json({
      totalOrders: count || 0,
      recentOrders: recentOrders || [],
      message: count === 0 ? 'No orders found' : `Found ${count} orders`
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}