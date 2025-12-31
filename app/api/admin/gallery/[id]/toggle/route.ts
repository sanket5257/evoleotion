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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling gallery image status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}