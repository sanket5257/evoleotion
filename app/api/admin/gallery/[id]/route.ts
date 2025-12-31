import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { configureCloudinary } from '@/lib/cloudinary'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Type for route parameters
interface RouteParams {
  params: { id: string }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validate params
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { title, description, style, tags, isActive } = body

    // Validate required fields
    if (!title || !style) {
      return NextResponse.json({ error: 'Title and style are required' }, { status: 400 })
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        title,
        description: description || null,
        style,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        isActive: Boolean(isActive)
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error updating gallery image:', error)
    
    // Handle Prisma not found error
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validate params
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Find the current image to get the current isActive status
    const currentImage = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Toggle the isActive status
    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: {
        isActive: !currentImage.isActive
      }
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error toggling gallery image status:', error)
    
    // Handle Prisma not found error
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validate params
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get the image to delete from Cloudinary
    const image = await prisma.galleryImage.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Configure Cloudinary only when needed and if publicId exists
    if (image.publicId) {
      try {
        const cloudinary = configureCloudinary()
        await cloudinary.uploader.destroy(image.publicId)
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    
    // Handle Prisma not found error
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
