import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Delete all gallery images with placeholder URLs
    const { data: deletedImages, error } = await supabaseServer
      .from('gallery_images')
      .delete()
      .or('imageUrl.ilike.%placeholder%,imageUrl.ilike.%via.placeholder.com%,publicId.ilike.sample_%')
      .select()

    if (error) {
      console.error('Error deleting placeholder images:', error)
      return NextResponse.json({ 
        error: 'Failed to cleanup gallery',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      deletedCount: deletedImages?.length || 0,
      message: `Deleted ${deletedImages?.length || 0} placeholder images`
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error cleaning up gallery:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}