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

    const { id } = params

    // Get current offer
    const { data: currentOffer } = await supabaseServer
      .from('offers')
      .select('*')
      .eq('id', id)
      .single()

    if (!currentOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Toggle active status
    const { data: offer, error } = await supabaseServer
      .from('offers')
      .update({
        isActive: !currentOffer.isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling offer status:', error)
      return NextResponse.json({ error: 'Failed to toggle offer status' }, { status: 500 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling offer status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}