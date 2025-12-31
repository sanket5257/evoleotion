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

    // Get current offer
    const currentOffer = await prisma.offer.findUnique({
      where: { id }
    })

    if (!currentOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    // Toggle active status
    const offer = await prisma.offer.update({
      where: { id },
      data: {
        isActive: !currentOffer.isActive
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling offer status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}