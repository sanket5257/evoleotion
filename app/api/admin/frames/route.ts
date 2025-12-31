import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Configure Cloudinary dynamically
const configureCloudinary = () => {
  const { v2: cloudinary } = require('cloudinary')
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  return cloudinary
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const frames = await prisma.frame.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(frames)
  } catch (error) {
    console.error('Error fetching frames:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const isActive = formData.get('isActive') === 'true'

    if (!file || !name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Configure Cloudinary
    const cloudinary = configureCloudinary()

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'frames',
          transformation: [
            { width: 400, height: 400, crop: 'fill', quality: 'auto' }
          ]
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    // Get the highest order number and increment
    const lastFrame = await prisma.frame.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = (lastFrame?.order || 0) + 1

    // Save to database
    const frame = await prisma.frame.create({
      data: {
        name,
        description: description || null,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        price: parseFloat(price),
        isActive,
        order: nextOrder
      }
    })

    return NextResponse.json(frame)
  } catch (error) {
    console.error('Error creating frame:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}