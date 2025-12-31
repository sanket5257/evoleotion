import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params

    // Get current image
    const currentImage = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Toggle active status
    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        isActive: !currentImage.isActive
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error toggling gallery image status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}