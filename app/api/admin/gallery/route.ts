import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { uploadToSupabase } from '@/lib/supabase'

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

    // Enhanced validation
    if (!file || !title?.trim() || !style?.trim()) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: { 
          hasFile: !!file, 
          hasTitle: !!title?.trim(), 
          hasStyle: !!style?.trim(),
          fileType: file?.type || 'none',
          fileSize: file?.size || 0
        }
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ]
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({ 
        error: 'Unsupported file format',
        details: `Received: ${file.type}. Supported: JPEG, PNG, WebP, GIF, BMP, TIFF`
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large',
        details: `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 10MB`
      }, { status: 400 })
    }

    // Check Supabase config
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Supabase configuration missing',
        details: 'Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
      }, { status: 500 })
    }

    let uploadResult
    try {
      // Upload to Supabase Storage
      uploadResult = await uploadToSupabase(file, 'gallery')
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Image upload failed',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown upload error'
      }, { status: 500 })
    }

    try {
      // Get the highest order number and increment
      const lastImage = await prisma.galleryImage.findFirst({
        orderBy: { order: 'desc' }
      })
      const nextOrder = (lastImage?.order || 0) + 1

      // Save to database
      const image = await prisma.galleryImage.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          imageUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          style: style.trim(),
          tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
          isActive,
          order: nextOrder
        }
      })

      return NextResponse.json({
        success: true,
        image,
        message: 'Image uploaded successfully'
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Try to delete the uploaded image from Supabase if database save fails
      try {
        const { deleteFromSupabase } = await import('@/lib/supabase')
        await deleteFromSupabase(uploadResult.public_id)
      } catch (cleanupError) {
        console.error('Failed to cleanup Supabase image:', cleanupError)
      }
      
      return NextResponse.json({ 
        error: 'Database save failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}