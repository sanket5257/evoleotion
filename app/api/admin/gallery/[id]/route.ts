import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/* ---------------------------------------------------
   Cloudinary (loaded ONLY when needed)
--------------------------------------------------- */

let cloudinaryInstance: any = null

async function getCloudinary() {
  if (!cloudinaryInstance) {
    const cloudinary = await import('cloudinary')

    cloudinaryInstance = cloudinary.v2
    cloudinaryInstance.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    })
  }

  return cloudinaryInstance
}

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

type RouteParams = {
  params: {
    id: string
  }
}

/* ---------------------------------------------------
   PUT → Update gallery image
--------------------------------------------------- */

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'Missing image ID' },
        { status: 400 }
      )
    }

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { title, description, style, tags, isActive } = body

    if (!title || !style) {
      return NextResponse.json(
        { error: 'Title and style are required' },
        { status: 400 }
      )
    }

    const updatedImage = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        style,
        tags: tags
          ? tags.split(',').map((tag: string) => tag.trim())
          : [],
        isActive: Boolean(isActive),
      },
    })

    return NextResponse.json(updatedImage)
  } catch (error: any) {
    console.error('PUT gallery error:', error)

    if (error.message?.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* ---------------------------------------------------
   PATCH → Toggle image active status
--------------------------------------------------- */

export async function PATCH(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'Missing image ID' },
        { status: 400 }
      )
    }

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const currentImage = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    })

    if (!currentImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    const updatedImage = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        isActive: !currentImage.isActive,
      },
    })

    return NextResponse.json(updatedImage)
  } catch (error: any) {
    console.error('PATCH gallery error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* ---------------------------------------------------
   DELETE → Remove image + Cloudinary
--------------------------------------------------- */

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'Missing image ID' },
        { status: 400 }
      )
    }

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    if (image.publicId) {
      try {
        const cloudinary = await getCloudinary()
        await cloudinary.uploader.destroy(image.publicId)
      } catch (err) {
        console.error('Cloudinary delete failed:', err)
      }
    }

    await prisma.galleryImage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE gallery error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
