import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.userFavorite.findMany({
      where: { userId: session.userId },
      include: {
        image: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            style: true,
            tags: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(favorites.map(fav => fav.image))
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Check if image exists
    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.userFavorite.findUnique({
      where: {
        userId_imageId: {
          userId: session.userId,
          imageId: imageId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 })
    }

    // Add to favorites
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: session.userId,
        imageId: imageId
      }
    })

    return NextResponse.json({ success: true, favorite })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}