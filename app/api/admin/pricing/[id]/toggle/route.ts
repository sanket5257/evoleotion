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

    // Get current pricing
    const { data: currentPricing } = await supabaseServer
      .from('pricing')
      .select('*')
      .eq('id', id)
      .single()

    if (!currentPricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 })
    }

    // Toggle active status
    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .update({
        isActive: !currentPricing.isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling pricing status:', error)
      return NextResponse.json({ error: 'Failed to toggle pricing status' }, { status: 500 })
    }

    return NextResponse.json(pricing)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling pricing status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}