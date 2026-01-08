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

    // Fetch all users with order counts
    const { data: users, error } = await supabaseServer
      .from('users')
      .select(`
        *,
        orders(id)
      `)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Convert to CSV format
    const csvHeaders = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Total Orders',
      'Created At',
      'Updated At'
    ]

    const csvRows = users?.map(user => [
      user.id,
      user.name || '',
      user.email,
      user.role,
      user.orders?.length || 0,
      new Date(user.createdAt).toLocaleString(),
      new Date(user.updatedAt).toLocaleString()
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
        'Content-Disposition': `attachment; filename="customers-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error in customers export API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}