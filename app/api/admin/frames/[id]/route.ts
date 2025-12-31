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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: 'ID missing' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, price, isActive } = body

    const frame = await prisma.frame.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: Number(price),
        isActive: Boolean(isActive)
      }
    })

    return NextResponse.json(frame)
  } catch (error) {
    console.error('PUT frame error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: 'ID missing' }, { status: 400 })
    }

    const frame = await prisma.frame.findUnique({ where: { id } })

    if (!frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // Delete from Cloudinary if publicId exists
    if (frame.publicId) {
      try {
        const cloudinary = configureCloudinary()
        await cloudinary.uploader.destroy(frame.publicId)
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    await prisma.frame.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE frame error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
