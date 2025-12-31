import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const offers = await prisma.offer.findMany({
      orderBy: { priority: 'desc' }
    })

    return NextResponse.json(offers)
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
      const existingOffer = await prisma.offer.findUnique({
        where: { couponCode }
      })

      if (existingOffer) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
      }
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description: description || null,
        type,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        couponCode: couponCode || null,
        isActive: isActive !== false,
        priority: parseInt(priority) || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        applicableStyles: applicableStyles || [],
        firstOrderOnly: firstOrderOnly || false
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}