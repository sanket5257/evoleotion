import { NextRequest, NextResponse } from 'next/server'
import { requireAdminFromRequest } from '@/lib/admin-auth'
import { cleanupOrphanedFiles } from '@/lib/supabase-server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const adminResult = await requireAdminFromRequest(request)

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    if (adminResult instanceof NextResponse) {
      return adminResult // Return the unauthorized response
    }

    // Get all referenced file paths from database
    const referencedPaths: string[] = []

    // Get gallery image paths
    const { data: galleryImages } = await supabaseServer
      .from('gallery_images')
      .select('publicId')

    if (galleryImages) {
      referencedPaths.push(...galleryImages.map(img => img.publicId))
    }

    // Get order image paths
    const { data: orderImages } = await supabaseServer
      .from('order_images')
      .select('publicId')

    if (orderImages) {
      referencedPaths.push(...orderImages.map(img => img.publicId))
    }

    // Cleanup orphaned files
    const cleanupResult = await cleanupOrphanedFiles(referencedPaths)

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${cleanupResult.deletedCount} orphaned files.`,
      details: cleanupResult
    })
  } catch (error) {
    console.error('Storage cleanup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed'
    }, { status: 500 })
  }
}