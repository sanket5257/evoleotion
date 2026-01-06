import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    const { data: images, error } = await supabaseServer
      .from('gallery_images')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      count: images?.length || 0,
      images: (images || []).map(img => ({
        id: img.id,
        title: img.title,
        style: img.style,
        imageUrl: img.imageUrl,
        publicId: img.publicId,
        isActive: img.isActive,
        order: img.order,
        createdAt: img.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}