import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const pricing = await prisma.pricing.findMany({
      orderBy: [
        { style: 'asc' },
        { numberOfFaces: 'asc' },
        { size: 'asc' }
      ]
    })

    return NextResponse.json(pricing)
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
    const existingPricing = await prisma.pricing.findUnique({
      where: {
        style_size_numberOfFaces: {
          style,
          size,
          numberOfFaces: parseInt(numberOfFaces)
        }
      }
    })

    if (existingPricing) {
      return NextResponse.json({ error: 'Pricing rule already exists for this combination' }, { status: 400 })
    }

    const pricing = await prisma.pricing.create({
      data: {
        style,
        size,
        numberOfFaces: parseInt(numberOfFaces),
        basePrice: parseFloat(basePrice),
        isActive: isActive !== false
      }
    })

    return NextResponse.json(pricing)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}