import { NextResponse } from 'next/server'
import { supabaseAdmin, uploadToSupabase, deleteFromSupabase, listFilesInFolder } from '@/lib/supabase'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Only allow in development or with admin access
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    // Check if Supabase admin client is configured
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured. Please check environment variables.')
    }

    // Test Supabase Storage configuration
    const config = {
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    // Test storage bucket access
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`)
    }

    // Check if images bucket exists
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
    
    if (!imagesBucket) {
      throw new Error('Images bucket not found')
    }

    // Test listing files in a folder
    const testFiles = await listFilesInFolder('gallery')

    return NextResponse.json({
      success: true,
      config,
      storage_status: {
        buckets_accessible: true,
        images_bucket_exists: true,
        images_bucket_public: imagesBucket.public,
        test_files_count: testFiles.length
      },
      message: 'Supabase Storage is configured correctly'
    })
  } catch (error) {
    console.error('Supabase Storage test error:', error)
    return NextResponse.json({
      success: false,
      config: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Supabase Storage configuration failed'
    }, { status: 500 })
  }
}