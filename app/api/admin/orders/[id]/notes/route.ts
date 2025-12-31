import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    console.error('Error updating order notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}