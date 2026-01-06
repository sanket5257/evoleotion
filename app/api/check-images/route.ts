import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Simple count of images
    const { count, error } = await supabaseServer
      .from('order_images')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get a few sample images
    const { data: samples, error: sampleError } = await supabaseServer
      .from('order_images')
      .select('id, order_id, image_url')
      .limit(3)
    
    return NextResponse.json({
      totalImages: count || 0,
      samples: samples || [],
      message: count === 0 ? 'No images found - customers may not be uploading images or there is an issue with image saving' : `Found ${count} images`
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}