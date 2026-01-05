import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const { data: offers, error } = await supabaseServer
      .from('offers')
      .select('*')
      .order('priority', { ascending: false })

    if (error) {
      console.error('Error fetching offers:', error)
      return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
    }

    return NextResponse.json(offers || [])
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching offers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

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

    if (!title || !type || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if coupon code already exists
    if (couponCode) {
      const { data: existingOffer } = await supabaseServer
        .from('offers')
        .select('*')
        .eq('couponCode', couponCode)
        .single()

      if (existingOffer) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
      }
    }

    const { data: offer, error } = await supabaseServer
      .from('offers')
      .insert({
        id: crypto.randomUUID(),
        title,
        description: description || null,
        type,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        couponCode: couponCode || null,
        isActive: isActive !== false,
        priority: parseInt(priority) || 0,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        applicableStyles: applicableStyles || [],
        firstOrderOnly: firstOrderOnly || false,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating offer:', error)
      return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}