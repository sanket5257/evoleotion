export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

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

    const { name, description, price, isActive } = await request.json()

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
    console.error('PUT frame error:', error)
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

    const frame = await prisma.frame.findUnique({ where: { id } })

    if (!frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // ✅ Configure Cloudinary ONLY at runtime
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    })

    if (frame.publicId) {
      await cloudinary.uploader.destroy(frame.publicId)
    }

    await prisma.frame.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE frame error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
