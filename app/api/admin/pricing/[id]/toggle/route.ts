import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

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

    // Get current pricing
    const currentPricing = await prisma.pricing.findUnique({
      where: { id }
    })

    if (!currentPricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 })
    }

    // Toggle active status
    const pricing = await prisma.pricing.update({
      where: { id },
      data: {
        isActive: !currentPricing.isActive
      }
    })

    return NextResponse.json(pricing)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling pricing status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}