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

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { id } = params
    const body = await request.json()
    const {
      title,
      description,
      type,
      value,
      maxDiscount,
      couponCode,
      isActive,
      priority,
      startDate,
      endDate,
      minOrderValue,
      applicableStyles,
      firstOrderOnly
    } = body

    // Check if coupon code already exists (excluding current offer)
    if (couponCode) {
      const { data: existingOffer } = await supabaseServer
        .from('offers')
        .select('*')
        .eq('couponCode', couponCode)
        .neq('id', id)
        .single()

      if (existingOffer) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
      }
    }

    const { data: offer, error } = await supabaseServer
      .from('offers')
      .update({
        title,
        description: description || null,
        type,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        couponCode: couponCode || null,
        isActive,
        priority: parseInt(priority) || 0,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        applicableStyles: applicableStyles || [],
        firstOrderOnly: firstOrderOnly || false,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating offer:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    const { error } = await supabaseServer
      .from('offers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting offer:', error)
      return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}