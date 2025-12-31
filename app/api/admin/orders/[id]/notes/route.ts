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
    const body = await request.json()
    const { adminNotes } = body

    const order = await prisma.order.update({
      where: { id },
      data: { adminNotes },
      include: {
        user: { select: { name: true, email: true } },
        offer: { select: { title: true } },
        images: true,
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating order notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}