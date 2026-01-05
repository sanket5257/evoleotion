import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: { imageId: string }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = params

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Remove from favorites
    const deleted = await prisma.userFavorite.deleteMany({
      where: {
        userId: session.userId,
        imageId: imageId
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = params

    const favorite = await prisma.userFavorite.findUnique({
      where: {
        userId_imageId: {
          userId: session.userId,
          imageId: imageId
        }
      }
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}