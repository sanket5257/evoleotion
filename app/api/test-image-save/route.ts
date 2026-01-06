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

    // Check total orders
    const { count: orderCount, error: orderCountError } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (orderCountError) {
      return NextResponse.json({ 
        error: 'Failed to count orders', 
        details: orderCountError 
      }, { status: 500 })
    }

    // Check total order images
    const { count: imageCount, error: imageCountError } = await supabaseServer
      .from('order_images')
      .select('*', { count: 'exact', head: true })
    
    if (imageCountError) {
      return NextResponse.json({ 
        error: 'Failed to count images', 
        details: imageCountError 
      }, { status: 500 })
    }

    // Get recent orders with their images
    const { data: recentOrders, error: ordersError } = await supabaseServer
      .from('orders')
      .select(`
        id,
        orderNumber,
        customerName,
        createdAt,
        images:order_images(id, image_url, public_id)
      `)
      .order('createdAt', { ascending: false })
      .limit(5)
    
    if (ordersError) {
      return NextResponse.json({ 
        error: 'Failed to fetch recent orders', 
        details: ordersError 
      }, { status: 500 })
    }

    // Get sample order images directly
    const { data: sampleImages, error: imagesError } = await supabaseServer
      .from('order_images')
      .select('*')
      .limit(5)
    
    if (imagesError) {
      return NextResponse.json({ 
        error: 'Failed to fetch sample images', 
        details: imagesError 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalOrders: orderCount || 0,
        totalImages: imageCount || 0,
        ordersWithImages: recentOrders?.filter(order => order.images && order.images.length > 0).length || 0
      },
      recentOrders: recentOrders || [],
      sampleImages: sampleImages || []
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}