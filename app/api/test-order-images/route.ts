import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Test 1: Check orders with images
    const { data: ordersWithImages, error: ordersError } = await supabaseServer
      .from('orders')
      .select(`
        id,
        orderNumber,
        customerName,
        images:order_images(*)
      `)
      .limit(5)
    
    if (ordersError) {
      return NextResponse.json({ 
        error: 'Failed to fetch orders', 
        details: ordersError 
      }, { status: 500 })
    }

    // Test 2: Check order_images table directly
    const { data: allImages, error: imagesError } = await supabaseServer
      .from('order_images')
      .select('*')
      .limit(10)
    
    if (imagesError) {
      return NextResponse.json({ 
        error: 'Failed to fetch order images', 
        details: imagesError 
      }, { status: 500 })
    }

    // Test 3: Count total images
    const { count: imageCount, error: countError } = await supabaseServer
      .from('order_images')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      return NextResponse.json({ 
        error: 'Failed to count images', 
        details: countError 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        ordersWithImages: ordersWithImages || [],
        allImages: allImages || [],
        totalImageCount: imageCount || 0,
        ordersWithImagesCount: ordersWithImages?.filter(order => order.images.length > 0).length || 0
      }
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}