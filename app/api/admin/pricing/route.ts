import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .select('*')
      .order('style', { ascending: true })
      .order('numberOfFaces', { ascending: true })
      .order('size', { ascending: true })

    if (error) {
      console.error('Error fetching pricing:', error)
      return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 })
    }

    return NextResponse.json(pricing || [])
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { style, size, numberOfFaces, basePrice, isActive } = body

    if (!style || !size || !numberOfFaces || !basePrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if pricing rule already exists
    const { data: existingPricing } = await supabaseServer
      .from('pricing')
      .select('*')
      .eq('style', style)
      .eq('size', size)
      .eq('numberOfFaces', parseInt(numberOfFaces))
      .single()

    if (existingPricing) {
      return NextResponse.json({ error: 'Pricing rule already exists for this combination' }, { status: 400 })
    }

    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .insert({
        id: crypto.randomUUID(),
        style,
        size,
        numberOfFaces: parseInt(numberOfFaces),
        basePrice: parseFloat(basePrice),
        isActive: isActive !== false,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating pricing:', error)
      return NextResponse.json({ error: 'Failed to create pricing' }, { status: 500 })
    }

    return NextResponse.json(pricing)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}