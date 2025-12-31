import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic' // 🔥 VERY IMPORTANT

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

type Params = {
  params: { id: string }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
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
        isActive
      }
    })

    return NextResponse.json(frame)
  } catch (error) {
    console.error('Error updating frame:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'ID missing' }, { status: 400 })
    }

    const frame = await prisma.frame.findUnique({
      where: { id }
    })

    if (!frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    if (frame.publicId) {
      await cloudinary.uploader.destroy(frame.publicId)
    }

    await prisma.frame.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting frame:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
