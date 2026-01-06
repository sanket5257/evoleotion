import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()


    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    const { id } = params
    const body = await request.json()
    const { adminNotes } = body

    const { data: order, error } = await supabaseServer
      .from('orders')
      .update({ 
        adminNotes,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        user:users(name, email),
        offer:offers(title),
        images:order_images(*)
      `)
      .single()

    if (error) {
      console.error('Error updating order notes:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update order notes' }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating order notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}