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

    // Test listing files in different folders
    const galleryFiles = await listFilesInFolder('gallery')
    const orderFiles = await listFilesInFolder('orders')

    return NextResponse.json({
      success: true,
      config,
      storage_status: {
        buckets_accessible: true,
        images_bucket_exists: true,
        images_bucket_public: imagesBucket.public,
        gallery_files_count: galleryFiles.length,
        order_files_count: orderFiles.length,
        total_buckets: buckets?.length || 0
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

// Test file upload functionality
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Test upload
    const uploadResult = await uploadToSupabase(file, 'test')

    // Test delete (cleanup)
    await deleteFromSupabase(uploadResult.public_id)

    return NextResponse.json({
      success: true,
      message: 'Upload and delete test completed successfully',
      test_result: {
        upload_successful: true,
        delete_successful: true,
        file_path: uploadResult.public_id,
        file_url: uploadResult.secure_url
      }
    })
  } catch (error) {
    console.error('Supabase Storage upload test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Upload test failed'
    }, { status: 500 })
  }
}