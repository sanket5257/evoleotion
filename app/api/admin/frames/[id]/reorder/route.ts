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
    const body = await request.json()
    const { direction } = body

    // Get current frame
    const currentFrame = await prisma.frame.findUnique({
      where: { id }
    })

    if (!currentFrame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    if (direction === 'up') {
      // Find the frame with the next lower order
      const previousFrame = await prisma.frame.findFirst({
        where: {
          order: {
            lt: currentFrame.order
          }
        },
        orderBy: { order: 'desc' }
      })

      if (previousFrame) {
        // Swap orders
        await prisma.$transaction([
          prisma.frame.update({
            where: { id: currentFrame.id },
            data: { order: previousFrame.order }
          }),
          prisma.frame.update({
            where: { id: previousFrame.id },
            data: { order: currentFrame.order }
          })
        ])
      }
    } else if (direction === 'down') {
      // Find the frame with the next higher order
      const nextFrame = await prisma.frame.findFirst({
        where: {
          order: {
            gt: currentFrame.order
          }
        },
        orderBy: { order: 'asc' }
      })

      if (nextFrame) {
        // Swap orders
        await prisma.$transaction([
          prisma.frame.update({
            where: { id: currentFrame.id },
            data: { order: nextFrame.order }
          }),
          prisma.frame.update({
            where: { id: nextFrame.id },
            data: { order: currentFrame.order }
          })
        ])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering frame:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}