import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    // Delete all gallery images with placeholder URLs
    const deletedImages = await prisma.galleryImage.deleteMany({
      where: {
        OR: [
          { imageUrl: { contains: 'placeholder' } },
          { imageUrl: { contains: 'via.placeholder.com' } },
          { publicId: { startsWith: 'sample_' } }
        ]
      }
    })

    return NextResponse.json({ 
      success: true, 
      deletedCount: deletedImages.count,
      message: `Deleted ${deletedImages.count} placeholder images`
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error cleaning up gallery:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}