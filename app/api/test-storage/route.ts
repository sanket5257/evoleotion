import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Testing Supabase Storage...')

    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json({
        status: 'error',
        error: 'Failed to list buckets',
        details: bucketsError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test 2: Check if 'images' bucket exists
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')

    // Test 3: Try to create bucket if it doesn't exist
    if (!imagesBucket) {
      const { data: createBucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (createError) {
        return NextResponse.json({
          status: 'bucket_creation_failed',
          error: 'Images bucket does not exist and could not be created',
          details: createError.message,
          buckets: buckets?.map(b => b.name) || [],
          instructions: [
            '1. Go to your Supabase dashboard',
            '2. Navigate to Storage',
            '3. Create a new bucket named "images"',
            '4. Make it public',
            '5. Set allowed file types to images'
          ],
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    }

    // Test 4: Try to list files in images bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('images')
      .list('gallery', { limit: 1 })

    return NextResponse.json({
      status: 'success',
      message: 'Supabase Storage is configured correctly',
      data: {
        buckets: buckets?.map(b => ({ name: b.name, public: b.public })) || [],
        imagesBucketExists: !!imagesBucket,
        canListFiles: !filesError,
        filesError: filesError?.message || null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Storage test error:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Storage test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}