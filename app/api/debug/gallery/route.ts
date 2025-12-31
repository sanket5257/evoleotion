import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      count: images.length,
      images: images.map(img => ({
        id: img.id,
        title: img.title,
        style: img.style,
        imageUrl: img.imageUrl,
        publicId: img.publicId,
        isActive: img.isActive,
        order: img.order,
        createdAt: img.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}