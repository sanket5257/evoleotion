import { NextRequest, NextResponse } from 'next/server'
import { uploadToSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing image upload...')

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({
        status: 'error',
        error: 'No file provided',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Test upload
    const uploadResult = await uploadToSupabase(file, 'gallery')

    console.log('Upload successful:', uploadResult)

    return NextResponse.json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: uploadResult,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Upload test error:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Upload test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}