import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { configureCloudinary } from '@/lib/cloudinary'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await requireAdmin()

    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionResult = await requireAdminFromRequest(request)
    if (sessionResult instanceof NextResponse) {
      return sessionResult // Return unauthorized response
    }

    const formData = await request.formData()
    
    const file = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const style = formData.get('style') as string
    const tags = formData.get('tags') as string
    const isActive = formData.get('isActive') === 'true'

    if (!file || !title || !style) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: { hasFile: !!file, title: !!title, style: !!style }
      }, { status: 400 })
    }

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Configure and use Cloudinary
    const cloudinary = configureCloudinary()
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'gallery',
          transformation: [
            { width: 800, height: 1000, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    }) as any

    // Get the highest order number and increment
    const lastImage = await prisma.galleryImage.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = (lastImage?.order || 0) + 1

    // Save to database
    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        style,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isActive,
        order: nextOrder
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}