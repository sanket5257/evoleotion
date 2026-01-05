import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'

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

    await requireAdmin()

    const { id } = params
    
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { title, description, style, tags, isActive } = body

    // Validate required fields
    if (!title || !style) {
      return NextResponse.json({ error: 'Title and style are required' }, { status: 400 })
    }

    const { data: image, error } = await supabaseServer
      .from('gallery_images')
      .update({
        title,
        description: description || null,
        style,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        isActive: Boolean(isActive),
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating gallery image:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error('Error updating gallery image:', error)
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

    await requireAdmin()

    const { id } = params

    // Find the current image to get the current isActive status
    const { data: currentImage } = await supabaseServer
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (!currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Toggle the isActive status
    const { data: updatedImage, error } = await supabaseServer
      .from('gallery_images')
      .update({
        isActive: !currentImage.isActive,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling gallery image status:', error)
      return NextResponse.json({ error: 'Failed to toggle image status' }, { status: 500 })
    }

    return NextResponse.json(updatedImage)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error toggling gallery image status:', error)
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

    await requireAdmin()

    const { id } = params

    // Get the image to delete from Supabase Storage
    const { data: image } = await supabaseServer
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single()

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from Supabase Storage if publicId exists
    if (image.publicId && supabase) {
      try {
        const { error: storageError } = await supabase
          .storage
          .from('gallery')
          .remove([image.publicId])
      } catch (supabaseError) {
        console.error('Error deleting from Supabase:', supabaseError)
        // Continue with database deletion even if Supabase fails
      }
    }

    // Delete from database
    const { error } = await supabaseServer
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting gallery image:', error)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting gallery image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
