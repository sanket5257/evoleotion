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

    // Get current frame
    const currentFrame = await prisma.frame.findUnique({
      where: { id }
    })

    if (!currentFrame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // Toggle active status
    const frame = await prisma.frame.update({
      where: { id },
      data: {
        isActive: !currentFrame.isActive
      }
    })

    return NextResponse.json(frame)
  } catch (error) {
    console.error('Error toggling frame status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}