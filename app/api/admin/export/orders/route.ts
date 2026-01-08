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

    // Fetch all orders with user information
    const { data: orders, error } = await supabaseServer
      .from('orders')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Convert to CSV format
    const csvHeaders = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Style',
      'Size',
      'Number of Faces',
      'Base Price',
      'Discount Amount',
      'Final Price',
      'Status',
      'Payment Status',
      'Special Notes',
      'Created At',
      'Updated At'
    ]

    const csvRows = orders?.map(order => [
      order.orderNumber,
      order.customerName || order.user?.name || '',
      order.customerEmail || order.user?.email || '',
      order.customerPhone || '',
      order.style,
      order.size,
      order.numberOfFaces,
      order.basePrice,
      order.discountAmount,
      order.finalPrice,
      order.status,
      order.paymentStatus,
      order.specialNotes || '',
      new Date(order.createdAt).toLocaleString(),
      new Date(order.updatedAt).toLocaleString()
    ]) || []

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error in orders export API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}