import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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
    console.error('Error toggling offer status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}