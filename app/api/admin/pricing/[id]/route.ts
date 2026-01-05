import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const { id } = params
    const body = await request.json()
    const { style, size, numberOfFaces, basePrice, isActive } = body

    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .update({
        style,
        size,
        numberOfFaces: parseInt(numberOfFaces),
        basePrice: parseFloat(basePrice),
        isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating pricing:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Pricing not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 })
    }

    return NextResponse.json(pricing)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const { id } = params

    const { error } = await supabaseServer
      .from('pricing')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting pricing:', error)
      return NextResponse.json({ error: 'Failed to delete pricing' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}